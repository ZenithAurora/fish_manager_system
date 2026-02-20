import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd-mobile';
import {
  LeftOutline,
  PhoneFill,
  MailFill,
  EnvironmentOutline,
  CheckCircleFill
} from 'antd-mobile-icons';
import fishLogo from '../../assets/img/fish.png';
import './index.scss';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '扫码溯源',
      desc: '一键扫描二维码，追溯鳗鱼从养殖到餐桌的完整链条'
    },
    {
      title: '商品购买',
      desc: '精选优质鳗鱼产品，支持在线下单，送货上门'
    },
    {
      title: '订单管理',
      desc: '实时查看订单状态，物流信息一目了然'
    },
    {
      title: '溯源记录',
      desc: '保存您的每一次溯源查询，随时回溯查看'
    },
    {
      title: '收藏功能',
      desc: '收藏喜欢的产品，便于下次快速购买'
    },
    {
      title: '数据可视化',
      desc: '直观展示溯源节点信息和供应链数据'
    }
  ];

  const contactInfo = [
    {
      icon: <PhoneFill />,
      label: '客服电话',
      value: '400-888-6688',
      color: '#7c3aed'
    },
    {
      icon: <MailFill />,
      label: '服务邮箱',
      value: 'service@eeltrace.com',
      color: '#2563eb'
    },
    {
      icon: <EnvironmentOutline />,
      label: '公司地址',
      value: '广东省广州市天河区科技园路88号',
      color: '#dc2626'
    }
  ];

  return (
    <div className="about-container">
      {/* 顶部导航 */}
      <div className="about-header">
        <div className="header-left" onClick={() => navigate(-1)}>
          <LeftOutline />
        </div>
        <h1 className="header-title">关于我们</h1>
        <div className="header-right"></div>
      </div>

      {/* Logo和系统名称 */}
      <div className="logo-section">
        <div className="logo-wrapper">
          <img src={fishLogo} alt="Logo" className="logo" />
        </div>
        <h2 className="system-name">鳗知溯系统</h2>
        <p className="version">Version 1.0.0</p>
      </div>

      {/* 系统简介 */}
      <div className="intro-card">
        <h3 className="card-title">系统简介</h3>
        <p className="intro-text">
          鳗知溯系统是一款专注于鳗鱼产品溯源的移动应用平台。
          我们致力于为消费者提供透明、可信的鳗鱼产品信息，
          通过区块链技术和物联网技术，实现从养殖、加工、
          运输到销售的全链条追溯，让每一条鳗鱼都有迹可循，
          让消费者吃得安心、放心。
        </p>
      </div>

      {/* 核心功能 */}
      <div className="features-card">
        <h3 className="card-title">核心功能</h3>
        <div className="features-list">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <CheckCircleFill className="feature-icon" />
              <div className="feature-content">
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系方式 */}
      <div className="contact-card">
        <h3 className="card-title">联系我们</h3>
        <div className="contact-list">
          {contactInfo.map((item, index) => (
            <div key={index} className="contact-item">
              <div className="contact-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="contact-content">
                <span className="contact-label">{item.label}</span>
                <span className="contact-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 技术支持 */}
      <div className="tech-card">
        <h3 className="card-title">技术支持</h3>
        <div className="tech-content">
          <p className="tech-item">
            <span className="tech-label">核心技术：</span>
            <span className="tech-value">区块链 + 物联网 + 大数据</span>
          </p>
          <p className="tech-item">
            <span className="tech-label">数据安全：</span>
            <span className="tech-value">分布式存储，不可篡改</span>
          </p>
          <p className="tech-item">
            <span className="tech-label">实时追踪：</span>
            <span className="tech-value">全程可视化监控</span>
          </p>
        </div>
      </div>

      {/* 版权声明 */}
      <div className="copyright-card">
        <p className="copyright-text">
          © 2024-2026 鳗知溯系统
        </p>
        <p className="copyright-text">
          版权所有 · 保留所有权利
        </p>
        <p className="copyright-desc">
          未经许可，禁止复制、传播或使用本系统任何内容
        </p>
      </div>
    </div>
  );
};

export default About;