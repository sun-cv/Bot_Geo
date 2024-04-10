const { sendHelpHome } = require('../../../commands/utility/user/help');


module.exports = {
	customId: 'help-home',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendHelpHome(interaction, log);
	},
};