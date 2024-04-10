const { sendCommandsSearch } = require('../../../../commands/utility/user/help/embeds/commands/search');


module.exports = {
	customId: 'help-commands-search',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendCommandsSearch(interaction, log);
	},
};