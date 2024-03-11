// User outputs
const getUserId = (interaction) => interaction.user.id;
const getUsername = (interaction) => interaction.user.username;

// Channel outputs
const getChannelId = (interaction) => interaction.channel.id;
const getMessageId = (interaction) => {
	if (!interaction.message) {return 'command';}
	else { return interaction.message.id;}
};


module.exports = {
	// User outputs
	getUserId,
	getUsername,
	// Channel outputs
	getChannelId,
	getMessageId,

};