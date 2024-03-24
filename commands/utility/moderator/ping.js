const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../utils/index');

let output;

async function pingCommand(interaction = new CommandInteraction()) {

	try {

		// Check if user has the required roles
		const allowedRoles = ['Clan Officer', 'Clan Deputy'];
		const userRoles = interaction.member.roles.cache;
		const hasRequiredRole = allowedRoles.some(roleName => userRoles.some(role => role.name === roleName));

		// Check if command is used in the correct category
		const allowedCategory = 'ColredPlays Clans';
		const commandCategory = interaction.channel.parent?.name;
		const isCorrectCategory = commandCategory === allowedCategory;

		// Check if the specified role exists
		const pingedRole = interaction.options.getRole('role');
		const validRoleNames = ['CPR1', 'UltimateSunKnights', 'Cold Red Sun', 'Deep Dwarf Squats', 'CPR5', 'test'];
		const isValidRole = validRoleNames.includes(pingedRole.name);

		// Output
		const message = interaction.options.getString('message');

		if (hasRequiredRole && isCorrectCategory && isValidRole) {

			interaction.editReply({ content: `${pingedRole} ${message}`, allowedMentions: { roles: [pingedRole.id] }, fetchReply: true });

			commandLog.status = 'Success';
			return;

		}
		else {
			let errorMessage = '';
			if (!hasRequiredRole) {
				errorMessage += '<:GeoNo:1197290091203280906>You do not have permission to use this command.\n';
			}
			else {
				if (!isCorrectCategory) {
					errorMessage += 'This command can only be used in the Clans Category.\n';
				}
				if (!isValidRole) {
					errorMessage += 'The specified role is not valid.\n';
				}
			}

			// If any condition fails, send the error message
			if (errorMessage) {
				interaction.editReply({ content: errorMessage, ephemeral: true });
			}

			output = `${message}`;
			commandLog.status = 'denied';

			return;
		}
	}
	catch (error) {
		console.log('Error detected in Mercy - Mercy command');

		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;

		throw error;
	}
	finally {
		// Logging
		commandLog.category = 'Utility';
		commandLog.output = output;
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping a role')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('The role to ping')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message to send')
				.setRequired(true)),
	execute: pingCommand,
	command: true,
	deferReply: true,
	moderator: false,
	maintenance: false,
	ephemeral: false,
};