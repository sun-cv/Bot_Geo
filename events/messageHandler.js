const filterModules = require('../listener/index');

async function handleMessage(message) {
	try {
		if (message.author.bot) {
			return;
		}
		// Convert the filterModules object to an array of filter functions
		const filterArray = Object.values(filterModules);

		// Load filter modules dynamically
		for (const filterModule of filterArray) {
			if (await filterModule.shouldFilter(message)) {
				const exit = await filterModule.handleFilteredMessage(message);
				if (exit === 'exit') {
					return;
				}
			}
		}
		// If no filters applied, let the message pass through
	}
	catch (error) {
		console.log('Error detected in Message Listener');
		throw error;
	}
}

module.exports = {
	handleMessage,
};