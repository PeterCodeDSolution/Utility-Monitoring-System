import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiAlertCircle, FiInfo, FiCheck, FiCamera, FiUser, FiMapPin, FiCalendar, FiUpload, FiX, FiImage } from 'react-icons/fi';
import api from '../services/api';
import QRScanner from '../components/QRScanner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DataInput = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const waterInputRef = useRef(null);
  
  const [sites, setSites] = useState([
    { id: 1, name: 'Site A', zone: 'Zone 1', status: 'Operating', plotId: 'RJN-001' },
    { id: 2, name: 'Site B', zone: 'Zone 2', status: 'Under Construction', plotId: 'RJN-002' },
    { id: 3, name: 'Site C', zone: 'Zone 1', status: 'Operating', plotId: 'RJN-003' },
    { id: 4, name: 'Site D', zone: 'Zone 3', status: 'Not Sold', plotId: 'RJN-004' },
  ]);
  
  const [selectedSite, setSelectedSite] = useState(null);
  const [formData, setFormData] = useState({
    siteId: '',
    date: new Date().toISOString().split('T')[0],
    waterMeter: '',
    pac: '',
    polymer: '',
    chlorine: '',
    notes: '',
    images: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [imagePreviewList, setImagePreviewList] = useState([]);
  
  // Parse plot_id from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plotId = params.get('plot_id');
    
    if (plotId) {
      const site = sites.find(site => site.plotId === plotId);
      if (site) {
        setFormData(prev => ({
          ...prev,
          siteId: site.id.toString()
        }));
        setSelectedSite(site);
      } else {
        setError(`Site with Plot ID ${plotId} not found.`);
      }
    }
  }, [location.search, sites]);
  
  // When siteId changes, update selectedSite
  useEffect(() => {
    if (formData.siteId) {
      const site = sites.find(site => site.id.toString() === formData.siteId);
      setSelectedSite(site || null);
    } else {
      setSelectedSite(null);
    }
  }, [formData.siteId, sites]);
  
  // Autofocus on water meter field when site is selected
  useEffect(() => {
    if (selectedSite && waterInputRef.current) {
      waterInputRef.current.focus();
    }
  }, [selectedSite]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Add new files to the existing array
      setFormData((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...files]
      }));
      
      // Create preview URLs for new images
      const newPreviews = files.map(file => {
        return {
          file,
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: URL.createObjectURL(file)
        };
      });
      
      setImagePreviewList(prev => [...prev, ...newPreviews]);
    }
  };
  
  const handleRemoveImage = (id) => {
    // Find the index of the image to remove
    const imageIndex = imagePreviewList.findIndex(img => img.id === id);
    if (imageIndex === -1) return;
    
    // Create new arrays without the removed image
    const newPreviewList = [...imagePreviewList];
    const removedItem = newPreviewList.splice(imageIndex, 1)[0];
    setImagePreviewList(newPreviewList);
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(removedItem.url);
    
    // Update formData.images to match the preview list
    const newImages = formData.images.filter((_, index) => index !== imageIndex);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };
  
  const handleCaptureImage = () => {
    if (cameraInputRef.current) {
      // Reset file input to ensure onChange fires even if selecting the same file
      cameraInputRef.current.value = '';
      // Use webkit capture for iOS
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // For iOS devices
        cameraInputRef.current.removeAttribute('capture');
      } else {
        // For Android and other devices
        cameraInputRef.current.setAttribute("capture", "camera");
      }
      // Trigger click on input
      cameraInputRef.current.click();
    }
  };
  
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewList.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);
  
  const validateForm = () => {
    if (!formData.siteId) return 'Please select a site';
    if (!formData.date) return 'Date is required';
    if (!formData.waterMeter) return 'Water meter reading is required';
    
    // Check if numeric fields are valid numbers
    const numericFields = ['waterMeter', 'pac', 'polymer', 'chlorine'];
    for (const field of numericFields) {
      if (formData[field] && isNaN(Number(formData[field]))) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`;
      }
    }
    
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert string values to numbers and prepare form data
      const dataToSubmit = new FormData();
      dataToSubmit.append('siteId', formData.siteId);
      dataToSubmit.append('date', formData.date);
      dataToSubmit.append('waterMeter', Number(formData.waterMeter));
      dataToSubmit.append('pac', formData.pac ? Number(formData.pac) : 0);
      dataToSubmit.append('polymer', formData.polymer ? Number(formData.polymer) : 0);
      dataToSubmit.append('chlorine', formData.chlorine ? Number(formData.chlorine) : 0);
      dataToSubmit.append('notes', formData.notes || '');
      
      // Append all images to the form data
      formData.images.forEach((image, index) => {
        dataToSubmit.append(`images[${index}]`, image);
      });
      
      // In a real app, this would be sent to the server
      // await api.submitUtilityData(dataToSubmit);
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
      
      // Reset form (except site and date)
      setFormData((prev) => ({
        ...prev,
        waterMeter: '',
        pac: '',
        polymer: '',
        chlorine: '',
        notes: '',
        images: []
      }));
      
      // Clear image previews
      imagePreviewList.forEach(img => URL.revokeObjectURL(img.url));
      setImagePreviewList([]);
      
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err.response?.data?.message || 'Failed to submit data');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanSuccess = (scannedCode) => {
    console.log('QR scan success:', scannedCode);
    
    // Try to find the site by plotId
    const site = sites.find(site => site.plotId === scannedCode);
    
    if (site) {
      setFormData(prev => ({
        ...prev,
        siteId: site.id.toString()
      }));
      setShowQRScanner(false);
      navigate(`/data-input?plot_id=${scannedCode}`);
    } else {
      // Try to find by ID directly in case it's a direct ID scan
      const siteById = sites.find(site => site.id.toString() === scannedCode);
      if (siteById) {
        setFormData(prev => ({
          ...prev,
          siteId: siteById.id.toString()
        }));
        setShowQRScanner(false);
        navigate(`/data-input?plot_id=${siteById.plotId}`);
      } else {
        setError(`ไม่พบไซต์จาก QR code ที่สแกน: ${scannedCode}`);
        setShowQRScanner(false);
      }
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Operating':
        return 'bg-green-100 text-green-800';
      case 'Under Construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Built':
        return 'bg-gray-100 text-gray-800';
      case 'Not Sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Data Input</h1>
        <p className="text-gray-600">Submit utility usage data</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-start">
          <FiCheck className="mr-2 mt-0.5" />
          <span>Data submitted successfully!</span>
        </div>
      )}
      
      {/* User info bar */}
      <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md flex items-center">
        <FiUser className="mr-2" />
        <span>Logged in as: <strong>{currentUser?.username || 'Field Operator'}</strong></span>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* QR Scanner button (prominently displayed) */}
        <div className="mb-6">
          <button 
            type="button" 
            onClick={() => setShowQRScanner(true)}
            className="w-full flex justify-center items-center px-4 py-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiCamera className="mr-3 h-6 w-6" />
            <span>สแกน QR Code เพื่อเลือกไซต์</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Site selection (secondary option) */}
          <div className="mb-6">
            <label htmlFor="siteId" className="block text-sm font-medium text-gray-700 mb-1">
              หรือเลือกไซต์จากรายการ *
            </label>
            <select
              id="siteId"
              name="siteId"
              value={formData.siteId}
              onChange={handleChange}
              className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              required
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.plotId} - {site.name} ({site.zone})
                </option>
              ))}
            </select>
          </div>
          
          {/* Site info card (shows when site is selected) */}
          {selectedSite && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold mb-2">Site Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span>Plot ID: <strong>{selectedSite.plotId}</strong></span>
                </div>
                <div className="flex items-center">
                  <FiInfo className="text-gray-500 mr-2" />
                  <span>Client: <strong>{selectedSite.name}</strong></span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-gray-500 mr-2" />
                  <span>Zone: <strong>{selectedSite.zone}</strong></span>
                </div>
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSite.status)}`}>
                    {selectedSite.status}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Date field */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                <FiCalendar className="inline mr-1" /> Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="block w-full pl-3 pr-3 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                required
              />
            </div>
            
            {/* Water meter field */}
            <div>
              <label htmlFor="waterMeter" className="block text-sm font-medium text-gray-700 mb-1">
                Water Meter Reading (m³) *
              </label>
              <input
                ref={waterInputRef}
                type="text"
                inputMode="decimal"
                id="waterMeter"
                name="waterMeter"
                value={formData.waterMeter}
                onChange={handleChange}
                placeholder="Enter water meter reading"
                className="block w-full pl-3 pr-3 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                required
              />
            </div>
            
            {/* PAC field */}
            <div>
              <label htmlFor="pac" className="block text-sm font-medium text-gray-700 mb-1">
                PAC Usage (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                id="pac"
                name="pac"
                value={formData.pac}
                onChange={handleChange}
                placeholder="Enter PAC usage"
                className="block w-full pl-3 pr-3 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              />
            </div>
            
            {/* Polymer field */}
            <div>
              <label htmlFor="polymer" className="block text-sm font-medium text-gray-700 mb-1">
                Polymer Usage (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                id="polymer"
                name="polymer"
                value={formData.polymer}
                onChange={handleChange}
                placeholder="Enter polymer usage"
                className="block w-full pl-3 pr-3 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              />
            </div>
            
            {/* Chlorine field */}
            <div>
              <label htmlFor="chlorine" className="block text-sm font-medium text-gray-700 mb-1">
                Chlorine Usage (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                id="chlorine"
                name="chlorine"
                value={formData.chlorine}
                onChange={handleChange}
                placeholder="Enter chlorine usage"
                className="block w-full pl-3 pr-3 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              />
            </div>
          </div>
          
          {/* Enhanced Image upload with two options */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Evidence ({imagePreviewList.length} photos)
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCaptureImage}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiCamera className="mr-2 h-5 w-5 text-gray-500" />
                <span>ถ่ายภาพด้วยกล้อง</span>
              </button>
              <button
                type="button"
                onClick={handleSelectImage}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiImage className="mr-2 h-5 w-5 text-gray-500" />
                <span>เลือกภาพจากอุปกรณ์</span>
              </button>
              
              {/* For camera input - better iOS compatibility */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              
              {/* For general file selection - now with multiple attribute */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>
            
            {/* Image preview grid */}
            {imagePreviewList.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviewList.map((image) => (
                  <div key={image.id} className="relative">
                    <img 
                      src={image.url} 
                      alt="Preview" 
                      className="h-24 w-full object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Notes field */}
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows="3"
              className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            />
          </div>
          
          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <FiSave className="mr-2 -ml-1" />
                  Submit Data
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* QR Scanner Modal with fixed closing behavior */}
      {showQRScanner && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center"
          style={{ 
            position: 'fixed',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
            <div className="absolute top-0 right-0 p-4 z-10">
              <button
                onClick={() => {
                  // Ensure we properly clean up the scanner when closing
                  const qrReader = document.getElementById('qr-reader');
                  if (qrReader) {
                    // Try to access the instance and stop it
                    const instance = qrReader.__instance;
                    if (instance && typeof instance.stop === 'function') {
                      instance.stop().catch(e => console.error('Error stopping scanner:', e));
                    }
                  }
                  setShowQRScanner(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 pt-12">
              <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">
                สแกน QR Code
              </h3>
              <QRScanner 
                onScanSuccess={handleQRScanSuccess} 
                onClose={() => setShowQRScanner(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInput; 