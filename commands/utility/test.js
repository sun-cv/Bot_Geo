/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { lastExecutionTime } = require('../../tasks/timeKeeping/lastExecutionTime');
const { isModerator } = require('../../utils/functions/isModerator');
const assignGoldenKappa = require('../../tasks/tasks/community/goldenKappa/goldenKappa');
const cleanLogs = require('../../tasks/tasks/database/cleanLogs/cleanLogs');


async function testCommand(interaction = new CommandInteraction()) {

	// Check if the user has the "Moderator" role
	if (!(await isModerator(interaction))) {
		interaction.reply({ content : '<:GeoNo:1197290091203280906>You do not have permission to use this command.', ephemeral : true });
		console.log(`${interaction.user.username} used test lol`);
		return;
	}

	cleanLogs();

}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
};
