import React from 'react';

interface TabProps {
  activeTab: 'record' | 'analysis';
  onTabChange: (tab: 'record' | 'analysis') => void;
}

export const Tabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex rounded-xl overflow-hidden">
      <button
        className={`flex-1 py-3 ${
          activeTab === 'record'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-white text-gray-500'
        }`}
        onClick={() => onTabChange('record')}
      >
        식사 기록
      </button>
      <button
        className={`flex-1 py-3 ${
          activeTab === 'analysis'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-white text-gray-500'
        }`}
        onClick={() => onTabChange('analysis')}
      >
        영양 분석
      </button>
    </div>
  );
}; 