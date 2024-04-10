function replacer(key, value) {
	if (typeof value === 'bigint') {
		return value.toString();
	}
	else {
		return value;
	}
}

module.exports = { replacer };