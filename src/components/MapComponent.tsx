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
import { Fill, Stroke, Style, Text } from "ol/style";

import Legend from './Legend'; // Import the Legend component

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

const MapComponent = ({ data ,road, railway, canals,talukas,districts }: MapComponentProps) => {
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
  }, [data, road]);

  useEffect(() => {
    const vectorLayers = layerList.map((file) =>
      createVectorLayer(file, defaultStyleOptionsBasin)
    );
      const styleRiver = new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 0)'
        })
    });

    const styleTalukaBoundary = new Style({
      stroke: new Stroke({
        color: '#1f78b4', // Blue
        width: 2, 
        lineDash: [6, 2] // Dashed pattern
      })
    });
    
    const styleDistrictBoundary = new Style({
      stroke: new Stroke({
        color: '#000000', // Black
        width: 3, // Thicker for prominence
        lineDash: [18, 6] // Long dashes with medium gaps
      })
    });
    
   const canalStyle = new Style({
  stroke: new Stroke({
    color: '#2741ea', // Primary Blue
    width: 2.5,
    lineDash: [10, 5] // Dashed pattern to mimic canal flow
  }),
  text: new Text({
    text: '— — — — —', // White dashes to overlay on blue stroke
    font: 'bold 12px sans-serif',
    fill: new Fill({ color: '#ffffff' }), // White dashed effect
    placement: 'line',
  }),
  fill: new Fill({
    color: 'rgba(39, 65, 234, 0.3)', // Light blue transparent fill
  }),
});

    
    const railwayStyle = new Style({
      stroke: new Stroke({
        color: '#e31a1c', // Red
        width: 2.5,
        lineDash: [10, 5], // Dashed with small perpendicular markers
      }),
      text: new Text({
      text: '| — | — | — | — |', // Mimicking railway track pattern
      font: 'bold 14px sans-serif',
      fill: new Fill({ color: '#e31a1c' }), // Red color for visibility
      placement: 'line', // Aligns text along the railway line
      })
    });

    
    const roadStyle = new Style({
      stroke: new Stroke({
        color: '#878787', // Gray base color
        width: 2, // Slightly thicker for visibility
      }),
      text: new Text({
        text: '— — — — —',
        font: 'bold 12px sans-serif',
        fill: new Fill({ color: '#ffffff' }),
        placement: 'line',
      })
    });
    
    
    const basinLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Basins.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    const canalLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Canals.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: canalStyle,
    });
    

    const railwayLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Railway.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: railwayStyle,
    });
    

    const roadLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Roads_layer.geojson",
        format: new GeoJSON(),
        loader: function (_extent, _resolution, projection) {
          fetch("/Roads_layer.geojson")
            .then(response => response.json())
            .then(data => {
              const features = new GeoJSON().readFeatures(data, {
                featureProjection: projection,
              });

              const filteredFeatures = features.filter(feature => {
                const roadType = feature.get("Road");
                return roadType && (roadType.includes("SH") || roadType.includes("NH"));
              });

              (this as VectorSource).addFeatures(filteredFeatures);
            });
        }
      }),
      style: roadStyle,
    });

    const streamsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Streams.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    const talukaBoundaryLayer = new VectorLayer({
      source: new VectorSource({
        url: "/TalukaBoundary.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style:styleTalukaBoundary ,
    });

    const districtBoundaryLayer = new VectorLayer({
      source: new VectorSource({
        url: "/DistrictBoundary.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style:styleDistrictBoundary ,
    });

    const map = new Map({
      target: mapRef.current || undefined,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        basinLayer,
        streamsLayer,
        ...(talukas ? [talukaBoundaryLayer] : []),
        ...(districts ? [districtBoundaryLayer] : []),
        ...(road ? [roadLayer] : []),
        ...(railway ? [railwayLayer] : []),
        ...(canals ? [canalLayer] : []),
        ...vectorLayers,
        ...riverLayers,
      ],
      view: new View({
        center: fromLonLat([74.2684, 23.2803]), // Coordinates for Bagidora
        zoom: 7.8,
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
  }, [layerList, riverLayers,road,railway,canals,talukas,districts]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>

      {/* Legend Component */}
      <Legend />

      {/* Hover Info */}
      {hoverCoordinates && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-2 bg-white bg-opacity-80 rounded text-center ml-32">
          <div>Lat & Lon: {hoverCoordinates.map((c) => c.toFixed(2)).join(", ")}</div>
          {
            isRiverLayerHovered &&
            <div>River: { isRiverLayerHovered ? "Yes" : "No"}</div>
          }
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