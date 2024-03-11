// Data imports
const { getUserAccounts } = require('./functions/database/readFunctions/getUserAccounts');
const { getUserAccountsTotal } = require('./functions/database/readFunctions/getUserAccountsTotal');
const { getShardCount } = require('./functions/database/readFunctions/getShardCount');

// Initialization
const { initializeMercy } = require('./functions/initializeMercy');

// Mercy data input
const { insertUserTracker } = require('./functions/database/writeFunctions/insertUserTracker');
const { insertUserAccount } = require('./functions/database/writeFunctions/insertUserAccount');
const { setUser } = require('../utils/functions/database/writeFunctions/setUser');


module.exports = {
	// Data imports
	getUserAccounts,
	getUserAccountsTotal,
	// Initialization
	initializeMercy,
	// Mercy data input
	insertUserTracker,
	insertUserAccount,
	setUser,
	// Mercy data output
	getShardCount,
};