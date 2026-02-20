import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import FooterNav from './components/FooterNav'
import { isLoggedIn } from './mock/authService'

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 需要登录才能访问的路径白名单（这里反向逻辑：除了白名单外都需要登录）
  // 实际上在每个页面组件里做检查更灵活，这里做全局兜底
  useEffect(() => {
    // 检查登录状态
    const authorized = isLoggedIn() || localStorage.getItem('isAuthorized');
    
    // 如果未登录且不在授权页，且不是公开页面（如扫码结果页可能允许未登录查看部分信息？）
    // 这里简单策略：未登录则跳去登录
    const publicPaths = ['/login'];
    if (!authorized && !publicPaths.includes(location.pathname)) {
      // 记录尝试访问的页面，以便登录后重定向
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  // 只在特定页面显示底部导航：首页、商城、订单历史、用户中心
  const showFooter = ['/', '/mall', '/orderHistory', '/user'].includes(location.pathname);

  return (
    <div className="app-container">
      <main className="main-content" style={{ paddingBottom: showFooter ? '60px' : '0' }}>
        <Outlet />
      </main>
      {showFooter && <FooterNav />}
    </div>
  )
}

export default App
