import { useState, useEffect } from 'react';
import { Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../mock/authService';
import { mockUser, saveUser } from '../../mock/userData';
import fishLogo from '../../assets/img/fish.png';
import './index.scss';

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('phone'); // phone | username
  const [loading, setLoading] = useState(false);
  
  // 手机号登录状态
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 账号密码登录状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 检查登录状态
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // 倒计时逻辑
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({ content: '请输入正确的手机号'});
      return;
    }

    setLoading(true);
    // 直接模拟发送成功，不再调用 mock 接口
    setTimeout(() => {
      Toast.show({ 
        content: `验证码已发送：123456`,
        duration: 2000 
      });
      setCountdown(60);
      setLoading(false);
    }, 500);
  };

  // 手机号登录
  const handlePhoneLogin = async () => {
    if (!phone || !verifyCode) {
      Toast.show('请填写完整信息');
      return;
    }
    
    // 简化逻辑：只要验证码是 123456 即可
    if (verifyCode !== '123456') {
       Toast.show({ content: '验证码错误'});
       return;
    }

    setLoading(true);
    setTimeout(() => {
      // 模拟登录成功，保存用户状态
      const user = { ...mockUser, phone, isLoggedIn: true };
      saveUser(user);
      
      Toast.show({ content: '登录成功'});
      localStorage.setItem('isAuthorized', 'true');
      navigate('/', { replace: true });
      setLoading(false);
    }, 500);
  };

  // 账号密码登录
  const handleUsernameLogin = async () => {
    if (!username || !password) {
      Toast.show('请输入账号和密码');
      return;
    }

    // 简化逻辑：固定账号 admin / 123456
    if (username === 'admin' && password === '123456') {
      setLoading(true);
      setTimeout(() => {
        const user = { ...mockUser, username: 'admin', isLoggedIn: true };
        saveUser(user);
        
        Toast.show({ content: '登录成功'});
        localStorage.setItem('isAuthorized', 'true');
        navigate('/', { replace: true });
        setLoading(false);
      }, 500);
    } else {
      Toast.show({ content: '账号或密码错误', icon: 'fail' });
    }
  };

  return (
    <div className="login-page">
      {/* 头部Logo区 */}
      <div className="login-header">
        <div className="app-logo">
          <img src={fishLogo} alt="Logo" className='logo'/>
        </div>
        <h1>欢迎回来</h1>
        <p>登录鳗知溯，开启溯源之旅</p>
      </div>

      {/* 登录卡片 */}
      <div className="login-card">
        {/* 切换Tab */}
        <div className="tab-switch">
          <div 
            className={`tab-item ${loginType === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginType('phone')}
          >
            手机号登录
          </div>
          <div 
            className={`tab-item ${loginType === 'username' ? 'active' : ''}`}
            onClick={() => setLoginType('username')}
          >
            账号密码
          </div>
        </div>

        {/* 手机号登录表单 */}
        {loginType === 'phone' && (
          <div className="login-form">
            <div className="form-item">
              <label>手机号码</label>
              <Input
                placeholder="请输入手机号"
                value={phone}
                onChange={setPhone}
                type="tel"
                clearable
              />
            </div>
            <div className="form-item">
              <label>验证码</label>
              <div className="verify-code-group">
                <Input
                  placeholder="请输入验证码"
                  value={verifyCode}
                  onChange={setVerifyCode}
                  maxLength={6}
                  type="number"
                />
                <Button 
                  size="small" 
                  color="primary" 
                  fill="outline"
                  className="code-btn"
                  disabled={countdown > 0 || !phone}
                  onClick={handleSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </div>
            </div>
            
            <Button 
              block 
              color="primary" 
              className="submit-btn"
              loading={loading}
              onClick={handlePhoneLogin}
              ripple={false} 
            >
              登 录
            </Button>
          </div>
        )}

        {/* 账号密码登录表单 */}
        {loginType === 'username' && (
          <div className="login-form">
            <div className="form-item">
              <label>账号</label>
              <Input
                placeholder="请输入用户名"
                value={username}
                onChange={setUsername}
                clearable
              />
            </div>
            <div className="form-item">
              <label>密码</label>
              <Input
                placeholder="请输入密码"
                type="password"
                value={password}
                onChange={setPassword}
                clearable
              />
            </div>

            <Button 
              block 
              color="primary" 
              className="submit-btn"
              loading={loading}
              onClick={handleUsernameLogin}
            >
              登 录
            </Button>
          </div>
        )}
      </div>

      {/* 底部协议 */}
      <div className="login-footer">
        <p>
          登录即代表同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
        </p>
      </div>
    </div>
  );
};

export default Login;