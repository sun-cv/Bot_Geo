/**
 * ----------------
 * Constant imports
 * ----------------
 */

const {
	shardIdentifiers,
	identifierEmojis,
	mercyConditions,
	shardColor,
} = require('./utils/constantsIndex');

/**
 * ----------------
 * Function imports
 * ----------------
 */

const {
	getUserAccounts,
	getUserAccountsTotal,
	initializeMercy,
	insertUserTracker,
	insertUserAccount,
	getShardCount,
	setUser,
} = require('./utils/functionIndex');


module.exports = {
	// Constants
	shardIdentifiers,
	identifierEmojis,
	mercyConditions,
	shardColor,
	// Data imports
	getUserAccounts,
	getUserAccountsTotal,
	getShardCount,
	// Data Write
	setUser,
	// Initialization
	initializeMercy,
	// Mercy data input
	insertUserTracker,
	insertUserAccount,
	// Mercy data output

	ignoreLoading: true,
};
