import React, { useState, useEffect, useCallback } from 'react';
import KeyboardLayout from './components/KeyboardLayout';
import LayoutSelector from './components/LayoutSelector';
import TestResults from './components/TestResults';
import { layouts } from './utils/keyboardLayouts';

const App = () => {
  const [currentLayout, setCurrentLayout] = useState('laptop');
  const [keyStates, setKeyStates] = useState({});
  const [keyHistory, setKeyHistory] = useState([]);
  const [testMode, setTestMode] = useState('detection'); // detection, speed, pressure, combo

  // Handle key events
  const handleKeyDown = useCallback((event) => {
    event.preventDefault();
    const key = event.code;
    const now = Date.now();
    
    setKeyStates(prev => {
      const prevState = prev[key] || {};
      
      // Calculate response time for speed test
      let responseTime = prevState.lastPressed ? 
        now - prevState.lastPressed : null;
      
      // Update combo count for combo test
      let comboCount = prevState.comboCount || 0;
      if (testMode === 'combo') {
        // Reset combo if more than 100ms since last press
        if (prevState.lastPressed && (now - prevState.lastPressed) < 100) {
          comboCount++;
        } else {
          comboCount = 1;
        }
      }
      
      return {
        ...prev,
        [key]: {
          ...prevState,
          isPressed: true,
          lastPressed: now,
          responseTime: testMode === 'speed' ? responseTime : prevState.responseTime,
          comboCount: testMode === 'combo' ? comboCount : prevState.comboCount
        }
      };
    });
    
    // Add to history
    setKeyHistory(prev => [
      { key, timestamp: now, type: 'press' },
      ...prev.slice(0, 99) // Keep only last 100 events
    ]);
  }, [testMode]);

  const handleKeyUp = useCallback((event) => {
    event.preventDefault();
    const key = event.code;
    const now = Date.now();
    
    setKeyStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isPressed: false,
        releaseTime: now
      }
    }));
    
    // Add to history
    setKeyHistory(prev => [
      { key, timestamp: now, type: 'release' },
      ...prev.slice(0, 99)
    ]);
  }, []);

  // Setup keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Reset all key states when layout changes
  useEffect(() => {
    setKeyStates({});
  }, [currentLayout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            键盘测试工具
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            实时检测按键状态，识别故障按键，测试响应速度和连击性能
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <LayoutSelector 
                currentLayout={currentLayout} 
                onChange={setCurrentLayout} 
              />
              
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${testMode === 'detection' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setTestMode('detection')}
                >
                  按键检测
                </button>
                <button 
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${testMode === 'speed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setTestMode('speed')}
                >
                  响应速度
                </button>
                <button 
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${testMode === 'combo' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => setTestMode('combo')}
                >
                  连击测试
                </button>
              </div>
            </div>
            
            <KeyboardLayout 
              layout={layouts[currentLayout]} 
              keyStates={keyStates}
              testMode={testMode}
            />
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl">
            <TestResults 
              keyHistory={keyHistory} 
              keyStates={keyStates}
              testMode={testMode}
            />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 md:p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-400">功能说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">按键检测</h3>
              <p className="text-gray-300 text-sm">实时显示按键状态，绿色表示正常按下，红色表示可能存在问题</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-400 mb-2">响应速度</h3>
              <p className="text-gray-300 text-sm">测量按键响应时间，帮助识别延迟问题</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">连击测试</h3>
              <p className="text-gray-300 text-sm">检测按键连击性能，识别卡键问题</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-red-400 mb-2">故障识别</h3>
              <p className="text-gray-300 text-sm">自动标记长时间未响应的按键</p>
            </div>
          </div>
        </div>
        
        <footer className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
          <p>键盘测试工具 © {new Date().getFullYear()} - 检测您的键盘状态</p>
        </footer>
      </div>
    </div>
  );
};

export default App;