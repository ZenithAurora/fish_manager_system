/**
 * 鱼类产品Mock数据
 * 包含完整的商品信息，便于后续对接真实接口
 */

import fish1 from '../assets/img/shopping/fish1.jpg';
import fish2 from '../assets/img/shopping/fish2.jpg';
import fish3 from '../assets/img/shopping/fish3.webp';
import fish4 from '../assets/img/shopping/fish4.webp';
import fish5 from '../assets/img/shopping/fish5.webp';

export const fishProducts = [
  {
    id: 'FISH001',
    name: '阳春镇特产·鲜活鳗鱼',
    subtitle: '生态养殖 肉质鲜嫩',
    price: 128.00,
    originalPrice: 168.00,
    unit: '约500g/条',
    image: fish1,
    images: [fish1],
    tags: ['热销', '有机认证'],
    category: 'fresh',
    origin: '四川省宜宾市江安县阳春镇',
    producer: '七彩湖特种水产养殖公司',
    productionDate: '2025-01-23',
    shelfLife: '冷藏3天/冷冻30天',
    storage: '0-4℃冷藏保存',
    nutrition: {
      protein: '18.2g/100g',
      fat: '12.5g/100g',
      calories: '189kcal/100g',
      omega3: '2.1g/100g'
    },
    description: '来自四川江安阳春镇的优质鳗鱼，采用生态养殖方式，水质优良，肉质细嫩鲜美。富含优质蛋白和Omega-3脂肪酸，是健康饮食的优选。',
    sales: 2341,
    rating: 4.9,
    stock: 156,
    qrCode: 'TRACE-FISH001-2025'
  },
  {
    id: 'FISH002',
    name: '日式蒲烧鳗鱼',
    subtitle: '即食美味 开袋即享',
    price: 89.00,
    originalPrice: 118.00,
    unit: '200g/袋',
    image: fish2,
    images: [fish2],
    tags: ['即食', '人气爆款'],
    category: 'processed',
    origin: '浙江省杭州市',
    producer: '杭州鳗香食品有限公司',
    productionDate: '2025-01-20',
    shelfLife: '冷冻180天',
    storage: '-18℃以下冷冻保存',
    nutrition: {
      protein: '16.5g/100g',
      fat: '15.2g/100g',
      calories: '245kcal/100g',
      omega3: '1.8g/100g'
    },
    description: '精选优质鳗鱼，采用传统日式蒲烧工艺，酱汁浓郁，口感软糯。微波加热3分钟即可享用，配米饭绝佳搭配。',
    sales: 5621,
    rating: 4.8,
    stock: 328,
    qrCode: 'TRACE-FISH002-2025'
  },
  {
    id: 'FISH003',
    name: '野生深海鳗鱼段',
    subtitle: '深海捕捞 原生态美味',
    price: 198.00,
    originalPrice: 258.00,
    unit: '约600g/份',
    image: fish3,
    images: [fish3],
    tags: ['野生', '限量'],
    category: 'fresh',
    origin: '福建省宁德市霞浦县',
    producer: '霞浦海源水产有限公司',
    productionDate: '2025-01-22',
    shelfLife: '冷藏2天/冷冻30天',
    storage: '0-4℃冷藏保存',
    nutrition: {
      protein: '19.8g/100g',
      fat: '10.2g/100g',
      calories: '175kcal/100g',
      omega3: '2.5g/100g'
    },
    description: '来自东海深海的野生鳗鱼，自然生长，肉质紧实，营养丰富。每日限量供应，新鲜直达。',
    sales: 892,
    rating: 4.95,
    stock: 45,
    qrCode: 'TRACE-FISH003-2025'
  },
  {
    id: 'FISH004',
    name: '有机黑鳗礼盒',
    subtitle: '送礼佳品 尊贵之选',
    price: 388.00,
    originalPrice: 488.00,
    unit: '1000g礼盒装',
    image: fish4,
    images: [fish4],
    tags: ['礼盒', '有机认证'],
    category: 'gift',
    origin: '广东省台山市',
    producer: '台山绿源生态渔业',
    productionDate: '2025-01-21',
    shelfLife: '冷冻90天',
    storage: '-18℃以下冷冻保存',
    nutrition: {
      protein: '20.1g/100g',
      fat: '11.8g/100g',
      calories: '192kcal/100g',
      omega3: '2.3g/100g'
    },
    description: '精选台山有机黑鳗，通过国家有机认证。精美礼盒包装，适合节日送礼、商务馈赠。含两条整鳗，附赠蒲烧酱料包。',
    sales: 456,
    rating: 4.85,
    stock: 78,
    qrCode: 'TRACE-FISH004-2025'
  },
  {
    id: 'FISH005',
    name: '鳗鱼寿司料',
    subtitle: '料理专用 品质保证',
    price: 68.00,
    originalPrice: 88.00,
    unit: '150g/盒',
    image: fish5,
    images: [fish5],
    tags: ['料理', '特惠'],
    category: 'processed',
    origin: '江苏省南通市',
    producer: '南通海味坊食品',
    productionDate: '2025-01-19',
    shelfLife: '冷冻365天',
    storage: '-18℃以下冷冻保存',
    nutrition: {
      protein: '15.2g/100g',
      fat: '14.5g/100g',
      calories: '228kcal/100g',
      omega3: '1.6g/100g'
    },
    description: '专为寿司料理设计的鳗鱼片，厚度均匀，口感软糯。预调味处理，解冻后可直接使用，在家轻松做出餐厅级鳗鱼寿司。',
    sales: 3256,
    rating: 4.7,
    stock: 512,
    qrCode: 'TRACE-FISH005-2025'
  },
  {
    id: 'FISH006',
    name: '清蒸鳗鱼整条',
    subtitle: '清淡养生 老少皆宜',
    price: 158.00,
    originalPrice: 198.00,
    unit: '约450g/条',
    image: fish1,
    images: [fish1],
    tags: ['养生', '推荐'],
    category: 'fresh',
    origin: '江西省鄱阳湖',
    producer: '鄱阳湖生态渔业合作社',
    productionDate: '2025-01-23',
    shelfLife: '冷藏3天/冷冻30天',
    storage: '0-4℃冷藏保存',
    nutrition: {
      protein: '17.8g/100g',
      fat: '11.2g/100g',
      calories: '178kcal/100g',
      omega3: '2.0g/100g'
    },
    description: '鄱阳湖天然水域养殖，水质纯净无污染。适合清蒸、炖汤等清淡做法，保留鳗鱼原始鲜味，适合追求健康饮食的人群。',
    sales: 1823,
    rating: 4.85,
    stock: 203,
    qrCode: 'TRACE-FISH006-2025'
  }
];

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