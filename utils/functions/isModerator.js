async function isModerator(interaction) {

	const member = interaction.member;

	if (member.roles.cache.some(role => role.name === 'Moderator')) {
		return true;
	}
	else {
		return false;
	}
}

module.exports = { isModerator };