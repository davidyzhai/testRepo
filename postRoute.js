/**
 * Posts a new route to the Samsara API.
 * Preconditions:
 *   - `routeName` must be a non-empty string.
 *   - `driverID` must be a non-empty string representing a valid driver ID in Samsara.
 *   - `routeNotes` must be a string (can be empty).
 *   - `stops` must be an array of objects, each containing:
 *     - `name`: a non-empty string.
 *     - `notes`: a string, can be empty.
 *     - `scheduled_departure_time` for the first stop and `scheduled_arrival_time` for subsequent stops: valid datetime strings.
 *     - `address`: a non-empty string.
 *     - `latitude` and `longitude`: numbers representing valid geographic coordinates.
 * Postconditions:
 *   - Returns the ID of the newly created route as a string if successful.
 *   - Throws an error if the API call fails or preconditions are not met.
 */
async function postRoute(routeName, driverID, routeNotes, stops) {
    // Validate preconditions
    if (!routeName || typeof routeName !== 'string' || routeName.trim() === '') {
        throw new Error('Invalid routeName: must be a non-empty string.');
    }
    if (!driverID || typeof driverID !== 'string' || driverID.trim() === '') {
        throw new Error('Invalid driverID: must be a non-empty string.');
    }
    if (typeof routeNotes !== 'string') {
        throw new Error('Invalid routeNotes: must be a string.');
    }
    if (!Array.isArray(stops) || stops.some(stop => !stop.name || !stop.address || isNaN(stop.latitude) || isNaN(stop.longitude))) {
        throw new Error('Invalid stops: each stop must have a valid name, address, latitude, and longitude.');
    }

    // Construct the route object
    const route = {
        routeName: routeName,
        driverId: driverID,
        routeNotes: routeNotes,
        stops: stops.map((stop, index) => ({
            name: stop.name,
            notes: stop.notes,
            scheduled_time: index === 0 ? stop.scheduled_departure_time : stop.scheduled_arrival_time,
            address: stop.address,
            latitude: stop.latitude,
            longitude: stop.longitude
        }))
    };

    // API endpoint for posting a route
    const url = 'https://api.samsara.com/v1/fleet/routes';
    const apiKey = 'your_samsara_api_key'; // This should be the real API key, I replaced it with a placeholder since this will be on github

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(route)
        });

        if (!response.ok) {
            throw new Error('Failed to post route: ' + response.statusText);
        }

        const responseData = await response.json();
        console.log('Route posted successfully:', responseData.data.id);
        return responseData.data.id;  // Postcondition: Return only the route ID
    } catch (error) { 
        console.error('Failed to post route:', error);
        throw error;
    }
}






