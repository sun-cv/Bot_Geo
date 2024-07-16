const delay = (ms, callback) => new Promise((resolve) => setTimeout(() => {
	if (callback) callback();
	resolve();
}, ms));

module.exports = {
	delay,
};