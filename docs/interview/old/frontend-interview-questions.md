# 比特鹰前端工程师面试题

> 应聘者姓名：**\*\*\*\***\_\_**\*\*\*\***
>
> 面试日期：**\*\*\*\***\_\_**\*\*\*\***
>
> 面试官：**\*\*\*\***\_\_**\*\*\*\***

---

## 一、JavaScript 基础（20 分）

### 1.1 请解释 JavaScript 中的闭包（Closure），并写出一个实际应用场景的例子

**回答：**
答：闭包 是一个函数内部的状态被外部持有时形成的，我会给你一个闭包的例子

```javascript
function closure() {
  let a = 1;
  function addA() {
    a++;
  }
  function getA() {
    return a;
  }
  return {
    addA,
    getA,
  };
}
```

在这个例子中，形成了一个闭包，a 的状态只能由闭包暴露出的方法修改，当外部持有该函数的引用时，函数内部状态就不会被清除。
react 中，日常开发使用的 useState 钩子就是对闭包的应用,我会给你一个自定义 hooks 的闭包例子

```javascript
type Prop = {
  a: string,
};

function useMyHooks({ a }: Prop) {
  const [data, setData] = useState(a);
  const addData = () => {
    setData((prevState) => preState++);
  };
  return {
    data,
    addData,
  };
}
//使用
const { myData, addMyData } = useMyHooks({ a: "1" });
console.log(myData);
addMyData();
```

---

**📌 面试官点评：3.5/5 分**

- 概念定义不够精确（缺少"词法作用域"）
- 示例较简单，未展示经典应用场景
- 缺少闭包的利弊分析

---

**💡 优秀回答参考（面试版）：**

**定义**：闭包是函数和其词法作用域的组合，内部函数可以访问外部函数的变量，即使外部函数已执行完毕。

**经典示例 - 防抖函数**：

```javascript
function debounce(fn, delay) {
  let timer = null; // 闭包保存 timer
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**React 闭包陷阱**：

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  // ❌ 闭包陷阱：定时器中的 count 永远是 0
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // 每次都是 0 + 1 = 1
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 空依赖，闭包捕获初始的 count = 0

  // ✅ 解决方案：使用函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1); // 拿到最新值
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 不依赖 count，但能正确累加
}
```

**优缺点**：

- ✅ 封装私有变量、数据持久化、实现防抖节流
- ⚠️ 可能内存泄漏，需及时解除引用

---

<br><br><br><br><br><br>

### 1.2 说明 `var`、`let`、`const` 的区别，以及什么是暂时性死区（TDZ）？

**回答：**
答：var let const 都是创建变量的方法， 区别在 var 创建的变量会被提升到全局作用域，在赋值前就可以被访问，
let const 创建的变量同样会被提升，但是在实际被赋值之前，都处于暂时性死区。
const 创建的变量可以称为常量，对于基本数据类型来说，创建后就不能进行修改，对于复杂数据类型例如对象来说，
const 保存的内存地址不能改变，对象内的属性及属性值可以修改。

```javascript
console.log(a); //会输出 undefined
var a = 1;
console.log(b, c); // 报错，因为bc处于暂时性死区
let b = "b";
const c = "c";
```

暂时性死区是 es6 引进的新状态，在被声明后和被赋值前，let 和 const 声明的变量就位于暂时性死区。

---

**📌 面试官点评：3.5/5 分**

**优点：**

- ✅ let/const 提升的理解正确（确实会提升但处于 TDZ）
- ✅ const 特性解释清楚
- ✅ 代码示例恰当

**需要改进：**

- ⚠️ var 的作用域：应该是"函数作用域/全局作用域"，不总是全局
- ⚠️ 缺少块级作用域这个**最重要**的区别
- ⚠️ TDZ 定义：是"从作用域开始到声明"，不是"声明后到赋值前"
- ⚠️ 缺少重复声明、循环等关键差异

---

**💡 优秀回答参考（面试版）：**

**核心区别**（按重要性排序）：

1. **作用域** ⭐ 最重要

   - `var`：函数作用域（或全局作用域）
   - `let/const`：块级作用域 `{}`

2. **变量提升**

   - `var`：提升并初始化为 `undefined`
   - `let/const`：提升但不初始化，处于 TDZ

3. **其他**：重复声明、重新赋值、全局对象属性

**代码示例**：

```javascript
// 1. 作用域差异（最关键！）
if (true) {
  var x = 1;
  let y = 2;
}
console.log(x); // 1（var 无块级作用域）
console.log(y); // ReferenceError

// 2. var 提升到函数作用域（不是全局）
function test() {
  console.log(a); // undefined（提升到函数顶部）
  var a = 1;
}

// 3. let/const 确实提升，但有 TDZ
let x = "outer";
{
  console.log(x); // ReferenceError（证明内层 let x 被提升了）
  let x = "inner"; // 如果不提升，应该能访问外层 x
}

// 4. 经典 for 循环
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0 1 2
}

// 5. const 特性
const obj = { name: "John" };
obj.name = "Jane"; // ✅ 属性可改
obj = {}; // ❌ 引用不可改
```

**TDZ 准确定义**：
从块级作用域开始到 let/const 声明语句之间的区域，访问变量会抛出 ReferenceError。

**最佳实践**：默认 `const` → 需要改用 `let` → 避免 `var`

---

<br><br><br><br><br><br>

### 1.3 请解释事件循环（Event Loop）机制，并说明宏任务和微任务的执行顺序

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => {
    console.log("3");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => {
    console.log("5");
  }, 0);
});

