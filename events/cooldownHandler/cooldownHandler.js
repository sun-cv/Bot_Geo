const { Collection } = require('discord.js');

const cooldowns = new Collection();

async function cooldownHandler(interaction, item, type) {
	const { member } = interaction;
	const id = type === 'button' ? interaction.customId : interaction.commandName;
	const {
		deferUpdate = false,
		defer = false,
		cooldown = -1,
		subCommand = null,
		subCooldown = null,
	} = item;

	let returnCooldown;

	const shareInput = interaction.options?.getString('share');
	const share = shareInput === 'true';

	const currentId = share ? subCommand : id;
	const currentCooldown = share ? subCooldown : cooldown ;

	const cooldownAmount = currentCooldown * 1000;
	const cooldownTime = currentCooldown / 60;

	const cooldownKey = `${currentId}-${member.id}`;

	const timestamps = cooldowns.get(cooldownKey) || cooldowns.set(cooldownKey, new Collection()).get(cooldownKey);

	const currentTime = Date.now();

	if (timestamps.has(cooldownKey)) {
		const expirationTime = timestamps.get(cooldownKey) + cooldownAmount;

		if (currentTime < expirationTime) {
			returnCooldown = true;
			const timeLeft = (expirationTime - currentTime) / 1000;
			if (defer || deferUpdate) {
				return interaction.followUp({ content: `${cooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
			else {
				return interaction.reply({ content: `${cooldownKey} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
		}
	}
	timestamps.set(cooldownKey, currentTime);
	setTimeout(() => timestamps.delete(member.id), cooldownAmount);

	return returnCooldown;
}

module.exports = {
	cooldownHandler,
};