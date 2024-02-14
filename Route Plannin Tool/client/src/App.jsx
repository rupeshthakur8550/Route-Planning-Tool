import React, { useState, useEffect } from 'react';
import './App.css';
import Inputs from './components/Inputs';
import Map from './components/Map';
import useGeocode from './components/customhooks/useGeoCode'; // Import the useGeocode hook

function App() {
  const [homeAddresses, setHomeAddresses] = useState([]);
  const [technicianAddress, setTechnicianAddress] = useState([]);
  const [routePlanned, setRoutePlanned] = useState(false);
  const geocodeAddress = useGeocode(); // Initialize the useGeocode hook

  const handlePlanRoute = async () => {
    const homeAddressCoordinates = await Promise.all(homeAddresses.map(address => geocodeAddress(address)));
    const technicianAddressCoordinates = await Promise.all(technicianAddress.map(address => geocodeAddress(address)));

    const combinedAddresses = {
      "Addresses": homeAddresses.map((address, index) => ({ address, coordinates: homeAddressCoordinates[index] })),
      "Technician_Address": technicianAddress.map((address, index) => ({ address, coordinates: technicianAddressCoordinates[index] }))
    };

    console.log(`Addresses for route planning:`, combinedAddresses);

    setRoutePlanned(true);
  };

  return (

    <div className="App">
      {routePlanned ? (
        <Map homeAddresses={homeAddresses} />
      ) : (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center">
          <div className="p-5 bg-transparent rounded-lg shadow-lg">
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
      )}
    </div>
  );
}

export default App;
