import React, { useState } from 'react';
import { SearchOutline, MoreOutline, TruckOutline, CheckCircleOutline, ClockCircleOutline, CloseCircleOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const OrderHistory = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();
  
  // 跳转到商品详情
  const navigateToProductDetail = (item) => {
    navigate('/product-detail', {
      state: { 
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          specs: item.specs,
          origin: '四川省江安县',
          description: `这是${item.name}的详细描述，品质保证，溯源可信。`,
          detailInfo: `本产品来自优质产地，经过严格的质量检测，确保安全卫生。我们承诺提供最优质的产品和服务，让您买得放心，吃得安心。`
        }
      }
    });
  };

  // 订单状态选项
  const statusOptions = [
    { id: 'all', name: '全部', icon: <MoreOutline /> },
    { id: 'pending', name: '待付款', icon: <ClockCircleOutline /> },
    { id: 'paid', name: '待发货', icon: <ClockCircleOutline /> },
    { id: 'shipped', name: '已发货', icon: <TruckOutline /> },
    { id: 'completed', name: '已完成', icon: <CheckCircleOutline /> },
    { id: 'cancelled', name: '已取消', icon: <CloseCircleOutline /> },
  ];

  // 订单数据
  const orders = [
    {
      id: 'ORD20241215001',
      date: '2024-12-15 14:30',
      status: 'completed',
      totalAmount: 298,
      items: [
        {
          id: 1,
          name: '精品鳗鱼礼包',
          price: 298,
          quantity: 1,
          image: '/src/assets/img/shopping/fish5.webp',
          specs: '礼盒装 500g'
        }
      ],
      shippingAddress: {
        name: '张三',
        phone: '138****1234',
        address: '北京市朝阳区建国门外大街1号'
      },
      trackingNumber: 'SF1234567890'
    },
    {
      id: 'ORD20241214002',
      date: '2024-12-14 10:15',
      status: 'shipped',
      totalAmount: 198,
      items: [
        {
          id: 3,
          name: '鳗鱼寿司礼盒',
          price: 198,
          quantity: 1,
          image: '/src/assets/img/shopping/fish3.webp',
          specs: '礼盒装 300g'
        }
      ],
      shippingAddress: {
        name: '李四',
        phone: '139****5678',
        address: '上海市浦东新区陆家嘴金融中心'
      },
      trackingNumber: 'YT9876543210'
    },
    {
      id: 'ORD20241213003',
      date: '2024-12-13 16:45',
      status: 'paid',
      totalAmount: 256,
      items: [
        {
          id: 1,
          name: '优质鳗鱼',
          price: 128,
          quantity: 2,
          image: '/src/assets/img/shopping/fish1.jpg',
          specs: '鲜活 800g'
        }
      ],
      shippingAddress: {
        name: '王五',
        phone: '137****9012',
        address: '广州市天河区珠江新城'
      },
      trackingNumber: null
    },
    {
      id: 'ORD20241212004',
      date: '2024-12-12 09:20',
      status: 'pending',
      totalAmount: 89,
      items: [
        {
          id: 2,
          name: '冷冻鳗鱼段',
          price: 89,
          quantity: 1,
          image: '/src/assets/img/shopping/fish2.jpg',
          specs: '冷冻 500g'
        }
      ],
      shippingAddress: {
        name: '赵六',
        phone: '136****3456',
        address: '深圳市南山区科技园'
      },
      trackingNumber: null
    },
    {
      id: 'ORD20241211005',
      date: '2024-12-11 11:30',
      status: 'cancelled',
      totalAmount: 136,
      items: [
        {
          id: 4,
          name: '鳗鱼干',
          price: 68,
          quantity: 2,
          image: '/src/assets/img/shopping/fish4.webp',
          specs: '袋装 200g'
        }
      ],
      shippingAddress: {
        name: '钱七',
        phone: '135****7890',
        address: '杭州市西湖区文三路'
      },
      trackingNumber: null
    }
  ];

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // 获取状态显示文本和颜色
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: '待付款', color: '#ff9500', bgColor: '#fff6e6' },
      paid: { text: '待发货', color: '#1890ff', bgColor: '#e6f7ff' },
      shipped: { text: '已发货', color: '#52c41a', bgColor: '#f6ffed' },
      completed: { text: '已完成', color: '#52c41a', bgColor: '#f6ffed' },
      cancelled: { text: '已取消', color: '#ff4d4f', bgColor: '#fff2f0' }
    };
    return statusMap[status] || { text: '未知', color: '#999', bgColor: '#f5f5f5' };
  };

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancelOrder = (orderId) => {
    // 这里可以添加取消订单的逻辑
    alert(`取消订单: ${orderId}`);
  };

  const handleConfirmReceipt = (orderId) => {
    // 这里可以添加确认收货的逻辑
    alert(`确认收货: ${orderId}`);
  };

  return (
    <div className="order-history-container">
      {/* 顶部搜索栏 */}
      <div className="order-header">
        <div className="search-bar">
          <SearchOutline className="search-icon" />
          <input
            type="text"
            placeholder="搜索订单号或商品名称..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* 状态筛选 */}
      <div className="status-filter">
        <div className="status-scroll">
          {statusOptions.map(status => (
            <div
              key={status.id}
              className={`status-item ${selectedStatus === status.id ? 'active' : ''}`}
              onClick={() => setSelectedStatus(status.id)}
            >
              <span className="status-icon">{status.icon}</span>
              <span className="status-name">{status.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 订单列表 */}
      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p className="empty-text">暂无订单</p>
            <p className="empty-desc">快去商城选购心仪的商品吧</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const isExpanded = expandedOrder === order.id;
            
            return (
              <div key={order.id} className="order-card">
                {/* 订单头部 */}
                <div className="order-header-info">
                  <div className="order-meta">
                    <span className="order-id">订单号: {order.id}</span>
                    <span className="order-date">{order.date}</span>
                  </div>
                  <div 
                    className="order-status"
                    style={{ 
                      color: statusInfo.color, 
                      backgroundColor: statusInfo.bgColor 
                    }}
                  >
                    {statusInfo.text}
                  </div>
                </div>

                {/* 商品信息 */}
                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div 
                    className="item-info"
                    onClick={() => navigateToProductDetail(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-specs">{item.specs}</p>
                    <div className="item-price">
                      <span className="price">¥{item.price}</span>
                      <span className="quantity">x{item.quantity}</span>
                    </div>
                  </div>
                    </div>
                  ))}
                </div>

                {/* 订单总计 */}
                <div className="order-total">
                  <span>共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品</span>
                  <span className="total-amount">合计: ¥{order.totalAmount}</span>
                </div>

                {/* 操作按钮 */}
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button 
                      className="btn btn-cancel"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      取消订单
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button 
                      className="btn btn-confirm"
                      onClick={() => handleConfirmReceipt(order.id)}
                    >
                      确认收货
                    </button>
                  )}
                  <button 
                    className="btn btn-detail"
                    onClick={() => handleToggleExpand(order.id)}
                  >
                    {isExpanded ? '收起详情' : '查看详情'}
                  </button>
                </div>

                {/* 订单详情 */}
                {isExpanded && (
                  <div className="order-details">
                    <div className="detail-section">
                      <h5>收货信息</h5>
                      <p>{order.shippingAddress.name} {order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.address}</p>
                    </div>
                    {order.trackingNumber && (
                      <div className="detail-section">
                        <h5>物流信息</h5>
                        <p>快递单号: {order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistory;