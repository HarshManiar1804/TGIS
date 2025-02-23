import { channels, NavbarProps, subCheckboxRanges } from "@/lib/utils";
import { useState, useEffect } from 'react';

export default function Navbar({ 
  data, 
  setData, 
  landuse, 
  setLanduse,
  road,
  setRoad,
  selectedDistricts,
  setSelectedDistricts,
  selectedTalukas,
  setSelectedTalukas,
  railway,
  setRailway,
  canals,
  setCanals,
  theme,
  setTheme
}: NavbarProps) {
  const [isBasinOpen, setIsBasinOpen] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isRoadDropdownOpen, setIsRoadDropdownOpen] = useState(false);
  const [isRailwayDropdownOpen, setIsRailwayDropdownOpen] = useState(false);
  const [isCanalDropdownOpen, setIsCanalDropdownOpen] = useState(false);
  const [talukas, setTalukas] = useState<Record<string, string[]>>({});
  const [availableTalukas, setAvailableTalukas] = useState<string[]>([]);
  const [isTalukaDropdownOpen, setIsTalukaDropdownOpen] = useState(false);

  // Fetch districts and talukas from GeoJSON files
  useEffect(() => {
    // Fetch districts
    fetch('/Districts.geojson')
      .then(response => response.json())
      .then(data => {
        const districtNames = data.features.map((feature: any) => feature.properties.NAME_2);
        const uniqueDistricts = Array.from(new Set(districtNames)).sort();
        setDistricts(uniqueDistricts as string[]);
      })
      .catch(error => console.error('Error loading districts:', error));

    // Fetch talukas
    fetch('/Talukas.geojson')
      .then(response => response.json())
      .then(data => {
        // Create a mapping of district to talukas
        const talukasMap: Record<string, string[]> = {};
        data.features.forEach((feature: any) => {
          const district = feature.properties.NAME_2; // District name
          const taluka = feature.properties.NAME_3;   // Taluka name
          if (!talukasMap[district]) {
            talukasMap[district] = [];
          }
          if (!talukasMap[district].includes(taluka)) {
            talukasMap[district].push(taluka);
          }
        });
        // Sort talukas for each district
        Object.keys(talukasMap).forEach(district => {
          talukasMap[district].sort();
        });
        setTalukas(talukasMap);
        console.log('Talukas mapping:', talukasMap); // For debugging
      })
      .catch(error => console.error('Error loading talukas:', error));
  }, []);

  // Update available talukas when districts selection changes
  useEffect(() => {
    const newAvailableTalukas = selectedDistricts.flatMap(district => talukas[district] || []);
    setAvailableTalukas(Array.from(new Set(newAvailableTalukas)).sort());
    // Clear selected talukas that are no longer available
    setSelectedTalukas(prev => prev.filter(taluka => newAvailableTalukas.includes(taluka)));
  }, [selectedDistricts, talukas, setSelectedTalukas]);

  // Handle district selection
  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => {
      const newSelection = prev.includes(district)
        ? prev.filter(d => d !== district)
        : [...prev, district];
      return newSelection;
    });
  };

  // Handle taluka selection
  const handleTalukaChange = (taluka: string) => {
    setSelectedTalukas(prev => {
      const newSelection = prev.includes(taluka)
        ? prev.filter(t => t !== taluka)
        : [...prev, taluka];
      return newSelection;
    });
  };

  // Handle channel checkbox change
  const handleChannelCheckboxChange = (channel: string, subCheckboxes: string[]) => {
    setData((prevState: Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>) => {
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
    setData((prevState: Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>) => {
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
    setData((prevState: Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>) => {
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
    setLanduse((prev: boolean) => !prev);
  };
  const handleRoadChange = () => {
    setRoad((prev: boolean) => !prev);
  };
  const handleRailwayChange = () => {
    setRailway((prev: boolean) => !prev);
  };
  const handleCanalChange = () => {
    setCanals((prev: boolean) => !prev);
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
            <div>
              <span>Elevation</span>
              <input type="checkbox" />
            </div>
            {/* Aspect Switch */}
            <div>
              <span>Aspect</span>
              <input type="checkbox" />
            </div>
            {/* Slope Switch */}
            <div>
              <span>Slope</span>
              <input type="checkbox" />
            </div>
          </div>
        )}

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
        {/* Mahi Basin Dropdown */}
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
         {/* District Multi-Select Dropdown */}
         <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <div 
              className="flex justify-between items-center cursor-pointer p-2 border border-gray-300 rounded-md"
              onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
            >
              <span className="text-lg font-semibold text-gray-700">
                {selectedDistricts.length === 0 
                  ? 'Select Districts' 
                  : `Selected: ${selectedDistricts.length} district${selectedDistricts.length > 1 ? 's' : ''}`}
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${isDistrictDropdownOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDistrictDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {districts.map((district, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDistrictChange(district)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(district)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-gray-700">{district}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedDistricts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedDistricts.map((district, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {district}
                  <button
                    type="button"
                    onClick={() => handleDistrictChange(district)}
                    className="ml-1.5 inline-flex items-center justify-center"
                  >
                    <span className="sr-only">Remove</span>
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Taluka Multi-Select Dropdown */}
        {selectedDistricts.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="relative">
              <div 
                className="flex justify-between items-center cursor-pointer p-2 border border-gray-300 rounded-md"
                onClick={() => setIsTalukaDropdownOpen(!isTalukaDropdownOpen)}
              >
                <span className="text-lg font-semibold text-gray-700">
                  {selectedTalukas.length === 0 
                    ? 'Select Talukas' 
                    : `Selected: ${selectedTalukas.length} taluka${selectedTalukas.length > 1 ? 's' : ''}`}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${isTalukaDropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isTalukaDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {availableTalukas.map((taluka, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleTalukaChange(taluka)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTalukas.includes(taluka)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label className="ml-2 text-gray-700">{taluka}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedTalukas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTalukas.map((taluka, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {taluka}
                    <button
                      type="button"
                      onClick={() => handleTalukaChange(taluka)}
                      className="ml-1.5 inline-flex items-center justify-center"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}