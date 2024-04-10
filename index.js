const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { loadCommands, loadButtons, loadEvents, TaskManager,	getAutoCompleteUserAccounts, messageErrorHandling, handleMessage, delay, newTimestamp } = require('./Ιndex');

const timestamp = newTimestamp();

/**
 * Main level error catcher - rework needed
 */

process.on('unhandledRejection', (reason, promise) => {
	console.error(`${timestamp}Unhandled Rejection at:`, promise, 'reason:', reason);
	// Application specific logging, throwing an error, or other logic here
});


process.on('uncaughtException', (error) => {
	console.error(`${timestamp} Uncaught Exception:`, error);
	// Application specific logging, throwing an error, or other logic here
});

// Classes
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.taskManager = new TaskManager(client);

// Collections
client.buttons = new Collection();
client.commands = new Collection();

// Constants

const dirPath = {
	commands: path.join(__dirname, 'commands'),
	events: path.join(__dirname, 'events'),
	buttons: path.join(__dirname, 'buttons'),
};

/**
 * Loaders
 */
async function load() {
	loadCommands(client, dirPath.commands);

	loadEvents(client, dirPath.events);

	loadButtons(client, dirPath.buttons);
}

load();

// Message Listener
client.on('messageCreate', (message) => messageErrorHandling(handleMessage, message));

// Task Manager
client.taskManager.loadTasks();

// Autocomplete
getAutoCompleteUserAccounts();


client.login(token);
