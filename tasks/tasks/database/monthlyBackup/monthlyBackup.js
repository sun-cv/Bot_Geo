const fs = require('fs');
const path = require('path');
const { newTimestamp } = require('../../../../utils/functions/timeKeeping/newTimestamp');
const { getBackupFileName } = require('../utils/getBackupFileName');
const { createBackupDirectories } = require('../utils/createBackupDirectories');

// Define paths
const dbPath = 'D:/Projects/Bot_Geo/database/database.db';
const backupDirC = 'C:/Projects/backup/month';
const backupDirD = 'D:/Projects/Bot_Geo/database/backup/month';

const backupDirs = [
	backupDirD,
	backupDirC,
];

// Backup the database
async function monthlyBackup() {
	try {
		await createBackupDirectories (backupDirs);

		const timestamp = await newTimestamp('hour');

		const fileName = await getBackupFileName();
		const backupPathD = path.join(backupDirD, fileName);
		const backupPathC = path.join(backupDirC, fileName);

		fs.copyFileSync(dbPath, backupPathD);
		fs.copyFileSync(dbPath, backupPathC);

		console.log(`${timestamp}: Monthly database backed up to ${backupPathC}`);
		console.log(`${timestamp}: Monthly database backed up to ${backupPathD}`);

	}
	catch (error) {
		console.error('Error detected in monthlyBackup:', error.message);
		throw error;
	}
}

// Schedule the backup to run every 24 hours
module.exports = {
	monthlyBackup,
	task: true,
};