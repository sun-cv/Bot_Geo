const { newTimestamp } = require('../../../utils');

const { ModTask } = require('./taskTypes/mod');
const { UserTask } = require('./taskTypes/user');
const { SystemTask } = require('./taskTypes/system');

const { Log } = require('../../../utils/logging/logging');

class Task {
	constructor(taskData) {
		this.option =
		this.log = new Log();
	}


	
	createTask(taskData) {

		switch (this.option) {
		case 'mod':
			return new ModTask(taskData);
		case 'user':
			return new UserTask(taskData);
		case 'systen':
			return new SystemTask(taskData);
		}
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
