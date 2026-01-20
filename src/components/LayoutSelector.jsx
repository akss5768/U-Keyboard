import React from 'react';

const LayoutSelector = ({ currentLayout, onChange }) => {
  const layouts = [
    { id: 'standard', name: '标准104键' },
    { id: 'mac', name: 'Mac键盘' },
    { id: 'gaming', name: '游戏键盘' },
    { id: 'laptop', name: '笔记本键盘' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2">
      {layouts.map(layout => (
        <button
          key={layout.id}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentLayout === layout.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          onClick={() => onChange(layout.id)}
        >
          {layout.name}
        </button>
      ))}
    </div>
  );
};

export default LayoutSelector;