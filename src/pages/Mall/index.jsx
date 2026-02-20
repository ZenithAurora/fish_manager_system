import { useState, useMemo, useEffect } from 'react';
import { SearchBar, Toast, Badge, Tabs, Empty, Popup } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.scss';

// 导入Mock数据
import { fishProducts, categories, getFishByCategory, searchFish } from '../../mock/fishProducts';
import { addToCart, getCart, getCartCount, clearCart } from '../../mock/cartData';

// 导入Logo
import fishLogo from '../../assets/img/fish.png';

const Mall = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [sortType, setSortType] = useState('default');
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState(() => getCart());
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // 更新购物车数量
  const updateCartCount = () => {
    setCartCount(getCartCount());
    setCartItems(getCart());
  };

  // 更新购物车商品数量
  const updateCartItemQuantity = (e, index, delta) => {
    e.stopPropagation();
    const newItems = [...cartItems];
    const newQuantity = newItems[index].quantity + delta;

    if (newQuantity <= 0) {
      // 删除商品
      newItems.splice(index, 1);
      Toast.show({
        content: '已移除商品',
        duration: 1000
      });
    } else {
      newItems[index].quantity = newQuantity;
    }

    // 更新本地存储
    localStorage.setItem('cart', JSON.stringify(newItems));
    updateCartCount();
  };

  // 处理搜索
  const handleSearch = (val) => {
    setIsSearching(true);
    setSearchValue(val);
    
    // 模拟搜索延迟
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  // 使用 useMemo 计算当前展示的商品列表，替代 useEffect + setState
  const products = useMemo(() => {
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

    // 排序 (注意：sort会修改原数组，所以上面使用了 [...fishProducts] 或 filter 返回的新数组)
    // 为了安全起见，再次浅拷贝一下再排序，避免副作用
    filtered = [...filtered];

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

    return filtered;
  }, [activeCategory, searchValue, sortType]);

  // 处理分类切换
  const handleCategoryChange = (key) => {
    setIsLoading(true);
    setActiveCategory(key);
    setDisplayCount(10);
    
    // 模拟加载延迟
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // 加载更多商品
  const loadMore = () => {
    if (displayCount >= products.length) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 10);
      setIsLoading(false);
      setHasMore(displayCount + 10 < products.length);
    }, 600);
  };

  // 初始加载效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // 监听滚动实现无限加载
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // 距离底部200px时触发加载
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, displayCount, products.length]);

  // 重置分页状态
  useEffect(() => {
    setDisplayCount(10);
    setHasMore(products.length > 10);
  }, [products.length, searchValue, sortType]);

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
    { key: 'default', label: '综合排序' },
    { key: 'sales', label: '销量最高' },
    { key: 'price-asc', label: '价格最低' },
    { key: 'price-desc', label: '价格最高' },
  ];

  // 获取当前排序标签
  const currentSortLabel = sortOptions.find(opt => opt.key === sortType)?.label || '综合排序';

  // 处理排序切换
  const handleSortChange = (key) => {
    setSortType(key);
    setShowSortMenu(false);
    setDisplayCount(10);
    setIsLoading(true);
    
    // 模拟排序延迟
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 当前显示的商品列表
  const displayedProducts = products.slice(0, displayCount);

  return (
    <div className={styles.mallPage}>
      {/* 顶部区域 */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <img src={fishLogo} alt="Logo" className={styles.logo} />
          
          <div className={styles.searchWrapper}>
            <SearchBar
              placeholder="搜索鳗鱼产品..."
              value={searchValue}
              onChange={handleSearch}
            />
          </div>

          <div className={styles.cartButton} onClick={handleCartClick}>
            <Badge content={cartCount > 0 ? cartCount : null}>
              <span className={styles.cartIcon}>🛒</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className={styles.categoryTabs}>
        <Tabs
          activeKey={activeCategory}
          onChange={handleCategoryChange}
          stretch={false}
        >
          {categories.map(cat => (
            <Tabs.Tab key={cat.id} title={
              <span className={styles.tabItem}>
                <span className={styles.tabIcon}>{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            } />
          ))}
        </Tabs>
      </div>

      {/* 排序栏 */}
      <div className={styles.sortBar}>
        <div className={styles.sortDropdown}>
          <div 
            className={`${styles.sortButton} ${showSortMenu ? styles.open : ''} ${sortType !== 'default' ? styles.active : ''}`}
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <span>{currentSortLabel}</span>
            <span className={styles.sortIcon}>▼</span>
          </div>
          
          {showSortMenu && (
            <div className={styles.sortMenu}>
              {sortOptions.map(opt => (
                <div
                  key={opt.key}
                  className={`${styles.menuItem} ${sortType === opt.key ? styles.active : ''}`}
                  onClick={() => handleSortChange(opt.key)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.productCount}>{products.length}件商品</div>
      </div>

      {/* 商品列表 */}
      <div className={styles.productList}>
        <div className={styles.productGrid}>
          {isSearching ? (
            // 搜索加载效果
            Array(6).fill(0).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                </div>
              </div>
            ))
          ) : displayedProducts.length > 0 ? (
            <>
              {displayedProducts.map(product => (
              <div
                key={product.id}
                className={styles.productCard}
                onClick={() => handleProductClick(product)}
              >
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.name} />
                  {product.tags && product.tags[0] && (
                    <span className={styles.productTag}>{product.tags[0]}</span>
                  )}
                  {product.originalPrice && (
                    <span className={styles.discountTag}>
                      {(Math.floor((product.price / product.originalPrice)))}折
                    </span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productSubtitle}>{product.subtitle}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.rating}>⭐ {product.rating}</span>
                    <span className={styles.sales}>{product.sales}人购买</span>
                  </div>
                  <div className={styles.productBottom}>
                    <div className={styles.priceArea}>
                      <span className={styles.currency}>¥</span>
                      <span className={styles.price}>{product.price.toFixed(0)}</span>
                      {product.originalPrice && (
                        <span className={styles.originalPrice}>¥{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className={styles.addCartBtn}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              ))}
              
              {/* 加载更多指示器 */}
              {isLoading && hasMore && (
                Array(4).fill(0).map((_, index) => (
                  <div key={`loading-${index}`} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonInfo}>
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLine} />
                    </div>
                  </div>
                ))
              )}
              
              {/* 加载完成提示 */}
              {!hasMore && displayedProducts.length > 0 && (
                <div className={styles.loadEnd}>
                  <span>已加载全部 {products.length} 件商品</span>
                </div>
              )}
            </>
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '40px 0' }}>
              <Empty description="暂无商品" />
            </div>
          )}
        </div>
      </div>

      {/* 购物车弹窗 */}
      <Popup
        visible={showCartPopup}
        onMaskClick={() => setShowCartPopup(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '40vh' }}
      >
        <div className={styles.cartPopup}>
          <div className={styles.cartHeader}>
            <h3>购物车 ({cartCount})</h3>
            <span className={styles.clearBtn} onClick={handleClearCart}>清空</span>
          </div>
          
          <div className={styles.cartList}>
            {cartItems.length > 0 ? cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <img src={item.image} alt="" className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemBottom}>
                    <span className={styles.itemPrice}>¥{(item.price * item.quantity).toFixed(0)}</span>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={(e) => updateCartItemQuantity(e, index, -1)}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={(e) => updateCartItemQuantity(e, index, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <Empty description="购物车空空如也" />
            )}
          </div>

          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              合计: <span className={styles.totalPrice}>¥{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout} disabled={cartItems.length === 0}>
              去结算
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Mall;