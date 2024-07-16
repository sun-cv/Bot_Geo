const fs = require('fs');
const path = require('path');
const { newTimestamp } = require('../../../../utilities/functions/time/newTimestamp');
const { getBackupFileName } = require('./functions/getBackupFileName');
const { createBackupDirectories } = require('./functions/createBackupDirectories');

const dbPath = 'D:/Projects/Bot_Geo/database/database.db';
const backupDirC = 'C:/Projects/backup/day';
const backupDirD = 'D:/Projects/Bot_Geo/database/backup/day';

const backupDirs = [
	backupDirD,
	backupDirC,
];

async function dailyBackup(task) {
	try {
		await createBackupDirectories (backupDirs);

		const timestamp = await newTimestamp('hour');

		const fileName = await getBackupFileName();
		const backupPathD = path.join(backupDirD, fileName);
		const backupPathC = path.join(backupDirC, fileName);

		fs.copyFileSync(dbPath, backupPathD);
		fs.copyFileSync(dbPath, backupPathC);

		console.log(`${timestamp}: Daily database backed up to ${backupPathC}`);
		console.log(`${timestamp}: Daily database backed up to ${backupPathD}`);

	}
	catch (error) {
		task.errorHandling(error);
	}
}

module.exports = {
	dailyBackup,
};