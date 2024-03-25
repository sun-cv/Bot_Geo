const { sendHelpContactus } = require('../../../commands/utility/user/help/embeds/contactus');


module.exports = {
	customId: 'help-contact',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendHelpContactus(interaction);
	},
};