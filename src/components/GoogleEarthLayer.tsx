import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GoogleEarthLayer: React.FC = () => {
    const geeTileUrl ="https://earthengine.googleapis.com/v1/projects/ee-himani202302/maps/5c23e4dbf9085ff9159f65e3fa93a7ab-3ab683e21377ee9c07fbbf3f8a2fb0c0/tiles/{z}/{x}/{y}";
    return (
        <MapContainer center={[22.7754, 73.6149]} zoom={8} style={{ height: "100%", width: "100%" }}>
            {/* Default Basemap */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Google Earth Engine Tile Layer */}
            <TileLayer url={geeTileUrl} />
        </MapContainer>
    );
};

export default GoogleEarthLayer;
