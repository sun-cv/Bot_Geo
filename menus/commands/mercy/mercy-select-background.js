const { mercyBackgroundOptions } = require('../../../commands/mercy/subcommands/options/mercyBackground');


module.exports = {
	customId: 'mercy-select-background',
	deferUpdate: true,
	cooldown: -1,
	trace: true,

	execute: async (interaction) => {

		mercyBackgroundOptions(interaction);

	},
};