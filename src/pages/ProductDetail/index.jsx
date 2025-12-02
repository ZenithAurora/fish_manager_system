import React, { useState, useEffect } from 'react';
import { NavBar, Button, Card, Toast, Badge } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeartOutline, CheckCircleOutline } from 'antd-mobile-icons';
import './index.scss';

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [productData, setProductData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 从路由参数获取商品数据
  useEffect(() => {
    const product = location.state?.product;
    if (product) {
      setProductData(product);
      // 检查是否已收藏
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(item => item.id === product.id));
    } else {
      // 如果没有商品数据，显示错误并返回
      Toast.show({
        content: '商品信息加载失败',
        duration: 2000,
      });
      setTimeout(() => navigate(-1), 2000);
    }
  }, [location.state, navigate]);

  // 处理返回
  const handleBack = () => {
    navigate(-1);
  };

  // 处理收藏/取消收藏
  const handleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // 更新收藏数据
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (newFavoriteStatus) {
      favorites.push(productData);
      Toast.show({
        content: '收藏成功',
        duration: 1500,
      });
    } else {
      favorites = favorites.filter(item => item.id !== productData.id);
      Toast.show({
        content: '已取消收藏',
        duration: 1500,
      });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  // 处理加入购物车
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === productData.id);

    if (existingItemIndex >= 0) {
      // 如果已存在，增加数量
      cart[existingItemIndex].quantity += quantity;
    } else {
      // 如果不存在，添加新商品
      cart.push({
        ...productData,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    Toast.show({
      content: '已加入购物车',
      duration: 1500,
    });
  };

  // 处理立即购买
  const handleBuyNow = () => {
    // 将当前商品添加到购物车
    handleAddToCart();
    // 可以跳转到订单确认页面
    Toast.show({
      content: '即将跳转到订单确认页面',
      duration: 2000,
    });
  };

  // 处理分享
  const handleShare = () => {
    Toast.show({
      content: '分享功能暂未实现',
      duration: 1500,
    });
  };

  // 数量增减
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  if (!productData) {
    return (
      <div className="product-detail-container">
        <NavBar onBack={handleBack}>商品详情</NavBar>
        <div className="loading-content">
          <div className="loading-text">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* 顶部导航栏 */}
      <NavBar
        onBack={handleBack}
        className="product-nav"
        right={
          <div className="nav-actions" onClick={handleShare} style={{ fontSize: '20px', cursor: 'pointer' }}>
            🔗
          </div>
        }
      >
        商品详情
      </NavBar>

      {/* 商品图片展示 */}
      <div className="product-image-container">
        <img
          src={productData.image || 'https://via.placeholder.com/400x400'}
          alt={productData.name}
          className="product-image"
        />
        {/* 商品标签 */}
        {productData.tags && productData.tags.length > 0 && (
          <div className="product-tags">
            {productData.tags.map((tag, index) => (
              <Badge key={index} className="product-tag" text={tag} color="danger" />
            ))}
          </div>
        )}
      </div>

      {/* 商品信息卡片 */}
      <Card className="product-info-card">
        {/* 价格信息 */}
        <div className="product-price-section">
          <span className="currency-symbol">¥</span>
          <span className="product-price">{productData.price.toFixed(2)}</span>
          {productData.originalPrice && (
            <span className="original-price">¥{productData.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* 商品名称 */}
        <h1 className="product-name">{productData.name}</h1>

        {/* 商品描述 */}
        <p className="product-description">{productData.description || '暂无详细描述'}</p>

        {/* 商品属性 */}
        <div className="product-attributes">
          <div className="attribute-item">
            <span className="attribute-label">产地</span>
            <span className="attribute-value">{productData.origin || '未知'}</span>
          </div>
          <div className="attribute-item">
            <span className="attribute-label">规格</span>
            <span className="attribute-value">{productData.specs || '标准规格'}</span>
          </div>
          <div className="attribute-item">
            <span className="attribute-label">保质期</span>
            <span className="attribute-value">{productData.shelfLife || '12个月'}</span>
          </div>
        </div>
      </Card>

      {/* 商品详情内容 */}
      <Card className="product-details-card">
        <Card.Header title="商品详情" className="card-header" />
        <Card.Body className="product-detail-content">
          <div className="detail-item">
            <h3 className="detail-title">产品介绍</h3>
            <p className="detail-text">
              {productData.detailInfo ||
                '本产品采用优质原料制作，经过严格的质量检测，确保安全卫生。全程冷链运输，保证新鲜度。'}
            </p>
          </div>

          <div className="detail-item">
            <h3 className="detail-title">溯源信息</h3>
            <div className="trace-info">
              <div className="trace-item">
                <span className="trace-label">生产批次：</span>
                <span className="trace-value">{productData.batchId || '未知'}</span>
              </div>
              <div className="trace-item">
                <span className="trace-label">生产日期：</span>
                <span className="trace-value">{productData.productionDate || '未知'}</span>
              </div>
              <div className="trace-item">
                <span className="trace-label">检验状态：</span>
                <span className="trace-value">
                  <CheckCircleOutline className="check-icon" />
                  {productData.status || '合格'}
                </span>
              </div>
            </div>
          </div>

          {/* 详细图片展示 */}
          {productData.detailImages && productData.detailImages.length > 0 && (
            <div className="detail-images">
              {productData.detailImages.map((img, index) => (
                <img key={index} src={img} alt={`详情图片${index + 1}`} className="detail-image" />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 底部操作栏 */}
      <div className="bottom-action-bar">
        {/* 左侧操作 */}
        <div className="left-actions">
          <div className="action-icon" onClick={handleFavorite}>
            {isFavorite ? <HeartOutline className="favorite-active" /> : <HeartOutline />}
            <span>收藏</span>
          </div>
          <div className="action-icon">
            <span>🛒</span>
            <span>购物车</span>
          </div>
        </div>

        {/* 数量选择 */}
        <div className="quantity-selector">
          <Button
            size="small"
            className="quantity-btn"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="quantity-value">{quantity}</span>
          <Button
            size="small"
            className="quantity-btn"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= 99}
          >
            +
          </Button>
        </div>

        {/* 右侧操作按钮 */}
        <div className="right-actions">
          <Button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            加入购物车
          </Button>
          <Button
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            立即购买
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;