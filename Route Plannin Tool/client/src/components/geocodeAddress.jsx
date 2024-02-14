const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX;

export default async function geocodeAddress(address) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch geocoding data');
        }
        const data = await response.json();
        // Extract latitude and longitude from the response
        const coordinates = data.features[0].geometry.coordinates;
        return {
            latitude: coordinates[1],
            longitude: coordinates[0]
        };
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}

