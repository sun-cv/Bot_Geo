const fs = require('node:fs');
const path = require('node:path');

function loadComponents(client) {
	const componentTypes = ['commands', 'buttons', 'menus'];

	for (const componentType of componentTypes) {
		console.log(path.join(__dirname, '..', '..', componentType));
		loadComponent(client, componentType, path.join(__dirname, '..', '..', componentType));
	}

}

function loadComponent(client, componentType, dirPath) {
	const items = fs.readdirSync(dirPath);

	for (const item of items) {
		const itemPath = path.join(dirPath, item);
		const stats = fs.statSync(itemPath);

		if (stats.isDirectory()) {
			loadComponent(client, componentType, itemPath);
		}
		else if (item.endsWith('.js')) {
			const component = require(itemPath);
			if (componentType === 'commands') {
				if ('command' in component && component.command && 'data' in component && 'execute' in component) {
					client[componentType].set(component.data.name, component);
				}
			}
			else if (Array.isArray(component)) {
				for (const comp of component) {
					client[componentType].set(comp.customId || comp.data.name, comp);
				}
			}
			else {
				client[componentType].set(component.customId || component.data.name, component);
			}
		}
	}
}

module.exports = {
	loadComponents,
};