import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { withAlpha } from "ol/color";

// Define the TypeScript type for GeoJSON data
interface GeoJSONFeature {
    type: string;
    features: any[];
}

const District: React.FC = () => {
    const [districtData, setDistrictData] = useState<GeoJSONFeature | null>(null);
    const [talukasData, setTalukasData] = useState<GeoJSONFeature | null>(null);

    useEffect(() => {
        // Load GeoJSON data from a local file or API
        fetch("/Districts.geojson") // Update with your GeoJSON file path
            .then((response) => response.json())
            .then((data) => setDistrictData(data))
            .catch((error) => console.error("Error loading GeoJSON:", error));

        fetch("/Talukas.geojson") // Update with your GeoJSON file path
            .then((response) => response.json())
            .then((data) => setTalukasData(data))
            .catch((error) => console.error("Error loading GeoJSON:", error));
    }, []);

    // Function to style the GeoJSON layer
    const talukaStyle = {
        color: "black", // Border color
        weight: 1, // Border thickness
        fillOpacity: 0.3, // Adjust fill opacity
        fillColor: "#cccccc", // Fill color (optional)
    };
    const DistrictStyle = {
        color: "orange", // Border color
        weight: 1, // Border thickness
        fillOpacity: 0.3, // Adjust fill opacity
        fillColor: "#cccccc", // Fill color (optional)   
    }

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
            {districtData && <GeoJSON data={districtData} style={DistrictStyle} />}
            {talukasData && <GeoJSON data={talukasData} style={talukaStyle} />}
        </MapContainer>
    );
};

export default District;
