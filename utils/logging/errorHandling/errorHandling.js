const { updateProperties, updateLogError } = require('../updateLog/logValues');
const { interactionErrorHandling } = require('./interactionErrorHandling');


function errorHandling(error, ...args) {

	// optionally update additional properties if needed
	if (args.length) updateProperties(...args);

	// bot response if user interaction
	if (this.interaction.discord !== null) interactionErrorHandling.call(this);

	updateLogError.call(this, error);

}

module.exports = {
	errorHandling,
};