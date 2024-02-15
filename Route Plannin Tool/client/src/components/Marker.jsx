import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

function Marker({ longitude, latitude, map }) {
  useEffect(() => {
    if (!map) return;

    const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    // Update marker position whenever the map moves
    map.on('move', () => {
      marker.setLngLat([longitude, latitude]);
    });

    return () => marker.remove(); // Clean up the marker when component unmounts
  }, [longitude, latitude, map]);

  return null;
}

export default Marker;
