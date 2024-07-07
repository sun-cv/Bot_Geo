const { db } = require('../../../../database/database');
const { newTimestamp } = require('../../../../utils');
const { getAccount } = require('../../functions/account/getAccount');
const { shardTypes } = require('../../functions/textMaps');

async function addAccount(interaction, account) {
	try {

		const existingDefaultAccount = await getAccount(interaction);

		const id = interaction.member.user.id;
		const username = interaction.member.user.username;
		const accountName = account;
		const defaultAccount = existingDefaultAccount ? false : true;
		let data = {};
		let template = {
			selection: ['wukong'],
			random: false,
			type:'fullArt',
		};
		const count = 0;
		const total = 0;
		const lastAdded = 0;
		const lastPulled = '';
		const lastReset = '';
		const timestampIso = newTimestamp('iso');

		data = JSON.stringify(data);
		template = JSON.stringify(template);

		const mercyAccounts = 'INSERT INTO mercy_tracker_accounts(id, member, name, main, data, template, lastActive) VALUES (?, ?, ?, ?, ?, ?, ?)';
		const mercyAccountsValues = [id, username, accountName, defaultAccount, data, template, timestampIso];

		db.run(mercyAccounts, mercyAccountsValues);

		shardTypes.forEach(shard => {

			const mercyShards = 'INSERT INTO mercy_tracker_data(id, member, name, shard, count, totalCount, lastAdded, lastpulled, lastReset) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
			const mercyShardsValues = [id, username, accountName, shard, count, total, lastAdded, lastPulled, lastReset];

			db.run(mercyShards, mercyShardsValues);
		});

	}
	catch (error) {
		console.log(error);
	}


}

module.exports = {
	addAccount,
};