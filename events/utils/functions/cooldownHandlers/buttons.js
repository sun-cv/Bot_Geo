const { Collection } = require('discord.js');

async function buttonCooldownHandler(interaction, button, cooldownCommands) {

	const { member, customId } = interaction;


	const {
		deferUpdate = false,
		cooldown = -1,
	} = button;

	let returnCooldown;

	// cooldowns

	const cooldownAmount = cooldown * 1000;
	const cooldownTime = cooldown;


	const buttonCooldownKey = `${customId}-${member.id}`;

	const timestamps = cooldownCommands.get(buttonCooldownKey) || cooldownCommands.set(buttonCooldownKey, new Collection()).get(buttonCooldownKey);

	const currentTime = Date.now();

	if (timestamps.has(buttonCooldownKey)) {

		const expirationTime = timestamps.get(buttonCooldownKey) + cooldownAmount;

		if (currentTime < expirationTime) {
			returnCooldown = true;
			const timeLeft = (expirationTime - currentTime) / 1000;
			if (deferUpdate) {
				return interaction.followUp({ content: `${buttonCooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
			else {
				return interaction.followUp({ content: `${buttonCooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
		}
	}
	timestamps.set(buttonCooldownKey, currentTime);
	setTimeout(() => timestamps.delete(member.id), cooldownAmount);

	return returnCooldown;
}

module.exports = {
	buttonCooldownHandler,
};