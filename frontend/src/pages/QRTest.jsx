import React from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const QRTest = () => {
  // These should match the site IDs in the DataInput component
  const sites = [
    { id: 1, name: 'Site A' },
    { id: 2, name: 'Site B' },
    { id: 3, name: 'Site C' },
    { id: 4, name: 'Site D' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">QR Code Test Page</h1>
        <p className="text-gray-600">
          This page shows QR codes for each site for testing the QR code scanner feature.
        </p>
      </div>

      <QRCodeGenerator sites={sites} />
    </div>
  );
};

export default QRTest; 