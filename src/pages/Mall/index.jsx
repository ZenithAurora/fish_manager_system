import React, { useState, useEffect } from 'react';
import { SearchOutline, ShopbagOutline, HeartOutline, StarOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const Mall = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(3);
  const navigate = useNavigate();

  // 跳转到商品详情
  const navigateToProductDetail = (product) => {
    navigate('/product-detail', {
      state: {
        product: {
          ...product,
          origin: '四川省江安县',
          specs: '标准规格',
          shelfLife: '12个月',
          batchId: `BATCH-${product.id}-${Date.now()}`,
          productionDate: new Date().toISOString().split('T')[0],
          status: '合格',
          description: `${product.name}，来自优质产地，品质保证，溯源可信。`,
          detailInfo: `本产品来自四川省江安县优质养殖基地，采用天然饲料养殖，全程可追溯。经过严格的质量检测，确保安全卫生。我们承诺提供最优质的产品和服务，让您买得放心，吃得安心。`
        }
      }
    });
  };

  // 商品分类数据
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'fresh', name: '鲜活水产' },
    { id: 'frozen', name: '冷冻产品' },
    { id: 'processed', name: '加工制品' },
    { id: 'gift', name: '礼品套装' },
  ];

  // 商品数据
  const products = [
    {
      id: 1,
      name: '优质鳗鱼',
      price: 128,
      originalPrice: 158,
      image: '/src/assets/img/shopping/fish1.jpg',
      category: 'fresh',
      rating: 4.8,
      sales: 1234,
      isFavorite: false
    },
    {
      id: 2,
      name: '冷冻鳗鱼段',
      price: 89,
      originalPrice: 120,
      image: '/src/assets/img/shopping/fish2.jpg',
      category: 'frozen',
      rating: 4.6,
      sales: 856,
      isFavorite: true
    },
    {
      id: 3,
      name: '鳗鱼寿司礼盒',
      price: 198,
      originalPrice: 258,
      image: '/src/assets/img/shopping/fish3.webp',
      category: 'processed',
      rating: 4.9,
      sales: 567,
      isFavorite: false
    },
    {
      id: 4,
      name: '鳗鱼干',
      price: 68,
      originalPrice: 88,
      image: '/src/assets/img/shopping/fish4.webp',
      category: 'processed',
      rating: 4.5,
      sales: 342,
      isFavorite: false
    },
    {
      id: 5,
      name: '精品鳗鱼礼包',
      price: 298,
      originalPrice: 358,
      image: '/src/assets/img/shopping/fish5.webp',
      category: 'gift',
      rating: 4.7,
      sales: 234,
      isFavorite: false
    },
  ];

  // 筛选商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId) => {
    setCartCount(prev => prev + 1);
    // 这里可以添加添加到购物车的逻辑
  };

  const handleToggleFavorite = (productId) => {
    // 这里可以添加收藏/取消收藏的逻辑
  };

  return (
    <div className="mall-container">
      {/* 顶部搜索栏 */}
      <div className="mall-header">
        <div className="search-bar">
          <SearchOutline className="search-icon" />
          <input
            type="text"
            placeholder="搜索鳗鱼产品..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="cart-icon">
          <ShopbagOutline />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>

      {/* 分类导航 */}
      <div className="category-nav">
        <div className="category-scroll">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {/* 商品列表 */}
      <div className="product-list">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigateToProductDetail(product)}
            style={{ cursor: 'pointer' }}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-tags">
                {product.originalPrice > product.price && (
                  <span className="discount-tag">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <button
                className={`favorite-btn ${product.isFavorite ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // 阻止冒泡，避免触发商品卡片的点击事件
                  handleToggleFavorite(product.id);
                }}
              >
                <HeartOutline />
              </button>
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-rating">
                <StarOutline className="star-icon" />
                <span className="rating-value">{product.rating}</span>
                <span className="sales-count">已售{product.sales}</span>
              </div>
              <div className="product-price">
                <span className="current-price">¥{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="original-price">¥{product.originalPrice}</span>
                )}
              </div>
              <button
                className="add-cart-btn"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止冒泡，避免触发商品卡片的点击事件
                  handleAddToCart(product.id);
                }}
              >
                加入购物车
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 底部安全提示 */}
      <div className="mall-footer">
        <p>正品保证 · 7天无理由退货 · 品质溯源</p>
      </div>
    </div>
  );
};

export default Mall;