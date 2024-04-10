const sqlite3 = require('sqlite3').verbose();
const util = require('util');


// Connect to the SQLite database
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

	// Create an index on the user_id column
	await db.run('CREATE INDEX IF NOT EXISTS idx_user_id ON member (user_id);', (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	// Add a unique constraint to the user_id column
	await db.run('CREATE UNIQUE INDEX IF NOT EXISTS uq_user_id ON member (user_id);', (error) => {
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
	category TEXT,
	command TEXT,
	output TEXT DEFAULT none,
	status TEXT DEFAULT pending,
	error TEXT DEFAULT none,
	response_time TEXT,
	time TEXT,
	timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* MERCY ACCOUNTS
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_accounts (
	user_id TEXT NOT NULL,
	username TEXT NOT NULL,
	account TEXT,
	last_active TEXT,
	registration_date TEXT,
	PRIMARY KEY(user_id, username, account)
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});
	/**
 	* MERCY TRACKER
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS mercy_tracker (
	user_id TEXT NOT NULL,
	username TEXT NOT NULL,
	account TEXT NOT NULL,
	shard TEXT NOT NULL,
	count INTEGER DEFAULT 0,
	mythical_count INTEGER DEFAULT 0,
	legendary_count INTEGER DEFAULT 0,
	PRIMARY KEY(user_id, account, shard)
  )`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
	 * TASKS
	 */

	await db.run(`CREATE TABLE IF NOT EXISTS tasks (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	schedule TEXT NOT NULL,
	arguments TEXT,
	scheduled_at TEXT,
	last_execution TEXT,
	next_execution TEXT,
	failed TEXT,
	response_time TEXT,
	error TEXT,
	description TEXT,
	filepath TEXT,
	updated_at TEXT,
	created_at TEXT
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	* Golden Kappa
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS golden_kappa (
	kappa INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT,
	username TEXT,
	timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	*  ERROR LOG
 	*/

	await db.run(`CREATE TABLE IF NOT EXISTS error_log_command (
		error_id INTEGER PRIMARY KEY AUTOINCREMENT,
		guild_id,
		channel_id TEXT,
		user_id TEXT,
		username TEXT,
		command TEXT,
		error_name TEXT,
		error_message TEXT,
		stack_trace TEXT,
		interaction_args TEXT,
		response_time TEXT,
		time TEXT,
		timestamp TEXT NOT NULL
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS error_log_button (
		error_id INTEGER PRIMARY KEY AUTOINCREMENT,
		guild_id,
		channel_id TEXT,
		user_id TEXT,
		username TEXT,
		custom_id TEXT,
		error_name TEXT,
		error_message TEXT,
		stack_trace TEXT,
		interaction_args TEXT,
		response_time TEXT,
		time TEXT,
		timestamp TEXT NOT NULL
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	await db.run(`CREATE TABLE IF NOT EXISTS error_log_message (
		error_id INTEGER PRIMARY KEY AUTOINCREMENT,
		guild_id,
		channel_id TEXT,
		user_id TEXT,
		username TEXT,
		content TEXT,
		error_name TEXT,
		error_message TEXT,
		stack_trace TEXT,
		interaction_args TEXT,
		response_time TEXT,
		time TEXT,
		timestamp TEXT NOT NULL
	)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	await db.run(`CREATE TABLE IF NOT EXISTS error_log_task (
				error_id INTEGER PRIMARY KEY AUTOINCREMENT,
				task TEXT,
				scheduled_at TEXT,
				next_execution TEXT,
				failed_at TEXT,
				error_name TEXT,
				error_message TEXT,
				stack_trace TEXT,
				response_time TEXT,
				time TEXT,
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
	createDatabase,
};
