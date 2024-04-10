function tracerResponseTime() {

	const responseTimeMs = this.interaction.finalAt - this.time.unix;

	let responseTimeFormatted;
	if (responseTimeMs >= 1000) {
		// Convert to seconds with two decimal places
		responseTimeFormatted = (responseTimeMs / 1000).toFixed(2) + 's';
	}
	else {
		responseTimeFormatted = responseTimeMs + 'ms';
	}

	return responseTimeFormatted;
}

module.exports = {
	tracerResponseTime,
};