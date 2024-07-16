const parser = require('cron-parser');

function formatAMPM(date) {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm} ${formattedDate}`;
}

function nextExecutionTime(schedule) {
	try {
		const options = {
			currentDate: new Date(),
			tz: 'America/New_York',
		};
		const interval = parser.parseExpression(schedule, options);
		const nextExecution = interval.next().toDate();
		return formatAMPM(nextExecution);
	}
	catch (error) {
		console.error('Error detected in nextExecutionTime', error);
		throw error;
	}
}

module.exports = {
	nextExecutionTime,
};