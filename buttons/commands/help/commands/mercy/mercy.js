const { sendMercy } = require('../../../../../commands/utility/user/help/embeds/commands/mercy/mercy');


module.exports = {
	customId: 'help-mercy-mercy',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendMercy(interaction, log);
	},
};