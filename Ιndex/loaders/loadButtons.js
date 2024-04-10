const fs = require('node:fs');
const path = require('node:path');

function loadButtons(client, dirPath) {

	const items = fs. readdirSync(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			loadButtons(client, itemPath);
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

module.exports = {
	loadButtons,
};