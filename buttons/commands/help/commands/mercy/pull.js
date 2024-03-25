const { sendMercyPull } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/pull');

module.exports = {
	customId: 'help-mercy-pull',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercyPull(interaction);
	},
};