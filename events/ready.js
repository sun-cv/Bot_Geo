const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.guilds.cache.forEach(async (guild) => {
			await guild.members.fetch();
			console.log(`Fetched ${guild.members.cache.size} members for guild: ${guild.name}`);
		});
	},
};