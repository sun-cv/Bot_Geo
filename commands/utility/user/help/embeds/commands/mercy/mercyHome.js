const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const mercyHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟📜 Geo\'s Mercy Tracker! 📜🌟')
	.setDescription('Here you\'ll find all the mercy commands at your disposal. Click on each command for further details:')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 /register:', value:'Manage your alternate accounts with ease. Register up to 4 alternate accounts, view your currently registered accounts, or remove any old or unwanted accounts.' },
		{ name: '🔸 /pull: ', value:'Keep track of your shards. Specify the number of shards you\'ve pulled followed by the shard type.' },
		{ name: '🔸 /mercy:', value:'Get an overview of all shard types, count, and current mercy % chance.' },
		{ name: '🔸 /reset:', value:'Reset your current mercy count after a pull!' },
		{ name: '🔸 /success:', value:'Calculate your cumulative percentage chance of pulling a legendary (or mythical) champion when pulling the designated number of shards of a selected type.' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1185825663710679040/Welcomeblank1.png?ex=66123835&is=65ffc335&hm=324c222384c76c9c8915774e0d7d7dee41498c48ff5dfc95e55a29c6c4c80030&')
	.setTimestamp();

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-mercy-register')
			.setLabel('register')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-mercy-pull')
			.setLabel('pull')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-mercy-mercy')
			.setLabel('mercy')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-mercy-reset')
			.setLabel('reset')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-mercy-success')
			.setLabel('success')
			.setStyle('Success'),
	);
const addRow2 = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-commands-home')
			.setLabel('Back')
			.setStyle('Secondary'),
	);

async function sendMercyHome(interaction, log) {

	log.initiateCommand({ name: 'mercy-home', category: 'help' });

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [mercyHome],
			components: [addRow, addRow2],
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
	sendMercyHome,
};

