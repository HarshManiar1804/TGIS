// Importing utility functions and types from clsx and tailwind-merge
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Importing classes and modules from OpenLayers (ol) for map styling and data handling
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import MultiLineString from "ol/geom/MultiLineString";
import { ReactNode } from "react";

// Utility function to merge class names with Tailwind's utility-first approach
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to create a vector layer with a GeoJSON source and custom styling
export interface StyleOptions {
  radius?: number;
  circleFillColor?: string;
  circleStrokeColor?: string;
  circleStrokeWidth?: number;
  lineStrokeColor?: string;
  lineStrokeWidth?: number;
  fillColor?: string;
}

export function createVectorLayer(
  geojsonPath: string,
  styleOptions: StyleOptions
) {
  const vectorSource = new VectorSource();

  // Fetch the GeoJSON file and add features to the vector source
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((data) => {
      const features = new GeoJSON().readFeatures(data, {
        featureProjection: "EPSG:3857", // Convert GeoJSON coordinates to the map's projection
      });
      vectorSource.addFeatures(features);
    })
    .catch((error) =>
      console.error(`Error loading GeoJSON (${geojsonPath}):`, error)
    );

  // Create and return a vector layer with styling based on the given options
  return new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: styleOptions.radius || 2, // Default radius
        fill: new Fill({ color: styleOptions.circleFillColor || "red" }),
        stroke: new Stroke({
          color: styleOptions.circleStrokeColor || "black",
          width: styleOptions.circleStrokeWidth || 1,
        }),
      }),
      stroke: new Stroke({
        color: styleOptions.lineStrokeColor || "red",
        width: styleOptions.lineStrokeWidth || 1,
      }),
      fill: new Fill({
        color: styleOptions.fillColor || "rgba(0, 0, 255, 0.1)",
      }),
    }),
  });
}

// Function to create a vector layer for a specific river channel with advanced styling and coordinate extraction
export async function createVectorLayerForRiver(
  geojsonPath: string,
  channelName: string,
  styleOptions: StyleOptions,
  orderNumber: number
): Promise<{ layer: VectorLayer; coords: number[][][] }> {
  const vectorSource = new VectorSource();
  const coords: number[][][] = []; // Array to store extracted coordinates

  try {
    // Fetch GeoJSON data from the given path
    const response = await fetch(geojsonPath);
    const data = await response.json();

    // Filter features based on the `layer` property
    const filteredFeatures = new GeoJSON().readFeatures(
      {
        ...data,
        features: data.features.filter(
          (feature: { properties: { layer: string } }) =>
            feature.properties.layer === channelName
        ),
      },
      {
        featureProjection: "EPSG:3857", // Convert coordinates to the map's projection
      }
    );

    // Extract coordinates from the geometry of the filtered features
    filteredFeatures.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry instanceof MultiLineString) {
        const multiLineCoords = geometry.getCoordinates();
        coords.push(...multiLineCoords);
      }
    });

    // Adjust line stroke width dynamically based on the order number
    const dynamicStyleOptions = {
      ...styleOptions,
      lineStrokeWidth: orderNumber - 0.5,
    };

    // Add the filtered features to the vector source
    vectorSource.addFeatures(filteredFeatures);

    // Create and return the vector layer with styling
    const layer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: dynamicStyleOptions.radius || 2,
          fill: new Fill({
            color: dynamicStyleOptions.circleFillColor || "red",
          }),
          stroke: new Stroke({
            color: dynamicStyleOptions.circleStrokeColor || "black",
            width: dynamicStyleOptions.circleStrokeWidth || 1,
          }),
        }),
        stroke: new Stroke({
          color: dynamicStyleOptions.lineStrokeColor || "blue",
          width: dynamicStyleOptions.lineStrokeWidth || 1,
        }),
        fill: new Fill({
          color: dynamicStyleOptions.fillColor || "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    return { layer, coords }; // Return the layer and extracted coordinates
  } catch (error) {
    console.error(`Error loading GeoJSON (${geojsonPath}):`, error);
    throw error;
  }
}

