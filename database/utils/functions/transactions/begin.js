const { db } = require('../../../database');
const { transaction } = require('../../constants/transactions/transactionStatus');


async function beginTransaction() {
	await db.run('BEGIN TRANSACTION');
	transaction.status = true;
}

module.exports = {
	beginTransaction,
};