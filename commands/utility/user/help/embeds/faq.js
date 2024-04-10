const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const commandsHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟📜 FAQ! 📜🌟')
	.setDescription('A description')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 placeholder:', value: 'placeholder' },

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

async function sendHelpFaq(interaction, log) {

	log.initiateCommand({ name: 'faq-home', category: 'help' });

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
		log.errorHandling(error);
	}
	finally {
		if (interaction.isButton()) {
			log.finalizeButton();
		}
	}

}


module.exports = {
	sendHelpFaq,
};

