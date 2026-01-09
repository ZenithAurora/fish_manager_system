import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar, Button, Toast, Popup, PasscodeInput, Dialog } from 'antd-mobile';
import { EnvironmentOutline, RightOutline } from 'antd-mobile-icons';
import { createOrder, payOrder } from '../../mock/orderData';
import { checkPayPassword, getCurrentUser } from '../../mock/userData';
import './index.scss';

const OrderConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [address, setAddress] = useState({
    name: '张三',
    phone: '138****8888',
    detail: '浙江省杭州市西湖区文三路 123 号',
    tag: '公司'
  });
  const [showPayPwd, setShowPayPwd] = useState(false);
  const [payPassword, setPayPassword] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // 初始化商品数据
  useEffect(() => {
    // 从路由状态获取商品列表 (购物车结算或直接购买)
    const state = location.state;
    if (state && state.items) {
      setProductList(state.items);
    } else {
      Toast.show({
        icon: 'fail',
        content: '订单信息为空',
      });
      setTimeout(() => navigate('/mall'), 1500);
    }
  }, [location, navigate]);

  // 计算金额
  const totalAmount = productList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freight = totalAmount > 200 ? 0 : 10; // 满200包邮
  const discount = 0; // 暂无优惠
  const finalAmount = totalAmount + freight - discount;

  // 提交订单
  const handleSubmitOrder = () => {
    if (productList.length === 0) return;
    
    // 1. 创建订单
    const order = createOrder(productList, `${address.name} ${address.phone} ${address.detail}`);
    if (order) {
      setCreatedOrder(order);
      // 2. 弹出支付密码框
      setShowPayPwd(true);
    } else {
      Toast.show({
        icon: 'fail',
        content: '创建订单失败',
      });
    }
  };

  // 支付密码输入完成
  const handlePay = async (pwd) => {
    setPayPassword(pwd);
    Toast.show({
      icon: 'loading',
      content: '支付中...',
      duration: 0,
    });

    // 模拟网络延迟
    setTimeout(() => {
      Toast.clear();
      // 验证密码
      const isValid = checkPayPassword(pwd);
      
      if (isValid) {
        // 调用支付接口
        const res = payOrder(createdOrder.id);
        if (res.success) {
          setShowPayPwd(false);
          Dialog.alert({
            header: <i className="iconfont icon-success" style={{color: '#10b981', fontSize: 48}} />,
            title: '支付成功',
            content: '您的订单已支付成功，商家将尽快发货',
            confirmText: '查看订单',
            onConfirm: () => {
              navigate('/orderHistory');
            },
          });
        } else {
          Toast.show({
            icon: 'fail',
            content: res.message || '支付失败',
          });
          setPayPassword('');
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: '支付密码错误',
        });
        setPayPassword('');
      }
    }, 1000);
  };

  return (
    <div className="order-confirm-container">
      <NavBar onBack={() => navigate(-1)} className="nav-bar">
        确认订单
      </NavBar>

      <div className="content-area">
        {/* 地址卡片 */}
        <div className="address-card" onClick={() => Toast.show('地址管理功能开发中')}>
          <div className="left-info">
            <div className="user-info">
              {address.name} {address.phone}
              <span className="tag">{address.tag}</span>
            </div>
            <div className="address-detail">{address.detail}</div>
          </div>
          <RightOutline className="right-icon" />
        </div>

        {/* 商品列表 */}
        <div className="products-card">
          <div className="card-title">商品清单</div>
          {productList.map((item, index) => (
            <div className="product-item" key={item.id || index}>
              <div className="img-wrapper">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="info-wrapper">
                <div className="name">{item.name}</div>
                <div className="price-row">
                  <div className="price">
                    <span>¥</span>{item.price}
                  </div>
                  <div className="count">x{item.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 账单详情 */}
        <div className="bill-card">
          <div className="bill-item">
            <span>商品总额</span>
            <span>¥{totalAmount.toFixed(2)}</span>
          </div>
          <div className="bill-item">
            <span>运费</span>
            <span>{freight > 0 ? `¥${freight}` : '免运费'}</span>
          </div>
          <div className="bill-item">
            <span>优惠</span>
            <span>-¥{discount.toFixed(2)}</span>
          </div>
          <div className="bill-item total">
            <span>实付款</span>
            <span className="amount">¥{finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 底部提交栏 */}
      <div className="bottom-bar">
        <div className="total-wrapper">
          合计: 
          <span className="price">
            <span>¥</span>{finalAmount.toFixed(2)}
          </span>
        </div>
        <Button 
          className="submit-btn" 
          color="primary" 
          onClick={handleSubmitOrder}
        >
          提交订单
        </Button>
      </div>

      {/* 支付密码弹窗 */}
      <Popup
        visible={showPayPwd}
        onMaskClick={() => setShowPayPwd(false)}
        bodyStyle={{
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          minHeight: '400px',
        }}
      >
        <div className="pay-content">
          <h3>请输入支付密码</h3>
          <div className="sub-title">余额支付</div>
          <div className="pay-amount">
            <span>¥</span>{finalAmount.toFixed(2)}
          </div>
          
          <div className="pwd-input-area">
            <PasscodeInput
              seperated
              length={6}
              value={payPassword}
              onChange={handlePay}
              keyboard={<PasscodeInput.NumberKeyboard />}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default OrderConfirm;