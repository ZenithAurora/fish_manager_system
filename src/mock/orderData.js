/**
 * 订单数据Mock
 * 模拟订单的创建、查询、管理
 */

// 本地存储键名
const ORDERS_STORAGE_KEY = 'fish_trace_orders';

/**
 * 订单状态枚举
 */
export const OrderStatus = {
  PENDING_PAYMENT: 'pending_payment',   // 待支付
  PAID: 'paid',                         // 已支付
  SHIPPING: 'shipping',                 // 配送中
  DELIVERED: 'delivered',               // 已送达
  COMPLETED: 'completed',               // 已完成
  CANCELLED: 'cancelled'                // 已取消
};

/**
 * 订单状态文本映射
 */
export const OrderStatusText = {
  [OrderStatus.PENDING_PAYMENT]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.SHIPPING]: '配送中',
  [OrderStatus.DELIVERED]: '已送达',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消'
};

/**
 * 订单状态颜色映射
 */
export const OrderStatusColor = {
  [OrderStatus.PENDING_PAYMENT]: '#f59e0b',
  [OrderStatus.PAID]: '#3b82f6',
  [OrderStatus.SHIPPING]: '#8b5cf6',
  [OrderStatus.DELIVERED]: '#10b981',
  [OrderStatus.COMPLETED]: '#6b7280',
  [OrderStatus.CANCELLED]: '#ef4444'
};

/**
 * 获取所有订单
 */
export const getOrders = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('读取订单失败:', e);
  }
  return [];
};

/**
 * 保存订单列表
 */
const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return true;
  } catch (e) {
    console.error('保存订单失败:', e);
    return false;
  }
};

/**
 * 生成订单号
 */
const generateOrderNo = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MZS${timestamp.slice(-10)}${random}`;
};

/**
 * 创建新订单
 */
export const createOrder = (items, address, remark = '') => {
  const orders = getOrders();
  
  // 计算订单金额
  const totalAmount = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  
  const newOrder = {
    id: generateOrderNo(),
    items: items.map(item => ({
      fishId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      qrCode: item.qrCode
    })),
    totalAmount: totalAmount,
    status: OrderStatus.PENDING_PAYMENT,
    address: address,
    remark: remark,
    createdAt: new Date().toISOString(),
    paidAt: null,
    shippedAt: null,
    deliveredAt: null,
    completedAt: null
  };
  
  orders.unshift(newOrder);
  saveOrders(orders);
  
  return newOrder;
};

/**
 * 支付订单（模拟）
 */
export const payOrder = (orderId) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return { success: false, message: '订单不存在' };
  }
  
  if (orders[orderIndex].status !== OrderStatus.PENDING_PAYMENT) {
    return { success: false, message: '订单状态异常' };
  }
  
  orders[orderIndex].status = OrderStatus.PAID;
  orders[orderIndex].paidAt = new Date().toISOString();
  
  // 模拟1秒后自动发货
  setTimeout(() => {
    shipOrder(orderId);
  }, 1000);
  
  saveOrders(orders);
  return { success: true, order: orders[orderIndex] };
};

/**
 * 发货（模拟）
 */
export const shipOrder = (orderId) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex >= 0 && orders[orderIndex].status === OrderStatus.PAID) {
    orders[orderIndex].status = OrderStatus.SHIPPING;
    orders[orderIndex].shippedAt = new Date().toISOString();
    saveOrders(orders);
  }
};

/**
 * 确认收货
 */
export const confirmDelivery = (orderId) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return { success: false, message: '订单不存在' };
  }
  
  orders[orderIndex].status = OrderStatus.COMPLETED;
  orders[orderIndex].completedAt = new Date().toISOString();
  saveOrders(orders);
  
  return { success: true, order: orders[orderIndex] };
};

/**
 * 取消订单
 */
export const cancelOrder = (orderId) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) {
    return { success: false, message: '订单不存在' };
  }
  
  if (orders[orderIndex].status !== OrderStatus.PENDING_PAYMENT) {
    return { success: false, message: '该订单状态不可取消' };
  }
  
  orders[orderIndex].status = OrderStatus.CANCELLED;
  saveOrders(orders);
  
  return { success: true, order: orders[orderIndex] };
};

/**
 * 根据ID获取订单
 */
export const getOrderById = (orderId) => {
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
};

/**
 * 根据用户ID获取订单（模拟，实际返回所有订单）
 */
export const getOrdersByUserId = (userId) => {
  return getOrders();
};

/**
 * 根据状态筛选订单
 */
export const getOrdersByStatus = (status) => {
  const orders = getOrders();
  if (status === 'all') return orders;
  return orders.filter(o => o.status === status);
};

/**
 * 删除订单
 */
export const deleteOrder = (orderId) => {
  const orders = getOrders();
  const filtered = orders.filter(o => o.id !== orderId);
  saveOrders(filtered);
  return true;
};

/**
 * 清空所有订单
 */
export const clearAllOrders = () => {
  saveOrders([]);
  return true;
};

// 兼容旧代码的导出
export const orders = getOrders();
export const addOrder = createOrder;