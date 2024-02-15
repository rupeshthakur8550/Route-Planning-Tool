import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Marker from './Marker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

const Map = ({ technicianLocation }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(technicianLocation?.longitude || 0); 
    const [lat, setLat] = useState(technicianLocation?.latitude || 0); 
    const [zoom, setZoom] = useState(12);
    const [technicianId, setTechnicianId] = useState(technicianLocation?.id || 0);
    const [checkboxes, setCheckboxes] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
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

        // Update the map center if the technician location changes
        if (technicianLocation) {
            map.current.setCenter([technicianLocation.longitude, technicianLocation.latitude]);
            setTechnicianId(technicianLocation.id);
        }

        // Call API to get address data when technicianLocation changes
        if (technicianLocation) {
            fetch(`http://localhost:3001/api/address/${technicianLocation.id}`)
                .then(response => response.json())
                .then(data => {
                    // Extract coordinates and set them into state variable
                    const coordinatesArray = data.map(element => [element.longitude, element.latitude]);
                    setCoordinates(coordinatesArray);

                    const checkboxes = data.map((element, index) => (
                        <div key={`address${index}`}>
                            <input
                                type="checkbox"
                                defaultChecked={false}
                                id={`address${index}`}
                                className="address-checkbox"
                                value={element.address}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <label htmlFor={`address${index}`}>{element.address}</label>
                            <br />
                        </div>
                    ));
                    
                    setCheckboxes(checkboxes);
                })
                .catch(error => console.error('Error fetching address data:', error));
        }
    }, [technicianLocation]);

    const handleCheckboxChange = (index) => {
        setCheckboxes(prevCheckboxes => {
            const updatedCheckboxes = [...prevCheckboxes];
            updatedCheckboxes[index] = {
                ...updatedCheckboxes[index],
                props: {
                    ...updatedCheckboxes[index].props,
                    defaultChecked: !updatedCheckboxes[index].props.defaultChecked
                }
            };
            const allChecked = updatedCheckboxes.every(checkbox => checkbox.props.defaultChecked);
            setAllChecked(allChecked);
            return updatedCheckboxes;
        });
    };
    
    const handleTaskCompleted = () => {
        console.log('Task completed!');
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
                <div ref={mapContainer} className="absolute inset-0" />

                {/* Render Marker component passing initial longitude, latitude, and map instance */}
                <Marker longitude={technicianLocation.longitude} latitude={technicianLocation.latitude} map={map.current} />

                {/* Render markers for each coordinate */}
                {coordinates.map((coord, index) => (
                    <Marker key={`marker${index}`} longitude={coord[0]} latitude={coord[1]} map={map.current} />
                ))}
            </div>
            <div className="sidebar absolute top-0 left-0 m-4 blur-0 bg-orange-200 text-black p-3 rounded-lg z-10">
                <p>Technician ID: {technicianId}</p>
                {checkboxes} 
                {allChecked ? (
                    <button onClick={handleTaskCompleted} className='bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mt-2'>
                        Task Completed
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default Map;
