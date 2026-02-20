import React, { useState, useEffect } from 'react';
import { NavBar, Button, Empty, Dialog, Toast, Image } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { DeleteOutline, ScanCodeOutline } from 'antd-mobile-icons';
import './index.scss';

// 导入Mock数据
import { getTraceHistory, clearTraceHistory } from '../../mock/userData';

const TraceHistory = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载溯源历史
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setLoading(true);
    // 模拟异步加载
    setTimeout(() => {
      const history = getTraceHistory();
      setHistoryList(history);
      setLoading(false);
    }, 300);
  };

  // 返回
  const handleBack = () => {
    navigate(-1);
  };

  // 点击记录，跳转到溯源详情
  const handleRecordClick = (record) => {
    // 将鱼的信息存储到localStorage，供扫码结果页使用
    const fishData = {
      id: record.fishId,
      name: record.fishName,
      image: record.fishImage,
      origin: record.origin,
      qrCode: record.qrCode
    };
    localStorage.setItem('currentScanProduct', JSON.stringify(fishData));
    navigate('/scan-result');
  };

  // 清空历史记录
  const handleClearHistory = () => {
    Dialog.confirm({
      content: '确定要清空所有溯源记录吗？',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: () => {
        clearTraceHistory();
        setHistoryList([]);
        Toast.show({
          icon: 'success',
          content: '已清空历史记录'
        });
      }
    });
  };

  // 跳转到扫码页
  const handleGoScan = () => {
    navigate('/qrcode-scanner');
  };

  // 格式化时间
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diff / (1000 * 60));
        if (diffMinutes === 0) {
          return '刚刚';
        }
        return `${diffMinutes}分钟前`;
      }
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  // 空状态
  if (!loading && historyList.length === 0) {
    return (
      <div className="trace-history-page">
        <NavBar onBack={handleBack} className="history-nav">
          溯源记录
        </NavBar>
        <div className="empty-container">
          <Empty
            imageStyle={{ width: 120 }}
            description={
              <div className="empty-text">
                <p>暂无溯源记录</p>
                <p className="empty-tip">扫描鳗鱼二维码查看溯源信息</p>
              </div>
            }
          />
          <Button
            color="primary"
            size="large"
            className="scan-button"
            onClick={handleGoScan}
          >
            <ScanCodeOutline /> 立即扫码
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="trace-history-page">
      {/* 导航栏 */}
      <NavBar 
        onBack={handleBack} 
        className="history-nav"
        right={
          historyList.length > 0 && (
            <div className="nav-actions" onClick={handleClearHistory}>
              <DeleteOutline fontSize={20} />
              <span>清空</span>
            </div>
          )
        }
      >
        溯源记录
      </NavBar>

      {/* 记录列表 */}
      <div className="history-content">
        <div className="record-count">
          共 <span className="count-num">{historyList.length}</span> 条记录
        </div>

        <div className="history-list">
          {historyList.map((record) => (
            <div 
              key={record.id} 
              className="history-item"
              onClick={() => handleRecordClick(record)}
            >
              <div className="item-image">
                <Image
                  src={record.fishImage}
                  fit="cover"
                  lazy
                />
              </div>
              
              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-title">{record.fishName}</h3>
                  <span className="item-time">{formatTime(record.scanTime)}</span>
                </div>
                
                <div className="item-info">
                  <div className="info-row">
                    <span className="info-label">产地：</span>
                    <span className="info-value">{record.origin}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">批次号：</span>
                    <span className="info-value">{record.fishId}</span>
                  </div>
                </div>
              </div>

              <div className="item-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部扫码按钮 */}
      <div className="bottom-action">
        <Button
          color="primary"
          size="large"
          className="scan-button"
          onClick={handleGoScan}
        >
          <ScanCodeOutline /> 扫码溯源
        </Button>
      </div>
    </div>
  );
};

export default TraceHistory;