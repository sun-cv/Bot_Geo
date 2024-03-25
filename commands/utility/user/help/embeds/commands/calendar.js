const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { logUserCommand, commandLog } = require('../../../../../../utils/index');


const commandsHome = new EmbedBuilder()
	.setColor('#ED8223')
	.setTitle('🌟📜 Geo\'s Calendar Command! 📜🌟')
	.setDescription('This command provides a stylized screengrab of the Plarium Play events calendar, keeping you up-to-date with all the upcoming events.')
	.setThumbnail('https://cdn.discordapp.com/attachments/1185256496322322472/1216489470568829009/PettheGeo.png?ex=6613081b&is=6600931b&hm=d95181cb8f1df79ecf5d5d7796011b573de17751b05228eb34ed881adbd5382c&')

	.addFields(
		{ name: '🔸 /calendar:', value: 'Stay in the loop! Use this command to get a visual overview of all the scheduled events in Plarium Play.' },
		{ name: 'Please note:', value: 'We strive to keep the calendar as current as possible.\nHowever, if you notice that the calendar is out of date, kindly ping <@271841393725407242> to bring it to our attention.\n\nWe appreciate your help in keeping our community informed!' },
	)
	.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1221644385641299968/latestCalendar.png?ex=661353fe&is=6600defe&hm=e0781e1c9262f3294dc651f6b55bdf8c987fd9a3083e9ce92ca43a9e9468fc5b&')
	.setTimestamp();

const addRow = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('help-commands-home')
			.setLabel('Back')
			.setStyle('Secondary'),
	);

async function sendCommandsCalendar(interaction) {

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
		console.log('error detected in Help - send calendar embed.');
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
	sendCommandsCalendar,
};

