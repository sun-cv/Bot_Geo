const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const subFolderPath = path.join(foldersPath, folder);
	const items = fs.readdirSync(subFolderPath);

	for (const item of items) {
		const itemPath = path.join(subFolderPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			const subItems = fs.readdirSync(itemPath);

			for (const subItem of subItems) {
				const subItemPath = path.join(itemPath, subItem);
				const subStats = fs.statSync(subItemPath);

				if (subStats.isDirectory()) {
					const commandFiles = fs.readdirSync(subItemPath).filter(file => file.endsWith('.js'));

					for (const file of commandFiles) {
						const filePath = path.join(subItemPath, file);
						const command = require(filePath);
						if (command.ignoreLoading) {
							continue;
						}
						if (command.data instanceof SlashCommandBuilder && typeof command.execute === 'function') {
							commands.push(command.data.toJSON());
						}
						else {
							console.log(`[WARNING] The file at ${filePath} is not a valid command file.`);
						}
					}
				}
				else if (subItem.endsWith('.js')) {
					const command = require(subItemPath);
					if (command.ignoreLoading) {
						continue;
					}
					if (command.data instanceof SlashCommandBuilder && typeof command.execute === 'function') {
						commands.push(command.data.toJSON());
					}
					else {
						console.log(`[WARNING] The file at ${subItemPath} is not a valid command file.`);
					}
				}
			}
		}
		else if (item.endsWith('.js')) {
			const command = require(itemPath);
			if (command.ignoreLoading) {
				continue;
			}
			if (command.data instanceof SlashCommandBuilder && typeof command.execute === 'function') {
				commands.push(command.data.toJSON());
			}
			else {
				console.log(`[WARNING] The file at ${itemPath} is not a valid command file.`);
			}
		}
	}
}


const rest = new REST().setToken(token);


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);


		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {

		console.error(error);
	}
})();