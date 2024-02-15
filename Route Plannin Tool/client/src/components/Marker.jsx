import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

function Marker({ longitude, latitude, map, color }) {
  useEffect(() => {
    if (!map) return;

    const marker = new mapboxgl.Marker({ color: color }).setLngLat([longitude, latitude]).addTo(map);

    map.on('move', () => {
      marker.setLngLat([longitude, latitude]);
    });

    return () => marker.remove(); 
  }, [longitude, latitude, map, color]);

  return null;
}

export default Marker;
