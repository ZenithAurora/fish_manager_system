import React from 'react';
import './TraceCard.scss';

// 模拟SVG波形图组件
const WaveChart = ({ color = '#10b981' }) => (
  <svg width="100%" height="40" viewBox="0 0 300 40" className="wave-chart">
    <path 
      d="M0,20 Q30,5 60,20 T120,20 T180,20 T240,20 T300,20" 
      fill="none" 
      stroke={color} 
      strokeWidth="2"
      className="wave-path"
    />
    <path 
      d="M0,20 Q30,35 60,20 T120,20 T180,20 T240,20 T300,20" 
      fill="none" 
      stroke={color} 
      strokeWidth="1"
      strokeOpacity="0.3"
      className="wave-path-2"
    />
  </svg>
);

const TraceCard = ({ node, index, total }) => {
  const isFirst = index === 0;
  
  // 根据节点类型配置样式和图标
  const getNodeConfig = (type) => {
    switch(type) {
      case 'farming': return { icon: <i className="bi bi-globe"></i>, label: '生态养殖', color: '#10b981' };
      case 'processing': return { icon: <i className="bi bi-box-seam"></i>, label: '精细加工', color: '#6366f1' };
      case 'inspection': return { icon: <i className="bi bi-shield-check"></i>, label: '权威质检', color: '#8b5cf6' };
      case 'transport': return { icon: <i className="bi bi-truck"></i>, label: '冷链物流', color: '#f59e0b' };
      case 'retail': return { icon: <i className="bi bi-shop"></i>, label: '终端销售', color: '#ec4899' };
      default: return { icon: <i className="bi bi-geo-alt"></i>, label: '溯源节点', color: '#64748b' };
    }
  };

  const config = getNodeConfig(node.type || 'farming');

  return (
    <div className={`trace-card ${isFirst ? 'highlight' : ''}`}>
      {/* 侧边时间轴指示器 */}
      <div className="timeline-indicator">
        <div className="dot" style={{ background: config.color }}></div>
        {index !== total - 1 && <div className="line"></div>}
      </div>

      <div className="card-content">
        {/* 头部：节点类型与时间 */}
        <div className="card-header">
          <div className="type-badge" style={{ background: `${config.color}15`, color: config.color }}>
            <span className="icon">{config.icon}</span>
            <span className="label">{config.label}</span>
          </div>
          <span className="time">{node.time}</span>
        </div>

        {/* 核心信息：名称与地址 */}
        <div className="card-body">
          <h3 className="node-name">{node.name}</h3>
          <p className="node-address">📍 {node.address}</p>
        </div>

        {/* 数据面板：模拟传感器数据 */}
        {node.details && (
          <div className="data-panel">
            {Object.entries(node.details).slice(0, 4).map(([key, value], idx) => (
              <div key={key} className="data-item">
                <span className="data-label">{key}</span>
                <span className="data-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* 养殖/运输环节展示波形图 */}
        {(node.type === 'farming' || node.type === 'transport') && (
          <div className="chart-area">
            <div className="chart-label">
              <span>{node.type === 'farming' ? '实时水质监测' : '冷链温控曲线'}</span>
              <span className="status-ok">● 正常</span>
            </div>
            <WaveChart color={config.color} />
          </div>
        )}

        {/* 底部：区块链哈希 */}
        <div className="card-footer">
          <div className="hash-code">
            <span className="hash-label">BLOCK_HASH:</span>
            <span className="hash-value">0x{Math.random().toString(16).slice(2, 10)}...</span>
          </div>
          <div className="verifier">
            <span className="verified-badge">已存证</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceCard;