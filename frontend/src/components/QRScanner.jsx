import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiX, FiCamera, FiRefreshCw } from 'react-icons/fi';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const qrScannerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize the component
    qrScannerRef.current = new Html5Qrcode('qr-reader');

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Try to select back camera first (for mobile devices)
          const backCamera = devices.find(camera => 
            camera.label.toLowerCase().includes('back') || 
            camera.label.toLowerCase().includes('rear')
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
        } else {
          setError('กล้องไม่พร้อมใช้งาน โปรดตรวจสอบอุปกรณ์ของคุณ');
        }
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setError('ไม่สามารถเข้าถึงกล้องได้: ' + err.message);
      });

    // Cleanup function to ensure camera is stopped when component unmounts
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = () => {
    if (!selectedCamera || !qrScannerRef.current) return;

    const containerWidth = containerRef.current?.clientWidth || 300;
    const scannerWidth = Math.min(containerWidth, 300);
    const scannerHeight = scannerWidth;

    // First stop if already running
    if (isStarted) {
      stopScanner();
    }

    qrScannerRef.current
      .start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: scannerWidth * 0.7, height: scannerHeight * 0.7 },
        },
        (decodedText) => {
          // Check if the scanned QR code is valid
          try {
            console.log('Scanned QR code:', decodedText);
            
            // Accept any non-empty string as valid (we'll validate in the parent component)
            if (decodedText && decodedText.trim() !== '') {
              onScanSuccess(decodedText.trim());
              stopScanner();
            } else {
              setError('QR Code ไม่ถูกต้อง โปรดลองใหม่อีกครั้ง');
            }
          } catch (err) {
            console.error('QR code parsing error:', err);
            setError('QR Code ไม่ถูกต้อง โปรดลองใหม่อีกครั้ง');
          }
        },
        (errorMessage) => {
          // Handle scan error silently (no need to show decoding errors to user)
          console.log('QR Scan error:', errorMessage);
        }
      )
      .then(() => {
        setIsStarted(true);
        setError('');
      })
      .catch((err) => {
        console.error('Scanner start error:', err);
        setError('ไม่สามารถเริ่มการสแกนได้: ' + err.message);
      });
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      if (isStarted) {
        qrScannerRef.current
          .stop()
          .then(() => {
            setIsStarted(false);
          })
          .catch((err) => {
            console.error('Error stopping QR scanner:', err);
          });
      } else if (qrScannerRef.current.isScanning) {
        // Fallback method if isStarted state is out of sync
        qrScannerRef.current
          .stop()
          .catch((err) => {
            console.error('Error stopping QR scanner (fallback):', err);
          });
      }
    }
  };

  // Handle close button click
  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const switchCamera = () => {
    if (isStarted) {
      stopScanner();
    }
    
    // Select the next camera in the list
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(camera => camera.id === selectedCamera);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCamera(cameras[nextIndex].id);
    }
  };

  // Start scanner when camera is selected
  useEffect(() => {
    if (selectedCamera) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startScanner();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedCamera]);

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        className="w-full overflow-hidden"
      >
        <div className="mb-4 text-center text-sm text-gray-600">
          กรุณาสแกน QR Code ของไซต์เพื่อเลือกไซต์โดยอัตโนมัติ
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div 
          id="qr-reader" 
          className="w-full rounded overflow-hidden bg-gray-100 aspect-square mb-4"
        />
        
        <div className="flex justify-between">
          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FiRefreshCw />
              <span>เปลี่ยนกล้อง</span>
            </button>
          )}
          
          <button
            onClick={isStarted ? stopScanner : startScanner}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isStarted 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <FiCamera />
            <span>{isStarted ? 'หยุดสแกน' : 'เริ่มสแกนใหม่'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 