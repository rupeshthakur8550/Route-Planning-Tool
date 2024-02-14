import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the database');
        // Create the 'jobs' table if it doesn't exist
        db.run("CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, address TEXT, completed BOOLEAN DEFAULT 0)", (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table "jobs" created successfully');
            }
        });
        db.run("CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, address TEXT, completed BOOLEAN DEFAULT 0)", (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table "jobs" created successfully');
            }
        });
    }
});

db.on('error', (err) => {
    console.error('Database error:', err.message);
});

export default db;
