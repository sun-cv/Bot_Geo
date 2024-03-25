const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../../../../../utils/index');


const pull = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('Pull command')
	.setDescription('Adds shards to your mercy counter.')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 /pull', value: '- Specify the number of shards you\'ve pulled followed by the shard type. You can also subtract with `[-#] [shard]`.\n - **Example:** ```/pull 5 ancient``````/pull -3 void [account]```' },

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

async function sendMercyPull(interaction) {

	if (!interaction) {
		console.error('Interaction is null or undefined');
		return;
	}
	try {

		await interaction.editReply({
			embeds: [pull],
			components: [addRow],
			ephemeral: true,
		});

	}
	catch (error) {
		console.log('error detected in Help - send pull embed.');
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
	sendMercyPull,
};

