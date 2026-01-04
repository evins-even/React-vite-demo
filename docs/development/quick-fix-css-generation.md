# ⚡ 快速修复：停止自动生成 CSS 文件

## 🎯 问题

保存 `.less` 文件时自动生成 `.css` 文件

## ✅ 快速解决（3 步）

### 步骤 1: 检查插件

打开扩展面板（`Ctrl+Shift+X`），搜索并**卸载**以下插件：

- ❌ **Easy LESS**
- ❌ **Live Sass Compiler**
- ❌ **Compile Hero**

### 步骤 2: 重启编辑器

关闭并重新打开 VS Code/Cursor

### 步骤 3: 清理已生成的 CSS 文件（可选）

在项目根目录执行：

```powershell
# PowerShell
Get-ChildItem -Path src -Filter *.css -Recurse | Remove-Item -Force
```

或者手动删除 `src/` 目录下的所有 `.css` 文件。

---

## 🔍 验证

1. 编辑任意 `.less` 文件
2. 保存（`Ctrl+S`）
3. 检查是否生成了 `.css` 文件

**如果没有生成，说明配置成功！** ✅

---

## 💡 为什么不需要 CSS 文件？

本项目使用 **Vite**，它会自动编译 Less：

```
你编辑 .less 文件
    ↓
Vite 自动编译（内存中）
    ↓
自动应用 px→rem 转换
    ↓
热更新到浏览器
```

**无需手动生成 CSS 文件！**

---

## 📋 已配置的保护措施

项目已经配置了以下保护：

1. ✅ `.vscode/settings.json` - 禁用自动编译
2. ✅ `.gitignore` - 忽略 CSS 文件（不会提交到 Git）
3. ✅ `.vscode/extensions.json` - 标记不推荐的插件

---

## 🆘 还是不行？

查看详细指南：[Less 编译配置指南](./less-compilation-guide.md)

或者检查：

1. 是否安装了其他 CSS/Less 编译工具
2. 用户级别的 VS Code 设置（不是项目设置）
3. 是否有其他构建工具在运行

---

## 📞 需要帮助？

1. 查看 [Less 编译配置指南](./less-compilation-guide.md)
2. 查看 [文档中心](./README.md)
