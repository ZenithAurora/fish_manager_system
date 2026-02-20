import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

// 导入图片资源
import fishLogo from '../../assets/img/fish.png';
import scanIcon from '../../assets/img/scan.png';
import bar1 from '../../assets/img/bar/1.png';
import bar2 from '../../assets/img/bar/2.png';
import bar3 from '../../assets/img/bar/3.png';
import bar4 from '../../assets/img/bar/4.png';
import bar5 from '../../assets/img/bar/5.png';

// 导入mock数据
import { fishProducts, categories, getFishById } from '../../mock/fishProducts';
import { getCart } from '../../mock/cartData';
import { isLoggedIn } from '../../mock/authService';
import { getTraceHistory } from '../../mock/userData';

const Home = () => {
  const navigate = useNavigate();
  // 使用初始化函数避免 effect 中 setState 警告
  const [cartCount, setCartCount] = useState(() => {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  });

  // 检查登录状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/login');
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
      try {
        const history = getTraceHistory();
        if (!history.length) {
          Toast.show({
            content: '暂无溯源记录，请先通过扫码或商品详情查看溯源信息后再试',
            icon: 'fail',
          });
          return;
        }

        const latest = history[0];
        const fish = getFishById(latest.fishId);

        if (!fish) {
          Toast.show({
            content: '未找到最近溯源对应的商品，请重新扫码后使用AI助手',
            icon: 'fail',
          });
          return;
        }

        localStorage.setItem('currentScanProduct', JSON.stringify(fish));
        navigate('/scan-result', {
          state: {
            source: 'home-ai',
            openAI: true,
          },
        });
      } catch (e) {
        Toast.show({
          content: 'AI助手启动失败，请稍后重试',
          icon: 'fail',
        });
      }
    }
  };

  // 处理商品点击
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  // 推荐商品（取前4个）
  const recommendProducts = fishProducts.slice(0, 4);
  return (
    <div className={styles.homePage}>
      {/* 顶部区域 */}
      <div className={styles.homeHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoArea}>
            <img src={fishLogo} alt="Logo" className={styles.logoImg}/>
            <span className={styles.logoText}>鳗知溯</span>
          </div>
          <div className={styles.headerActions}>
            {/* 暂时预留位置,后续可添加消息通知等 */}
          </div>
        </div>
      </div>

      {/* 轮播图 */}
      <div className={styles.bannerSection}>
        <Swiper
          className="home-swiper"
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {bannerData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className={styles.bannerItem}>
                <img src={item.image} alt={item.title} />
                <div className={styles.bannerOverlay}>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 特色标签 */}
      <div className={styles.featureTags}>
        {featureTags.map((tag, idx) => (
          <div key={idx} className={styles.tagItem}>
            <span className={styles.tagIcon}>{tag.icon}</span>
            <span className={styles.tagText}>{tag.text}</span>
          </div>
        ))}
      </div>

      {/* 核心功能卡片 */}
      <div className={styles.coreFeatureCard} onClick={() => navigate('/qrcode-scanner')}>
        <div className={styles.featureContent}>
          <div className={styles.featureTitleRow}>
            <h3>扫码溯源</h3>
            <span className={styles.featureBadge}>热门功能</span>
          </div>
          <p>一物一码 · 全程透明可见</p>
          <div className={styles.featureHighlights}>
            <span className={styles.hlTag}>🐟 养殖</span>
            <span className={styles.hlTag}>🏭 加工</span>
            <span className={styles.hlTag}>🚚 物流</span>
          </div>
        </div>
        <div className={styles.featureImageArea}>
          <img src={scanIcon} alt="Scan" className={styles.featureIconImg} />
          <div className={styles.scanBtn}>立即扫码</div>
        </div>
      </div>

      {/* AI分析卡片 */}
      <div className={styles.aiFeatureCard}>
        <div className={styles.aiHeader}>
          <span className={styles.aiIcon}>🤖</span>
          <span className={styles.aiTitle}>AI智能分析</span>
          <span className={styles.aiBadge}>NEW</span>
        </div>
        <p className={styles.aiDesc}>基于多模态AI技术，为您提供鳗鱼营养分析、烹饪建议和食用指南</p>
        <div className={styles.aiTags}>
          <span>营养分析</span>
          <span>烹饪推荐</span>
          <span>健康提示</span>
        </div>
      </div>

      {/* 热销推荐 */}
      <div className={styles.recommendSection}>
        <div className={styles.sectionHeader}>
          <h3>🔥 热销推荐</h3>
          <span className={styles.viewMore} onClick={() => navigate('/mall')}>查看更多 &gt;</span>
        </div>
        <div className={styles.productGrid}>
          {recommendProducts.map((product) => (
            <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product)}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.name} />
                {product.tags && product.tags[0] && (
                  <span className={styles.productTag}>{product.tags[0]}</span>
                )}
              </div>
              <div className={styles.productInfo}>
                <h4 className={styles.productName}>{product.name}</h4>
                <p className={styles.productSubtitle}>{product.subtitle}</p>
                <div className={styles.productFooter}>
                  <div className={styles.productPrice}>
                    <span className={styles.currency}>¥</span>
                    <span className={styles.price}>{product.price.toFixed(0)}</span>
                    {product.originalPrice && (
                      <span className={styles.originalPrice}>¥{product.originalPrice}</span>
                    )}
                  </div>
                  <span className={styles.sales}>{product.sales}人购买</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
