import { channels, dataState, NavbarProps, subCheckboxRanges } from "@/lib/utils";
import { useState } from 'react';

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
  setTheme
}: NavbarProps) {
  const [isBasinOpen, setIsBasinOpen] = useState(false);


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
  const handleLanduseChange = () => {
    setLanduse(!landuse);
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

  // Handle theme selection
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  // Render component
  return (
    <>
      <div className="font-bold text-2xl p-4">Dashboard</div>
      <div className="flex-1 space-y-4 p-6 bg-gray-100 font-sans">
        {/* Districts Switch */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Districts</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={districts}
              onChange={handleDistrictsChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {/* Talukas Switch */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Talukas</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={talukas}
              onChange={handleTalukasChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        
        {/* Road Switch */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Road</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={road}
              onChange={handleRoadChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
{       /* Railway Switch */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Railway</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={railway}
              onChange={handleRailwayChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {/* Canals Switch */}
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">Map Canals</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={canals}
              onChange={handleCanalChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
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
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            {/* Mahi Landuse Switch */}
            <span className="text-lg font-semibold text-gray-700">Map Landuse</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={landuse}
                onChange={handleLanduseChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        )}

        {theme === 'hydrology' && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Mahi Basin Content */}
            <span className="text-lg font-semibold text-gray-700">Mahi Basin</span>
            {/* Add your Mahi Basin content here */}
          </div>
        )}

        {theme === 'terrain' && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <span className="text-lg font-semibold text-gray-700">Terrain Options</span>
            {/* Elevation Switch */}
            <div className="flex items-center justify-between">
              <span>Elevation</span>
              <input type="checkbox" />
            </div>
            {/* Aspect Switch */}
            <div className="flex items-center justify-between">
              <span>Aspect</span>
              <input type="checkbox" />
            </div>
            {/* Slope Switch */}
            <div className="flex items-center justify-between">
              <span>Slope</span>
              <input type="checkbox" />
            </div>
          </div>
        )}
        {/* Mahi Basin Dropdown */}
        {theme === 'hydrology' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Mahi Basin</span>
              <div className="flex items-center space-x-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={handleSelectAllChange}
                    checked={channels.every((channel) => data[channel]?.isChecked)}
                    disabled={landuse}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
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
            </div>
            {/* Dropdown Content */}
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
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={data[channel]?.isChecked || false}
                            onChange={() => handleChannelCheckboxChange(channel, subCheckboxValues)}
                            disabled={landuse}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
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
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={data[channel]?.subCheckboxes?.[subValue] || false}
                                  onChange={() => handleSubCheckboxChange(channel, subValue)}
                                  disabled={landuse}
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
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

      </div>
    </>
  );
}