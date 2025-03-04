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
  const [talukas, setTalukas] = useState<boolean>(false);
  const [districts, setDistricts] = useState<boolean>(false);
  const [theme, setTheme] = useState('landuse');
  const [elevation, setElevation] = useState<boolean>(false);
  const [slope, setSlope] = useState<boolean>(false);
  const [aspect, setAspect] = useState<boolean>(false);
  
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
            talukas={talukas}
            setTalukas={setTalukas}
            districts={districts}
            setDistricts={setDistricts}
            theme={theme}
            setTheme={setTheme}
            elevation={elevation}
            setElevation={setElevation}
            slope={slope}
            setSlope={setSlope}
            aspect={aspect}
            setAspect={setAspect}
          />
        </div>
        {/* MapComponent on the right, fixed */}
        <div className="w-3/4 h-full">
          <Suspense fallback={<div>Loading...</div>}>
             <MapComponent 
              data={data} 
              road={road}
              railway={railway}
              canals={canals}
              talukas={talukas}
              districts={districts}
              theme={theme}
              landuse={landuse}
              elevation={elevation}
              slope={slope}
              aspect={aspect}
            />
            
          </Suspense>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
