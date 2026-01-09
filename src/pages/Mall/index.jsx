import React, { useState, useEffect } from 'react';
import { SearchBar, Toast, Badge, Tabs, Empty, Popup } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './index-new.scss';

// 导入Mock数据
import { fishProducts, categories, getFishByCategory, searchFish } from '../../mock/fishProducts';
import { addToCart, getCart, getCartCount, clearCart } from '../../mock/cartData';

const Mall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState(fishProducts);
  const [cartCount, setCartCount] = useState(0);
  const [sortType, setSortType] = useState('default'); // default, price-asc, price-desc, sales
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // 初始化
  useEffect(() => {
    updateCartCount();
    // 如果有搜索参数，执行搜索
    if (searchParams.get('search')) {
      handleSearch(searchParams.get('search'));
    }
  }, []);

  // 更新购物车数量
  const updateCartCount = () => {
    setCartCount(getCartCount());
    setCartItems(getCart());
  };

  // 筛选商品
  useEffect(() => {
    let filtered = activeCategory === 'all' 
      ? [...fishProducts] 
      : getFishByCategory(activeCategory);
    
    // 搜索筛选
    if (searchValue.trim()) {
      const keyword = searchValue.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword)
      );
    }

    // 排序
    switch (sortType) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      default:
        break;
    }

    setProducts(filtered);
  }, [activeCategory, searchValue, sortType]);

  // 处理搜索
  const handleSearch = (val) => {
    setSearchValue(val);
  };

  // 处理分类切换
  const handleCategoryChange = (key) => {
    setActiveCategory(key);
  };

  // 添加到购物车
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    updateCartCount();
    Toast.show({
      content: '已加入购物车',
      icon: 'success',
      duration: 1000
    });
  };

  // 跳转到商品详情
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  // 打开购物车
  const handleCartClick = () => {
    setCartItems(getCart());
    setShowCartPopup(true);
  };

  // 去结算
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Toast.show('购物车为空');
      return;
    }
    setShowCartPopup(false);
    navigate('/order-confirm', { state: { items: cartItems } });
  };

  // 清空购物车
  const handleClearCart = () => {
    clearCart();
    updateCartCount();
    setShowCartPopup(false);
    Toast.show('购物车已清空');
  };

  // 排序选项
  const sortOptions = [
    { key: 'default', label: '综合' },
    { key: 'sales', label: '销量' },
    { key: 'price-asc', label: '价格↑' },
    { key: 'price-desc', label: '价格↓' },
  ];

  return (
    <div className="mall-page">
      {/* 顶部搜索栏 */}
      <div className="mall-header">
        <div className="header-content">
          <div className="header-title">
            <span className="title-icon">🐟</span>
            <span className="title-text">鳗鱼商城</span>
          </div>
          <div className="header-cart" onClick={handleCartClick}>
            <Badge content={cartCount > 0 ? cartCount : null}>
              <span className="cart-icon">🛒</span>
            </Badge>
          </div>
        </div>
        <div className="search-wrapper">
          <SearchBar
            placeholder="搜索鳗鱼产品..."
            value={searchValue}
            onChange={handleSearch}
            className="mall-search"
          />
        </div>
      </div>

      {/* 分类标签 */}
      <div className="category-tabs">
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          className="custom-tabs"
        >
          {categories.map(cat => (
            <Tabs.Tab key={cat.id} title={
              <span className="tab-item">
                <span className="tab-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            } />
          ))}
        </Tabs>
      </div>

      {/* 排序栏 */}
      <div className="sort-bar">
        {sortOptions.map(opt => (
          <div
            key={opt.key}
            className={`sort-item ${sortType === opt.key ? 'active' : ''}`}
            onClick={() => setSortType(opt.key)}
          >
            {opt.label}
          </div>
        ))}
        <div className="product-count">{products.length}件商品</div>
      </div>

      {/* 商品列表 */}
      <div className="product-list">
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.tags && product.tags[0] && (
                    <span className="product-tag">{product.tags[0]}</span>
                  )}
                  {product.originalPrice && (
                    <span className="discount-tag">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}%OFF
                    </span>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-subtitle">{product.subtitle}</p>
                  <div className="product-meta">
                    <span className="rating">⭐ {product.rating}</span>
                    <span className="sales">{product.sales}人购买</span>
                  </div>
                  <div className="product-bottom">
                    <div className="price-area">
                      <span className="currency">¥</span>
                      <span className="price">{product.price.toFixed(0)}</span>
                      {product.originalPrice && (
                        <span className="original-price">¥{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="add-cart-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description="没有找到相关商品"
            className="empty-state"
          />
        )}
      </div>

      {/* 底部提示 */}
      <div className="mall-footer">
        <div className="footer-tags">
          <span>✓ 正品保证</span>
          <span>✓ 7天无理由</span>
          <span>✓ 全程可溯源</span>
        </div>
      </div>

      {/* 购物车弹窗 */}
      <Popup
        visible={showCartPopup}
        onMaskClick={() => setShowCartPopup(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '40vh' }}
      >
        <div className="cart-popup">
          <div className="cart-header">
            <h3>购物车 ({cartCount})</h3>
            <span className="clear-btn" onClick={handleClearCart}>清空</span>
          </div>
          
          <div className="cart-list">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt="" className="item-image" />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">
                    <span className="item-price">¥{item.price}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                </div>
              </div>
            )) : (
              <Empty description="购物车空空如也" />
            )}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              合计: <span className="total-price">¥{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout} disabled={cartItems.length === 0}>
              去结算
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Mall;