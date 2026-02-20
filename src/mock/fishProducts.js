/**
 * 鱼类产品Mock数据
 * 包含完整的商品信息，便于后续对接真实接口
 */
import fish1 from '../assets/img/shopping/fish1.jpg';
import fish2 from '../assets/img/shopping/fish2.jpg';
import fish3 from '../assets/img/shopping/fish3.jpg';
import fish4 from '../assets/img/shopping/fish4.jpg';
import fish5 from '../assets/img/shopping/fish5.jpg';
import fish6 from '../assets/img/shopping/fish6.jpg';
import fish7 from '../assets/img/shopping/fish7.jpg';
import fish8 from '../assets/img/shopping/fish8.jpg';
import fish9 from '../assets/img/shopping/fish9.jpg';
import fish10 from '../assets/img/shopping/fish10.jpg';

const fishImages = [
  fish1, fish2, fish3, fish4, fish5,
  fish6, fish7, fish8, fish9, fish10
];

// 模拟图片路径（保持原有命名规则）
const getImagePath = (index) => {
  // 循环使用5张图片，保证图片路径格式统一
  return fishImages[index % 10];
};

// 基础数据模板 - 用于生成多样化的商品信息
const baseData = {
  // 产地列表
  origins: [
    '四川省宜宾市江安县阳春镇', '浙江省杭州市', '福建省宁德市霞浦县',
    '广东省台山市', '江苏省南通市', '江西省鄱阳湖', '山东省青岛市',
    '辽宁省大连市', '广东省中山市', '福建省福州市', '江苏省苏州市',
    '浙江省宁波市', '广东省珠海市', '海南省海口市', '广西省北海市'
  ],
  // 生产商列表
  producers: [
    '七彩湖特种水产养殖公司', '杭州鳗香食品有限公司', '霞浦海源水产有限公司',
    '台山绿源生态渔业', '南通海味坊食品', '鄱阳湖生态渔业合作社',
    '青岛远洋水产有限公司', '大连海之韵渔业', '中山恒兴水产',
    '福州海源食品厂', '苏州渔乐圈食品', '宁波海味鲜食品',
    '珠海蓝海渔业', '海口南海渔业', '北海银滩水产'
  ],
  // 商品名称前缀
  namePrefixes: ['鲜活', '野生', '有机', '冷冻', '即食', '精选', '特级', '原生态'],
  // 商品名称后缀
  nameSuffixes: ['鳗鱼', '鳗鱼段', '鳗鱼柳', '鳗鱼丸', '鳗鱼干', '鳗鱼礼盒', '鳗鱼寿司料', '蒲烧鳗鱼'],
  // 副标题模板
  subtitles: [
    '生态养殖 肉质鲜嫩', '即食美味 开袋即享', '深海捕捞 原生态美味',
    '送礼佳品 尊贵之选', '料理专用 品质保证', '清淡养生 老少皆宜',
    '新鲜直达 产地直供', '无添加 健康安全', '肉质紧实 口感鲜美'
  ],
  // 标签组合
  tagGroups: [
    ['热销', '有机认证'], ['即食', '人气爆款'], ['野生', '限量'],
    ['礼盒', '有机认证'], ['料理', '特惠'], ['养生', '推荐'],
    ['新品', '包邮'], ['产地直供', '新鲜'], ['高蛋白', '低脂肪']
  ],
  // 单位选项
  units: [
    '约500g/条', '200g/袋', '约600g/份', '1000g礼盒装', '150g/盒',
    '约450g/条', '300g/包', '800g/箱', '250g/份', '400g/袋'
  ],
  // 分类
  categories: ['fresh', 'processed', 'gift'],
  // 保质期选项
  shelfLifes: [
    '冷藏3天/冷冻30天', '冷冻180天', '冷藏2天/冷冻30天',
    '冷冻90天', '冷冻365天', '冷藏1天/冷冻60天'
  ],
  // 储存条件
  storages: [
    '0-4℃冷藏保存', '-18℃以下冷冻保存', '0-2℃冷藏保存',
    '-20℃以下冷冻保存', '常温避光保存'
  ]
};

// 生成随机日期（2025年1月）
const getRandomDate = () => {
  const day = Math.floor(Math.random() * 25) + 1;
  const dayStr = day < 10 ? `0${day}` : day;
  return `2025-01-${dayStr}`;
};

// 生成随机营养数据
const getRandomNutrition = () => {
  return {
    protein: `${(15 + Math.random() * 5).toFixed(1)}g/100g`,
    fat: `${(10 + Math.random() * 5).toFixed(1)}g/100g`,
    calories: `${(170 + Math.random() * 80).toFixed(0)}kcal/100g`,
    omega3: `${(1.5 + Math.random() * 1).toFixed(1)}g/100g`
  };
};

