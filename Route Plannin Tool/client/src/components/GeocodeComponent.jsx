import React, { useState } from 'react';
import geocodeAddress from './geocodeAddress'; 

function GeocodeComponent() {
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);

    const handleGeocode = async () => {
        try {
            const coords = await geocodeAddress(address);
            setCoordinates(coords);
            setError(null);
        } catch (error) {
            setCoordinates(null);
            setError(error.message);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter an address" 
            />
            <button onClick={handleGeocode}>Geocode</button>
            {coordinates && (
                <div>
                    <p>Latitude: {coordinates.latitude}</p>
                    <p>Longitude: {coordinates.longitude}</p>
                </div>
            )}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default GeocodeComponent;
