const { db } = require('../../../database/database');

async function writeToDatabase() {

	const { interaction, member, command, button, message, task, tracer, time, error } = this;

	const queries = [];
	let query;

	if (member && member.isMember === false) {
		queries.push({
			table: 'member',
			variables: '(guild_id, user_id, username, last_active, registration_date)',
			values: [interaction.guildId, member.id, member.name, time.date, time.iso] });
		member.isMember = true;
	}

	if (command && command.isCommand) {
		queries.push({
			table: 'command_log',
			variables: '(guild_id, channel_id, user_id, username, category, command, output, status, error, response_time, time, timestamp)',
			values: [interaction.guildId, interaction.channelId, member.id, member.name, command.category, command.parameters, command.output, command.status, error.name, tracer.responseTime, time.stamp, time.iso] });
	}

	if (button && button.isButton) {
		queries.push({
			table: 'command_log',
			variables: '(guild_id, channel_id, user_id, username, category, command, status, error, response_time, time, timestamp)',
			values: [interaction.guildId, interaction.channelId, member.id, member.name, button.category, button.customId, command.status, error.name, tracer.responseTime, time.stamp, time.iso] });
	}

	if (task && task.isTask) {
		queries.push({
			update: true,
			where: 'name',
			table: 'tasks',
			variables: '(schedule, scheduled_at, last_execution, next_execution, failed, response_time, error)',
			values: [task.schedule, task.scheduledAt, task.lastExecution, task.nextExecution, task.status, task.responseTime, error.name, task.name] });
	}

	if (error && error.isError) {

		if (command.isCommand) {
			queries.push({
				table: 'error_log_command',
				variables: '(guild_id, channel_id, user_id, username, command, error_name, error_message, stack_trace, interaction_args, response_time, time, timestamp)',
				values: [interaction.guildId, interaction.channelId, member.id, member.name, command.parameters, error.name, error.message, error.stackTrace, error.interactionArgs, tracer.responseTime, time.stamp, time.iso] });
		}

		if (button.isButton) {
			queries.push({
				table: 'error_log_button',
				variables: '(guild_id, channel_id, user_id, username, custom_id, error_name, error_message, stack_trace, interaction_args, response_time, time, timestamp)',
				values: [interaction.guildId, interaction.channelId, member.id, member.name, button.customId, error.name, error.message, error.stackTrace, error.interactionArgs, tracer.responseTime, time.stamp, time.iso] });
		}

		if (message.isMessage) {
			queries.push({
				table: 'error_log_message',
				variables: '(guild_id, channel_id, user_id, username, button_id, attachments, filter,  error_name, error_message, stack_trace, interaction_args, response_time, time, timestamp)',
				values: [interaction.guildId, interaction.channelId, member.id, member.name, message.content, message.attachments, message. filter, error.name, error.message, error.stackTrace, error.interactionArgs, tracer.responseTime, time.stamp, time.iso] });
		}

		if (task.isTask) {
			queries.push({
				table: 'error_log_task',
				variables: '(task, scheduled_at, next_execution, failed_at, error_name, error_message, stack_trace, response_time, time, timestamp)',
				values: [task.name, task.scheduledAt, task.nextExecution, task.failedAt, error.name, error.message, error.stackTrace, task.responseTime, time.stamp, time.iso ] });
		}
	}

	for (const queryInfo of queries) {

		const placeholders = '?'.repeat(queryInfo.values.length).split('').join(', ');

		if (queryInfo.update === true) {

			// For an UPDATE operation, we need to pair each variable with a placeholder
			const pairs = queryInfo.variables.slice(1, -1).split(', ').map((v) => `${v} = ?`).join(', ');
			query = `UPDATE ${queryInfo.table} SET ${pairs} WHERE ${queryInfo.where} = ?`;

		}
		else {

			query = `INSERT INTO ${queryInfo.table} ${queryInfo.variables} VALUES(${placeholders})`;

		}
		try {
			await db.run(query, queryInfo.values);
		}
		catch (err) {
			console.log('error detected in class Log: writeToDatabase', err);
		}
	}
}


module.exports = {
	writeToDatabase,
};