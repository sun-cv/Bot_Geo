const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../../../utils/index');

const commandsHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟📜 Geo\'s Rules Page! 📜🌟')
	.setDescription('We’re committed to maintaining a positive and respectful environment for all members. Here are the guidelines that help us ensure this:')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 Rule #1 - Respect:', value: 'Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated. Let’s foster a community of kindness and understanding.' },
		{ name: '🔸 Rule #2 - No Spam or Self-Promotion:', value: 'Keep the channels clean. No spam or self-promotion (server invites, advertisements, etc) without permission from a staff member. This includes DMs to fellow members.' },
		{ name: '🔸 Rule #3 - Age-Restricted Content:', value: 'Keep it clean. No age-restricted or obscene content. This includes texts, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.' },
		{ name: '🔸 Rule #4 - Sensitive Topics:', value: 'Keep private conversations private. Conversations involving sensitive topics such as politics, religion, or private/personal information should not occur in public channels, but instead be reserved for the various private forums Discord provides or other platforms altogether.' },
		{ name: '🔸 Rule #5 - Reporting:', value: 'See something, say something. If you see something against the rules or something that makes you feel unsafe, let staff know. We want this server to be a welcoming space!' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1185825663710679040/Welcomeblank1.png?ex=66123835&is=65ffc335&hm=324c222384c76c9c8915774e0d7d7dee41498c48ff5dfc95e55a29c6c4c80030&')
	.setTimestamp();

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-home')
			.setLabel('Back')
			.setStyle('Secondary'),
	);

async function sendHelpRules(interaction) {

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [commandsHome],
			components: [addRow],
			ephemeral: true,
		});

	}
	catch (error) {
		console.log('error detected in Help - send rules embed.');
		// Logging
		commandLog.status = 'failed';
		commandLog.error = error;

		throw error;
	}
	finally {
		// Logging
		commandLog.category = 'Utility';
		commandLog.output = 'none';
		logUserCommand(interaction, commandLog);
	}


}


module.exports = {
	sendHelpRules,
};

