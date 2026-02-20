import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, Dialog } from 'antd-mobile';
import { 
  RightOutline, 
  FileOutline, 
  HistogramOutline, 
  HeartOutline, 
  SetOutline,
  BellOutline,
  QuestionCircleOutline,
  UserContactOutline,
  MessageOutline,
  EnvironmentOutline
} from 'antd-mobile-icons';
import { getCurrentUser, getTraceHistory } from '../../mock/userData';
import { mockLogout, isLoggedIn } from '../../mock/authService';
import { getOrders } from '../../mock/orderData';
import { getFavoritesCount } from '../../mock/favoritesData';
// FooterNav 由 App.jsx 控制显示，这里不需要单独引入
import FeedbackModal from '../../components/FeedbackModal';
import './index.scss';

const UserCenter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    traceCount: 0,
    favoriteCount: 0
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // 加载用户数据
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    const userData = getCurrentUser();
    setUser(userData);
    
    // 计算统计数据
    const orders = getOrders();
    const traceHistory = getTraceHistory();
    
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'pending_payment')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    setStats({
      totalOrders: orders.length,
      totalSpent: totalSpent.toFixed(2),
      traceCount: traceHistory.length,
      favoriteCount: getFavoritesCount()
    });
  }, [navigate]);

  // 退出登录
  const handleLogout = async () => {
    const result = await Dialog.confirm({
      content: '确定要退出登录吗？',
      confirmText: '退出',
      cancelText: '取消',
    });
    
    if (result) {
      await mockLogout();
      Toast.show({ content: '已退出登录', icon: 'success' });
      localStorage.clear();
      navigate('/login');
    }
  };

  // 功能入口点击处理
  const handleMenuClick = (menu) => {
    switch (menu) {
      case 'orders':
        navigate('/order-history');
        break;
      case 'trace':
        navigate('/trace-history');
        break;
      case 'favorites':
        navigate('/favorites');
        break;
      case 'address':
        navigate('/address-list');
        break;
      case 'settings':
        Toast.show({ content: '设置功能开发中', icon: 'fail' });
        break;
      case 'notifications':
        Toast.show({ content: '消息通知功能开发中', icon: 'fail' });
        break;
      case 'help':
        Toast.show({ content: '帮助中心功能开发中', icon: 'fail' });
        break;
      case 'about':
        navigate('/about');
        break;
      case 'feedback':
        setShowFeedbackModal(true);
        break;
      default:
        break;
    }
  };

  if (!user) {
    return <div className="user-center-loading">加载中...</div>;
  }

  return (
    <div className="user-center-container">
      {/* 顶部用户信息区域 */}
      <div className="user-header">
        <div className="header-bg"></div>
        <div className="user-info">
          <div className="avatar-wrapper">
            <img src={user.avatar} alt="头像" className="avatar" />
          </div>
          <div className="user-details">
            <h2 className="nickname">{user.nickname || '新用户'}</h2>
            <p className="phone">{user.phone || '未绑定手机号'}</p>
          </div>
        </div>
      </div>

      {/* 统计数据卡片 */}
      <div className="stats-card">
        <div className="stat-item" onClick={() => handleMenuClick('orders')}>
          <span className="stat-value">{stats.totalOrders}</span>
          <span className="stat-label">订单数</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">¥{stats.totalSpent}</span>
          <span className="stat-label">消费金额</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => handleMenuClick('trace')}>
          <span className="stat-value">{stats.traceCount}</span>
          <span className="stat-label">溯源次数</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item" onClick={() => handleMenuClick('favorites')}>
          <span className="stat-value">{stats.favoriteCount}</span>
          <span className="stat-label">收藏数</span>
        </div>
      </div>

      {/* 功能入口 */}
      <div className="menu-section">
        <h3 className="section-title">我的服务</h3>
        <div className="menu-grid">
          <div className="menu-item" onClick={() => handleMenuClick('orders')}>
            <div className="menu-icon orders">
              <FileOutline />
            </div>
            <span className="menu-text">我的订单</span>
          </div>
          <div className="menu-item" onClick={() => handleMenuClick('trace')}>
            <div className="menu-icon trace">
              <HistogramOutline />
            </div>
            <span className="menu-text">溯源记录</span>
          </div>
          <div className="menu-item" onClick={() => handleMenuClick('favorites')}>
            <div className="menu-icon favorites">
              <HeartOutline />
            </div>
            <span className="menu-text">我的收藏</span>
          </div>
          <div className="menu-item" onClick={() => handleMenuClick('settings')}>
            <div className="menu-icon settings">
              <SetOutline />
            </div>
            <span className="menu-text">设置</span>
          </div>
        </div>
      </div>

      {/* 其他功能列表 */}
      <div className="list-section">
        <div className="list-item" onClick={() => handleMenuClick('address')}>
          <div className="list-icon">
            <EnvironmentOutline />
          </div>
          <span className="list-text">收货地址</span>
          <RightOutline className="list-arrow" />
        </div>
        <div className="list-item" onClick={() => handleMenuClick('notifications')}>
          <div className="list-icon">
            <BellOutline />
          </div>
          <span className="list-text">消息通知</span>
          <RightOutline className="list-arrow" />
        </div>
        <div className="list-item" onClick={() => handleMenuClick('help')}>
          <div className="list-icon">
            <QuestionCircleOutline />
          </div>
          <span className="list-text">帮助中心</span>
          <RightOutline className="list-arrow" />
        </div>
        <div className="list-item" onClick={() => handleMenuClick('about')}>
          <div className="list-icon">
            <UserContactOutline />
          </div>
          <span className="list-text">关于我们</span>
          <RightOutline className="list-arrow" />
        </div>
        
        <div className="list-item" onClick={() => handleMenuClick('feedback')}>
          <div className="list-icon">
            <MessageOutline />
          </div>
          <span className="list-text">意见反馈</span>
          <RightOutline className="list-arrow" />
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          退出登录
        </button>
      </div>

      {/* 版本信息 */}
      <div className="version-info">
        <span>鳗知溯系统 v1.0.0</span>
      </div>

      {/* FooterNav 由 App.jsx 统一控制显示，这里不需要 */}

      {/* 反馈弹窗 */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};

export default UserCenter;