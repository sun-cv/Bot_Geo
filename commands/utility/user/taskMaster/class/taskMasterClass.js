const { Task } = require('../../../../../tasks/taskManager/task/task');
const { TaskManager } = require('../../../../../Ιndex');


class TaskMaster {
	constructor(client) {

		this.taskManager = new TaskManager(client); // rework TaskManager internal | external

		this.task = new Task; // rework Task internal | external ??


	}

    receiveTask

    confirmTask

    writeTask

    readTask





}

module.exports = {
	TaskMaster,
};