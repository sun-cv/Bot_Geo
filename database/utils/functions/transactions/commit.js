const { db } = require('../../../database');
const { transaction } = require('../../constants/transactions/transactionStatus');


async function commitTransaction() {
	await db.run('COMMIT');
	transaction.status = false;
}

module.exports = {
	commitTransaction,
};