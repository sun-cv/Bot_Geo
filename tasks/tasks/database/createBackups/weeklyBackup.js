const fs = require('fs');
const path = require('path');
const { newTimestamp } = require('../../../../utilities/functions/time/newTimestamp');
const { getBackupFileName } = require('./functions/getBackupFileName');
const { createBackupDirectories } = require('./functions/createBackupDirectories');

const dbPath = 'D:/Projects/Bot_Geo/database/database.db';
const backupDirD = 'D:/Projects/Bot_Geo/database/backup/week';
const backupDirC = 'C:/Projects/backup/week';

const backupDirs = [
	backupDirD,
	backupDirC,
];

async function weeklyBackup(task) {
	try {
		await createBackupDirectories (backupDirs);

		const timestamp = await newTimestamp('hour');

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

module.exports = {
	weeklyBackup,
};