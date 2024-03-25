const { sendHelpFaq } = require('../../../commands/utility/user/help/embeds/faq');


module.exports = {
	customId: 'help-faq',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendHelpFaq(interaction);
	},
};