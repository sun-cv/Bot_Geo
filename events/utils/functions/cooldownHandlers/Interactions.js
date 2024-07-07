const { Collection } = require('discord.js');


async function InteractionCooldownHandler(interaction, cooldownCommands) {

	const { member, commandName } = interaction;
	const command = interaction.client.commands.get(commandName);

	const {
		defer = false,
		cooldownCount = null,
		subCommand = null,
		subCooldownCount = null,
	} = command;

	let returnCooldown;

	const shareInput = interaction.options.getString('share');
	const share = shareInput === 'true';

	const currentCommandName = share ? subCommand : commandName;
	const currentCooldown = share ? subCooldownCount : cooldownCount;

	// cooldowns
	const cooldown = currentCooldown ?? -1;
	const cooldownAmount = cooldown * 1000;
	const cooldownTime = currentCooldown / 60;

	const commandCooldownKey = `${currentCommandName}-${member.id}`;

	const timestamps = cooldownCommands.get(commandCooldownKey) || cooldownCommands.set(commandCooldownKey, new Collection()).get(commandCooldownKey);

	const currentTime = Date.now();

	if (timestamps.has(commandCooldownKey)) {

		const expirationTime = timestamps.get(commandCooldownKey) + cooldownAmount;

		if (currentTime < expirationTime) {
			returnCooldown = true;
			const timeLeft = (expirationTime - currentTime) / 1000;
			if (defer) {
				return interaction.editReply({ content: `${currentCommandName} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
			else if (interaction.isAutocomplete()) {

				return;
			}
			else {
				return interaction.reply({ content: `${currentCommandName} has a ${cooldownTime} minute cooldown. You must wait ${timeLeft.toFixed(0)} seconds`, ephemeral: true });
			}
		}
	}
	timestamps.set(`${currentCommandName}-${member.id}`, currentTime);
	setTimeout(() => timestamps.delete(member.id), cooldownAmount);

	return returnCooldown;
}

module.exports = {
	InteractionCooldownHandler,
};