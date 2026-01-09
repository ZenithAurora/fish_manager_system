import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Toast } from 'antd-mobile';
import { adminLogin } from '../../mock/adminService';
import './index.scss';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Toast.show('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(formData.username, formData.password);
      Toast.show(result.message, { icon: 'success' });
      navigate('/admin/dashboard');
    } catch (error) {
      Toast.show(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (type) => {
    if (type === 'admin') {
      setFormData({ username: 'admin', password: '123456' });
    } else {
      setFormData({ username: 'operator', password: '123456' });
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <h1>后台管理系统</h1>
          </div>
          <p className="subtitle">鳗鱼溯源平台管理端</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <Input
              placeholder="用户名"
              value={formData.username}
              onChange={v => setFormData(prev => ({ ...prev, username: v }))}
              clearable
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              placeholder="密码"
              value={formData.password}
              onChange={v => setFormData(prev => ({ ...prev, password: v }))}
              clearable
            />
          </div>

          <Button
            block
            color="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            className="login-btn"
          >
            登录
          </Button>

          <div className="demo-accounts">
            <p className="demo-title">演示账号：</p>
            <div className="account-buttons">
              <button
                className="demo-btn"
                onClick={() => fillDemoAccount('admin')}
              >
                管理员 (admin/123456)
              </button>
              <button
                className="demo-btn"
                onClick={() => fillDemoAccount('operator')}
              >
                运营 (operator/123456)
              </button>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 鳗知溯系统 v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;