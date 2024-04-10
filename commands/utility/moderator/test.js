/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { autocompleteUserAccounts } = require('../../mercy/utils/functions/userAutoComplete');


async function testCommand(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'test', role: 'Mercy', category: 'utility' }); let output;

	try {

		output = 'failed, test';
		throw new Error('sibbiq');

	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand(output);
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};

