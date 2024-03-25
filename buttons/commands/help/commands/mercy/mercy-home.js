const { sendMercyHome } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/mercyHome');


module.exports = {
	customId: 'help-mercy-home',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercyHome(interaction);
	},
};