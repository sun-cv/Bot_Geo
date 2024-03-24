/* eslint-disable prefer-const */
// Database
const { db } = require('../database');

// Transaction handling
const { transaction } = require('./constants/transactions/transactionStatus');
const { beginTransaction } = require('./functions/transactions/begin');
const { commitTransaction } = require('./functions/transactions/commit');
const { rollbackTransaction } = require('./functions/transactions/rollback');

// Confirms user exists, if not adds - (userId, username)
const { ensureUserExists } = require('../../utils/logging/activateUpdateUser');

module.exports = {
	// Database
	db,
	// Transaction handling
	transaction,
	beginTransaction,
	commitTransaction,
	rollbackTransaction,
	// Confirm user
	ensureUserExists,

};