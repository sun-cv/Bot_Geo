const fs = require('node:fs');
const path = require('node:path');

function loadEvents(client, dirPath) {

	const eventFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(dirPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		}
	}
}

module.exports = {
	loadEvents,
};