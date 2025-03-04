import { channels, dataState, NavbarProps, subCheckboxRanges } from "@/lib/utils";
import { useState, useEffect } from 'react';

export default function Navbar({ 
  data, 
  setData, 
  landuse, 
  setLanduse,
  road,
  setRoad,
  railway,  
  setRailway,
  canals,
  setCanals,
  talukas,
  setTalukas,
  districts,
  setDistricts,
  theme,
  setTheme, 
  elevation,
  setElevation,
  slope,
  setSlope,
  aspect,
  setAspect
}: NavbarProps) {
  const [isBasinOpen, setIsBasinOpen] = useState(false);
  const [isLanduseBasinOpen, setIsLanduseBasinOpen] = useState(false);
  const [isTerrainBasinOpen, setIsTerrainBasinOpen] = useState(false);


  // Handle channel checkbox change
  const handleChannelCheckboxChange = (channel: string, subCheckboxes: string[]) => {
    setData((prevState) => {
      const isChecked = !prevState[channel]?.isChecked;
      return {
        ...prevState,
        [channel]: {
          isChecked,
          subCheckboxes: isChecked
            ? Object.fromEntries(subCheckboxes.map((sub) => [sub, false]))
            : {}, // Reset sub-checkboxes if unchecked
        },
      } as dataState;
    });
  };

  // Handle sub-checkbox change
  const handleSubCheckboxChange = (channel: string, subValue: string) => {
    setData((prevState) => {
      const currentSubCheckboxes = prevState[channel]?.subCheckboxes || {};
      return {
        ...prevState,
        [channel]: {
          ...prevState[channel],
          subCheckboxes: {
            ...currentSubCheckboxes,
            [subValue]: !currentSubCheckboxes[subValue],
          },
        },
      } as dataState;
    });
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    setData((prevState) => {
      const allSelected = channels.every((channel) => prevState[channel]?.isChecked);
      const newState: dataState = channels.reduce((acc, channel, index) => {
        const subCheckboxes = subCheckboxRanges[index + 1];
        acc[channel] = {
          isChecked: !allSelected,
          subCheckboxes: !allSelected
            ? Object.fromEntries(subCheckboxes.map((sub) => [sub, false]))
            : {}, // Reset sub-checkboxes if unchecking all
        };
        return acc;
      }, {} as dataState);
      return newState;
    });
  };
  
  const handleRoadChange = () => {
    setRoad(!road);
  };
  const handleRailwayChange = () => {
    setRailway(!railway);
  };
  const handleTalukasChange = () => {
    setTalukas(!talukas);
  };
  const handleDistrictsChange = () => {
    setDistricts(!districts);
  };
  const handleCanalChange = () => {
    setCanals(!canals);
  };

  useEffect(() => {
    setTheme('landuse');
    setLanduse(true);
  }, []);
  // Handle theme selection
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as 'landuse' | 'hydrology' | 'terrain';
    setTheme(newTheme);
    
    // Reset all theme-specific states first
    setLanduse(false);
    setElevation(false);
    setSlope(false);
    setAspect(false);
    
    // Close basin section and reset data for non-hydrology themes
    if (newTheme !== 'hydrology') {
      setIsBasinOpen(false);
    setIsLanduseBasinOpen(false);
    setIsTerrainBasinOpen(false);
      setData({} as dataState);
    }
    
    // Enable specific features based on selected theme
    switch (newTheme) {
      case 'landuse':
        setLanduse(true);
        break;
      case 'terrain':
        setElevation(true); // Default to elevation
       
        break;
      case 'hydrology':
        // Automatically select all basins and their sub-checkboxes
        const newState: dataState = channels.reduce((acc, channel, index) => {
          const subCheckboxes = subCheckboxRanges[index + 1];
          acc[channel] = {
            isChecked: true,
            subCheckboxes: Object.fromEntries(subCheckboxes.map((sub) => [sub, false]))
          };
          return acc;
        }, {} as dataState);
        setData(newState);
        break;
    }
  };

  // Handle terrain radio selection
  const handleTerrainOptionChange = (option: 'elevation' | 'slope' | 'aspect') => {
    // Reset all terrain options
    setElevation(false);
    setSlope(false);
    setAspect(false);

    // Set the selected option
    switch (option) {
      case 'elevation':
        setElevation(true);
        break;
      case 'slope':
        setSlope(true);
        break;
      case 'aspect':
        setAspect(true);
        break;
    }
  };

  // Render component
  return (
    <>
      <div className="font-bold text-2xl p-4">Dashboard</div>
      <div className="flex-1 space-y-4 p-6 bg-gray-100 font-sans">
        {/* Districts Checkbox */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Districts</span>
          <input
            type="checkbox"
            checked={districts}
            onChange={handleDistrictsChange}
            className="w-6 h-6"
          />
        </div>
        {/* Talukas Checkbox */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Talukas</span>
          <input
            type="checkbox"
            checked={talukas}
            onChange={handleTalukasChange}
            className="w-6 h-6"
          />
        </div>

        {/* Road Checkbox */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Road</span>
          <input
            type="checkbox"
            checked={road}
            onChange={handleRoadChange}
            className="w-6 h-6"
          />
        </div>
        {/* Railway Checkbox */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Railway</span>
          <input
            type="checkbox"
            checked={railway}
            onChange={handleRailwayChange}
            className="w-6 h-6"
          />
        </div>
        {/* Canals Checkbox */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Canals</span>
          <input
            type="checkbox"
            checked={canals}
            onChange={handleCanalChange}
            className="w-6 h-6"
          />
        </div>

        {/* Theme Selection Dropdown */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <label className="text-lg font-semibold text-gray-700">Select Theme</label>
          <select 
            value={theme} 
            onChange={handleThemeChange} 
            className="mt-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="landuse">Landuse</option>
            <option value="hydrology">Hydrology</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {/* Conditional Rendering based on selected theme */}
        {theme === 'landuse' && (
          <>
            {/* Landuse Basin Dropdown */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">Landuse Basin</span>
                <button
                  onClick={() => setIsLanduseBasinOpen(!isLanduseBasinOpen)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className={`w-6 h-6 transition-transform ${isLanduseBasinOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isLanduseBasinOpen && (
                <div className="border-t">
                  {channels.map((channel, index) => {
                    const subCheckboxValues = subCheckboxRanges[index + 1];
                    return (
                      <div key={channel} className="border-b last:border-b-0">
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-base font-medium text-gray-700">
                            {`Landuse Sub - Basin (MA - ${index + 1})`}
                          </span>
                          <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={data[channel]?.isChecked || false}
                            onChange={() => handleChannelCheckboxChange(channel, subCheckboxValues)}
                          />
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {theme === 'hydrology' && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Mahi Basin</span>
              <button
                onClick={() => setIsBasinOpen(!isBasinOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className={`w-6 h-6 transition-transform ${isBasinOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {isBasinOpen && (
              <div className="border-t">
                {channels.map((channel, index) => {
                  const subCheckboxValues = subCheckboxRanges[index + 1];
                  return (
                    <div key={channel} className="border-b last:border-b-0">
                      <div className="p-4 flex items-center justify-between">
                        <span className="text-base font-medium text-gray-700">
                          {`Mahi Sub - Basin (MA - ${index + 1})`}
                        </span>
                        <input
                          type="checkbox"
                          className="w-6 h-6"
                          checked={data[channel]?.isChecked || false}
                          onChange={() => handleChannelCheckboxChange(channel, subCheckboxValues)}
                          />
                      </div>
                      {/* Sub-categories */}
                      {data[channel]?.isChecked && (
                        <div className="bg-gray-50 p-4 space-y-3">
                          {subCheckboxValues.map((subValue, subIndex) => (
                            <div key={subValue} className="flex items-center justify-between pl-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">{subValue}</span>
                                <div
                                  className={`bg-blue-500 ${
                                    subIndex === 0 ? "w-5 h-0.5" :
                                    subIndex === 1 ? "w-5 h-1" :
                                    subIndex === 2 ? "w-5 h-1.5" :
                                    subIndex === 3 ? "w-5 h-2" :
                                    "w-5 h-2.5"
                                  }`}
                                />
                              </div>
                              <input
                                type="checkbox"
                                className="w-6 h-6"
                                checked={data[channel]?.subCheckboxes?.[subValue] || false}
                                onChange={() => handleSubCheckboxChange(channel, subValue)}
                                />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {theme === 'terrain' && (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-lg font-semibold text-gray-700 mb-4">Terrain Options</span>
              {/* Elevation Radio */}
              <div className="flex items-center justify-between mb-4">
                <span>Elevation</span>
                <input 
                  type="radio" 
                  name="terrainOption"
                  checked={elevation}
                  onChange={() => handleTerrainOptionChange('elevation')}
                  className="w-6 h-6" 
                />
              </div>
              {/* Aspect Radio */}
              <div className="flex items-center justify-between mb-4">
                <span>Aspect</span>
                <input 
                  type="radio"
                  name="terrainOption"
                  checked={aspect}
                  onChange={() => handleTerrainOptionChange('aspect')}
                  className="w-6 h-6" 
                />
              </div>
              {/* Slope Radio */}
              <div className="flex items-center justify-between mb-4">
                <span>Slope</span>
                <input 
                  type="radio"
                  name="terrainOption"
                  checked={slope}
                  onChange={() => handleTerrainOptionChange('slope')}
                  className="w-6 h-6" 
                />
              </div>
            </div>

            {/* Terrain Basin Selection */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">Terrain Basin</span>
                <button
                  onClick={() => setIsTerrainBasinOpen(!isTerrainBasinOpen)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className={`w-6 h-6 transition-transform ${isTerrainBasinOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isTerrainBasinOpen && (
                <div className="border-t">
                  {channels.map((channel, index) => {
                    const subCheckboxValues = subCheckboxRanges[index + 1];
                    return (
                      <div key={channel} className="border-b last:border-b-0">
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-base font-medium text-gray-700">
                            {`Terrain Sub - Basin (MA - ${index + 1})`}
                          </span>
                          <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={data[channel]?.isChecked || false}
                            onChange={() => handleChannelCheckboxChange(channel, subCheckboxValues)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </>
  );
}