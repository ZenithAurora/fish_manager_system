import React, { useState, useEffect } from 'react';
import { NavBar, Card, List, Button, Switch } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { UserOutline, CheckShieldOutline, MessageOutline, AppOutline, BellOutline, ScanCodeOutline, LocationOutline, StarOutline, QuestionCircleOutline, DeleteOutline } from 'antd-mobile-icons';
import './index.scss';

const UserCenter = () => {
  const navigate = useNavigate();

  // 检查用户授权状态
  useEffect(() => {
    const authorized = localStorage.getItem('isAuthorized');
    if (!authorized) {
      navigate('/authorization');
    }
  }, [navigate]);

  // 模拟用户数据
  const userData = {
    avatar: 'https://via.placeholder.com/60?text=用户头像',
    username: '陈先生',
    phone: '138****8899',
    memberLevel: '高级会员',
    points: 3280,
    scanCount: 145,
    favoritesCount: 23
  };

  // 设置状态
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 退出登录
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('isAuthorized');
      localStorage.removeItem('userInfo');
      navigate('/authorization');
    }
  };

  // 处理功能列表点击
  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'scan_history':
        alert('查看扫描历史');
        break;
      case 'favorites':
        alert('查看收藏夹');
        break;
      case 'address':
        alert('管理收货地址');
        break;
      case 'messages':
        alert('查看消息通知');
        break;
      case 'about':
        alert('关于我们');
        break;
      case 'help':
        alert('帮助中心');
        break;
      case 'feedback':
        alert('意见反馈');
        break;
      default:
        break;
    }
  };

  // 切换推送通知设置
  const togglePushNotifications = (checked) => {
    setPushNotifications(checked);
  };

  // 切换深色模式
  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    document.body.classList.toggle('dark-mode', checked);
  };

  return (
    <div className="user-center-container">
      {/* 顶部导航栏 */}
      <NavBar className="user-nav-bar" mode="light" onBack={handleBack} backArrow={false}>
        <span className="nav-title">个人中心</span>
      </NavBar>

      <div className="user-content">
        {/* 用户信息卡片 */}
        <Card className="user-info-card">
          <div className="user-header">
            <div className="user-avatar">
              <img src={userData.avatar} alt={userData.username} />
            </div>

            <div className="user-details">
              <div className="user-name-section">
                <h2 className="user-name">{userData.username}</h2>
                <span className="member-badge">{userData.memberLevel}</span>
              </div>
              <p className="user-phone">{userData.phone}</p>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.points}</span>
              <span className="stat-label">积分</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{userData.scanCount}</span>
              <span className="stat-label">扫码次数</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{userData.favoritesCount}</span>
              <span className="stat-label">收藏数量</span>
            </div>
          </div>
        </Card>

        {/* 功能列表卡片 */}
        <Card className="features-card">
          <List className="features-list">
            <List.Item
              className="feature-item"
              onClick={() => handleFeatureClick('scan_history')}
              prefix={<ScanCodeOutline className="feature-icon" />}
              suffix="查看"
            >
              扫描历史
            </List.Item>

            <List.Item
              className="feature-item"
              onClick={() => handleFeatureClick('favorites')}
              prefix={<StarOutline className="feature-icon" />}
              suffix="查看"
            >
              我的收藏
            </List.Item>

            <List.Item
              className="feature-item"
              onClick={() => handleFeatureClick('address')}
              prefix={<LocationOutline className="feature-icon" />}
              suffix="管理"
            >
              收货地址
            </List.Item>

            <List.Item
              className="feature-item"
              onClick={() => handleFeatureClick('messages')}
              prefix={<BellOutline className="feature-icon" />}
              suffix="查看"
            >
              消息通知
            </List.Item>
          </List>
        </Card>

        {/* 设置选项卡片 */}
        <Card className="settings-card">
          <List className="settings-list">
            <List.Item
              className="setting-item"
              onClick={() => handleFeatureClick('about')}
              prefix={<CheckShieldOutline className="setting-icon" />}
              suffix="关于"
            >
              账户与安全
            </List.Item>

            <List.Item
              className="setting-item"
              onClick={() => handleFeatureClick('help')}
              prefix={<QuestionCircleOutline className="setting-icon" />}
              suffix="查看"
            >
              帮助中心
            </List.Item>

            <List.Item
              className="setting-item"
              onClick={() => handleFeatureClick('feedback')}
              prefix={<MessageOutline className="setting-icon" />}
              suffix="提交"
            >
              意见反馈
            </List.Item>

            <List.Item
              className="setting-item"
              prefix={<BellOutline className="setting-icon" />}
              extra={<Switch checked={pushNotifications} onChange={togglePushNotifications} />}
            >
              推送通知
            </List.Item>

            <List.Item
              className="setting-item"
              prefix={<AppOutline className="setting-icon" />}
              extra={<Switch checked={darkMode} onChange={toggleDarkMode} />}
            >
              深色模式
            </List.Item>
          </List>
        </Card>

        {/* 退出登录按钮 */}
        <div className="logout-section">
          <Button className="logout-button" onClick={handleLogout}>
            <DeleteOutline className="logout-icon" />
            退出登录
          </Button>
        </div>

        {/* 版本信息 */}
        <div className="version-info">
          版本 1.0.0
        </div>
      </div>
    </div>
  );
};

export default UserCenter;