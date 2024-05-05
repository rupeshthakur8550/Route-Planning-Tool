import sqlite3 from "sqlite3";

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
  createTables();
});

const createTables = () => {
  const sql_create_technician = `
    CREATE TABLE IF NOT EXISTS technician (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      longitude REAL NOT NULL,
      latitude REAL NOT NULL,
      completion_status INTEGER DEFAULT 0
    )
  `;

  const sql_create_address = `
    CREATE TABLE IF NOT EXISTS address (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      longitude REAL NOT NULL,
      latitude REAL NOT NULL,
      technician_id INTEGER NOT NULL,
      completion_status INTEGER DEFAULT 0,
      FOREIGN KEY (technician_id) REFERENCES technician(id)
    )
  `;

  db.exec(sql_create_technician, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.exec(sql_create_address, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

export default db;