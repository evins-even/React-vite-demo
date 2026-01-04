# 📝 响应式配置总结

## �?核心配置

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

```typescript
export const currentConfig: ResponsiveConfig = {
  baseSize: 100,        // 必须�?vite.config.js �?rootValue 一�?
  designWidth: 1920,    // 设计稿宽�?
  minSize: 20,          // 最小字�?
  maxSize: 200,         // 最大字�?
  debounceTime: 300,    // 防抖时间
};
```

### 3. 动态字�?(`src/common/Global/globalFontSize.ts`)

- 自动根据屏幕宽度调整根字体大�?
- 监听窗口变化（防抖处理）
- 添加设备类型标识

## 🎯 使用方法

### 响应式元素（推荐�?
```css
.container {
  width: 200px;    /* 自动转为 2rem，响应式 */
}
```

### 固定大小元素
```css
.fixed {
  width: 200PX;    /* 大写 PX，保�?200px，不转换 */
}
```

## 📊 转换效果

| 屏幕宽度 | 根字�?| 200px 实际显示 |
|---------|-------|---------------|
| 1920px  | 100px | 200px         |
| 1440px  | 75px  | 150px         |
| 960px   | 50px  | 100px         |

## 🔧 配置切换

编辑 `src/common/config/responsiveConfig.ts`�?

```typescript
// 切换为移动端优先
export const currentConfig = presetConfigs.mobile;

// 切换�?PC 端优�?
export const currentConfig = presetConfigs.desktop;

// 响应式（推荐�?
export const currentConfig = presetConfigs.responsive;
```

## 📝 注意事项

1. �?`vite.config.js` �?`rootValue` �?`responsiveConfig.ts` �?`baseSize` 必须一�?
2. �?设计稿宽度设置为 1920px（可根据实际调整�?
3. �?`globalFontSize.ts` 已在 `main.tsx` 中引�?
4. �?1px 边框建议使用大写 `1PX` 避免转换

## 📚 相关文档

- [快速上手](./responsive-setup.md)
- [完整指南](./responsive-guide.md)
- [工作流程](./responsive-flow.md)
- [快速参考](./quick-reference.md)


