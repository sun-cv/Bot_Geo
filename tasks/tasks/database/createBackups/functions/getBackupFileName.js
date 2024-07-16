async function getBackupFileName() {
	const date = new Date();
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	return `backup_${year}-${month}-${day}.db`;
}

module.exports = {
	getBackupFileName,
};