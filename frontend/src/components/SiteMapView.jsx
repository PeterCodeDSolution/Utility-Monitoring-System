import React, { useState, useRef } from 'react';
import { FiZoomIn, FiZoomOut, FiMap } from 'react-icons/fi';

const SiteMapView = ({ 
  zones,
  onZoneClick,
  selectedZoneId = null,
  width = '100%',
  height = '650px'
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [viewBox, setViewBox] = useState('0 0 1000 800');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentViewBox, setCurrentViewBox] = useState({ x: 0, y: 0, width: 1000, height: 800 });

  // Handle zone click
  const handleZoneClick = (zone) => {
    if (onZoneClick) {
      onZoneClick(zone);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Operating':
      case 'good':
        return '#10B981'; // Green
      case 'Under Construction':
      case 'warning':
        return '#F59E0B'; // Yellow
      case 'Not Sold':
      case 'danger':
        return '#EF4444'; // Red
      case 'Not Built':
      default:
        return '#9CA3AF'; // Gray
    }
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? 1 : -1;
    const factor = Math.exp(direction * zoomIntensity);
    
    const { left, top, width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    
    // Convert mouse position to SVG coordinates
    const svgPoint = {
      x: currentViewBox.x + (mouseX / containerWidth) * currentViewBox.width,
      y: currentViewBox.y + (mouseY / containerHeight) * currentViewBox.height
    };
    
    // Calculate new viewBox dimensions
    const newWidth = currentViewBox.width * factor;
    const newHeight = currentViewBox.height * factor;
    
    // Calculate new viewBox position, adjusting based on mouse position
    const newX = svgPoint.x - (mouseX / containerWidth) * newWidth;
    const newY = svgPoint.y - (mouseY / containerHeight) * newHeight;
    
    // Update viewBox
    const newViewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
    setCurrentViewBox(newViewBox);
    setViewBox(`${newX} ${newY} ${newWidth} ${newHeight}`);
  };

  // Handle zoom buttons
  const handleZoom = (direction) => {
    const factor = direction === 'in' ? 0.8 : 1.25;
    const centerX = currentViewBox.x + currentViewBox.width / 2;
    const centerY = currentViewBox.y + currentViewBox.height / 2;
    
    const newWidth = currentViewBox.width * factor;
    const newHeight = currentViewBox.height * factor;
    const newX = centerX - newWidth / 2;
    const newY = centerY - newHeight / 2;
    
    const newViewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
    setCurrentViewBox(newViewBox);
    setViewBox(`${newX} ${newY} ${newWidth} ${newHeight}`);
  };

  // Reset zoom to fit the entire map
  const handleResetZoom = () => {
    setViewBox('0 0 1000 800');
    setCurrentViewBox({ x: 0, y: 0, width: 1000, height: 800 });
  };

  // Handle pan start
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle pan
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
      
      const scaleX = currentViewBox.width / containerWidth;
      const scaleY = currentViewBox.height / containerHeight;
      
      const newX = currentViewBox.x - dx * scaleX;
      const newY = currentViewBox.y - dy * scaleY;
      
      const newViewBox = { ...currentViewBox, x: newX, y: newY };
      setCurrentViewBox(newViewBox);
      setViewBox(`${newX} ${newY} ${currentViewBox.width} ${currentViewBox.height}`);
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle leaving the SVG area
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Prevent default context menu to improve UX when panning
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative bg-white rounded-lg shadow overflow-hidden" style={{ height }}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-md shadow-md p-1">
        <button 
          className="p-2 text-gray-600 hover:text-primary-600 bg-white rounded-md hover:bg-gray-50"
          onClick={() => handleZoom('in')}
          title="Zoom In"
        >
          <FiZoomIn size={18} />
        </button>
        <button 
          className="p-2 text-gray-600 hover:text-primary-600 bg-white rounded-md hover:bg-gray-50"
          onClick={() => handleZoom('out')}
          title="Zoom Out"
        >
          <FiZoomOut size={18} />
        </button>
        <button 
          className="p-2 text-gray-600 hover:text-primary-600 bg-white rounded-md hover:bg-gray-50"
          onClick={handleResetZoom}
          title="Reset Zoom"
        >
          <FiMap size={18} />
        </button>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-md shadow-md p-3">
        <h4 className="text-sm font-semibold mb-2">สถานะพล็อต</h4>
        <div className="grid grid-cols-2 gap-y-1 gap-x-3 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
            <span>กำลังดำเนินการ</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></span>
            <span>อยู่ระหว่างก่อสร้าง</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-gray-400"></span>
            <span>ยังไม่ได้ก่อสร้าง</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-red-500"></span>
            <span>ยังไม่ได้ขาย</span>
          </div>
        </div>
      </div>
      
      {/* Main Container */}
      <div className="flex h-full">
        {/* Map Container */}
        <div 
          ref={containerRef}
          className="flex-grow relative overflow-hidden bg-gray-100"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onContextMenu={handleContextMenu}
        >
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Rendering zones */}
            {zones && zones.map((zone) => {
              // Handle different zone shapes
              const isSelected = selectedZoneId === zone.id;
              const fillColor = zone.color || getStatusColor(zone.data?.status);
              
              return (
                <g 
                  key={zone.id} 
                  onClick={() => handleZoneClick(zone)} 
                  className="cursor-pointer transition-opacity hover:opacity-70"
                >
                  {zone.shape === 'rect' && (
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.7 : 0.5}
                      stroke={isSelected ? "#000" : fillColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      rx={4}
                      ry={4}
                    />
                  )}
                  
                  {zone.shape === 'circle' && (
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r={zone.r}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.7 : 0.5}
                      stroke={isSelected ? "#000" : fillColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                  )}
                  
                  {zone.shape === 'polygon' && (
                    <polygon
                      points={zone.points}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.7 : 0.5}
                      stroke={isSelected ? "#000" : fillColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                  )}
                  
                  {/* Zone label */}
                  {zone.label && (
                    <text
                      x={zone.labelX || (zone.shape === 'rect' ? zone.x + zone.width/2 : zone.cx)}
                      y={zone.labelY || (zone.shape === 'rect' ? zone.y + zone.height/2 : zone.cy)}
                      fontSize={zone.fontSize || 14}
                      fontWeight={isSelected ? "bold" : "normal"}
                      textAnchor="middle"
                      fill="#fff"
                      pointerEvents="none"
                      className="text-stroke"
                    >
                      {zone.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Site map banner text */}
          <div className="absolute top-0 left-0 right-0 text-center bg-white bg-opacity-70 py-2 font-semibold">
            แผนผังโรงงานอุตสาหกรรม
          </div>
          
          {/* Disclaimer text */}
          <div className="absolute bottom-0 left-0 right-0 text-center bg-white bg-opacity-70 py-1 text-xs text-gray-600">
            คลิกที่พล็อตเพื่อดูรายละเอียด
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMapView; 