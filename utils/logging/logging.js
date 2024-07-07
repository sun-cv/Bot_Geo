const { newTimestamp, updateProperties, startLog, startCommandLog, startMessageLog, startButtonLog, startTaskLog, finalizeCommand, finalizeMessage, finalizeButton, finalizeTask, errorHandling, returnCommand } = require('./index');

class Log {
	constructor() {

		this.interaction = {
			discord: null,
			guildId: null,
			channelId: null,
			messageId: null,
			deferred: true,
			createdAt: null,
			updatedAt: null,
			finalAt: null,
			status: null,
			reason: null,
		},

		this.member = {
			id: null,
			name: null,
			roles: null,
			lastActive: null,
			isMember: null,
		},

		this.command = {
			name: null,
			role: null,
			category: null,
			parameters: null,
			commandData: null,
			output: 'none',
			data: {
				defer: null,
				moderator: null,
				maintenance: null,
				ephemeral: null,
				trace: null,
				share: null,
				subCommand: null,
				cooldownCount: null,
				subCooldownCount: null,
			},
			cooldown: {
				time: null,
				status: null,
				subTime: null,
				subStatus: null,
			},
			status: 'success',
			isCommand: false,
		};

		this.button = {
			customId: null,
			category: null,
			data: null,
			deferUpdate: null,
			cooldown: {
				time: null,
			},
			status: 'success',
			isButton: false,
		};

		this.message = {
			content: null,
			attachments: null,
			createdTimestamp: null,
			filter: null,
			status: 'success',
			isMessage: false,
		},

		this.task = {
			name: null,
			schedule: null,
			arguments: null,
			scheduledAt: null,
			lastExecution: null,
			nextExecution: null,
			startTime: null,
			failedAt: null,
			responseTime: null,
			description: null,
			filepath: null,
			updatedAt: null,
			created: null,
			status: 'success',
			isTask: false,
		},

		this.tracer = {
			traceMap: null,
			uniqueId: null,
			context: {
				userId: null,
				command: null,
				time: null,
				uniqueId: null,
				count: null,
			},
			responseTime: null,
			trace: null,
		},

		this.time = {
			hour: newTimestamp('hour'),
			date: newTimestamp('date'),
			stamp: newTimestamp(),
			iso: newTimestamp('iso'),
			unix: newTimestamp('unix'),
		},

		this.error = {
			error: null,
			name: '',
			message: null,
			stackTrace: null,
			interactionArgs: null,
			event: null,
			status: null,
			isError: null,
		};
	}

	// Initialize
	async initialize(interaction) {
		await startLog.call(this, interaction);
	}

	async initiateCommand(...args) {
		await startCommandLog.call(this, ...args);
	}

	async initiateMessage(...args) {
		await startMessageLog.call(this, ...args);
	}

	async initiateButton(...args) {
		await startButtonLog.call(this, ...args);
	}

	async initiateTask(taskInstance, ...args) {
		await startTaskLog.call(this, taskInstance, ...args);
	}


	// Update
	update(...args) {
		updateProperties.call(this, ...args);
	}

	async updateTask(taskInstance, ...args) {
		await startTaskLog.call(this, taskInstance, ...args);
	}

	// Return
	return(...args) {
		updateProperties.call(this, ...args);
	}

	returnCommand(status, reason, output, ...args) {
		returnCommand.call(this, status, reason, output, ...args);
	}

	// Error
	errorHandling(error, ...args) {
		errorHandling.call(this, error, ...args);
	}


	// Finalize
	async finalizeCommand(output) {
		await finalizeCommand.call(this, output);
	}

	async finalizeButton(...args) {
		await finalizeButton.call(this, ...args);
	}

	finalizeMessage(...args) {
		finalizeMessage.call(this, ...args);
	}

	async finalizeTask(taskInstance, ...args) {
		await finalizeTask.call(this, taskInstance, ...args);
	}
}
module.exports = {
	Log,
};