import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

// 导入Mock数据
import { getRandomFish, getFishById } from '../../mock/fishProducts';
import { getTraceByFishId } from '../../mock/traceData';
import { addTraceHistory } from '../../mock/userData';

// 导入AI分析组件
import AIAnalysis from '../../components/AIAnalysis';

// 导入图片
import qrCodeImage from '../../assets/img/qrCodeMock/qrcode.jpg';

const ScannerResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [traceChain, setTraceChain] = useState([]);
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
      return;
    }

    // 模拟扫码加载
    setTimeout(() => {
      // 检查是否有从商品详情页传来的数据
      const savedProduct = localStorage.getItem('currentScanProduct');
      let fishData;
      
      if (savedProduct) {
        fishData = JSON.parse(savedProduct);
        localStorage.removeItem('currentScanProduct');
      } else {
        // 随机获取一条鱼
        fishData = getRandomFish();
      }
      
      setProduct(fishData);
      
      // 获取溯源链
      const trace = getTraceByFishId(fishData.id);
      setTraceChain(trace);
      
      // 添加到溯源历史
      addTraceHistory(fishData);
      
      setLoading(false);

      // 如果是从首页AI入口打开，则在数据加载完成后自动唤起AI助手
      if (location.state?.openAI) {
        setShowAIAnalysis(true);
      }
    }, 800);
  }, [navigate, location]);

  // 返回
  const handleBack = () => {
    navigate(-1);
  };

  // 重新扫描
  const handleRescan = () => {
    navigate('/qrcode-scanner');
  };

  // 点击节点
  const handleNodeClick = (nodeId) => {
    setExpandedNodeId(expandedNodeId === nodeId ? null : nodeId);
  };

  // 复制产品编码
  const copyProductCode = () => {
    if (product?.id) {
      navigator.clipboard.writeText(product.id)
        .then(() => Toast.show({ content: '已复制产品编码', icon: 'success' }))
        .catch(() => Toast.show({ content: '复制失败', icon: 'fail' }));
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="scanner-result-page">
        <NavBar onBack={handleBack}>扫码结果</NavBar>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>正在解析溯源信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-result-page">
      {/* 导航栏 */}
      <NavBar onBack={handleBack} className="result-nav">
        扫码结果
      </NavBar>

      {/* 产品信息卡片 */}
      <div className="product-card">
        <div className="product-header">
          <img src={product?.image} alt={product?.name} className="product-image" />
          <div className="product-info">
            <h2 className="product-name">{product?.name}</h2>
            <p className="product-subtitle">{product?.subtitle}</p>
            <div className="product-status">
              <span className="status-badge success">✓ 检验合格</span>
            </div>
          </div>
        </div>

        <div className="product-details">
          <div className="detail-row">
            <span className="label">产品编码</span>
            <span className="value clickable" onClick={copyProductCode}>
              {product?.id} <span className="copy-icon">📋</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="label">产地</span>
            <span className="value">{product?.origin}</span>
          </div>
          <div className="detail-row">
            <span className="label">生产商</span>
            <span className="value">{product?.producer}</span>
          </div>
          <div className="detail-row">
            <span className="label">生产日期</span>
            <span className="value">{product?.productionDate}</span>
          </div>
        </div>

        {/* 二维码 */}
        <div className="qrcode-section">
          <img src={qrCodeImage} alt="溯源二维码" className="qrcode-image" />
          <span className="qrcode-text">产品溯源二维码</span>
        </div>
      </div>

      {/* 溯源链条 */}
      <div className="trace-section">
        <div className="section-header">
          <span className="section-icon">🔗</span>
          <h3 className="section-title">溯源链条</h3>
          <span className="node-count">{traceChain.length}个节点</span>
        </div>

        <div className="trace-timeline">
          {traceChain.map((node, index) => (
            <div
              key={node.id}
              className={`trace-node ${expandedNodeId === node.id ? 'expanded' : ''}`}
              onClick={() => handleNodeClick(node.id)}
            >
              {/* 时间线 */}
              <div className="timeline-line">
                <div 
                  className="timeline-dot" 
                  style={{ backgroundColor: node.color }}
                >
                  {node.icon}
                </div>
                {index < traceChain.length - 1 && <div className="timeline-connector"></div>}
              </div>

              {/* 节点内容 */}
              <div className="node-content">
                <div className="node-header">
                  <h4 className="node-name">{node.name}</h4>
                  <span className={`node-status ${node.statusType}`}>
                    {node.status}
                  </span>
                </div>
                
                <div className="node-meta">
                  <span className="meta-item">📍 {node.address}</span>
                  <span className="meta-item">🕐 {node.time}</span>
                </div>

                {/* 展开详情 */}
                {expandedNodeId === node.id && node.details && (
                  <div className="node-details">
                    {Object.entries(node.details).map(([key, value]) => (
                      <div key={key} className="detail-item">
                        <span className="detail-key">{key}</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作 */}
      <div className="bottom-actions">
        <Button className="ai-btn" onClick={() => setShowAIAnalysis(true)}>
          🤖 AI智能分析
        </Button>
        <Button className="rescan-btn" onClick={handleRescan}>
          📷 重新扫描
        </Button>
      </div>

      {/* AI分析弹窗 */}
      <AIAnalysis
        visible={showAIAnalysis}
        onClose={() => setShowAIAnalysis(false)}
        productData={product}
        traceData={traceChain}
      />
    </div>
  );
};

export default ScannerResult;