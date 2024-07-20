const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
const { db } = require('../database/database');
const { log } = require('../utilities/log/log');

class Task {
	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.arguments = data.arguments;
		this.cron = data.cron;
		this.execute = null;
		this.data = data;

		this.loadTaskModule(data);
	}

	async loadTaskModule(data, dirPath = path.join(__dirname, '..', 'tasks')) {
		const items = fs.readdirSync(dirPath);
		for (const item of items) {
			const filePath = path.join(dirPath, item);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				await this.loadTaskModule(data, filePath);
			}
			else if (item.endsWith('.js')) {
				const module = require(filePath);
				if (module[data.name]) {
					this.execute = module[data.name];
				}
			}
		}
	}
}

class TaskManager {
	constructor(client) {
		this.tasks = [];
		this.queue = [];
		this.failed = [];
		this.arguments = {
			client: client,
		};
		this.running = { task: false };

		this.loadTasks();
	}

	async loadTasks() {

		await createTasks(this.tasks);
		await scheduleTasks(this.tasks, this.queue, this.arguments, this.running);

	}


}

async function createTasks(tasks) {
	try {

		const allTasks = [];

		const systemTasks = await db.all('SELECT * FROM tasks_system ORDER BY id');
		const userTasks = [];

		allTasks.push(...systemTasks, ...userTasks);
		const createdTasks = allTasks.map(data => {
			return new Task(data);
		});
		tasks.push(...createdTasks);
	}
	catch (error) {
		console.log(error);
	}
}

async function scheduleTasks(tasks, queue, args, running) {
	try {
		for (const task of tasks) {
			cron.schedule(task.cron, async () => {
				queue.push(task);
				await runNextTask(queue, args, running);
			});
		}
		console.log('Successfully scheduled tasks');
	}
	catch (error) {
		console.log(error);
	}
}

async function runNextTask(queue, args, running) {
	try {

		if (running.task || queue.length === 0) return;

		running.task = true;
		const task = queue.shift();

		await log.event(task, 'task');

		try {(task.arguments === '') ? await task.execute() : await task.execute(args[task.arguments]);	}
		catch (error) { this.failed.push(task);	}

		await log.event(task, 'task');

		running.task = false;

		if (queue.length > 0) {
			runNextTask(queue, args, running);
		}
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	TaskManager,
};