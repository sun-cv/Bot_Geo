const { sendMercySuccess } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/success');

module.exports = {
	customId: 'help-mercy-success',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercySuccess(interaction);
	},
};