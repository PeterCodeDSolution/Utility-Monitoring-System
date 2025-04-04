import React, { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle, FiInfo, FiUpload } from 'react-icons/fi';
import ZoneEditor from '../components/ZoneEditor';
import api from '../services/api';

const SiteMapEditor = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  // Fetch existing zones on load
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch the zones from the API
        // const response = await api.getZones();
        // setZones(response.data);
        
        // For demo purposes, we'll use sample data
        setZones(getThaiIndustrialParkZones());
      } catch (err) {
        console.error('Error fetching zones:', err);
        setError('Failed to load zones');
      } finally {
        setLoading(false);
      }
    };
    
    fetchZones();
  }, []);
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };
  
  const handleSaveZones = async (newZones) => {
    try {
      setLoading(true);
      // In a real implementation, you would save the zones to the API
      // await api.saveZones(newZones);
      
      // For demo purposes, we'll just update the state
      setZones(newZones);
      setSuccess('Zones saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error saving zones:', err);
      setError('Failed to save zones');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };
  
  // Sample zones for the Thai industrial park from the image
  const getThaiIndustrialParkZones = () => {
    return [
      // First row
      {
        id: 'zone_1',
        shape: 'polygon',
        points: '115,134 193,107 250,240 172,270',
        label: 'SCL',
        labelX: 170,
        labelY: 190,
        color: '#3B82F6'
      },
      {
        id: 'zone_2',
        shape: 'polygon',
        points: '193,107 282,82 335,210 250,240',
        label: 'Fortune',
        labelX: 260,
        labelY: 160,
        color: '#10B981'
      },
      {
        id: 'zone_3',
        shape: 'polygon',
        points: '282,82 375,60 430,180 335,210',
        label: 'Ming Star',
        labelX: 355,
        labelY: 135,
        color: '#F59E0B'
      },
      {
        id: 'zone_4',
        shape: 'polygon',
        points: '375,60 480,42 535,155 430,180',
        label: 'PTT-DB',
        labelX: 455,
        labelY: 110,
        color: '#EF4444'
      },
      {
        id: 'zone_5',
        shape: 'polygon',
        points: '535,155 612,137 640,225 565,240',
        label: 'Sewage Treatment',
        labelX: 588,
        labelY: 190,
        color: '#8B5CF6'
      },
      
      // Second row
      {
        id: 'zone_6',
        shape: 'polygon',
        points: '172,270 250,240 305,370 227,395',
        label: 'Dong Jin',
        labelX: 240,
        labelY: 320,
        color: '#EC4899'
      },
      {
        id: 'zone_7',
        shape: 'polygon',
        points: '250,240 335,210 390,335 305,370',
        label: 'PTTX',
        labelX: 320,
        labelY: 290,
        color: '#F97316'
      },
      {
        id: 'zone_8',
        shape: 'polygon',
        points: '335,210 430,180 485,305 390,335',
        label: 'DEPOT',
        labelX: 410,
        labelY: 260,
        color: '#14B8A6'
      },
      {
        id: 'zone_9',
        shape: 'polygon',
        points: '430,180 535,155 565,240 500,280 485,305',
        label: 'บ่อบำบัดน้ำ',
        labelX: 500,
        labelY: 240,
        color: '#6366F1'
      },
      
      // Third row left (big plots)
      {
        id: 'zone_10',
        shape: 'polygon',
        points: '72,380 196,365 122,550 46,565',
        label: 'บทมา โลจิสติกส์',
        labelX: 115,
        labelY: 465,
        color: '#3B82F6'
      },
      {
        id: 'zone_11',
        shape: 'polygon',
        points: '196,365 305,370 245,555 122,550',
        label: 'บดภา โลจิสติกส์',
        labelX: 225,
        labelY: 460,
        color: '#10B981'
      },
      
      // Third row right
      {
        id: 'zone_12',
        shape: 'polygon',
        points: '305,370 390,335 425,430 365,465 340,485',
        label: 'ยูนิเวอร์ซิตี้',
        labelX: 365,
        labelY: 410,
        color: '#F59E0B'
      },
      {
        id: 'zone_13',
        shape: 'polygon',
        points: '390,335 485,305 515,385 475,420 425,430',
        label: 'DEPOT',
        labelX: 450,
        labelY: 370,
        color: '#EF4444'
      },
      {
        id: 'zone_14',
        shape: 'polygon',
        points: '485,305 500,280 565,240 640,225 650,315 590,370 515,385',
        label: 'Honghua Industrial',
        labelX: 565,
        labelY: 310,
        color: '#8B5CF6'
      },
      
      // Bottom row
      {
        id: 'zone_15',
        shape: 'polygon',
        points: '245,555 310,580 360,635 290,710 190,680',
        label: 'Tonyuti',
        labelX: 280,
        labelY: 620,
        color: '#EC4899'
      },
      {
        id: 'zone_16',
        shape: 'polygon',
        points: '340,485 365,465 425,430 475,420 490,490 440,550 410,535 360,535',
        label: 'DEPOT',
        labelX: 415,
        labelY: 490,
        color: '#F97316'
      },
      {
        id: 'zone_17',
        shape: 'polygon',
        points: '410,535 440,550 490,490 555,655 490,670 455,580',
        label: 'SEVEN SONG GROUP',
        labelX: 480,
        labelY: 595,
        color: '#14B8A6'
      },
      {
        id: 'zone_18',
        shape: 'polygon',
        points: '490,490 475,420 515,385 590,370 650,315 720,440 650,470 555,655',
        label: 'DEPOT',
        labelX: 600,
        labelY: 500,
        color: '#6366F1'
      }
    ];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Site Map Editor</h1>
          <p className="text-gray-600">สร้างและแก้ไขโซนบนแผนผังโรงงาน</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer px-4 py-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
            >
              <FiUpload size={16} /> อัปโหลดรูปแผนผัง
            </label>
          </div>
          
          {loading && (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500 mr-2"></div>
              <span>กำลังประมวลผล...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-start">
          <FiInfo className="mr-2 mt-0.5" />
          <div>
            <p>{success}</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg text-blue-700 flex items-start">
        <FiInfo className="mr-2 mt-0.5" />
        <div>
          <p className="font-medium">วิธีใช้เครื่องมือสร้างโซน:</p>
          <ul className="list-disc ml-4 text-sm mt-1">
            <li>คลิก "วาดโซน" เพื่อเริ่มสร้างโซนบนแผนผัง</li>
            <li>เลือกรูปร่าง (สี่เหลี่ยม, วงกลม, หรือหลายเหลี่ยม)</li>
            <li>สำหรับสี่เหลี่ยม/วงกลม: คลิกและลากเพื่อวาด</li>
            <li>สำหรับหลายเหลี่ยม: คลิกหลายจุดแล้วกด "สร้างหลายเหลี่ยม"</li>
            <li>คลิกที่โซนเพื่อแก้ไข, เคลื่อนย้าย, หรือปรับขนาด</li>
            <li>คลิก "บันทึกโซน" เมื่อเสร็จสิ้น</li>
          </ul>
        </div>
      </div>
      
      {/* Map Editor */}
      <ZoneEditor
        backgroundImage={backgroundImage || "/assets/industrial_map.jpg"}
        initialZones={zones}
        onSaveZones={handleSaveZones}
        height="700px"
      />
    </div>
  );
};

export default SiteMapEditor; 