const { sendHelpRules } = require('../../../commands/utility/user/help/embeds/rules');


module.exports = {
	customId: 'help-rules',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendHelpRules(interaction);
	},
};