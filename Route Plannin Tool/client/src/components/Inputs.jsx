import React, { useState } from 'react';

function Inputs({ placeholder, setAllAddresses }) {
    const [addresses, setAddresses] = useState([]);
    const handleAddAddress = (event) => {
        event.preventDefault();

        const newAddress = event.target.parentNode.querySelector('input[name="address"]').value.trim();

        if (newAddress) {
            setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
            event.target.parentNode.querySelector('input[name="address"]').value = '';
            setAllAddresses((prevAddresses) => [...prevAddresses, newAddress]);
        }
    };

    const handleDeleteAddress = (index) => {
        const updatedAddresses = [...addresses];
        updatedAddresses.splice(index, 1);
        setAddresses(updatedAddresses);
        setAllAddresses((prevAddresses) => prevAddresses.filter((_, i) => i !== index));
    };

    return (
        <div className='flex flex-col justify-center items-center gap-2'>
            <div className="flex justify-center items-center gap-2">
                <input
                    type="text"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder={placeholder || "Enter Address Location"}
                    name="address"
                    autoComplete='address'
                />
                <button
                    type="button"
                    className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                    onClick={handleAddAddress}
                >
                    Add
                </button>
            </div>
            <div className='mt-2 mb-2'>
                <div className="flex flex-wrap justify-center gap-4">
                    {addresses.map((address, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-lg p-4 text-center shadow-md relative gap-1">
                            <span className="font-semibold flex-grow">{address}</span>
                            <button
                                onClick={() => handleDeleteAddress(index)}
                                className=""
                            >
                                &#10006;
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Inputs;
