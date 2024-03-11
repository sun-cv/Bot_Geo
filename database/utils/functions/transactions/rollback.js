const { db } = require('../../../database');
const { transaction } = require('../../constants/transactions/transactionStatus');


async function rollbackTransaction() {
	await db.run('ROLLBACK');
	transaction.status = false;
}

module.exports = {
	rollbackTransaction,
};