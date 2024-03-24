const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const fs = require('fs').promises;
const { db } = require('../../../database/utils/databaseIndex');
const { logUserCommand, commandLog } = require('../../../utils/index');


const DEBUG = false;

async function throwErrorCommand(interaction = new CommandInteraction()) {

	// Get user input
	const errorType = interaction.options.getString('type');

	try {
		// Throw error
		switch (errorType) {
		case 'TypeError':
			throw new TypeError('This is a TypeError');
		case 'RangeError':
			throw new RangeError('This is a RangeError');
		case 'ReferenceError':
			throw new ReferenceError('This is a ReferenceError');
		case 'SyntaxError':
			throw new SyntaxError('This is a SyntaxError');
		case 'URIError':
			throw new URIError('This is a URIError');
		case 'EvalError':
			throw new EvalError('This is an EvalError');
		case 'DatabaseError':
			await db.get('SELECT * FROM non_existent_table');
			break;
		case 'FileSystemError':
			await fs.readFile('/path/to/non/existent/file');
			break;
		case 'APIError':
			break;
		default:
			throw new Error('This is a generic Error');
		}
	}
	catch (error) {

		await interaction.editReply(`Threw a ${errorType}. Check the logs to see if it was handled correctly.`);

		// If debug log
		if (DEBUG) {
			console.error('Error details:', error);
		}
		commandLog.status = 'failed';
		commandLog.error = error;
		console.error('Error detected in throw error');
		throw error;
	}

	finally {
		commandLog.category = 'Util';
		logUserCommand(interaction, commandLog);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('throwerror')
		.setDescription('Throws an error for testing error handling.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Type of error to throw')
				.setRequired(true)
				.addChoices(
					{ name: 'TypeError', value: 'TypeError' },
					{ name: 'RangeError', value: 'RangeError' },
					{ name: 'ReferenceError', value: 'ReferenceError' },
					{ name: 'SyntaxError', value: 'SyntaxError' },
					{ name: 'URIError', value: 'URIError' },
					{ name: 'EvalError', value: 'EvalError' },
					{ name: 'DatabaseError', value: 'DatabaseError' },
					{ name: 'FileSystemError', value: 'FileSystemError' },
					{ name: 'APIError', value: 'APIError' },
					{ name: 'Generic Error', value: 'GenericError' },
				)),
	execute: throwErrorCommand,
	command: true,
	deferReply: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
};

