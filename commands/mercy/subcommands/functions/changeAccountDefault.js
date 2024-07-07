const { db } = require('../../../../database/database');

async function changeAccountDefault(interaction, account, outputs) {
	try {

		if (account.default === true) {
			outputs.push({ edit: 'default', error: true, message: 'This account is already the default account' });
			return;
		}

		await db.run('UPDATE mercy_tracker_accounts SET main = false WHERE id = ?', [account.id]);
		await db.run('UPDATE mercy_tracker_accounts SET main = true WHERE id = ? AND name = ?', [account.id, account.name]);

		outputs.push({ edit: 'default', success: true, message: `${account.name} is now your default Mercy account` });

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	changeAccountDefault,
};