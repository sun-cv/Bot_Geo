const fs = require('fs');
const path = require('path');
const { newTimestamp } = require('../../../../utilities/functions/time/newTimestamp');
const { getBackupFileName } = require('./functions/getBackupFileName');
const { createBackupDirectories } = require('./functions/createBackupDirectories');

const dbPath = 'D:/Projects/Bot_Geo/database/database.db';
const backupDirC = 'C:/Projects/backup/month';
const backupDirD = 'D:/Projects/Bot_Geo/database/backup/month';

const backupDirs = [
	backupDirD,
	backupDirC,
];

async function monthlyBackup(task) {
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
		task.errorHandling(error);
	}
}

module.exports = {
	monthlyBackup,
};