console.log("6");
```

**输出顺序：**
164235
<br><br>

**原因分析：**
答：首先我们要明确的是，js 的事件主要分为：同步任务，微任务，宏任务，执行时：同步任务最先并执行，同时 微任务和宏任务各自被加入队列中，
同步任务执行完毕后：检查微任务队列，依次执行，然后检查宏任务队列，依次执行，每次执行后，都检查是否有新的微任务被创建，有则立即执行微任务队列中被创建的微任务。
在一次宏任务执行完毕，并清空微任务队列后，检查是否有渲染任务，有则渲染。需要注意的是，渲染任务不一定每次都会执行，浏览器有对渲染的控制。

---

**📌 面试官点评：4.5/5 分** 🎉

**优点：**

- ✅ 输出顺序完全正确
- ✅ 核心概念准确（同步、微任务、宏任务）
- ✅ 执行逻辑清晰（微任务优先于宏任务）
- ✅ 提到了渲染时机和浏览器控制（加分项）

**小建议：**

- 如果能逐步拆解执行过程会更完美

---

**💡 优秀回答参考（面试版）：**

**Event Loop 核心机制**：

```
同步代码 → 清空微任务 → 取一个宏任务 → 清空微任务 → 渲染（可能）→ 循环
```

**本题执行过程**：

```javascript
// 1. 同步代码
console.log("1"); // 输出 1
// setTimeout 加入宏任务队列
// Promise.then 加入微任务队列
console.log("6"); // 输出 6
// 当前输出：1 6

// 2. 清空微任务队列
// 执行 Promise.then
console.log("4"); // 输出 4
// 内部 setTimeout 加入宏任务队列
// 当前输出：1 6 4

// 3. 执行第一个宏任务（第一个 setTimeout）
console.log("2"); // 输出 2
// 内部 Promise.then 加入微任务队列
// 当前输出：1 6 4 2

// 4. 清空微任务队列
console.log("3"); // 输出 3
// 当前输出：1 6 4 2 3

// 5. 执行第二个宏任务（第二个 setTimeout）
console.log("5"); // 输出 5
// 最终输出：1 6 4 2 3 5
```

**任务分类**：

| 宏任务                 | 微任务                     |
| ---------------------- | -------------------------- |
| setTimeout/setInterval | Promise.then/catch/finally |
| I/O                    | MutationObserver           |
| UI 渲染                | queueMicrotask             |
| setImmediate (Node)    | process.nextTick (Node)    |

**关键点**：

- 微任务优先级 > 宏任务
- 每个宏任务后清空所有微任务
- 渲染在宏任务和微任务之间（约 16.6ms 一次）

---

<br><br><br><br><br><br>

### 1.4 ES6+ 新特性：请列举至少 5 个 ES6+ 的新特性，并说明它们的使用场景

**回答：**
答：1：let/const 用于声明块级作用域变量，存在暂时性死区。
2：块级作用域：可以声明局部变量，块级作用域中声明的局部变量不会被外部捕获。
3：模板字符串：`这里是string，${name}` 可以方便的在文本中插入变量，而不用过多考虑隐式转换问题。
4：展开运算符与剩余参数：

```javascript
let a = { a: 1, b: 2 };
let b = { ...a, c: 3 }; // {a:1,b:2,c:3}
// 剩余参数
function func(...names) {
  return names; // 会把多的参数转换成一个数组
}
```

5：Map/Set 新增的复杂数据类型，用于处理键值对和值唯一集合
6：Class 方便继承，不用使用之前复杂的寄生组合式继承
7：箭头函数 没有自己的 this，继承外部环境的 this
8：Promise 处理异步，优化之前常用的回调方式处理异步，防止回调地狱产生。
9：解构赋值：[a,b] = [1,2] const {name, age} = {name: "John", age: 25};

---

**📌 面试官点评：4.5/5 分** 🎉🎉

**优点：**

- ✅ 数量超标（9 个特性）
- ✅ 格式清晰，代码优化
- ✅ 补充了解构赋值
- ✅ 核心概念准确

**小瑕疵：**

- ⚠️ 第 2 点与第 1 点重复（可换成 async/await 或模块化）
- ⚠️ 解构赋值示例缺少 `const`/`let`

---

**💡 优秀回答参考（面试版）：**

### Top 10 ES6+ 特性（按使用频率）：

**1. 箭头函数**

```javascript
// 不绑定 this
setTimeout(() => console.log(this.name), 1000);
```

**2. Promise / async-await**

```javascript
async function getData() {
  const res = await fetch("/api");
  return res.json();
}
```

**3. 解构赋值**

```javascript
const { name, age } = user;
const [first, ...rest] = [1, 2, 3];
```

**4. 展开运算符 / 剩余参数**

```javascript
const newObj = { ...obj, c: 3 };
function sum(...nums) {
  return nums.reduce((a, b) => a + b);
}
```

**5. 模板字符串**

```javascript
const msg = `Hello ${name}, you are ${age} years old`;
```

**6. let/const（块级作用域）**

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2
}
```

**7. 模块化（import/export）**

```javascript
import React, { useState } from "react";
export default Component;
```

**8. Class 类**

```javascript
class Student extends Person {
  constructor(name) {
    super(name);
  }
}
```

**9. 默认参数 / 可选链 / 空值合并**

```javascript
function greet(name = "Guest") {}
const name = user?.profile?.name;
const value = input ?? "default";
```

**10. Map/Set**

```javascript
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
const map = new Map([["key", "value"]]);
```

---

<br><br><br><br><br><br><br><br>

---

## 二、CSS3 相关（15 分）

### 2.1 请解释 CSS 盒模型，并说明 `box-sizing` 的作用

**回答：**
答；css 盒模型分为标准盒模型和替代盒模型，box-sizing 可以通过设置参数转换两种模型
标准盒模型(box-sizing:content-box)：
width/height 属性只负责表达标签内容宽高，标签总宽度需要加上 padding 和 border 的大小，而标签总占位宽度需要加上 margin 的大小。
替代盒模型(box-sizing:border-box):
width/height 属性表达标签总宽高也就是 内容宽高+ padding + border ，总占位需要加上 margin。

---

**📌 面试官点评：4/5 分** 🎉

**优点：**

- ✅ 核心概念准确（标准盒模型 vs 替代盒模型）
- ✅ box-sizing 作用说明清晰
- ✅ 宽度计算规则正确
- ✅ 提到了 margin 占位

**小建议：**

- ⚠️ 缺少代码示例和可视化说明
- ⚠️ 未说明实际应用场景和最佳实践
- ⚠️ 盒模型四部分可以更明确

---

**💡 优秀回答参考（面试版）：**

**盒模型组成**：Content → Padding → Border → Margin

**两种盒模型对比：**

```css
/* 1. 标准盒模型（默认） */
box-sizing: content-box;
width: 200px;
padding: 20px;
border: 5px;
/* 实际宽度 = 200 + 20*2 + 5*2 = 250px */

/* 2. 替代盒模型（推荐） */
box-sizing: border-box;
width: 200px;
padding: 20px;
border: 5px;
/* 实际宽度 = 200px（固定，更符合直觉） */
```

**为什么推荐 border-box？**

- 设置的 width 就是最终宽度
- 百分比布局 + padding 不会溢出

**最佳实践：**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

---

<br><br><br><br><br><br>

### 2.2 如何实现水平垂直居中？请写出至少 3 种方法

**方法一：**
答：使用 flex 布局

```css
.father {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
```

<br><br><br>

**方法二：**
答：对于文本：设置行高和容器高度一致，同时设置 text-align 属性

```css
.father {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```

定位实现

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
//方式2：定位+margin
.father1 {
  position: relative;
}
.son1 {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
```

<br><br><br>

**方法三：**
grid 布局

```css
.father {
  display: grid;
  place-items: center; /* 水平垂直居中 */
}
```

---

**📌 面试官点评：3.5/5 分**

**优点：**

- ✅ 方法多样（5 种方法）
- ✅ 代码示例完整

**主要问题：**

- ❌ **Flex 布局错误**：`align-content` 应该是 `align-items`
- ⚠️ 格式混乱，方法二包含了 3 种方法
- ⚠️ CSS 注释应该用 `/* */` 不是 `//`
- ⚠️ 缺少使用场景说明

---

**💡 优秀回答参考（面试版）：**

### 1. Flex（最常用）⭐

```css
.parent {
  display: flex;
  justify-content: center; /* 水平 */
  align-items: center; /* 垂直 */
}
```

### 2. Grid（最简洁）

```css
.parent {
  display: grid;
  place-items: center;
}
```

### 3. 定位 + transform

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 4. 定位 + margin auto

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100px;
  height: 100px; /* 需固定宽高 */
}
```

### 5. 文本居中

```css
.parent {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
```

**使用建议**：现代项目首选 Flex/Grid，兼容老浏览器用定位

---

<br><br><br>

### 2.3 请解释 Flexbox 和 Grid 布局的区别，以及各自的适用场景

**回答：**
答：Flexbox 和 Grid 布局的主要区别在于：
Flexbox 是一维布局，只能单独处理行或者列的布局，
Grid 布局是二维布局，可以同时处理行和列，
Flexbox 布局适合复杂单行布局，动态拉伸，快速对齐，适合移动端适配、按钮组、导航栏等组件使用。
Grid 布局适合需要精确控制行列关系，复杂响应式框架，适合处理桌面端整体布局、复杂数据看板。

---

**📌 面试官点评：5/5 分** 🎉🎉🎉

**优点：**

- ✅ 核心区别准确（一维 vs 二维）
- ✅ 适用场景清晰明确
- ✅ 特性描述到位
- ✅ 实际应用导向强
- ✅ 表述简洁有力

**满分！这是一个优秀的回答！**

---

**💡 优秀回答参考（精简版）：**

**核心区别：Flexbox 一维 vs Grid 二维**

```css
/* Flexbox - 一维 */
.flex {
  display: flex;
}

/* Grid - 二维 */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100px auto;
}
```

**使用场景：**

| 场景               | 选择    |
| ------------------ | ------- |
| 导航栏、按钮组     | Flexbox |
| 卡片列表（自适应） | Flexbox |
| 整体页面布局       | Grid    |
| 数据看板、表单     | Grid    |

**实战：**

```css
/* 导航栏 - Flex */
.navbar {
  display: flex;
  justify-content: space-between;
}

/* 页面布局 - Grid */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
```

**可以结合使用：** 外层 Grid，内层 Flex

---

<br><br><br><br><br><br>

### 2.4 什么是 CSS 预处理器？你使用过哪些？请说明它们的优势

**回答：**

<br><br><br><br><br><br>

---

## 三、TypeScript（15 分）

### 3.1 请解释 TypeScript 中的基本类型，并说明 `any`、`unknown`、`never` 的区别

**回答：**

<br><br><br><br><br><br>

### 3.2 什么是泛型（Generics）？请写一个实际应用的例子

**回答：**

<br><br><br><br><br><br>

### 3.3 请解释以下工具类型的作用：`Partial`、`Required`、`Pick`、`Omit`、`Record`

**回答：**

<br><br><br><br><br><br><br><br>

### 3.4 如何定义一个函数的重载（Overload）？请举例说明

**回答：**

答：TypeScript 函数重载允许一个函数根据不同的参数类型返回不同的类型。实现方式是先定义多个重载签名，然后提供一个兼容所有重载的实现签名。

```typescript
// 重载签名
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number[], b: number[]): number[];

// 实现签名（需要兼容所有重载）
function add(a: any, b: any): any {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }
}

// 使用
const result1 = add(1, 2); // number
const result2 = add("a", "b"); // string
const result3 = add([1], [2]); // number[]
```

实际应用场景：API 请求函数根据参数返回不同类型

```typescript
// 重载签名
function fetch(url: string): Promise<string>;
function fetch(url: string, options: { json: true }): Promise<object>;
function fetch(url: string, options: { blob: true }): Promise<Blob>;

