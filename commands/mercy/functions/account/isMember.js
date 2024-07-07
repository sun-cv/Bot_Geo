const { db } = require('../../../../database/database');

async function isMember(interaction) {

	try {

		const existingData = await db.get('SELECT * FROM mercy_tracker_accounts WHERE id = ?', [interaction.member.user.id]);
		const member = existingData ? true : false;

		return member;

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	isMember,
};