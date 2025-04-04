import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiDownload, FiFile, FiInfo } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import api from '../services/api';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await api.getClient(id);
        setClient(response.data);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data');
        
        // Use mock data for demo
        setClient(getMockClientData(id));
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [id]);
  
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
  
  if (!client) return null;
  
  const waterChartData = {
    labels: client.waterUsage.labels,
    datasets: [
      {
        label: 'Water Consumption (m³)',
        data: client.waterUsage.data,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
  
  const chemicalChartData = {
    labels: client.chemicalUsage.labels,
    datasets: [
      {
        label: 'PAC (kg)',
        data: client.chemicalUsage.pac,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Polymer (kg)',
        data: client.chemicalUsage.polymer,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Chlorine (kg)',
        data: client.chemicalUsage.chlorine,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
    ],
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/site-map')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Map
        </button>
        
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-800">{client.name}</h1>
          <p className="text-gray-600">Client ID: {client.id} | Plot: {client.plotNumber}</p>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === 'usage'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('usage')}
        >
          Usage History
        </button>
        <button
          className={`py-3 px-4 font-medium ${
            activeTab === 'documents'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Client Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{client.company}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <span>{client.industry}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`capitalize ${
                    client.status === 'good' ? 'text-green-600' :
                    client.status === 'warning' ? 'text-yellow-600' :
                    client.status === 'danger' ? 'text-red-600' : ''
                  }`}>{client.status}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Contract Start:</span>
                  <span>{client.contractStart}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Contract End:</span>
                  <span>{client.contractEnd}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Contact Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Contact Person:</span>
                  <span className="font-medium">{client.contactPerson}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Position:</span>
                  <span>{client.position}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-primary-600">{client.email}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{client.phone}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">Utility Summary</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Water Monthly Avg:</span>
                  <span className="font-medium">{client.summary.waterMonthlyAvg} m³</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Chemical Monthly Avg:</span>
                  <span>{client.summary.chemicalMonthlyAvg} kg</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Last Inspection:</span>
                  <span>{client.summary.lastInspection}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Next Inspection:</span>
                  <span>{client.summary.nextInspection}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Recent Water Consumption</h3>
              <div className="h-64">
                <Line 
                  data={waterChartData} 
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
                          text: 'Cubic Meters (m³)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Notes & Alerts</h3>
              
              {client.notes.length > 0 ? (
                <div className="space-y-3">
                  {client.notes.map((note, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md ${
                        note.type === 'alert' ? 'bg-red-50 text-red-800' :
                        note.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <div className="font-medium">{note.title}</div>
                      <div className="text-sm mt-1">{note.message}</div>
                      <div className="text-xs mt-2">{note.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  <p>No notes available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Water Consumption History</h3>
            <div className="h-72">
              <Line 
                data={waterChartData} 
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
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Chemical Usage History</h3>
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
                        text: 'Date',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Historical Data Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Water (m³)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PAC (kg)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Polymer (kg)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chlorine (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {client.tableData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.water}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.pac}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.polymer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.chlorine}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Documents & Contracts</h3>
            
            <div className="space-y-4">
              {client.documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <div className="flex items-start">
                    <div className="p-2 bg-gray-100 rounded-md mr-3">
                      <FiFile size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{doc.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>Added: {doc.dateAdded}</span>
                        <span className="mx-2">•</span>
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                    <button
                      className="flex items-center text-sm text-primary-600 hover:text-primary-800 ml-4"
                    >
                      <FiDownload className="mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-md flex items-start">
              <FiInfo className="text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Document Note</p>
                <p className="mt-1">
                  All documents shown here are sample files for demonstration purposes.
                  In a production environment, actual client contracts and documentation would be available here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for mock data
const getMockClientData = (id) => {
  const today = new Date();
  const daysInMonth = 30;
  
  // Generate dates for current month
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (daysInMonth - 1) + i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  // Generate random water usage data
  const waterData = Array.from({ length: daysInMonth }, () => 
    Math.floor(Math.random() * 100) + 50
  );
  
  // Generate table data (last 7 days)
  const tableData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return {
      date: dateStr,
      water: Math.floor(Math.random() * 100) + 50,
      pac: Math.floor(Math.random() * 8) + 2,
      polymer: Math.floor(Math.random() * 5) + 1,
      chlorine: Math.floor(Math.random() * 3) + 1,
    };
  });
  
  // Mock client data
  return {
    id: parseInt(id),
    name: `Site ${String.fromCharCode(64 + parseInt(id))} (Client Site)`,
    company: 'Industrial Solutions Co., Ltd.',
    plotNumber: `${String.fromCharCode(64 + parseInt(id))}-10${id}`,
    industry: 'Manufacturing',
    status: ['good', 'warning', 'danger'][Math.floor(Math.random() * 3)],
    contractStart: '01 Jan 2023',
    contractEnd: '31 Dec 2025',
    contactPerson: 'John Smith',
    position: 'Facility Manager',
    email: 'john.smith@example.com',
    phone: '+66 2 123 4567',
    summary: {
      waterMonthlyAvg: Math.floor(Math.random() * 1000) + 500,
      chemicalMonthlyAvg: Math.floor(Math.random() * 100) + 20,
      lastInspection: '15 Mar 2023',
      nextInspection: '15 Jun 2023',
    },
    waterUsage: {
      labels: dates,
      data: waterData,
    },
    chemicalUsage: {
      labels: dates,
      pac: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 8) + 2),
      polymer: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 5) + 1),
      chlorine: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 3) + 1),
    },
    notes: [
      {
        type: 'info',
        title: 'Routine Maintenance',
        message: 'Scheduled maintenance completed on water treatment system',
        date: '02 Apr 2023',
      },
      {
        type: 'warning',
        title: 'Chemical Usage Increase',
        message: 'PAC usage has increased by 15% compared to last month',
        date: '28 Mar 2023',
      },
    ],
    tableData,
    documents: [
      {
        name: 'Service Contract 2023-2025.pdf',
        description: 'Utility service contract with terms and conditions',
        dateAdded: '01 Jan 2023',
        fileSize: '2.4 MB',
      },
      {
        name: 'Water Quality Report - Q1 2023.pdf',
        description: 'Quarterly water quality analysis report',
        dateAdded: '05 Apr 2023',
        fileSize: '1.8 MB',
      },
      {
        name: 'Maintenance Schedule 2023.xlsx',
        description: 'Annual maintenance schedule for water treatment facilities',
        dateAdded: '10 Jan 2023',
        fileSize: '845 KB',
      },
    ],
  };
};

export default ClientDetails; 