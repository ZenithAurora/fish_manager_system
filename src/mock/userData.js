/**
 * 用户数据Mock
 * 模拟用户信息管理
 */

import avatarImg from '../assets/img/user/avatar.jpg';

// 本地存储键名
const USER_STORAGE_KEY = 'fish_trace_user';
const TRACE_HISTORY_KEY = 'fish_trace_history';

/**
 * 默认用户数据
 */
const defaultUser = {
  id: 'USER001',
  phone: '',
  nickname: '新用户',
  avatar: avatarImg,
  payPassword: '',
  isLoggedIn: false,
  createdAt: null,
  // 用户偏好设置
  preferences: {
    notifications: true,
    autoPlay: false,
    theme: 'light'
  },
  // 用户统计
  stats: {
    totalOrders: 0,
    totalSpent: 0,
    traceCount: 0,
    favoriteCount: 0
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('读取用户信息失败:', e);
  }
  return { ...defaultUser };
};

/**
 * 保存用户信息
 */
export const saveUser = (userData) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    return true;
  } catch (e) {
    console.error('保存用户信息失败:', e);
    return false;
  }
};

/**
 * 更新用户信息（部分更新）
 */
export const updateUserInfo = (updates) => {
  const currentUser = getCurrentUser();
  const updatedUser = {
    ...currentUser,
    ...updates,
    stats: {
      ...currentUser.stats,
      ...(updates.stats || {})
    },
    preferences: {
      ...currentUser.preferences,
      ...(updates.preferences || {})
    }
  };
  saveUser(updatedUser);
  return updatedUser;
};

/**
 * 设置支付密码
 */
export const setPayPassword = (password) => {
  return updateUserInfo({ payPassword: password });
};

/**
 * 验证支付密码
 */
export const checkPayPassword = (password) => {
  const user = getCurrentUser();
  // 如果用户没有设置支付密码，默认使用 123456
  const payPwd = user.payPassword || '123456';
  return payPwd === password;
};

/**
 * 用户登出
 */
export const logoutUser = () => {
  const user = getCurrentUser();
  user.isLoggedIn = false;
  saveUser(user);
  return user;
};

/**
 * 获取溯源历史记录
 */
export const getTraceHistory = () => {
  try {
    const stored = localStorage.getItem(TRACE_HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('读取溯源历史失败:', e);
  }
  return [];
};

/**
 * 添加溯源记录
 */
export const addTraceHistory = (fishData) => {
  const history = getTraceHistory();
  const record = {
    id: `TRACE_${Date.now()}`,
    fishId: fishData.id,
    fishName: fishData.name,
    fishImage: fishData.image,
    origin: fishData.origin,
    scanTime: new Date().toISOString(),
    qrCode: fishData.qrCode
  };
  
  // 去重：如果已存在相同鱼ID的记录，更新时间
  const existingIndex = history.findIndex(h => h.fishId === fishData.id);
  if (existingIndex >= 0) {
    history[existingIndex] = record;
  } else {
    history.unshift(record);
  }
  
  // 最多保留50条记录
  const trimmedHistory = history.slice(0, 50);
  
  try {
    localStorage.setItem(TRACE_HISTORY_KEY, JSON.stringify(trimmedHistory));
    // 更新用户统计
    const user = getCurrentUser();
    updateUserInfo({
      stats: {
        ...user.stats,
        traceCount: trimmedHistory.length
      }
    });
  } catch (e) {
    console.error('保存溯源历史失败:', e);
  }
  
  return record;
};

/**
 * 清除溯源历史
 */
export const clearTraceHistory = () => {
  localStorage.removeItem(TRACE_HISTORY_KEY);
  updateUserInfo({
    stats: {
      traceCount: 0
    }
  });
};

/**
 * 提交用户反馈
 */
export const submitFeedback = (feedbackData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('用户反馈提交:', feedbackData);
      resolve({ success: true, message: '反馈已提交' });
    }, 800);
  });
};

/**
 * Mock用户数据（用于演示）
 */
export const mockUser = {
  ...defaultUser,
  id: 'USER001',
  phone: '138****8888',
  nickname: '鳗鱼爱好者',
  avatar: avatarImg,
  payPassword: '123456',
  isLoggedIn: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  stats: {
    totalOrders: 12,
    totalSpent: 2580.00,
    traceCount: 28,
    favoriteCount: 5
  }
};