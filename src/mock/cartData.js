/**
 * 购物车数据Mock
 * 模拟购物车的增删改查操作
 */

// 本地存储键名
const CART_STORAGE_KEY = 'fish_trace_cart';

/**
 * 获取购物车数据
 */
export const getCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('读取购物车失败:', e);
  }
  return [];
};

/**
 * 保存购物车数据
 */
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch (e) {
    console.error('保存购物车失败:', e);
    return false;
  }
};

/**
 * 添加商品到购物车
 */
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  
  // 检查是否已存在
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    // 已存在，增加数量
    cart[existingIndex].quantity += quantity;
  } else {
    // 不存在，添加新项
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      unit: product.unit,
      quantity: quantity,
      stock: product.stock,
      qrCode: product.qrCode,
      selected: true  // 默认选中
    });
  }
  
  saveCart(cart);
  return cart;
};

/**
 * 从购物车移除商品
 */
export const removeFromCart = (productId) => {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== productId);
  saveCart(filtered);
  return filtered;
};

/**
 * 更新购物车商品数量
 */
export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // 数量为0，移除商品
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = Math.min(quantity, cart[itemIndex].stock || 99);
    }
    saveCart(cart);
  }
  
  return cart;
};

/**
 * 切换商品选中状态
 */
export const toggleCartItemSelected = (productId) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex >= 0) {
    cart[itemIndex].selected = !cart[itemIndex].selected;
    saveCart(cart);
  }
  
  return cart;
};

/**
 * 全选/取消全选
 */
export const toggleSelectAll = (selected) => {
  const cart = getCart();
  cart.forEach(item => {
    item.selected = selected;
  });
  saveCart(cart);
  return cart;
};

/**
 * 获取选中的商品
 */
export const getSelectedItems = () => {
  const cart = getCart();
  return cart.filter(item => item.selected);
};

/**
 * 计算购物车总价（仅选中商品）
 */
export const getCartTotal = () => {
  const cart = getCart();
  return cart
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * 获取购物车商品总数
 */
export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * 获取选中商品数量
 */
export const getSelectedCount = () => {
  const cart = getCart();
  return cart
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * 清空购物车
 */
export const clearCart = () => {
  saveCart([]);
  return [];
};

/**
 * 清空选中的商品
 */
export const clearSelectedItems = () => {
  const cart = getCart();
  const remaining = cart.filter(item => !item.selected);
  saveCart(remaining);
  return remaining;
};

/**
 * 检查商品是否在购物车中
 */
export const isInCart = (productId) => {
  const cart = getCart();
  return cart.some(item => item.id === productId);
};

/**
 * 获取购物车中某商品的数量
 */
export const getItemQuantity = (productId) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  return item ? item.quantity : 0;
};

// 兼容旧代码
export const cartItems = getCart();