const { sendMercyRegister } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/register');

module.exports = {
	customId: 'help-mercy-register',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendMercyRegister(interaction, log);
	},
};