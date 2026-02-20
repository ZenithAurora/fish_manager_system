// 收货地址数据管理 Mock
const STORAGE_KEY = 'fish_addresses';

// 初始化示例数据
const initAddresses = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultAddresses = [
      {
        id: '1',
        name: '张三',
        phone: '13812345678',
        province: '浙江省',
        city: '杭州市',
        district: '西湖区',
        detail: '文三路123号',
        tag: '公司',
        isDefault: true
      },
      {
        id: '2',
        name: '李四',
        phone: '13987654321',
        province: '浙江省',
        city: '杭州市',
        district: '滨江区',
        detail: '滨盛路456号',
        tag: '家',
        isDefault: false
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAddresses));
    return defaultAddresses;
  }
  return JSON.parse(existing);
};

// 获取所有地址
export const getAddresses = () => {
  return initAddresses();
};

// 获取默认地址
export const getDefaultAddress = () => {
  const addresses = getAddresses();
  return addresses.find(addr => addr.isDefault) || addresses[0] || null;
};

// 根据ID获取地址
export const getAddressById = (id) => {
  const addresses = getAddresses();
  return addresses.find(addr => addr.id === id) || null;
};

// 添加地址
export const addAddress = (addressData) => {
  try {
    const addresses = getAddresses();
    
    // 生成新ID
    const newId = Date.now().toString();
    
    // 如果是设置为默认地址，先取消其他地址的默认状态
    if (addressData.isDefault) {
      addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // 如果是第一个地址，自动设为默认
    const isFirstAddress = addresses.length === 0;
    
    const newAddress = {
      ...addressData,
      id: newId,
      isDefault: isFirstAddress ? true : (addressData.isDefault || false)
    };
    
    addresses.push(newAddress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return { success: true, data: newAddress };
  } catch (error) {
    console.error('添加地址失败:', error);
    return { success: false, message: '添加地址失败' };
  }
};

// 更新地址
export const updateAddress = (id, addressData) => {
  try {
    const addresses = getAddresses();
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index === -1) {
      return { success: false, message: '地址不存在' };
    }
    
    // 如果设置为默认地址，先取消其他地址的默认状态
    if (addressData.isDefault) {
      addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // 更新地址信息
    addresses[index] = {
      ...addresses[index],
      ...addressData,
      id // 保持ID不变
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return { success: true, data: addresses[index] };
  } catch (error) {
    console.error('更新地址失败:', error);
    return { success: false, message: '更新地址失败' };
  }
};

// 删除地址
export const deleteAddress = (id) => {
  try {
    let addresses = getAddresses();
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index === -1) {
      return { success: false, message: '地址不存在' };
    }
    
    const deletedAddress = addresses[index];
    addresses.splice(index, 1);
    
    // 如果删除的是默认地址，且还有其他地址，将第一个地址设为默认
    if (deletedAddress.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return { success: true, message: '删除成功' };
  } catch (error) {
    console.error('删除地址失败:', error);
    return { success: false, message: '删除地址失败' };
  }
};

// 设置默认地址
export const setDefaultAddress = (id) => {
  try {
    const addresses = getAddresses();
    
    // 取消所有地址的默认状态
    addresses.forEach(addr => {
      addr.isDefault = addr.id === id;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    
    return { success: true, message: '设置成功' };
  } catch (error) {
    console.error('设置默认地址失败:', error);
    return { success: false, message: '设置失败' };
  }
};