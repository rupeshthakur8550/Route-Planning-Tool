import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

export default function Map({ homeAddresses }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(75.063873);
    const [lat, setLat] = useState(21.042410);
    const [zoom, setZoom] = useState(9);
    const [checkboxes, setCheckboxes] = useState([]);

    useEffect(async() => {

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('move', () => {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            });
        }

        // Update the list of checkboxes whenever homeAddresses changes
        if (homeAddresses && homeAddresses.length > 0) {
            const checkboxes = homeAddresses.map((address, index) => (
                <div key={`address${index}`}>
                    <input
                        type="checkbox"
                        defaultChecked={false}
                        id={`address${index}`}
                        className="address-checkbox"
                        value={address}
                    />
                    <label htmlFor={`address${index}`}>{address}</label>
                    <br />
                </div>
            ));
            setCheckboxes(checkboxes);
        }
    }, [lng, lat, zoom, homeAddresses]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
                <div ref={mapContainer} className="absolute inset-0" />
            </div>
            <div className="sidebar absolute top-0 left-0 m-4 blur-0 bg-orange-200 text-black p-3 rounded-lg z-10">
                <p>Home Addresses:</p>
                {checkboxes}
            </div>
        </div>
    );
}
