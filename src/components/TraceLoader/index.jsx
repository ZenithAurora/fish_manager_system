import React, { useState, useEffect, useRef } from 'react';
import './index.scss';

const SYSTEM_LOGS = [
  "正在建立加密安全通道...",
  "连接至溯源中心节点 (Node-CN-732)...",
  "正在请求区块链账本数据...",
  "验证区块哈希: 0x7f83b1... [OK]",
  "检索养殖环境物联网(IoT)历史数据...",
  "分析过去180天水质监测报告...",
  "正在解密饲料投喂记录...",
  "比对冷链物流温控数据曲线...",
  "调用AI模型进行质量评估...",
  "生成数字防伪签名...",
  "溯源数据完整性校验通过...",
  "正在渲染可视化报告..."
];

const TraceLoader = ({ visible, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    // 重置状态
    setProgress(0);
    setLogs([]);
    setCurrentStep(0);

    // 随机总时长 10s - 20s
    const totalDuration = 10000 + Math.random() * 10000;
    // const totalDuration = 100 + Math.random() * 10000;
    const updateInterval = 100; // 每100ms更新一次
    const totalSteps = totalDuration / updateInterval;
    const progressPerStep = 100 / totalSteps;

    let steps = 0;
    
    const timer = setInterval(() => {
      steps++;
      
      // 更新进度条，添加一点随机扰动模拟真实网络波动
      setProgress(prev => {
        const next = prev + progressPerStep + (Math.random() * 0.5 - 0.25);
        return next > 100 ? 100 : next;
      });

      // 更新日志
      if (steps % 15 === 0 && currentStep < SYSTEM_LOGS.length) {
        setLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }) + `.${Math.floor(Math.random()*999)}`,
          text: SYSTEM_LOGS[Math.floor((steps / totalSteps) * SYSTEM_LOGS.length) % SYSTEM_LOGS.length]
        }]);
        
        // 自动滚动到底部
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }

      // 完成
      if (steps >= totalSteps) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="trace-loader-overlay">
      <div className="loader-container">
        {/* 顶部状态栏 */}
        <div className="loader-header">
          <span className="system-id">SYS_ID: UNAGI_TRACE_V2.0</span>
          <span className="connection-status">SECURE_CONNECTION</span>
        </div>

        {/* 核心动画区 */}
        <div className="core-visual">
          <div className="scanner-ring ring-1"></div>
          <div className="scanner-ring ring-2"></div>
          <div className="scanner-ring ring-3"></div>
          <div className="scanner-core">
            <div className="data-particles"></div>
            <span className="core-icon"><i className="bi bi-search"></i></span>
          </div>
          <div className="scan-line"></div>
        </div>

        {/* 进度显示 */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="action-text">正在进行全链路溯源分析</span>
            <span className="percentage">{Math.floor(progress)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
        </div>

        {/* 终端日志区 */}
        <div className="terminal-logs" ref={logContainerRef}>
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              <span className="log-time">[{log.time}]</span>
              <span className="log-text">{log.text}</span>
            </div>
          ))}
          <div className="log-cursor">_</div>
        </div>

        {/* 底部数据装饰 */}
        <div className="loader-footer">
          <div className="stat-item">
            <span className="label">LATENCY</span>
            <span className="value">24ms</span>
          </div>
          <div className="stat-item">
            <span className="label">NODES</span>
            <span className="value">1,024</span>
          </div>
          <div className="stat-item">
            <span className="label">ENCRYPTION</span>
            <span className="value">AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceLoader;