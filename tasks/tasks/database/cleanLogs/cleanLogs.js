const { db } = require('../../../../database/database');

const sevenDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
const ninetyDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString();

const tableToTimestamp = {
	'command_log': { timestamp: 'timestamp', date: sevenDays },

	'error_log_command': { timestamp: 'timestamp', date: sevenDays },
	'error_log_button': { timestamp: 'timestamp', date: sevenDays },
	'error_log_message': { timestamp: 'timestamp', date: sevenDays },
	'error_log_task': { timestamp: 'timestamp', date: sevenDays },

	'mercy_accounts': { timestamp: 'last_active', date: ninetyDays },
};


async function cleanTable(tableName, dateColumnName, date) {
	try {
		const countResult = await db.get(`SELECT COUNT(*) as count FROM ${tableName} WHERE datetime(${dateColumnName}) < datetime(?)`, date);
		if (countResult.count > 0) {
			console.log(`${countResult.count} rows will be deleted from ${tableName}`);
			await db.run(`DELETE FROM ${tableName} WHERE datetime(${dateColumnName}) < datetime(?)`, date);
		}
		return countResult.count;
	}
	catch (error) {
		console.log(error);
	}
}

async function cleanLogs(task) {
	try {

		const log = {};

		for (const tableName of Object.keys(tableToTimestamp)) {
			const { timestamp, date } = tableToTimestamp[tableName];
			log[tableName] = await cleanTable(tableName, timestamp, date);
		}

		log.mercy_Tracker = (await db.get('SELECT COUNT(*) as count FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', ninetyDays)).count || 0;
		if (log.mercy_Tracker.count > 0) {
			console.log(`${log.mercy_Tracker.count} rows will be deleted from mercy_tracker`);
			await db.run('DELETE FROM mercy_tracker WHERE (user_id, account) IN (SELECT user_id, account FROM mercy_accounts WHERE last_active < ?)', ninetyDays);
		}

		const totalCount = Object.values(log).reduce((total, count) => total + count, 0);

		if (totalCount === 0) {
			console.log('No logs to clear');
		}
		else if (totalCount > 0) {
			console.log('Logs cleaned successfully:', totalCount);
		}

	}
	catch (error) {
		if (task) {
			task.errorHandling(error);
		}

		console.log(error);

	}
}


module.exports = {
	cleanLogs,
	task: true,

};

