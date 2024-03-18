async function newTimestamp(returnTime) {
	const newDate = new Date();
	const options = { timeZone: 'America/New_York' };
	const timestamp = newDate.toLocaleString('en-US', options);
	const [date, time] = timestamp.split(', ');
	const reversedTimestamp = `${time} ${date}`;
	const hourTimestamp = `${time}`;
	const dateTimestamp = `${date}`;

	if (returnTime === 'hour') {
		return hourTimestamp;
	}
	else if (returnTime === 'date') {
		return dateTimestamp;
	}
	else {
		return reversedTimestamp;
	}
}

module.exports = {
	newTimestamp,
};