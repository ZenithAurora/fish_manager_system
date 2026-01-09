import { useState, useEffect } from 'react';
import { SearchBar, Toast, Badge } from 'antd-mobile';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import './index-new.scss';

// 导入图片资源
import bar1 from '../../assets/img/bar/1.png';
import bar2 from '../../assets/img/bar/2.png';
import bar3 from '../../assets/img/bar/3.png';
import bar4 from '../../assets/img/bar/4.png';
import bar5 from '../../assets/img/bar/5.png';

// 导入mock数据
import { fishProducts, categories } from '../../mock/fishProducts';
import { getCart } from '../../mock/cartData';
import { isLoggedIn } from '../../mock/authService';

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  // 使用初始化函数避免 effect 中 setState 警告
  const [cartCount, setCartCount] = useState(() => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  });

  // 检查登录状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/authorization');
    }
  }, [navigate]);

  // 监听购物车变化（用于从其他页面返回时更新）
  useEffect(() => {
    const handleFocus = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 轮播图数据
  const bannerData = [
    { id: 1, image: bar1, title: '鳗知溯', subtitle: 'AI赋能 · 一码知源' },
    { id: 2, image: bar2, title: '品质溯源', subtitle: '从养殖到餐桌，全程可追溯' },
    { id: 3, image: bar3, title: '生态养殖', subtitle: '优质水源，绿色生态养殖' },
    { id: 4, image: bar4, title: 'AI智能分析', subtitle: '智能识别，营养解读' },
    { id: 5, image: bar5, title: '安心食用', subtitle: '严格质检，放心享用' },
  ];

  // 功能入口
  const quickActions = [
    { id: 'scan', icon: '📷', text: '扫码溯源', color: '#10b981', path: '/qrcode-scanner' },
    { id: 'mall', icon: '🛒', text: '鳗鱼商城', color: '#6366f1', path: '/mall' },
    { id: 'order', icon: '📋', text: '我的订单', color: '#f59e0b', path: '/orderHistory' },
    { id: 'ai', icon: '🤖', text: 'AI助手', color: '#ec4899', path: null },
  ];

  // 特色标签
  const featureTags = [
    { icon: '✓', text: '厂商直供' },
    { icon: '✓', text: '链条透明' },
    { icon: '✓', text: '全程可溯' },
    { icon: '✓', text: '品质保障' },
  ];

  // 处理搜索
  const handleSearch = (val) => {
    if (val.trim()) {
      navigate(`/mall?search=${encodeURIComponent(val)}`);
    }
  };

  // 处理快捷操作
  const handleQuickAction = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.id === 'ai') {
      Toast.show({ content: 'AI助手即将上线', icon: 'loading' });
    }
  };

  // 处理商品点击
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  // 推荐商品（取前4个）
  const recommendProducts = fishProducts.slice(0, 4);

  return (
    <div className="home-page">
      {/* 顶部区域 */}
      <div className="home-header">
        <div className="header-content">
          <div className="logo-area">
            <span className="logo-icon">🐟</span>
            <span className="logo-text">鳗知溯</span>
          </div>
          <div className="header-actions">
            <div className="action-item" onClick={() => navigate('/qrcode-scanner')}>
              <span>📷</span>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="search-wrapper">
          <SearchBar
            placeholder="搜索鳗鱼产品..."
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            className="home-search"
          />
        </div>
      </div>

      {/* 轮播图 */}
      <div className="banner-section">
        <Swiper
          className="home-swiper"
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {bannerData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="banner-item">
                <img src={item.image} alt={item.title} />
                <div className="banner-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 特色标签 */}
      <div className="feature-tags">
        {featureTags.map((tag, idx) => (
          <div key={idx} className="tag-item">
            <span className="tag-icon">{tag.icon}</span>
            <span className="tag-text">{tag.text}</span>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div className="quick-actions">
        {quickActions.map((item) => (
          <div key={item.id} className="action-item" onClick={() => handleQuickAction(item)}>
            <div className="action-icon" style={{ background: `${item.color}15` }}>
              <span style={{ fontSize: '28px' }}>{item.icon}</span>
            </div>
            <span className="action-text">{item.text}</span>
          </div>
        ))}
      </div>

      {/* 核心功能卡片 */}
      <div className="core-feature-card" onClick={() => navigate('/qrcode-scanner')}>
        <div className="feature-left">
          <div className="feature-icon-large">📷</div>
        </div>
        <div className="feature-content">
          <h3>扫码溯源</h3>
          <p>扫描产品二维码，查看完整供应链信息</p>
          <div className="feature-highlights">
            <span>🐟 养殖基地</span>
            <span>🏭 加工厂</span>
            <span>🚚 物流</span>
            <span>🏪 销售点</span>
          </div>
        </div>
        <div className="feature-arrow">→</div>
      </div>

      {/* AI分析卡片 */}
      <div className="ai-feature-card">
        <div className="ai-header">
          <span className="ai-icon">🤖</span>
          <span className="ai-title">AI智能分析</span>
          <span className="ai-badge">NEW</span>
        </div>
        <p className="ai-desc">基于多模态AI技术，为您提供鳗鱼营养分析、烹饪建议和食用指南</p>
        <div className="ai-tags">
          <span>营养分析</span>
          <span>烹饪推荐</span>
          <span>健康提示</span>
        </div>
      </div>

      {/* 热销推荐 */}
      <div className="recommend-section">
        <div className="section-header">
          <h3>🔥 热销推荐</h3>
          <span className="view-more" onClick={() => navigate('/mall')}>查看更多 →</span>
        </div>
        <div className="product-grid">
          {recommendProducts.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.tags && product.tags[0] && (
                  <span className="product-tag">{product.tags[0]}</span>
                )}
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-subtitle">{product.subtitle}</p>
                <div className="product-footer">
                  <div className="product-price">
                    <span className="currency">¥</span>
                    <span className="price">{product.price.toFixed(0)}</span>
                    {product.originalPrice && (
                      <span className="original-price">¥{product.originalPrice}</span>
                    )}
                  </div>
                  <span className="sales">{product.sales}人购买</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部间距 */}
      <div className="bottom-space"></div>
    </div>
  );
};

export default Home;
