const { sendCommandsSearch } = require('../../../../commands/utility/user/help/embeds/commands/search');


module.exports = {
	customId: 'help-commands-search',
	deferUpdate: true,
	cooldown: -1,

	execute: async (interaction) => {
		sendCommandsSearch(interaction);
	},
};