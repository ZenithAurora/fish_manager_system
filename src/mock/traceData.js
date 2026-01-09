/**
 * 溯源链路Mock数据
 * 模拟从养殖到销售的完整供应链信息
 */

/**
 * 溯源节点模板库
 * 用于动态生成溯源链路
 */
const nodeTemplates = {
  // 养殖基地
  farming: [
    {
      type: 'farming',
      name: '阳春镇上湖养殖基地',
      address: '四川省宜宾市江安县阳春镇',
      icon: '🐟',
      color: '#10b981',
      detailFields: ['waterQuality', 'feedType', 'density', 'inspector']
    },
    {
      type: 'farming',
      name: '鄱阳湖生态养殖区',
      address: '江西省上饶市鄱阳县',
      icon: '🐟',
      color: '#10b981',
      detailFields: ['waterQuality', 'feedType', 'density', 'inspector']
    },
    {
      type: 'farming',
      name: '霞浦深水网箱基地',
      address: '福建省宁德市霞浦县',
      icon: '🐟',
      color: '#10b981',
      detailFields: ['waterQuality', 'feedType', 'density', 'inspector']
    }
  ],
  // 加工厂
  processing: [
    {
      type: 'processing',
      name: '江安县冷链加工中心',
      address: '四川省宜宾市江安县工业园区',
      icon: '🏭',
      color: '#6366f1',
      detailFields: ['processType', 'temperature', 'qualityGrade', 'inspector']
    },
    {
      type: 'processing',
      name: '杭州鳗香食品加工厂',
      address: '浙江省杭州市余杭区',
      icon: '??',
      color: '#6366f1',
      detailFields: ['processType', 'temperature', 'qualityGrade', 'inspector']
    },
    {
      type: 'processing',
      name: '南通海味坊加工中心',
      address: '江苏省南通市如东县',
      icon: '🏭',
      color: '#6366f1',
      detailFields: ['processType', 'temperature', 'qualityGrade', 'inspector']
    }
  ],
  // 运输
  transport: [
    {
      type: 'transport',
      name: '顺丰冷链物流',
      address: '全程GPS追踪',
      icon: '🚚',
      color: '#f59e0b',
      detailFields: ['vehicleNo', 'driver', 'temperature', 'duration']
    },
    {
      type: 'transport',
      name: '京东冷链配送',
      address: '全程温控追踪',
      icon: '🚚',
      color: '#f59e0b',
      detailFields: ['vehicleNo', 'driver', 'temperature', 'duration']
    },
    {
      type: 'transport',
      name: '中通冷链专车',
      address: '专业冷链运输',
      icon: '🚚',
      color: '#f59e0b',
      detailFields: ['vehicleNo', 'driver', 'temperature', 'duration']
    }
  ],
  // 质检
  inspection: [
    {
      type: 'inspection',
      name: '国家水产品质检中心',
      address: '北京市海淀区',
      icon: '🔬',
      color: '#8b5cf6',
      detailFields: ['testItems', 'result', 'certificate', 'inspector']
    },
    {
      type: 'inspection',
      name: '省级农产品检测站',
      address: '四川省成都市',
      icon: '🔬',
      color: '#8b5cf6',
      detailFields: ['testItems', 'result', 'certificate', 'inspector']
    }
  ],
  // 零售终端
  retail: [
    {
      type: 'retail',
      name: '盒马鲜生(万象城店)',
      address: '成都市锦江区万象城B1层',
      icon: '🏪',
      color: '#ec4899',
      detailFields: ['temperature', 'humidity', 'shelfDate', 'manager']
    },
    {
      type: 'retail',
      name: '永辉超市(春熙路店)',
      address: '成都市锦江区春熙路118号',
      icon: '??',
      color: '#ec4899',
      detailFields: ['temperature', 'humidity', 'shelfDate', 'manager']
    },
    {
      type: 'retail',
      name: '山姆会员店(高新店)',
      address: '成都市高新区天府大道',
      icon: '🏪',
      color: '#ec4899',
      detailFields: ['temperature', 'humidity', 'shelfDate', 'manager']
    }
  ]
};

/**
 * 详情字段值生成器
 */
