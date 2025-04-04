import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiCheck, FiX, FiMove, FiEdit2, FiTrash, FiSquare, FiCircle, FiTriangle } from 'react-icons/fi';

const ZoneEditor = ({ 
  backgroundImage,
  onSaveZones,
  initialZones = [], 
  width = '100%',
  height = '600px'
}) => {
  const [zones, setZones] = useState(initialZones);
  const [currentZone, setCurrentZone] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingShape, setDrawingShape] = useState('rect'); // 'rect', 'circle', 'polygon'
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [resizePoint, setResizePoint] = useState('');
  const [movingZone, setMovingZone] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [viewBox, setViewBox] = useState('0 0 1000 800');
  const [currentViewBox, setCurrentViewBox] = useState({ x: 0, y: 0, width: 1000, height: 800 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Load and measure background image size
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setViewBox(`0 0 ${img.width} ${img.height}`);
        setCurrentViewBox({ x: 0, y: 0, width: img.width, height: img.height });
        setImageLoaded(true);
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage]);

  // Convert mouse/touch coordinates to SVG coordinates
  const getSVGCoordinates = (event) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svgElement = svgRef.current;
    const pt = svgElement.createSVGPoint();
    
    // Determine clientX and clientY, accounting for both mouse and touch events
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    pt.x = clientX;
    pt.y = clientY;
    
    // Convert client coordinates to SVG coordinates
    const svgP = pt.matrixTransform(svgElement.getScreenCTM().inverse());
    
    return { x: svgP.x, y: svgP.y };
  };

  // Start drawing a new zone
  const handleStartDrawing = (e) => {
    if (!drawingMode || movingZone || resizing || editingZoneId) return;
    
    e.preventDefault();
    const coords = getSVGCoordinates(e);
    
    // For polygon, add points as we click
    if (drawingShape === 'polygon') {
      setPolygonPoints(prev => [...prev, coords]);
      return;
    }
    
    // For rectangle and circle, set initial coordinates
    let newZone = {};
    if (drawingShape === 'rect') {
      newZone = {
        id: `zone_${Date.now()}`,
        shape: 'rect',
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
        label: `Zone ${zones.length + 1}`,
        color: getRandomColor()
      };
    } else if (drawingShape === 'circle') {
      newZone = {
        id: `zone_${Date.now()}`,
        shape: 'circle',
        cx: coords.x,
        cy: coords.y,
        r: 0,
        label: `Zone ${zones.length + 1}`,
        color: getRandomColor()
      };
    }
    
    setCurrentZone(newZone);
  };

  // Continue drawing (resize while drawing)
  const handleDrawing = (e) => {
    if (drawingMode && currentZone && !editingZoneId) {
      e.preventDefault();
      const coords = getSVGCoordinates(e);
      setMousePos(coords);
      
      if (currentZone.shape === 'rect') {
        setCurrentZone({
          ...currentZone,
          width: Math.max(10, coords.x - currentZone.x),
          height: Math.max(10, coords.y - currentZone.y)
        });
      } else if (currentZone.shape === 'circle') {
        const dx = coords.x - currentZone.cx;
        const dy = coords.y - currentZone.cy;
        const radius = Math.max(10, Math.sqrt(dx * dx + dy * dy));
        setCurrentZone({
          ...currentZone,
          r: radius
        });
      }
    }
  };

  // Finish drawing
  const handleFinishDrawing = () => {
    if (drawingShape === 'polygon' && polygonPoints.length > 2) {
      // Create a polygon zone from the collected points
      const points = polygonPoints.map(p => `${p.x},${p.y}`).join(' ');
      const newZone = {
        id: `zone_${Date.now()}`,
        shape: 'polygon',
        points: points,
        label: `Zone ${zones.length + 1}`,
        color: getRandomColor()
      };
      setZones([...zones, newZone]);
      setPolygonPoints([]);
    } else if (currentZone) {
      // For rectangle and circle
      setZones([...zones, currentZone]);
      setCurrentZone(null);
    }
  };

  // Cancel current drawing
  const handleCancelDrawing = () => {
    setCurrentZone(null);
    setPolygonPoints([]);
    setDrawingMode(false);
  };

  // Start editing a zone
  const handleStartEditing = (zone) => {
    if (drawingMode) return;
    setEditingZoneId(zone.id);
  };

  // Save changes to a zone
  const handleSaveEditing = () => {
    setEditingZoneId(null);
  };

  // Start moving a zone
  const handleStartMoving = (e, zone) => {
    if (drawingMode || editingZoneId !== zone.id) return;
    e.stopPropagation();
    setMovingZone(true);
    
    // Store starting point for the move
    const coords = getSVGCoordinates(e);
    if (zone.shape === 'rect') {
      setMousePos({ 
        x: coords.x - zone.x, 
        y: coords.y - zone.y 
      });
    } else if (zone.shape === 'circle') {
      setMousePos({
        x: coords.x - zone.cx,
        y: coords.y - zone.cy
      });
    } else if (zone.shape === 'polygon') {
      setMousePos(coords);
    }
  };

  // Move a zone
  const handleMoveZone = (e) => {
    if (!movingZone || !editingZoneId) return;
    e.preventDefault();
    
    const coords = getSVGCoordinates(e);
    const zoneIndex = zones.findIndex(z => z.id === editingZoneId);
    if (zoneIndex === -1) return;
    
    const zone = zones[zoneIndex];
    const updatedZones = [...zones];
    
    if (zone.shape === 'rect') {
      updatedZones[zoneIndex] = {
        ...zone,
        x: coords.x - mousePos.x,
        y: coords.y - mousePos.y
      };
    } else if (zone.shape === 'circle') {
      updatedZones[zoneIndex] = {
        ...zone,
        cx: coords.x - mousePos.x,
        cy: coords.y - mousePos.y
      };
    } else if (zone.shape === 'polygon') {
      // Move polygon by translating all points
      const dx = coords.x - mousePos.x;
      const dy = coords.y - mousePos.y;
      
      const points = zone.points.split(' ').map(point => {
        const [x, y] = point.split(',').map(parseFloat);
        return `${x + dx},${y + dy}`;
      }).join(' ');
      
      updatedZones[zoneIndex] = {
        ...zone,
        points: points
      };
      
      setMousePos(coords);
    }
    
    setZones(updatedZones);
  };

  // Start resizing a zone
  const handleStartResizing = (e, zone, point) => {
    if (drawingMode || editingZoneId !== zone.id) return;
    e.stopPropagation();
    setResizing(true);
    setResizePoint(point);
  };

  // Resize a zone
  const handleResizeZone = (e) => {
    if (!resizing || !editingZoneId || !resizePoint) return;
    e.preventDefault();
    
    const coords = getSVGCoordinates(e);
    const zoneIndex = zones.findIndex(z => z.id === editingZoneId);
    if (zoneIndex === -1) return;
    
    const zone = zones[zoneIndex];
    const updatedZones = [...zones];
    
    if (zone.shape === 'rect') {
      let newX = zone.x;
      let newY = zone.y;
      let newWidth = zone.width;
      let newHeight = zone.height;
      
      // Handle different resize points
      switch (resizePoint) {
        case 'nw':
          newX = coords.x;
          newY = coords.y;
          newWidth = zone.x + zone.width - coords.x;
          newHeight = zone.y + zone.height - coords.y;
          break;
        case 'ne':
          newY = coords.y;
          newWidth = coords.x - zone.x;
          newHeight = zone.y + zone.height - coords.y;
          break;
        case 'sw':
          newX = coords.x;
          newWidth = zone.x + zone.width - coords.x;
          newHeight = coords.y - zone.y;
          break;
        case 'se':
          newWidth = coords.x - zone.x;
          newHeight = coords.y - zone.y;
          break;
        default:
          break;
      }
      
      updatedZones[zoneIndex] = {
        ...zone,
        x: newX,
        y: newY,
        width: Math.max(10, newWidth),
        height: Math.max(10, newHeight)
      };
    } else if (zone.shape === 'circle') {
      const dx = coords.x - zone.cx;
      const dy = coords.y - zone.cy;
      const radius = Math.max(10, Math.sqrt(dx * dx + dy * dy));
      
      updatedZones[zoneIndex] = {
        ...zone,
        r: radius
      };
    }
    
    setZones(updatedZones);
  };
  
  // Update zone label
  const updateZoneLabel = (zoneId, label) => {
    const zoneIndex = zones.findIndex(z => z.id === zoneId);
    if (zoneIndex === -1) return;
    
    const updatedZones = [...zones];
    updatedZones[zoneIndex] = {
      ...updatedZones[zoneIndex],
      label: label
    };
    
    setZones(updatedZones);
  };

  // Delete a zone
  const deleteZone = (zoneId) => {
    setZones(zones.filter(z => z.id !== zoneId));
    if (editingZoneId === zoneId) {
      setEditingZoneId(null);
    }
  };

  // Finish moving or resizing
  const handleFinishAction = () => {
    setMovingZone(false);
    setResizing(false);
    setResizePoint('');
  };

  // Generate a random color
  const getRandomColor = () => {
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // green-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // purple-500
      '#EC4899', // pink-500
      '#F97316', // orange-500
      '#14B8A6', // teal-500
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Save zones
  const handleSaveZones = () => {
    if (onSaveZones) {
      onSaveZones(zones);
    }
    console.log("Saved zones:", zones);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDrawingMode(!drawingMode);
              if (!drawingMode) {
                setEditingZoneId(null);
              } else {
                setCurrentZone(null);
                setPolygonPoints([]);
              }
            }}
            className={`px-4 py-2 rounded-md flex items-center gap-1 ${
              drawingMode ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-gray-300'
            }`}
          >
            {drawingMode ? (
              <>
                <FiX /> Cancel Drawing
              </>
            ) : (
              <>
                <FiPlus /> Draw Zone
              </>
            )}
          </button>
          
          {drawingMode && (
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setDrawingShape('rect')}
                className={`p-2 rounded-md ${drawingShape === 'rect' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-gray-300'}`}
                title="Draw Rectangle"
              >
                <FiSquare />
              </button>
              <button
                onClick={() => setDrawingShape('circle')}
                className={`p-2 rounded-md ${drawingShape === 'circle' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-gray-300'}`}
                title="Draw Circle"
              >
                <FiCircle />
              </button>
              <button
                onClick={() => setDrawingShape('polygon')}
                className={`p-2 rounded-md ${drawingShape === 'polygon' ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-gray-300'}`}
                title="Draw Polygon"
              >
                <FiTriangle />
              </button>
              
              {drawingShape === 'polygon' && polygonPoints.length >= 3 && (
                <button
                  onClick={handleFinishDrawing}
                  className="px-4 py-2 rounded-md bg-green-100 text-green-700 border border-green-300 flex items-center gap-1"
                >
                  <FiCheck /> Complete Polygon
                </button>
              )}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSaveZones}
          className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
        >
          <FiCheck /> Save Zones
        </button>
      </div>
      
      <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
          ref={containerRef}
          className="relative overflow-hidden"
          style={{ width, height, cursor: drawingMode ? 'crosshair' : 'default' }}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawing}
          onMouseUp={handleFinishDrawing}
          onMouseLeave={handleFinishAction}
        >
          <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={(e) => {
              handleMoveZone(e);
              handleResizeZone(e);
            }}
            onMouseUp={handleFinishAction}
          >
            {/* Background Image */}
            {backgroundImage && imageLoaded && (
              <image
                href={backgroundImage}
                x="0"
                y="0"
                width={imageSize.width}
                height={imageSize.height}
              />
            )}
            
            {/* Polygon in progress */}
            {drawingShape === 'polygon' && polygonPoints.length >= 2 && (
              <polygon
                points={polygonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill={getRandomColor()}
                fillOpacity="0.3"
                stroke="#000"
                strokeWidth="1"
                strokeDasharray="5,5"
                pointerEvents="none"
              />
            )}
            
            {/* Existing zones */}
            {zones.map((zone) => {
              const isEditing = editingZoneId === zone.id;
              
              return (
                <g 
                  key={zone.id} 
                  onClick={() => !drawingMode && handleStartEditing(zone)}
                  className={!drawingMode ? "cursor-pointer" : ""}
                >
                  {zone.shape === 'rect' && (
                    <>
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        fill={zone.color}
                        fillOpacity={isEditing ? 0.6 : 0.4}
                        stroke={isEditing ? "#000" : zone.color}
                        strokeWidth={isEditing ? 2 : 1}
                        onMouseDown={isEditing ? (e) => handleStartMoving(e, zone) : undefined}
                      />
                      
                      {isEditing && (
                        <>
                          {/* Resize handles */}
                          <circle cx={zone.x} cy={zone.y} r={5} fill="#fff" stroke="#000" strokeWidth="1" 
                            onMouseDown={(e) => handleStartResizing(e, zone, 'nw')} className="cursor-nwse-resize" />
                          <circle cx={zone.x + zone.width} cy={zone.y} r={5} fill="#fff" stroke="#000" strokeWidth="1" 
                            onMouseDown={(e) => handleStartResizing(e, zone, 'ne')} className="cursor-nesw-resize" />
                          <circle cx={zone.x} cy={zone.y + zone.height} r={5} fill="#fff" stroke="#000" strokeWidth="1" 
                            onMouseDown={(e) => handleStartResizing(e, zone, 'sw')} className="cursor-nesw-resize" />
                          <circle cx={zone.x + zone.width} cy={zone.y + zone.height} r={5} fill="#fff" stroke="#000" strokeWidth="1" 
                            onMouseDown={(e) => handleStartResizing(e, zone, 'se')} className="cursor-nwse-resize" />
                        </>
                      )}
                    </>
                  )}
                  
                  {zone.shape === 'circle' && (
                    <>
                      <circle
                        cx={zone.cx}
                        cy={zone.cy}
                        r={zone.r}
                        fill={zone.color}
                        fillOpacity={isEditing ? 0.6 : 0.4}
                        stroke={isEditing ? "#000" : zone.color}
                        strokeWidth={isEditing ? 2 : 1}
                        onMouseDown={isEditing ? (e) => handleStartMoving(e, zone) : undefined}
                      />
                      
                      {isEditing && (
                        <>
                          {/* Resize handle */}
                          <circle cx={zone.cx + zone.r} cy={zone.cy} r={5} fill="#fff" stroke="#000" strokeWidth="1" 
                            onMouseDown={(e) => handleStartResizing(e, zone, 'e')} className="cursor-ew-resize" />
                        </>
                      )}
                    </>
                  )}
                  
                  {zone.shape === 'polygon' && (
                    <>
                      <polygon
                        points={zone.points}
                        fill={zone.color}
                        fillOpacity={isEditing ? 0.6 : 0.4}
                        stroke={isEditing ? "#000" : zone.color}
                        strokeWidth={isEditing ? 2 : 1}
                        onMouseDown={isEditing ? (e) => handleStartMoving(e, zone) : undefined}
                      />
                    </>
                  )}
                  
                  {/* Zone label */}
                  {zone.label && (
                    <text
                      x={zone.shape === 'rect' ? zone.x + zone.width/2 : 
                         zone.shape === 'circle' ? zone.cx : 
                         zone.labelX || 0}
                      y={zone.shape === 'rect' ? zone.y + zone.height/2 : 
                         zone.shape === 'circle' ? zone.cy : 
                         zone.labelY || 0}
                      fontSize={14}
                      fontWeight={isEditing ? "bold" : "normal"}
                      textAnchor="middle"
                      fill="#fff"
                      pointerEvents="none"
                    >
                      {zone.label}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Currently drawing zone */}
            {currentZone && (
              <g pointerEvents="none">
                {currentZone.shape === 'rect' && (
                  <rect
                    x={currentZone.x}
                    y={currentZone.y}
                    width={currentZone.width}
                    height={currentZone.height}
                    fill={currentZone.color}
                    fillOpacity="0.4"
                    stroke="#000"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                )}
                
                {currentZone.shape === 'circle' && (
                  <circle
                    cx={currentZone.cx}
                    cy={currentZone.cy}
                    r={currentZone.r}
                    fill={currentZone.color}
                    fillOpacity="0.4"
                    stroke="#000"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                )}
              </g>
            )}
          </svg>
        </div>
      </div>
      
      {/* Zone list */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium mb-3">Zone List</h3>
        {zones.length === 0 ? (
          <p className="text-gray-500 text-sm">No zones created yet. Use the drawing tools to create zones.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {zones.map((zone) => (
              <li key={zone.id} className="py-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span 
                    className="w-4 h-4 mr-2" 
                    style={{ backgroundColor: zone.color }}
                  ></span>
                  
                  {editingZoneId === zone.id ? (
                    <input
                      type="text"
                      value={zone.label}
                      onChange={(e) => updateZoneLabel(zone.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span>{zone.label}</span>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {editingZoneId === zone.id ? (
                    <button onClick={handleSaveEditing} className="p-1 text-green-600 hover:text-green-800">
                      <FiCheck />
                    </button>
                  ) : (
                    <button onClick={() => handleStartEditing(zone)} className="p-1 text-gray-600 hover:text-gray-800">
                      <FiEdit2 />
                    </button>
                  )}
                  
                  <button onClick={() => deleteZone(zone.id)} className="p-1 text-red-600 hover:text-red-800">
                    <FiTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ZoneEditor; 