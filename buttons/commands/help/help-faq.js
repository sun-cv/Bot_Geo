const { sendHelpFaq } = require('../../../commands/utility/user/help/embeds/faq');


module.exports = {
	customId: 'help-faq',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendHelpFaq(interaction, log);
	},
};