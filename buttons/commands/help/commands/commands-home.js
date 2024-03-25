const { sendCommandsHome } = require('../../../../commands/utility/user/help/embeds/commands/commandsHome');


module.exports = {
	customId: 'help-commands-home',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendCommandsHome(interaction);
	},
};