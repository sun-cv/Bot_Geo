const { Events } = require('discord.js');
const filterModules = require('../listener/index');

module.exports = {
	name: Events.MessageCreate,
	async execute(client, message) {

		if (message.author.bot)	return;

		try {

			const filterArray = Object.values(filterModules);

			for (const filterModule of filterArray) {
				if (await filterModule.shouldFilter(message)) {
					const exit = await filterModule.handleFilteredMessage(message);
					if (exit === 'exit') {
						return;
					}
				}
			}
		}
		catch (error) {
			console.log(error);
		}
	},
};