// Interfaces for managing checkbox and channel states

export interface dataState {
  [key: string]: {
    isChecked: boolean;

    subCheckboxes: {
      [key: string]: boolean;
    };
  };
}

export interface ChannelData {
  isChecked?: boolean;
  subCheckboxes?: { [key: string]: boolean }; // Sub-checkboxes structure
}

export interface MapComponentProps {
  data: dataState;
  selectedDistricts: string[];
  selectedTalukas: string[];
  road: boolean;
  railway: boolean;
  canals: boolean;
}

export interface SubCheckboxes {
  [subValue: string]: boolean;
}

export interface ChannelState {
  isChecked: boolean;
  subCheckboxes: SubCheckboxes;
}

export interface State {
  [channel: string]: ChannelState;
}

export interface DataContextProps {
  data: State;
  updateData: (
    channel: string,
    updateCallback: (prevState: State) => State
  ) => void;
  landUse: boolean; // Updated from State to boolean
  updateLandUse: (updateCallback: (prevLandUse: boolean) => boolean) => void; // Added this function
}

export interface DataProviderProps {
  children: ReactNode;
}

// Default style options for different map layers
export const defaultStyleOptionsBasin = {
  radius: 2,
  circleFillColor: "red",
  circleStrokeColor: "black",
  circleStrokeWidth: 1,
  lineStrokeColor: "red",
  lineStrokeWidth: 1,
  fillColor: "rgba(0, 0, 255, 0.1)",
};

export const defaultStyleOptionsRiver = {
  radius: 5,
  circleFillColor: "blue",
  circleStrokeColor: "white",
  circleStrokeWidth: 2,
  lineStrokeColor: "blue",
  lineStrokeWidth: 1,
  fillColor: "rgba(0, 255, 0, 0.3)",
};

// Mapping of sub-checkbox ranges for different orders
export const subCheckboxRanges = {
  1: ["1-2", "2-3", "3-4", "4-5", "5-6"],
  2: ["1-2", "2-3", "3-4"],
  3: ["1-2", "2-3", "3-4"],
  4: ["1-2", "2-3", "3-4", "4-5"],
  5: ["1-2", "2-3", "3-4", "4-5"],
  6: ["1-2", "2-3", "3-4"],
  7: ["1-2", "2-3", "3-4", "4-5"],
  8: ["1-2", "2-3", "3-4", "4-5"],
  9: ["1-2", "2-3", "3-4", "4-5"],
  10: ["1-2", "2-3", "3-4", "4-5"],
} as { [key: number]: string[] };

// Array of main channel names
export const channels = Array.from(
  { length: 10 },
  (_, i) => `MainChannel${i + 1}`
);

// Array of order labels
export const orders = Array.from({ length: 6 }, (_, i) => `order${i + 1}`);

interface Data {
  [key: string]: {
    isChecked: boolean;
    subCheckboxes: {
      [key: string]: boolean;
    };
  };
}

export interface NavbarProps {
  data: dataState;
  setData: (data: dataState) => void;
  landuse: boolean;
  setLanduse: (landuse: boolean) => void;
  road: boolean;
  setRoad: (road: boolean) => void;
  railway:boolean,
  setRailway: (railway:boolean) => void ,
  canals:boolean,
  setCanals: (canals:boolean) => void,
  selectedDistricts: string[];
  setSelectedDistricts: (districts: string[]) => void;
  selectedTalukas: string[];
  setSelectedTalukas: (talukas: string[]) => void;
}

import { FeatureCollection } from "geojson";

export let Mahi_Streams: FeatureCollection | null = null;

export const fetchMahiStreams = async () => {
  try {
    const response = await fetch("/Mahi_Streams.geojson");
    Mahi_Streams = await response.json();
  } catch (error) {
    console.error("Error fetching Mahi_Streams geojson:", error);
  }
};
