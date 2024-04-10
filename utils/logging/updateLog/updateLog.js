const { updateProperties } = require('./logValues');


function returnCommand(status, reason, output, ...args) {


	updateProperties.call(this, 'interaction', { status: status, reason: reason }, 'command', { status: status, output: output }, ...args);

}

module.exports = {
	returnCommand,
};