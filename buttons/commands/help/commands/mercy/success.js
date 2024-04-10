const { sendMercySuccess } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/success');

module.exports = {
	customId: 'help-mercy-success',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendMercySuccess(interaction, log);
	},
};