const { db } = require('../../../../database/database');
const { beginTransaction, commitTransaction, transaction, rollbackTransaction } = require('../../../../database/utils/databaseIndex');

async function cleanLogs() {
	try {


		const log = {};

		await beginTransaction();
		const SEVEN_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
		const NINETY_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString();

		// Clean user_command_log
		log.userCommandLog = await db.get('SELECT COUNT(*) as count FROM user_command_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		if (log.userCommandLog > 0) {
			console.log(`${log.count} rows will be deleted from user_command_log`);
			await db.run('DELETE FROM user_command_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		}

		// Clean error_logs
		log.error_log = await db.get('SELECT COUNT(*) as count FROM error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		if (log.error_log > 0) {
			console.log(`${log.count} rows will be deleted from error_log`);
			await db.run('DELETE FROM error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		}
		log.tasks_error_log = await db.get('SELECT COUNT(*) as count FROM tasks_error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		if (log.tasks_error_log > 0) {
			console.log(`${log.count} rows will be deleted from tasks_error_log`);
			await db.run('DELETE FROM tasks_error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		}
		log.message_error_log = await db.get('SELECT COUNT(*) as count FROM message_error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		if (log.message_error_log > 0) {
			console.log(`${log.count} rows will be deleted from message_error_log`);
			await db.run('DELETE FROM message_error_log WHERE datetime(timestamp) < datetime(?)', SEVEN_DAYS_AGO);
		}
		// Clean inactive_users
		log.mercy_Tracker = await db.get('SELECT COUNT(*) as count FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', NINETY_DAYS_AGO);
		if (log.mercy_Tracker > 0) {
			console.log(`${log.count} rows will be deleted from mercy_tracker`);
			await db.run('DELETE FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', NINETY_DAYS_AGO);
		}
		log.mercy_accounts = await db.get('SELECT COUNT(*) as count FROM mercy_accounts WHERE last_active < ?', NINETY_DAYS_AGO);
		if (log.mercy_accounts > 0) {
			console.log(`${log.count} rows will be deleted from mercy_accounts`);
			await db.run('DELETE FROM mercy_accounts WHERE last_active < ?', NINETY_DAYS_AGO);
		}
		await commitTransaction();

		const totalCount = Object.values(log).reduce((a, b) => a + b.count, 0);

		if (totalCount === 0) {
			console.log('No logs to clear');
		}
		else if (totalCount > 0) {
			console.log('Logs cleaned successfully:', log.count);
		}
	}
	catch (error) {
		if (transaction.status) {
			await rollbackTransaction();
			console.log('Error detected in cleanLogs');
			throw error;
		}

	}
}


module.exports = {
	cleanLogs,
	task: true,

};