const { getUserAccounts } = require('./database/readFunctions/getUserAccounts');


async function userAccountExists(interaction, log) {

	let output;

	const userId = log.member.id;

	try {

		const accountInput = interaction.options.getString('account');
		// Get known accounts
		const userAccounts = await getUserAccounts(userId);

		// Get known accounts
		// default user account
		const userAccountObject = userAccounts.find(account => account.account === 'main');
		let userAccount = userAccountObject.account;

		// Confirm account exists
		if (userAccounts.some(user => user.account === accountInput)) {
			userAccount = accountInput;
		}
		else if (accountInput !== null) {
			output = `${accountInput} was not found. Use /register list to confirm account details`;
			interaction.followUp({ content: `${output}`, ephemeral: true });

			log.returnCommand('failed', 'account not found', output);
			return false;
		}

		return userAccount;
	}
	catch (error) {
		log.error(error);
	}
}

module.exports = {
	userAccountExists,
};