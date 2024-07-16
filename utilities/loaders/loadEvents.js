const fs = require('node:fs');
const path = require('node:path');

function loadEvents(client, dirPath = path.join(__dirname, '..', '..', 'events')) {
	const items = fs.readdirSync(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			loadEvents(client, itemPath);
		}
		else if (item.endsWith('.js')) {
			const event = require(itemPath);
			if (!event.name) continue;
			if (event.once) {
				client.once(event.name, (...args) => event.execute(client, ...args));
			}
			else {
				client.on(event.name, (...args) => event.execute(client, ...args));
			}
			console.log(`Successfully loaded ${event.name}`);
		}
	}
}

module.exports = {
	loadEvents,
};