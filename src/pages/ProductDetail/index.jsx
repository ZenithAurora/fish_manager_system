import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, Stepper, Popup } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

// 导入Mock数据
import { addToCart, getItemQuantity } from '../../mock/cartData';
import { getTraceByFishId, getTraceStats } from '../../mock/traceData';

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSpec, setShowSpec] = useState(false);
  const [traceStats, setTraceStats] = useState(null);

  // 获取商品数据
  useEffect(() => {
    const productData = location.state?.product;
    if (productData) {
      setProduct(productData);
      // 获取溯源统计
      const stats = getTraceStats(productData.id);
      setTraceStats(stats);
      // 检查收藏状态
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(item => item.id === productData.id));
    } else {
      Toast.show({ content: '商品信息加载失败', icon: 'fail' });
      setTimeout(() => navigate(-1), 1500);
    }
  }, [location.state, navigate]);

  // 返回
  const handleBack = () => {
    navigate(-1);
  };

  // 收藏
  const handleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      favorites = favorites.filter(item => item.id !== product.id);
      Toast.show({ content: '已取消收藏' });
    } else {
      favorites.push(product);
      Toast.show({ content: '收藏成功', icon: 'success' });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // 加入购物车
  const handleAddToCart = () => {
    addToCart(product, quantity);
    Toast.show({ content: '已加入购物车', icon: 'success' });
    setShowSpec(false);
  };

  // 立即购买
  const handleBuyNow = () => {
    addToCart(product, quantity);
    Toast.show({ content: '即将跳转结算页面', icon: 'loading' });
    setShowSpec(false);
  };

  // 查看溯源
  const handleViewTrace = () => {
    // 存储商品信息用于溯源结果页
    localStorage.setItem('currentScanProduct', JSON.stringify(product));
    navigate('/scan-result');
  };

  if (!product) {
    return (
      <div className="product-detail-page">
        <NavBar onBack={handleBack}>商品详情</NavBar>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* 导航栏 */}
      <NavBar
        onBack={handleBack}
        className="detail-nav"
        right={
          <span className="nav-share" onClick={() => Toast.show('分享功能开发中')}>
            📤
          </span>
        }
      >
        商品详情
      </NavBar>

      {/* 商品图片 */}
      <div className="product-gallery">
        <img src={product.image} alt={product.name} className="main-image" />
        {product.tags && product.tags[0] && (
          <span className="product-badge">{product.tags[0]}</span>
        )}
      </div>

      {/* 商品基本信息 */}
      <div className="product-info-card">
        <div className="price-row">
          <div className="price-area">
            <span className="currency">¥</span>
            <span className="price">{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">¥{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="sales-info">
            <span>已售 {product.sales}</span>
          </div>
        </div>
        
        <h1 className="product-title">{product.name}</h1>
        <p className="product-subtitle">{product.subtitle}</p>
        
        {/* 标签 */}
        <div className="product-tags">
          {product.tags?.map((tag, idx) => (
            <span key={idx} className="tag-item">{tag}</span>
          ))}
        </div>
      </div>

      {/* 溯源信息卡片 */}
      <div className="trace-card" onClick={handleViewTrace}>
        <div className="trace-header">
          <span className="trace-icon">🔍</span>
          <span className="trace-title">溯源信息</span>
          <span className="trace-badge">可追溯</span>
        </div>
        <div className="trace-content">
          <div className="trace-item">
            <span className="label">产地</span>
            <span className="value">{product.origin}</span>
          </div>
          <div className="trace-item">
            <span className="label">生产商</span>
            <span className="value">{product.producer}</span>
          </div>
          <div className="trace-item">
            <span className="label">溯源节点</span>
            <span className="value highlight">{traceStats?.totalNodes || 5}个环节全程追溯</span>
          </div>
        </div>
        <div className="trace-action">
          <span>查看完整溯源链路</span>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* 商品规格 */}
      <div className="spec-card">
        <div className="spec-row" onClick={() => setShowSpec(true)}>
          <span className="spec-label">规格</span>
          <span className="spec-value">{product.unit}</span>
          <span className="spec-arrow">›</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">储存</span>
          <span className="spec-value">{product.storage}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">保质期</span>
          <span className="spec-value">{product.shelfLife}</span>
        </div>
      </div>

      {/* 营养信息 */}
      {product.nutrition && (
        <div className="nutrition-card">
          <h3 className="card-title">🥗 营养成分</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span className="value">{product.nutrition.protein}</span>
              <span className="label">蛋白质</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{product.nutrition.fat}</span>
              <span className="label">脂肪</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{product.nutrition.calories}</span>
              <span className="label">热量</span>
            </div>
            <div className="nutrition-item">
              <span className="value">{product.nutrition.omega3}</span>
              <span className="label">Omega-3</span>
            </div>
          </div>
        </div>
      )}

      {/* 商品详情 */}
      <div className="detail-card">
        <h3 className="card-title">📝 商品详情</h3>
        <p className="detail-text">{product.description}</p>
      </div>

      {/* 底部操作栏 */}
      <div className="bottom-bar">
        <div className="bar-left">
          <div className="bar-icon" onClick={handleFavorite}>
            <span>{isFavorite ? '❤️' : '🤍'}</span>
            <span className="icon-text">收藏</span>
          </div>
          <div className="bar-icon" onClick={() => Toast.show('客服功能开发中')}>
            <span>💬</span>
            <span className="icon-text">客服</span>
          </div>
        </div>
        <div className="bar-right">
          <Button className="cart-btn" onClick={() => setShowSpec(true)}>
            加入购物车
          </Button>
          <Button className="buy-btn" onClick={() => setShowSpec(true)}>
            立即购买
          </Button>
        </div>
      </div>

      {/* 规格选择弹窗 */}
      <Popup
        visible={showSpec}
        onMaskClick={() => setShowSpec(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div className="spec-popup">
          <div className="popup-header">
            <img src={product.image} alt="" className="popup-image" />
            <div className="popup-info">
              <div className="popup-price">
                <span className="currency">¥</span>
                <span className="price">{product.price.toFixed(2)}</span>
              </div>
              <div className="popup-stock">库存: {product.stock}件</div>
              <div className="popup-spec">已选: {product.unit}</div>
            </div>
            <span className="popup-close" onClick={() => setShowSpec(false)}>✕</span>
          </div>
          
          <div className="popup-quantity">
            <span className="quantity-label">购买数量</span>
            <Stepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock}
            />
          </div>

          <div className="popup-actions">
            <Button className="popup-cart-btn" onClick={handleAddToCart}>
              加入购物车
            </Button>
            <Button className="popup-buy-btn" onClick={handleBuyNow}>
              立即购买
            </Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default ProductDetail;