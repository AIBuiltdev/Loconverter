import LatLon from './latlon-ellipsoidal.js';
import * as OsGridRef from './mt-osgridref.js';


const WHAT3WORDS_API_KEY = "23YKNI0D"; // Replace with your What3Words API Key

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addressForm");
    const addressInput = document.getElementById("address");
    const mapDiv = document.getElementById("map");
    const resultsDiv = document.getElementById("results");

    // Initialize the map
    const map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the address
    const marker = L.marker([51.505, -0.09]).addTo(map);

    // Function to convert lat/lon to UK Ordnance Survey grid reference
    function latLonToOSGBGrid(lat, lon) {
        const point = new LatLon(lat, lon);
        const gridRef = OsGridRef.latLonToOsGrid(point);
        return gridRef.toString();
    }

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const address = addressInput.value;
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

        // Fetch geocoding results
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            const gridRef = latLonToOSGBGrid(lat, lon);

            // Update map view and marker
            map.setView([lat, lon], 14);
            marker.setLatLng([lat, lon]);

            // Fetch What3Words data
            const what3wordsUrl = `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat}%2C${lon}&key=${WHAT3WORDS_API_KEY}`;
            const what3wordsResponse = await fetch(what3wordsUrl);
            const what3wordsData = await what3wordsResponse.json();
            const what3wordsAddress = what3wordsData.words;

            // Fetch postcode using reverse geocoding
            const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
            const reverseGeocodeResponse = await fetch(reverseGeocodeUrl);
            const reverseGeocodeData = await reverseGeocodeResponse.json();
            const postcode = reverseGeocodeData.address.postcode || "N/A";

            const addressDetails = result.address || {};

            // Display additional information
            const infoTable = `
                <table>
                    <tr><th>Latitude, Longitude</th><td>${lat}, ${lon}</td></tr>
                    <tr><th>What 3 Words</th><td>${what3wordsAddress}</td></tr>
                    <tr><th>OSM Grid Reference</th><td><a href="https://gridreferencefinder.com?gr=${gridRef}" target="_blank">${gridRef}</a></td></tr>
                    <tr><th>Post Code</th><td>${postcode}</td></tr>
<tr><th>Nearest Road</th><td>${addressDetails.road || "N/A"}</td></tr>
<tr><th>Nearest Town/Village</th><td>${addressDetails.town || addressDetails.village || "N/A"}</td></tr>
</table>
`;
resultsDiv.innerHTML = infoTable;
} else {
resultsDiv.innerHTML = "Address not found.";
}
});
});
