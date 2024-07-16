async function requireRoles(interaction, roles = []) {

	const allowedRoles = roles;
	const userRoles = interaction.member.roles.cache;
	const hasRequiredRole = allowedRoles.some(roleName => userRoles.some(role => role.name === roleName));

	return hasRequiredRole;
}

module.exports = {
	requireRoles,
};