const { getMemberAccounts } = require('../../functions/account/getMemberAccounts');

async function checkAccountLimit(interaction) {

	try {

		const accounts = await getMemberAccounts(interaction);

		if (accounts.length >= 10) return true;

		return false;

	}
	catch (error) {
		console.log(error);
	}

}

module.exports = {
	checkAccountLimit,
};