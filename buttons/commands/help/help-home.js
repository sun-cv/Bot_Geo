const { sendHelpHome } = require('../../../commands/utility/user/help');


module.exports = {
	customId: 'help-home',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendHelpHome(interaction);
	},
};