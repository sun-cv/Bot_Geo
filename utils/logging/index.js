const { updateProperties, updateLogInteraction, updateLogMember, updateLogCommand, updateLogButton, updateLogMessage, updateLogTask, updateLogError, updateLogTime } = require('./updateLog/logValues');
const { writeToDatabase } = require('./logToDatabase/writeToDatabase');
const { updateDatabase } = require('./logToDatabase/updateDatabase.js');
const { existingUser } = require('./functions/utils/existingMember');
const { logToConsole } = require('./logToConsole/logToConsole');
const { newTimestamp } = require('../../utils/functions/timeKeeping/newTimestamp');
const { replacer, tracerResponseTime, logUserCommand, existingMember } = require('./functions');
const { startLog, startCommandLog, startMessageLog, startButtonLog, startTaskLog } = require('./updateLog/initializeLog');
const { finalizeCommand, finalizeButton, finalizeMessage, finalizeTask } = require('./updateLog/finalizeLog');
const { errorHandling } = require('./errorHandling/errorHandling');
const { returnCommand } = require('./updateLog/updateLog');


module.exports = {

	newTimestamp,

	replacer,
	tracerResponseTime,
	logUserCommand,
	existingMember,

	startLog,
	startCommandLog,
	startMessageLog,
	startButtonLog,
	startTaskLog,


	updateProperties,

	updateLogInteraction,
	updateLogMember,
	updateLogCommand,
	updateLogButton,
	updateLogMessage,
	updateLogTask,
	updateLogError,
	updateLogTime,

	returnCommand,

	errorHandling,

	finalizeCommand,
	finalizeButton,
	finalizeMessage,
	finalizeTask,

	writeToDatabase,
	updateDatabase,

	existingUser,

	logToConsole,
};