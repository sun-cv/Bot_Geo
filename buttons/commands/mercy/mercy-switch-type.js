const { mercyBackgroundOptions } = require('../../../commands/mercy/subcommands/options/mercyBackground');


module.exports = {
	customId: 'mercy-switch-type',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction) => {
		mercyBackgroundOptions(interaction);
	},
};