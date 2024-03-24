async function logColor(input) {

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
			console.log('fail');
		}
	}

	return output + colors.reset;
}

module.exports = {
	logColor,
};