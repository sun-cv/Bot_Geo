const { db } = require('../../../../database/database');

async function existingMember(input) {

	let table;

	if (input === 'member') {
		table = input;
	}
	else {
		console.log('error detected in Log: existingMember - No table provided');
		return;
	}

	try {
		const existing = await db.get(`SELECT * FROM ${table} WHERE user_id = ?`, this.member.id);

		if (existing) {
			this.member.isMember = true;
		}
		else {
			this.member.isMember = false;
		}

		return Boolean(existing);
	}
	catch (error) {
		console.log('error detected in Log: existingMember', error);
	}
}

module.exports = {
	existingMember,
};