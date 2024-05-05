import React, { useState, useEffect } from 'react';
import './App.css';
import Inputs from './components/Inputs';
import Map from './components/Map';
import useGeocode from './components/customhooks/useGeoCode';

function App() {

  const connect = import.meta.env.VITE_BACKEN;

  const [homeAddresses, setHomeAddresses] = useState([]);
  const [technicianAddress, setTechnicianAddress] = useState([]);
  const [routePlanned, setRoutePlanned] = useState(false);
  const [id, setId] = useState(0);
  const [combinedAddresses, setCombinedAddresses] = useState(null);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const geocodeAddress = useGeocode();

  useEffect(() => {
    if (id !== 0) {
      combinedAddresses.Addresses.forEach(addressData => {
        fetch(`${connect}/api/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: addressData.address,
            longitude: addressData.coordinates[0],
            latitude: addressData.coordinates[1],
            technician_id: id,
          })
        })
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error('Address data not added successfully');
            }
          })
          .then(data => {
            console.log('Address data added successfully:');
          })
          .catch(error => {
            console.error('Error storing address data:', error);
          });
      });
    }
  }, [id, combinedAddresses]);

  const handlePlanRoute = async () => {
    const homeAddressCoordinates = await Promise.all(homeAddresses.map(address => geocodeAddress(address)));
    const technicianAddressCoordinates = await Promise.all(technicianAddress.map(address => geocodeAddress(address)));

    const combinedAddressesData = {
      "Addresses": homeAddresses.map((address, index) => ({ address, coordinates: homeAddressCoordinates[index] })),
      "Technician_Address": technicianAddress.map((address, index) => ({ address, coordinates: technicianAddressCoordinates[index] }))
    };

    setCombinedAddresses(combinedAddressesData);

    const techniciandata = {
      location: combinedAddressesData.Technician_Address[0].address,
      longitude: combinedAddressesData.Technician_Address[0].coordinates[0],
      latitude: combinedAddressesData.Technician_Address[0].coordinates[1]
    };

    fetch(`${connect}/api/technician`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(techniciandata)
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Technician data not added successfully');
        }
      })
      .then(data => {
        console.log('Technician data added successfully');
        const technicianId = data.technician_id;
        setId(technicianId);
        setTechnicianLocation({
          longitude: techniciandata.longitude,
          latitude: techniciandata.latitude,
          id: technicianId
        });
      })
      .catch(error => {
        console.error('Error storing technician data:', error);
      });

    setRoutePlanned(true);
  };

  return (
    <div className="App">
      {routePlanned && technicianLocation !== null ? (
        <Map technicianLocation={technicianLocation} />
      ) : (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center mt-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
            <div className="p-5 bg-transparent rounded-lg shadow-lg relative z-10">
              <Inputs
                placeholder="Enter Work Address"
                onAdd={(address) => setHomeAddresses([...homeAddresses, address])}
                allAddresses={homeAddresses}
                setAllAddresses={setHomeAddresses}
                keyType="home"
              />
              <Inputs
                placeholder="Enter Technician Address"
                onAdd={(address) => setTechnicianAddress([...technicianAddress, address])}
                allAddresses={technicianAddress}
                setAllAddresses={setTechnicianAddress}
                keyType="technician"
              />
              <form onSubmit={(e) => e.preventDefault()}>
                <button
                  type="button"
                  className="plan-route-btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mt-2"
                  onClick={handlePlanRoute}
                >
                  Plan Route
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

