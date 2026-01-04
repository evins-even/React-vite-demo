# 响应式 rem 配置说明

## 📋 配置概览

本项目使用 `postcss-pxtorem` + 动态根字体大小实现响应式布局。

### 核心配置

- **postcss rootValue**: `100px` (在 `vite.config.js` 中配置)
- **设计稿宽度**: `1920px` (可在 `responsiveConfig.ts` 中调整)
- **转换比例**: `px / 100 = rem`

## 🎯 使用方法

### 1. 在 CSS/Less 中直接写 px

```css
/* 你写的代码 */
.container {
  width: 1920px;
  height: 1080px;
  font-size: 16px;
  padding: 20px;
}

/* 自动转换为 */
.container {
  width: 19.2rem;
  height: 10.8rem;
  font-size: 0.16rem;
  padding: 0.2rem;
}
```

### 2. 响应式效果

| 屏幕宽度 | 根字体大小 | 1920px 元素实际显示 |
|---------|-----------|-------------------|
| 1920px  | 100px     | 1920px (1:1)      |
| 1440px  | 75px      | 1440px (0.75:1)   |
| 960px   | 50px      | 960px (0.5:1)     |
| 375px   | 20px (最小) | 375px (限制最小值) |

### 3. 配置切换

在 `responsiveConfig.ts` 中切换不同的预设配置：

```typescript
// PC 端优先
export const currentConfig = presetConfigs.desktop;

// 移动端优先
export const currentConfig = presetConfigs.mobile;

// 响应式（推荐）
export const currentConfig = presetConfigs.responsive;
```

### 4. 自定义配置

```typescript
export const currentConfig: ResponsiveConfig = {
  baseSize: 100,        // 基准字体（需与 vite.config.js 的 rootValue 一致）
  designWidth: 1920,    // 你的设计稿宽度
  minSize: 20,          // 最小字体限制
  maxSize: 200,         // 最大字体限制
  debounceTime: 300,    // 窗口变化防抖时间
};
```

## 🔧 高级用法

### 针对特定设备的样式

系统会自动在 `<html>` 标签上添加 `data-device` 属性：

```css
/* 移动端特殊样式 */
html[data-device="mobile"] .container {
  padding: 10px;
}

/* PC 端特殊样式 */
html[data-device="desktop"] .container {
  padding: 20px;
}
```

### 排除某些文件不转换

在 `vite.config.js` 中配置：

```javascript
px2rem({ 
  rootValue: 100,
  exclude: /node_modules|global\.less|某个文件\.css/i,
  propList: ['*']
})
```

### 不转换特定属性

```javascript
px2rem({ 
  rootValue: 100,
  propList: ['*', '!border', '!border-width'], // 不转换 border 相关
})
```

## 📊 转换对照表（rootValue = 100）

| 设计稿 px | 转换后 rem | 1920px 屏幕 | 960px 屏幕 |
|----------|-----------|------------|-----------|
| 1920px   | 19.2rem   | 1920px     | 960px     |
| 1000px   | 10rem     | 1000px     | 500px     |
| 100px    | 1rem      | 100px      | 50px      |
| 50px     | 0.5rem    | 50px       | 25px      |
| 16px     | 0.16rem   | 16px       | 8px       |

## 🎨 实际案例

### 案例 1：全屏容器

```css
.full-screen {
  width: 1920px;   /* 自动转为 19.2rem，始终占满设计稿宽度 */
  height: 1080px;  /* 自动转为 10.8rem */
}
```

### 案例 2：固定大小元素（不想响应式）

```css
/* 方法 1：使用 PX（大写）不转换 */
.fixed-size {
  width: 200PX;  /* 保持 200px，不转换 */
}

/* 方法 2：在文件名中添加排除规则 */
/* 将文件命名为 xxx.global.less，在 vite.config.js 中排除 */
```

### 案例 3：混合使用

```css
.card {
  width: 400px;        /* 响应式宽度 */
  border: 1PX solid;   /* 固定 1px 边框 */
  font-size: 16px;     /* 响应式字体 */
}
```

## 🐛 常见问题

### Q1: 为什么选择 rootValue = 100？

**A**: 方便计算和精度控制
- `100px = 1rem`，心算方便
- 避免小数点过多（如 rootValue=16 时，15px = 0.9375rem）
- 便于设计稿直接转换

### Q2: 如何处理 1px 边框问题？

**A**: 使用大写 PX 或设置 minPixelValue
```css
border: 1PX solid;  /* 不转换，始终 1px */
```

### Q3: 移动端和 PC 端如何兼容？

**A**: 使用响应式配置，系统会自动限制最小/最大值
```typescript
currentConfig = presetConfigs.responsive; // 自动适配所有设备
```

### Q4: 字体太小或太大怎么办？

**A**: 调整 `responsiveConfig.ts` 中的 `minSize` 和 `maxSize`

## 📝 注意事项

1. ⚠️ **保持一致性**: `vite.config.js` 的 `rootValue` 必须与 `responsiveConfig.ts` 的 `baseSize` 一致
2. ⚠️ **设计稿宽度**: 确保 `designWidth` 与你的设计稿实际宽度匹配
3. ⚠️ **第三方库**: node_modules 已默认排除，不会转换
4. ⚠️ **性能**: resize 事件已做防抖处理，不用担心性能问题

## 🚀 快速开始

1. 确认配置正确（已配置完成）
2. 在 CSS 中直接写设计稿的 px 值
3. 系统自动转换为 rem 并响应式缩放
4. 运行项目，打开控制台查看当前根字体大小

```bash
npm run dev
```

打开浏览器控制台，调整窗口大小，会看到：
```
📐 响应式字体大小：100.00px
   屏幕宽度: 1920px
   设备类型: wide
   缩放比例: 1.0000
```

## 📚 相关文件

- `vite.config.js` - postcss-pxtorem 配置
- `globalFontSize.ts` - 动态设置根字体大小
- `responsiveConfig.ts` - 响应式配置参数

