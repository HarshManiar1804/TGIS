import { channels, NavbarProps, subCheckboxRanges } from "@/lib/utils";

export default function Navbar({ data, setData, landuse, setLanduse }: NavbarProps) {

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
      };
    });
  };

  // Handle sub-checkbox change
  const handleSubCheckboxChange = (channel: string, subValue: string) => {
    setData((prevState: Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>) => ({
      ...prevState,
      [channel]: {
        ...prevState[channel],
        subCheckboxes: {
          ...prevState[channel]?.subCheckboxes,
          [subValue]: !prevState[channel]?.subCheckboxes?.[subValue],
        },
      },
    }));
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    setData((prevState: Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>) => {
      const allSelected = channels.every((channel) => prevState[channel]?.isChecked);
      const newState = channels.reduce((acc, channel, index) => {
        const subCheckboxes = subCheckboxRanges[index + 1];
        acc[channel] = {
          isChecked: !allSelected,
          subCheckboxes: !allSelected
            ? Object.fromEntries(subCheckboxes.map((sub) => [sub, false]))
            : {}, // Reset sub-checkboxes if unchecking all
        };
        return acc;
      }, {} as Record<string, { isChecked: boolean; subCheckboxes: Record<string, boolean> }>);
      return newState;
    });
  };

  const handleLanduseChange = () => {
    setLanduse((prev: boolean) => !prev);
  };

  // Render component
  return (
    <>
      <div className="font-bold text-2xl p-4 bg-">Dashboard</div>
      <div className="flex-1 space-y-6 p-6 bg-gray-100 font-sans">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-200"
              onChange={handleLanduseChange}
              checked={landuse}
            />
            <label
              htmlFor="select-all"
              className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200"
            >
              Mahi Landuse
            </label>
          </div>
        </div>
        {/* Select All Checkbox */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="select-all"
              className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-200"
              onChange={handleSelectAllChange}
              checked={channels.every((channel) => data[channel]?.isChecked)}
              disabled={landuse} // Disable when landuse is true
            />
            <label
              htmlFor="select-all"
              className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200"
            >
              Mahi Basin
            </label>
          </div>
        </div>

        {/* Individual Channel Checkboxes */}
        {channels.map((channel, index) => {
          const subCheckboxValues = subCheckboxRanges[index + 1];
          return (
            <div key={channel} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id={channel}
                  className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-200"
                  checked={data[channel]?.isChecked || false}
                  onChange={() => handleChannelCheckboxChange(channel, subCheckboxValues)}
                  disabled={landuse} // Disable when landuse is true
                />
                <label
                  htmlFor={channel}
                  className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200"
                >
                  {`Mahi Sub - Basin (MA - ${index + 1})`}
                </label>
              </div>

              {/* Sub-checkboxes */}
              {data[channel]?.isChecked && (
                <div className="ml-10 mt-4 space-y-3">
                  {subCheckboxValues.map((subValue, index) => (
                    <div key={subValue} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`${channel}-${subValue}`}
                        checked={data[channel]?.subCheckboxes?.[subValue] || false}
                        onChange={() => handleSubCheckboxChange(channel, subValue)}
                        className="h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all duration-200"
                        disabled={landuse} // Disable when landuse is true
                      />
                      <label
                        htmlFor={`${channel}-${subValue}`}
                        className="flex text-base font-medium text-gray-700 cursor-pointer hover:text-blue-700 transition-colors duration-200"
                      >
                        {subValue}

                        {/* Render blue line based on index */}
                        <div
                          key={index}
                          className={`bg-blue-500 mt-2 ml-2 ${index === 0 ? "w-5 h-0.5" :
                            index === 1 ? "w-5 h-1" :
                              index === 2 ? "w-5 h-1.5" :
                                index === 3 ? "w-5 h-2" :
                                  "w-5 h-2.5"}`}
                        ></div>

                      </label>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </>
  );
}
