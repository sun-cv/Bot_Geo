const { SlashCommandBuilder, CommandInteraction } = require('discord.js');





async function taskMaster(interaction = new CommandInteraction(), log) {




/**
 * 
 * start interaction
 * 
 * embed,
 * 
 * modal field input
 * 
 * 
 */










}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('task-master')
		.setDescription('create and manage tasks')
		.addStringOption(option =>
			option.setName('queue')
				.setDescription('cycle, check, clear')
				.setRequired(false)
				.addChoices(
					{ name: 'cycle', value: 'cycle' },
					{ name: 'check', value: 'check' },
					{ name: 'clear', value: 'clear' },
				)),

	execute: taskMaster,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};