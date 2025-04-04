import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, unit, icon, trend = null, trendValue = null, color = 'blue' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'text-green-500';
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'blue':
      default: return 'text-blue-500';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <div className="flex items-start">
        <div className={`${getColorClass()} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
              {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
            </p>
          </div>
          {trend && trendValue && (
            <div className="flex items-center mt-1">
              {getTrendIcon()}
              <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'} ml-1`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 