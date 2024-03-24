const { guildId } = require('../../../../config.json');
const { newTimestamp } = require('../../../../utils/functions/timeKeeping/newTimestamp.js');
const { db } = require('../../../../database/utils/databaseIndex.js');

async function goldenKappa(client) {
	try {

		// Get Guild
		const guild = client.guilds.cache.get(guildId);

		// Get Role
		const goldenKappaRole = guild.roles.cache.find(role => role.name === 'Golden Kappa');
		// Fetch the last user who was assigned the Golden Kappa role

		const lastAssigned = await db.get('SELECT user_id FROM golden_kappa ORDER BY kappa DESC LIMIT 1');

		// If there was a last user, remove the role from them
		if (lastAssigned) {
			const lastMember = await guild.members.fetch(lastAssigned.user_id);

			if (lastMember) {

				lastMember.roles.remove(goldenKappaRole);
				console.log(`No Longer Kappa: ${lastMember.user.username}`);
			}
		}
		else {
			console.error('Last member not found.');
		}

		await guild.members.fetch().then(fetchedMembers => {
			console.log('Guild members:', fetchedMembers.size);
		}).catch(err => {
			console.error(`Error fetching members: ${err}`);
		});

		let eligibleMembers;
		// Select a random member and assign the role to them
		if (lastAssigned === undefined) {
			eligibleMembers = guild.members.cache.filter(member => !member.user.bot);
		}
		else {
			eligibleMembers = guild.members.cache.filter(member => !member.user.bot && member.user.id !== lastAssigned.user_id);
		}

		console.log('Eligible members:', eligibleMembers.size);
		const randomMember = eligibleMembers.random();
		if (randomMember) {
			randomMember.roles.add(goldenKappaRole);
			console.log(`The new goldenKappa: ${randomMember.user.username}`);
			// Update the database
			const timestamp = await newTimestamp();
			db.run('INSERT INTO golden_kappa (user_id, username, timestamp) VALUES (?, ?, ?)', [randomMember.id, randomMember.user.username, timestamp]);
		}
		else {
			console.error('No eligible members found.');
		}
	}
	catch (error) {
		console.error('Error in goldenKappa:', error);
		throw error;
	}
}

module.exports = {
	goldenKappa,
	task: true };