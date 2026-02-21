import React, { useState, useEffect } from 'react';
import { Popup, Button, Toast } from 'antd-mobile';
import { QRCodeSVG } from 'qrcode.react';
import fishLogo from '../../assets/img/fish.png'; // 导入图片资源
import './index.scss';

const QRCodeModal = ({ visible, onClose, product }) => {
  const [qrValue, setQrValue] = useState('');
  const [timestamp, setTimestamp] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(20);

  // 初始化和定时刷新二维码
  useEffect(() => {
    if (!visible || !product) return;

    // 立即生成一次
    updateQRCode();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          updateQRCode();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, product]);

  const updateQRCode = () => {
    if (!product) return;
    const ts = Date.now();
    setTimestamp(ts);
    const data = JSON.stringify({
      type: 'trace',
      productId: product.id,
      productName: product.name,
      timestamp: ts,
      signature: Math.random().toString(36).substring(7) // 模拟签名
    });
    setQrValue(data);
  };

  // 下载二维码
  const handleDownload = async () => {
    const svg = document.querySelector('.qrcode-wrapper svg');
    if (!svg) {
      Toast.show({ content: '未找到二维码', icon: 'fail' });
      return;
    }

    Toast.show({
      icon: 'loading',
      content: '生成中...',
      duration: 0,
    });

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const qrSize = 260;
      const logoSize = 50;
      
      // 设置 Canvas 尺寸
      canvas.width = qrSize;
      canvas.height = qrSize;
      
      // 填充白色背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 克隆 SVG 并移除 image 元素（因为会有跨域问题）
      const svgClone = svg.cloneNode(true);
      const imageElements = svgClone.querySelectorAll('image');
      imageElements.forEach(img => img.remove());
      
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // 加载二维码 SVG
      const qrImage = new Image();
      
      const loadTimeout = setTimeout(() => {
        Toast.clear();
        Toast.show({ content: '图片加载超时', icon: 'fail' });
        URL.revokeObjectURL(svgUrl);
      }, 5000);

      qrImage.onload = () => {
        clearTimeout(loadTimeout);
        
        // 绘制二维码
        ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
        
        // 加载并绘制 Logo
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        
        logo.onload = () => {
          // 在二维码中心绘制白色背景（给 logo 留出空间）
          const logoX = (qrSize - logoSize) / 2;
          const logoY = (qrSize - logoSize) / 2;
          const padding = 4;
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2);
          
          // 绘制 Logo
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
          
          // 转换为 PNG 并下载
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `trace-qr-${product?.id || 'code'}-${timestamp}.png`;
              link.href = URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              Toast.clear();
              Toast.show({ content: '二维码已保存', icon: 'success' });
            } else {
              Toast.clear();
              Toast.show({ content: '生成失败', icon: 'fail' });
            }
            URL.revokeObjectURL(svgUrl);
          });
        };
        
        logo.onerror = () => {
          // 如果 Logo 加载失败，仍然保存没有 Logo 的二维码
          console.warn('Logo 加载失败，保存无 Logo 二维码');
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `trace-qr-${product?.id || 'code'}-${timestamp}.png`;
              link.href = URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              Toast.clear();
              Toast.show({ content: '二维码已保存（无Logo）', icon: 'success' });
            }
            URL.revokeObjectURL(svgUrl);
          });
        };
        
        logo.src = fishLogo;
      };

      qrImage.onerror = () => {
        clearTimeout(loadTimeout);
        URL.revokeObjectURL(svgUrl);
        Toast.clear();
        Toast.show({ content: '二维码加载失败', icon: 'fail' });
      };

      qrImage.src = svgUrl;
    } catch (err) {
      console.error('下载错误:', err);
      Toast.clear();
      Toast.show({ content: '保存失败，请重试', icon: 'fail' });
    }
  };

  if (!product) return null;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        minHeight: '65vh',
        background: '#fff'
      }}
    >
      <div className="qrcode-modal-container">
        {/* 顶部装饰条 */}
        <div className="modal-handle-bar"></div>

        {/* 标题栏 */}
        <div className="modal-header">
          <div className="header-left">
            <h2 className="title">专属溯源码</h2>
            <span className="subtitle">动态加密 · 实时更新</span>
          </div>
          <div className="close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </div>
        </div>

        {/* 二维码卡片 */}
        <div className="qr-card">
          <div className="product-info">
            <h3 className="name">{product.name}</h3>
            <p className="id-code">ID: {product.id}</p>
          </div>

          <div className="qrcode-wrapper">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
            
            {qrValue && (
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="H"
                imageSettings={{
                  src: fishLogo,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            )}
            
            <div className="scan-line"></div>
          </div>

          <div className="refresh-status">
            <i className="bi bi-shield-check icon"></i>
            <span>安全码 {timeLeft}s 后自动更新</span>
          </div>
        </div>

        {/* 底部信息与操作 */}
        <div className="modal-footer">
          <div className="security-features">
            <div className="feature-item">
              <i className="bi bi-link-45deg"></i>
              <span>区块链存证</span>
            </div>
            <div className="feature-item">
              <i className="bi bi-fingerprint"></i>
              <span>唯一数字指纹</span>
            </div>
          </div>
          
          <Button 
            className="save-btn" 
            onClick={handleDownload}
            block
          >
            <i className="bi bi-download"></i>
            保存到相册
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default QRCodeModal;