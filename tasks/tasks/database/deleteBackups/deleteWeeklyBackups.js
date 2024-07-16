const fs = require('fs');
const path = require('path');

const backupDirD = 'D:/Projects/Bot_Geo/database/backup/week';
const backupDirC = 'C:/Projects/backup/week';

const backupDirs = [
	backupDirD,
	backupDirC,
];
function deleteWeeklyBackups(task) {
	try {
		const currentDate = new Date();

		backupDirs.forEach(directory => {

			const files = fs.readdirSync(directory);

			for (const file of files) {

				const dateString = file.match(/\d{4}-\d{2}-\d{2}/)[0];
				const backupDate = new Date(dateString);

				const diffWeeks = Math.floor((currentDate - backupDate) / (1000 * 60 * 60 * 24 * 7));

				if (diffWeeks >= 4) {
					const filePath = path.join(directory, file);
					fs.unlinkSync(filePath);
					console.log(`Deleted backup: ${filePath}`);
				}
			}
		});
	}
	catch (error) {
		task.errorHandling(error);
	}
}


module.exports = {
	deleteWeeklyBackups,
};