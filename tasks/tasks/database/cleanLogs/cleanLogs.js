const { db } = require('../../../../database/database');

async function cleanLogs() {
	try {

		const log = {};

		const sevenDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
		const ninetyDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString();

		// Clean user_command_log
		log.userCommandLog = await db.get('SELECT COUNT(*) as count FROM user_command_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		if (log.userCommandLog.count > 0) {
			console.log(`${log.userCommandLog.count} rows will be deleted from user_command_log`);
			await db.run('DELETE FROM user_command_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		}

		// Clean error_logs
		log.error_log = await db.get('SELECT COUNT(*) as count FROM error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		if (log.error_log.count > 0) {
			console.log(`${log.error_log.count} rows will be deleted from error_log`);
			await db.run('DELETE FROM error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		}
		log.tasks_error_log = await db.get('SELECT COUNT(*) as count FROM tasks_error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		if (log.tasks_error_log.count > 0) {
			console.log(`${log.tasks_error_log.count} rows will be deleted from tasks_error_log`);
			await db.run('DELETE FROM tasks_error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		}
		log.message_error_log = await db.get('SELECT COUNT(*) as count FROM message_error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		if (log.message_error_log.count > 0) {
			console.log(`${log.message_error_log.count} rows will be deleted from message_error_log`);
			await db.run('DELETE FROM message_error_log WHERE datetime(timestamp) < datetime(?)', sevenDays);
		}
		// Clean inactive_users
		log.mercy_Tracker = await db.get('SELECT COUNT(*) as count FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', ninetyDays);
		if (log.mercy_Tracker.count > 0) {
			console.log(`${log.mercy_Tracker.count} rows will be deleted from mercy_tracker`);
			await db.run('DELETE FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', ninetyDays);
		}
		log.mercy_accounts = await db.get('SELECT COUNT(*) as count FROM mercy_accounts WHERE last_active < ?', ninetyDays);
		if (log.mercy_accounts.count > 0) {
			console.log(`${log.mercy_accounts.count} rows will be deleted from mercy_accounts`);
			await db.run('DELETE FROM mercy_accounts WHERE last_active < ?', ninetyDays);
		}

		const totalCount = Object.values(log).reduce((total, logType) => total + logType.count, 0);

		if (totalCount === 0) {
			console.log('No logs to clear');
		}
		else if (totalCount > 0) {
			console.log('Logs cleaned successfully:', log.count);
		}
	}
	catch (error) {
		console.log('Error detected in cleanLogs');
		throw error;
	}
}


module.exports = {
	cleanLogs,
	task: true,

};