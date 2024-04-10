const { newTimestamp } = require('../../../utils');
const { Log } = require('../../../utils/logging/logging');

class Task {
	constructor(taskData) {
		this.name = taskData.name;
		this.schedule = taskData.schedule;
		this.arguments = taskData.arguments;
		this.scheduledAt = null,
		this.lastExecution = null,
		this.nextExecution = null,
		this.startTime = null,
		this.failedAt = null,
		this.responseTime = null,
		this.description = taskData.description;
		this.filepath = taskData.filepath || null;
		this.updatedAt = taskData.updated_at;
		this.created = taskData.created_at;
		this.status = 'success',
		this.isTask = true,
		this.retryCount = 0;
		this.log = new Log();
	}

	async initiate(...args) {
		await this.log.initiateTask(this, ...args);
	}

	
	async update(...args) {
		this.log.updateTask(this, ...args);
	}

	async finalize(...args) {
		this.log.finalizeTask(this, ...args);
	}

	errorHandling(error, ...args) {
		this.failedAt = newTimestamp('hour');
		this.status = 'failed';
		this.log.errorHandling(error, ...args);
	}

}

module.exports = {
	Task,
};