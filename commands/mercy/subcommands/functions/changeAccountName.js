const { db } = require('../../../../database/database');
const { isAccount } = require('./isAccount');

async function changeAccountName(interaction, account, outputs) {
	try {

		const newName = (interaction.options.getString('name'));
	

		if (await isAccount(interaction, newName)) {
			outputs.push({ edit: 'name', error: true, message: 'This account name already exists' });
			return;
		}

		await db.run('UPDATE mercy_tracker_accounts SET name = ? WHERE id = ? AND name = ? ', [newName, account.id, account.name]);
		await db.run('UPDATE mercy_tracker_data SET name = ? WHERE id = ? AND name = ?', [newName, account.id, account.name]);
		await db.run('UPDATE mercy_tracker_champions SET name = ? WHERE id = ? AND name = ?', [newName, account.id, account.name]);

		account.name = newName;

		outputs.push({ edit: 'name', success: true, message: `Account name was succesfully changed to ${newName}` });

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	changeAccountName,
};