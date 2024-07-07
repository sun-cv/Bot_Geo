// Data imports
const { getUserAccounts } = require('./functions/database/readFunctions/getUserAccounts');
const { getUserAccountsTotal } = require('./functions/database/readFunctions/getUserAccountsTotal');
const { getShardCount } = require('./functions/database/readFunctions/getShardCount');

// Initialization
const { initializeMercy } = require('./functions/initializeMercy');
const { userAccountExists } = require('./functions/userAccountExists');

// Mercy data input
const { insertUserTracker } = require('./functions/database/writeFunctions/insertUserTracker');
const { insertUserAccount } = require('./functions/database/writeFunctions/insertUserAccount');
const { setUser } = require('./functions/database/writeFunctions/setUser');


module.exports = {
	// Data imports
	getUserAccounts,
	getUserAccountsTotal,
	// Initialization
	initializeMercy,
	userAccountExists,
	// Mercy data input
	insertUserTracker,
	insertUserAccount,
	setUser,
	// Mercy data output
	getShardCount,

	ignoreLoading: true,
};