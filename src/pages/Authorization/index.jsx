import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Toast, PasscodeInput } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { mockSendCode, mockLogin, mockRegister, MOCK_VERIFY_CODE, isLoggedIn } from '../../mock/authService';
import { getCurrentUser } from '../../mock/userData';
import './index.scss';

const Authorization = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // login | verify | profile
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nickname: '',
    payPassword: '',
    confirmPassword: ''
  });
  const countdownRef = useRef(null);

  // 检查是否已登录
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      if (user.isNewUser) {
        setStep('profile');
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      Toast.show({ content: '请输入正确的手机号', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      await mockSendCode(phone);
      Toast.show({ 
        content: `验证码已发送\n演示验证码：${MOCK_VERIFY_CODE}`,
        duration: 3000
      });
      setCountdown(60);
      setStep('verify');
    } catch (error) {
      Toast.show({ content: error.message, icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  // 验证登录
  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      Toast.show({ content: '请输入6位验证码', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      const result = await mockLogin(phone, verifyCode);
      Toast.show({ content: '登录成功', icon: 'success' });
      
      if (result.isNewUser) {
        setStep('profile');
      } else {
        localStorage.setItem('isAuthorized', 'true');
        navigate('/', { replace: true });
      }
    } catch (error) {
      Toast.show({ content: error.message, icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  // 完善资料
  const handleCompleteProfile = async () => {
    const { nickname, payPassword, confirmPassword } = profileForm;

    if (!nickname || nickname.trim().length < 2) {
      Toast.show({ content: '昵称至少2个字符', icon: 'fail' });
      return;
    }

    if (!/^\d{6}$/.test(payPassword)) {
      Toast.show({ content: '请设置6位数字支付密码', icon: 'fail' });
      return;
    }

    if (payPassword !== confirmPassword) {
      Toast.show({ content: '两次密码输入不一致', icon: 'fail' });
      return;
    }

    setLoading(true);
    try {
      await mockRegister({
        nickname: nickname.trim(),
        payPassword: payPassword
      });
      Toast.show({ content: '注册成功', icon: 'success' });
      localStorage.setItem('isAuthorized', 'true');
      navigate('/', { replace: true });
    } catch (error) {
      Toast.show({ content: error.message, icon: 'fail' });
    } finally {
      setLoading(false);
    }
  };

  // 渲染登录步骤
  const renderLoginStep = () => (
    <div className="auth-step login-step">
      <div className="step-header">
        <h2>手机号登录</h2>
        <p>首次登录将自动注册</p>
      </div>

      <div className="form-group">
        <div className="phone-input-wrapper">
          <span className="country-code">+86</span>
          <Input
            className="phone-input"
            placeholder="请输入手机号"
            type="tel"
            maxLength={11}
            value={phone}
            onChange={setPhone}
            clearable
          />
        </div>
      </div>

      <Button
        block
        color="primary"
        size="large"
        className="submit-btn"
        loading={loading}
        disabled={!phone || phone.length !== 11}
        onClick={handleSendCode}
      >
        获取验证码
      </Button>

      <div className="demo-hint">
        <span>🎯 演示提示：验证码固定为 {MOCK_VERIFY_CODE}</span>
      </div>
    </div>
  );

  // 渲染验证码步骤
  const renderVerifyStep = () => (
    <div className="auth-step verify-step">
      <div className="step-header">
        <h2>输入验证码</h2>
        <p>验证码已发送至 {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</p>
      </div>

      <div className="code-input-wrapper">
        <PasscodeInput
          length={6}
          value={verifyCode}
          onChange={setVerifyCode}
          onFill={handleVerify}
          seperated
          className="verify-code-input"
        />
      </div>

      <div className="resend-wrapper">
        {countdown > 0 ? (
          <span className="countdown">{countdown}秒后可重新获取</span>
        ) : (
          <Button
            fill="none"
            color="primary"
            onClick={handleSendCode}
            loading={loading}
          >
            重新获取验证码
          </Button>
        )}
      </div>

      <Button
        block
        color="primary"
        size="large"
        className="submit-btn"
        loading={loading}
        disabled={verifyCode.length !== 6}
        onClick={handleVerify}
      >
        登录
      </Button>

      <Button
        block
        fill="none"
        className="back-btn"
        onClick={() => {
          setStep('login');
          setVerifyCode('');
        }}
      >
        返回修改手机号
      </Button>
    </div>
  );

  // 渲染完善资料步骤
  const renderProfileStep = () => (
    <div className="auth-step profile-step">
      <div className="step-header">
        <h2>完善个人信息</h2>
        <p>设置您的昵称和支付密码</p>
      </div>

      <div className="form-group">
        <label>昵称</label>
        <Input
          placeholder="请输入昵称（2-12字符）"
          maxLength={12}
          value={profileForm.nickname}
          onChange={v => setProfileForm(prev => ({ ...prev, nickname: v }))}
          clearable
        />
      </div>

      <div className="form-group">
        <label>支付密码</label>
        <Input
          type="password"
          placeholder="请设置6位数字支付密码"
          maxLength={6}
          value={profileForm.payPassword}
          onChange={v => setProfileForm(prev => ({ ...prev, payPassword: v.replace(/\D/g, '') }))}
        />
      </div>

      <div className="form-group">
        <label>确认密码</label>
        <Input
          type="password"
          placeholder="请再次输入支付密码"
          maxLength={6}
          value={profileForm.confirmPassword}
          onChange={v => setProfileForm(prev => ({ ...prev, confirmPassword: v.replace(/\D/g, '') }))}
        />
      </div>

      <Button
        block
        color="primary"
        size="large"
        className="submit-btn"
        loading={loading}
        onClick={handleCompleteProfile}
      >
        完成注册
      </Button>
    </div>
  );

  return (
    <div className="authorization-page">
      {/* 背景装饰 */}
      <div className="auth-background">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      {/* Logo区域 */}
      <div className="auth-logo">
        <div className="logo-wrapper">
          <div className="logo-icon">🐟</div>
          <h1 className="logo-text">鳗知溯</h1>
          <p className="logo-slogan">AI赋能 · 一码知源</p>
        </div>
      </div>

      {/* 表单卡片 */}
      <div className="auth-card">
        {/* 步骤指示器 */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 'login' ? 'active' : 'done'}`}>1</div>
          <div className={`step-line ${step !== 'login' ? 'done' : ''}`}></div>
          <div className={`step-dot ${step === 'verify' ? 'active' : step === 'profile' ? 'done' : ''}`}>2</div>
          <div className={`step-line ${step === 'profile' ? 'done' : ''}`}></div>
          <div className={`step-dot ${step === 'profile' ? 'active' : ''}`}>3</div>
        </div>

        {/* 内容区域 */}
        {step === 'login' && renderLoginStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'profile' && renderProfileStep()}
      </div>

      {/* 底部协议 */}
      <div className="auth-footer">
        <p>
          登录即表示同意
          <a href="#" onClick={(e) => { e.preventDefault(); Toast.show('用户协议'); }}>《用户协议》</a>
          和
          <a href="#" onClick={(e) => { e.preventDefault(); Toast.show('隐私政策'); }}>《隐私政策》</a>
        </p>
      </div>
    </div>
  );
};

export default Authorization;