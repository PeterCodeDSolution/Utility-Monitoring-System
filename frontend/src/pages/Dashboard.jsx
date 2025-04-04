import React, { useState, useEffect } from 'react';
import { 
  FiDroplet, FiActivity, FiAlertCircle, FiBarChart2, 
  FiArrowUp, FiArrowDown, FiInfo, FiFilter, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiPieChart
} from 'react-icons/fi';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import api from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d'); // '7d' or '30d'
  const [selectedZone, setSelectedZone] = useState('all');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, we would pass timeRange and selectedZone to the API
        // const response = await api.getInsights({ timeRange, zone: selectedZone });
        // setDashboardData(response.data);
        
        // For demo, use mock data
        setDashboardData(getMockInsightData());
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, selectedZone]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleZoneChange = (e) => {
    setSelectedZone(e.target.value);
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

  if (!dashboardData) return null;

  const { 
    summary, 
    inletVsOutlet, 
    chemicalUsageByZone, 
    waterDistribution, 
    alerts, 
    recentReadings, 
    aiSummary 
  } = dashboardData;

  // Chart data for Inlet vs Outlet
  const inletOutletChartData = {
    labels: inletVsOutlet.labels,
    datasets: [
      {
        label: 'Water Inlet (m³)',
        data: inletVsOutlet.inlet,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Water Outlet (m³)',
        data: inletVsOutlet.outlet,
        borderColor: 'rgb(16, 185, 129)', // green-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Chart data for Chemical Usage by Zone
  const chemicalChartData = {
    labels: chemicalUsageByZone.labels,
    datasets: [
      {
        label: 'PAC (kg)',
        data: chemicalUsageByZone.pac,
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue
        borderRadius: 4,
      },
      {
        label: 'Polymer (kg)',
        data: chemicalUsageByZone.polymer,
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // green
        borderRadius: 4,
      },
      {
        label: 'Chlorine (kg)',
        data: chemicalUsageByZone.chlorine,
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // amber
        borderRadius: 4,
      },
    ],
  };

  // Chart data for Water Distribution
  const distributionChartData = {
    labels: waterDistribution.labels,
    datasets: [
      {
        data: waterDistribution.values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(16, 185, 129, 0.8)', // green
          'rgba(245, 158, 11, 0.8)', // amber
          'rgba(239, 68, 68, 0.8)', // red
          'rgba(139, 92, 246, 0.8)', // purple
          'rgba(156, 163, 175, 0.8)', // gray
        ],
        borderWidth: 1,
      },
    ],
  };

  // Determine badge color based on change value
  const getBadgeClass = (value) => {
    if (value > 0) return 'bg-red-100 text-red-800';
    if (value < 0) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Determine alert color
  const getAlertClass = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Get icon for alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <FiAlertCircle className="text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-amber-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  // Get status icon for readings
  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <FiCheckCircle className="text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-amber-500" />;
      case 'missing':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Utility Insights Dashboard</h1>
          <p className="text-gray-600">Advanced analysis of utility usage across all sites</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => handleTimeRangeChange('7d')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                timeRange === '7d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange('30d')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                timeRange === '30d'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              30 Days
            </button>
          </div>
          
          {/* Zone Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedZone}
              onChange={handleZoneChange}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Zones</option>
              <option value="A">Zone A</option>
              <option value="B">Zone B</option>
              <option value="C">Zone C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insight Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiDroplet size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Inlet Today</p>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-800">{summary.totalInlet} m³</h3>
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getBadgeClass(summary.inletChange)}`}>
                  {summary.inletChange > 0 ? (
                    <span className="flex items-center"><FiArrowUp size={12} className="mr-1" />{summary.inletChange}%</span>
                  ) : (
                    <span className="flex items-center"><FiArrowDown size={12} className="mr-1" />{Math.abs(summary.inletChange)}%</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">vs. 7-day average</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiActivity size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Chemical Usage</p>
              <h3 className="text-xl font-semibold text-gray-800">{summary.totalChemicals} kg</h3>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            PAC: {summary.pacUsage} kg, Polymer: {summary.polymerUsage} kg, Chlorine: {summary.chlorineUsage} kg
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <FiBarChart2 size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Water Loss</p>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-800">{summary.lossPercentage}%</h3>
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getBadgeClass(summary.lossChange)}`}>
                  {summary.lossChange > 0 ? (
                    <span className="flex items-center"><FiArrowUp size={12} className="mr-1" />{summary.lossChange}%</span>
                  ) : (
                    <span className="flex items-center"><FiArrowDown size={12} className="mr-1" />{Math.abs(summary.lossChange)}%</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">Inlet vs. Outlet difference</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiAlertCircle size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Missing Reports</p>
              <h3 className="text-xl font-semibold text-gray-800">{summary.missingReports}</h3>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">Plots with no data in last 3 days</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inlet vs Outlet Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Inlet vs Outlet Water Trend</h3>
          <div className="h-72">
            <Line 
              data={inletOutletChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      footer: (tooltipItems) => {
                        // Calculate the difference
                        const inlet = tooltipItems[0].raw;
                        const outlet = tooltipItems[1]?.raw || 0;
                        const diff = inlet - outlet;
                        const percentage = outlet ? ((diff / inlet) * 100).toFixed(1) : 0;
                        return `Loss: ${diff.toFixed(1)} m³ (${percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Cubic Meters (m³)',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Date',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Chemical Usage by Zone Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Chemical Usage by Zone</h3>
          <div className="h-72">
            <Bar 
              data={chemicalChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Kilogram (kg)',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Zone',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Distribution and Alerts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Top Water Consumers</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={distributionChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} m³ (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Percentage of total water used by top plots
          </div>
        </div>

        {/* Alerts Section */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Active Alerts</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-md flex items-start ${getAlertClass(alert.type)}`}
              >
                <span className="mr-3 mt-0.5">
                  {getAlertIcon(alert.type)}
                </span>
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs mt-1 text-gray-500">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Readings and AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Readings Table */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Readings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water (m³)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chemicals (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReadings.map((reading, index) => (
                  <tr key={index} className={reading.status === 'missing' ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.plot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.date || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.water || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reading.chemicals 
                        ? `PAC: ${reading.chemicals.pac}, Poly: ${reading.chemicals.polymer}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(reading.status)}
                        <span className="ml-1.5 text-xs">
                          {reading.status === 'normal' ? 'Normal' : 
                           reading.status === 'warning' ? 'Anomaly' : 
                           reading.status === 'missing' ? 'Missing' : 'Unknown'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Summary Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-500">
          <h3 className="text-lg font-medium text-gray-800 mb-3">AI Analysis Summary</h3>
          <div className="prose prose-sm text-gray-600">
            <p>{aiSummary.overview}</p>
            
            <h4 className="text-sm font-medium text-gray-700 mt-3 mb-1">Key Observations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {aiSummary.observations.map((observation, index) => (
                <li key={index}>{observation}</li>
              ))}
            </ul>
            
            <h4 className="text-sm font-medium text-gray-700 mt-3 mb-1">Recommended Actions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {aiSummary.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data function for the Insights Dashboard
const getMockInsightData = () => {
  return {
    summary: {
      totalInlet: 1250,
      inletChange: 5.2,
      totalChemicals: 187,
      pacUsage: 120,
      polymerUsage: 35,
      chlorineUsage: 32,
      lossPercentage: 8.5,
      lossChange: -2.1,
      missingReports: 3
    },
    inletVsOutlet: {
      labels: ['Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16'],
      inlet: [1200, 1320, 1100, 1260, 1340, 1250, 1170],
      outlet: [1120, 1210, 980, 1150, 1210, 1140, 1070]
    },
    chemicalUsageByZone: {
      labels: ['Zone A', 'Zone B', 'Zone C'],
      pac: [45, 38, 37],
      polymer: [12, 14, 9],
      chlorine: [11, 13, 8]
    },
    waterDistribution: {
      labels: ['Plot RJN-002', 'Plot RJN-007', 'Plot RJN-004', 'Plot RJN-011', 'Plot RJN-008', 'Other'],
      values: [280, 210, 180, 150, 120, 310]
    },
    alerts: [
      {
        type: 'critical',
        title: 'High Water Loss',
        message: 'Plot RJN-004 has 18% water loss today, exceeding threshold (15%).',
        timestamp: '2 hours ago'
      },
      {
        type: 'warning',
        title: 'PAC Usage Above Average',
        message: 'Zone C PAC usage is 35% above average for the past 3 days.',
        timestamp: '5 hours ago'
      },
      {
        type: 'warning',
        title: 'Missing Data Reports',
        message: '3 plots have no data submissions for the last 3 days.',
        timestamp: '6 hours ago'
      },
      {
        type: 'info',
        title: 'Maintenance Scheduled',
        message: 'Zone B water treatment equipment maintenance scheduled for tomorrow.',
        timestamp: '1 day ago'
      }
    ],
    recentReadings: [
      {
        plot: 'RJN-004',
        date: 'Jun 16, 2023',
        water: 75.2,
        chemicals: { pac: 3.5, polymer: 1.2 },
        status: 'warning'
      },
      {
        plot: 'RJN-007',
        date: 'Jun 16, 2023',
        water: 68.9,
        chemicals: { pac: 2.8, polymer: 0.9 },
        status: 'normal'
      },
      {
        plot: 'RJN-002',
        date: 'Jun 16, 2023',
        water: 95.4,
        chemicals: { pac: 4.1, polymer: 1.5 },
        status: 'normal'
      },
      {
        plot: 'RJN-011',
        date: 'Jun 15, 2023',
        water: 52.1,
        chemicals: { pac: 2.2, polymer: 0.7 },
        status: 'normal'
      },
      {
        plot: 'RJN-009',
        date: null,
        water: null,
        chemicals: null,
        status: 'missing'
      }
    ],
    aiSummary: {
      overview: "In the past 7 days, total water inlet increased by 5.2% while chemical usage remained stable. Plot RJN-002 consistently used the highest water volume, accounting for 22% of total consumption.",
      observations: [
        "Water loss percentage has improved from 10.6% to 8.5% since last week",
        "Zone B shows 35% higher PAC usage compared to other zones",
        "3 plots have failed to submit data for the past 3 days",
        "Weekend usage patterns show significantly lower inlet volumes"
      ],
      recommendations: [
        "Investigate high PAC consumption in Zone B",
        "Follow up with plots RJN-009, RJN-013, and RJN-015 for missing data reports",
        "Schedule inspection for Plot RJN-004 due to high water loss ratio"
      ]
    }
  };
};

export default Dashboard; 