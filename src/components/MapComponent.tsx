import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Overlay } from "ol";
import {
  createVectorLayer,
  createVectorLayerForRiver,
  defaultStyleOptionsBasin,
  defaultStyleOptionsRiver,
  MapComponentProps,
} from "@/lib/utils";
import { Stroke, Style } from "ol/style";

interface Basin {
  name: string;
  number: number;
  area: number;
  perimeter: number;
}
interface RiverInfo {
  order: number;
  basin: string;
  segmentId: string;
  length: number;
}

const MapComponent = ({ data }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [layerList, setLayerList] = useState<string[]>([]);
  const [riverLayers, setRiverLayers] = useState<VectorLayer[]>([]);
  const [hoverCoordinates, setHoverCoordinates] = useState<[number, number] | null>(null);
  const [isRiverLayerHovered, setIsRiverLayerHovered] = useState(false);
  const [selectedRiverInfo, setSelectedRiverInfo] = useState<RiverInfo | null>(null);
  const [selectedBasin, setSelectedBasin] = useState<Basin | null>(null);

  const fetchRiverLayers = async () => {
    const geoJSONFiles: { fileName: string; channel: string }[] = [];
    const promises = [];

    for (const [channel, channelData] of Object.entries(data)) {
      if (channelData.isChecked) {
        for (const [range, isChecked] of Object.entries(channelData.subCheckboxes || {})) {
          if (isChecked) {
            const orderNumber = range.split("-")[0];
            const fileName = `order${orderNumber}.geojson`;
            geoJSONFiles.push({ fileName, channel });

            promises.push(
              createVectorLayerForRiver(
                fileName,
                channel,
                defaultStyleOptionsRiver,
                Number(orderNumber)
              )
            );
          }
        }
      }
    }

    try {
      const results = await Promise.all(promises);
      setRiverLayers(results.map((result) => result.layer));
    } catch (error) {
      console.error("Error fetching river layers:", error);
    }
  };

  const fetchBasinLayer = async () => {
    const updatedLayers: string[] = [];
    Object.keys(data).forEach((key) => {
      const match = key.match(/MainChannel(\d+)/);
      if (match) {
        const channelIndex = match[1];
        const geoJsonPath = `/MA${channelIndex}.geojson`;

        if (data[key]?.isChecked) {
          updatedLayers.push(geoJsonPath);
        }
      }
    });

    setLayerList((prev) =>
      JSON.stringify(prev) !== JSON.stringify(updatedLayers) ? updatedLayers : prev
    );
  };

  useEffect(() => {
    fetchBasinLayer();
    fetchRiverLayers();
  }, [data]);

  useEffect(() => {
    const vectorLayers = layerList.map((file) =>
      createVectorLayer(file, defaultStyleOptionsBasin)
    );
    const styleRiver = new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 0)'
      })
    });

    const basinLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Basins.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    const streamsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Streams.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    const map = new Map({
      target: mapRef.current || undefined,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        basinLayer,
        streamsLayer,
        ...vectorLayers,
        ...riverLayers,
      ],
      view: new View({
        center: fromLonLat([73.6149, 22.7754]), // Adjust if needed
        zoom: 8,
      }),
    });

    const hoverOverlay = new Overlay({
      element: document.createElement("div"),
      positioning: "bottom-center",
      stopEvent: false,
    });
    map.addOverlay(hoverOverlay);

    // Pointer move event to update hover coordinates
    map.on("pointermove", (event) => {
      const coordinates = map.getEventCoordinate(event.originalEvent) as [number, number];
      setHoverCoordinates(coordinates);

      let hoveredRiver = false;
      map.forEachFeatureAtPixel(event.pixel, (_, layer) => {
        if (riverLayers.includes(layer as VectorLayer)) {
          hoveredRiver = true;

        }
      });
      setIsRiverLayerHovered(hoveredRiver);
    });

    // Click event to capture coordinates & find basin
    // Load GeoJSON Data for basins and streams
    let basinsGeojson: { features: { properties: { "Basin Name": string; number: number; area: number; perimeter: number; } }[]; } | null = null;
    let streamsGeojson: { features: { properties: { SEGMENT_ID: string; len: number; ORDER: number; } }[]; } | null = null;
    // Fetch Mahi Basins GeoJSON
    fetch("/Mahi_Basins.geojson")
      .then(response => response.json())
      .then(data => {
        basinsGeojson = data;
      })
      .catch(error => console.error("Error loading Mahi Basins GeoJSON:", error));

    // Fetch Mahi Streams GeoJSON
    fetch("/Mahi_Streams.geojson")
      .then(response => response.json())
      .then(data => {
        streamsGeojson = data;
      })
      .catch(error => console.error("Error loading Mahi Streams GeoJSON:", error));

    map.on("click", async (event) => {
      let clickedBasin = null;
      let clickedRiver = null;

      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const properties = feature.getProperties();

        // Check Basins GeoJSON for a match
        if (basinsGeojson) {
          const matchedBasin = basinsGeojson.features.find(f => {
            return f.properties["Basin Name"] === properties["Basin Name"];
          });

          if (matchedBasin) {
            clickedBasin = {
              name: matchedBasin.properties["Basin Name"],
              number: matchedBasin.properties["number"],
              area: matchedBasin.properties["area"],
              perimeter: matchedBasin.properties["perimeter"],
            };
          }
        }

        // Check Streams GeoJSON for a match
        if (streamsGeojson) {
          const matchedStream = streamsGeojson.features.find(f => {
            return f.properties["SEGMENT_ID"] === properties["SEGMENT_ID"];
          });

          if (matchedStream) {
            clickedRiver = {
              segmentId: matchedStream.properties["SEGMENT_ID"],
              length: matchedStream.properties["len"] || 0,
              order: matchedStream.properties["ORDER"] || 0,
            };
          }
        }
      });
      // Update UI state
      setSelectedBasin(clickedBasin);
      setSelectedRiverInfo(clickedRiver);
    });
    return () => map.setTarget(undefined);
  }, [layerList, riverLayers]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>

      {/* Hover Info */}
      {hoverCoordinates && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-2 bg-white bg-opacity-80 rounded text-center ml-32">
          <div>Lat & Lon: {hoverCoordinates.map((c) => c.toFixed(2)).join(", ")}</div>
          <div>River: {isRiverLayerHovered ? "Yes" : "No"}</div>
        </div>
      )}
      {/* Basin Info Box */}
      {selectedBasin && (
        <div className="absolute top-10 right-10 flex flex-col w-[250px] z-10">
          {/* Basin Info Box */}
          <div className="p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
            <h2 className="mb-3 text-center">Basin Information</h2>
            <div className="mb-2"><strong>Basin Name:</strong> {selectedBasin.name}</div>
            <div className="mb-2"><strong>Basin Number:</strong> {selectedBasin.number}</div>
            <div className="mb-2"><strong>Basin Area:</strong> {selectedBasin.area.toFixed(2)}</div>
            <div className="mb-2"><strong>Basin Perimeter:</strong> {selectedBasin.perimeter.toFixed(2)}</div>
          </div>

          {/* River Info Box */}

        </div>
      )}
      {selectedBasin && selectedRiverInfo && (
        <div className="absolute top-40 mt-24 right-10 flex flex-col w-[250px] z-10">
          <div className="mt-2 p-4 bg-white bg-opacity-90 rounded-lg shadow-md">
            <h2 className="mb-3 text-center">Stream Information</h2>
            <div className="mb-2"><strong>Segment ID:</strong> {selectedRiverInfo.segmentId}</div>
            <div className="mb-2"><strong>Stream Order:</strong> {selectedRiverInfo.order}</div>
            <div className="mb-2"><strong>Length:</strong> {selectedRiverInfo.length.toFixed(2)}</div>
          </div>
        </div>
      )}





    </div>
  );
};

export default MapComponent;
