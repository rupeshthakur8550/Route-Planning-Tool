import express from 'express';
import db from '../utils/db.js';

const router = express.Router();

const insertAddress = (address, longitude, latitude, technician_id, callback) => {
    db.run(`INSERT INTO address (address, longitude, latitude, technician_id) 
          VALUES (?, ?, ?, ?)`, [address, longitude, latitude, technician_id], (err) => {
        if (err) {
            console.error(err.message);
            callback(err);
        } else {
            callback(null);
        }
    });
};

const getAddressByTechnicianId = (technician_id, callback) => {
    db.all(`SELECT address, longitude, latitude FROM address WHERE technician_id = ?`, [technician_id], (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

router.post('/address', (req, res) => {
    const { address, longitude, latitude, technician_id } = req.body;

    insertAddress(address, longitude, latitude, technician_id, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error inserting data into the address table' }); // Sending error response as JSON
        } else {
            res.status(201).json({ message: 'Data inserted into the address table' }); // Sending success response as JSON
        }
    });
});

router.get('/address/:technician_id', (req, res) => {
    
    const technician_id = req.params.technician_id;

    getAddressByTechnicianId(technician_id, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Error retrieving data from the address table' }); 
        } else {
            res.status(200).json(data); 
        }
    });
});

export default router;
