/**
 * Mock数据统一导出
 * 便于后续替换为真实API接口
 */

export { fishProducts, getFishById, getRandomFish } from './fishProducts';
export { traceNodes, getTraceByFishId } from './traceData';
export { mockUser, updateUserInfo, checkPayPassword } from './userData';
export { orders, addOrder, getOrderById, getOrdersByUserId } from './orderData';
export { cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart } from './cartData';
export { mockLogin, mockRegister, mockSendCode, MOCK_VERIFY_CODE } from './authService';