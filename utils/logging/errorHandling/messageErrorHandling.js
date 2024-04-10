async function messageErrorHandling(messageFunction, message) {
	try {
		await messageFunction(message);
	}
	catch (error) {
		console.log('error detected in messageErrorHandling', error);
	}
}

module.exports = { messageErrorHandling };