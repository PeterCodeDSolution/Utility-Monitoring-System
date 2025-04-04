import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiInfo, FiExternalLink, FiSearch, FiX, FiEdit } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import SiteMapView from '../components/SiteMapView';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Example industrial park map image - replace with your actual image path
const MAP_IMAGE_URL = '/assets/industrial_map.jpg';

const SiteMap = () => {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const response = await api.getMapData();
        setMapData(response.data);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('Failed to load map data');
        
        // Use mock data for demo
        setMapData(getMockMapData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, []);
  
  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
  };
  
  const handleSiteDetail = (id) => {
    navigate(`/clients/${id}`);
  };
  
  const closeSidePanel = () => {
    setSelectedPlot(null);
  };

  const filteredPlots = () => {
    if (!mapData || !mapData.sites) return [];
    
    return mapData.sites.filter(plot => {
      const matchesSearch = 
        searchTerm === '' || 
        plot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plot.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'Operating' && plot.status === 'good') ||
        (statusFilter === 'Under Construction' && plot.status === 'warning') ||
        (statusFilter === 'Not Built' && plot.status === 'normal') ||
        (statusFilter === 'Not Sold' && plot.status === 'danger');
      
      return matchesSearch && matchesStatus;
    });
  };

  // Convert plots to zones for the SVG map
  const getZonesFromPlots = () => {
    const plots = filteredPlots();
    
    if (plots.length === 0) return [];
    
    // Map each plot to a zone with polygon shape based on plot layout
    return plots.map((plot, index) => {
      // Base color on status
      let color;
      switch(plot.status) {
        case 'good': color = '#10B981'; break; // green-500
        case 'warning': color = '#F59E0B'; break; // yellow-500
        case 'danger': color = '#EF4444'; break; // red-500
        default: color = '#9CA3AF'; // gray-400
      }
      
      // For demonstration, use preconfigured polygon zones matching the map
      // In production, these would come from a database or configuration
      const zoneLayouts = [
        { points: '115,134 193,107 250,240 172,270', labelX: 170, labelY: 190 }, // SCL
        { points: '193,107 282,82 335,210 250,240', labelX: 260, labelY: 160 }, // Fortune 
        { points: '282,82 375,60 430,180 335,210', labelX: 355, labelY: 135 }, // Ming Star
        { points: '375,60 480,42 535,155 430,180', labelX: 455, labelY: 110 }, // PTT-DB
        { points: '535,155 612,137 640,225 565,240', labelX: 588, labelY: 190 }, // Sewage Treatment
        { points: '172,270 250,240 305,370 227,395', labelX: 240, labelY: 320 }, // Dong Jin
        { points: '250,240 335,210 390,335 305,370', labelX: 320, labelY: 290 }, // PTTX
        { points: '335,210 430,180 485,305 390,335', labelX: 410, labelY: 260 }, // DEPOT
        { points: '430,180 535,155 565,240 500,280 485,305', labelX: 500, labelY: 240 }, // Water Treatment
        { points: '72,380 196,365 122,550 46,565', labelX: 115, labelY: 465 }, // Logistics 1
        { points: '196,365 305,370 245,555 122,550', labelX: 225, labelY: 460 }, // Logistics 2
        { points: '305,370 390,335 425,430 365,465 340,485', labelX: 365, labelY: 410 }, // University
        { points: '390,335 485,305 515,385 475,420 425,430', labelX: 450, labelY: 370 }, // DEPOT 2
        { points: '485,305 500,280 565,240 640,225 650,315 590,370 515,385', labelX: 565, labelY: 310 }, // Honghua
        { points: '245,555 310,580 360,635 290,710 190,680', labelX: 280, labelY: 620 }, // Tonyuti
        { points: '340,485 365,465 425,430 475,420 490,490 440,550 410,535 360,535', labelX: 415, labelY: 490 }, // DEPOT 3
        { points: '410,535 440,550 490,490 555,655 490,670 455,580', labelX: 480, labelY: 595 }, // SEVEN SONG
        { points: '490,490 475,420 515,385 590,370 650,315 720,440 650,470 555,655', labelX: 600, labelY: 500 }, // DEPOT 4
      ];
      
      // Get layout for this index, or default to first one
      const layout = zoneLayouts[index % zoneLayouts.length];
      
      return {
        id: plot.id,
        shape: 'polygon',
        points: layout.points,
        label: `${plot.plotNumber} - ${plot.name}`,
        labelX: layout.labelX,
        labelY: layout.labelY,
        color: color,
        data: plot
      };
    });
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#10B981'; // green-500
      case 'warning': return '#F59E0B'; // yellow-500
      case 'danger': return '#EF4444'; // red-500
      default: return '#9CA3AF'; // gray-400
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'good': return 'Operating';
      case 'warning': return 'Under Construction';
      case 'danger': return 'Not Sold';
      default: return 'Not Built';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start">
        <FiAlertCircle className="mr-2 mt-0.5" />
        <div>
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!mapData) return null;
  
  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Site Map</h1>
          <p className="text-gray-600">Interactive map of industrial park plots</p>
        </div>
        
        <button
          onClick={() => navigate('/site-map/editor')}
          className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1"
        >
          <FiEdit size={16} /> Edit Map
        </button>
      </div>
      
      {/* Search and filter controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or plot number"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <FiX />
            </button>
          )}
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Operating">Operating</option>
          <option value="Under Construction">Under Construction</option>
          <option value="Not Built">Not Built</option>
          <option value="Not Sold">Not Sold</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          {/* Map View */}
          <SiteMapView
            zones={getZonesFromPlots()}
            onZoneClick={(zone) => handlePlotClick(zone.data)}
            selectedZoneId={selectedPlot?.id}
            height="650px"
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {selectedPlot ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Plot Details</h3>
                <button onClick={closeSidePanel} className="text-gray-400 hover:text-gray-600">
                  <FiX />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getStatusColor(selectedPlot.status) }}
                  ></span>
                  <span className="text-gray-600 text-sm">{getStatusText(selectedPlot.status)}</span>
                </div>
                <h4 className="text-xl font-semibold mt-1">{selectedPlot.name}</h4>
                <p className="text-gray-500 text-sm">Plot: {selectedPlot.plotNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-500 text-xs">Water Usage</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedPlot.utilityData?.waterUsage || '0'}m³
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-500 text-xs">Chemical Usage</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedPlot.utilityData?.pacUsage || '0'}kg
                  </p>
                </div>
              </div>
              
              <h4 className="font-medium mb-2 text-gray-700">Usage History</h4>
              <div className="h-40 mb-4">
                {selectedPlot.usageHistory ? (
                  <Line 
                    data={{
                      labels: selectedPlot.usageHistory.map(h => h.date),
                      datasets: [
                        {
                          label: 'Water Usage (m³)',
                          data: selectedPlot.usageHistory.map(h => h.water || h.waterUsage || 0),
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.3,
                        }
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                        x: {
                          display: false,
                        }
                      },
                      plugins: {
                        legend: {
                          display: false,
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded text-gray-400">
                    No usage history available
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleSiteDetail(selectedPlot.id)}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center"
              >
                <span>View Full Details</span>
                <FiExternalLink className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
              <FiInfo size={24} className="mb-2" />
              <p className="text-center">Select a plot on the map to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
            <span className="text-gray-600 text-sm">Operating</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></span>
            <span className="text-gray-600 text-sm">Under Construction</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-gray-400"></span>
            <span className="text-gray-600 text-sm">Not Built</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2 bg-red-500"></span>
            <span className="text-gray-600 text-sm">Not Sold</span>
          </div>
        </div>
      </div>
      
      {/* Info about map interactivity */}
      <div className="mt-4 bg-blue-50 p-4 rounded-lg text-blue-700 flex items-start">
        <FiInfo className="mr-2 mt-0.5" />
        <div>
          <p>Interactive Map Guide:</p>
          <ul className="list-disc ml-4 text-sm mt-1">
            <li>Click on plots to view details</li>
            <li>Use mouse wheel or zoom buttons to zoom in/out</li>
            <li>Drag to pan around the map</li>
            <li>Use search and filters above to find specific plots</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper function to prepare chart data
const getChartData = (history) => {
  return {
    labels: history.map(item => item.date),
    datasets: [
      {
        label: 'Water Usage',
        data: history.map(item => item.water),
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Chemical Usage',
        data: history.map(item => item.chemicals),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.3,
      }
    ],
  };
};

// Mock data for testing
const getMockMapData = () => {
  const mockSites = Array.from({ length: 15 }, (_, i) => {
    // Generate different statuses with a distribution
    let status;
    const rand = Math.random();
    if (rand < 0.5) status = 'good'; // 50% Operating
    else if (rand < 0.7) status = 'warning'; // 20% Under Construction
    else if (rand < 0.9) status = 'normal'; // 20% Not Built
    else status = 'danger'; // 10% Not Sold

    return {
      id: i + 1,
      plotNumber: `RJN-${String(i + 1).padStart(3, '0')}`,
      name: `Site ${i + 1}`,
      clientName: rand < 0.8 ? `Company ${String.fromCharCode(65 + i % 26)}` : null,
      latitude: 13.736717 + (Math.random() * 0.02 - 0.01),
      longitude: 100.523186 + (Math.random() * 0.02 - 0.01),
      status,
      utilityData: {
        waterUsage: Math.floor(Math.random() * 1000) + 100,
        pacUsage: Math.floor(Math.random() * 100) + 10
      },
      usageHistory: generateUsageHistory(),
    };
  });

  const countStatus = (status) => mockSites.filter(site => site.status === status).length;

  return {
    totalSites: mockSites.length,
    activeSites: mockSites.filter(site => site.status === 'good' || site.status === 'warning').length,
    stats: {
      normal: countStatus('good'),
      warnings: countStatus('warning'),
      critical: countStatus('danger'),
    },
    sites: mockSites,
  };
};

// Helper function to generate random usage history
const generateUsageHistory = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      water: Math.floor(Math.random() * 100) + 50,  // Random between 50-150
      chemicals: Math.floor(Math.random() * 30) + 10, // Random between 10-40
    };
  });
};

export default SiteMap; 