async function sendOutputs(interaction, outputs) {

	try {

		const successes = [];
		const errors = [];
		let output = '';

		outputs.forEach(outputObj => {
			if (outputObj.success) successes.push(outputObj);
			if (outputObj.error) errors. push(outputObj);
		});


		if (successes.length > 0) {
			successes.forEach(success => {
				output += `- ${success.message}\n`;
			});
			output += '\n';
		}
		if (errors.length > 0) {
			output += 'errors:\n';
			errors.forEach(error => {
				output += `- ${error.message}`;
			});
			output += '\n';
		}

		if (output === '') {
			output += 'Something went wrong. Sorry about that!';
		}

		await interaction.editReply({ content: output, ephemeral: true });

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	sendOutputs,
};