// 生成随机描述
const getRandomDescription = (origin, name) => {
  const descTemplates = [
    `来自${origin}的优质${name}，采用生态养殖方式，水质优良，肉质细嫩鲜美。富含优质蛋白和Omega-3脂肪酸，是健康饮食的优选。`,
    `精选${origin}产${name}，传统工艺制作，口感软糯。加热即食，是家庭餐桌的美味选择。`,
    `${origin}深海捕捞的${name}，自然生长，肉质紧实，营养丰富。新鲜直达，保证品质。`,
    `${origin}特产${name}，有机认证，无添加防腐剂。精美包装，适合送礼和自用。`,
    `专为料理设计的${origin}${name}，厚度均匀，口感佳。在家轻松做出餐厅级美食。`
  ];
  return descTemplates[Math.floor(Math.random() * descTemplates.length)];
};

// 生成100条鳗鱼产品数据
export const fishProducts = Array.from({ length: 100 }, (_, index) => {
  const id = `FISH${String(index + 1).padStart(3, '0')}`;
  const randomOrigin = baseData.origins[Math.floor(Math.random() * baseData.origins.length)];
  const randomProducer = baseData.producers[Math.floor(Math.random() * baseData.producers.length)];
  const randomNamePrefix = baseData.namePrefixes[Math.floor(Math.random() * baseData.namePrefixes.length)];
  const randomNameSuffix = baseData.nameSuffixes[Math.floor(Math.random() * baseData.nameSuffixes.length)];
  const randomSubtitle = baseData.subtitles[Math.floor(Math.random() * baseData.subtitles.length)];
  const randomTags = baseData.tagGroups[Math.floor(Math.random() * baseData.tagGroups.length)];
  const randomCategory = baseData.categories[Math.floor(Math.random() * baseData.categories.length)];
  const randomUnit = baseData.units[Math.floor(Math.random() * baseData.units.length)];
  const randomShelfLife = baseData.shelfLifes[Math.floor(Math.random() * baseData.shelfLifes.length)];
  const randomStorage = baseData.storages[Math.floor(Math.random() * baseData.storages.length)];
  
  // 价格生成（保证有合理的折扣）
  const originalPrice = (80 + Math.random() * 400).toFixed(2);
  const discountRate = 0.7 + Math.random() * 0.25; // 7-9.5折
  const price = (parseFloat(originalPrice) * discountRate).toFixed(2);

  const image = getImagePath(index);
  
  return {
    id,
    name: `${randomNamePrefix}${randomNameSuffix}`,
    subtitle: randomSubtitle,
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice),
    unit: randomUnit,
    image,
    images: [image],
    tags: randomTags,
    category: randomCategory,
    origin: randomOrigin,
    producer: randomProducer,
    productionDate: getRandomDate(),
    shelfLife: randomShelfLife,
    storage: randomStorage,
    nutrition: getRandomNutrition(),
    description: getRandomDescription(randomOrigin, randomNameSuffix),
    sales: Math.floor(Math.random() * 6000 + 100), // 销量100-6100
    rating: (4.5 + Math.random() * 0.5).toFixed(2), // 评分4.5-5.0
    stock: Math.floor(Math.random() * 600 + 10), // 库存10-610
    qrCode: `TRACE-${id}-2025`
  };
});

/**
 * 商品分类
 */
export const categories = [
  { id: 'all', name: '全部', icon: '🐟' },
  { id: 'fresh', name: '鲜活', icon: '🌊' },
  { id: 'processed', name: '加工', icon: '🍱' },
  { id: 'gift', name: '礼盒', icon: '🎁' }
];

/**
 * 根据ID获取鱼类产品
 */
export const getFishById = (id) => {
  return fishProducts.find(fish => fish.id === id) || null;
};

/**
 * 随机获取一条鱼（用于扫码场景）
 */
export const getRandomFish = () => {
  const randomIndex = Math.floor(Math.random() * fishProducts.length);
  return fishProducts[randomIndex];
};

/**
 * 根据分类筛选产品
 */
export const getFishByCategory = (category) => {
  if (category === 'all') return fishProducts;
  return fishProducts.filter(fish => fish.category === category);
};

/**
 * 搜索产品
 */
export const searchFish = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return fishProducts.filter(fish => 
    fish.name.toLowerCase().includes(lowerKeyword) ||
    fish.description.toLowerCase().includes(lowerKeyword) ||
    fish.origin.toLowerCase().includes(lowerKeyword)
  );
};