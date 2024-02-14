import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser'

const app = express();
const port = 3001;

// Setup SQLite Connection
const db = new sqlite3.Database('./route_planning_db.sqlite');

// Create 'locations' table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT
  )
`);

// Middleware for parsing JSON
app.use(bodyParser.json());

// API endpoint for saving job locations
app.post('/api/job-locations', (req, res) => {
  const { location } = req.body;

  console.log('Received data:', req.body);

  const query = 'INSERT INTO locations (location) VALUES (?)';

  db.run(query, [location], function (err) {
    if (err) {
      console.error('Error saving job location:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'Job location saved successfully', id: this.lastID });
    }
  });
});

// API endpoint for getting all job locations
app.get('/api/job-locations', (req, res) => {
  const query = 'SELECT * FROM locations';

  db.all(query, (err, results) => {
    if (err) {
      console.error('Error fetching job locations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});