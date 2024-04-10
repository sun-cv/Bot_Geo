function newTimestamp(returnTime) {
	const newDate = new Date();
	const options = { timeZone: 'America/New_York' };
	const timestamp = newDate.toLocaleString('en-US', options);
	const [date, time] = timestamp.split(', ');
	const reversedTimestamp = `${time} ${date}`;
	const hourTimestamp = `${time}`;
	const dateTimestamp = `${date}`;
	const unixTimestamp = Date.now();
	const isoTimeStamp = new Date().toISOString();

	if (returnTime === 'hour') {
		return hourTimestamp;
	}
	else if (returnTime === 'date') {
		return dateTimestamp;
	}
	else if (returnTime === 'day') {
		return reversedTimestamp;
	}
	else if (returnTime === 'unix') {
		return unixTimestamp;
	}
	else if (returnTime === 'iso') {
		return isoTimeStamp;
	}
	else {
		return reversedTimestamp;
	}
}

module.exports = {
	newTimestamp,
};