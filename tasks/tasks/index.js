/**
 *
 * All Tasks
 *
 */

/**
     * Community
     */

const goldenKappa = {
	name: 'goldenKappa',
	schedule: '0 0 * * *',
	arguments: 'client',
	description: 'Switches goldenKappa role to new user at midnight',
	filepath: 'community/goldenKappa',
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};

/**
* Database
*/
const dailyBackup = {
	name: 'dailyBackup',
	schedule: '0 0 * * *',
	arguments: 'none',
	description: 'Daily backup at midnight to database/backup/day',
	filepath: 'database/dailyBackup',
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};

const weeklyBackup = {
	name: 'weeklyBackup',
	schedule: '0 0 * * 0',
	arguments: 'none',
	description: 'weekly backup at midnight to database/backup/week',
	filepath: 'database/weeklyBackup',
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};

const monthlyBackup = {
	name: 'monthlyBackup',
	schedule: '0 0 1 * *',
	arguments: 'none',
	description: 'monthly backup at midnight to database/backup/month',
	filepath: 'database/monthlyBackup',
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};

const deleteDailyBackups = {
	name: 'deleteDailyBackups',
	schedule: '5 0 * * *',
	arguments: 'none',
	description: 'Delete excess daily backups every day at 5 past midnight',
	filepath: 'database/deleteBackups',
	updated_at: '12:30 AM 3/10/2024',
	created_at: '12:30 AM 3/10/2024',
};

const deleteWeeklyBackups = {
	name: 'deleteWeeklyBackups',
	schedule: '5 0 * * 0',
	arguments: 'none',
	description: 'Delete excess weekly backups Sunday at 5 past midnight',
	filepath: 'database/deleteBackups',
	updated_at: '12:30 AM 3/10/2024',
	created_at: '12:30 AM 3/10/2024',
};

const cleanLogs = {
	name: 'cleanLogs',
	schedule: '5 0 * * *',
	arguments: 'none',
	description: 'Clean excess logs at midnight',
	filepath: 'database/cleanLogs',
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};

const test = {
	name: 'test',
	schedule: '* * * * *',
	arguments: 'none',
	description: 'Clean excess logs at midnight',
	filepath: null,
	updated_at: '11:30 AM 3/9/2024',
	created_at: '11:30 AM 3/9/2024',
};


const tasks = {
	goldenKappa,
	dailyBackup,
	weeklyBackup,
	monthlyBackup,
	deleteDailyBackups,
	deleteWeeklyBackups,
	cleanLogs,

};


module.exports = {
	tasks,
};