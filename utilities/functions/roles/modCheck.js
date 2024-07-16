const { admin } = require('../../../config.json');

function modCheck(member) {
	if (member.roles.cache.some(role => role.name === 'Moderator')) return true;
}

function adminCheck(member) {
	if (member.id === admin) return true;
}

module.exports = {
	modCheck,
	adminCheck,
};