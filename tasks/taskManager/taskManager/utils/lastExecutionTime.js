const { newTimestamp } = require('../../../../utils/functions/timeKeeping/newTimestamp');

function lastExecutionTime() {
	const timestamp = newTimestamp();
	const [time, stamp, date] = timestamp.split(' ');

	// Construct the final timestamp
	const formattedTimestamp = `${time} ${stamp} ${date}`;

	return formattedTimestamp;
}

module.exports = {
	lastExecutionTime,
};

module.exports = {
	lastExecutionTime,
};