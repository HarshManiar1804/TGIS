import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import georaster from "georaster";

// Define land cover colors and corresponding labels
const landCoverInfo: { [key: number]: { color: string; label: string } } = {
    1: { color: "#ff0000", label: "Builtup" },
    2: { color: "#013ddc", label: "Waterbodies" },
    3: { color: "#feff73", label: "Agriculture" },
    4: { color: "#7ac602", label: "Vegetation Patches" },
    5: { color: "#95e689", label: "Shrubland" },
    6: { color: "#dfaaf0", label: "Salineland" },
    7: { color: "#fe95e7", label: "Barrenland" },
    8: { color: "#fefeb4", label: "Fallowland" },
    9: { color: "#267300", label: "Forest Patches" }
};

const GeoTIFFLayer = ({ url }: { url: string }) => {
    const map = useMap();

    useEffect(() => {
        if (!url) return;

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => georaster(arrayBuffer))
            .then(georasterData => {
                console.log(`GeoTIFF Data Loaded from ${url}:`, georasterData);

                const layer = new GeoRasterLayer({
                    georaster: georasterData,
                    opacity: 1,
                    resolution: 256,
                    pixelValuesToColorFn: values => {
                        let rawValue = values[0];

                        // Handle no-data values
                        if (rawValue === -32768 || rawValue === undefined || isNaN(rawValue)) {
                            return "rgba(0, 0, 0, 0)"; // Transparent color
                        }

                        // Use the raw value directly as a land cover class
                        return landCoverInfo[rawValue]?.color || "#000000"; // Default to black if no match
                    }
                });

                layer.addTo(map);
                map.fitBounds(layer.getBounds());
            })
            .catch(error => console.error(`Error loading GeoTIFF from ${url}:`, error));
    }, [map, url]);

    return null;
};

const Legend = () => {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            div.style.background = "white";
            div.style.padding = "10px";
            div.style.borderRadius = "5px";
            div.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
            div.style.fontSize = "14px";
            div.style.lineHeight = "18px";

            let legendHtml = "<h4>Land Cover Types</h4>";
            for (const key in landCoverInfo) {
                const { color, label } = landCoverInfo[key];
                legendHtml += `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                        <span style="width: 20px; height: 20px; background: ${color}; display: inline-block; border: 1px solid #000;"></span>
                        <span>${label}</span>
                    </div>
                `;
            }
            div.innerHTML = legendHtml;
            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
};

const MahiLanduse = () => {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer center={[22.7754, 73.6149]} zoom={8} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoTIFFLayer url={'Mahi_Landuse.tif'} />
                <Legend />
            </MapContainer>
        </div>
    );
};

export default MahiLanduse;
