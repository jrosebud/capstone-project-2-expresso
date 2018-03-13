// sql portion - creating databases
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function () {
	db.run("DROP TABLE IF EXISTS Employee");
	db.run("DROP TABLE IF EXISTS Timesheet");
	db.run("DROP TABLE IF EXISTS Menu");
	db.run("DROP TABLE IF EXISTS MenuItem");
	db.run(`CREATE TABLE IF NOT EXISTS Employee (
      id INTEGER primary key,
      name TEXT not null,
      position TEXT not null,
      wage INTEGER not null,
      is_current_employee INTEGER not null DEFAULT 1)`);
	db.run(`CREATE TABLE IF NOT EXISTS Timesheet (
		id INTEGER PRIMARY KEY NOT NULL, 
		hours INTEGER NOT NULL, 
		rate INTEGER NOT NULL, 
		date INTEGER NOT NULL, 
		employee_id INTEGER NOT NULL,
		FOREIGN KEY(employee_id) REFERENCES Employee(id))`);
	db.run(`CREATE TABLE IF NOT EXISTS Menu (
		id INTEGER PRIMARY KEY NOT NULL, 
		title TEXT NOT NULL)`);
	db.run(`CREATE TABLE IF NOT EXISTS MenuItem (
		id INTEGER PRIMARY KEY NOT NULL, 
		name TEXT NOT NULL, 
		description TEXT, 
		inventory INTEGER NOT NULL, 
		price INTEGER NOT NULL, 
		menu_id INTEGER NOT NULL, 
		FOREIGN KEY(menu_id) REFERENCES Menu(id))`);
});