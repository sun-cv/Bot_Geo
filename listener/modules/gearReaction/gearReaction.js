/**
 * Gear reaction Filter
*/

const toggle = true;
const gearAdvice = '1182460791098724492';

async function shouldFilter(message) {
	try {
		return toggle && message.channelId === gearAdvice;
	}
	catch (error) {
		console.log(error);
	}
}

async function handleFilteredMessage(message) {

	const emojis = ['<:trash:1216596324850470953>', '<:8_:1216585418502311979>', ':12:1216585426123358279>', '<:16:1216585431639003186>', '<:spd:1216585441718042644>', '<:crt:1216585446235045989>', '🔥'];
	try {
		if (message.attachments.size > 0) {
			for (const emoji of emojis) {
				message.react(emoji);
			}
		}
	}
	catch (error) {
		console.log(error);
	}
}


module.exports = {
	shouldFilter,
	handleFilteredMessage,
};