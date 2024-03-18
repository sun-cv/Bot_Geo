const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
// Database
const { db, transaction, beginTransaction, commitTransaction, rollbackTransaction } = require('../../../database/utils/databaseIndex');
// Logging
const { logUserCommand, commandLog } = require('../../../utils/userLogging/UserCommandLogging/LogUserCommand');
// Mercy utils
const { getUserAccounts, initializeMercy, insertUserTracker, insertUserAccount, getUserAccountsTotal } = require('../utils/functionIndex');
// General utils
const { addRoleToUser } = require('../../../utils/functions/addRoleToUser');
// Autocomplete
const { getAutoCompleteUserAccounts, updateAutoCompleteUserAccounts, autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');
// Interaction constants
const { getUserId, getUsername } = require('../../../utils/functions/interactionIndex');
const { updateAccountLastActive } = require('../../../utils/userLogging/updateAccountLastActive');


async function registerCommand(interaction = new CommandInteraction()) {

	try {

		/**
 		* Global Constants
 		*/

		// User constants
		const userId = getUserId(interaction);
		const username = getUsername(interaction);

		// Alt Limit
		const altLimit = 5;

		/**
		* Command Initialization
		*/

		// Ensure Mercy tracker exists, if not - Add
		await initializeMercy(interaction);

		// Pull user accounts info
		const userAccounts = await getUserAccounts(userId);
		const userTotal = await	getUserAccountsTotal(userId);

		/**
		* Register Command
		*/

		// Handle sub commands: Add, List, Delete
		if (interaction.options.getSubcommand(false)) {
			switch (interaction.options.getSubcommand()) {

			/**
			* Add command
			*/

			case 'new': {
				try {
					// Get input
					const accountToAdd = interaction.options.getString('account');

					// Confirm account exists - Deny
					if (userAccounts.some(user => user.account === accountToAdd)) {

						interaction.reply({ content: `Account **${accountToAdd}** already exists`, ephemeral: true });

						return;
					}

					// Confirm account limit - Deny
					else if (userTotal.accounts >= altLimit) {

						interaction.reply({ content: 'You\'ve reached the maximum number of 5 alts', ephemeral:true });

						return;
					}

					// Insert new user account
					else {
						// Update Mercy Accounts
						await insertUserAccount(userId, username, accountToAdd);
						// Update Mercy Tracker
						await insertUserTracker(userId, username, accountToAdd);
						// Update last active - Has transaction
						await updateAccountLastActive(userId, accountToAdd);

						interaction.reply({ content: `Account **${accountToAdd}** was successfully registered.`, ephemeral: true });

						commandLog.status = 'success';
					}
				}
				catch (error) {
					console.log('Error detected in add account.');
					throw error;
				}

				break;
			}

			/**
			* List command
			*/

			case 'list': {
				try {

					// Return all current user accounts
					let listAccounts = '';

					// Confirm array
					if (Array.isArray(userAccounts)) {
					// Create output
						userAccounts.forEach((row) => {
							listAccounts += `- **${row.account}**\n`;
						});
					}

					await interaction.reply({ content: `You have registered the following accounts:\n${listAccounts}`, ephemeral: true });

					commandLog.status = 'success';

				}
				catch (error) {
					console.log('Error detected in list account.');
					throw error;
				}

				break;
			}

			/**
			*  Remove command
			*/

			case 'remove': {
				try {
					// WRITES begin transaction
					await beginTransaction();

					// Pull user account input
					const accountToDelete = interaction.options.getString('account');

					// Pull user confirmation
					const confirmationString = interaction.options.getString('confirm');
					const confirmation = confirmationString === 'true' ? true : false;

					// If cancel - return
					if (!confirmation) {

						interaction.reply({ content: 'Account removal canceled', ephemeral: true });

						// Rollback
						await rollbackTransaction();
						commandLog.status = 'cancel';
						return;
					}

					// Check account exists
					else if (userAccounts.some(user => user.account === accountToDelete)) {

						// Check account is main - Deny
						if (confirmation && accountToDelete === 'main') {
							// Rollback
							await rollbackTransaction();
							interaction.reply({ content: 'You cannot delete your main account', ephemeral: true });
							return;
						}
						// And user confirms - Delete
						else if (confirmation && accountToDelete !== 'main') {

							// Delete all account data
							await db.run('DELETE FROM mercy_tracker WHERE user_id = ? AND account = ?', [userId, accountToDelete]);
							await db.run('DELETE FROM mercy_accounts WHERE user_id = ? AND account = ?', [userId, accountToDelete]);

							// Update user account number
							await db.run('UPDATE user SET accounts = accounts - 1 WHERE user_id = ?', userId);
							// Commit
							await commitTransaction();

							interaction.reply({ content: `account ${accountToDelete} has been removed succesfully.`, ephemeral: true });
							// Update auto complete object
							await updateAutoCompleteUserAccounts();
							// Log Status
							commandLog.status = 'success';
							return;
						}
						// Else - Deny
						else {
							// Rollback
							await rollbackTransaction();

							interaction.reply({ content: `an error occured removing ${accountToDelete}.`, ephemeral: true });
							// Log Status
							commandLog.status = 'failed';
							return;
						}
					}
					// If account does not exist - Deny
					else {
						// Rollback
						await rollbackTransaction();

						interaction.reply({ content: `${accountToDelete} was not found.\n\nCheck /register list to confirm account details.`, ephemeral: true });
						// Log Status
						commandLog.status = 'failed';
					}
					break;
				}
				catch (error) {
					if (transaction.status) {
						// Rollback
						await rollbackTransaction();
					}
					throw error;
				}
			}
			}

		}
	}
	catch (error) {
		if (transaction.status) {
			// Rollback
			await rollbackTransaction();
		}
		console.log('Error detected in Mercy - Register command');

		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;

		throw error;
	}
	finally {
		// Add mercy role to user
		addRoleToUser(interaction, 'Mercy');
		// Update autocomplete
		await getAutoCompleteUserAccounts();
		// Logging
		commandLog.category = 'Mercy';
		commandLog.output = 'none';
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your accounts')
		.addSubcommand(subcommand =>
			subcommand
				.setName('new')
				.setDescription('Add an account')
				.addStringOption(option =>
					option.setName('account')
						.setDescription('Account to register')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List your registered accounts'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove account')
				.addStringOption(option =>
					option.setName('account')
						.setDescription('Account to remove')
						.setRequired(true)
						.setAutocomplete(true))
				.addStringOption(option =>
					option.setName('confirm')
						.setDescription('confirm removal - this cannot be undone')
						.setRequired(true)
						.addChoices(
							{ name: 'cancel', value: 'false' },
							{ name: 'confirm', value: 'true' },

						))),
	// Autocomplete interaction handler
	async autocomplete(interaction) {
		const userId = getUserId(interaction);
		const focusedValue = interaction.options.getFocused();
		const choices = autocompleteUserAccounts[userId];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	execute: registerCommand,
	command: true,
	maintenance: false,
};