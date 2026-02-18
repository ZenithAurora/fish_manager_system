import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Home from '../pages/Home';
import QRCodeScanner from '../pages/QRCodeScanner';
import ScannerResult from '../pages/ScannerResult';
import UserCenter from '../pages/UserCenter';
import Mall from '../pages/Mall';
import OrderHistory from '../pages/OrderHistory';
import NodeDetail from '../pages/NodeDetail';
import ProductDetail from '../pages/ProductDetail';
import OrderConfirm from '../pages/OrderConfirm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/mall', element: <Mall /> },
      { path: '/orderHistory', element: <OrderHistory /> },
      { path: '/qrcode-scanner', element: <QRCodeScanner /> },
      { path: '/scan-result', element: <ScannerResult /> },
      { path: '/user', element: <UserCenter /> },
      { path: '/node-detail', element: <NodeDetail /> },
      { path: '/product-detail', element: <ProductDetail /> },
      { path: '/order-confirm', element: <OrderConfirm /> },
      { path: '*', element: <Login /> }, // 任何未知路径都重定向到登录页（或者是404页）
    ],
  },
]);

export default router;
