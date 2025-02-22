import React from "react";
import { useState } from "react";
import Navbar from "./components/NavBar";
import { DataProvider } from "./context/dataContext";
import { dataState } from "./lib/utils";
// const MahiLanduse = React.lazy(() => import("./components/MahiLanduse"));
const MapComponent = React.lazy(() => import("./components/MapComponent"));
import { Suspense } from 'react';
import GoogleEarthLayer from "./components/GoogleEarthLayer";
// import District from "./components/District";
// import Talukas from "./components/Talukas";

function App() {
  const [data, setData] = useState<dataState>({});
  const [landuse, setLanduse] = useState<boolean>(false);
  
  // New state variables for districts and talukas
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);

  // Log selections whenever they change
  React.useEffect(() => {
    console.log('Selected Districts:', selectedDistricts);
    console.log('Selected Talukas:', selectedTalukas);
  }, [selectedDistricts, selectedTalukas]);
  
  return (
    <DataProvider>
      <div className="flex flex-row h-screen">
        {/* Navbar on the left, scrollable */}
        <div className="w-1/4 h-full overflow-y-auto">
          <Navbar 
            data={data} 
            setData={setData} 
            landuse={landuse} 
            setLanduse={setLanduse}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            selectedTalukas={selectedTalukas}
            setSelectedTalukas={setSelectedTalukas}
          />
        </div>
        {/* MapComponent on the right, fixed */}
        <div className="w-3/4 h-full">
          <Suspense fallback={<div>Loading...</div>}>
            {landuse ? <GoogleEarthLayer /> : <MapComponent 
              data={data} 
              selectedDistricts={selectedDistricts}
              selectedTalukas={selectedTalukas}
            />}
          </Suspense>
          {/* <District /> */}
          {/* <Talukas /> */}
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
