import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

router.post('/technician', (req, res) => {

    const { location, longitude, latitude } = req.body;

    db.run(`INSERT INTO technician (location, longitude, latitude) 
          VALUES (?, ?, ?)`, [location, longitude, latitude], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error inserting data into the technician table');
        } else {
            console.log(`Inserted a row with the ID: ${this.lastID}`);
            if (this.lastID) {
              res.status(200).json({ technician_id: this.lastID });
            } else {
              res.status(500).send('No result returned from the database');
            }
        }
    });
});

export default router;
