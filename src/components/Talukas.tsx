import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define the TypeScript type for GeoJSON data
interface GeoJSONFeature {
    type: string;
    features: any[];
}

const Talukas: React.FC = () => {
    const [geoJsonData, setGeoJsonData] = useState<GeoJSONFeature | null>(null);

    useEffect(() => {
        // Load GeoJSON data from a local file or API
        fetch("/Talukas.geojson") // Update with your GeoJSON file path
            .then((response) => response.json())
            .then((data) => setGeoJsonData(data))
            .catch((error) => console.error("Error loading GeoJSON:", error));
    }, []);

    // Function to style the GeoJSON layer
    const geoJSONStyle = {
        color: "black", // Border color
        weight: 1, // Border thickness
        fillOpacity: 0.3, // Adjust fill opacity
        fillColor: "#cccccc", // Fill color (optional)
    };

    return (
        <MapContainer
            center={[23.6102, 80.5881]} // Default center (change as needed)
            zoom={5}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geoJsonData && <GeoJSON data={geoJsonData} style={geoJSONStyle} />}
        </MapContainer>
    );
};

export default Talukas;
