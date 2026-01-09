import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, Dialog } from 'antd-mobile';
import { 
  LeftOutline, 
  SearchOutline,
  ScanCodeOutline
} from 'antd-mobile-icons';
import { 
  getOrders, 
  OrderStatus, 
  OrderStatusText, 
  OrderStatusColor, 
  confirmDelivery, 
  cancelOrder 
} from '../../mock/orderData';
import './index.scss';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // 状态筛选选项
  const statusTabs = [
    { key: 'all', label: '全部' },
    { key: OrderStatus.PENDING_PAYMENT, label: '待支付' },
    { key: OrderStatus.SHIPPING, label: '配送中' },
    { key: OrderStatus.COMPLETED, label: '已完成' },
  ];

  // 加载订单数据
  const loadOrders = useCallback(() => {
    const allOrders = getOrders();
    setOrders(allOrders);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 筛选订单
  useEffect(() => {
    let result = [...orders];
    
    // 状态筛选
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }
    
    // 搜索筛选
    if (searchValue.trim()) {
      const keyword = searchValue.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(keyword) ||
        order.items.some(item => item.name.toLowerCase().includes(keyword))
      );
    }
    
    setFilteredOrders(result);
  }, [orders, activeTab, searchValue]);

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 取消订单
  const handleCancelOrder = async (orderId) => {
    const result = await Dialog.confirm({
      content: '确定要取消该订单吗？',
      confirmText: '确定取消',
      cancelText: '再想想',
    });
    
    if (result) {
      const res = cancelOrder(orderId);
      if (res.success) {
        Toast.show({ content: '订单已取消', icon: 'success' });
        loadOrders();
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    }
  };

  // 确认收货
  const handleConfirmDelivery = async (orderId) => {
    const result = await Dialog.confirm({
      content: '确认已收到商品？',
      confirmText: '确认收货',
      cancelText: '取消',
    });
    
    if (result) {
      const res = confirmDelivery(orderId);
      if (res.success) {
        Toast.show({ content: '已确认收货', icon: 'success' });
        loadOrders();
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    }
  };

  // 查看溯源
  const handleViewTrace = (item) => {
    if (item.qrCode) {
      navigate('/scanner-result', { state: { qrCode: item.qrCode } });
    } else {
      Toast.show({ content: '该商品暂无溯源信息', icon: 'fail' });
    }
  };

  // 展开/收起订单详情
  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // 格式化时间
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 渲染订单操作按钮
  const renderOrderActions = (order) => {
    const actions = [];
    
    if (order.status === OrderStatus.PENDING_PAYMENT) {
      actions.push(
        <button 
          key="cancel" 
          className="action-btn cancel"
          onClick={() => handleCancelOrder(order.id)}
        >
          取消订单
        </button>
      );
      actions.push(
        <button 
          key="pay" 
          className="action-btn primary"
          onClick={() => Toast.show({ content: '支付功能开发中', icon: 'fail' })}
        >
          去支付
        </button>
      );
    }
    
    if (order.status === OrderStatus.SHIPPING || order.status === OrderStatus.DELIVERED) {
      actions.push(
        <button 
          key="confirm" 
          className="action-btn primary"
          onClick={() => handleConfirmDelivery(order.id)}
        >
          确认收货
        </button>
      );
    }
    
    return actions;
  };

  return (
    <div className="order-history-container">
      {/* 顶部导航栏 */}
      <div className="nav-header">
        <div className="nav-back" onClick={handleBack}>
          <LeftOutline />
        </div>
        <h1 className="nav-title">订单历史</h1>
        <div className="nav-placeholder"></div>
      </div>

      {/* 搜索栏 */}
      <div className="search-section">
        <div className="search-box">
          <SearchOutline className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="搜索订单号或商品名称"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* 状态筛选 */}
      <div className="status-tabs">
        {statusTabs.map(tab => (
          <div
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* 订单列表 */}
      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="empty-title">暂无订单</p>
            <p className="empty-desc">快去商城选购心仪的商品吧</p>
            <button 
              className="empty-btn"
              onClick={() => navigate('/mall')}
            >
              去逛逛
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              {/* 订单头部 */}
              <div className="order-header">
                <span className="order-id">订单号：{order.id}</span>
                <span 
                  className="order-status"
                  style={{ color: OrderStatusColor[order.status] }}
                >
                  {OrderStatusText[order.status]}
                </span>
              </div>

              {/* 商品列表 */}
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="item-image"
                    />
                    <div className="item-info">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-specs">{item.unit}</p>
                      <div className="item-bottom">
                        <span className="item-price">¥{item.price}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                    </div>
                    {item.qrCode && (
                      <div 
                        className="trace-btn"
                        onClick={() => handleViewTrace(item)}
                      >
                        <ScanCodeOutline />
                        <span>溯源</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 订单金额 */}
              <div className="order-amount">
                <span className="amount-label">
                  共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品
                </span>
                <span className="amount-value">
                  合计：<em>¥{order.totalAmount.toFixed(2)}</em>
                </span>
              </div>

              {/* 订单时间 */}
              <div 
                className="order-time"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <span>下单时间：{formatDate(order.createdAt)}</span>
                <span className="expand-hint">
                  {expandedOrderId === order.id ? '收起详情' : '查看详情'}
                </span>
              </div>

              {/* 展开详情 */}
              {expandedOrderId === order.id && (
                <div className="order-details">
                  {order.address && (
                    <div className="detail-item">
                      <span className="detail-label">收货地址：</span>
                      <span className="detail-value">
                        {order.address.name} {order.address.phone}<br />
                        {order.address.address}
                      </span>
                    </div>
                  )}
                  {order.paidAt && (
                    <div className="detail-item">
                      <span className="detail-label">支付时间：</span>
                      <span className="detail-value">{formatDate(order.paidAt)}</span>
                    </div>
                  )}
                  {order.shippedAt && (
                    <div className="detail-item">
                      <span className="detail-label">发货时间：</span>
                      <span className="detail-value">{formatDate(order.shippedAt)}</span>
                    </div>
                  )}
                  {order.completedAt && (
                    <div className="detail-item">
                      <span className="detail-label">完成时间：</span>
                      <span className="detail-value">{formatDate(order.completedAt)}</span>
                    </div>
                  )}
                  {order.remark && (
                    <div className="detail-item">
                      <span className="detail-label">订单备注：</span>
                      <span className="detail-value">{order.remark}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="order-actions">
                {renderOrderActions(order)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;