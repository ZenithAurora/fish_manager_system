/**
 * 认证服务Mock
 * 模拟登录、注册、验证码等功能
 */

import { getCurrentUser, saveUser, updateUserInfo } from './userData';
import avatarImg from '../assets/img/user/avatar.jpg';

// 固定验证码（用于演示）
export const MOCK_VERIFY_CODE = '123456';

// 验证码发送记录（模拟防刷）
const codeSentRecords = {};

/**
 * 发送验证码（模拟）
 * @param {string} phone 手机号
 * @returns {Promise} 
 */
export const mockSendCode = (phone) => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 验证手机号格式
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        reject({ success: false, message: '请输入正确的手机号' });
        return;
      }
      
      // 检查发送频率（60秒内只能发一次）
      const lastSent = codeSentRecords[phone];
      if (lastSent && Date.now() - lastSent < 60000) {
        const remaining = Math.ceil((60000 - (Date.now() - lastSent)) / 1000);
        reject({ success: false, message: `请${remaining}秒后再试` });
        return;
      }
      
      // 记录发送时间
      codeSentRecords[phone] = Date.now();
      
      resolve({ 
        success: true, 
        message: '验证码已发送',
        hint: `演示验证码：${MOCK_VERIFY_CODE}`  // 实际项目中不会返回
      });
    }, 800);
  });
};

/**
 * 验证验证码
 * @param {string} phone 手机号
 * @param {string} code 验证码
 * @returns {boolean}
 */
export const verifyCode = (phone, code) => {
  // 演示模式：固定验证码
  return code === MOCK_VERIFY_CODE;
};

/**
 * 登录
 * @param {string} phone 手机号
 * @param {string} code 验证码
 * @returns {Promise}
 */
export const mockLogin = (phone, code) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证手机号
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        reject({ success: false, message: '请输入正确的手机号' });
        return;
      }
      
      // 验证验证码
      if (!verifyCode(phone, code)) {
        reject({ success: false, message: '验证码错误' });
        return;
      }
      
      // 获取或创建用户
      let user = getCurrentUser();
      
      if (user.phone && user.phone !== phone) {
        // 新手机号，创建新用户
        user = {
          id: `USER_${Date.now()}`,
          phone: phone,
          nickname: `用户${phone.slice(-4)}`,
          avatar: avatarImg,
          payPassword: '',
          isLoggedIn: true,
          createdAt: new Date().toISOString(),
          isNewUser: true,  // 标记为新用户，需要完善信息
          preferences: {
            notifications: true,
            autoPlay: false,
            theme: 'light'
          },
          stats: {
            totalOrders: 0,
            totalSpent: 0,
            traceCount: 0,
            favoriteCount: 0
          }
        };
      } else {
        // 已有用户登录
        user.isLoggedIn = true;
        user.phone = phone;
        user.isNewUser = !user.payPassword; // 没设置支付密码视为新用户
      }
      
      saveUser(user);
      
      resolve({ 
        success: true, 
        message: '登录成功',
        user: user,
        isNewUser: user.isNewUser
      });
    }, 600);
  });
};

/**
 * 完善用户信息（新用户注册后）
 * @param {object} info 用户信息 { nickname, avatar, payPassword }
 * @returns {Promise}
 */
export const mockRegister = (info) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { nickname, payPassword } = info;
      
      // 验证昵称
      if (!nickname || nickname.trim().length < 2) {
        reject({ success: false, message: '昵称至少2个字符' });
        return;
      }
      
      // 验证支付密码
      if (!payPassword || !/^\d{6}$/.test(payPassword)) {
        reject({ success: false, message: '请设置6位数字支付密码' });
        return;
      }
      
      // 更新用户信息
      const user = updateUserInfo({
        nickname: nickname.trim(),
        payPassword: payPassword,
        avatar: info.avatar || avatarImg,
        isNewUser: false
      });
      
      resolve({
        success: true,
        message: '注册完成',
        user: user
      });
    }, 500);
  });
};

/**
 * 登出
 * @returns {Promise}
 */
export const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getCurrentUser();
      user.isLoggedIn = false;
      saveUser(user);
      
      resolve({ success: true, message: '已退出登录' });
    }, 300);
  });
};

/**
 * 检查登录状态
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const user = getCurrentUser();
  return user.isLoggedIn === true;
};

/**
 * 修改支付密码
 * @param {string} oldPassword 旧密码
 * @param {string} newPassword 新密码
 * @returns {Promise}
 */
export const changePayPassword = (oldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUser();
      
      // 验证旧密码（如果已设置）
      if (user.payPassword && user.payPassword !== oldPassword) {
        reject({ success: false, message: '原密码错误' });
        return;
      }
      
      // 验证新密码格式
      if (!/^\d{6}$/.test(newPassword)) {
        reject({ success: false, message: '新密码必须是6位数字' });
        return;
      }
      
      // 更新密码
      updateUserInfo({ payPassword: newPassword });
      
      resolve({ success: true, message: '密码修改成功' });
    }, 400);
  });
};

/**
 * 验证支付密码
 * @param {string} password 支付密码
 * @returns {Promise}
 */
export const verifyPayPassword = (password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getCurrentUser();
      
      if (!user.payPassword) {
        reject({ success: false, message: '请先设置支付密码' });
        return;
      }
      
      if (user.payPassword !== password) {
        reject({ success: false, message: '支付密码错误' });
        return;
      }
      
      resolve({ success: true });
    }, 300);
  });
};