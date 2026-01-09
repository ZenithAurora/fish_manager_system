import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Toast, Card, Button, List, Badge } from 'antd-mobile';
// 使用文本表情符号替代图标
const UserOutline = () => <span>👤</span>;
const FileOutline = () => <span>📄</span>;
const MessageOutline = () => <span>💬</span>;
const LogoutOutline = () => <span>🚪</span>;
const RightOutline = () => <span>→</span>;
import { getCurrentAdmin, adminLogout, getFeedbackList } from '../../mock/adminService';
import { getOrders } from '../../mock/orderData';
import { getCurrentUser } from '../../mock/userData';
import './index-new.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingFeedback: 0,
    totalFeedback: 0
  });
  const [recentFeedback, setRecentFeedback] = useState([]);

  // 检查登录状态
  useEffect(() => {
    const adminData = getCurrentAdmin();
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    setAdmin(adminData);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // 加载统计数据
      const orders = getOrders();
      const users = [getCurrentUser()]; // 模拟用户数据
      
      const feedbackResponse = await getFeedbackList();
      const feedbackList = feedbackResponse.data || [];
      
      const pendingFeedback = feedbackList.filter(f => f.status === 'pending').length;
      
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        pendingFeedback,
        totalFeedback: feedbackList.length
      });

      // 加载最近反馈
      const recent = feedbackList.slice(0, 5);
      setRecentFeedback(recent);

    } catch (error) {
      Toast.show('数据加载失败');
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    Toast.show('已退出登录', { icon: 'success' });
    navigate('/admin/login');
  };

  const handleFeedbackClick = (feedback) => {
    Toast.show(`查看反馈: ${feedback.title}`);
    // 这里可以跳转到反馈详情页面
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'orange', text: '待处理' },
      processing: { color: 'blue', text: '处理中' },
      resolved: { color: 'green', text: '已解决' }
    };
    return config[status] || config.pending;
  };

  if (!admin) {
    return <div className="admin-loading">加载中...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* 顶部导航 */}
      <NavBar 
        back={null}
        right={
          <Button 
            size="mini" 
            color="danger" 
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogoutOutline /> 退出
          </Button>
        }
      >
        <span className="nav-title">
          管理后台 - {admin.role === 'super_admin' ? '管理员' : '运营'}
        </span>
      </NavBar>

      <div className="admin-content">
        {/* 欢迎信息 */}
        <div className="welcome-card">
          <h2>欢迎回来，{admin.displayName}！</h2>
          <p>上次登录: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : '首次登录'}</p>
        </div>

        {/* 数据统计卡片 */}
        <div className="stats-grid">
          <Card className="stat-card users">
            <div className="stat-icon">
              <UserOutline />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">用户总数</div>
            </div>
          </Card>

          <Card className="stat-card orders">
            <div className="stat-icon">
              <FileOutline />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">订单总数</div>
            </div>
          </Card>

          <Card className="stat-card feedback">
            <div className="stat-icon">
              <MessageOutline />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalFeedback}</div>
              <div className="stat-label">反馈总数</div>
            </div>
          </Card>

          <Card className="stat-card pending">
            <div className="stat-icon">
              <MessageOutline />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingFeedback}</div>
              <div className="stat-label">待处理反馈</div>
            </div>
          </Card>
        </div>

        {/* 最近反馈列表 */}
        <div className="section">
          <div className="section-header">
            <h3>最近反馈</h3>
            <Button size="mini" fill="none">
              查看全部
            </Button>
          </div>

          <List>
            {recentFeedback.length > 0 ? (
              recentFeedback.map(feedback => (
                <List.Item
                  key={feedback.id}
                  onClick={() => handleFeedbackClick(feedback)}
                  extra={<RightOutline />}
                  prefix={
                    <Badge
                      content={getStatusBadge(feedback.status).text}
                      style={{
                        '--background-color': `var(--adm-color-${getStatusBadge(feedback.status).color})`,
                        '--border-radius': '4px',
                        fontSize: '10px'
                      }}
                    />
                  }
                >
                  <div className="feedback-item">
                    <div className="feedback-title">{feedback.title}</div>
                    <div className="feedback-meta">
                      {feedback.userName} · {new Date(feedback.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </List.Item>
              ))
            ) : (
              <List.Item>
                <div className="empty-feedback">暂无反馈数据</div>
              </List.Item>
            )}
          </List>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
