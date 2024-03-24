/**
 *----------------
 * UTILS
 *----------------
 */

/**
 * ----------------
 * Error handling
 * ----------------
 */

// event error handling
const { interactionErrorHandling } = require('./errorHandling/interactionErrorHandling');
const { messageErrorHandling } = require('./errorHandling/messageErrorHandling');
const { taskErrorHandling } = require('./errorHandling/tasksErrorHandling');
// function error handling
const { localErrorLogging } = require('./errorHandling/localErrorLogging');
const { logErrorToDatabase } = require('./errorHandling/logErrorToDatabase');
// utils
const { replacer } = require('./errorHandling/functions/bigIntReplacer');

/**
 * ----------------
 * Functions
 * ----------------
 */

// stylistic
const { logColor } = require('./functions/stylistic/logColor');
// time keeping
const { newTimestamp } = require('./functions/timeKeeping/newTimestamp');
// undesignated
const { getRandomEmoji } = require('./functions/undesignated/getRandomEmoji');
// utility
const { delay } = require('./functions/utility/delay');
const { timeoutFallback } = require('./functions/utility/timeoutFallback');

/**
 * ----------------
 * Logging
 * ----------------
 */

// user Logging
const { activateUpdateUser } = require('./logging/activateUpdateUser');
const { updateAccountLastActive } = require('./logging/updateAccountLastActive');
// user Command Logging
const { logUserCommand, commandLog } = require('./logging/UserCommandLogging/LogUserCommand');
const { constructFullCommand } = require('./logging/UserCommandLogging/constructFullCommand');
const { addRoleToUser } = require('./functions/utility/addRoleToUser');

/**
 * ----------------
 * Interaction index
 * ----------------
 */

const { getUserId, getUsername, getChannelId, getMessageId } = require('./functions/interactionIndex');


module.exports = {
	// error handling
	// event error handling
	interactionErrorHandling,
	localErrorLogging,
	logErrorToDatabase,
	// function error handling
	messageErrorHandling,
	taskErrorHandling,
	// utils
	replacer,

	// // functions
	// stylistic
	logColor,
	// time keeping
	newTimestamp,
	// undesignated
	getRandomEmoji,
	// utility
	delay,
	timeoutFallback,
	addRoleToUser,

	// // Logging
	// user Logging
	constructFullCommand,
	logUserCommand,
	commandLog,
	// user Command Logging
	activateUpdateUser,
	updateAccountLastActive,

	// // Interaction index
	getUserId,
	getUsername,
	getChannelId,
	getMessageId,
};