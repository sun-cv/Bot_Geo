const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const commandsHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟🕹️ Geo\'s Command Center! 🕹️🌟')
	.setDescription('Here you’ll find all the publicly available commands for Geo. Click on each command for further details:')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔹 /mercy:', value: 'Your personal mercy tracker for RSL! It features account options, pull, reset, success calculations, and even sharing of mercy. It\'s your one-stop-shop for all things mercy!' },
		{ name: '🔹 /calendar', value: 'Want to keep track of events? Check out our stylized version of the Plarium events calendar. Never miss an event again!' },
		{ name: '🔹 /search', value: '🛠️ This command is currently a work in progress. Stay tuned for updates!' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1185825663710679040/Welcomeblank1.png?ex=66123835&is=65ffc335&hm=324c222384c76c9c8915774e0d7d7dee41498c48ff5dfc95e55a29c6c4c80030&')
	.setTimestamp();

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-home')
			.setLabel('Back')
			.setStyle('Secondary'),
		new ButtonBuilder()
			.setCustomId('help-mercy-home')
			.setLabel('mercy')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-commands-calendar')
			.setLabel('calendar')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-commands-search')
			.setLabel('search')
			.setStyle('Primary'),
	);

async function sendCommandsHome(interaction, log) {

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
	sendCommandsHome,
	commandsHome,
};