// 实现签名
function fetch(url: string, options?: any): Promise<any> {
  return window.fetch(url).then((res) => {
    if (options?.json) return res.json();
    if (options?.blob) return res.blob();
    return res.text();
  });
}

// 使用时自动推断返回类型
const text = await fetch("/api/text"); // Promise<string>
const data = await fetch("/api/data", { json: true }); // Promise<object>
const file = await fetch("/api/file", { blob: true }); // Promise<Blob>
```

---

**📌 面试官点评：**

**优点：**

- ✅ 理解重载概念和实现方式
- ✅ 提供了实际应用场景

**最佳实践：**

- 重载签名按从最具体到最宽泛的顺序排列
- 实现签名要兼容所有重载签名
- 避免过度使用重载，简单场景用联合类型即可

---

<br><br><br><br><br><br>

---

## 四、React 框架（20 分）

### 4.1 请解释 React 的生命周期，以及 Hooks 中如何模拟生命周期

**回答：**
答：主要可以分为三个阶段，
1：挂载阶段：三个核心方法
1.1：constructor-绑定 State 以及实现继承，hooks 中通过 useState 模拟
1.2：render() 返回 JSX 挂载 DOM
1.3：componentDidMount- DOM 挂载后执行，常用于执行请求，操纵 DOM，hooks 通过 useEffect(()=>{},[]) 模拟，箭头函数中的内容会在挂载后执行(如果没有设置额外依赖)。
2：更新阶段：三个核心方法
2.1：componentShouldUpdate- 性能优化，决定是否触发刷新
2.2: render() 触发刷新
2.3: componentDidUpdate- 更新完成后执行，可以操纵DOM 可以通过
3：卸载阶段
<br><br><br><br><br><br>

### 4.2 说明 `useState` 和 `useReducer` 的区别，以及各自的使用场景

**回答：**

<br><br><br><br><br><br>

### 4.3 什么是虚拟 DOM 和 Diff 算法？React 如何进行性能优化？

**回答：**

<br><br><br><br><br><br>

### 4.4 请解释 React 中的状态管理方案，你使用过哪些？（如 Redux、Zustand、Jotai 等）

**回答：**

<br><br><br><br><br><br>

### 4.5 如何避免组件不必要的重渲染？请说明 `memo`、`useMemo`、`useCallback` 的使用场景

**回答：**

<br><br><br><br><br><br>

---

## 五、前端工程化（15 分）

### 5.1 请说明 Webpack 和 Vite 的区别，以及 Vite 为什么更快？

**回答：**

<br><br><br><br><br><br>

### 5.2 什么是代码分割（Code Splitting）和懒加载？如何在项目中实现？

**回答：**

<br><br><br><br><br><br>

### 5.3 请解释模块化规范：CommonJS、AMD、ES Module 的区别

**回答：**

<br><br><br><br><br><br>

### 5.4 如何优化前端项目的构建速度和打包体积？

**回答：**

<br><br><br><br><br><br><br><br>

---

## 六、网络与浏览器（10 分）

### 6.1 请解释常见的跨域问题及解决方案（至少 3 种）

**回答：**

答：跨域是浏览器同源策略限制，协议、域名、端口任一不同就会跨域。

**5 种解决方案：**

**1. CORS（后端配置）** - 最推荐
```javascript
// 后端设置响应头
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

**2. 开发环境代理（Vite/Webpack）**
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://backend.com'  // /api/user → http://backend.com/api/user
    }
  }
}
```

**3. JSONP（仅支持 GET）**
```javascript
// 利用 script 标签不受跨域限制
function jsonp(url, callback) {
  const script = document.createElement('script');
  script.src = `${url}?callback=${callback}`;
  document.body.appendChild(script);
}
```

**4. Nginx 反向代理（生产环境）**
```nginx
location /api {
  proxy_pass http://backend.com;
}
```

**5. postMessage（iframe 通信）**
```javascript
// 父页面
iframe.contentWindow.postMessage('data', 'http://other.com');
// 子页面
window.addEventListener('message', (e) => {
  if (e.origin === 'http://parent.com') console.log(e.data);
});
```

**实际开发选择：**
- 开发环境：Vite/Webpack 代理
- 生产环境：CORS + Nginx
- 第三方 API：JSONP（老旧）或 CORS

---

### 6.2 说明 HTTP 和 HTTPS 的区别，以及 HTTPS 的工作原理

**回答：**

答：HTTP 和 HTTPS 的主要区别在于安全性，HTTPS 在 HTTP 基础上加了 SSL/TLS 加密层。

### 核心区别：

| 对比项 | HTTP | HTTPS |
|--------|------|-------|
| 安全性 | 明文传输，不安全 | 加密传输，安全 |
| 端口 | 80 | 443 |
| 证书 | 不需要 | 需要 CA 证书 |
| 速度 | 快（无加密开销） | 稍慢（加密解密） |
| SEO | 排名较低 | Google 优先 |

### HTTPS 工作原理（握手过程）：

**1. 客户端发起请求**
```
浏览器 → 服务器：你好，我支持的加密算法有：RSA、AES...
```

**2. 服务器返回证书**
```
服务器 → 浏览器：这是我的数字证书（包含公钥）
```

**3. 浏览器验证证书**
```
浏览器验证：
  ✅ 证书是否由可信 CA 签发
  ✅ 证书是否过期
  ✅ 域名是否匹配
```

**4. 生成会话密钥**
```
浏览器：生成随机密钥（对称密钥）
浏览器：用服务器的公钥加密这个密钥
浏览器 → 服务器：这是加密后的密钥
```

**5. 服务器解密密钥**
```
服务器：用私钥解密，得到会话密钥
现在双方都有相同的会话密钥了！
```

**6. 开始加密通信**
```
之后的所有数据都用会话密钥（对称加密）加密
浏览器 ⇄ 服务器：加密数据传输
```

### 加密方式：

**对称加密**：加密和解密用同一个密钥（AES）
- 优点：速度快
- 缺点：密钥传输不安全

**非对称加密**：公钥加密，私钥解密（RSA）
- 优点：安全
- 缺点：速度慢

**HTTPS 结合两者**：
- 握手阶段用非对称加密（传输对称密钥）
- 数据传输用对称加密（速度快）

### 为什么需要 HTTPS？

```javascript
// HTTP 明文传输（危险！）
POST /login HTTP/1.1
username=admin&password=123456  // ← 黑客可以看到！

