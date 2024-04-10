const fs = require('fs');
const path = require('path');
const { newTimestamp } = require('../../../../utils/functions/timeKeeping/newTimestamp');
const { getBackupFileName } = require('../utils/getBackupFileName');
const { createBackupDirectories } = require('../utils/createBackupDirectories');

// Define paths
const dbPath = 'D:/Projects/Bot_Geo/database/database.db';
const backupDirD = 'D:/Projects/Bot_Geo/database/backup/week';
const backupDirC = 'C:/Projects/backup/week';

const backupDirs = [
	backupDirD,
	backupDirC,
];

// Backup the database
async function weeklyBackup(task) {
	try {
		await createBackupDirectories (backupDirs);

		const timestamp = newTimestamp('hour');

		const fileName = await getBackupFileName();
		const backupPathD = path.join(backupDirD, fileName);
		const backupPathC = path.join(backupDirC, fileName);

		fs.copyFileSync(dbPath, backupPathD);
		fs.copyFileSync(dbPath, backupPathC);

		console.log(`${timestamp}: Weekly database backed up to ${backupPathC}`);
		console.log(`${timestamp}: Weekly database backed up to ${backupPathD}`);

	}
	catch (error) {
		task.errorHandling(error);
	}
}

// Schedule the backup to run every 24 hours
module.exports = {
	weeklyBackup,
	task: true,
};