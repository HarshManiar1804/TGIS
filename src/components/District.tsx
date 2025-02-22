import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface GeoJsonFeature {
    type: string;
    properties: {
        NAME_2: string;
    };
    geometry: {
        type: string;
        coordinates: any;
    };
}

interface GeoJsonData {
    type: string;
    features: GeoJsonFeature[];
}

const Disctrict: React.FC = () => {
    const [geoJsonData, setGeoJsonData] = useState<GeoJsonData | null>(null);
    const [districts, setDistricts] = useState<string[]>([]);

    useEffect(() => {
        fetch("/Districts.geojson") // Update the path to your GeoJSON file
            .then((response) => response.json())
            .then((data: GeoJsonData) => {
                setGeoJsonData(data);
                const districtNames = data.features.map((feature) => feature.properties.NAME_2);
                setDistricts(districtNames);
                console.log(districtNames)
            })
            .catch((error) => console.error("Error loading GeoJSON:", error));
    }, []);

    return (
        <div>
            {/* <h1>Districts of India</h1> */}
            {/* <ul>
                {districts.map((district, index) => (
                    <li key={index}>{district}</li>
                ))}
            </ul> */}
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoJsonData && <GeoJSON data={geoJsonData} />}
            </MapContainer>
        </div>
    );
};

export default Disctrict;
