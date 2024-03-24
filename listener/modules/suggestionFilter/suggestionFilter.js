/**
 * Toggle on off
 */

const { delay } = require('../../../utils');
const { getRandomEmoji } = require('../../../utils/functions/undesignated/getRandomEmoji');

const toggle = true;

/**
 * Suggestion Box Filter
 */

async function shouldFilter(message) {
	try {
		// Test Channel
		const suggestionBox = '1184960653362987129';
		const filter = message.channelId === suggestionBox;
		// Filter return
		if (!toggle || !filter) {
			return;
		}
		else {
			return true;
		}
	}
	catch (error) {
		console.log('Error detected in suggestionFilter check');
		throw error;
	}
}

/**
 * Suggestion Box Handler
 */

async function handleFilteredMessage(message) {
	try {

		// Approved suggestion tags
		const validTags = ['video', 'community', 'feedback', 'discord', 'other'];
		const emojis = ['<:Ancient:1184573482684661950>', '<:Void:1184573509037477999>', '<:Primal:1184573522958364762>', '<:Sacred:1184573533037273258>'];

		// Check if the message contains any valid tags
		const mentionedTags = message.mentions.roles;
		const hasValidTag = mentionedTags.some((role) =>
			validTags.includes(role.name.toLowerCase()),
		);


		if (hasValidTag) {

			await message.react('<:keanu_thanks59:1185010015178870894>');

			for (let i = 0; i < 3; i++) {
				const emoji = getRandomEmoji(emojis);
				message.react(emoji);
			}
		}

		else {

			const pingTags = ['<@&1184992088153141318>', '<@&1186408581239676959>', '<@&1184993824154587318>', '<@&1184993842819256360>', '<@&1184993865732730951>'];

			const warning = await message.reply('To properly record your suggestion, please start your message with one of the following tags:\n\n\n\nConfused? - Follow me for instructions! https://discord.com/channels/1132751121023250554/1184960653362987129/1185048638175576095');
			for (let index = 0; index < pingTags.length; index++) {
				await delay(1500);
				await warning.edit(`To properly record your suggestion, please start your message with one of the following tags:\n\n${pingTags[index]}\n\nConfused? - Follow me for instructions! https://discord.com/channels/1132751121023250554/1184960653362987129/1185048638175576095`);
			}

			await delay(3000);
			warning.edit('If you would like to save your message please do so now\n\nIt will be deleted in:');

			for (let index = 0; index < 10; index++) {
				const count = 10 - index;
				await delay(1000);
				await warning.edit(`If you would like to save your message please do so now\n\nIt will be deleted in: ${count}`);
			}

			await delay(1000);

			warning.delete();
			message.delete();
		}
	}
	catch (error) {
		console.log('Error detected in suggestionFilter execute');
		throw error;
	}
}


module.exports = {
	shouldFilter,
	handleFilteredMessage,
};

