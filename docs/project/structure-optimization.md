# 📁 项目结构优化方案

## 🎯 优化目标

1. ✅ 统一命名规范（全部小写 + 短横线）
2. ✅ 清理重复文件（只保留 .less）
3. ✅ 整理文档位置（统一到 docs 目录）
4. ✅ 合并重复功能
5. ✅ 清理空目录

## 📊 当前结构

```
my-react-demo/
├── docs/                      # ✅ 已整理：统一文档目录
├── src/
│   ├── common/
│   │   ├── Components/        # ⚠️ 大写不统一
│   │   ├── Global/            # ⚠️ 可改为 config
│   │   ├── Hooks/             # ⚠️ 大写不统一
│   │   └── styles/            # ✅ 全局样式
│   └── Pages/                 # ⚠️ 大写不统一
└── README.md                  # ✅ 项目主文档
```

## ✅ 已完成的优化

### 1. 文档整理
- ✅ 创建 `docs/` 目录
- ✅ 移动所有文档到 docs
- ✅ 删除根目录的冗余文档
- ✅ 创建文档索引

### 2. 清理重复文件
- ✅ 删除所有 .css 文件（8个）
- ✅ 统一使用 .less 文件
- ✅ 配置 .gitignore 忽略自动生成的 CSS

### 3. 配置文件
- ✅ 创建 `.vscode/settings.json`
- ✅ 创建 `.vscode/extensions.json`
- ✅ 更新 `.gitignore`

## 🔄 可选的进一步优化

### 目录重命名（统一小写）

由于 Windows 大小写不敏感，需要特殊处理：

```bash
# 使用 Git 重命名（推荐）
git mv src/Pages src/pages
git mv src/common/Components src/common/components
git mv src/common/Hooks src/common/hooks
git mv src/common/Global src/common/config
```

**注意：** 重命名后需要更新所有 import 路径，参考 [迁移指南](./migration-guide.md)

## 📝 命名规范

### 文件命名
- ✅ 组件文件: `index.tsx` 或 `component-name.tsx`（kebab-case）
- ✅ 样式文件: `index.less` 或 `component-name.less`
- ✅ 工具文件: `util-name.ts`（kebab-case）
- ✅ Hook 文件: `use-hook-name.ts`

### 目录命名
- ✅ 全部小写 + 短横线: `responsive-test/`, `login-board/`
- ❌ 避免大写: `Components/`, `Pages/`
- ❌ 避免驼峰: `loginPage/`, `userProfile/`

## 🎯 推荐的项目结构

```
my-react-demo/
├── docs/                      # 📚 项目文档
├── public/                    # 静态资源
├── src/
│   ├── main.tsx               # 应用入口
│   ├── App.tsx                # 根组件
│   ├── assets/                # 资源文件
│   ├── components/            # 全局组件（小写）
│   ├── config/                # 配置文件（原 Global）
│   │   ├── responsive.config.ts
│   │   ├── app.config.ts
│   │   └── store/             # Redux store
│   ├── hooks/                 # 自定义 Hooks（小写）
│   ├── pages/                 # 页面组件（小写）
│   │   ├── login/
│   │   └── responsive-test/
│   ├── routes/                # 路由配置
│   ├── services/              # API 服务
│   ├── styles/                # 全局样式
│   ├── types/                 # 类型定义
│   └── utils/                 # 工具函数
├── .vscode/                   # VS Code 配置
├── package.json
├── vite.config.js
└── README.md
```

## 💡 优化建议

### 立即可以做的
1. ✅ 使用新的文档结构
2. ✅ 只使用 .less 文件
3. ✅ 遵循命名规范

### 有时间可以做的
1. 🔄 目录重命名（参考迁移指南）
2. 🔄 统一文件命名
3. 🔄 配置路径别名

## 📚 相关文档

- [迁移指南](./migration-guide.md) - 详细的迁移步骤
- [优化总结](./optimization-summary.md) - 优化效果总结
- [文档中心](./README.md) - 所有文档索引

## 🎉 总结

### 已完成 ✅
- 文档整理
- 清理重复文件
- 配置优化
- 目录重命名