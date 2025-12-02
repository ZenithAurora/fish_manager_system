import { useState, useEffect } from 'react';
import { SearchBar, Button, NavBar } from 'antd-mobile';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import bar1 from '../../assets/img/bar/1.png';
import bar2 from '../../assets/img/bar/2.png';
import bar3 from '../../assets/img/bar/3.png';
import bar4 from '../../assets/img/bar/4.png';
import bar5 from '../../assets/img/bar/5.png';
import bar6 from '../../assets/img/bar/6.png';
import bar7 from '../../assets/img/bar/7.png';

import { ScanningOutline } from 'antd-mobile-icons';
import mapImg from '../../assets/img/mapMock/map.png';

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  // 检查用户授权状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/authorization');
    }
  }, [navigate]);

  // 顶部轮播图数据
  const bannerData = [
    {
      id: 1,
      image: bar1,
      title: '链上鳗香',
      subtitle: '区块链助力鳗鱼产业物流数字化转型'
    },
    {
      id: 2,
      image: bar2,
      title: '品质溯源',
      subtitle: '从养殖到餐桌，全程可追溯'
    },
    {
      id: 3,
      image: bar3,
      title: '生态养殖',
      subtitle: '岷江活水，绿色生态养殖'
    },
    {
      id: 4,
      image: bar4,
      title: '质量控制',
      subtitle: '严格的质量控制，确保产品质量'
    },
    {
      id: 5,
      image: bar5,
      title: '食品安全',
      subtitle: '严格的食品安全管理，确保产品安全'
    },
    {
      id: 6,
      image: bar6,
      title: '客户服务',
      subtitle: '专业的客户服务，满足客户需求'
    },
    {
      id: 7,
      image: bar7,
      title: '客户服务',
      subtitle: '专业的客户服务，满足客户需求'
    },
  ];

  // 功能模块数据
  const featureItems = [
    { id: 'origin', icon: 'iconfont icon-location', text: '产地', color: '#4CAF50' },
    { id: 'farmer', icon: 'iconfont icon-user', text: '养殖户信息', color: '#2196F3' },
    { id: 'data', icon: 'iconfont icon-chart', text: '关键数据', color: '#9C27B0' },
    { id: 'factory', icon: 'iconfont icon-factory', text: '企业信息', color: '#FF9800' },
    { id: 'transport', icon: 'iconfont icon-truck', text: '运输轨迹', color: '#607D8B' },
    { id: 'inspection', icon: 'iconfont icon-search', text: '质检报告', color: '#E91E63' },
    { id: 'certification', icon: 'iconfont icon-certificate', text: '认证信息', color: '#FF5722' },
    { id: 'sales', icon: 'iconfont icon-shopping', text: '销售环节', color: '#795548' },
  ];

  // 处理扫码按钮点击
  const handleScanCode = () => {
    navigate('/qrcode-scanner');
  };

  // 处理功能模块点击
  const handleFeatureClick = (item) => {
    console.log('Feature clicked:', item);
    // 这里可以添加相应的跳转逻辑
  };

  return (
    <div className="home-container">
      {/* 顶部导航栏 */}
      <NavBar className="home-nav-bar" mode="light" title="链上鳗香" backArrow={false}>
        <div className="nav-actions">
          <span className="nav-icon">链上鳗香</span>
        </div>
      </NavBar>

      {/* 搜索栏 */}
      <div className="search-bar-container">
        <SearchBar
          placeholder="阳春镇鳗鱼上新"
          value={searchValue}
          onChange={setSearchValue}
          className="custom-search-bar"
        />
      </div>

      {/* 轮播图 */}
      <div className="banner-section">
        <Swiper
          className="home-swiper"
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {bannerData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="swiper-item">
                <img src={item.image} alt={item.title} className="banner-image" />
                <div className="banner-content">
                  <p className="banner-subtitle">{item.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 标签栏 */}
        <div className="feature-tags">
          <div className="tag-item">
            <span className="tag-icon">♻️</span>
            <span className="tag-text">厂商直供</span>
          </div>
          <div className="tag-item">
            <span className="tag-icon">♻️</span>
            <span className="tag-text">链条透明</span>
          </div>
          <div className="tag-item">
            <span className="tag-icon">♻️</span>
            <span className="tag-text">全程可溯源</span>
          </div>
          <div className="tag-item">
            <span className="tag-icon">♻️</span>
            <span className="tag-text">放心食用</span>
          </div>
        </div>
      </div>

      {/* 功能模块网格 */}
      <div className="features-section">
        <div className="feature-grid">
          {featureItems.map((item) => (
            <div key={item.id} className="feature-grid-item" onClick={() => handleFeatureClick(item)}>
              <div className="feature-icon" >
                <i className={item.icon} style={{ color: item.color }} />
              </div>
              <span className="feature-text" >{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 地图和扫码区域 */}
      <div className="map-section">
        <div className="map-container">
          <img
            src={mapImg}
            alt="地图"
            className="map-image"
          />

          {/* 扫码区域 */}
          <div className="scan-actions-container">
            {/* 定位按钮 */}
            <div className="action-button location-button">
              <div className="action-icon-container">
                <i className="fas fa-map-marker-alt action-icon"></i>
              </div>
              <span className="action-text">定位</span>
            </div>

            {/* 扫码溯源按钮 */}
            <div className="scan-button-container">
              <button className="scan-button" onClick={handleScanCode}>
                <span className="scan-icon">
                  <ScanningOutline />
                </span>
                <span className="scan-text">扫码溯源</span>
              </button>
            </div>

            {/* 客服按钮 */}
            <div className="action-button service-button">
              <div className="action-icon-container">
                <i className="fas fa-headset action-icon"></i>
              </div>
              <span className="action-text">客服</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;