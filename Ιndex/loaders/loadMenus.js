const fs = require('node:fs');
const path = require('node:path');

function loadSelectMenus(client, dirPath) {

	const items = fs. readdirSync(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			loadSelectMenus(client, itemPath);
		}
		else if (item.endsWith('js')) {
			const menus = require(itemPath);
			if (Array.isArray(menus)) {
				for (const menu of menus) {
					client.menus.set(menu.customId, menu);
				}
			}
			else {
				client.menus.set(menus.customId, menus);
			}
		}
	}
}

module.exports = {
	loadSelectMenus,
};