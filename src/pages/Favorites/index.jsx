import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Button, Toast, Dialog, Checkbox, Empty } from 'antd-mobile';
import { HeartOutline, HeartFill, DeleteOutline } from 'antd-mobile-icons';
import { getFavorites, removeFavorite, removeFavorites } from '../../mock/favoritesData';
import './index.scss';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // 加载收藏列表
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const data = getFavorites();
    setFavorites(data);
  };

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 点击商品跳转详情
  const handleProductClick = (product) => {
    if (isEditMode) return; // 编辑模式不跳转
    navigate('/product-detail', { state: { product } });
  };

  // 取消收藏
  const handleRemoveFavorite = (productId, e) => {
    e.stopPropagation();
    
    Dialog.confirm({
      content: '确定取消收藏该商品吗？',
      confirmText: '取消收藏',
      cancelText: '再想想',
      onConfirm: () => {
        const success = removeFavorite(productId);
        if (success) {
          Toast.show({ content: '已取消收藏', icon: 'success' });
          loadFavorites();
        } else {
          Toast.show({ content: '操作失败', icon: 'fail' });
        }
      }
    });
  };

  // 切换编辑模式
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedIds([]);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map(item => item.id));
    }
  };

  // 单选
  const handleSelectItem = (productId) => {
    if (selectedIds.includes(productId)) {
      setSelectedIds(selectedIds.filter(id => id !== productId));
    } else {
      setSelectedIds([...selectedIds, productId]);
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      Toast.show({ content: '请选择要删除的商品', icon: 'fail' });
      return;
    }

    Dialog.confirm({
      content: `确定取消收藏选中的 ${selectedIds.length} 个商品吗？`,
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: () => {
        const success = removeFavorites(selectedIds);
        if (success) {
          Toast.show({ content: '批量删除成功', icon: 'success' });
          loadFavorites();
          setSelectedIds([]);
          setIsEditMode(false);
        } else {
          Toast.show({ content: '操作失败', icon: 'fail' });
        }
      }
    });
  };

  // 去商城逛逛
  const handleGoMall = () => {
    navigate('/mall');
  };

  return (
    <div className="favorites-page">
      {/* 导航栏 */}
      <NavBar
        onBack={handleBack}
        className="favorites-nav"
        right={
          favorites.length > 0 && (
            <span className="nav-edit" onClick={toggleEditMode}>
              {isEditMode ? '完成' : '管理'}
            </span>
          )
        }
      >
        我的收藏
      </NavBar>

      {/* 收藏列表 */}
      <div className="favorites-content">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <Empty
              description="还没有收藏任何商品"
              imageStyle={{ width: 120 }}
            />
            <Button
              className="go-mall-btn"
              onClick={handleGoMall}
            >
              去商城逛逛
            </Button>
          </div>
        ) : (
          <>
            {/* 编辑模式工具栏 */}
            {isEditMode && (
              <div className="edit-toolbar">
                <Checkbox
                  checked={selectedIds.length === favorites.length}
                  onChange={handleSelectAll}
                >
                  全选
                </Checkbox>
                <span className="selected-count">
                  已选 {selectedIds.length}/{favorites.length}
                </span>
              </div>
            )}

            {/* 商品网格 */}
            <div className="favorites-grid">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className={`favorite-item ${isEditMode ? 'edit-mode' : ''}`}
                  onClick={() => handleProductClick(product)}
                >
                  {/* 编辑模式复选框 */}
                  {isEditMode && (
                    <div
                      className="item-checkbox"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(product.id);
                      }}
                    >
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                      />
                    </div>
                  )}

                  {/* 商品图片 */}
                  <div className="item-image-wrapper">
                    <img src={product.image} alt={product.name} className="item-image" />
                    {product.tags && product.tags[0] && (
                      <span className="item-badge">{product.tags[0]}</span>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div className="item-info">
                    <h3 className="item-name">{product.name}</h3>
                    <p className="item-subtitle">{product.subtitle}</p>
                    
                    <div className="item-footer">
                      <div className="item-price">
                        <span className="currency">¥</span>
                        <span className="price">{product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="original-price">
                            ¥{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* 非编辑模式显示收藏按钮 */}
                      {!isEditMode && (
                        <div
                          className="item-favorite"
                          onClick={(e) => handleRemoveFavorite(product.id, e)}
                        >
                          <HeartFill className="favorite-icon active" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 编辑模式底部操作栏 */}
      {isEditMode && favorites.length > 0 && (
        <div className="edit-bottom-bar">
          <Button
            className="delete-btn"
            onClick={handleBatchDelete}
            disabled={selectedIds.length === 0}
          >
            <DeleteOutline /> 删除选中
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;