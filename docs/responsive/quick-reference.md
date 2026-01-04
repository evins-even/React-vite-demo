# 📋 响应�?rem 快速参�?

## �?快速使�?

### 响应式元�?
```css
.element {
  width: 200px;    /* �?自动转为 2rem，响应式 */
}
```

### 固定大小元素
```css
.element {
  width: 200PX;    /* �?大写 PX，保�?200px，不转换 */
}
```

## 📐 转换规则

| 写法 | 转换结果 | 说明 |
|------|---------|------|
| `200px` | `2rem` | 响应式，会缩�?|
| `200PX` | `200px` | 固定，不缩放 |
| `2rem` | `2rem` | 保持不变 |

## 🔢 计算公式

```
px �?÷ 100 = rem �?

200px ÷ 100 = 2rem
50px ÷ 100 = 0.5rem
16px ÷ 100 = 0.16rem
```

## 📊 效果对照（以 200px 为例�?

| 屏幕宽度 | 根字�?| 实际显示 |
|---------|-------|---------|
| 1920px  | 100px | 200px   |
| 1440px  | 75px  | 150px   |
| 960px   | 50px  | 100px   |

## 🎨 常用场景

### 1. 全屏容器
```css
.container {
  width: 1920px;   /* 设计稿宽�?*/
  height: 1080px;  /* 设计稿高�?*/
}
```

### 2. 卡片组件
```css
.card {
  width: 400px;           /* 响应式宽�?*/
  padding: 20px;          /* 响应式内边距 */
  border: 1PX solid;      /* 固定 1px 边框 */
  border-radius: 8px;     /* 响应式圆�?*/
  font-size: 16px;        /* 响应式字�?*/
}
```

### 3. 按钮
```css
.button {
  width: 120px;
  height: 40px;
  padding: 10px 20px;
  font-size: 16px;
  border: 1PX solid;      /* 固定边框 */
}
```

## 🔧 配置切换

### 文件位置
`src/common/config/responsiveConfig.ts`

### 预设配置
```typescript
// PC �?(1920px)
export const currentConfig = presetConfigs.desktop;

// 移动�?(375px)
export const currentConfig = presetConfigs.mobile;

// 平板 (768px)
export const currentConfig = presetConfigs.tablet;

// 响应式（推荐�?
export const currentConfig = presetConfigs.responsive;
```

### 自定义配�?
```typescript
export const currentConfig: ResponsiveConfig = {
  baseSize: 100,        // 基准字体（与 vite.config.js 一致）
  designWidth: 1920,    // 设计稿宽�?
  minSize: 20,          // 最小字�?
  maxSize: 200,         // 最大字�?
  debounceTime: 300,    // 防抖时间
};
```

## 🎯 针对不同设备

```css
/* 移动�?*/
html[data-device="mobile"] .element {
  padding: 10px;
}

/* 平板 */
html[data-device="tablet"] .element {
  padding: 15px;
}

/* PC �?*/
html[data-device="desktop"] .element {
  padding: 20px;
}

/* 宽屏 */
html[data-device="wide"] .element {
  padding: 24px;
}
```

## 🐛 调试

### 查看控制�?
调整窗口大小，控制台会输出：
```
📐 响应式字体大小：100.00px
   屏幕宽度: 1920px
   设备类型: wide
   缩放比例: 1.0000
```

### 测试页面
访问：`/responsive-test`

## ⚠️ 注意事项

| 项目 | 说明 |
|------|------|
| �?基准一�?| vite.config.js �?rootValue 必须�?responsiveConfig.ts �?baseSize 一�?|
| �?设计稿宽�?| designWidth 应该与实际设计稿宽度匹配 |
| �?边框处理 | 1px 边框使用 `1PX` 避免转换 |
| �?第三方库 | node_modules 已排除，不会影响 |

## 📚 详细文档

- [响应式配置快速上手](./responsive-setup.md)
- [响应式完整指南](./responsive-guide.md)
- [工作流程图](./responsive-flow.md)
- [配置总结](./configuration-summary.md)
- [文档中心](./README.md)

## 🚀 开始使�?

```bash
npm run dev
```

就这么简单！直接�?CSS 中写 px，系统会自动处理响应式！🎉


