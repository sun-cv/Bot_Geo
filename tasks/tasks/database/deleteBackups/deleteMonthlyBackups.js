const fs = require('fs');
const path = require('path');

const backupDirD = 'D:/Projects/Bot_Geo/database/backup/day';
const backupDirC = 'C:/Projects/backup/day';

const backupDirs = [
	backupDirD,
	backupDirC,
];
function deleteMonthlyBackups(task) {
	try {
		const currentDate = new Date();

		backupDirs.forEach(directory => {

			const files = fs.readdirSync(directory);

			for (const file of files) {

				const dateString = file.match(/\d{4}-\d{2}-\d{2}/)[0];
				const backupDate = new Date(dateString);

				const diffMonths = Math.floor((currentDate - backupDate) / (1000 * 60 * 60 * 24 * 30));

				if (diffMonths >= 12) {
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
	deleteMonthlyBackups,
};