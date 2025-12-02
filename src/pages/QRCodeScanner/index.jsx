import React, { useState, useEffect } from 'react';
import { NavBar, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);

  // 组件挂载后开始倒计时
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/authorization');
      return;
    }

    // 延迟开始扫描，让页面加载完成
    const startTimer = setTimeout(() => {
      setIsScanning(true);
      startCountdown();
    }, 500);

    return () => clearTimeout(startTimer);
  }, [navigate]);

  // 3秒倒计时功能
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleScanSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 模拟扫描成功
  const handleScanSuccess = () => {
    setScanComplete(true);

    // 延迟跳转到结果页面
    setTimeout(() => {
      navigate('/scan-result', {
        state: {
          barcode: '模拟二维码数据-' + Date.now(),
          scanTime: new Date().toISOString(),
          source: 'simulated-scanner'
        }
      });
    }, 1500);
  };

  // 手动触发扫描（用于测试）
  const handleManualScan = () => {
    if (!scanComplete) {
      handleScanSuccess();
    }
  };

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="scanner-container">
      {/* 顶部导航栏 */}
      <NavBar className="scanner-nav-bar" mode="light" onBack={handleBack} backArrow={false}>
        <span className="nav-title">扫码</span>
      </NavBar>

      {/* 模拟摄像头预览区域 */}
      <div className="camera-preview">
        {/* 模拟摄像头画面 */}
        <div className="simulated-camera">
          <div className="camera-overlay">
            {/* 模拟摄像头画面内容 */}
            <div className="camera-content">
              <div className="scanning-indicator">
                <div className="scanning-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="scanning-text">
                  {isScanning ? '扫描中...' : '准备扫描'}
                </div>
              </div>

              {/* 倒计时显示 */}
              {isScanning && countdown > 0 && (
                <div className="countdown-display">
                  {/* <div className="countdown-number">{countdown}</div> */}
                  {/* <div className="countdown-label">秒后自动扫描成功</div> */}
                </div>
              )}

              {/* 扫描成功状态 */}
              {scanComplete && (
                <div className="scan-success">
                  <div className="success-icon">✅</div>
                  <div className="success-text">扫描成功！</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 扫描框覆盖层 */}
        <div className="scan-overlay">
          <div className="scan-frame">
            <div className="scan-frame-corner scan-frame-corner-top-left"></div>
            <div className="scan-frame-corner scan-frame-corner-top-right"></div>
            <div className="scan-frame-corner scan-frame-corner-bottom-left"></div>
            <div className="scan-frame-corner scan-frame-corner-bottom-right"></div>

            {/* 扫描线 */}
            <div className={`scan-line ${isScanning ? 'scanning' : ''}`}></div>
          </div>

          {/* 提示文本 */}
          <div className="scan-hint">
            {isScanning
              ? (countdown > 0 ? `倒计时: ${countdown}秒` : '正在处理...')
              : '准备模拟扫描'}
          </div>
        </div>
      </div>

      {/* 底部操作区域 */}
      <div className="scanner-controls">
        <div className="control-item active">
          <div className="control-icon scan-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect x="7.5" y="7.5" width="15" height="15" stroke="white" strokeWidth="1" />
              <rect x="10" y="10" width="10" height="10" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <span className="control-text">模拟扫码</span>
        </div>

        <div className="control-item" onClick={handleManualScan}>
          <div className="control-icon manual-icon">⚡</div>
          <span className="control-text">立即扫描</span>
        </div>

        <div className="control-item" onClick={() => window.location.reload()}>
          <div className="control-icon refresh-icon">🔄</div>
          <span className="control-text">重新开始</span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;