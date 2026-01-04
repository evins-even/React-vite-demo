# 🎨 响应�?rem 配置完成

## �?已完成的配置

### 1. Vite 配置 (`vite.config.js`)

```javascript
px2rem({ 
  rootValue: 100,     // 基准值：100px = 1rem
  exclude: /node_modules|global\.less/i, 
  propList: ['*'],
  unitPrecision: 5,
  minPixelValue: 1
})
```

### 2. 响应式配�?(`src/common/config/responsiveConfig.ts`)

提供�?4 种预设配置：
- **desktop**: PC 端优先（1920px 设计稿）
- **mobile**: 移动端优先（375px 设计稿）
- **tablet**: 平板优先�?68px 设计稿）
- **responsive**: 响应式（推荐，自适应所有设备）

当前使用�?*responsive**

### 3. 动态字体大�?(`src/common/Global/globalFontSize.ts`)

自动根据屏幕宽度调整根字体大小，实现等比缩放�?

## 🚀 快速使�?

### 方式 1：直接在 CSS/Less 中写 px

```css
.container {
  width: 1920px;    /* 自动转换�?19.2rem */
  height: 1080px;   /* 自动转换�?10.8rem */
  font-size: 16px;  /* 自动转换�?0.16rem */
}
```

### 方式 2：不想转换的使用大写 PX

```css
.fixed {
  border: 1PX solid #ccc;  /* 保持 1px，不转换 */
  width: 200PX;            /* 保持 200px，不转换 */
}
```

## 📊 转换效果

| 屏幕宽度 | 根字�?| 200px 元素实际显示 | 说明 |
|---------|-------|------------------|------|
| 1920px  | 100px | 200px            | 设计稿尺�?|
| 1440px  | 75px  | 150px            | 缩小 0.75 �?|
| 960px   | 50px  | 100px            | 缩小 0.5 �?|
| 375px   | 20px  | 40px             | 最小限�?|

## 🎯 你的 Banner.less 文件

当前代码会自动转换：

```less
.flip-card {
  width: 200px;      // �?2rem �?响应式宽�?
  height: 250px;     // �?2.5rem �?响应式高�?
}

.card-face {
  border-radius: 10px;  // �?0.1rem �?响应式圆�?
  padding: 20px;        // �?0.2rem �?响应式内边距
}
```

如果你想要边框固定为 1px�?

```less
.banner {
  border: 1PX solid red;  // 使用大写 PX，不转换
}

.card-face {
  &.front {
    border: 1PX solid blue;  // 固定 1px
  }
  &.back {
    border: 1PX solid green; // 固定 1px
  }
}
```

## 🔧 如何切换配置

### 切换为移动端优先

编辑 `src/common/config/responsiveConfig.ts`�?

```typescript
// 修改这一�?
export const currentConfig: ResponsiveConfig = presetConfigs.mobile;
```

### 自定义配�?

```typescript
export const currentConfig: ResponsiveConfig = {
  baseSize: 100,        // 必须�?vite.config.js �?rootValue 一�?
  designWidth: 1920,    // 你的设计稿宽�?
  minSize: 20,          // 最小字体（避免太小�?
  maxSize: 200,         // 最大字体（避免太大�?
  debounceTime: 300,    // 窗口变化防抖时间（毫秒）
};
```

## 📱 设备类型判断

系统会自动在 `<html>` 标签添加 `data-device` 属性：

```css
/* 针对移动端的特殊样式 */
html[data-device="mobile"] .banner {
  padding: 10px;
}

/* 针对 PC 端的特殊样式 */
html[data-device="desktop"] .banner {
  padding: 20px;
}
```

## 🐛 调试

打开浏览器控制台，调整窗口大小，会看到：

```
📐 响应式字体大小：100.00px
   屏幕宽度: 1920px
   设备类型: wide
   缩放比例: 1.0000
```

## 📝 注意事项

1. �?**已配置完�?*，无需额外安装依赖
2. �?**自动转换**，直接在 CSS 中写 px 即可
3. �?**响应�?*，会根据屏幕宽度自动缩放
4. ⚠️ **边框建议**�?px 边框使用大写 `1PX` 避免转换
5. ⚠️ **第三方库**：node_modules 已排除，不会影响第三方组�?

## 📚 相关文件

- `vite.config.js` - postcss 转换配置
- `src/common/Global/globalFontSize.ts` - 动态根字体
- `src/common/config/responsiveConfig.ts` - 响应式参�?
- `src/common/Global/README.md` - 详细文档
- `src/common/Global/example.css` - 使用示例

## 🎉 开始使�?

```bash
npm run dev
```

打开浏览器，调整窗口大小，看看响应式效果吧！

---

## 常见问题

### Q: 为什�?rootValue 选择 100�?

**A**: 方便计算
- 100px = 1rem（心算简单）
- 避免过多小数（如 16px 基准�?15px = 0.9375rem�?
- 设计稿直接除�?100 就是 rem �?

### Q: 如何处理设计稿是 750px 的情况？

**A**: 修改 `responsiveConfig.ts`�?
```typescript
export const currentConfig: ResponsiveConfig = {
  baseSize: 100,
  designWidth: 750,  // 改为 750
  // ... 其他配置
};
```

### Q: 能否混用 px �?rem�?

**A**: 可以�?
- 小写 `px` �?自动转换�?`rem`（响应式�?
- 大写 `PX` �?保持 `px`（固定大小）
- 手写 `rem` �?保持 `rem`

### Q: 如何禁用某个文件的转换？

**A**: �?`vite.config.js` 中添加排除规则：
```javascript
px2rem({ 
  rootValue: 100,
  exclude: /node_modules|global\.less|你的文件\.css/i,
  // ...
})
```

### Q: 字体在小屏幕上太小怎么办？

**A**: 调整 `minSize`�?
```typescript
export const currentConfig: ResponsiveConfig = {
  // ...
  minSize: 30,  // 增大最小�?
  // ...
};
```


