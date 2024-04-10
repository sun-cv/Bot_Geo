const { logColor, assignStatusColor } = require('../../functions/stylistic/logColor');


function logToConsole() {

	const { member, command, button, message, task, tracer, time, error } = this;


	const statusColor = assignStatusColor.call(this);

	// Tracer
	if (command.isCommand) {

		console.log(logColor ([`${time.hour} - ${tracer.responseTime}: ${member.name} used ${command.parameters} - `, `${statusColor.command}`, `${command.status}`]));

		tracer.map.delete(tracer.uniqueId);

	}
	// Button
	if (button.customId) {
		const buttonParts = button.customId.split('home');
		const coloredbutton = buttonParts.length > 1
			? [...buttonParts.slice(0, -1), 'cyan', 'home', ...buttonParts.slice(-1)]
			: [button.customId];

		console.log(logColor([`${time.hour} - ${tracer.responseTime}: ${member.name} is navigating `, ...coloredbutton]));
	}

	// Message
	if (message.isMessage) {
		console.log(logColor([`${time.hour}: ${member.name} >`, `${statusColor.message}`, `${message.filter} > ${message.content} '`]));
	}
	// REWORK REQUIRED Task
	if (task.isTask && !error.isError) {
		console.log(logColor([`${time.hour}: ${task.name} was executed successfully in ${task.responseTime}. Next execution time: ${task.nextExecution} - `, `${statusColor.task}`, `${task.status}`]));
	}
	// Error

	if (error.isError) {
		const events = {
			'command': () => console.log(logColor([`${time.hour}: ${member.name} attempted to execute the ${command.name} command. The command `, `${statusColor.error}`, `${command.status}`, ` after ${tracer.responseTime}. Error: ${error.name}. Message: ${error.message}. stackTrace:\n${error.stackTrace}`])),
			'button': () => console.log(logColor([`${time.hour}: ${member.name} pressed ${button.customId}. The button `, `${statusColor.error}`, `${button.status}`, ` after ${tracer.responseTime}. Error: ${error.name}. Message: ${error.message}. stackTrace:\n${error.stackTrace}`])),
			'message': () => console.log(logColor([`${time.hour}: ${member.name} >`, `${statusColor.error}`, `${message.filter} > ${message.content}\n`, error])),
			'task': () => console.log(logColor([`${time.hour}: ${task.name} `, `${statusColor.error}`, 'failed', ` after ${task.responseTime}.`, ' Next scheduled:', 'yellow', ` ${task.nextExecution}.`, ` Error: ${error.name}. Message: ${error.message}. stackTrace:\n${error.stackTrace}`])),
			'default': () => console.log(`default log: error detected in ${error.function}`),
		};


		// Execute for the current error event
		(events[error.event] || events['default'])();
	}
}


module.exports = {
	logToConsole,
};