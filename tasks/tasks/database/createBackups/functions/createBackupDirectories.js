const fs = require('fs');

async function createBackupDirectories(directories) {

	directories.forEach(directory => {

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory);
		}

	});
}

module.exports = {
	createBackupDirectories,
};