const { sendCommandsHome } = require('../../../../commands/utility/user/help/embeds/commands/commandsHome');


module.exports = {
	customId: 'help-commands-home',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendCommandsHome(interaction, log);
	},
};