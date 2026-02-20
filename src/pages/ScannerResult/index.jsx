import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

// 导入Mock数据
import { getRandomFish, getFishById } from '../../mock/fishProducts';
import { getTraceByFishId } from '../../mock/traceData';
import { addTraceHistory } from '../../mock/userData';

// 导入组件
import TraceLoader from '../../components/TraceLoader';
import TraceCard from './components/TraceCard';
import AIAnalysis from '../../components/AIAnalysis';
import QRCodeModal from '../../components/QRCodeModal';

const ScannerResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [traceChain, setTraceChain] = useState([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  
  // 实时动态数据
  const [liveMetrics, setLiveMetrics] = useState({
    safetyIndex: 99.8,
    carbon: 0.24,
    blockHeight: 84920,
    temperature: 3.6
  });

  // 模拟实时数据波动
  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setLiveMetrics(prev => ({
        safetyIndex: Math.min(100, Math.max(98, prev.safetyIndex + (Math.random() - 0.5) * 0.1)),
        carbon: Math.max(0.1, prev.carbon + (Math.random() - 0.5) * 0.01),
        blockHeight: prev.blockHeight + (Math.random() > 0.8 ? 1 : 0),
        temperature: Math.min(5, Math.max(2, prev.temperature + (Math.random() - 0.5) * 0.2))
      }));
    }, 2000);
    
    return () => clearInterval(timer);
  }, [loading]);

  // 初始化数据
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
      return;
    }

    const prepareData = () => {
      const savedProduct = localStorage.getItem('currentScanProduct');
      const locationState = location.state;
      let fishData;
      
      // 优先从扫码结果获取productId
      if (locationState?.productId) {
        fishData = getFishById(locationState.productId);
        if (!fishData) {
          fishData = getRandomFish();
        }
      } else if (savedProduct) {
        fishData = JSON.parse(savedProduct);
        localStorage.removeItem('currentScanProduct');
      } else {
        fishData = getRandomFish();
      }
      
      setProduct(fishData);
      const trace = getTraceByFishId(fishData.id);
      setTraceChain(trace);
      addTraceHistory(fishData);
      // 如果是从首页AI入口打开，则在数据加载完成后自动唤起AI助手
      if (location.state?.openAI) {
        setShowAIAnalysis(true);
      }
    };

    // 稍微延迟加载，模拟真实感
    const timer = setTimeout(prepareData, 800);
    return () => clearTimeout(timer);
  }, [navigate, location]);

  const handleTraceComplete = () => {
    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 模拟区块链验真
  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      Toast.show({
        content: '区块链校验通过！数据真实有效',
        icon: 'success',
        duration: 2000
      });
    }, 2000);
  };

  const handleRescan = () => {
    navigate('/qrcode-scanner');
  };

  return (
    <div className="scanner-result-page">
      <TraceLoader visible={loading} onComplete={handleTraceComplete} />

      {/* 沉浸式导航栏 */}
      <NavBar 
        onBack={handleBack} 
        className="result-nav"
      >
        溯源档案
      </NavBar>

      {!loading && product && (
        <div className="content-container">
          {/* 1. 顶部：全息产品档案卡 (左右分栏布局) */}
          <div className="holographic-card">
            <div className="card-bg" style={{ backgroundImage: `url(${product.image})` }}></div>
            
            <div className="card-content-row">
              {/* 左侧：视觉中心 */}
              <div className="visual-column">
                <div className="product-image-box">
                  <img src={product.image} alt={product.name} className="main-img" />
                  <div className="scan-overlay"></div>
                </div>
                {/* 溯源状态指示器 */}
                <div className="trace-status-bar status-success">
                  <span className="status-icon"><i className="bi bi-shield-check"></i></span>
                  <span className="status-text">溯源已通过</span>
                </div>
                
                {/* 查看专属溯源码按钮 */}
                <div className="view-qr-btn" onClick={() => setShowQRCode(true)}>
                  <i className="bi bi-qr-code"></i>
                  <span>查看专属溯源码</span>
                </div>
              </div>

              {/* 右侧：数据中心 */}
              <div className="info-column">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-id">ID: {product.id}</div>
                
                {/* 实时动态数据面板 */}
                <div className="live-metrics-panel">
                  <div className="metric-row">
                    <span className="label">安全指数</span>
                    <span className="value highlight">{liveMetrics.safetyIndex.toFixed(1)}%</span>
                  </div>
                  <div className="metric-bar">
                    <div className="bar-fill" style={{ width: `${liveMetrics.safetyIndex}%` }}></div>
                  </div>
                  
                  <div className="mini-metrics-grid">
                    <div className="mini-metric">
                      <span className="label">碳足迹</span>
                      <span className="value">{liveMetrics.carbon.toFixed(2)}kg</span>
                    </div>
                    <div className="mini-metric">
                      <span className="label">实时温控</span>
                      <span className="value">{liveMetrics.temperature.toFixed(1)}°C</span>
                    </div>
                  </div>
                  
                   <div className="block-info">
                    <span className="label">Block Height</span>
                    <span className="value animate-pulse">#{liveMetrics.blockHeight}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部装饰条 */}
            <div className="card-footer-decoration">
              <div className="tech-lines">
                <span></span><span></span><span></span>
              </div>
              <span className="system-ver">UNAGI TRACE V3.0</span>
            </div>
          </div>

          {/* 2. 区块链验证模块 */}
          <div className="verify-section">
            <div className="verify-header">
              <span className="icon"><i className="bi bi-shield-lock"></i></span>
              <span className="title">区块链存证校验</span>
            </div>
            <div className="verify-body">
              <div className="hash-box">
                <span className="label">ROOT HASH:</span>
                <span className="code">0x7f83b1...a9c2</span>
              </div>
              <Button 
                className={`verify-btn ${verified ? 'verified' : ''}`} 
                loading={verifying}
                onClick={handleVerify}
                disabled={verified}
              >
                {verified ? '✓ 校验通过' : '点击进行链上验真'}
              </Button>
            </div>
          </div>

          {/* 3. 沉浸式溯源时间流 */}
          <div className="timeline-section">
            <div className="section-header">
              <h2 className="section-title">全链路溯源记录</h2>
              <span className="node-count">共 {traceChain.length} 个节点</span>
            </div>
            
            <div className="timeline-flow">
              {traceChain.map((node, index) => (
                <TraceCard 
                  key={node.id} 
                  node={node} 
                  index={index} 
                  total={traceChain.length} 
                />
              ))}
            </div>
          </div>

          {/* 4. 底部悬浮操作栏 */}
          <div className="floating-actions">
            <div className="action-grid">
              <Button className="action-btn ai" onClick={() => setShowAIAnalysis(true)}>
                <span className="icon"><i className="bi bi-bar-chart-line"></i></span>
                <span className="text">AI 深度质检报告</span>
              </Button>
              <Button className="action-btn scan" onClick={handleRescan}>
                <span className="icon"><i className="bi bi-qr-code-scan"></i></span>
              </Button>
            </div>
          </div>

          <AIAnalysis
            visible={showAIAnalysis}
            onClose={() => setShowAIAnalysis(false)}
            productData={product}
            traceData={traceChain}
          />

          <QRCodeModal
            visible={showQRCode}
            onClose={() => setShowQRCode(false)}
            product={product}
          />
        </div>
      )}
    </div>
  );
};

export default ScannerResult;