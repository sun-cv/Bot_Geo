const { nextExecutionTime } = require('../../tasks/functions/nextExecutionTime');
const { newTimestamp } = require('../functions/time/newTimestamp');

class Tracer {
	constructor() {
		this.start = new Date();
	}

	async endTime() {

		this.end = new Date();

		const responseTimeMs = this.end - this.start;
		const responseTimeFormatted = (responseTimeMs >= 1000) ? (responseTimeMs / 1000).toFixed(2) + 's' : responseTimeMs + 'ms';

		this.responseTime = responseTimeFormatted;
	}
}

class Event {
	constructor() {
		this.status = 'new';
		this.time = {
			hour: newTimestamp('hour'),
			stamp: newTimestamp(''),
			iso: newTimestamp('iso'),
		};
		this.tracer = new Tracer();
	}
}

class Command extends Event {
	constructor(interaction) {
		super();
		this.interaction = interaction;
		this.command = interaction.client.commands.get(interaction.commandName);
		this.member = interaction.member.user;
		this.parameters = constructFullCommand(this.interaction);
		this.data = {};
	}
}

class Button extends Event {
	constructor({ interaction: interaction, data: data }) {
		super();
		this.interaction = interaction;
		this.button = interaction.client.buttons.get(interaction.customId);
		this.member = interaction.member.user;
		this.data = data;
	}
}

class Menu extends Event {
	constructor({ interaction: interaction, data: data }) {
		super();
		this.interaction = interaction;
		this.menu = interaction.client.menus.get(interaction.customId);
		this.member = interaction.member.user;
		this.data = data;
	}
}

class Message extends Event {
	constructor({ message: message, filter: filter, data: data }) {
		super();
		this.message = message;
		this.filter = filter;
		this.data = data;
	}
}

class Task extends Event {
	constructor(data) {
		super();
		this.id = data.id;
		this.name = data.name;
		this.arguments = data.arguments;
		this.cron = data.cron;
		this.execute = data.execute;
		this.data = data;
		this.run = false;
		this.nextExecution = nextExecutionTime(this.cron);
	}
}

module.exports = {
	Event, Command, Button, Menu, Message, Task, Tracer,

};

function constructFullCommand(interaction) {
	const commandName = interaction.commandName;
	let fullCommand = `/${commandName}`;
	function handleOption(option) {
		fullCommand += ` ${option.name}`;

		if (option.value) {
			fullCommand += ` ${option.value}`;
		}

		if (option.options) {
			option.options.forEach(handleOption);
		}
	}

	interaction.options.data.forEach(handleOption);

	return fullCommand;
}