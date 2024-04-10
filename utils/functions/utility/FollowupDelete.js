async function sendFollowUpDelete(interaction, content, ephemeral = true, time) {

	try {

		await interaction.followUp({ content: content, ephemeral: ephemeral });

		if (!ephemeral) setTimeout(() => { interaction.deleteReply(); }, time);

	}
	catch (error) {
		console.log('error detected in sendFollowUp', error);
	}
}
module.exports = {
	sendFollowUpDelete,
};