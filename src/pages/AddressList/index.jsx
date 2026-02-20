import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavBar, Button, Dialog, Toast, SwipeAction } from 'antd-mobile';
import { AddOutline, EnvironmentOutline } from 'antd-mobile-icons';
import { getAddresses, deleteAddress, setDefaultAddress } from '../../mock/addressData';
import './index.scss';

const AddressList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [addresses, setAddresses] = useState([]);
  const isSelectMode = location.state?.selectMode || false; // 是否是选择地址模式

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    const data = getAddresses();
    setAddresses(data);
  };

  // 选择地址（从订单确认页进入时）
  const handleSelectAddress = (address) => {
    if (isSelectMode) {
      navigate('/order-confirm', { 
        state: { 
          ...location.state,
          selectedAddress: address 
        },
        replace: true
      });
    }
  };

  // 编辑地址
  const handleEdit = (e, address) => {
    e.stopPropagation();
    navigate(`/address-edit/${address.id}`);
  };

  // 删除地址
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Dialog.confirm({
      content: '确定要删除这个地址吗？',
      confirmText: '删除',
      cancelText: '取消',
    });

    if (result) {
      const res = deleteAddress(id);
      if (res.success) {
        Toast.show({ content: '删除成功', icon: 'success' });
        loadAddresses();
      } else {
        Toast.show({ content: res.message, icon: 'fail' });
      }
    }
  };

  // 设置默认地址
  const handleSetDefault = (e, id) => {
    e.stopPropagation();
    const res = setDefaultAddress(id);
    if (res.success) {
      Toast.show({ content: '设置成功', icon: 'success' });
      loadAddresses();
    } else {
      Toast.show({ content: res.message, icon: 'fail' });
    }
  };

  // 新增地址
  const handleAdd = () => {
    navigate('/address-edit');
  };

  return (
    <div className="address-list-container">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="nav-bar"
      >
        {isSelectMode ? '选择收货地址' : '收货地址管理'}
      </NavBar>

      <div className="content-area">
        {addresses.length === 0 ? (
          // 空状态
          <div className="empty-state">
            <EnvironmentOutline className="empty-icon" />
            <p className="empty-text">还没有收货地址</p>
            <p className="empty-tip">添加收货地址，方便下次购买</p>
            <Button 
              color="primary" 
              className="add-btn-empty"
              onClick={handleAdd}
            >
              添加收货地址
            </Button>
          </div>
        ) : (
          // 地址列表
          <div className="address-list">
            {addresses.map((address) => (
              <SwipeAction
                key={address.id}
                rightActions={[
                  {
                    key: 'delete',
                    text: '删除',
                    color: 'danger',
                    onClick: (e) => handleDelete(e, address.id),
                  },
                ]}
              >
                <div 
                  className={`address-item ${isSelectMode ? 'selectable' : ''}`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="address-content">
                    <div className="address-header">
                      <span className="name">{address.name}</span>
                      <span className="phone">{address.phone}</span>
                      {address.tag && (
                        <span className={`tag tag-${address.tag}`}>
                          {address.tag}
                        </span>
                      )}
                    </div>
                    <div className="address-detail">
                      <EnvironmentOutline className="location-icon" />
                      <span>
                        {address.province} {address.city} {address.district} {address.detail}
                      </span>
                    </div>
                  </div>
                  
                  <div className="address-actions">
                    <div 
                      className={`default-checkbox ${address.isDefault ? 'checked' : ''}`}
                      onClick={(e) => !address.isDefault && handleSetDefault(e, address.id)}
                    >
                      <span className="checkbox-icon">
                        {address.isDefault && '✓'}
                      </span>
                      <span className="checkbox-label">默认地址</span>
                    </div>
                    <Button 
                      size="small" 
                      fill="none"
                      className="edit-btn"
                      onClick={(e) => handleEdit(e, address)}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              </SwipeAction>
            ))}
          </div>
        )}
      </div>

      {/* 底部新增按钮 */}
      {addresses.length > 0 && (
        <div className="bottom-bar">
          <Button 
            color="primary" 
            className="add-btn"
            icon={<AddOutline />}
            onClick={handleAdd}
          >
            新增收货地址
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressList;