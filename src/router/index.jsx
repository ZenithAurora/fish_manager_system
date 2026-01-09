import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Authorization from '../pages/Authorization/index-unified';
import Home from '../pages/Home';
import QRCodeScanner from '../pages/QRCodeScanner';
import ScannerResult from '../pages/ScannerResult';
import UserCenter from '../pages/UserCenter';
import Mall from '../pages/Mall';
import OrderHistory from '../pages/OrderHistory';
import NodeDetail from '../pages/NodeDetail';
import ProductDetail from '../pages/ProductDetail';
import OrderConfirm from '../pages/OrderConfirm';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/mall', element: <Mall /> },
      { path: '/orderHistory', element: <OrderHistory /> },
      { path: '/authorization', element: <Authorization /> },
      { path: '/qrcode-scanner', element: <QRCodeScanner /> },
      { path: '/scan-result', element: <ScannerResult /> },
      { path: '/user', element: <UserCenter /> },
      { path: '/node-detail', element: <NodeDetail /> },
      { path: '/product-detail', element: <ProductDetail /> },
      { path: '/order-confirm', element: <OrderConfirm /> },
      { path: '/admin/login', element: <AdminLogin /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
    ],
  },
]);

export default router;
