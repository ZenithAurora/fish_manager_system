import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Toast, Modal } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import './index.scss';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [showCameraSelector, setShowCameraSelector] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // 检查用户授权状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
    } else {
      requestCameraPermission();
    }
  }, [navigate]);

  // 请求摄像头权限
  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    try {
      // 使用MediaDevices API请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      // 权限获取成功，停止流并初始化摄像头
      stream.getTracks().forEach(track => track.stop());
      setHasCameraPermission(true);
      setIsRequestingPermission(false);
      initializeCamera();

    } catch (error) {
      console.error('摄像头权限请求失败:', error);
      setIsRequestingPermission(false);

      if (error.name === 'NotAllowedError') {
        setCameraError('摄像头权限被拒绝');
        Toast.show({
          content: '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问',
          duration: 5000,
        });
      } else if (error.name === 'NotFoundError') {
        setCameraError('未检测到可用摄像头');
        Toast.show({
          content: '未检测到可用摄像头',
          duration: 3000,
        });
      } else {
        setCameraError('无法访问摄像头设备');
        Toast.show({
          content: '无法访问摄像头设备，请检查权限设置',
          duration: 3000,
        });
      }
    }
  };

  // 初始化摄像头
  const initializeCamera = async () => {
    try {
      // 获取可用摄像头列表
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        setAvailableCameras(cameras);
        setSelectedCamera(cameras[0].id);
        startScanner(cameras[0].id);
      } else {
        setCameraError('未检测到可用摄像头');
        Toast.show({
          content: '未检测到可用摄像头',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('获取摄像头列表失败:', error);
      setCameraError('无法访问摄像头设备');
      Toast.show({
        content: '无法访问摄像头设备，请检查权限设置',
        duration: 3000,
      });
    }
  };

  // 启动二维码扫描器
  const startScanner = async (cameraId) => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.error('清理扫描器失败:', error);
      }
    }

    try {
      // 直接使用Html5Qrcode而不是Html5QrcodeScanner
      scannerRef.current = new Html5Qrcode('qr-reader');

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        // 添加支持的二维码格式
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_QR_CODE,
          Html5QrcodeScanType.SCAN_TYPE_BARCODE
        ],
        // 提高识别精度
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };

      // 使用正确的API启动扫描
      await scannerRef.current.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          // 扫描成功回调
          handleScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // 扫描失败 - 完全静默处理，避免任何错误日志输出
          // 不记录任何错误信息，避免干扰控制台
        }
      );

      setIsScanning(true);
      console.log('扫描器启动成功');
    } catch (error) {
      console.error('启动扫描器失败:', error);
      setCameraError('启动摄像头失败');
      setIsScanning(false);
      Toast.show({
        content: '启动摄像头失败，请检查权限设置',
        duration: 3000,
      });
    }
  };

  // 处理扫描成功
  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log('二维码扫描结果:', decodedText);

    // 停止扫描
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        console.log('扫描器已停止');
      }).catch(err => {
        console.error('停止扫描器失败:', err);
      });
    }

    // 显示成功提示
    Toast.show({
      content: '扫描成功！',
      icon: 'success',
      duration: 2000,
    });

    // 延迟跳转到结果页面，让用户看到成功提示
    setTimeout(() => {
      // 跳转到扫描结果页面，并传递扫描数据
      navigate('/scan-result', {
        state: {
          barcode: decodedText,
          scanTime: new Date().toISOString(),
          source: 'qrcode-scanner'
        }
      });
    }, 1500);
  };

  // 切换摄像头
  const switchCamera = async (cameraId) => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        startScanner(cameraId);
        setSelectedCamera(cameraId);
        setShowCameraSelector(false);
        Toast.show({
          content: '摄像头已切换',
          duration: 2000,
        });
      } catch (error) {
        console.error('切换摄像头失败:', error);
        Toast.show({
          content: '切换摄像头失败',
          duration: 3000,
        });
      }
    }
  };

  // 停止扫描
  const stopScanner = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.stop().catch(error => {
        console.error('停止扫描器失败:', error);
      });
      setIsScanning(false);
    }
  };

  // 重新开始扫描
  const restartScanner = () => {
    if (selectedCamera) {
      startScanner(selectedCamera);
    } else {
      requestCameraPermission();
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().then(() => {
          console.log('扫描器已停止（组件卸载）');
        }).catch(error => {
          console.error('清理扫描器失败:', error);
        });
      }
    };
  }, [isScanning]);

  // 返回上一页
  const handleBack = () => {
    stopScanner();
    navigate(-1);
  };

  // 手动输入二维码
  const handleManualInput = () => {
    Modal.prompt({
      title: '手动输入二维码',
      message: '请输入二维码内容',
      placeholder: '请输入二维码文本',
      onConfirm: (value) => {
        if (value && value.trim()) {
          // 显示成功提示
          Toast.show({
            content: '输入成功！',
            icon: 'success',
            duration: 2000,
          });

          // 延迟跳转到结果页面
          setTimeout(() => {
            navigate('/scan-result', {
              state: {
                barcode: value.trim(),
                scanTime: new Date().toISOString(),
                source: 'manual-input'
              }
            });
          }, 1500);
        }
      },
    });
  };

  return (
    <div className="scanner-container">
      {/* 顶部导航栏 */}
      <NavBar className="scanner-nav-bar" mode="light" onBack={handleBack} backArrow={false}>
        <span className="nav-title">扫码</span>
        {availableCameras.length > 1 && (
          <div
            className="camera-switch"
            onClick={() => setShowCameraSelector(true)}
          >
            🔄
          </div>
        )}
      </NavBar>

      {/* 摄像头预览区域 */}
      <div className="camera-preview">
        {/* 二维码扫描器容器 */}
        <div id="qr-reader" className="qr-reader">
          {isRequestingPermission && (
            <div className="permission-prompt">
              <div className="permission-icon">📱</div>
              <div className="permission-text">
                正在请求摄像头权限...
                <br />
                <small>请允许浏览器访问您的摄像头</small>
              </div>
            </div>
          )}

          {!isRequestingPermission && !hasCameraPermission && !cameraError && (
            <div className="permission-prompt">
              <div className="permission-icon">📱</div>
              <div className="permission-text">
                需要摄像头权限
                <br />
                <button className="permission-button" onClick={requestCameraPermission}>
                  允许摄像头访问
                </button>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="error-prompt">
              <div className="error-icon">❌</div>
              <div className="error-text">
                {cameraError}
                <br />
                <button className="retry-button" onClick={restartScanner}>
                  重试
                </button>
              </div>
            </div>
          )}
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
            {isScanning ? '对准二维码进行扫描' : '准备扫描中...'}
          </div>
        </div>
      </div>

      {/* 底部功能按钮 */}
      {/* <div className="scanner-controls">
        <div className="control-item active">
          <div className="control-icon scan-icon">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect x="7.5" y="7.5" width="15" height="15" stroke="white" strokeWidth="1" />
              <rect x="10" y="10" width="10" height="10" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <span className="control-text">扫码</span>
        </div>

        <div className="control-item" onClick={handleManualInput}>
          <div className="control-icon manual-icon">✍️</div>
          <span className="control-text">手动输入</span>
        </div>

        <div className="control-item" onClick={restartScanner}>
          <div className="control-icon refresh-icon">🔄</div>
          <span className="control-text">重新扫描</span>
        </div>
      </div> */}

      {/* 摄像头选择器模态框 */}
      <Modal
        visible={showCameraSelector}
        onClose={() => setShowCameraSelector(false)}
        title="选择摄像头"
        content={
          <div className="camera-selector">
            {availableCameras.map((camera) => (
              <div
                key={camera.id}
                className={`camera-option ${selectedCamera === camera.id ? 'selected' : ''}`}
                onClick={() => switchCamera(camera.id)}
              >
                <div className="camera-icon">📷</div>
                <div className="camera-info">
                  <div className="camera-label">{camera.label}</div>
                  <div className="camera-id">{camera.id}</div>
                </div>
                {selectedCamera === camera.id && (
                  <div className="selected-icon">✓</div>
                )}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default QRCodeScanner;