const { sendMercyRegister } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/register');

module.exports = {
	customId: 'help-mercy-register',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercyRegister(interaction);
	},
};