const fs = require('fs');
const path = require('path');

// Path to your database file
const dbPath = 'D:/Projects/Bot_Geo/database/database.db';

// Path to the backup directory
const backupDir = 'D:/Projects/Bot_Geo/database/backup/day';

// Ensure the backup directory exists
if (!fs.existsSync(backupDir)) {
	fs.mkdirSync(backupDir);
}

// Function to backup the database
function dailyBackup() {
	try {

		// Create a date object
		const date = new Date();

		// Format the date
		const year = date.getFullYear();
		const month = ('0' + (date.getMonth() + 1)).slice(-2);
		const day = ('0' + date.getDate()).slice(-2);

		// Combine the parts
		const timestamp = `${year}-${month}-${day}`;

		// Path to the backup file
		const backupPath = path.join(backupDir, `backup_${timestamp}.db`);

		// Copy the database file to the backup directory
		fs.copyFileSync(dbPath, backupPath);

		console.log(`Database backed up to ${backupPath}`);

	}
	catch (error) {
		console.log('Error detected in dailyBackup');
		throw error;
	}
}
// Schedule the backup to run every 24 hours
module.exports = {
	dailyBackup,
	task: true };