const { sendFollowUpDelete } = require('../utilities/functions/interaction/sendFollowupDelete');
const { modCheck } = require('../utilities/functions/roles/modCheck');
const { requireRoles } = require('../utilities/functions/roles/requireRoles');
const { delay } = require('../utilities/functions/time/delay');
const { newTimestamp } = require('../utilities/functions/time/newTimestamp');

module.exports = {
	newTimestamp,
	delay,
	modCheck,
	requireRoles,
	sendFollowUpDelete,
};