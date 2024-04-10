const { sendMercyReset } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/reset');

module.exports = {
	customId: 'help-mercy-reset',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendMercyReset(interaction, log);
	},
};