const { db } = require('../../../../database/utils/databaseIndex');


const autocompleteUserAccounts = {};

async function getAutoCompleteUserAccounts() {

	let userAccountsArray = [];

	try {
		userAccountsArray = await db.all('SELECT * FROM mercy_accounts');
	}
	catch (error) {console.log('No database exists for autocomplete');}

	try {
		// Populate the object without duplicates
		for (const account of userAccountsArray) {
			const { user_id, account: userAccount } = account;
			if (!autocompleteUserAccounts[user_id]) {
				// Initialize an empty array for the user if it doesn't exist
				autocompleteUserAccounts[user_id] = [];
			}
			if (!autocompleteUserAccounts[user_id].includes(userAccount)) {
				// Only add the account if it's not already in the list
				autocompleteUserAccounts[user_id].push(userAccount);
			}
		}
	}
	catch (error) {
		console.log('Error detected in autocompleteUserAccounts');
		throw error;
	}
}

async function updateAutoCompleteUserAccounts() {
	try {
		const freshUserAccountsArray = await db.all('SELECT * FROM mercy_accounts');

		// Create a map to store accounts for each user ID
		const freshAccountsMap = new Map();

		// Populate the map with fresh data
		for (const account of freshUserAccountsArray) {
			const { user_id, account: userAccount } = account;
			if (!freshAccountsMap.has(user_id)) {
				freshAccountsMap.set(user_id, new Set());
			}
			freshAccountsMap.get(user_id).add(userAccount);
		}

		// Update the autocompleteUserAccounts object
		for (const userId in autocompleteUserAccounts) {
			const existingAccounts = autocompleteUserAccounts[userId];
			const freshAccounts = freshAccountsMap.get(userId) || new Set();

			// Remove accounts not present in the fresh data
			autocompleteUserAccounts[userId] = existingAccounts.filter((account) =>
				freshAccounts.has(account),
			);
		}

	}
	catch (error) {
		console.log('Error detected in updateAutoCompleteUserAccounts:', error);
		throw error;
	}
}

module.exports = {
	getAutoCompleteUserAccounts,
	updateAutoCompleteUserAccounts,
	autocompleteUserAccounts,
	ignoreLoading: true,
};