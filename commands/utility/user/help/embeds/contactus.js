const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../../../utils/index');


const commandsHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟📜 Get in Touch with Us! 📜🌟 ')
	.setDescription('We\'re here to help and we\'d love to hear from you. Here\'s how you can reach us:')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 Discord:', value: 'Feel free to ping us directly on Discord. You can reach out to <@213697653677096960> or <@271841393725407242>.' },
		{ name: '🔸 Email:', value: 'Prefer to send an email? No problem! You can reach us at:\n\n🔹 colredplays@gmail.com.\n\nWe\'ll get back to you as soon as we can' },
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

async function sendHelpContactus(interaction) {

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
		console.log('error detected in Help - send contact us embed.');
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
	sendHelpContactus,
};

