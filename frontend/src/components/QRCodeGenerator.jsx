import React, { useEffect, useState } from 'react';

// This component is for development/testing only
const QRCodeGenerator = ({ sites = [] }) => {
  const [qrCodeSVGs, setQRCodeSVGs] = useState([]);

  useEffect(() => {
    // Dynamic import of qrcode library to avoid SSR issues
    import('qrcode').then(QRCode => {
      const generateQRCodes = async () => {
        const svgs = await Promise.all(
          sites.map(async site => {
            const svg = await QRCode.toString(site.id.toString(), {
              type: 'svg',
              color: {
                dark: '#000',
                light: '#fff'
              }
            });
            return { id: site.id, name: site.name, svg };
          })
        );
        setQRCodeSVGs(svgs);
      };

      generateQRCodes();
    });
  }, [sites]);

  if (!qrCodeSVGs.length) {
    return <div className="p-4 text-center">Loading QR codes...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Test QR Codes</h2>
      <p className="text-gray-600 mb-6">
        These QR codes can be used for testing the QR scanner functionality in the Data Input page.
        Each QR code represents a site ID.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {qrCodeSVGs.map(item => (
          <div key={item.id} className="border rounded-md p-4 text-center">
            <div 
              dangerouslySetInnerHTML={{ __html: item.svg }} 
              className="mx-auto w-32 h-32"
            />
            <p className="mt-2 font-medium">{item.name}</p>
            <p className="text-gray-600 text-sm">ID: {item.id}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-gray-500">
        <p>Note: Print these codes or display them on a separate device for scanning.</p>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 