const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { db } = require('../../../database/utils/databaseIndex');
const { updateAccountLastActive, getUserId, sendFollowUpDelete } = require('../../../utils/index');
const { getUserAccounts, initializeMercy, insertUserTracker, insertUserAccount, getUserAccountsTotal } = require('../utils/functionIndex');
const { getAutoCompleteUserAccounts, updateAutoCompleteUserAccounts, autocompleteUserAccounts } = require('../utils/functions/userAutoComplete');


async function registerCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'register', category: 'mercy tracker', role: 'Mercy' });

	const userId = log.member.id;
	const username = log.member.name;

	const altLimit = 5;


	try {

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

						interaction.followUp({ content: `Account **${accountToAdd}** already exists`, ephemeral: true });
						log.returnCommand('denied', 'account already exists'); return;
					}

					// Confirm account limit - Deny
					else if (userTotal.accounts >= altLimit) {

						interaction.followUp({ content: 'You\'ve reached the maximum number of 5 alts', ephemeral:true });
						log.returnCommand('denied', 'reached alt limit'); return;
					}

					else {
						// Update Mercy Accounts
						await insertUserAccount(userId, username, accountToAdd);
						// Update Mercy Tracker
						await insertUserTracker(userId, username, accountToAdd);
						// Update last active
						await updateAccountLastActive(userId, accountToAdd);

						interaction.followUp({ content: `Account **${accountToAdd}** was successfully registered.`, ephemeral: true });
						log.finalizeCommand(); return;
					}
				}
				catch (error) {
					log.errorHandling(error);
				}
				break;
			}

			/**
			* List command
			*/

			case 'list': {
				try {

					let listAccounts = '';

					// Create output
					if (Array.isArray(userAccounts)) {
						userAccounts.forEach((row) => {
							listAccounts += `- **${row.account}**\n`;
						});
					}

					interaction.followUp({ content: `You have registered the following accounts:\n${listAccounts}`, ephemeral: true });
					log.finalizeCommand(); return;
				}
				catch (error) {
					log.errorHandling(error);
				}
				break;
			}

			/**
			*  Remove command
			*/

			case 'remove': {
				try {

					const accountToDelete = interaction.options.getString('account');
					const confirmation = interaction.options.getString('confirm') === 'true';

					// If cancel - return
					if (!confirmation) {

						interaction.followUp({ content: 'Account removal canceled', ephemeral: true });
						log.returnCommand('denied', 'did not confirm deletion');
					}

					// Check account exists
					else if (userAccounts.some(user => user.account === accountToDelete)) {

						// Check account is main - Deny
						if (confirmation && accountToDelete === 'main') {

							interaction.followUp({ content: 'You cannot delete your main account', ephemeral: true });
							log.returnCommand('denied', 'cannot delete main account');
						}
						// And user confirms - Delete
						else if (confirmation && accountToDelete !== 'main') {
							try {
							// Delete all account data
								await db.run('DELETE FROM mercy_tracker WHERE user_id = ? AND account = ?', [userId, accountToDelete]);
								await db.run('DELETE FROM mercy_accounts WHERE user_id = ? AND account = ?', [userId, accountToDelete]);

								// Update user account number
								await db.run('UPDATE member SET accounts = accounts - 1 WHERE user_id = ?', userId);

								interaction.followUp({ content: `account ${accountToDelete} has been removed succesfully.`, ephemeral: true });
								// Update auto complete object
								await updateAutoCompleteUserAccounts();
								log.finalizeCommand();
							}
							catch (error) {
								log.errorHandling(error);
							}
						}
					}
					break;
				}
				catch (error) {
					log.errorHandling(error);
				}
			}
			}
		}
	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		getAutoCompleteUserAccounts();
		log.finalizeCommand();
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
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
};