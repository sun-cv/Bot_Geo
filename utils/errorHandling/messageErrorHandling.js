// Error handler
const { localErrorLogging } = require('./localErrorLogging');

async function messageErrorHandling(messageFunction, message) {
	try {
		await messageFunction(message);
	}
	catch (error) {

		const event = 'message';

		// Pass to local define and logging
		localErrorLogging(error, message, event);
		// Send a message to the user
		if (!message.author.bot) {
			await message.reply({ content: 'Sorry, something went wrong while processing your message.', ephemeral: true});
		}
	}
}

module.exports = { messageErrorHandling };