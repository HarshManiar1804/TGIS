import { useState } from 'react';

const Legend = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
    <div className="absolute top-2 right-2 flex flex-col w-[250px] z-10 bg-white bg-opacity-90 rounded-lg shadow-md p-4 opacity-70">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-center flex-grow">Map Legend</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>
      
      <div className={`space-y-2 transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="mb-2 flex items-center justify-between">
          <strong>Taluka Boundary:</strong>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#1f78b4', border: '1px solid black' }}></div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <strong>District Boundary:</strong>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#000000', border: '1px solid black' }}></div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <strong>Road:</strong>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#878787', border: '1px solid black' }}></div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <strong>Railway:</strong>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#e31a1c', border: '1px solid black' }}></div>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <strong>Canal:</strong>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#2741ea', border: '1px solid black' }}></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Legend;