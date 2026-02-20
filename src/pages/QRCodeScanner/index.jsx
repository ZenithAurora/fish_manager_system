import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavBar, Toast, Dialog } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import './index.scss';

// 全局状态追踪器
let activeCameras = new Set();

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('camera'); // 'camera' | 'simulation'
  const [isScanning, setIsScanning] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [scanComplete, setScanComplete] = useState(false);
  const html5QrCodeRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const componentIdRef = useRef(`scanner-${Date.now()}`);

  // 初始化权限检查
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
    }
    
      // 清理函数
    return () => {
      console.log('Component unmounting, cleaning up camera');
      stopCamera();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [navigate]);

  // 监听模式变化和完成状态
  useEffect(() => {
    if (scanComplete) {
      stopCamera();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      return;
    }

    if (mode === 'camera') {
      // 停止倒计时
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      // 启动摄像头
      startCamera();
    } else {
      // 停止摄像头
      stopCamera();
      // 启动模拟倒计时
      setIsScanning(true);
      setCountdown(3);
      startSimulationCountdown();
    }
  }, [mode, scanComplete]);

  const startCamera = async () => {
    try {
      // 确保之前的实例已停止
      if (html5QrCodeRef.current) {
        await stopCamera();
      }
      
      // 检查并清理其他可能活动的摄像头实例
      if (activeCameras.size > 0) {
        console.warn('Multiple active cameras detected, forcing cleanup');
        // 强制清理所有摄像头（在真实应用中可能需要更精细的管理）
        const cameraIds = [...activeCameras];
        for (const cameraId of cameraIds) {
          if (cameraId !== componentIdRef.current) {
            // 模拟其他实例的清理
            console.log(`Cleaning up stray camera instance: ${cameraId}`);
            activeCameras.delete(cameraId);
          }
        }
      }
      
      // 追踪新摄像头实例
      activeCameras.add(componentIdRef.current);
      console.log('Starting camera for component:', componentIdRef.current);
      console.log('Active cameras after start:', [...activeCameras]);

      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      // 优先使用后置摄像头
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // 扫描过程中的错误忽略，避免刷屏
          // console.log(errorMessage);
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner", err);
      // 如果摄像头启动失败，提示用户并切换到模拟模式
      Dialog.confirm({
        content: '无法启动摄像头，是否切换到模拟模式？',
        onConfirm: () => {
          setMode('simulation');
        },
        onCancel: () => {
            navigate(-1);
        }
      });
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        // 记录停止状态用于调试
        console.log('Stopping camera for component:', componentIdRef.current);
        
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        
        // 从全局追踪器中移除
        activeCameras.delete(componentIdRef.current);
        console.log('Active cameras after stop:', [...activeCameras]);
        
      } catch (err) {
        console.error("Failed to stop scanner", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
  };

  const startSimulationCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          handleScanSuccess('模拟二维码数据-' + Date.now());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleScanSuccess = useCallback((decodedText) => {
    if (scanComplete) return;
    
    setScanComplete(true);
    setIsScanning(false);

    // 震动反馈
    if (navigator.vibrate) {
      try {
        navigator.vibrate(200);
      } catch (e) {
        // 忽略不支持的情况
      }
    }

    Toast.show({
      icon: 'success',
      content: '扫描成功',
      duration: 1000,
    });

    // 延迟跳转
    setTimeout(() => {
      navigate('/scan-result', {
        state: {
          barcode: decodedText,
          scanTime: new Date().toISOString(),
          source: mode === 'camera' ? 'camera-scanner' : 'simulated-scanner'
        }
      });
    }, 1000);
  }, [scanComplete, navigate, mode]);

  const toggleMode = () => {
    setScanComplete(false);
    setMode(prev => {
      if (prev === 'camera') {
        // 切换到模拟模式时停止摄像头
        stopCamera();
        return 'simulation';
      } else {
        return 'camera';
      }
    });
  };

  const handleBack = () => {
    stopCamera();
    navigate(-1);
  };

  const handleManualTrigger = () => {
    if (!scanComplete) {
        handleScanSuccess('手动触发数据-' + Date.now());
    }
  };

  // 添加页面可见性监听
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时停止摄像头
        stopCamera();
      } else if (mode === 'camera' && !scanComplete) {
        // 页面重新显示时重启摄像头
        startCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mode, scanComplete]);

  return (
    <div className="scanner-container">
      <NavBar className="scanner-nav-bar" mode="light" onBack={handleBack} backArrow={false}>
        <span className="nav-title">扫码溯源</span>
      </NavBar>

      <div className="camera-preview">
        {/* 摄像头容器 */}
        <div 
            id="reader" 
            className={`real-camera ${mode === 'camera' ? 'active' : 'hidden'}`}
        ></div>

        {/* 模拟器容器 */}
        {mode === 'simulation' && (
            <div className="simulated-camera">
            <div className="camera-overlay">
                <div className="camera-content">
                <div className="scanning-indicator">
                    <div className="scanning-dots">
                    <span></span><span></span><span></span>
                    </div>
                    <div className="scanning-text">
                    {isScanning ? '模拟扫描中...' : '准备扫描'}
                    </div>
                </div>

                {isScanning && countdown > 0 && (
                    <div className="countdown-display">
                    {/* <div className="countdown-number">{countdown}</div> */}
                    </div>
                )}
                </div>
            </div>
            </div>
        )}

        {/* 扫描成功状态覆盖 */}
        {scanComplete && (
            <div className="scan-success-overlay">
                <div className="success-content">
                    <div className="success-icon">✅</div>
                    <div className="success-text">扫描成功！</div>
                    <div className="processing-text">正在解析数据...</div>
                </div>
            </div>
        )}

        {/* 扫描框覆盖层 (始终显示) */}
        {!scanComplete && (
            <div className="scan-overlay">
            <div className="scan-frame">
                <div className="scan-frame-corner scan-frame-corner-top-left"></div>
                <div className="scan-frame-corner scan-frame-corner-top-right"></div>
                <div className="scan-frame-corner scan-frame-corner-bottom-left"></div>
                <div className="scan-frame-corner scan-frame-corner-bottom-right"></div>
                <div className={`scan-line ${isScanning ? 'scanning' : ''}`}></div>
            </div>
            <div className="scan-hint">
                {mode === 'camera' 
                ? '将二维码/条形码放入框内，即可自动扫描' 
                : (countdown > 0 ? `模拟倒计时: ${countdown}秒` : '处理中...')}
            </div>
            </div>
        )}
      </div>

      <div className="scanner-controls">
        <div 
            className={`control-item ${mode === 'camera' ? 'active' : ''}`} 
            onClick={() => mode !== 'camera' && toggleMode()}
        >
          <div className="control-icon camera-icon">📷</div>
          <span className="control-text">摄像头</span>
        </div>

        <div className="control-item" onClick={handleManualTrigger}>
          <div className="control-icon manual-icon">⚡</div>
          <span className="control-text">立即触发</span>
        </div>

        <div 
            className={`control-item ${mode === 'simulation' ? 'active' : ''}`}
            onClick={() => mode !== 'simulation' && toggleMode()}
        >
          <div className="control-icon simulation-icon">🔢</div>
          <span className="control-text">模拟扫码</span>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;