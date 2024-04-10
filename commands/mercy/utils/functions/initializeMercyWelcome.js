async function initializeMercyWelcome(interaction, initialized) {

	if (!initialized) {
		return;
	}
	interaction.followUp({ content: `Thank you <@${interaction.user.id}> for trying our Mercy Tracker!\n\n Your **main** account has been initialized; \n - this is your default account when using commands in the mercy system.\n - You can add alts with /register. `, ephemeral: true });
	return;
}


module.exports = {
	initializeMercyWelcome,
};