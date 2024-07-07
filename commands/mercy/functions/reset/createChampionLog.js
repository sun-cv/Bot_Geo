const { db } = require('../../../../database/database');
const { newTimestamp } = require('../../../../utils');

async function createChampionLog(interaction, account) {

	try {

		const id = interaction.member.user.id;
		const member = interaction.member.user.username;
		const name = account.name;
		const shard = interaction.options.getString('shard');
		const champion = interaction.options.getString('champion');
		const addedCount = interaction.options.getInteger('count');
		const monthDay = newTimestamp('m/d');
		const timestamp = newTimestamp();

		let lastCount;
		let totalCount;

		if (shard.startsWith('primal.')) {
			const primalSplit = shard.split('.');
			const primal = primalSplit[0];
			const type = primalSplit[1];

			lastCount = account.mercy[primal][type].count;
			totalCount = account.mercy[primal][type].totalCount;
		}
		else {
			lastCount = account.mercy[shard].count;
			totalCount = account.mercy[shard].totalCount;
		}
		if (addedCount) {
			lastCount += addedCount;
			totalCount += addedCount;

			await db.run('UPDATE mercy_tracker_data SET totalCount = ? WHERE id = ? AND member = ? AND name = ? AND shard = ?', [totalCount, id, member, name, shard]);
		}
		await db.run('INSERT INTO mercy_tracker_champions (id, member, name, shard, champion, lastCount, monthDay, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, member, name, shard, champion, lastCount, monthDay, timestamp]);

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	createChampionLog,
};