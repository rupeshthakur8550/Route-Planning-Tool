import { useMemo } from 'react';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX;

async function fetchGeocode(address) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch geocoding data');
    }
    const data = await response.json();
    return data.features[0].geometry.coordinates;
}

function useGeocode() {
    const cache = useMemo(() => new Map(), []);

    const geocodeAddress = async (address) => {
        if (!cache.has(address)) {
            try {
                const coordinates = await fetchGeocode(address);
                cache.set(address, coordinates);
                return coordinates;
            } catch (error) {
                console.error('Error geocoding address:', error);
                return null;
            }
        } else {
            return cache.get(address);
        }
    };

    return geocodeAddress;
}

export default useGeocode;
