
const Legend = () => {
  return (
    <>
    <div className="absolute bottom-2 right-2 flex flex-col w-[250px] z-10 bg-white bg-opacity-90 rounded-lg shadow-md p-4 opacity-70">
      <h2 className="mb-3 text-center">Map Legend</h2>
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
    </>
  );
};

export default Legend; 