class UserTask {
	constructor(taskData) {
		this.name = taskData.name;
		this.type = 'user';
		this.schedule = taskData.schedule;
		this.arguments = taskData.arguments;
		this.scheduledAt = null,
		this.lastExecution = taskData.last_execution,
		this.nextExecution = null,
		this.startTime = null,
		this.responseTime = taskData.response_time,
		this.description = taskData.description;
		this.updatedAt = taskData.updated_at;
		this.created = taskData.created_at;
		this.status = 'success',
		this.isTask = true,
		this.retryCount = 0;
	}
}


module.exports = {
	UserTask,
};