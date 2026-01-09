import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import FooterNav from './components/FooterNav'
import { isLoggedIn } from './mock/authService'

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pressTimer, setPressTimer] = useState(null);
  const [pressCount, setPressCount] = useState(0);
  
  // 需要登录才能访问的路径白名单（这里反向逻辑：除了白名单外都需要登录）
  // 实际上在每个页面组件里做检查更灵活，这里做全局兜底
  useEffect(() => {
    // 检查登录状态
    const authorized = isLoggedIn() || localStorage.getItem('isAuthorized');
    
    // 如果未登录且不在授权页，且不是公开页面（如扫码结果页可能允许未登录查看部分信息？）
    // 这里简单策略：未登录则跳去登录
    const publicPaths = ['/authorization'];
    if (!authorized && !publicPaths.includes(location.pathname)) {
      // 记录尝试访问的页面，以便登录后重定向
      // navigate('/authorization', { replace: true });
    }
  }, [location, navigate]);

  // 根据路径决定是否显示底部导航
  const showFooter = !['/authorization', '/qrcode-scanner', '/product-detail', '/scan-result', '/admin/login', '/admin/dashboard'].includes(location.pathname);

  // 处理长按触发管理员入口
  const handleAdminPressStart = () => {
    const timer = setTimeout(() => {
      setPressCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          navigate('/admin/login');
          Toast.show('管理员入口已开启', { icon: 'success' });
          return 0;
        }
        Toast.show(`再按 ${5 - newCount} 次进入后台`);
        return newCount;
      });
    }, 300);
    setPressTimer(timer);
  };

  const handleAdminPressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="app-container">
      <main className="main-content" style={{ paddingBottom: showFooter ? '60px' : '0' }}>
        <Outlet />
      </main>
      {showFooter && <FooterNav />}
      
      {/* 隐藏的管理员入口（长按触发） */}
      {!location.pathname.startsWith('/admin') && (
        <div 
          className="admin-entry-trigger"
          onMouseDown={handleAdminPressStart}
          onMouseUp={handleAdminPressEnd}
          onMouseLeave={handleAdminPressEnd}
          onTouchStart={handleAdminPressStart}
          onTouchEnd={handleAdminPressEnd}
        >
          <span className="admin-tooltip">👑</span>
        </div>
      )}
    </div>
  )
}

export default App
