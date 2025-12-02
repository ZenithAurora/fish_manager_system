import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const Authorization = () => {
  const navigate = useNavigate();

  // 模拟用户信息
  const userInfo = {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    nickname: '星辰',
  };

  // 处理取消授权
  const handleCancel = () => {
    // 可以在这里添加取消授权的逻辑
    console.log('用户取消授权');
    navigate('/');
  };

  // 处理允许授权
  const handleAllow = () => {
    // 可以在这里添加获取用户信息的逻辑
    console.log('用户允许授权', userInfo);
    // 存储用户信息到localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('isAuthorized', 'true');
    navigate('/');
  };

  return (
    <div className="authorization-container">
      <div className="authorization-content">
        <div className="app-info">
          <div className="app-logo">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-26f81728197c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80" 
              alt="链上鳗香小程序" 
            />
          </div>
          <h3 className="app-name">链上鳗香小程序</h3>
        </div>

        <div className="auth-info">
          <p className="auth-text">获取您的昵称、头像、地区及性别</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <img 
              src={userInfo.avatar} 
              alt={userInfo.nickname} 
            />
          </div>
          <div className="user-details">
            <p className="user-name">{userInfo.nickname}</p>
            <p className="user-tag">微信个人信息</p>
          </div>
        </div>

        <div className="auth-buttons">
          <button 
            className="btn btn-secondary" 
            onClick={handleCancel}
          >
            取消
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleAllow}
          >
            允许
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
