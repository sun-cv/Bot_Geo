const { commandTrace, userCommandTrace } = require('../objects/userCommandTrace');
const { newTimestamp } = require('../../functions/timeKeeping/newTimestamp');
const { replacer } = require('../functions/utils/bigIntReplacer');
const { constructFullCommand } = require('../functions/utils/constructFullCommand');
const { existingMember } = require('../functions/utils/existingMember');

/**
 * Main properties updater
 */


function validateArgs(args) {
	if (args.length % 2 !== 0) {
		throw new Error('Invalid number of arguments. Each key must be followed by its properties.');
	}
}

async function findTarget(input, keyPath) {
	let target = input;
	for (let j = 0; j < keyPath.length - 1; j++) {
		target = target[keyPath[j]];
		if (!target) {
			console.log(`Unable to find target: ${keyPath.slice(0, j + 1).join('.')}`);
			return;
		}
	}
	return target;
}

/**
 * @param {...(string|object)} args - Pairs of property paths and values. Eg: 'this.object', { parameter: value }, ...
 */

async function updateProperties(...args) {

	validateArgs(args);

	for (let i = 0; i < args.length; i += 2) {
		const keyPath = args[i].split('.');
		const newProperties = args[i + 1];
		const target = await findTarget(this, keyPath);

		const key = keyPath[keyPath.length - 1];

		if (!Object.prototype.hasOwnProperty.call(target, key)) {
			throw new Error(`Key "${key}" does not exist in the entry object.`);
		}

		const existingEntry = target[key];

		for (const prop in newProperties) {
			if (!Object.prototype.hasOwnProperty.call(existingEntry, prop)) {
				throw new Error(`Required property missing for key '${key}': ${prop}`);
			}
			target[key][prop] = newProperties[prop];
		}
	}
}

async function updateLogInteraction(interaction) {
	try {
		if (interaction) {

			this.interaction.discord = interaction;
			this.interaction.guildId = interaction.guildId || 'dm';
			this.interaction.channelId = interaction.channelId;
			this.interaction.messageId = interaction.messageId;
			this.interaction.deferred = interaction.deferred;
			this.interaction.createdAt = interaction.createdAt;

		}
	}
	catch (error) {
		console.log('error detected in class Log: updateLogInteraction');
	}
}


async function updateLogMember() {
	try {

		if (this.interaction.discord) {

			this.member.id = this.interaction.discord.member.id;
			this.member.name = this.interaction.discord.member.user.username;
			this.member.roles = this.interaction.discord.member.roles.cache;
			this.member.lastActive = newTimestamp();
			this.member.isMember = await existingMember.call(this, 'member');

		}
	}
	catch (error) {
		console.log('error detected in class Log: updateLogMember', error);
	}
}


async function updateLogCommand() {
	try {

		if (this.interaction.discord.isCommand()) {

			this.command.name = this.interaction.discord.commandName;
			this.command.parameters = constructFullCommand(this.interaction.discord);
			this.command.data = this.interaction.discord.client.commands.get(this.command.name);
			this.command.data.share = this.interaction.discord.options.getString('share') === 'true';
			this.command.cooldown.count = this.command.data.cooldownCount;
			this.command.cooldown.subCount = this.command.data.subCommand;
			this.command.isCommand = true;

		}
	}
	catch (error) {
		console.log('error detected in class Log: updateLogCommand', error);
	}

}


async function updateLogButton() {
	try {

		if (this.interaction.discord.isButton()) {

			this.button.customId = this.interaction.discord.customId;
			this.button.created = this.interaction.discord.createdAt;
			this.button.data = await this.interaction.discord.client.buttons.get(this.button.customId);
			this.button.deferUpdate = this.button.data.deferUpdate;
			this.button.cooldown = this.button.data.cooldown;
			this.button.status = 'pending';
			this.button.isButton = true;

		}
	}
	catch (error) {
		console.log('error detected in class Log: updateLogButton', error);
	}
}


async function updateLogMessage(update) {
	try {
		this.message.content = this.interaction.discord.content;
		this.message.attachments = this.interaction.discord.attachments;
		this.message.createdTimestamp = this.interaction.discord.createdTimestamp;
		this.message.status = 'pending';
		this.message.isMessage = true;

		if (update) {
			if (update.message?.filter !== null) { this.message.filter = update.message?.filter; }
		}
	}
	catch (error) {
		console.log('error detected in class Log: updateLogMessage', error);
	}
}


async function updateLogTask(taskInstance) {
	try {

		if (taskInstance) {

			this.task.name = taskInstance.name;
			this.task.schedule = taskInstance.schedule;
			this.task.arguments = taskInstance.arguments;
			this.task.scheduledAt = taskInstance.scheduledAt;
			this.task.lastExecution = taskInstance.lastExecution;
			this.task.nextExecution = taskInstance.nextExecution;
			this.task.startTime = taskInstance.startTime;
			this.task.failedAt = taskInstance.failedAt;
			this.task.responseTime = taskInstance.responseTime;
			this.task.description = taskInstance.description;
			this.task.filepath = taskInstance.filepath;
			this.task.updatedAt = taskInstance.updatedAt;
			this.task.created = taskInstance.created;
			this.task.status = taskInstance.status;
			this.task.isTask = true;
		}


	}
	catch (error) {
		console.log('error detected in class Log: updateLogTask', error);
	}

}

async function updateLogTracer() {
	try {

		this.tracer.map = userCommandTrace;
		this.tracer.uniqueId = commandTrace(this.member.id, this.button.customId, newTimestamp('unix'));
		this.tracer.context = userCommandTrace.get(this.tracer.uniqueId);

		if (this.interaction.discord.isCommand()) this.tracer.trace = this.command.data.trace;
		if (this.interaction.discord.isButton()) this.tracer.trace = this.button.data.trace;

	}
	catch (error) {
		console.log('error detected in class Log: updateTracer', error);
	}
}


async function updateLogTime(update) {

	this.time.hour = newTimestamp('hour');
	this.time.date = newTimestamp('date');
	this.time.stamp = newTimestamp();
	this.time.iso = newTimestamp('iso');
	this.time.unix = newTimestamp('unix');
	if (update) {
		if (update.time?.update !== null) this.time.update = update.time?.update;
		if (update.time?.end !== null) this.time.final = update.time?.end;
		if (update.time?.status !== null) this.time.status = update.time?.status;
	}
}


async function updateLogError(error) {
	try {

		if (error) {

			this.error.error = error;
			this.error.name = error.name;
			this.error.message = error.message;
			this.error.stackTrace = error.stack;
			this.error.status = 'failed error';
			this.error.isError = true;
			this.interaction.status = 'failed';
			if (this.command.isCommand) this.command.status = 'failed';
			if (this.button.isButton) this.button.status = 'failed';
			if (this.message.isMessage) this.message.status = 'failed';

			this.interaction.reason = `encountered an error: ${this.error.name}`;

			this.error.event = [];
			if (this.command.isCommand) this.error.event.push('command');
			if (this.button.isButton) this.error.event.push('button');
			if (this.message.isMessage) this.error.event.push('message');
			if (this.task.isTask) this.error.event.push('task');

			if (error && this.interaction.discord) this.error.interactionArgs = JSON.stringify([this.interaction.discord], replacer);

		}
	}
	catch (err) {
		console.log('error detected in class Log: updateLogError');
	}
}


module.exports = {

	updateProperties,

	updateLogInteraction,
	updateLogMember,
	updateLogCommand,
	updateLogButton,
	updateLogMessage,
	updateLogTask,
	updateLogTracer,
	updateLogTime,
	updateLogError,
};