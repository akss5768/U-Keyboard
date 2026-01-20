import React, { useMemo } from 'react';

const TestResults = ({ keyHistory, keyStates, testMode }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalPresses = keyHistory.filter(e => e.type === 'press').length;
    const uniqueKeys = new Set(keyHistory.map(e => e.key)).size;
    
    // Response time stats
    const responseTimes = Object.values(keyStates)
      .filter(state => state?.responseTime)
      .map(state => state.responseTime);
    
    const avgResponseTime = responseTimes.length > 0 
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)
      : 0;
    
    const maxResponseTime = responseTimes.length > 0 
      ? Math.max(...responseTimes)
      : 0;
    
    // Combo stats
    const comboCounts = Object.values(keyStates)
      .filter(state => state?.comboCount)
      .map(state => state.comboCount);
    
    const maxCombo = comboCounts.length > 0 
      ? Math.max(...comboCounts)
      : 0;
    
    return {
      totalPresses,
      uniqueKeys,
      avgResponseTime,
      maxResponseTime,
      maxCombo
    };
  }, [keyHistory, keyStates]);
  
  // Get recent history (last 10 events)
  const recentHistory = keyHistory.slice(0, 10);
  
  // Find problematic keys
  const problematicKeys = useMemo(() => {
    return Object.entries(keyStates)
      .filter(([code, state]) => 
        state.responseTime > 100 || 
        state.comboCount > 10
      )
      .map(([code, state]) => ({
        code,
        responseTime: state.responseTime || 0,
        comboCount: state.comboCount || 0
      }))
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, 5);
  }, [keyStates]);
  
  return (
    <div className="test-results">
      <h2 className="text-xl font-bold mb-4 text-blue-400">测试结果</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">按键次数</div>
          <div className="text-2xl font-bold text-green-400">{stats.totalPresses}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-400 text-sm">不同按键</div>
          <div className="text-2xl font-bold text-yellow-400">{stats.uniqueKeys}</div>
        </div>
        
        {testMode === 'speed' && (
          <>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">平均响应</div>
              <div className="text-2xl font-bold text-blue-400">{stats.avgResponseTime}ms</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">最大延迟</div>
              <div className="text-2xl font-bold text-red-400">{stats.maxResponseTime}ms</div>
            </div>
          </>
        )}
        
        {testMode === 'combo' && (
          <div className="bg-gray-700 p-3 rounded-lg col-span-2">
            <div className="text-gray-400 text-sm">最高连击</div>
            <div className="text-2xl font-bold text-purple-400">{stats.maxCombo} 次</div>
          </div>
        )}
      </div>
      
      {problematicKeys.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-red-400">问题按键</h3>
          <div className="space-y-2">
            {problematicKeys.map((key, index) => (
              <div key={index} className="flex justify-between bg-gray-700 p-2 rounded">
                <span className="font-mono">{key.code}</span>
                <span className="text-red-400">
                  {key.responseTime > 100 ? `${key.responseTime}ms` : `${key.comboCount}连击`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="font-semibold mb-2 text-gray-300">按键历史</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
          {recentHistory.length > 0 ? (
            recentHistory.map((event, index) => (
              <div key={index} className="flex justify-between text-sm bg-gray-700 p-2 rounded">
                <span className="font-mono">{event.key}</span>
                <span className={`font-medium ${event.type === 'press' ? 'text-green-400' : 'text-gray-400'}`}>
                  {event.type === 'press' ? '按下' : '释放'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">暂无按键记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResults;