const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const success = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('Success Command')
	.setDescription('Calculates your cumulative percentage chance of pulling a legendary (or mythical) champion when pulling the designated number of shards of a selected type.')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 /success [#] [shard] [count] [2x] [account] [share]', value: '- by default will calculate based off of your current mercy count for real time odds. if none, will default to a count of 0\n\nYou can modify the calculation with these options:\n\n- **[count]**\n  - set a specific starting point for the calculation. For example if you wanted to calculate your % chance of pulling 5 sacred from a starting count of 20.\n\n- **[2x]**\n  - designate whether it is a 2x event, this doubles the base % chance.\n\n- **[account]**\n  - allows you to designate a different default mercy count other than your main in case you wanted the calculate success on an alt.\n\n- **Example:**```/success 25 primal mythical``````/success 50 ancient 165 2x sunsAlt```' },
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
	);

async function sendMercySuccess(interaction, log) {

	log.initiateCommand({ name: 'mercy-success', category: 'help' });

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [success],
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
	sendMercySuccess,
};

