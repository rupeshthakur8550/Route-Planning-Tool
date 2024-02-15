import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import Marker from './Marker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX;

function Demo() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9
      });
    }

    return () => {
      map.current.remove();
    };
  }, []);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100vh' }}>
      {/* Example of using the Marker component */}
      <Marker longitude={-74.5} latitude={40} map={map.current} />
    </div>
  );
}

export default Demo;
