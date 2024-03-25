const { sendMercyReset } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/reset');

module.exports = {
	customId: 'help-mercy-reset',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercyReset(interaction);
	},
};