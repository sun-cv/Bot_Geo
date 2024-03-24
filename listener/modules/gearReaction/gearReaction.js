/**
 * Toggle on off
 */

const toggle = true;

/**
 * Gear reaction Filter
 */

async function shouldFilter(message) {
	try {

		const gearAdvice = '1182460791098724492';
		const filter = message.channelId === gearAdvice;
		// Filter return
		if (!toggle || !filter) {

			return false;
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

	// Storage const emojis2 = ['💪', '👎', '🤞', '🔥' ];

	const emojis = ['<:trash:1216596324850470953>', '<:8_:1216585418502311979>', ':12:1216585426123358279>', '<:16:1216585431639003186>', '<:spd:1216585441718042644>', '<:crt:1216585446235045989>', '🔥'];
	try {
		if (message.attachments.size > 0) {
			for (const emoji of emojis) {
				message.react(emoji);
			}
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