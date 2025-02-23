import React from "react";
import { useState } from "react";
import Navbar from "./components/NavBar";
import { DataProvider } from "./context/dataContext";
import { dataState } from "./lib/utils";
// const MahiLanduse = React.lazy(() => import("./components/MahiLanduse"));
const MapComponent = React.lazy(() => import("./components/MapComponent"));
import { Suspense } from 'react';
import GoogleEarthLayer from "./components/GoogleEarthLayer";


function App() {
  const [data, setData] = useState<dataState>({});
  const [road, setRoad] = useState<boolean>(false);
  const [landuse, setLanduse] = useState<boolean>(false);
  const [railway, setRailway] = useState<boolean>(false);
  const [canals, setCanals] = useState<boolean>(false);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([]);
  const [theme, setTheme] = useState('landuse');
  
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
            road={road}
            setRoad={setRoad}
            railway={railway}
            setRailway={setRailway}
            canals={canals}
            setCanals={setCanals}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            selectedTalukas={selectedTalukas}
            setSelectedTalukas={setSelectedTalukas}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
        {/* MapComponent on the right, fixed */}
        <div className="w-3/4 h-full">
          <Suspense fallback={<div>Loading...</div>}>
            {landuse ? <GoogleEarthLayer /> : <MapComponent 
              data={data} 
              road={road}
              railway={railway}
              canals={canals}
              selectedDistricts={selectedDistricts}
              selectedTalukas={selectedTalukas}
            />}
          </Suspense>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
