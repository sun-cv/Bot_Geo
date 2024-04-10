async function buttonErrorHandling(buttonFunction, interaction, log) {
	try {
		await buttonFunction(interaction, log);
	}
	catch (error) {
		console.log('error detected in buttonErrorHandling', error);
	}
}

module.exports = { buttonErrorHandling };
