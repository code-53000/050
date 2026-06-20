# 老卡带收藏册

一个给老游戏玩家用的轻量卡带收藏管理工具，纯前端，数据存在本地浏览器里。

## 功能

- 🎮 登记卡带信息：平台、游戏名、成色、是否带原盒/说明书
- 📦 三种状态：在库、借出中、已出掉
- 🔍 按平台、成色、状态筛选，支持搜索游戏名
- 📋 借出未还面板，一眼看到谁借了多久
- 💾 数据存 IndexedDB，本地浏览器里，不用后端

## 技术栈

- React 18 + Vite
- Zustand 状态管理
- idb 操作 IndexedDB

## 目录结构

```
src/
├── components/       # UI 组件
│   ├── CartCard.jsx       # 单张卡带卡片
│   ├── CartForm.jsx       # 添加/编辑卡带表单
│   ├── CartList.jsx       # 卡带列表
│   ├── FilterBar.jsx      # 筛选侧边栏
│   ├── LoanForm.jsx       # 借出登记表单
│   └── LoanPanel.jsx      # 借出未还面板
├── constants/        # 常量定义（平台、成色、状态枚举）
│   └── index.js
├── db/               # 数据库层（IndexedDB 读写）
│   ├── index.js           # 数据库初始化
│   ├── carts.js           # 卡带表 CRUD
│   └── loans.js           # 借出记录表 CRUD
├── store/            # 状态层（Zustand）
│   ├── useCartStore.js    # 卡带状态 + 借还流转逻辑
│   └── useFilterStore.js  # 筛选状态
├── utils/            # 工具
│   └── sampleData.js      # 示例数据
├── App.jsx           # 主页面
├── main.jsx          # 入口
└── index.css         # 全局样式
```

## 启动步骤

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包构建
npm run build
```

启动后浏览器打开 `http://localhost:5173`。

## 示例数据

进入应用后，点击右上角「加载示例」按钮，会自动添加 12 盘示例卡带和 2 条借出记录，方便快速体验。

示例数据包含：
- 红白机 FC：魂斗罗、超级马里奥兄弟 3、双截龙 2
- 世嘉 MD：魂斗罗 铁血兵团、索尼克 2、光明与黑暗
- GBA：口袋妖怪 红宝石、马里奥赛车、塞尔达传说 缩小帽、星之卡比
- 超任 SFC：超级马里奥世界、最终幻想 6
- 2 条借出记录（小明、小红）

## 数据说明

所有数据都存在浏览器的 IndexedDB 里，数据库名 `retro-cart-db`，包含两张表：

- `carts`：卡带表
- `loans`：借出记录表

清除浏览器数据会删掉所有收藏，重要数据记得自己备份。
