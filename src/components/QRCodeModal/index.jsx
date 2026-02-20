import React, { useState, useEffect } from 'react';
import { Popup, Button, Toast } from 'antd-mobile';
import { QRCodeSVG } from 'qrcode.react';
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
    if (!svg) return;

    Toast.show({
      icon: 'loading',
      content: '生成中...',
      duration: 0,
    });

    try {
      // 1. 将 Logo 转为 Base64，解决 Canvas 绘制 SVG 外部图片丢失问题
      const logoUrl = "/fish.png";
      let logoBase64 = "";
      try {
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Logo load failed", e);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // 2. 克隆 SVG 并替换 image href 为 Base64
      const clonedSvg = svg.cloneNode(true);
      if (logoBase64) {
        const imageEl = clonedSvg.querySelector('image');
        if (imageEl) {
          // 兼容不同浏览器的 SVG 图片引用属性
          imageEl.setAttribute('href', logoBase64);
          imageEl.setAttribute('xlink:href', logoBase64);
        }
      }

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // 增加一点白色边距，让二维码不贴边
        const margin = 20;
        canvas.width = 260; // 固定宽度，保证清晰度
        canvas.height = 260;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 居中绘制
        const x = (canvas.width - img.width) / 2;
        const y = (canvas.height - img.height) / 2;
        ctx.drawImage(img, x, y);
        
        canvas.toBlob((blob) => {
          const link = document.createElement('a');
          link.download = `trace-qr-${product?.id || 'code'}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(url);
          Toast.clear();
          Toast.show({ content: '二维码已保存', icon: 'success' });
        });
      };

      img.src = url;
    } catch (err) {
      console.error(err);
      Toast.clear();
      Toast.show({ content: '保存失败', icon: 'fail' });
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
                  src: "/fish.png",
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