function newTimestamp(returnTime, pastStamp) {
	let newDate = new Date();
	if (pastStamp) newDate = new Date(pastStamp);
	const options = { timeZone: 'America/New_York' };
	const timestamp = newDate.toLocaleString('en-US', options);
	const [date, time] = timestamp.split(', ');
	const [day, month, year] = date.split('/');
	const dayTimestamp = `${day}`;
	const monthTimestamp = `${month}`;
	const yearTimestamp = `${year}`;
	const dayMonthTimestamp = `${day}/${month}`;
	const reversedTimestamp = `${time} ${date}`;
	const hourTimestamp = `${time}`;
	const dateTimestamp = `${date}`;
	const unixTimestamp = Date.now();
	const isoTimeStamp = new Date().toISOString();

	if (returnTime === 'hour') {
		return hourTimestamp;
	}
	else if (returnTime === 'day') {
		return dayTimestamp;
	}
	else if (returnTime === 'month') {
		return monthTimestamp;
	}
	else if (returnTime === 'year') {
		return yearTimestamp;
	}
	else if (returnTime === 'm/d') {
		return dayMonthTimestamp;
	}
	else if (returnTime === 'date') {
		return dateTimestamp;
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