const { db } = require('../../database/database');


const autocompleteUserAccounts = {};

async function getAutoCompleteUserAccounts() {
	try {

		const userAccounts = await db.all('SELECT * FROM mercy_tracker_accounts');

		for (const userAccount of userAccounts) {

			const { id, name } = userAccount;

			if (!autocompleteUserAccounts[id]) {
				autocompleteUserAccounts[id] = [];
			}
			if (!autocompleteUserAccounts[id].includes(name)) {
				autocompleteUserAccounts[id].push(name);
			}
		}
	}
	catch (error) {
		console.log(error);
	}
}

async function updateAutoCompleteUserAccounts() {
	try {
		const freshUserAccounts = await db.all('SELECT * FROM mercy_tracker_accounts');
		const freshAccountsMap = {};

		for (const userAccount of freshUserAccounts) {
			const { id, name } = userAccount;

			if (!freshAccountsMap[id]) {
				freshAccountsMap[id] = [];
			}
			if (!freshAccountsMap[id].includes(name)) {
				freshAccountsMap[id].push(name);
			}
		}

		for (const account in autocompleteUserAccounts) {
			if (freshAccountsMap[account]) {
				autocompleteUserAccounts[account] = freshAccountsMap[account];
			}
			else {
				delete autocompleteUserAccounts[account];
			}
		}

		for (const account in freshAccountsMap) {
			if (!autocompleteUserAccounts[account]) {
				autocompleteUserAccounts[account] = freshAccountsMap[account];
			}
		}
	}
	catch (error) {
		console.log(error);
	}
}


module.exports = {
	getAutoCompleteUserAccounts,
	updateAutoCompleteUserAccounts,
	autocompleteUserAccounts,
	ignoreLoading: true,
};