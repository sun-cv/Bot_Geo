/**
 * Toggle on off
 */

const { delay } = require('../../../utils');

const toggle = false;

/**
 * Moser reaction Filter
 */

async function shouldFilter(message) {
	try {
					 // ['154857612876316672', '839715021205405718', '271841393725407242'];
		const userIds = ['154857612876316672', '534152433572511775'];

		const filter = userIds.includes(message.author.id);

		// Filter return
		if (!toggle || !filter) {

			return false;
		}
		else {

			return true;
		}
	}
	catch (error) {
		console.log('Error detected in moserReaction Filter check');
		throw error;
	}
}

/**
 * Suggestion Box Handler
 */

async function handleFilteredMessage(message) {

	const emojis = ['<:GeoNo:1197290091203280906>', '<:deepsquats:1193731032759930930>', '<a:PettheGeo:1197291007880994846>' ];

	try {

		for (let i = 0; i < 10; i++) {
			for (const emoji of emojis) {
				message.react(emoji);
			}
			await delay(1500);

			const reactions = message.reactions.cache;
			for (const reaction of reactions.values()) {
				if (reaction.users.cache.has('1199067790427037798')) {
					await reaction.users.remove('1199067790427037798');
				}
			}
		}
		for (const emoji of emojis) {
			message.react(emoji);
		}
	}
	catch (error) {
		console.log('Error detected in moserReaction execute');
		throw error;
	}
}


module.exports = {
	shouldFilter,
	handleFilteredMessage,
};