function addRoleToUser(interaction, roleName) {

	const foundRole = interaction.guild.roles.cache.find(role => role.name === roleName);
	// Check if the guild has the role
	if (!foundRole) {
		console.log(`The role ${roleName} does not exist.`);
		return;
	}

	// Check if the member already has the role
	if (interaction.member.roles.cache.has(foundRole.id)) {
		return;
	}

	// Add the role to the user
	interaction.member.roles.add(foundRole)
		.then(member => console.log(`Added the ${roleName} role to ${member.displayName}`))
		.catch(console.error);
}


module.exports = { addRoleToUser };