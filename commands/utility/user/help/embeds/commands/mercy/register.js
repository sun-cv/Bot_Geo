const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const register = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('Register Command')
	.setDescription('Allows you to manage your alternate accounts')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 /register new [account]', value: '- Register up to 4 alternate accounts\n  - **Example:**```/register new sunsAlt```' },
		{ name: '🔸 /register list', value: '- Shows all your currently registered accounts' },
		{ name: '🔸 /register Remove', value: '- remove any old or unwanted accounts\n  - **Example:**```/register remove sunsAlt confirm```' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1185825663710679040/Welcomeblank1.png?ex=66123835&is=65ffc335&hm=324c222384c76c9c8915774e0d7d7dee41498c48ff5dfc95e55a29c6c4c80030&')
	.setTimestamp();

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-mercy-home')
			.setLabel('Back')
			.setStyle('Secondary'),
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

async function sendMercyRegister(interaction, log) {

	log.initiateCommand({ name: 'mercy-register', category: 'help' });

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [register],
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
	sendMercyRegister,
};

