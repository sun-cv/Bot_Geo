const { loadCommands } = require('../Ιndex/loaders/loadCommands');
const { loadButtons } = require('../Ιndex/loaders/loadButtons');
const { loadEvents } = require('../Ιndex/loaders/loadEvents');


// Imports

const { TaskManager } = require('../tasks/taskManager/taskManager/taskManager');
const { getAutoCompleteUserAccounts } = require('../commands/mercy/functions/account/userAutoComplete');
const { handleMessage } = require('../events/messageHandler');
const { messageErrorHandling, delay, newTimestamp } = require('../utils/index');

module.exports = {
	loadCommands,
	loadButtons,
	loadEvents,


	// Imports
	TaskManager,
	getAutoCompleteUserAccounts,
	messageErrorHandling,
	delay,
	newTimestamp,
	handleMessage,
};