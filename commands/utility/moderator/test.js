
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { autocompleteUserAccounts } = require('../../../Αrchive/mercyDeprecated/utils/functions/userAutoComplete');
const { db } = require('../../../database/database');
const { delay } = require('../../../utils');
const { token, guildId, clientId } = require('../../../config.json');


async function testCommand(interaction = new CommandInteraction(), log) {

	const rest = new REST().setToken(token);

	await log.initiateCommand({ name: 'test', role: 'Mercy', category: 'utility' }); let output;

	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			const commands = await rest.get(
				Routes.applicationGuildCommands(clientId, guildId),
			);

			console.log('Successfully reloaded application (/) commands.');
			console.log(commands);
		}
		catch (error) {
			console.error(error);
		}
	})();

	// // for guild-based commands
	// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	// 	.then(() => console.log('Successfully deleted all guild commands.'))
	// 	.catch(console.error);

	// // for global commands
	// rest.put(Routes.applicationCommands(clientId), { body: [] })
	// 	.then(() => console.log('Successfully deleted all application commands.'))
	// 	.catch(console.error);

	try {

		// const currentMercyData = await db.all('SELECT * FROM mercy_tracker');

		// class newEntry {
		// 	constructor(mercyData) {
		// 		this.id = mercyData.user_id;
		// 		this.username = mercyData.username;
		// 		this.name = mercyData.account;
		// 		this.shard = mercyData.shard;
		// 		this.count = mercyData.count;
		// 		this.totalCount = 0;
		// 		this.lastAdded = 0;
		// 		this.lastPulled = '';
		// 		this.lastReset = '';
		// 	}
		// }

		// const newMercyData = [];

		// for (const data of currentMercyData) {
		// 	let newData;

		// 	if (data.shard === 'primal') {
		// 		['primal.legendary', 'primal.mythical'].forEach(type => {
		// 			data.shard = type;
		// 			if (type === 'primal.legendary') {
		// 				data.count = data.legendary_count;
		// 			}
		// 			else {
		// 				data.count = data.mythical_count;
		// 			}
		// 			newData = new newEntry(data);
		// 			newMercyData.push(newData);
		// 		});
		// 	}
		// 	else {
		// 		newData = new newEntry(data);
		// 		newMercyData.push(newData);

		// 	}
		// }
		// console.log(newMercyData);

		// newMercyData.forEach(newData => {

		// 	const { id, username, name, shard, count, totalCount, lastAdded, lastPulled, lastReset } = newData;


		// 	const mercyShards = 'INSERT INTO mercy_tracker_data(id, member, name, shard, count, totalCount, lastAdded, lastpulled, lastReset) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// 	const mercyShardsValues = [id, username, name, shard, count, totalCount, lastAdded, lastPulled, lastReset];

		// 	db.run(mercyShards, mercyShardsValues).then(console.log(shard, ' added')).then(delay(1000));


		// });


	}
	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand(output);
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};