// HTTPS 加密传输（安全）
POST /login HTTP/1.1
加密数据: a8f3b2c9d1e4...  // ← 黑客看不懂
```

**防止的攻击：**
1. 中间人攻击（窃听）
2. 数据篡改
3. 身份伪造

---

### 6.3 请解释浏览器的缓存机制（强缓存、协商缓存）

**回答：**

答：浏览器缓存分为**强缓存**和**协商缓存**，目的是减少请求，提升性能。

### 执行流程：

```
请求资源 → 检查强缓存 → 命中？
                ↓ 是          ↓ 否
            直接使用      检查协商缓存 → 304 或 200
```

---

### 1. 强缓存（不发请求）

**响应头：**
```http
# 方式1：过期时间（HTTP/1.0）
Expires: Wed, 21 Oct 2025 07:28:00 GMT

# 方式2：相对时间（HTTP/1.1，优先级更高）
Cache-Control: max-age=3600  // 3600秒内直接用缓存
```

**Cache-Control 常见值：**
```
max-age=3600        // 缓存 1 小时
no-cache            // 跳过强缓存，走协商缓存
no-store            // 不缓存
public              // 可被任何缓存（CDN、代理）
private             // 只能浏览器缓存
```

**命中强缓存：**
```
浏览器：这个文件还没过期，直接用！
状态码：200 (from disk cache) 或 (from memory cache)
效果：不发请求，速度最快
```

---

### 2. 协商缓存（发请求，但可能不下载）

**两种方式：**

#### 方式1：Last-Modified / If-Modified-Since

```http
# 第一次请求
响应头：Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 第二次请求（强缓存失效后）
请求头：If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT

# 服务器判断
文件没改 → 304 Not Modified（不返回内容）
文件改了 → 200 OK（返回新内容）
```

#### 方式2：ETag / If-None-Match（更精确）

```http
# 第一次请求
响应头：ETag: "abc123xyz"  // 文件唯一标识（哈希值）

# 第二次请求
请求头：If-None-Match: "abc123xyz"

# 服务器判断
ETag 相同 → 304（不返回内容）
ETag 不同 → 200（返回新内容）
```

**ETag 优先级 > Last-Modified**（更准确）

---

### 对比：

| 类型 | 是否发请求 | 状态码 | 速度 |
|------|-----------|--------|------|
| 强缓存 | ❌ 否 | 200 (from cache) | 最快 |
| 协商缓存 | ✅ 是 | 304 或 200 | 较快 |

---

### 实战配置：

**Nginx 配置：**
```nginx
location ~* \.(jpg|png|css|js)$ {
  expires 7d;  # 强缓存 7 天
  add_header Cache-Control "public, max-age=604800";
}
```

**前端控制：**
```javascript
// 强制不缓存
fetch('/api/data', {
  cache: 'no-cache'
})

// 文件名加哈希（推荐）
main.abc123.js  // 文件内容变化 → 哈希变化 → 新文件
```

---

### 最佳实践：

```
HTML 文件：no-cache（协商缓存）
CSS/JS 文件：max-age=31536000 + 文件名哈希（强缓存）
图片：max-age=604800（强缓存 7 天）
API 接口：no-store（不缓存）
```

---

### 6.4 常见的浏览器兼容性问题有哪些？你是如何处理的？

**回答：**

答：处理兼容性的核心思路是：**优先使用广泛支持的特性，针对不支持的浏览器做特化处理或降级方案**。

### 处理策略：

**1. 查询兼容性（使用前必做）**
- 使用 [Can I Use](https://caniuse.com) 查询特性支持度
- 查看目标浏览器占比（如 Chrome 95+, IE11）

**2. 优先使用广泛支持的 API**
```javascript
// ✅ 广泛支持
Array.prototype.map()        // 所有现代浏览器
JSON.parse()                 // IE8+
addEventListener()           // IE9+

// ⚠️ 部分支持
Array.prototype.flat()       // IE 不支持
Promise.allSettled()         // Chrome 76+
Optional Chaining (?.)       // Chrome 80+
```

**3. 针对不支持的浏览器做兼容**

---

### 常见兼容性问题及解决方案：

#### 1. ES6+ 语法（最常见）

**问题：** IE11 不支持 ES6
```javascript
// ❌ IE11 不支持
const arr = [1, 2, 3];
const [a, b] = arr;  // 解构
const fn = () => {}; // 箭头函数
```

**解决：** Babel 转译
```javascript
// babel.config.js
{
  presets: [
    ['@babel/preset-env', {
      targets: { ie: '11' }  // 指定目标浏览器
    }]
  ]
}
```

---

#### 2. 新 API 不支持

**问题：** Promise、fetch 等
```javascript
// IE11 不支持
fetch('/api/data')
Promise.all([])
Array.prototype.includes()
```

**解决：** Polyfill（垫片）
```javascript
// vite.config.js / main.ts
import 'core-js/stable';  // 自动引入所需 polyfill
import 'regenerator-runtime/runtime';

// 或按需引入
import 'core-js/es/promise';
import 'core-js/es/array/includes';
```

---

#### 3. CSS 兼容性

**问题：** Flexbox、Grid 在旧浏览器支持不完整
```css
/* 现代浏览器 */
.container {
  display: flex;
  gap: 10px;  /* IE 不支持 gap */
}
```

**解决：** PostCSS + Autoprefixer
```css
/* 自动添加前缀 */
.container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* gap 降级为 margin */
}
```

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead']
    }
  }
}
```

