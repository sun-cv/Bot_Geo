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

	await db.run (`CREATE TABLE IF NOT EXISTS user (
	user_id TEXT PRIMARY KEY,
	username TEXT NOT NULL,
	accounts INTEGER DEFAULT 0,
	last_command TEXT,
	command_count INTEGER DEFAULT 0,
	error_count INTEGER DEFAULT 0,
	last_active TEXT,
	registration_date TEXT
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	// Create an index on the user_id column
	await db.run('CREATE INDEX IF NOT EXISTS idx_user_id ON user (user_id);', (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	// Add a unique constraint to the user_id column
	await db.run('CREATE UNIQUE INDEX IF NOT EXISTS uq_user_id ON user (user_id);', (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* COMMAND LOG
 	*/

	await db.run (`CREATE TABLE IF NOT EXISTS user_command_log (
	channel_id TEXT NOT NULL,
	message_id TEXT,
	user_id TEXT NOT NULL,
	username TEXT NOT NULL,
	category TEXT,
	command TEXT,
	output TEXT DEFAULT none,
	status TEXT DEFAULT pending,
	error TEXT DEFAULT none,
	time TEXT,
	timestamp TEXT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES user(user_id)
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* MERCY ACCOUNTS
 	*/

	await db.run (`CREATE TABLE IF NOT EXISTS mercy_accounts (
	user_id TEXT NOT NULL,
	username TEXT NOT NULL,
	account TEXT,
	last_active TEXT,
	registration_date TEXT,
	PRIMARY KEY(user_id, username, account),
	FOREIGN KEY(user_id) REFERENCES user(user_id)
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	// Create an index on the user_id column
	await db.run('CREATE INDEX IF NOT EXISTS idx_user_id_mercy_accounts ON mercy_accounts (user_id);', (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	* MERCY TRACKER
 	*/

	await db.run (`CREATE TABLE IF NOT EXISTS mercy_tracker (
	user_id TEXT NOT NULL,
	username TEXT NOT NULL,
	account TEXT NOT NULL,
	shard TEXT NOT NULL,
	count INTEGER DEFAULT 0,
	mythical_count INTEGER DEFAULT 0,
	legendary_count INTEGER DEFAULT 0,
	PRIMARY KEY(user_id, account, shard),
	FOREIGN KEY(user_id) REFERENCES user(user_id)
  )`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	// Create an index on the user_id column
	await db.run('CREATE INDEX IF NOT EXISTS idx_user_id_mercy_tracker ON mercy_tracker (user_id);', (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	*  ERROR LOG
 	*/

	await db.run (`CREATE TABLE IF NOT EXISTS error_log (
	error_id INTEGER PRIMARY KEY AUTOINCREMENT,
	channel_id TEXT,
	user_id TEXT,
	username TEXT,
	command TEXT,
	error_name TEXT,
	error_message TEXT,
	stack_trace TEXT,
	interaction_args TEXT,
	time TEXT,
	timestamp TEXT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES user(user_id)
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
 	* MESSAGE ERROR LOG
	 */

	await db.run (`CREATE TABLE IF NOT EXISTS message_error_log (
	error_id INTEGER PRIMARY KEY AUTOINCREMENT,
	channel_id TEXT,
	user_id TEXT,
	username TEXT,
	content TEXT,
	error_name TEXT,
	error_message TEXT,
	stack_trace TEXT,
	time TEXT,
	timestamp TEXT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES user(user_id)
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});

	/**
	 * TASKS
	 */

	await db.run (`CREATE TABLE IF NOT EXISTS tasks (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	schedule TEXT NOT NULL,
	arguments,
	last_execution TEXT,
	next_execution TEXT,
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
	* TASKS ERROR LOG
	*/

	await db.run (`CREATE TABLE IF NOT EXISTS tasks_error_log (
	error_id INTEGER PRIMARY KEY AUTOINCREMENT,
	task TEXT,
	content TEXT,
	scheduled_time TEXT,
	error_name TEXT,
	error_message TEXT,
	stack_trace TEXT,
	time TEXT,
	timestamp TEXT NOT NULL
)`, (error) => {
		if (error) {
			console.error(error.message);
		}
	});


	/**
 	* Golden Kappa
 	*/

	await db.run (`CREATE TABLE IF NOT EXISTS golden_kappa (
	kappa INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT,
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
	createDatabase,
};
