// Database
const { db } = require('../../../../database/utils/databaseIndex');
// Mercy functions
const { insertUserTracker } = require('./database/writeFunctions/insertUserTracker');
const { insertUserAccount } = require('./database/writeFunctions/insertUserAccount');
// Interaction constants
const { getUserId, getUsername } = require('../../../../utils/functions/interactionIndex');


async function initializeMercy(interaction) {

	const messagetoggle = true;

	try {

		// Interaction constants
		const userId = getUserId(interaction);
		const username = getUsername(interaction);

		// get main user account
		const mercyMain = await db.get('SELECT * FROM mercy_accounts where user_id = ? AND account = "main"', userId);

		if (mercyMain) {
			return;
		}
		else {

			const account = 'main';
			// Insert main into into mercy_accounts
			await insertUserAccount(userId, username, account);

			// Insert main into mercy_tracker
			await insertUserTracker(userId, username, account);

			// Thank you message
			if (messagetoggle) {
				interaction.channel.send({ content: `Thank you <@${interaction.user.id}> for trying our Mercy Tracker!\n\n Your **main** account has been initialized; \n - this is your default account when using commands in the mercy system.\n - You can add alts with /register. `, ephemeral: true });
			}
		}
	}
	catch (error) {
		console.log('Error detected in initialize Mercy');
		throw error;
	}
}


module.exports = {
	initializeMercy,
};