---

#### 4. 事件监听

**问题：** IE8 不支持 addEventListener
```javascript
// ❌ IE8 不支持
element.addEventListener('click', handler);
```

**解决：** 兼容写法
```javascript
function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);  // IE8
  } else {
    element['on' + type] = handler;
  }
}
```

---

#### 5. 样式前缀

**问题：** 某些 CSS 属性需要浏览器前缀
```css
/* 手动添加前缀（麻烦） */
.element {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
```

**解决：** 自动化工具（PostCSS）
```css
/* 只写标准语法 */
.element {
  transform: rotate(45deg);
}
/* PostCSS 自动添加前缀 */
```

---

### 实战方案：

**现代项目（不支持 IE）：**
```javascript
// vite.config.js
export default {
  build: {
    target: 'es2015',  // 支持 Chrome 51+
  }
}
```

**需要支持 IE11：**
```javascript
// vite.config.js
import legacy from '@vitejs/plugin-legacy';

export default {
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ]
}
```

---

### 特性检测（推荐方式）

**不要用浏览器检测，用特性检测：**

```javascript
// ❌ 不推荐：浏览器检测
if (navigator.userAgent.indexOf('MSIE') !== -1) {
  // IE 特殊处理
}

// ✅ 推荐：特性检测
if ('fetch' in window) {
  // 支持 fetch
  fetch('/api/data');
} else {
  // 降级使用 XMLHttpRequest
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/data');
  xhr.send();
}

// 或使用库
if (typeof Promise === 'undefined') {
  require('promise-polyfill/src/polyfill');
}
```

---

### 检测工具推荐：

```javascript
// Modernizr - 特性检测库
if (Modernizr.flexbox) {
  // 支持 Flexbox
} else {
  // 使用 float 布局
}

// Can I Use - 在线查询
// https://caniuse.com/?search=fetch

// BrowserStack - 真机测试
// 在不同浏览器上测试网站
```

---

### 最佳实践总结：

1. **开发前**：确定目标浏览器版本
2. **开发中**：优先使用广泛支持的特性
3. **使用新特性**：查 Can I Use → 添加 Polyfill
4. **自动化**：Babel + PostCSS 自动处理
5. **测试**：在目标浏览器上测试

**渐进增强策略：**
```
基础功能（所有浏览器支持）
  ↓
增强功能（现代浏览器支持）
  ↓
降级方案（旧浏览器能用，体验稍差）
```

---

---

## 七、数据交互与 API（10 分）

### 7.1 请说明 `fetch` 和 `axios` 的区别，以及如何实现请求拦截器

**回答：**

答：fetch 是浏览器原生 API，axios 是第三方库。主要区别在于易用性、兼容性和功能完整度。

### 核心区别对比：

| 特性 | fetch | axios |
|------|-------|-------|
| 类型 | 原生 API | 第三方库 |
| 兼容性 | 现代浏览器 | 支持老浏览器 |
| 请求取消 | AbortController | CancelToken |
| 超时设置 | 需手动实现 | 内置 timeout |
| 拦截器 | 需手动封装 | 内置 interceptors |
| 错误处理 | 只在网络错误时 reject | HTTP 错误也 reject |
| 自动转换 JSON | 需手动 `.json()` | 自动转换 |
| 进度监听 | 不支持 | 支持 onUploadProgress |

---

### 详细区别：

#### 1. 错误处理（最大区别）

**fetch：** 只有网络错误才 reject
```javascript
// ❌ 404、500 不会进入 catch
fetch('/api/user')
  .then(res => {
    if (!res.ok) {  // 需要手动检查
      throw new Error('HTTP error');
    }
    return res.json();
  })
  .catch(err => console.error(err));  // 只捕获网络错误
```

**axios：** HTTP 错误也会 reject
```javascript
// ✅ 404、500 自动进入 catch
axios.get('/api/user')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));  // 捕获所有错误
```

---

#### 2. 数据处理

**fetch：** 需要手动转换
```javascript
fetch('/api/user')
  .then(res => res.json())  // 手动转 JSON
  .then(data => console.log(data));
```

**axios：** 自动转换
```javascript
axios.get('/api/user')
  .then(res => console.log(res.data));  // 自动转换
```

---

#### 3. 超时设置

**fetch：** 需手动实现
```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

fetch('/api/user', { signal: controller.signal })
  .then(res => res.json())
  .finally(() => clearTimeout(timeout));
```

**axios：** 内置配置
```javascript
axios.get('/api/user', {
  timeout: 5000  // 5秒超时
});
```

---

### 请求拦截器实现：

#### axios 拦截器（内置）

```javascript
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 添加时间戳
    config.params = { ...config.params, _t: Date.now() };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 统一处理响应数据
    return response.data;
  },
  error => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

#### fetch 拦截器（手动封装）

```javascript
// 封装 fetch
const originalFetch = window.fetch;

window.fetch = function(url, options = {}) {
  // 请求拦截
  const token = localStorage.getItem('token');
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // 发送请求
  return originalFetch(url, options)
    .then(async response => {
      // 响应拦截
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });
};

// 使用
fetch('/api/user').then(data => console.log(data));
```

---

#### 更好的 fetch 封装（推荐）

```typescript
// request.ts
interface RequestConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, any>;
}

