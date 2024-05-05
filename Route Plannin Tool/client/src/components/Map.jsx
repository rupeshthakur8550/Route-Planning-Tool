import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapRouteMarker from './MapRouteMarker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

const connect = import.meta.env.VITE_BACKEN;

const Map = ({ technicianLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [coordinates, setCoordinates] = useState([]);
    const [lineCoordinates, setLineCoordinates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Call API to get address data and shortest path data
        if (technicianLocation) {
            setLoading(true); // Set loading state
            Promise.all([
                fetch(`${connect}/api/address/${technicianLocation.id}`).then(response => response.json()),
                fetch(`${connect}/api/shortestpath/${technicianLocation.id}`).then(response => response.json())
            ]).then(([addressData, shortestPathData]) => {
                console.log('Address data:', addressData); // Log address data
                console.log('Shortest path data:', shortestPathData); // Log shortest path data

                const coordinatesArray = addressData.map(element => ({ lon: element.longitude, lat: element.latitude }));
                setCoordinates(coordinatesArray);

                const lineCoordinatesArray = shortestPathData.map(element => ({ name: element.name, lon: element.lon, lat: element.lat }));
                setLineCoordinates(lineCoordinatesArray);

                setLoading(false); // Clear loading state
            }).catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false); // Clear loading state in case of error
            });
        }
    }, [technicianLocation]);

    useEffect(() => {
        // Initialize map
        if (!map.current && technicianLocation) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [technicianLocation.longitude, technicianLocation.latitude],
                zoom: 12
            });
        }

        return () => {
            // Clean up map
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [technicianLocation]);

    useEffect(() => {
        // Fit map to bounds when coordinates change
        if (map.current && coordinates.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            coordinates.forEach(coord => bounds.extend([coord.lon, coord.lat]));
            map.current.fitBounds(bounds, { padding: 50 });
        }
    }, [coordinates]);

    return (
        <div className="h-screen relative">
            <div className="absolute inset-0 overflow-hidden" ref={mapContainer} />
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">Loading...</div>}
            {lineCoordinates.length > 0 && technicianLocation && coordinates.length > 0 && (
                <MapRouteMarker technicianLocation={technicianLocation} coordinates={coordinates} waypoints={lineCoordinates} />
            )}
        </div>
    );
};

export default Map;