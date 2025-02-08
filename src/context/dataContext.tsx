import { DataContextProps, DataProviderProps, State } from "@/lib/utils";
import React, { createContext, useState } from "react";

const DataContext = createContext<DataContextProps | null>(null);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<State>({});
  const [landUse, setLandUse] = useState<boolean>(false);

  const updateData = (
    channel: string,
    updateCallback: (prevState: State) => State
  ) => {
    setData((prevState) => {
      const updatedState = updateCallback(prevState);
      return { ...prevState, [channel]: updatedState[channel] };
    });
  };

  // Function to update landUse state
  const updateLandUse = (updateCallback: (prevLandUse: boolean) => boolean) => {
    setLandUse((prevLandUse) => updateCallback(prevLandUse));
  };

  return (
    <DataContext.Provider value={{ data, updateData, landUse, updateLandUse }}>
      {children}
    </DataContext.Provider>
  );
};
