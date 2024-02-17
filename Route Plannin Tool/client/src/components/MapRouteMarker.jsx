import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';

// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

const MapRouteMarker = ({ technicianLocation, coordinates, waypoints }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [allRouteCoordinates, setAllRouteCoordinates] = useState([]);

  const handleTestCompleted = async () => {
    try {
      // Perform PUT request to set completion status
      await fetch(`http://localhost:3001/api/technician/${technicianLocation.id}/completion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }), // Assuming you need to send some data
      });

      // Perform DELETE request to remove data from backend
      await fetch(`http://localhost:3001/api/address/${technicianLocation.id}`, {
        method: 'DELETE',
      });

      // Navigate to the home page
      window.location.href = 'http://localhost:5173/';

      // Make another API call to remove the technician from the backend
      await fetch(`http://localhost:3001/api/technician/${technicianLocation.id}`, {
        method: 'DELETE',
      });

      onsole.log('All destinations reached!');
    } catch (error) {
      console.error('Error completing test:', error);
    }
  };

  useEffect(() => {
    if (!map) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [technicianLocation.longitude, technicianLocation.latitude],
        zoom: 10,
      });
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [map, waypoints]);

  useEffect(() => {
    if (!map) return;

    const fetchRoute = async () => {
      try {
        let allCoordinates = [];

        waypoints.splice(1,0, { lon: technicianLocation.longitude, lat: technicianLocation.latitude });

        for (let i = 1; i < waypoints.length - 1; i++) {
          const fromWaypoint = waypoints[i];
          const toWaypoint = waypoints[i + 1];
          const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${fromWaypoint.lon},${fromWaypoint.lat};${toWaypoint.lon},${toWaypoint.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
          const data = await response.json();
          const segmentCoordinates = data.routes[0].geometry.coordinates;
          allCoordinates = allCoordinates.concat(segmentCoordinates);

          map.addLayer({
            id: `route-${i}`,
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: allCoordinates,
                },
              },
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#007bff',
              'line-width': 5,
            },
          });

          const bounds = allCoordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(allCoordinates[0], allCoordinates[allCoordinates.length - 1]));
          map.fitBounds(bounds, { padding: 50 });
        }

        setAllRouteCoordinates(allCoordinates);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();

    return () => {
      if (map) {
        waypoints.forEach((_, i) => {
          map.removeLayer(`route-${i}`);
          map.removeSource(`route-${i}`);
        });
      }
    };
  }, [map, waypoints]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {map && (
        <>
          {/* Add technician's location as a Marker with a different color */}
          <Marker
            longitude={technicianLocation.longitude}
            latitude={technicianLocation.latitude}
            map={map}
            color="#FF0000" // Customized color to differentiate
          />
          {coordinates.map((coord, index) => (
            <Marker key={`marker${index}`} longitude={coord.lon} latitude={coord.lat} map={map} />
          ))}
        </>
      )}
      <div className='absolute top-0 left-0 m-4 blur-0 p-3 rounded-lg z-10'>
      <button onClick={handleTestCompleted} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Test Completed
      </button>
      </div>
    </div>
  );
};

export default MapRouteMarker;
