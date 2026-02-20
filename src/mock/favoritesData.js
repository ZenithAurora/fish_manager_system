/**
 * 收藏数据管理 Mock
 * 使用 localStorage 实现持久化存储
 */

const FAVORITES_KEY = 'fish_favorites';

/**
 * 获取收藏列表
 * @returns {Array} 收藏的商品列表
 */
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return [];
  }
};

/**
 * 添加收藏
 * @param {Object} product - 商品对象
 * @returns {boolean} 是否添加成功
 */
export const addFavorite = (product) => {
  try {
    const favorites = getFavorites();
    
    // 检查是否已收藏
    if (favorites.some(item => item.id === product.id)) {
      return false;
    }
    
    // 添加收藏时间戳
    const favoriteItem = {
      ...product,
      favoriteTime: new Date().toISOString()
    };
    
    favorites.unshift(favoriteItem); // 新收藏放在最前面
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('添加收藏失败:', error);
    return false;
  }
};

/**
 * 取消收藏
 * @param {string} productId - 商品ID
 * @returns {boolean} 是否取消成功
 */
export const removeFavorite = (productId) => {
  try {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter(item => item.id !== productId);
    
    if (filteredFavorites.length === favorites.length) {
      return false; // 没有找到要删除的商品
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    return true;
  } catch (error) {
    console.error('取消收藏失败:', error);
    return false;
  }
};

/**
 * 批量取消收藏
 * @param {Array<string>} productIds - 商品ID数组
 * @returns {boolean} 是否取消成功
 */
export const removeFavorites = (productIds) => {
  try {
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter(
      item => !productIds.includes(item.id)
    );
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    return true;
  } catch (error) {
    console.error('批量取消收藏失败:', error);
    return false;
  }
};

/**
 * 检查商品是否已收藏
 * @param {string} productId - 商品ID
 * @returns {boolean} 是否已收藏
 */
export const isFavorited = (productId) => {
  try {
    const favorites = getFavorites();
    return favorites.some(item => item.id === productId);
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return false;
  }
};

/**
 * 清空所有收藏
 * @returns {boolean} 是否清空成功
 */
export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error('清空收藏失败:', error);
    return false;
  }
};

/**
 * 获取收藏数量
 * @returns {number} 收藏数量
 */
export const getFavoritesCount = () => {
  return getFavorites().length;
};

/**
 * 切换收藏状态
 * @param {Object} product - 商品对象
 * @returns {boolean} 切换后的收藏状态（true表示已收藏，false表示未收藏）
 */
export const toggleFavorite = (product) => {
  if (isFavorited(product.id)) {
    removeFavorite(product.id);
    return false;
  } else {
    addFavorite(product);
    return true;
  }
};