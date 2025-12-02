import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppstoreOutline, ScanCodeOutline, UserOutline, ShopbagOutline, TruckOutline } from 'antd-mobile-icons';
import './index.scss';

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // 导航项配置
  const navItems = [
    {
      id: 'home',
      path: '/',
      icon: <AppstoreOutline />,
      label: '首页',
      showScanCircle: false
    },
    {
      id: 'mall',
      path: '/mall',
      icon: <ShopbagOutline />,
      label: '商城',
      showScanCircle: false
    },
    {
      id: 'scan',
      path: '/qrcode-scanner',
      icon: <ScanCodeOutline />,
      label: '扫码',
      showScanCircle: true
    },
    {
      id: 'orderHistory',
      path: '/orderHistory',
      icon: <TruckOutline />,
      label: '订单',
      showScanCircle: false
    },
    {
      id: 'user',
      path: '/user',
      icon: <UserOutline />,
      label: '我的',
      showScanCircle: false
    }
  ];

  // 处理导航点击
  const handleNavClick = (path) => {
    // 防止重复点击当前页面
    if (currentPath !== path) {
      navigate(path);
    }
  };

  // 判断是否为当前页面
  const isActive = (path) => {
    return currentPath === path;
  };

  return (
    <div className="footer-nav-container">
      <div className="footer-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.showScanCircle ? 'scan-item' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <div className={`nav-icon-container ${item.showScanCircle ? 'scan-circle' : ''}`}>
              <div className={`nav-icon ${isActive(item.path) ? 'active' : ''}`}>
                {item.icon}
              </div>
            </div>
            <span className={`nav-label ${isActive(item.path) ? 'active' : ''}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;