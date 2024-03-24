// Construct command output for logging
function constructFullCommand(interaction) {
	const commandName = interaction.commandName;
	let fullCommand = `/${commandName}`;

	// Recursive function to handle subcommands and options
	function handleOption(option) {
		fullCommand += ` ${option.name}`;

		// Append the option's value if it exists
		if (option.value) {
			fullCommand += ` ${option.value}`;
		}

		// Handle sub-options
		if (option.options) {
			option.options.forEach(handleOption);
		}
	}

	// Iterate over the options
	interaction.options.data.forEach(handleOption);

	return fullCommand;
}

module.exports = { constructFullCommand };