const detailValueGenerators = {
  waterQuality: () => ['优质', '一级', '特优'][Math.floor(Math.random() * 3)],
  feedType: () => ['天然饲料', '有机饲料', '生态混合饲料'][Math.floor(Math.random() * 3)],
  density: () => `${(Math.random() * 5 + 3).toFixed(1)}kg/m³`,
  processType: () => ['清洗分割', '蒲烧加工', '冷冻处理', '真空包装'][Math.floor(Math.random() * 4)],
  temperature: () => `${(Math.random() * 6 - 2).toFixed(1)}°C`,
  qualityGrade: () => ['特级', '一级', '优等'][Math.floor(Math.random() * 3)],
  vehicleNo: () => `川A${String(Math.floor(Math.random() * 90000) + 10000)}`,
  driver: () => ['王师傅', '李师傅', '张师傅', '陈师傅'][Math.floor(Math.random() * 4)],
  duration: () => `${Math.floor(Math.random() * 20) + 4}小时`,
  testItems: () => ['重金属检测、农残检测', '微生物检测、感官检测', '理化指标全项检测'][Math.floor(Math.random() * 3)],
  result: () => '全部合格',
  certificate: () => `QC${Date.now().toString().slice(-8)}`,
  humidity: () => `${Math.floor(Math.random() * 20) + 55}%`,
  shelfDate: () => new Date().toISOString().split('T')[0],
  manager: () => ['张经理', '李店长', '王主管'][Math.floor(Math.random() * 3)],
  inspector: () => ['质检员' + String.fromCharCode(65 + Math.floor(Math.random() * 26)), '检验师' + Math.floor(Math.random() * 100)][Math.floor(Math.random() * 2)]
};

/**
 * 生成随机时间
 */
const generateTime = (daysAgo, hoursOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(6 + hoursOffset + Math.floor(Math.random() * 4));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 为鱼类产品生成完整溯源链
 */
export const generateTraceChain = (fishId) => {
  const chain = [];
  let nodeId = 1;

  // 1. 养殖环节
  const farmingNode = nodeTemplates.farming[Math.floor(Math.random() * nodeTemplates.farming.length)];
  chain.push({
    id: nodeId++,
    ...farmingNode,
    status: '养殖出塘',
    statusType: 'success',
    time: generateTime(5),
    details: generateDetails(farmingNode.detailFields)
  });

  // 2. 加工环节
  const processingNode = nodeTemplates.processing[Math.floor(Math.random() * nodeTemplates.processing.length)];
  chain.push({
    id: nodeId++,
    ...processingNode,
    status: '加工完成',
    statusType: 'success',
    time: generateTime(4, 8),
    details: generateDetails(processingNode.detailFields)
  });

  // 3. 质检环节
  const inspectionNode = nodeTemplates.inspection[Math.floor(Math.random() * nodeTemplates.inspection.length)];
  chain.push({
    id: nodeId++,
    ...inspectionNode,
    status: '检验合格',
    statusType: 'success',
    time: generateTime(3, 4),
    details: generateDetails(inspectionNode.detailFields)
  });

  // 4. 运输环节
  const transportNode = nodeTemplates.transport[Math.floor(Math.random() * nodeTemplates.transport.length)];
  chain.push({
    id: nodeId++,
    ...transportNode,
    status: '运输完成',
    statusType: 'success',
    time: generateTime(2, 6),
    details: generateDetails(transportNode.detailFields)
  });

  // 5. 零售环节
  const retailNode = nodeTemplates.retail[Math.floor(Math.random() * nodeTemplates.retail.length)];
  chain.push({
    id: nodeId++,
    ...retailNode,
    status: '已上架',
    statusType: 'success',
    time: generateTime(1, 2),
    details: generateDetails(retailNode.detailFields)
  });

  return chain.reverse(); // 最新的在前面
};

/**
 * 生成详情数据
 */
const generateDetails = (fields) => {
  const details = {};
  fields.forEach(field => {
    const generator = detailValueGenerators[field];
    if (generator) {
      details[fieldLabels[field] || field] = generator();
    }
  });
  return details;
};

/**
 * 字段名称映射
 */
const fieldLabels = {
  waterQuality: '水质等级',
  feedType: '饲料类型',
  density: '养殖密度',
  processType: '加工方式',
  temperature: '环境温度',
  qualityGrade: '品质等级',
  vehicleNo: '车牌号',
  driver: '司机',
  duration: '运输时长',
  testItems: '检测项目',
  result: '检测结果',
  certificate: '证书编号',
  humidity: '环境湿度',
  shelfDate: '上架日期',
  manager: '负责人',
  inspector: '质检员'
};

/**
 * 预生成的溯源数据缓存
 */
const traceCache = {};

/**
 * 根据鱼ID获取溯源信息
 */
export const getTraceByFishId = (fishId) => {
  if (!traceCache[fishId]) {
    traceCache[fishId] = generateTraceChain(fishId);
  }
  return traceCache[fishId];
};

/**
 * 获取溯源统计信息
 */
export const getTraceStats = (fishId) => {
  const chain = getTraceByFishId(fishId);
  return {
    totalNodes: chain.length,
    allPassed: chain.every(node => node.statusType === 'success'),
    transportTime: chain.find(n => n.type === 'transport')?.details['运输时长'] || '未知',
    lastUpdate: chain[0]?.time || '未知'
  };
};

export const traceNodes = nodeTemplates;