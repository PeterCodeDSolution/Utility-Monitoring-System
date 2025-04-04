import React from 'react';

const Loader = ({ size = 'md', fullscreen = false }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      case 'md':
      default: return 'w-8 h-8';
    }
  };

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="text-center">
          <div className={`${getSize()} inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]`} />
          <p className="mt-2 text-white">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-4">
      <div className={`${getSize()} animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]`} />
    </div>
  );
};

export default Loader; 