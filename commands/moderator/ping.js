const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

async function pingCommand(interaction = new CommandInteraction()) {
	try {

		const allowedRoles = ['Officer', 'Deputy'];
		const userRoles = interaction.member.roles.cache;
		const hasRequiredRole = allowedRoles.some(roleName => userRoles.some(role => role.name === roleName));

		const allowedCategory = 'ColredPlays Clans';
		const commandCategory = interaction.channel.parent?.name;
		const isCorrectCategory = commandCategory === allowedCategory;

		const pingedRole = interaction.options.getRole('role');
		const validRoleNames = ['Red Wardens', 'UltimateSunKnights', 'Cold Red Sun', 'Deep Dwarf Squats', 'CPR5', 'test'];
		const isValidRole = validRoleNames.includes(pingedRole.name);

		const message = interaction.options.getString('message');

		if (hasRequiredRole && isCorrectCategory && isValidRole) {

			const blankMessage = await interaction.editReply('⠀');
			blankMessage.delete();
			await interaction.followUp({ content: `${pingedRole} ${message}`, allowedMentions: { roles: [pingedRole.id] }, fetchReply: true });
			return;
		}
		else {
			let errorMessage = '';
			if (!hasRequiredRole) {
				errorMessage += '<:GeoNo:1197290091203280906> You do not have permission to use this command.\n';
			}
			else {
				if (!isCorrectCategory) {
					errorMessage += 'This command can only be used in the Clans Category.\n';
				}
				if (!isValidRole) {
					errorMessage += 'The specified role is not valid.\n';
				}
			}

			if (errorMessage) {
				interaction.editReply({ content: errorMessage, ephemeral: true });
			}
		}
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping a role')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('The role to ping')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message to send')
				.setRequired(true)),
	execute: pingCommand,
	command: true,
	defer: true,
	moderator: false,
	maintenance: false,
	ephemeral: false,
	trace: true,
};