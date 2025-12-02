import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Button, Card, Badge, Toast } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

// 导入本地图片资源
import eelProductImage from '../../assets/img/shopping/fish1.jpg';
import qrCodeImage from '../../assets/img/qrCodeMock/qrcode.jpg';
import videoPlaceholder from '../../assets/img/mapMock/map.png';

const ScannerResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 检查用户授权状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/authorization');
    }
  }, [navigate]);

  // 模拟商品数据
  const productInfo = {
    id: '98613498761225',
    name: '阳春镇特产·鲜活鳗鱼',
    image: eelProductImage,
    status: '合格',
    origin: '四川省宜宾市江安县阳春镇',
    productionDate: '2025-01-23',

    // 溯源链条数据
    traceChain: [
      {
        id: 1,
        name: '永起超市(市中广场购物店)',
        address: '西安市碑林区南关正街50号中广场购物街B1',
        date: '2025-01-24 06:42',
        status: '检查合格',
        isActive: true,
        type: 'retail',
        details: {
          temperature: '4°C',
          humidity: '65%',
          inspection: '质检通过',
          inspector: '张经理'
        }
      },
      {
        id: 2,
        name: '西安冷链运输有限公司',
        address: '陕西省西安市碑林区',
        date: '2025-01-23 10:02 - 2025-01-23 23:31',
        status: '检查合格',
        isActive: true,
        type: 'transport',
        details: {
          vehicle: '陕A12345',
          driver: '王师傅',
          temperature: '-18°C',
          duration: '13小时29分钟'
        }
      },
      {
        id: 3,
        name: '江安县冷链加工基地',
        address: '四川省江安县江安镇东大街6号',
        date: '2025-01-23 08:44',
        status: '检查合格',
        isActive: true,
        type: 'processing',
        details: {
          process: '清洗、分割、包装',
          temperature: '5°C',
          quality: '优等品',
          inspector: '李质检员'
        }
      },
      {
        id: 4,
        name: '阳春镇上湖养殖基地',
        address: '四川省江安县阳春镇',
        date: '2025-01-23 06:32',
        status: '检查合格',
        isActive: true,
        type: 'farming',
        details: {
          waterQuality: '优质',
          feed: '天然饲料',
          environment: '生态养殖',
          inspector: '陈技术员'
        }
      },
      {
        id: 5,
        name: '四川省江安县七彩湖特种水产养殖公司',
        address: '四川省江安县阳春镇彩虹路27号',
        date: '2024-10-21 06:02',
        status: '监管部门: 已通过',
        isActive: true,
        type: 'company',
        details: {
          license: 'SC123456789',
          scale: '大型养殖场',
          certification: '有机认证',
          inspector: '省农业厅'
        }
      }
    ]
  };

  // 切换显示模式（默认显示溯源信息，切换到视频监控）
  const [showVideo, setShowVideo] = useState(false);
  // 当前选中的节点ID
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  // 展开的节点详情
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  // 视频播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 重新扫描
  const handleRescan = () => {
    navigate('/qrcode-scanner');
  };

  // 切换到视频监控模式
  const toggleVideoMode = () => {
    setShowVideo(!showVideo);
    setIsPlaying(false);
  };

  // 切换视频播放状态
  const toggleVideoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      Toast.show('视频已暂停');
    } else {
      setIsPlaying(true);
      Toast.show('视频播放中');
    }
  };

  // 复制商品编码
  const copyProductCode = () => {
    navigator.clipboard.writeText(productInfo.id)
      .then(() => {
        Toast.show('商品编码已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
        Toast.show('复制失败，请重试');
      });
  };

  // 处理节点点击事件
  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);

    // 如果点击的是已展开的节点，则收起
    if (expandedNodeId === node.id) {
      setExpandedNodeId(null);
    } else {
      setExpandedNodeId(node.id);
    }
  };

  // 跳转到节点专属溯源信息页面
  const navigateToNodeDetail = (node) => {
    // 准备节点详情数据
    const nodeDetail = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      details: node.details,
      timestamp: new Date().toISOString()
    };

    // 存储节点详情数据
    localStorage.setItem('currentNodeDetail', JSON.stringify(nodeDetail));

    // 跳转到节点详情页面，传递完整的节点数据
    navigate('/node-detail', {
      state: {
        node: {
          nodeId: node.id,
          nodeType: node.type,
          nodeName: node.name
        }
      }
    });
  };

  // 获取节点类型图标
  const getNodeIcon = (type) => {
    const icons = {
      retail: '🏪',
      transport: '🚚',
      processing: '🏭',
      farming: '🐟',
      company: '🏢'
    };
    return icons[type] || '📍';
  };

  // 获取节点类型颜色
  const getNodeColor = (type) => {
    const colors = {
      retail: '#ff6b6b',
      transport: '#4ecdc4',
      processing: '#45b7d1',
      farming: '#96ceb4',
      company: '#feca57'
    };
    return colors[type] || '#007aff';
  };

  return (
    <div className="scanner-result-container">
      {/* 顶部导航栏 */}
      <NavBar className="result-nav-bar" mode="light" onBack={handleBack} backArrow={false}>
        <span className="nav-title">扫码结果</span>
      </NavBar>

      <div className="result-content">
        {showVideo ? (
          // 视频监控模式
          <div className="video-monitoring">
            <div className="video-header">
              <h3>鱼池-状态</h3>
              <Button size="small" onClick={toggleVideoMode} className="switch-mode-btn">
                返回溯源
              </Button>
            </div>

            <div className="video-container">
              <img
                src={videoPlaceholder}
                alt="鱼池监控"
                className="video-placeholder"
              />
              <div
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={toggleVideoPlay}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </div>
            </div>

            <div className="water-quality-info">
              <div className="water-quality-item">
                <span className="info-label">温度</span>
                <span className="info-value">18.2°C</span>
              </div>
              <div className="water-quality-item">
                <span className="info-label">湿度</span>
                <span className="info-value">71%</span>
              </div>
              <div className="water-quality-item">
                <span className="info-label">溶氧</span>
                <span className="info-value">10.9mg/L</span>
              </div>
              <div className="water-quality-item">
                <span className="info-label">水温</span>
                <span className="info-value">17.5°C</span>
              </div>
            </div>

            <div className="date-display">2025年01月23日</div>
          </div>
        ) : (
          // 溯源信息模式
          <>
            {/* 产品信息卡片 */}
            <Card className="product-card">
              <div className="product-header">
                <div className="product-image">
                  <img src={productInfo.image} alt={productInfo.name} />
                </div>

                <div className="product-info">
                  <h2 className="product-name">{productInfo.name}</h2>

                  <div className="product-details">
                    <div className="detail-item">
                      <div className="detail-label">产品编码：
                        <text className="detail-value" onClick={copyProductCode}>
                          {productInfo.id}
                        </text>
                      </div>

                    </div>

                    <div className="detail-item">
                      <div className="detail-label">检验结果：
                        <Badge
                          text={productInfo.status}
                          color={productInfo.status === '合格' ? 'success' : 'error'}
                        >
                          合格
                        </Badge>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">类别：
                        <span className="detail-value">食用农产品</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">产地：
                        <span className="detail-value">{productInfo.origin}</span>
                      </div>

                    </div>

                    <div className="detail-item">
                      <div className="detail-label">捕捞时间：
                        <span className="detail-value">{productInfo.productionDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 二维码区域 */}
              <div className="qrcode-section">
                <div className="qrcode-container">
                  <img
                    src={qrCodeImage}
                    alt="产品二维码"
                    className="product-qrcode"
                  />
                </div>
                <span className="qrcode-label">扫描二维码查看详细信息</span>
              </div>
            </Card>

            {/* 溯源链条 */}
            <Card className="trace-chain-card">
              <h3 className="card-title">
                <span className="title-icon">🔗</span>
                溯源链条
                <span className="node-count">{productInfo.traceChain.length}个节点</span>
              </h3>

              <div className="trace-chain">
                {productInfo.traceChain.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  const isExpanded = expandedNodeId === node.id;
                  const nodeColor = getNodeColor(node.type);

                  return (
                    <div
                      key={node.id}
                      className={`trace-node ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => handleNodeClick(node)}
                    >
                      <div className="node-content">
                        {/* 节点图标 */}
                        <div className="node-icon" style={{ backgroundColor: nodeColor }}>
                          {getNodeIcon(node.type)}
                        </div>

                        <div className="node-main">
                          <div className="node-header">
                            <h4 className="node-name">{node.name}</h4>
                            <Badge
                              text={node.status}
                              color={node.status.includes('合格') || node.status.includes('通过') ? 'success' : 'error'}
                              className="node-status"
                            />
                          </div>

                          <div className="node-info">
                            <div className="info-item">
                              <span className="info-label">📍</span>
                              <span className="info-value">{node.address}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">🕐</span>
                              <span className="info-value">{node.date}</span>
                            </div>
                          </div>

                          {/* 展开的详情信息 */}
                          {isExpanded && (
                            <div className="node-details">
                              <div className="details-header">
                                <span className="details-title">详细信息</span>
                                <Button
                                  size="mini"
                                  className="detail-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToNodeDetail(node);
                                  }}
                                >
                                  查看详情
                                </Button>
                              </div>
                              <div className="details-content">
                                {Object.entries(node.details).map(([key, value]) => (
                                  <div key={key} className="detail-item">
                                    <span className="detail-key">{key}：</span>
                                    <span className="detail-value">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 连接线 */}
                      {index < productInfo.traceChain.length - 1 && (
                        <div className="node-connector" style={{ backgroundColor: nodeColor }}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 底部操作按钮 */}
            <div className="action-buttons">
              <Button className="video-monitor-btn" onClick={toggleVideoMode}>
                查看实时监控
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScannerResult;