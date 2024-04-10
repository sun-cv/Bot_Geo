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
const { interactionErrorHandling } = require('./logging/errorHandling/interactionErrorHandling');
const { buttonErrorHandling } = require('./logging/errorHandling/buttonErrorHandling');
const { messageErrorHandling } = require('./logging/errorHandling/messageErrorHandling');
const { taskErrorHandling } = require('./logging/errorHandling/tasksErrorHandling');

// utils
const { replacer } = require('./logging');

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
const { sendFollowUpDelete } = require('./functions/utility/FollowupDelete');
const { addRoleToUser } = require('./functions/utility/addRoleToUser');

/**
 * ----------------
 * Logging
 * ----------------
 */

// user Logging
const { activateUpdateUser } = require('../database/utils/logging/activateUpdateUser');
const { updateAccountLastActive } = require('../database/utils/logging/updateAccountLastActive');
// user Command Logging
const { logUserCommand, commandLog } = require('./logging/functions/userCommandLogging/logUserCommand');
const { constructFullCommand } = require('./logging/functions/userCommandLogging/constructFullCommand');


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
	buttonErrorHandling,
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
	sendFollowUpDelete,
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