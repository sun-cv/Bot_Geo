const { guildId } = require('../../../config.json');
const { db } = require('../../../database/database');
const { newTimestamp } = require('../../../Ιndex/utilities');

async function goldenKappa(client) {
	try {
		const guild = client.guilds.cache.get(guildId);

		const goldenKappaRole = guild.roles.cache.find(role => role.name === 'Golden Kappa');

		const lastAssigned = await db.get('SELECT id FROM tasks_golden_kappa ORDER BY kappa DESC LIMIT 1');

		const lastMember = await guild.members.fetch(lastAssigned.id);

		lastMember.roles.remove(goldenKappaRole);
		console.log(`No Longer Kappa: ${lastMember.user.username}`);

		await guild.members.fetch();

		const eligibleMembers = guild.members.cache.filter(member => !member.user.bot && member.user.id !== lastAssigned.id);

		const randomMember = eligibleMembers.random();

		randomMember.roles.add(goldenKappaRole);
		console.log(`The new goldenKappa: ${randomMember.user.username}`);

		const timestamp = await newTimestamp();
		await db.run('INSERT INTO tasks_golden_kappa (id, username, timestamp) VALUES (?, ?, ?)', [randomMember.id, randomMember.user.username, timestamp]);
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	goldenKappa,
};