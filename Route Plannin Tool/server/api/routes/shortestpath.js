import express from 'express';
import findNearestNeighbor from '../utils/optimization.js';

const router = express.Router();

// Example array of locations (technician's location and addresses to visit)
// const locations = [
//     { name: 'Amalner', lat: 21.0397, lon: 75.0579 },
//     { name: 'Jalgaon', lat: 21.0077, lon: 75.5626 },
//     { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
//     { name: 'Pune', lat: 18.5204, lon: 73.8567 },
//     { name: 'Nashik', lat: 20.0059, lon: 73.7910 },
//     { name: 'Chopda', lat: 21.2495, lon: 75.2927 },
//     { name: 'Dondaicha', lat: 21.3269, lon: 74.5683 }
// ];

let locationsData = []; // Variable to store received data
let resultData = []; // Result to send frontend

// API endpoint to receive data from frontend
router.post('/receive-data', (req, res) => {
  const receivedData = req.body;

  // Validation for received data format
  if (!Array.isArray(receivedData)) {
    return res.status(400).json({ error: 'Data should be an array.' });
  }

  const validData = receivedData.every(item => (
    typeof item.name === 'string' &&
    typeof item.lat === 'number' &&
    typeof item.lon === 'number'
  ));

  if (!validData) {
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  // Assign the received data to the variable
  locationsData = receivedData;

  res.json({ message: 'Data received successfully.' });
});

// Get the technician's location from the first element of the locations array
const technicianLocation = locations[0];

// Get the addresses to visit (excluding the technician's location)
const addressesToVisit = locations.slice(1);

resultData.push(technicianLocation); // Push technician's location to resultData

// Function to find nearest locations and simulate technician visiting addresses one by one
function visitAddresses() {
  while (addressesToVisit.length > 0) {
    // Find the nearest address from the technician's location
    const nearestAddress = findNearestNeighbor(technicianLocation, addressesToVisit);

    // Push the nearest address to resultData
    resultData.push(nearestAddress);

    // Remove the visited address from the addressesToVisit array
    const index = addressesToVisit.findIndex(address => address.name === nearestAddress.name);
    if (index > -1) {
      addressesToVisit.splice(index, 1);
    }

    // Set the technician's location to the visited address for the next iteration
    technicianLocation.lat = nearestAddress.lat;
    technicianLocation.lon = nearestAddress.lon;
  }
}

// Start visiting addresses
visitAddresses();

console.log(resultData);

// Export the router for use in other files
export default router;
