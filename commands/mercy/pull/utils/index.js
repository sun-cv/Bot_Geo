// Pull command Index

const { getMercyLimit } = require('./getMercyLimit');

/**
 * Database
 */

// Read

const { getCurrentPulls } = require('./database/read/getCurrentPulls');

// Write
const { incrementUser } = require('./database/write/incrementUser');
const { setUser } = require('../../utils/functions/database/writeFunctions/setUser');

module.exports = {
	getMercyLimit,
	// //Database
	// Read
	getCurrentPulls,
	// Write
	incrementUser,
	setUser,

	ignoreLoading: true,
};