# 🐟 鳗鱼溯源系统

一个基于 React + Vite 构建的鳗鱼产品全流程溯源电子商务系统，支持从养殖到销售的全链路追踪。

## 🌟 系统特性

### 🔍 核心功能
- **产品溯源**：扫描二维码查看鳗鱼从养殖到销售的完整生命周期
- **电子商城**：在线购买高品质鳗鱼产品
- **用户中心**：订单管理、地址管理、收藏夹等
- **AI分析**：基于购买行为的智能推荐与数据分析
- **移动端适配**：完美支持手机端访问

### 🎯 特色亮点
- **安全可靠**：完整的身份认证与权限管理
- **用户体验**：流畅的交互动效与现代化UI设计
- **数据可视化**：直观的溯源信息展示与统计图表
- **响应式布局**：适配不同尺寸的移动设备

## 📁 项目结构

```
fish_manager_system/
├── src/
│   ├── components/           # 可复用组件
│   │   ├── AIAnalysis/      # AI分析组件
│   │   ├── FeedbackModal/   # 反馈弹窗
│   │   ├── FooterNav/       # 底部导航
│   │   ├── QRCodeModal/     # 二维码弹窗
│   │   └── TraceLoader/     # 溯源加载器
│   ├── pages/               # 页面组件
│   │   ├── About/           # 关于页面
│   │   ├── AddressEdit/     # 地址编辑
│   │   ├── AddressList/     # 地址列表
│   │   ├── Favorites/       # 收藏夹
│   │   ├── Home/            # 首页
│   │   ├── Login/           # 登录页
│   │   ├── Mall/            # 商城页
│   │   ├── NodeDetail/      # 节点详情
│   │   ├── OrderConfirm/    # 订单确认
│   │   ├── OrderHistory/    # 订单历史
│   │   ├── ProductDetail/   # 商品详情
│   │   ├── QRCodeScanner/   # 二维码扫描
│   │   ├── ScannerResult/   # 扫码结果
│   │   ├── TraceHistory/    # 溯源历史
│   │   └── UserCenter/      # 用户中心
│   ├── assets/              # 静态资源
│   │   └── img/             # 图片资源
│   │       ├── bar/         # 条形图图片
│   │       ├── draft/       # 设计稿
│   │       ├── mapMock/     # 地图图片
│   │       ├── qrCodeMock/  # 二维码图片
│   │       ├── shopping/    # 商品图片
│   │       └── user/        # 用户头像
│   ├── mock/                # 模拟数据
│   │   ├── addressData.js   # 地址数据
│   │   ├── authService.js   # 认证服务
│   │   ├── cartData.js      # 购物车数据
│   │   ├── favoritesData.js # 收藏数据
│   │   ├── fishProducts.js  # 商品数据
│   │   ├── orderData.js     # 订单数据
│   │   ├── traceData.js     # 溯源数据
│   │   └── userData.js      # 用户数据
│   ├── styles/              # 样式文件
│   │   ├── design-system.scss # 设计系统
│   │   └── global.scss      # 全局样式
│   ├── router/              # 路由配置
│   ├── App.jsx              # 根组件
│   └── main.jsx             # 入口文件
├── public/                  # 公共资源
└── package.json             # 项目配置
```

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 pnpm

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
pnpm dev
# 或
npm run dev
```

### 构建生产版本
```bash
pnpm build
# 或
npm run build
```

### 预览构建结果
```bash
pnpm preview
# 或
npm run preview
```

## 📱 页面功能说明

### 1. 首页 (Home)
- 系统概览与功能介绍
- 热门商品展示
- 快速扫码入口

### 2. 登录页 (Login)
- 用户登录注册
- 身份验证

### 3. 商城页 (Mall)
- 鳗鱼商品展示
- 分类浏览
- 加入购物车

### 4. 商品详情页 (ProductDetail)
- 商品详细信息
- 溯源信息预览
- 购买操作

### 5. 扫码结果页 (ScannerResult)
- 二维码扫描结果
- 产品溯源信息展示
- 生产流程可视化

### 6. 订单确认页 (OrderConfirm)
- 订单信息确认
- 收货地址选择
- 支付方式选择

### 7. 用户中心 (UserCenter)
- 个人信息管理
- 订单历史
- 收货地址管理

## 🔧 技术栈

### 前端框架
- **React 19.2.0** - 现代用户界面构建
- **Vite 7.2.4** - 高性能构建工具和开发服务器

### UI组件库
- **Ant Design Mobile 5.42.3** - 移动端UI组件库
- **Ant Design Mobile Icons 0.3.0** - 图标集合
- **Lucide React 0.574.0** - 现代化图标库

### 二维码与扫描功能
- **@zxing/library 0.21.3** - 条码/二维码编码解码库
- **html5-qrcode 2.3.8** - HTML5二维码扫描
- **jsqr 1.4.0** - JavaScript二维码读取

### 路由与动画
- **React Router DOM 7.9.6** - 前端路由管理
- **Swiper 12.0.3** - 轮播图与触摸滑动组件

### 内容展示
- **React Markdown 10.1.0** - Markdown内容渲染
- **React Syntax Highlighter 16.1.0** - 代码语法高亮

### 样式方案
- **Sass 1.94.2** - CSS预处理器
- **CSS Modules** - 组件样式隔离

### 开发工具
- **ESLint 9.39.1** - 代码质量检查与格式化
- **TypeScript类型支持** - 类型安全开发

### 数据管理
- 前端模拟数据(Mock Data)
- 响应式状态管理

## 🌐 API接口 (模拟数据)

系统使用前端Mock数据模拟以下接口：

### 认证相关
- `authService.js` - 用户登录注册模拟

### 商品相关
- `fishProducts.js` - 商品数据管理
- `traceData.js` - 溯源信息查询

### 用户相关
- `userData.js` - 用户信息管理
- `addressData.js` - 收货地址管理
- `cartData.js` - 购物车管理
- `orderData.js` - 订单管理
- `favoritesData.js` - 收藏夹管理

## 🔒 安全特性

- 用户身份验证与授权
- 数据访问权限控制
- 前端路由保护
- 敏感信息加密存储

## 📊 数据可视化

系统提供以下可视化功能：
- 产品溯源流程展示
- 销售数据分析图表
- 用户行为统计
- 产品质量监控

## 🎨 UI/UX设计

- 现代化移动端设计
- 响应式布局适配
- 流畅的交互动效
- 直观的用户引导

## 📦 部署说明

### 开发环境
```bash
pnpm dev
```

### 生产环境构建
```bash
pnpm build
```

构建后的文件位于 `dist/` 目录，可直接部署到静态文件服务器。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**最后更新日期**: 2025-12-02  
**当前版本**: v1.0.0