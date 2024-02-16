// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
    const earthRadiusKm = 6371;

    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lon - coord1.lon);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Function to find nearest neighbor pair
function findNearestNeighbor(technicianLocation, addresses) {
    let nearestAddress;
    let shortestDistance = Infinity;

    addresses.forEach(address => {
        const distance = calculateDistance(technicianLocation, address);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestAddress = address;
        }
    });

    return nearestAddress;
}

export default findNearestNeighbor;
