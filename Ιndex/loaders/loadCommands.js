const fs = require('node:fs');
const path = require('node:path');

async function loadCommands(client, dirPath) {

	const filesAndFolders = fs.readdirSync(dirPath);

	for (const fileOrFolder of filesAndFolders) {
		const fullPath = path.join(dirPath, fileOrFolder);

		if (fs.lstatSync(fullPath).isDirectory()) {
			// Recursively load commands in subfolders
			loadCommands(client, fullPath);
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

module.exports = {
	loadCommands,
};