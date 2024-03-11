// Database
const { db, transaction, beginTransaction, commitTransaction, rollbackTransaction } = require('../../../../database/utils/databaseIndex');

// Mercy functions
const { insertUserTracker } = require('./database/writeFunctions/insertUserTracker');
const { insertUserAccount } = require('./database/writeFunctions/insertUserAccount');

// Interaction constants
const { getUserId, getUsername } = require('../../../../utils/functions/interactionIndex');


async function initializeMercy(interaction) {

	const messagetoggle = false;

	try {
		await beginTransaction();

		// Interaction constants
		const userId = getUserId(interaction);
		const username = getUsername(interaction);

		// get main user account
		const mercyMain = await db.get('SELECT * FROM mercy_accounts where user_id = ? AND account = "main"', userId);

		// if main does not exist
		if (!mercyMain) {

			const account = 'main';
			// Insert main into into mercy_accounts
			await insertUserAccount(userId, username, account);

			// Insert main into mercy_tracker
			await insertUserTracker(userId, username, account);

			// COMMIT
			await commitTransaction();

			// Thank you message
			if (messagetoggle) {
				const message = await interaction.channel.send(`Thank you <@${interaction.user.id}> for trying our Mercy Tracker!\n\n Your **main** account has been initialized; \n - this is your default account when using commands in the mercy system.\n - You can add alts with /register. `);
				// Delete message
				setTimeout(() => {
					message.delete();
				}, 10000);
			}
		}
		else {
			await rollbackTransaction();
		}
	}
	catch (error) {
		if (transaction.status) {
			await rollbackTransaction();
		}
		console.log('Error detected in initialize Mercy');
		throw error;
	}
}


module.exports = {
	initializeMercy,
};

