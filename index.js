const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { getAutoCompleteUserAccounts } = require('./commands/mercy/utils/functions/userAutoComplete');
const { handleMessage } = require('./events/messageHandler');
const { messageErrorHandling } = require('./utils/errorHandling/messageErrorHandling');
const { TaskManager } = require('./tasks/taskManager');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
});

client.buttons = new Collection();
/**
 * Main level error catcher - rework needed
 */

const logTimestamp = new Date();

process.on('unhandledRejection', (reason, promise) => {
	console.error(`${logTimestamp}Unhandled Rejection at:`, promise, 'reason:', reason);
	// Application specific logging, throwing an error, or other logic here
});


process.on('uncaughtException', (error) => {
	console.error(`${logTimestamp} Uncaught Exception:`, error);
	// Application specific logging, throwing an error, or other logic here
});

/**
 * Command Loader
 */

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');

function loadCommands(dirPath) {
	const filesAndFolders = fs.readdirSync(dirPath);

	for (const fileOrFolder of filesAndFolders) {
		const fullPath = path.join(dirPath, fileOrFolder);

		if (fs.lstatSync(fullPath).isDirectory()) {
			// Recursively load commands in subfolders
			loadCommands(fullPath);
		}
		else if (fileOrFolder.endsWith('.js')) {
			const command = require(fullPath);
			if ('command' in command && command.command && 'data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			}
			else if ('command' in command && command.command) {
				console.log(`[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

loadCommands(foldersPath);

/**
 * Event Loader
 */

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

/**
 *  Button Loader
 */

function loadButtons(clientIn, dirPath) {

	const items = fs. readdirSync(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			loadButtons(clientIn, itemPath);
		}
		else if (item.endsWith('js')) {
			const buttons = require(itemPath);
			if (Array.isArray(buttons)) {
				for (const button of buttons) {
					client.buttons.set(button.customId, button);
				}
			}
			else {
				client.buttons.set(buttons.customId, buttons);
			}
		}
	}
}


const buttonsPath = path.join(__dirname, 'buttons');
loadButtons(client, buttonsPath);

/**
 * Message Listener
 */

client.on('messageCreate', (message) => messageErrorHandling(handleMessage, message));

/**
 * Task Manager
 */

const taskManager = new TaskManager(client);
setTimeout(() => {
	taskManager.loadTasks(client);
}, 1000);

/**
 * Autocomplete
 */

getAutoCompleteUserAccounts();

/**
 * Cache load
 */
client.guilds.cache.forEach(async (guild) => {
	await guild.members.fetch();
	console.log(`Fetched ${guild.members.size} members for guild: ${guild.name}`);
});


client.login(token);
