const { StringSelectMenuOptionBuilder } = require('@discordjs/builders');

function addOptionsToMenu(menu, options, type, values = []) {
	let selection = 0;
	if (type === 'embed') {
		options.length > 0 ? options.forEach(option =>
			menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(option.name).setValue(option.name)))
			:
			menu.addOptions(new StringSelectMenuOptionBuilder().setLabel('default').setValue('default'));
	}
	if (type === 'array') {
		options.forEach(option =>
			menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(option).setValue(option)));
	}
	if (type === 'value') {
		options.forEach(option =>
			menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(option).setValue(values[selection])),
		selection += 1,
		);

	}
	if (type === 'map') {
		let index = 0;
		let excess = 0;
		options.forEach((value, key) => {
			if (index < 25) {
				menu.addOptions(new StringSelectMenuOptionBuilder().setLabel(key.toString()).setValue(value.toString()));
			}
			if (index >= 25) {
				excess++;
				console.log(`exceeding menu by ${excess} options`);
				index++;
			}
		});
	}

}

module.exports = {
	addOptionsToMenu,
};