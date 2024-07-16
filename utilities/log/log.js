const { db } = require('../../database/database');
const { Command, Button, Menu, Task } = require('./events');
const { EventEmitter } = require('events');


class Log {
	constructor() {
		if (Log.instance) {
			return Log.instance;
		}
		Log.instance = this;

		this.emitter = new EventEmitter();
		this.events = new Map();

		this.emitter.on('interaction', async (data) => { await this.handler(data, 'interaction'); });
		this.emitter.on('task', async (task) => { await this.handler(task, 'task'); });
	}

	emit(type, data) {
		this.emitter.emit(type, data);
	}
	emitAwait(type, data) {
		return new Promise((resolve) => {
			this.emitter.once(type, resolve);
			this.emitter.emit(type, data);
		});
	}

	async handler(data, type) {
		await interactionHandler.call(this, data, type);
	}

}

async function interactionHandler(data, type) {
	try {

		const event = await getEvent.call(this, data, type);
		if (event.status === 'new' && type === 'interaction') return;

		await event.tracer.endTime();
		await logEvent.call(this, event);
		await writeEvent.call(this, event, type);
		await clearEvent.call(this, event, type);
	}
	catch (error) {
		console.log(error);
	}
}

function getMember(interaction) {
	return interaction.member.user.id;
}

async function getEvent(data, type) {

	const key = type === 'task' ? data.name : getMember(data);

	if (!this.events.has(key)) {
		const newEvent = await createEvent(data, type);
		this.events.set(key, newEvent);
		return newEvent;
	}
	const event = this.events.get(key);
	event.status = 'success';
	return event;
}

async function createEvent(data, type) {

	if (type === 'interaction') {
		const interaction = data;
		if (interaction.isCommand()) return new Command(interaction);
		if (interaction.isButton()) return new Button(interaction);
		if (interaction.isAnySelectMenu()) return new Menu(interaction);
	}
	else {
		return new Task(data);
	}

}

function logEvent(event) {

	const { member, command, parameters, button, message, tracer, time, cron } = event;

	if (command) {
		console.log(`${time.hour} - ${tracer.responseTime}: ${member.username} used ${parameters}`);
	}
	if (button) {
		console.log(`${time.hour} - ${tracer.responseTime}: ${member.username} is navigating ${button.customId} `);
	}
	if (message) {
		console.log(`${time.hour}: ${member.name} ${message.filter} > ${message.content} `);
	}
	if (cron) {
		if (event.run === false) {
			console.log(`Running ${event.name}..`);
			event.run = true;
			return;
		}

		console.log(`${time.hour}: ${event.name} was executed successfully in ${event.tracer.responseTime}. Next execution time: ${event.nextExecution}`);
		event.run = false;
	}

}

async function writeEvent(event) {

	const { interaction, command, member, parameters, data, task, tracer, time } = event;

	const queries = [];
	let query;

	if (command) {
		queries.push({
			table: 'command_log',
			variables: '(guild_id, channel_id, user_id, username, command, output, response_time, time, timestamp)',
			values: [interaction.guildId, interaction.channelId, member.id, member.username, parameters, data.output || '', tracer.responseTime, time.stamp, time.iso] });
	}

	if (task) {

		if (task.info.type === 'system') {
			queries.push({
				update: true,
				where: [
					{ key: 'id', value: task.info.id },
					{ key: 'task_name', value: task.info.name },
				],
				table: 'tasks_system',
				variables: '(scheduled_at, last_execution, next_execution, response_time, failed_at, error)',
				values: [task.timestamp.scheduledAt, task.timestamp.lastExecution, task.timestamp.nextExecution, task.timestamp.responseTime, task.timestamp.failedAt, error.name] });
		}
	}

	for (const queryInfo of queries) {

		const placeholders = '?'.repeat(queryInfo.values.length).split('').join(', ');
		let params;

		if (queryInfo.update === true) {

			const pairs = queryInfo.variables.slice(1, -1).split(', ').map((v) => `${v} = ?`).join(', ');
			const whereClause = queryInfo.where.map(condition => `${condition.key} = ?`).join(' AND ');

			query = `UPDATE ${queryInfo.table} SET ${pairs} WHERE ${whereClause}`;

			params = [...queryInfo.values, ...queryInfo.where.map(condition => condition.value)];

		}
		else {

			query = `INSERT INTO ${queryInfo.table} ${queryInfo.variables} VALUES(${placeholders})`;
			params = queryInfo.values;

		}
		try {

			await db.run(query, params);
		}
		catch (error) {
			console.log(error);
		}
	}
}

function clearEvent(event, type) {

	const key = type === 'task' ? event.name : getMember(event.interaction);

	if (event.status === 'success') {
		this.events.delete(key);
	}
}

const log = new Log();

module.exports = {
	log,
};