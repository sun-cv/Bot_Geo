const { CommandInteraction, SlashCommandBuilder } = require('discord.js');
const { addAccountCommand } = require('./subcommands/accounts/addAccount');
const { editAccountCommand } = require('./subcommands/accounts/editAccount');
const { removeAccountCommand } = require('./subcommands/accounts/removeAccount');
const { listAccountsCommand } = require('./subcommands/accounts/listAccounts');
const { optionsAccountCommand } = require('./subcommands/accounts/optionsAccount');
const { updateAutoCompleteUserAccounts } = require('../autocomplete/userAutoComplete');


async function accountCommand(interaction = new CommandInteraction()) {

	try {

		const subcommands = {
			add: addAccountCommand,
			edit: editAccountCommand,
			remove: removeAccountCommand,
			list: listAccountsCommand,
			options: optionsAccountCommand,
		};

		const subcommandName = interaction.options.getSubcommand(false);

		const handler = subcommands[subcommandName];

		try {
			if (handler) {
				await handler(interaction);
			}
			await updateAutoCompleteUserAccounts();
		}
		catch (error) {
			console.log(error);
		}
	}
	catch (error) {
		console.log(error);
	}

}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('account')
		.setDescription('Manage your accounts')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add an account')
				.addStringOption(option =>
					option.setName('name')
						.setDescription('Account to register')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('edit an account')
				.addStringOption(option =>
					option.setName('account')
						.setDescription('Account to edit')
						.setRequired(true)
						.setAutocomplete(true))
				.addStringOption(option =>
					option.setName('name')
						.setDescription('Change the selected accounts name')
						.setRequired(false))
				.addBooleanOption(option =>
					option.setName('default')
						.setDescription('Designate the selected account as your default Mercy account')
						.setRequired(false),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove an account')
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

						)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List your accounts'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('options')
				.setDescription('Select your accounts mercy options')
				.addStringOption(option =>
					option.setName('account')
						.setDescription('Account to edit')
						.setRequired(true)
						.setAutocomplete(true))
				.addBooleanOption(option =>
					option.setName('background')
						.setDescription('Select true to change your mercy background options')
						.setRequired(true),
				)),
	execute: accountCommand,
	command: true,
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: true,
	trace: true,
};