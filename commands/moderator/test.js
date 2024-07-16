const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
const { clientId } = require('../../config.json');


async function testCommand(interaction = new CommandInteraction()) {
	try {
		interaction.client.guilds.cache.get(clientId).commands.fetch().then((commands) => {
			const commandToDelete = commands.find(cmd => cmd.name === 'YOUR_COMMAND_NAME');
			if (commandToDelete) {
				interaction.client.guilds.cache.get('YOUR_GUILD_ID').commands.delete(commandToDelete.id);
			}
		}).catch(console.error);

	}
	catch (error) {
		console.log(error);
	}

}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test command'),
	execute: testCommand,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};

