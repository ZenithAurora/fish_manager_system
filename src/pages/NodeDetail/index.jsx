import React, { useState, useEffect } from 'react';
import { NavBar, Card, List, Badge, Button } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

// 模拟真实节点数据生成器
const generateNodeData = (nodeType, nodeId) => {
  const baseData = {
    // 基础信息
    id: nodeId || `NODE${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    name: '',
    type: nodeType || 'unknown',
    status: '正常',
    createTime: new Date().toISOString(),

    // 负责人信息
    responsiblePerson: {
      name: '',
      phone: '',
      department: '',
      position: ''
    },

    // 关键属性参数
    parameters: {},

    // 扩展信息
    extendedInfo: {},

    // 操作记录
    operationRecords: []
  };

  // 根据节点类型生成不同数据
  const typeConfigs = {
    retail: {
      name: '永起超市(市中广场购物店)',
      responsiblePerson: {
        name: '张经理',
        phone: '138****5678',
        department: '销售部',
        position: '门店经理'
      },
      parameters: {
        temperature: '4°C',
        humidity: '65%',
        storageCapacity: '500kg',
        inspectionRate: '98.5%',
        qualityScore: '95'
      },
      extendedInfo: {
        address: '西安市碑林区南关正街50号中广场购物街B1',
        businessHours: '08:00-22:00',
        certification: 'ISO9001质量管理体系认证',
        inspectionDate: '2025-01-24'
      }
    },
    transport: {
      name: '西安冷链运输有限公司',
      responsiblePerson: {
        name: '王师傅',
        phone: '139****1234',
        department: '运输部',
        position: '运输司机'
      },
      parameters: {
        vehicle: '陕A12345',
        temperature: '-18°C',
        duration: '13小时29分钟',
        mileage: '658km',
        fuelConsumption: '85L'
      },
      extendedInfo: {
        route: '四川省江安县 → 陕西省西安市',
        startTime: '2025-01-23 10:02',
        endTime: '2025-01-23 23:31',
        transportType: '冷链运输'
      }
    },
    processing: {
      name: '江安县冷链加工基地',
      responsiblePerson: {
        name: '李质检员',
        phone: '137****9876',
        department: '质检部',
        position: '质检主管'
      },
      parameters: {
        process: '清洗、分割、包装',
        temperature: '5°C',
        quality: '优等品',
        processingTime: '2小时15分钟',
        yieldRate: '92.3%'
      },
      extendedInfo: {
        address: '四川省江安县江安镇东大街6号',
        scale: '中型加工厂',
        equipment: '自动化生产线',
        certification: 'HACCP食品安全认证'
      }
    },
    farming: {
      name: '阳春镇上湖养殖基地',
      responsiblePerson: {
        name: '陈技术员',
        phone: '136****3456',
        department: '技术部',
        position: '养殖技术员'
      },
      parameters: {
        waterQuality: '优质',
        feed: '天然饲料',
        environment: '生态养殖',
        growthCycle: '180天',
        survivalRate: '88.5%'
      },
      extendedInfo: {
        address: '四川省江安县阳春镇',
        area: '150亩',
        waterSource: '山泉水',
        certification: '有机养殖认证'
      }
    },
    company: {
      name: '四川省江安县七彩湖特种水产养殖公司',
      responsiblePerson: {
        name: '刘总',
        phone: '135****7890',
        department: '管理层',
        position: '总经理'
      },
      parameters: {
        license: 'SC123456789',
        scale: '大型养殖场',
        certification: '有机认证',
        annualOutput: '500吨',
        marketShare: '15%'
      },
      extendedInfo: {
        address: '四川省江安县阳春镇彩虹路27号',
        established: '2015年',
        employees: '120人',
        certification: '省级龙头企业'
      }
    }
  };

  const config = typeConfigs[nodeType] || {
    name: '未知节点',
    responsiblePerson: { name: '未知负责人', phone: '', department: '', position: '' },
    parameters: {},
    extendedInfo: {}
  };

  return {
    ...baseData,
    ...config,
    operationRecords: [
      {
        id: 1,
        action: '节点创建',
        operator: config.responsiblePerson.name,
        time: baseData.createTime,
        details: '节点信息初始化完成'
      },
      {
        id: 2,
        action: '数据更新',
        operator: config.responsiblePerson.name,
        time: new Date(Date.now() - 3600000).toISOString(),
        details: '更新关键参数信息'
      },
      {
        id: 3,
        action: '质量检查',
        operator: '质检系统',
        time: new Date(Date.now() - 7200000).toISOString(),
        details: '自动质检通过'
      }
    ]
  };
};

const NodeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nodeData, setNodeData] = useState(null);

  useEffect(() => {
    // 从路由参数或localStorage获取节点数据
    const routeNodeData = location.state?.node;
    if (routeNodeData) {
      // 根据路由参数生成真实感数据
      const generatedData = generateNodeData(routeNodeData.nodeType, routeNodeData.nodeId);
      setNodeData(generatedData);
    } else {
      // 从localStorage获取
      const storedNodeData = localStorage.getItem('currentNodeDetail');
      if (storedNodeData) {
        const parsedData = JSON.parse(storedNodeData);
        const generatedData = generateNodeData(parsedData.nodeType, parsedData.nodeId);
        setNodeData(generatedData);
      }
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!nodeData) {
    return (
      <div className="node-detail-container">
        <NavBar onBack={handleBack}>节点详情</NavBar>
        <div className="loading-content">
          <div className="loading-text">加载中...</div>
        </div>
      </div>
    );
  }

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

  // 格式化时间显示
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="node-detail-container">
      <NavBar onBack={handleBack} className="detail-nav-bar">
        <span className="nav-title">节点详情</span>
      </NavBar>

      <div className="detail-content">
        {/* 节点基本信息卡片 */}
        <Card className="node-info-card">
          <div className="node-header">
            <div className="node-icon" style={{ backgroundColor: getNodeColor(nodeData.type) }}>
              {getNodeIcon(nodeData.type)}
            </div>
            <div className="node-title">
              <h3 className="node-name">{nodeData.name}</h3>
              <div className="node-meta">
                <Badge
                  text={nodeData.status}
                  color={nodeData.status === '正常' ? 'success' : 'warning'}
                  className="status-badge"
                />
                <span className="node-id">ID: {nodeData.id}</span>
              </div>
            </div>
          </div>

          <div className="node-summary">
            <div className="summary-item">
              <span className="summary-label">创建时间</span>
              <span className="summary-value">{formatTime(nodeData.createTime)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">节点类型</span>
              <span className="summary-value">{nodeData.type}</span>
            </div>
          </div>
        </Card>

        {/* 负责人信息卡片 */}
        <Card className="responsible-card">
          <div className="card-title">
            <span className="title-icon">👤</span>
            负责人信息
          </div>
          <div className="responsible-info">
            <div className="info-row">
              <span className="info-label">姓名</span>
              <span className="info-value">{nodeData.responsiblePerson.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">电话</span>
              <span className="info-value">{nodeData.responsiblePerson.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">部门</span>
              <span className="info-value">{nodeData.responsiblePerson.department}</span>
            </div>
            <div className="info-row">
              <span className="info-label">职位</span>
              <span className="info-value">{nodeData.responsiblePerson.position}</span>
            </div>
          </div>
        </Card>

        {/* 关键参数卡片 */}
        <Card className="parameters-card">
          <div className="card-title">
            <span className="title-icon">📊</span>
            关键参数
          </div>
          <div className="parameters-grid">
            {Object.entries(nodeData.parameters).map(([key, value]) => (
              <div key={key} className="parameter-item">
                <div className="parameter-label">{key}</div>
                <div className="parameter-value">{value}</div>
                {typeof value === 'string' && value.includes('%') && (
                  <div className="parameter-progress">
                    <div
                      className="progress-bar"
                      style={{ width: value }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* 扩展信息卡片 */}
        <Card className="extended-info-card">
          <div className="card-title">
            <span className="title-icon">📋</span>
            扩展信息
          </div>
          <div className="extended-info">
            {Object.entries(nodeData.extendedInfo).map(([key, value]) => (
              <div key={key} className="info-row">
                <span className="info-key">{key}</span>
                <span className="info-value">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 操作记录卡片 */}
        <Card className="operations-card">
          <div className="card-title">
            <span className="title-icon">📝</span>
            操作记录
          </div>
          <div className="operations-list">
            {nodeData.operationRecords.map((record) => (
              <div key={record.id} className="operation-item">
                <div className="operation-header">
                  <span className="operation-action">{record.action}</span>
                  <span className="operation-time">{formatTime(record.time)}</span>
                </div>
                <div className="operation-details">
                  <span className="operation-operator">操作人: {record.operator}</span>
                  <span className="operation-desc">{record.details}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部操作按钮 */}
        <div className="action-buttons">
          <Button className="contact-btn" size="large">
            📞 联系负责人
          </Button>
          <Button className="refresh-btn" size="large" fill="outline">
            🔄 刷新数据
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeDetail;