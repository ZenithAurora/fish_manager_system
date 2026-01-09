/**
 * 后台管理系统Mock服务
 * 提供管理员登录和简单反馈管理功能
 */

// 后台管理员账号（演示用）
const ADMIN_ACCOUNTS = [
  {
    username: 'admin',
    password: '123456',
    role: 'super_admin',
    displayName: '系统管理员',
    lastLogin: null
  },
  {
    username: 'operator',
    password: '123456', 
    role: 'operator',
    displayName: '运营人员',
    lastLogin: null
  }
];

// 存储用户反馈
let feedbackList = JSON.parse(localStorage.getItem('admin_feedback') || '[]');

/**
 * 管理员登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export const adminLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const admin = ADMIN_ACCOUNTS.find(
        a => a.username === username && a.password === password
      );
      
      if (admin) {
        // 更新最后登录时间
        admin.lastLogin = new Date().toISOString();
        
        // 存储登录状态
        localStorage.setItem('admin_token', JSON.stringify({
          username: admin.username,
          role: admin.role,
          loginTime: new Date().toISOString()
        }));
        
        resolve({
          success: true,
          message: '登录成功',
          user: admin
        });
      } else {
        reject({
          success: false,
          message: '用户名或密码错误'
        });
      }
    }, 500);
  });
};

/**
 * 检查管理员登录状态
 */
export const checkAdminAuth = () => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return false;
  }
  
  try {
    const authData = JSON.parse(token);
    // 简单的token过期检查（24小时）
    const loginTime = new Date(authData.loginTime);
    const now = new Date();
    return (now - loginTime) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

/**
 * 管理员登出
 */
export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  return Promise.resolve({ success: true });
};

/**
 * 获取当前登录的管理员信息
 */
export const getCurrentAdmin = () => {
  if (!checkAdminAuth()) {
    return null;
  }
  
  const token = JSON.parse(localStorage.getItem('admin_token'));
  const admin = ADMIN_ACCOUNTS.find(a => a.username === token.username);
  return admin ? { ...admin } : null;
};

/**
 * 提交用户反馈
 * @param {object} feedback 反馈内容
 */
export const submitFeedback = (feedback) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFeedback = {
        id: `feedback_${Date.now()}`,
        ...feedback,
        createdAt: new Date().toISOString(),
        status: 'pending', // pending, processing, resolved
        replies: []
      };
      
      feedbackList.unshift(newFeedback);
      saveFeedbackList();
      
      resolve({
        success: true,
        message: '反馈提交成功',
        feedback: newFeedback
      });
    }, 300);
  });
};

/**
 * 获取反馈列表
 * @param {string} userId 用户ID（可选）
 */
export const getFeedbackList = (userId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = feedbackList;
      
      if (userId) {
        filtered = feedbackList.filter(f => f.userId === userId);
      }
      
      resolve({
        success: true,
        data: [...filtered].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
      });
    }, 200);
  });
};

/**
 * 更新反馈状态
 * @param {string} feedbackId 反馈ID
 * @param {string} status 新状态
 * @param {string} reply 回复内容（可选）
 */
export const updateFeedbackStatus = (feedbackId, status, reply = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const feedback = feedbackList.find(f => f.id === feedbackId);
      
      if (!feedback) {
        reject({ success: false, message: '反馈不存在' });
        return;
      }
      
      feedback.status = status;
      
      if (reply) {
        feedback.replies.push({
          content: reply,
          repliedAt: new Date().toISOString(),
          repliedBy: getCurrentAdmin()?.username || 'system'
        });
      }
      
      saveFeedbackList();
      
      resolve({
        success: true,
        message: '反馈已更新',
        feedback
      });
    }, 300);
  });
};

// 保存反馈列表到localStorage
const saveFeedbackList = () => {
  localStorage.setItem('admin_feedback', JSON.stringify(feedbackList));
};

// 初始化时加载保存的反馈
if (feedbackList.length === 0) {
  // 添加一些示例反馈
  feedbackList = [
    {
      id: 'feedback_1',
      userId: 'demo_user',
      userName: '演示用户',
      type: 'suggestion',
      title: '希望增加搜索功能',
      content: '建议在商品列表页面增加搜索功能，方便用户查找特定商品',
      contact: 'user@example.com',
      createdAt: new Date('2024-01-08').toISOString(),
      status: 'resolved',
      replies: [{
        content: '感谢建议！搜索功能已规划开发',
        repliedAt: new Date('2024-01-09').toISOString(),
        repliedBy: 'admin'
      }]
    },
    {
      id: 'feedback_2', 
      userId: 'demo_user2',
      userName: '测试用户',
      type: 'bug',
      title: '扫码页面摄像头未释放',
      content: '退出扫码页面后，摄像头仍在运行，需要修复',
      contact: '',
      createdAt: new Date('2024-01-09').toISOString(),
      status: 'processing',
      replies: []
    }
  ];
  saveFeedbackList();
}