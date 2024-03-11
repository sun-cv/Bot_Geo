// Catch transaction status for error handling
let transactionStarted = false;

const transaction = {
	get status() {
		return transactionStarted;
	},
	set status(value) {
		transactionStarted = value;
	},

};

module.exports = {
	transaction,
};