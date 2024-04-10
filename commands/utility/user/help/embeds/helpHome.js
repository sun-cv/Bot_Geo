const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const helpHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟🛠️ Welcome to Geo’s Help Desk! 🛠️🌟')
	.setDescription('Hello there! I’m Geo, and I\'m here to make your Discord experience smoother and more enjoyable.')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔹 Commands:', value: 'Curious about what I can do? Check out the list of all available commands along with their descriptions. I\'m sure you\'ll find them useful!' },
		{ name: '🔹 FAQ:', value: 'Got questions? We\'ve got answers! Our Frequently Asked Questions section covers a wide range of topics. Don\'t forget to take a look!' },
		{ name: '🔹 Rules:', value: 'To ensure a pleasant experience for everyone, we have some rules in place. This includes server rules, bot rules, and more. Make sure to familiarize yourself with them.' },
		{ name: '🔹 Contact Us', value: 'Need to reach out to us and it\'s not about Discord? We\'ve got you covered. Find out the best ways to get in touch with us.\n\nRemember, I\'m here to help. So, don\'t hesitate to ask if you have any questions!' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1185825663710679040/Welcomeblank1.png?ex=66123835&is=65ffc335&hm=324c222384c76c9c8915774e0d7d7dee41498c48ff5dfc95e55a29c6c4c80030&')
	.setTimestamp()
	.setFooter({ text: 'Credits: sun' });

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-commands-home')
			.setLabel('Commands')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-faq')
			.setLabel('FAQ')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-rules')
			.setLabel('Rules')
			.setStyle('Primary'),
		new ButtonBuilder()
			.setCustomId('help-contact')
			.setLabel('Contact us')
			.setStyle('Success'),
	);

async function sendHelpHome(interaction, log) {

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [helpHome],
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
	sendHelpHome,
	helpHome,
};

