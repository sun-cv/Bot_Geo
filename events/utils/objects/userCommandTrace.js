const userCommandTrace = new Map();
let count = 0;

async function commandTrace(userId, command, time) {

	const uniqueId = `${count}${userId}${command}${time}`;

	const context = {
		userId: userId,
		command: command,
		time: time,
		uniqueId: uniqueId,
		count: count,
	};

	userCommandTrace.set(uniqueId, context);

	count++;

	return uniqueId;

}

module.exports = {
	commandTrace,
	userCommandTrace,
};