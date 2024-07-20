const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { newTimestamp } = require('./Ιndex/utilities');
const { TaskManager } = require('./Ιndex/managers');
const { loadComponents, loadEvents } = require('./Ιndex/loaders');
const { getAutoCompleteUserAccounts } = require('./commands/autocomplete/userAutoComplete');

const timestamp = newTimestamp();

/**
 * Main level error catcher - rework needed
 */

process.on('unhandledRejection', (reason, promise) => {
	console.error(`${timestamp} Unhandled Rejection at:`, promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
	console.error(`${timestamp} Uncaught Exception:`, error);
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});


// Managers
client.on('ready', () => {
	client.taskManager = new TaskManager(client);
	console.log('Successfully loaded Managers');
	getAutoCompleteUserAccounts();
});

// Collections
client.buttons = new Collection();
client.commands = new Collection();
client.menus = new Collection();

// Loaders
loadComponents(client);
loadEvents(client);

// Autocomplete

client.login(token);

module.exports = {
	client,
};
