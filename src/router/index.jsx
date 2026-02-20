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
import TraceHistory from '../pages/TraceHistory';
import Favorites from '../pages/Favorites';
import AddressList from '../pages/AddressList';
import AddressEdit from '../pages/AddressEdit';
import About from '../pages/About';

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
      { path: '/trace-history', element: <TraceHistory /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/address-list', element: <AddressList /> },
      { path: '/address-edit', element: <AddressEdit /> },
      { path: '/address-edit/:id', element: <AddressEdit /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <Login /> }, // 任何未知路径都重定向到登录页（或者是404页）
    ],
  },
]);

export default router;
