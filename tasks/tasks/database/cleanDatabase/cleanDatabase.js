const { db } = require('../../../../database/database');

const sevenDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString();
const ninetyDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString();

const logTables = {
	'command_log': { column: 'timestamp', date: sevenDays },
};

const mercyTables = ['champions', 'data', 'accounts'];

async function cleanDatabase() {
	try {
		for (const table in logTables) {
			await cleanLogs(table);
		}
		for (const table of mercyTables) {
			await cleanMercy(table);
		}
	}
	catch (error) {
		console.log(error);
	}
}

async function cleanLogs(table) {
	try {
		const column = logTables[table].column;
		const date = logTables[table].date;
		await db.run(`DELETE FROM ${table} WHERE datetime(${column}) < datetime(?)`, date);
	}
	catch (error) {
		console.log(error);
	}
}

async function cleanMercy(table) {
	try {
		await db.run(`DELETE FROM mercy_tracker_${table} WHERE (id, name) IN (SELECT id, name FROM mercy_tracker_accounts WHERE lastActive < ?)`, ninetyDays);
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	cleanDatabase,
};

