function logColor(input) {

	const colors = {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
		reset: '\x1b[0m',
	};

	let reset = false;
	let output = '';

	for (let i = 0; i < input.length; i++) {

		const item = input[i];

		if (colors[item]) {
			output += colors[item];
			reset = true;
		}
		else if (typeof item === 'string') {
			output += item;
			if (reset) {
				output += colors.reset;
				reset = false;
			}
		}
		else {

			console.log('logColor failed to get color');
		}
	}

	return output + colors.reset;
}

function getColor(status) {
	switch (status) {
	case 'success':
		return 'green';
	case 'failed':
		return 'yellow';
	case 'denied':
		return 'red';
	case 'failed error':
		return 'red';
	default:
		return 'white';
	}
}

function assignStatusColor() {

	const { interaction, member, command, message, task, error, time, tracer } = this;

	const objectsWithStatus = { interaction, member, command, message, task, error, time, tracer };
	const statusColors = {};

	for (const key in objectsWithStatus) {
		const obj = objectsWithStatus[key];
		if (obj && obj.status !== null) {
			statusColors[key] = getColor(obj.status);
		}
	}

	return statusColors;
}

module.exports = {
	logColor,
	getColor,
	assignStatusColor,
};