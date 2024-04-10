const { sendHelpRules } = require('../../../commands/utility/user/help/embeds/rules');


module.exports = {
	customId: 'help-rules',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendHelpRules(interaction, log);
	},
};