/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

async function testCommand(interaction = new CommandInteraction()) {
	try {
		// nothing
	}
	catch (error) {
		console.error(error);
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
	deferReply: false,
	moderator: true,
	maintenance: false,
	ephemeral: true,
};
