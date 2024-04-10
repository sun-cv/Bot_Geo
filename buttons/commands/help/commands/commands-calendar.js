const { sendCommandsCalendar } = require('../../../../commands/utility/user/help/embeds/commands/calendar');


module.exports = {
	customId: 'help-commands-calendar',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction, log) => {
		sendCommandsCalendar(interaction, log);
	},
};