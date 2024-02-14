import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

function Marker({ longitude, latitude, map }) {
  useEffect(() => {
    const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    return () => marker.remove();
  }, [longitude, latitude, map]);

  return null;
}

export default Marker;
