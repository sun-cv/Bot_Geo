/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const cleanLogs = require('../../tasks/tasks/database/cleanLogs/cleanLogs');


async function testCommand(interaction = new CommandInteraction()) {

	cleanLogs();

}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
	moderator: true,
	maintenance: false,
};
