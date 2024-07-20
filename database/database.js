const sqlite3 = require('sqlite3').verbose();
const util = require('util');


const db = new sqlite3.Database('./database/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Geo Connected to the database.');

});

db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// Create Geo DB

/**
 * USER
 */

async function createDatabase() {

	await db.run(`CREATE TABLE IF NOT EXISTS member (
		guild_id TEXT, 
		user_id TEXT PRIMARY KEY,
		username TEXT NOT NULL,
		accounts INTEGER DEFAULT 0,
		last_command TEXT,
		command_count INTEGER DEFAULT 0,
		button_count INTEGER DEFAULT 0,
		message_count INTEGER DEFAULT 0,
		error_count INTEGER DEFAULT 0,
		last_active TEXT,
		registration_date TEXT
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* COMMAND LOG
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS command_log (
		guild_id TEXT NOT NULL,
		channel_id TEXT NOT NULL,
		user_id TEXT NOT NULL,
		username TEXT NOT NULL,
		command TEXT,
		output TEXT,
		error TEXT,
		response_time TEXT,
		time TEXT,
		timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* MERCY TRACKER V2.0
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_accounts (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		main TEXT NOT NULL,
		data TEXT,
		template TEXT,
		lastActive TEXT,
		registered TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_data (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		shard TEXT NOT NULL,
		count INTEGER DEFAULT 0,
		totalCount INTEGER DEFAULT 0,
		lastAdded INTEGER DEFAULT 0,
		lastPulled TEXT,
		lastReset TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker_champions (
		id TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		shard TEXT NOT NULL,
		champion TEXT NOT NULL,
		lastCount TEXT NOT NULL,
		monthDay TEXT NOT NULL,
		timestamp TEXT NOT NULL

	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
	 * CLAN MANAGER
	 */


	await db.run(`CREATE TABLE IF NOT EXISTS clan_manager_clans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		data TEXT,
		admin TEXT,
		recruiting TEXT,
		member TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS clan_manager_members (
		id TEXT NOT NULL,
		name TEXT NOT NULL,
		discord TEXT,
		status TEXT, 
		info TEXT,
		admin TEXT,
		record TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS clan_manager_accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		memberId TEXT NOT NULL,
		member TEXT NOT NULL,
		name TEXT NOT NULL,
		type TEXT,
		info TEXT,
		clan TEXT,
		stats TEXT,
		admin TEXT,
		record TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS clan_manager_applications (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		memberId TEXT,
		member TEXT,
		account TEXT,
		status TEXT DEFAULT pending,
		type TEXT,
		response TEXT,
		clan TEXT,
		info TEXT,
		admin TEXT,
		timestamp TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS clan_manager_reminders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		type TEXT,
		task_name TEXT,
		description TEXT,
		user_name TEXT,
		user_id TEXT,
		channel_id TEXT,
		command TEXT,
		arguments TEXT,
		input TEXT,
		cron TEXT,
		cycle TEXT,
		count TEXT,
		scheduled_at TEXT,
		last_execution TEXT,
		next_execution TEXT,
		response_time TEXT,
		failed_at TEXT,
		error TEXT,
		updated_at TEXT,
		created_at TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
	 * TASKS
	 */

	await db.run(`CREATE TABLE IF NOT EXISTS tasks_system (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		arguments TEXT,
		cron TEXT,
		data TEXT
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	* Golden Kappa
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS tasks_golden_kappa (
	kappa INTEGER PRIMARY KEY AUTOINCREMENT,
	id TEXT,
	username TEXT,
	timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

}

createDatabase();

module.exports = {
	db,
};
