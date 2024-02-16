import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';

// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

const MapRouteMarker = ({ technicianLocation, coordinates, waypoints }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

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
        let routeCoordinates = [];

        // Include technician's location as the first waypoint
        waypoints.unshift({ lon: technicianLocation.longitude, lat: technicianLocation.latitude });

        for (let i = 0; i < waypoints.length - 1; i++) {
          const fromWaypoint = waypoints[i];
          const toWaypoint = waypoints[i + 1];
          const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${fromWaypoint.lon},${fromWaypoint.lat};${toWaypoint.lon},${toWaypoint.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`);
          const data = await response.json();
          const segmentCoordinates = data.routes[0].geometry.coordinates;
          routeCoordinates = routeCoordinates.concat(segmentCoordinates);
        }

        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
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

        const bounds = routeCoordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[routeCoordinates.length - 1]));
        map.fitBounds(bounds, { padding: 50 });
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();

    return () => {
      if (map.getLayer('route')) {
        map.removeLayer('route');
        map.removeSource('route');
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
    </div>
  );
};

export default MapRouteMarker;
