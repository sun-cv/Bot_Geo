const { db } = require('../../../database/database');

async function updateDatabase() {

	const { member, command, button, message, error } = this;

	let table;
	const fields = [];
	const values = [];

	if (member.isMember) {

		table = 'member';
		fields.push('last_active = ?');
		values.push(member.lastActive);

		if (command.isCommand) {
			fields.push('last_Command = ?, command_count = command_count + 1');
			values.push(command.parameters);
		}
		if (button.isButton) {
			fields.push('button_count = button_count + 1');
		}
		if (message.isMessage) {
			fields.push('message_count = message_count + 1');
		}
		if (error.isError) {
			fields.push('error_count = error_count + 1');
		}
	}


	if (!table) {
		console.log('updateDatabase: table is undefined');
		return;
	}
	const query = `UPDATE ${table} SET ${fields.join(', ')} WHERE user_id = ?`;


	try {
		db.run(query, [...values, member.id]);
	}
	catch {
		console.log('error detected in class Log: updateDatabase', error);
	}
}


module.exports = {
	updateDatabase,
};