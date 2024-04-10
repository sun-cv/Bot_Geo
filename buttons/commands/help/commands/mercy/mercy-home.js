const { sendMercyHome } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/mercyHome');


module.exports = {
	customId: 'help-mercy-home',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendMercyHome(interaction, log);
	},
};