const { sendMercy } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/mercy');


module.exports = {
	customId: 'help-mercy-mercy',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendMercy(interaction);
	},
};