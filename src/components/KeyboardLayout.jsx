import React from 'react';

const KeyComponent = ({ keyDef, state, testMode }) => {
  if (!keyDef) return <div className="key-placeholder" style={{ width: '0.5rem' }} />;
  
  const { code, label, width = 1, height = 1 } = keyDef;
  
  // Determine key state classes
  let keyClasses = "flex items-center justify-center rounded-md text-xs font-medium transition-all duration-100 relative ";
  
  if (state?.isPressed) {
    keyClasses += "bg-green-500 text-white shadow-lg transform scale-95 ";
  } else if (state?.responseTime > 100) {
    keyClasses += "bg-red-500 text-white ";
  } else if (state?.comboCount > 5) {
    keyClasses += "bg-purple-500 text-white ";
  } else {
    keyClasses += "bg-gray-700 text-gray-200 hover:bg-gray-600 ";
  }
  
  // Special styling for larger keys
  if (width > 1.5) {
    keyClasses += "text-xs ";
  }
  
  // Width calculation (1 unit = 2.5rem with 0.25rem gap)
  const keyWidth = `calc(${width * 2.5}rem - 0.25rem)`;
  const keyHeight = height > 1 ? `calc(${height * 2.5}rem - 0.25rem)` : '2.5rem';
  
  return (
    <div 
      className={keyClasses}
      style={{ 
        width: keyWidth, 
        height: keyHeight,
        minWidth: keyWidth
      }}
    >
      {label}
      {testMode === 'speed' && state?.responseTime && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-black/70 px-1 rounded whitespace-nowrap">
          {state.responseTime}ms
        </div>
      )}
      {testMode === 'combo' && state?.comboCount > 0 && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-purple-500 px-1 rounded">
          {state.comboCount}
        </div>
      )}
    </div>
  );
};

const KeyboardLayout = ({ layout, keyStates, testMode }) => {
  return (
    <div className="keyboard-layout bg-gray-900 p-4 rounded-lg">
      <div className="mb-2 text-center text-gray-400 text-sm">{layout.name}</div>
      <div className="flex flex-col gap-2">
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((keyDef, keyIndex) => (
              <KeyComponent 
                key={`${rowIndex}-${keyIndex}`}
                keyDef={keyDef}
                state={keyDef ? keyStates[keyDef.code] : null}
                testMode={testMode}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span>未按下</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>正常按下</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>响应缓慢</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>连击测试</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardLayout;