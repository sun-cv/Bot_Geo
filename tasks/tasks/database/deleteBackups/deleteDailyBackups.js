const fs = require('fs');
const path = require('path');

const backupDirD = 'D:/Projects/Bot_Geo/database/backup/day';
const backupDirC = 'C:/Projects/backup/day';


const backupDirs = [
	backupDirD,
	backupDirC,
];
// Function to delete backups older than 7 days
function deleteDailyBackups(task) {
	try {
		// Get the current date
		const currentDate = new Date();

		// Iterate over each directory
		backupDirs.forEach(directory => {
			// Get the list of backup files
			const files = fs.readdirSync(directory);

			// Iterate over each file
			for (const file of files) {
				// Extract the date portion from the file name (e.g., 'backup_2024-03-10.db')
				const dateString = file.match(/\d{4}-\d{2}-\d{2}/)[0];
				const backupDate = new Date(dateString);

				// Calculate the difference in days between the current date and the backup date
				const diffDays = Math.floor((currentDate - backupDate) / (1000 * 60 * 60 * 24));

				// If the file is 7 days old or older, delete it
				if (diffDays >= 7) {
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


// Schedule the deletion to run every 24 hours
module.exports = {
	deleteDailyBackups,
	task: true };