class Request {
  private baseURL = '';
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: any) => any> = [];

  // 添加请求拦截器
  useRequestInterceptor(fn: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(fn);
  }

  // 添加响应拦截器
  useResponseInterceptor(fn: (response: any) => any) {
    this.responseInterceptors.push(fn);
  }

  async request(url: string, config: RequestConfig = {}) {
    // 执行请求拦截器
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }

    // 处理 URL 参数
    if (finalConfig.params) {
      const params = new URLSearchParams(finalConfig.params);
      url += `?${params}`;
    }

    // 超时处理
    const controller = new AbortController();
    if (finalConfig.timeout) {
      setTimeout(() => controller.abort(), finalConfig.timeout);
    }

    try {
      // 发送请求
      const response = await fetch(this.baseURL + url, {
        ...finalConfig,
        signal: controller.signal,
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 解析响应
      let data = await response.json();

      // 执行响应拦截器
      for (const interceptor of this.responseInterceptors) {
        data = interceptor(data);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(url: string, config?: RequestConfig) {
    return this.request(url, { ...config, method: 'GET' });
  }

  post(url: string, data?: any, config?: RequestConfig) {
    return this.request(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }
}

// 创建实例
const request = new Request();

// 配置请求拦截器
request.useRequestInterceptor(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 配置响应拦截器
request.useResponseInterceptor(response => {
  if (response.code !== 200) {
    throw new Error(response.message);
  }
  return response.data;
});

export default request;

// 使用
request.get('/api/user').then(data => console.log(data));
```

---

### 实际项目选择：

**选择 fetch：**
- ✅ 不想引入额外依赖
- ✅ 只需要简单请求
- ✅ 项目体积要求严格

**选择 axios：**
- ✅ 需要完整功能（拦截器、取消、进度）
- ✅ 需要兼容老浏览器
- ✅ 团队熟悉 axios

**现代项目推荐：**
- 简单项目：fetch + 简单封装
- 复杂项目：axios 或 fetch + 完整封装

---

### 7.2 什么是 RESTful API？请说明常见的 HTTP 请求方法及其使用场景

**回答：**

<br><br><br><br><br><br>

### 7.3 如何处理前端的错误处理和异常捕获？

**回答：**

<br><br><br><br><br><br>

---

## 八、性能优化（10 分）

### 8.1 请列举前端性能优化的方法（至少 6 种）

**回答：**

<br><br><br><br><br><br><br><br>

### 8.2 什么是防抖（Debounce）和节流（Throttle）？请说明使用场景并实现其中一个

**回答：**

<br><br><br><br><br><br>

### 8.3 如何监控和分析前端性能？你使用过哪些工具？

**回答：**

答：前端性能监控分为**开发阶段**和**生产阶段**，使用不同的工具和指标。

### 核心性能指标：

**Web Vitals（Google 推荐）：**
```
LCP - Largest Contentful Paint（最大内容绘制）< 2.5s
FID - First Input Delay（首次输入延迟）< 100ms
CLS - Cumulative Layout Shift（累积布局偏移）< 0.1
FCP - First Contentful Paint（首次内容绘制）< 1.8s
TTFB - Time to First Byte（首字节时间）< 600ms
```

---

### 一、开发阶段工具

#### 1. Chrome DevTools（最常用）⭐

**Performance 面板：**
```
1. 打开 DevTools → Performance
2. 点击录制 → 操作页面 → 停止
3. 查看火焰图，找到性能瓶颈
```

**Lighthouse（性能评分）：**
```
1. DevTools → Lighthouse
2. 生成报告（0-100 分）
3. 查看优化建议
```

**Network 面板：**
```
- 查看资源加载时间
- 找出慢请求
- 分析资源大小
```

---

#### 2. Performance API（代码监控）

```javascript
// 获取页面加载性能
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DNS 查询:', perfData.domainLookupEnd - perfData.domainLookupStart);
console.log('TCP 连接:', perfData.connectEnd - perfData.connectStart);
console.log('请求响应:', perfData.responseEnd - perfData.requestStart);
console.log('DOM 解析:', perfData.domComplete - perfData.domInteractive);
console.log('页面加载:', perfData.loadEventEnd - perfData.fetchStart);

// 获取资源加载性能
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});

// 自定义性能标记
performance.mark('start-render');
// ... 渲染操作
performance.mark('end-render');
performance.measure('render-time', 'start-render', 'end-render');
const measure = performance.getEntriesByName('render-time')[0];
console.log('渲染耗时:', measure.duration);
```

---

#### 3. Web Vitals 库（推荐）

```javascript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

// 监控核心指标
onLCP(metric => console.log('LCP:', metric.value));
onFID(metric => console.log('FID:', metric.value));
onCLS(metric => console.log('CLS:', metric.value));
onFCP(metric => console.log('FCP:', metric.value));
onTTFB(metric => console.log('TTFB:', metric.value));

// 上报到服务器
function sendToAnalytics(metric) {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}

onLCP(sendToAnalytics);
```

---

### 二、生产阶段工具

#### 1. Sentry（错误 + 性能监控）⭐

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-dsn',
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,  // 10% 采样
});

// 自动监控：
// - 页面加载时间
// - API 请求时间
// - 用户交互性能
```

---

#### 2. 百度统计 / Google Analytics

```javascript
// 自定义事件上报
gtag('event', 'page_load', {
  'page_load_time': loadTime,
  'page_path': window.location.pathname
});

// 性能数据上报
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  gtag('event', 'timing_complete', {
    'name': 'load',
    'value': perfData.loadEventEnd - perfData.fetchStart
  });
});
```

---

#### 3. 自建监控系统

```javascript
// 性能监控 SDK
class PerformanceMonitor {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.init();
  }

  init() {
    // 监听页面加载
    window.addEventListener('load', () => {
      this.reportPageLoad();
    });

    // 监听资源加载
    this.observeResources();

    // 监听长任务
    this.observeLongTasks();

    // 监听错误
    this.observeErrors();
  }

  reportPageLoad() {
    const perfData = performance.getEntriesByType('navigation')[0];
    this.send({
      type: 'page_load',
      url: location.href,
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domReady: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
    });
  }

  observeResources() {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 1000) {  // 慢资源
          this.send({
            type: 'slow_resource',
            url: entry.name,
            duration: entry.duration,
          });
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  observeLongTasks() {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        this.send({
          type: 'long_task',
          duration: entry.duration,
          startTime: entry.startTime,
        });
      });
    });
    observer.observe({ entryTypes: ['longtask'] });
  }

  observeErrors() {
    window.addEventListener('error', event => {
      this.send({
        type: 'js_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
      });
    });
  }

  send(data) {
    // 使用 sendBeacon 确保数据发送
    navigator.sendBeacon(this.apiUrl, JSON.stringify({
      ...data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    }));
  }
}

// 使用
const monitor = new PerformanceMonitor('/api/performance');
```

---

### 三、常用分析工具

| 工具 | 用途 | 使用场景 |
|------|------|---------|
| Chrome DevTools | 本地调试 | 开发阶段 |
| Lighthouse | 性能评分 | 开发 + 上线前 |
| WebPageTest | 真实网络测试 | 上线前 |
| Sentry | 错误 + 性能监控 | 生产环境 |
| Google Analytics | 用户行为分析 | 生产环境 |
| webpack-bundle-analyzer | 打包分析 | 构建优化 |

---

### 四、实战监控方案

```javascript
// main.ts
import { onLCP, onFID, onCLS } from 'web-vitals';
import * as Sentry from '@sentry/react';

// 1. 初始化 Sentry
Sentry.init({ dsn: 'xxx' });

// 2. 监控 Web Vitals
function sendToAnalytics(metric) {
  // 上报到后端
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      page: location.pathname,
    }),
  });

  // 同时上报到 Sentry
  Sentry.captureMessage(`${metric.name}: ${metric.value}`, 'info');
}

onLCP(sendToAnalytics);
onFID(sendToAnalytics);
onCLS(sendToAnalytics);

// 3. 监控 API 请求
axios.interceptors.response.use(
  response => {
    const duration = Date.now() - response.config.metadata.startTime;
    if (duration > 3000) {  // 慢请求
      sendToAnalytics({
        name: 'slow_api',
        value: duration,
        url: response.config.url,
      });
    }
    return response;
  }
);
```

---

### 五、性能优化流程

```
1. 监控指标收集
   ↓
2. 发现性能问题（LCP > 2.5s）
   ↓
3. 使用 DevTools 定位原因
   ↓
4. 优化（代码分割、图片压缩等）
   ↓
5. 验证效果（Lighthouse 评分）
   ↓
6. 持续监控
```

---

### 总结

**开发阶段：**
- Chrome DevTools（必用）
- Lighthouse（评分）
- webpack-bundle-analyzer（打包分析）

**生产阶段：**
- Sentry（错误 + 性能）
- Web Vitals 库（核心指标）
- 自建监控系统（定制化）

**关键指标：**
- LCP、FID、CLS（Google 核心指标）
- 页面加载时间
- API 响应时间
- 资源加载时间

---

---

## 九、编码实践题（20 分）

### 9.1 实现一个深拷贝函数，考虑循环引用的情况

```javascript
function deepClone(obj) {
  // 请在此处实现
}
```

### 9.2 实现一个 Promise.all 方法

```javascript
function promiseAll(promises) {
  // 请在此处实现
  if (typeof promises[symbol.iterable] !== "function" || promises === null) {
    throw new Promise.reject(new TypeError("not iterable"));
  }
  return new Promise((resolve, reject) => {
    const promiseArray = Array.from(promises);
    const length = promiseArray.length;
    if (length === 0) resolve([]);
    const result = new Array(length);
    let completeCount = 0;
    promiseArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((item) => {
          result[index] = item;
          comleteCount++;
          if (comleteCount === length) resolve(result);
        })
        .catch(reject);
    });
  });
}
```

### 9.3 实现一个自定义 Hook：useDebounce

```typescript
function useDebounce<T>(value: T, delay: number): T {
  // 请在此处实现
}
```

### 9.4 手写一个 React 组件：实现一个可控的输入框组件，支持防抖搜索

```typescript
// 请在此处实现
```

---

## 十、综合能力与软技能（15 分）

### 10.1 描述一个你最近完成的技术挑战项目，遇到了什么困难，如何解决的？

**回答：**

<br><br><br><br><br><br><br><br>

### 10.2 你是如何保持技术学习和更新的？最近在学习什么新技术？

**回答：**

<br><br><br><br><br><br>

### 10.3 在团队协作中，如果你与后端工程师对接口设计有不同意见，你会如何处理？

**回答：**

<br><br><br><br><br><br>

### 10.4 你对前端未来的发展趋势有什么看法？你最感兴趣的方向是什么？

**回答：**

<br><br><br><br><br><br>

### 10.5 假设你加入团队后，发现现有项目的代码质量不佳，你会如何推动改进？

**回答：**

<br><br><br><br><br><br>

---

## 附加题（加分项）

### A1. 你有没有参与过开源项目？或者有没有自己的技术博客/作品集？请分享链接

**回答：**

<br><br><br><br>

### A2. 对于前端架构设计，你有什么经验和想法？

**回答：**

<br><br><br><br><br><br>

### A3. 你对我们公司或产品有什么了解？有什么想法或建议？

**回答：**

<br><br><br><br><br><br>

---

## 面试评分表

| 评分项          | 分数     | 评语 |
| --------------- | -------- | ---- |
| JavaScript 基础 | /20      |      |
| CSS3 相关       | /15      |      |
| TypeScript      | /15      |      |
| React 框架      | /20      |      |
| 前端工程化      | /15      |      |
| 网络与浏览器    | /10      |      |
| 数据交互与 API  | /10      |      |
| 性能优化        | /10      |      |
| 编码实践        | /20      |      |
| 综合能力        | /15      |      |
| **总分**        | **/150** |      |

### 综合评价

<br><br><br><br><br><br>

### 是否推荐录用

□ 强烈推荐 □ 推荐 □ 待定 □ 不推荐

---

**面试官签名：**\*\*\***\*\_\_**\*\*\*\*** 日期：**\*\*\*\***\_\_\*\***\*\*\*\*\*\*
