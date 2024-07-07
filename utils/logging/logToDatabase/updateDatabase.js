const { db } = require('../../../database/database');

async function updateDatabase() {

	const { member, command, button, message, time, error } = this;

	const queries = [];

	if (member.isMember) {

		queries.push({
			table: 'member',
			fields: ['last_active = ?'],
			values: [member.lastActive],
		});

		if (command.isCommand) {
			queries[0].fields.push('last_Command = ?, command_count = command_count + 1');
			queries[0].values.push(command.parameters);
		}
		if (button.isButton) {
			queries[0].fields.push('button_count = button_count + 1');
		}
		if (message.isMessage) {
			queries[0].fields.push('message_count = message_count + 1');
		}
		if (error.isError) {
			queries[0].fields.push('error_count = error_count + 1');
		}
	}

	if (command.category === 'mercy tracker') {

		queries.push({
			table: 'mercy_accounts',
			fields: ['last_active = ?'],
			values: [time.iso],
		});
	}

	for (const queryInfo of queries) {

		const query = `UPDATE ${queryInfo.table} SET ${queryInfo.fields.join(', ')} WHERE user_id = ?`;

		try {
			await db.run(query, [...queryInfo.values, member.id]);
		}
		catch (err) {
			console.log('error detected in class Log: updateDatabase', err);
		}
	}
}

module.exports = {
	updateDatabase,
};
