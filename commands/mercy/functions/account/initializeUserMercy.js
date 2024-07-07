const { guildId } = require('../../../../config.json');
const { db } = require('../../../../database/database');
const { newTimestamp } = require('../../../../utils');
const { getAccount } = require('./getAccount');
const { isMember } = require('./isMember');

const { shardTypes } = require('../textMaps');
const { loadMercyData } = require('./loadMercyData');
const { loadChampionData } = require('./loadChampionData');


async function initializeUserMercy(interaction) {

	try {

		if (!await isMember(interaction)) {

			const id = interaction.member.user.id;
			const username = interaction.member.user.username;
			const accountName = 'main';
			const defaultAccount = true;
			let data = {};
			let template = {
				type: 'fullArt',
				selection: ['alure'],
				random: false,
			};
			const count = 0;
			const total = 0;
			const lastAdded = 0;
			const lastPulled = '';
			const lastReset = '';
			const timestampIso = newTimestamp('iso');
			const timestamp = newTimestamp();

			data = JSON.stringify(data);
			template = JSON.stringify(template);


			const mercyAccounts = 'INSERT INTO mercy_tracker_accounts(id, member, name, main, data, template, lastActive, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
			const mercyAccountsValues = [id, username, accountName, defaultAccount, data, template, timestampIso, timestamp];

			db.run(mercyAccounts, mercyAccountsValues);

			shardTypes.forEach(shard => {

				const mercyShards = 'INSERT INTO mercy_tracker_data(id, member, name, shard, count, totalCount, lastAdded, lastpulled, lastReset) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
				const mercyShardsValues = [id, username, accountName, shard, count, total, lastAdded, lastPulled, lastReset];

				db.run(mercyShards, mercyShardsValues);
			});

			const guild = await interaction.client.guilds.fetch(guildId);
			const mercyRole = guild.roles.cache.find(role => role.name === 'Mercy');
			const member = guild.members.cache.get(id);
			member.roles.add(mercyRole);

			interaction.followUp({ content:`Hey <@${id}>, thanks for trying out the mercy tracker!\n\n A default "main" account has been created for you. If you'd like to change its name (/account edit) or check the available mercy commands see the <#1197726332604383232> channel for more information.\n\nIf you have any questions, don't hesitate to reach out.\n ⎯ <@271841393725407242>`, ephemeral: true });
		}

		const account = await getAccount(interaction);
		if (!account) return;

		await loadMercyData(interaction, account);
		await loadChampionData(interaction, account);
		return account;
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	initializeUserMercy,
};
