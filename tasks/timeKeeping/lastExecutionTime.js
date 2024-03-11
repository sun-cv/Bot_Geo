const { newTimestamp } = require('../../utils/functions/timeKeeping/newTimestamp');

async function lastExecutionTime() {
	const timestamp = await newTimestamp();
	const [time, stamp, date] = timestamp.split(' ');

	// Remove seconds from the time
	const formattedTime = time.slice(0, -3);

	// Construct the final timestamp
	const formattedTimestamp = `${formattedTime} ${stamp} ${date}`;

	return formattedTimestamp;
}

module.exports = {
	lastExecutionTime,
};