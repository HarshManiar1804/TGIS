import React from "react";
import { useState } from "react";
import Navbar from "./components/NavBar";
import { DataProvider } from "./context/dataContext";
import { dataState } from "./lib/utils";
const MahiLanduse = React.lazy(() => import("./components/MahiLanduse"));
const MapComponent = React.lazy(() => import("./components/MapComponent"));
import { Suspense } from 'react';

function App() {
  const [data, setData] = useState<dataState>({});
  const [landuse, setLanduse] = useState<boolean>(false);
  console.log("landuse value in the div: ", landuse)
  return (
    <DataProvider>
      <div className="flex flex-row h-screen">
        {/* Navbar on the left, scrollable */}
        <div className="w-1/4 h-full overflow-y-auto">
          <Navbar data={data} setData={setData} landuse={landuse} setLanduse={setLanduse} />
        </div>
        {/* MapComponent on the right, fixed */}
        <div className="w-3/4 h-full">
          <Suspense fallback={<div>Loading...</div>}>
            {landuse ? <MahiLanduse /> : <MapComponent data={data} />}
          </Suspense>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;
