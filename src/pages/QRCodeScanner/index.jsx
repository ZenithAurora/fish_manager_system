import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavBar, Toast, Button, ImageUploader } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import jsQR from 'jsqr';
import './index.scss';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const html5QrCodeRef = useRef(null);
  const isMountedRef = useRef(true);
  const fileInputRef = useRef(null);

  // 初始化权限检查
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
      return;
    }
    
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, [navigate]);

  // 监听模式切换
  useEffect(() => {
    if (scanComplete) return;
    
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [mode, scanComplete]);

  // 启动摄像头
  const startCamera = async () => {
    try {
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (isMountedRef.current) {
            handleScanSuccess(decodedText);
          }
        },
        () => {}
      );
      
      if (isMountedRef.current) {
        setIsScanning(true);
      }
    } catch (err) {
      console.error("摄像头启动失败:", err);
      
      if (!isMountedRef.current) return;
      
      let tips = '';
      if (window.location.protocol === 'http:' && 
          window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1') {
        tips = '\n\n💡 请使用 localhost 访问';
      } else if (err.name === 'NotAllowedError') {
        tips = '\n\n请允许访问摄像头权限';
      } else if (err.name === 'NotFoundError') {
        tips = '\n\n未检测到摄像头';
      }

      Toast.show({
        icon: 'fail',
        content: '无法启动摄像头' + tips,
        duration: 3000,
      });
    }
  };

  // 停止摄像头
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("停止摄像头失败:", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
  };

  // 处理扫描成功
  const handleScanSuccess = useCallback((decodedText) => {
    if (scanComplete) return;
    
    setScanComplete(true);
    setIsScanning(false);
    stopCamera();

    if (navigator.vibrate) {
      try {
        navigator.vibrate(200);
      } catch (e) {
        console.log(e);
      }
    }

    Toast.show({
      icon: 'success',
      content: '识别成功',
      duration: 1000,
    });

    // 解析二维码数据
    setTimeout(() => {
      try {
        // 尝试解析JSON格式的溯源码
        const qrData = JSON.parse(decodedText);
        
        if (qrData.type === 'trace' && qrData.productId) {
          // 溯源码格式：跳转到对应商品的溯源详情
          navigate('/scan-result', {
            state: {
              productId: qrData.productId,
              barcode: decodedText,
              scanTime: new Date().toISOString(),
              source: 'qr-code',
              forceRefresh: true
            }
          });
        } else {
          // 其他格式，默认跳转到随机商品
          navigate('/scan-result', {
            state: {
              barcode: decodedText,
              scanTime: new Date().toISOString(),
              source: mode === 'camera' ? 'camera-scanner' : 'image-upload',
              forceRefresh: true
            }
          });
        }
      } catch (e) {
        // 非JSON格式，默认处理
        navigate('/scan-result', {
          state: {
            barcode: decodedText,
            scanTime: new Date().toISOString(),
            source: mode === 'camera' ? 'camera-scanner' : 'image-upload',
            forceRefresh: true
          }
        });
      }
    }, 1200);
  }, [scanComplete, navigate, mode]);

  // 处理图片上传
  const handleImageUpload = async (file) => {
    try {
      Toast.show({
        icon: 'loading',
        content: '识别中...',
        duration: 0,
      });

      // 读取图片
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // 创建canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // 获取图像数据
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // 使用jsQR识别
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          Toast.clear();
          
          if (code) {
            handleScanSuccess(code.data);
          } else {
            Toast.show({
              icon: 'fail',
              content: '未识别到二维码，请重试',
              duration: 2000,
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      
      return { url: URL.createObjectURL(file) };
    } catch (error) {
      Toast.clear();
      Toast.show({
        icon: 'fail',
        content: '图片识别失败',
        duration: 2000,
      });
      return { url: '' };
    }
  };

  // 返回
  const handleBack = () => {
    stopCamera();
    navigate(-1);
  };

  // 页面可见性监听
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      } else if (mode === 'camera' && !scanComplete && isMountedRef.current) {
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
      {/* 顶部导航栏 */}
      <NavBar className="scanner-nav-bar" onBack={handleBack}>
        扫码溯源
      </NavBar>

      {/* 摄像头预览区域 */}
      <div className="camera-preview">
        {mode === 'camera' ? (
          <>
            <div id="reader" className="camera-reader"></div>

            {/* 扫描成功遮罩 */}
            {scanComplete && (
              <div className="scan-success-overlay">
                <div className="success-content">
                  <div className="success-icon">✓</div>
                  <div className="success-text">识别成功</div>
                  <div className="processing-text">正在跳转...</div>
                </div>
              </div>
            )}

            {/* 扫描框 */}
            {!scanComplete && (
              <div className="scan-overlay">
                <div className="scan-frame">
                  <div className="corner corner-tl"></div>
                  <div className="corner corner-tr"></div>
                  <div className="corner corner-bl"></div>
                  <div className="corner corner-br"></div>
                  <div className={`scan-line ${isScanning ? 'active' : ''}`}></div>
                </div>
                <div className="scan-hint">
                  将二维码放入框内自动扫描
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="upload-area">
            <div className="upload-icon"><i className="bi bi-images"></i></div>
            <div className="upload-title">选择二维码图片</div>
            <div className="upload-subtitle">支持 JPG、PNG 格式</div>
            <ImageUploader
              value={[]}
              onChange={() => {}}
              upload={handleImageUpload}
              maxCount={1}
            >
              <Button className="upload-btn">选择图片</Button>
            </ImageUploader>
          </div>
        )}
      </div>

      {/* 底部切换栏 */}
      <div className="scanner-tabs">
        <div 
          className={`tab-item ${mode === 'camera' ? 'active' : ''}`}
          onClick={() => !scanComplete && setMode('camera')}
        >
          <div className="tab-icon"><i className="bi bi-qr-code-scan"></i></div>
          <div className="tab-text">扫一扫</div>
        </div>
        <div 
          className={`tab-item ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => !scanComplete && setMode('upload')}
        >
          <div className="tab-icon"><i className="bi bi-image"></i></div>
          <div className="tab-text">相册</div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;