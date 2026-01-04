# 🔄 项目结构迁移指南

## ⚠️ 重要提示

在执行迁移之前，请务必：
1. ✅ 备份整个项目
2. ✅ 提交当前所有更改到 Git
3. ✅ 确保项目当前可以正常运行

## 📋 迁移步骤

### 阶段 1: 已完成 ✅

- [x] 创建 docs 目录
- [x] 移动文档文件到 docs
- [x] 删除重复的 .css 文件

### 阶段 2: 目录重命名（需要手动执行）

由于目录重命名会影响大量 import 路径，建议分步骤进行：

#### 步骤 1: 重命名 Pages → pages ✅ 已完成

```bash
# 在项目根目录执行
cd d:\my-react-demo\src
Rename-Item -Path "Pages" -NewName "pages"
```

**影响的文件：**
- `main.tsx` - 导入 LoginPage
- `src/routes/routes.ts` - 路由配置

**需要更新的 import：**
```typescript
// 修改前
import LoginPage from "./src/Pages/Login/LoginPage";

// 修改后
import LoginPage from "./src/pages/login/LoginPage";
```

#### 步骤 2: 重命名 Components → components ✅ 已完成

```bash
cd d:\my-react-demo\src\common
Rename-Item -Path "Components" -NewName "components"
```

**影响的文件：**
- 所有引用 `ResponsiveConfigSwitcher` 的文件

**需要更新的 import：**
```typescript
// 修改前
import ResponsiveConfigSwitcher from '@/common/Components/ResponsiveConfigSwitcher';

// 修改后
import ResponsiveConfigSwitcher from '@/common/components/ResponsiveConfigSwitcher';
```

#### 步骤 3: 重命名 Hooks → hooks ✅ 已完成

```bash
cd d:\my-react-demo\src\common
Rename-Item -Path "Hooks" -NewName "hooks"
```

**影响的文件：**
- `main.tsx` - 导入 useStorage
- 所有使用自定义 hooks 的组件

**需要更新的 import：**
```typescript
// 修改前（已完成）
import useStorage from "./src/common/Hooks/useStorage";

// 修改后（当前）
import useStorage from "./src/common/hooks/useStorage";
```

#### 步骤 4: 重命名 Global → config ✅ 已完成

```bash
cd d:\my-react-demo\src\common
Rename-Item -Path "Global" -NewName "config"
```

**影响的文件：**
- `main.tsx` - 导入 globalFontSize, redux, context
- 所有引用响应式配置的文件

**需要更新的 import：**
```typescript
// 修改前
import "./src/common/Global/globalFontSize";
import store from "./src/common/Global/redux";
import { GlobalContext } from "./src/common/Global/context";

// 修改后
import "./src/common/config/globalFontSize";
import store from "./src/common/config/redux";
import { GlobalContext } from "./src/common/config/context";
```

### 阶段 3: 文件重命名（建议使用 IDE 重构功能）

#### 组件文件统一命名

使用 VS Code 或 Cursor 的重构功能（F2）重命名：

1. **Banner 组件**
   - `Banner.tsx` → 创建 `banner/index.tsx`
   - `banner.less` → 移动到 `banner/index.less`

2. **Forms 组件**
   - `Forms.tsx` → 创建 `forms/index.tsx`

3. **LoginBoard 组件**
   - `LoginBoard.tsx` → 创建 `login-board/index.tsx`

### 阶段 4: 更新配置文件

#### 更新 vite.config.js

如果使用了路径别名，需要更新：

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@config': path.resolve(__dirname, 'src/common/config'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  }
}
```

#### 更新 tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@config/*": ["./src/common/config/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

## 🔍 验证清单

迁移完成后，请检查：

- [ ] 项目可以正常启动（`npm run dev`）
- [ ] 所有页面可以正常访问
- [ ] 没有 import 错误
- [ ] 样式正常加载
- [ ] 响应式功能正常工作
- [ ] Redux 状态管理正常
- [ ] 路由跳转正常

## 🛠️ 故障排查

### 问题 1: 找不到模块

**错误信息：**
```
Cannot find module './src/Pages/Login/LoginPage'
```

**解决方法：**
1. 检查文件路径是否正确
2. 确认目录名称已更新（Pages → pages）
3. 更新 import 语句

### 问题 2: 样式丢失

**可能原因：**
- .less 文件路径错误
- import 语句未更新

**解决方法：**
1. 检查 .less 文件是否存在
2. 确认 import 路径正确
3. 清除缓存重新启动

### 问题 3: TypeScript 类型错误

**解决方法：**
1. 更新 tsconfig.json 的 paths 配置
2. 重启 TypeScript 服务器
3. 删除 node_modules/.vite 缓存

## 📝 批量替换建议

可以使用 VS Code 的全局搜索替换功能：

### 替换 1: Pages → pages
```
查找: from "./src/Pages/
替换: from "./src/pages/
```

### 替换 2: Components → components
```
查找: from '@/common/Components/
替换: from '@/common/components/
```

### 替换 3: Hooks → hooks
```
查找: from "./src/common/Hooks/
替换: from "./src/common/hooks/
```

### 替换 4: Global → config
```
查找: from "./src/common/Global/
替换: from "./src/common/config/
```

## 🎯 推荐迁移顺序

1. **先迁移不影响其他文件的目录**
   - docs（已完成）
   - 删除 .css 文件（已完成）

2. **再迁移影响较小的目录**
   - Hooks → hooks
   - Components → components

3. **最后迁移核心目录**
   - Pages → pages
   - Global → config

4. **统一文件命名**
   - 组件文件改为 index.tsx
   - 样式文件改为 index.less

5. **更新配置和验证**
   - 更新 vite.config.js
   - 更新 tsconfig.json
   - 运行项目验证

## ⏰ 预计时间

- 目录重命名：10-15 分钟
- 更新 import 路径：20-30 分钟
- 文件重命名：15-20 分钟
- 测试验证：10-15 分钟

**总计：约 1 小时**

## 💡 小贴士

1. **使用 IDE 的重构功能**
   - VS Code: F2 重命名
   - 自动更新所有引用

2. **分批提交**
   - 每完成一个阶段就提交一次
   - 方便回滚

3. **保持项目运行**
   - 边改边测试
   - 及时发现问题

4. **使用搜索功能**
   - Ctrl+Shift+F 全局搜索
   - 确保没有遗漏的引用

## 📞 需要帮助？

如果在迁移过程中遇到问题，可以：
1. 查看本文档的故障排查部分
2. 回滚到上一个提交
3. 寻求团队成员帮助

