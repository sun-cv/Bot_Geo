async function timeoutFallback(fn, timeoutMs, fallbackValue) {
	try {
		// Execute the inner function asynchronously
		const result = await Promise.race([
			fn,
			new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error('Timeout occurred'));
				}, timeoutMs);
			}),
		]);
		return result;
	}
	catch (error) {
		// Handle timeout or other errors
		console.error(`Error or timeout: ${fn}`);
		return fallbackValue;
	}
}

module.exports = {
	timeoutFallback,
};