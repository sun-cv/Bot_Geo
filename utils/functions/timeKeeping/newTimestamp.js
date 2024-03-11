async function newTimestamp() {
	const newDate = new Date();
	const options = { timeZone: 'America/New_York' };
	const timestamp = newDate.toLocaleString('en-US', options);
	const [date, time] = timestamp.split(', ');
	const reversedTimestamp = `${time} ${date}`;
	return reversedTimestamp;
}

module.exports = {
	newTimestamp,
};