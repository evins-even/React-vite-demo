# React + TypeScript + JavaScript 面试题（1 小时）

> **说明**：本套题目设计时长约 60 分钟，包含基础题、进阶题和实战题，旨在全面考察候选人的理论知识和实际项目经验。

---

## 📋 题目结构

- **第一部分：JavaScript 基础**（15 分钟，5 题）
- **第二部分：TypeScript 核心**（15 分钟，5 题）
- **第三部分：React 基础与进阶**（20 分钟，6 题）
- **第四部分：项目实战**（10 分钟，2 题）

---

## 第一部分：JavaScript 基础（15 分钟）

### 1. 闭包与作用域（3 分钟）

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

// 问题：
// 1. 上面代码会输出什么？为什么？
// 2. 如何修改代码让它输出 0, 1, 2？（至少给出2种方案）
// 3. 在实际项目中，你遇到过类似的闭包问题吗？怎么解决的？
```

答：上面的代码会输出 3 个 3， 原因是 var 创建的变量为全局变量，for 会创建 3 个计时器任务，任务输出时，i 已经变为 3，所以会这么输出.
解决方案：

```javascript
//1:通过闭包+IIFE（立即执行函数）的方式，闭包会记住创建时的上下文，也就是词法作用域。
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j);
    }, 1000);
  })(i);
}
//2:通过let，let是es6新增的变量创建方式，可以创建具备变量，同时形成局部作用域
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

实际项目中，我没有遇到过和这个题目类似的问题，但是遇到过更复杂的，
例如，我需要提交一个表单数据，我一开始使用了普通函数，执行时获取外部状态并提交，

```javascript
const [state, setState] = useState();
async function post() {
  try {
    await postState(state);
  } catch (error) {
    console.log(error);
  }
}
```

提交时，由于使用的是普通函数，函数记住了创建时的状态，也就是 state 的初始值，导致提交数据过时，
修改也很简答，将普通函数转换成箭头函数，或在提交时传入参数并使用传入参数。

**评分：70/100** ⭐⭐⭐

**评价：**

- ✅ 结合了实际项目经验
- ✅ 传参方案是正确的
- ⚠️ 理论部分有误：在函数组件中，普通函数和箭头函数的闭包行为完全相同，箭头函数不能解决闭包陷阱问题
- ⚠️ 如果是 Class 组件的 `this` 绑定问题，那么解释是对的；但代码示例用的是 Hooks（函数组件），这种情况下箭头函数无效
- 💡 建议：明确说明是 Class 组件的 `this` 问题，或者改用 `useCallback` + 依赖数组的例子

---

### 2. Promise 与异步处理（3 分钟）

```javascript
async function fetchData() {
  try {
    const res1 = await fetch("/api/user");
    const res2 = await fetch("/api/orders");
    return { user: res1, orders: res2 };
  } catch (error) {
    console.error(error);
  }
}

// 问题：
// 1. 上面代码有什么性能问题？如何优化？
// 2. 如果 res1 失败了，res2 还会执行吗？
// 3. 在你的项目中，如何处理多个并发请求？
```

答：这个例子中，请求是分布执行的，也就是说，在第一个请求执行完毕前，不会执行第二个请求，这带来了数据获取慢的问题，可以使用 Promise.all/Promise.allsettled 优化，使用哪个取决于你是否需要所有接口的返回结果和报错信息。
如果 res1 失败了，res2 依然会执行，但是返回的数据不会被处理
我的项目中，如果需要整体展示，会使用 Promise.all 处理并发请求，如果可以分步渲染，则使用 Promise.allsettled，并记录错误接口，提供重请求按钮或间隔时间后重新请求报错接口。

**评分：85/100** ⭐⭐⭐⭐

**评价：**

- ✅ 问题 1：性能问题识别准确，解决方案正确（`Promise.all` / `Promise.allSettled`）
- ✅ 问题 2：理解基本正确，但表述不够准确（res2 不会执行，因为 res1 失败会直接进入 catch）
- ✅ 问题 3：项目经验真实，展示了实际的错误处理策略
- ⚠️ 小问题："分布执行"应为"串行执行"或"顺序执行"
- 💡 建议：问题 2 的答案有误，`await` 遇到错误会直接跳到 catch，res2 不会执行

---

### 3. 数组方法与性能（3 分钟）

```javascript
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

// 问题：
// 1. 如何找出年龄大于 25 的用户？（用 filter）
const ageFilter = () => {
  //filter不会修改原数组，所以直接调用原数组方法
  return users.filter((item) => item.age > 25);
};

// 2. 如何把所有用户的年龄加 1？（用 map）
const addAge = () => {
  //map 会返回一个新的数组
  const newUsers = users.map(item => ({
    ...item,
    age: item.age + 1
  }));
  return newUsers;
}

// 3. 如何计算所有用户的平均年龄？（用 reduce）
const getAverageAge = () => {
  const sum = users.reduce((total, user) => total + user.age, 0);
  return sum / users.length;
}

// 4. 如果数组有 10000 条数据，你会如何优化？
/* 答：如果是渲染场景，我会使用虚拟列表进行渲染，每次只渲染可见区域的元素，而不是直接渲染全部，
也可以使用分页的方式，通过提供翻页功能，让用户决定是否加载更多，这样一次只渲染一页的数据，
如果是对数据的处理，我会使用useMemo缓存运算结果，防止每次渲染都要重新运算
在我实际运用中，更多的是数据的预处理，也就是通过请求获取更多数据，同时，我会使用虚拟列表结合触底加载进行优化，防止渲染卡顿。 */

**评分：90/100** ⭐⭐⭐⭐⭐

**严格评价：**
- ✅ 问题1（25/25分）：完全正确！`item.age > 25` 准确符合题意
- ✅ 问题2（25/25分）：完全正确！箭头函数返回对象的语法正确，使用了 `({...item, age: item.age + 1})`
- ✅ 问题3（25/25分）：完全正确！reduce 用法标准，`(total, user) => total + user.age, 0` 有初始值，逻辑清晰
- ✅ 问题4（15/25分）：回答很好，覆盖了渲染场景和数据处理场景，结合了实际项目经验。扣10分原因：
  - 表述可以更结构化（分点1、2、3）
  - 可以补充 Web Worker、防抖节流等更多优化方案

**优点：**
- ✅ **代码质量高**：所有代码都能正常运行，语法正确
- ✅ **基础扎实**：数组方法使用规范，reduce 的初始值、参数命名都很专业
- ✅ **实战经验**：问题4结合了项目经验（虚拟列表 + 触底加载）
- ✅ **思维清晰**：知道区分渲染场景和数据处理场景

**面试官视角：**
这是一个合格的中级开发者的回答：
1. 基础扎实（数组方法熟练）
2. 代码规范（能写出可运行的代码）
3. 有实战经验（提到了项目中的实际应用）

**小建议：**
- 💡 问题4可以更系统化，比如："我会分三种场景考虑：1. 渲染优化... 2. 数据处理优化... 3. 数据加载优化..."
- 💡 可以补充量化数据，比如："在我的项目中用虚拟列表后，首屏渲染时间从2秒降到0.3秒"

```

---

### 4. this 指向（3 分钟）

```javascript
const obj = {
  name: "Alice",
  sayHi: function () {
    console.log(this.name);
  },
  sayHiArrow: () => {
    console.log(this.name);
  },
};

obj.sayHi(); // 输出什么？
obj.sayHiArrow(); // 输出什么？

const sayHi = obj.sayHi;
sayHi(); // 输出什么？

// 问题：
// 1. 解释上面三个输出结果
// 2. 在 React 组件中，你如何处理事件处理函数的 this 绑定？
```

答：

1. `obj.sayHi()` 输出 `Alice`，原因是通过 `obj.sayHi()` 调用时，`this` 隐式绑定到调用者 `obj`，所以能访问到 `obj.name`。

2. `obj.sayHiArrow()` 输出 `undefined`，原因是箭头函数没有自己的 `this`，它的 `this` 继承自定义时的外层作用域（全局/模块作用域），而不是 `obj`。全局作用域中没有 `name` 属性，所以输出 `undefined`。

3. `sayHi()` 输出 `undefined`（严格模式）。原因是函数被赋值给变量后，失去了调用时的上下文绑定，`this` 指向 `undefined`（严格模式）或全局对象（非严格模式），都没有 `name` 属性。
   在实际工作中，由于要使用 Class 组件作为根节点，同时为了将 Jsx 中定义的渲染弹窗等方法分发给 ts 组件使用，
   我使用 bind 显示的绑定了调用方法的 this，成功将 jsx 的能力提供给数据处理类，并避免了 this 绑定问题。

在 React 组件中处理 `this` 绑定：

- **Class 组件**：需要处理 `this`，通常使用箭头函数定义方法（`handleClick = () => {...}`），或在 constructor 中 bind
- **Hooks 组件（函数组件）**：完全不需要处理 `this`，因为函数组件没有 `this` 的概念，通过闭包访问 state 和 props

**评分：88/100** ⭐⭐⭐⭐⭐

**评价：**

- ✅ 问题 1（20/25 分）：结论正确，理解基本准确。小瑕疵："显示绑定"应为"隐式绑定"
- ✅ 问题 2（25/25 分）：完全正确！准确理解了箭头函数的 `this` 继承自外层作用域
- ✅ 问题 3（25/25 分）：完全正确！理解了 `this` 丢失，并补充了实际项目经验
- ✅ 问题 4（18/25 分）：回答了 Class 组件和 Hooks 组件的区别，并结合了实际项目经验。扣 7 分原因：
  - 可以更系统地列举几种绑定方式
  - 项目经验描述可以更具体（比如具体是什么场景）

**优点：**

- ✅ 核心概念正确：理解了箭头函数的 `this` 继承机制
- ✅ 区分了 Class 组件和 Hooks 组件
- ✅ 知道 Hooks 组件不需要处理 `this`
- 🎉 **结合了实际项目经验**：提到了用 `bind` 显式绑定 `this` 来解决跨组件方法调用问题
- 🎉 **展示了实战能力**：JSX 组件和 TS 数据处理类的协作场景很真实

**项目经验加分点：**
你提到的场景"将 JSX 的渲染能力（如弹窗）提供给 TS 数据处理类使用"是一个很好的实战案例，展示了：

1. 对 `this` 绑定的深入理解
2. 跨模块/跨类协作的经验
3. 实际解决问题的能力

**小建议：**

- 💡 可以稍微具体一点，比如："在项目中，我有一个 DataProcessor 类负责数据处理，需要调用 React 组件的 showModal 方法。我使用 `this.showModal.bind(this)` 将方法传递给 DataProcessor，确保方法执行时 `this` 指向 React 组件实例。"

---

### 5. 深拷贝与浅拷贝（3 分钟）

```javascript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { ...obj1 };
obj2.b.c = 3;

console.log(obj1.b.c); // 输出什么？

// 问题：
// 1. 为什么会这样？
// 2. 如何实现深拷贝？（至少给出2种方案）
// 3. 在 React 中修改 state 时，为什么要避免直接修改原对象？
```

**答：**

1. 输出 `3`。原因：展开运算符对于复杂数据类型是浅拷贝，只复制第一层，嵌套对象 `b` 仍然是引用传递。

2. 深拷贝的实现方案：

```javascript
// 方案1：使用 lodash（实际开发推荐）
import _ from "lodash";
const clone = _.cloneDeep(obj);

// 方案2：手动实现深拷贝
function deepClone(obj, cache = new WeakMap()) {
  if (obj == null) {
    // 同时处理null和undefined
    return null;
  }
  if (typeof obj !== "object" && typeof obj !== "function") {
    // 基本数据类型
    return obj;
  }
  // 处理循环引用
  if (cache.has(obj)) return cache.get(obj);

  // 类型查找
  const typeofObj = Object.prototype.toString.call(obj).slice(8, -1);

  // 处理特殊类型
  switch (typeofObj) {
    case "Map": {
      const map = new Map();
      cache.set(obj, map);
      obj.forEach((value, key) => {
        map.set(key, deepClone(value, cache));
      });
      return map;
    }
    case "Date":
      return new Date(obj.getTime());
    case "RegExp":
      return new RegExp(obj);
    case "Set": {
      const set = new Set();
      cache.set(obj, set);
      obj.forEach((item) => {
        set.add(deepClone(item, cache));
      });
      return set;
    }
  }

  // 处理普通对象
  const proto = Object.getPrototypeOf(obj);
  const newObj = Array.isArray(obj) ? [] : Object.create(proto);
  cache.set(obj, newObj);

  const keys = Reflect.ownKeys(obj);
  for (let key of keys) {
    newObj[key] = deepClone(obj[key], cache);
  }
  return newObj;
}
```

3. React 中，hooks 组件通过 `setState` 方法修改 state，class 组件通过 `setState` 方法修改 state。这是因为 React 需要通过 state 的变化触发组件刷新。直接修改原对象可能导致 React 无法监听到 state 改变，也就无法触发状态更新。

**评分：85/100** ⭐⭐⭐⭐

**评价：**

- ✅ 问题 1（25/25 分）：完全正确！准确理解了展开运算符是浅拷贝
- ✅ 问题 2（45/50 分）：**思路非常好！** 展示了对深拷贝的深入理解
  - ✅ 处理了循环引用（WeakMap 缓存）
  - ✅ 处理了特殊类型（Map、Set、Date、RegExp）
  - ✅ 保留了原型链（getPrototypeOf + Object.create）
  - ✅ 处理了 Symbol（Reflect.ownKeys）
  - ⚠️ 有些小的语法错误（大小写、缺少 return），但在有编译器的情况下很容易发现和修正
  - 💡 **核心思路完全正确，这才是最重要的！**
- ✅ 问题 3（15/25 分）：理解基本正确，但可以更深入。扣分原因：
  - 没有说明 React 使用**浅比较**来判断是否更新
  - 没有说明直接修改会导致引用不变，React 认为没有变化

**优点：**

- ✅ 理解了浅拷贝和深拷贝的区别
- 🎉 **深拷贝实现思路完整且专业**：考虑了循环引用、特殊类型、原型链、Symbol
- ✅ 知道实际开发中使用 lodash
- 🎉 **展示了高级开发者的思维**：不是简单的递归，而是考虑了各种边界情况

**面试官视角：**
在白板/纸上写代码时，面试官更看重：

1. ✅ **思路是否正确**（你完全正确）
2. ✅ **考虑是否全面**（你考虑了很多边界情况）
3. ✅ **是否有实战经验**（提到了 lodash）
4. ⚠️ 语法细节（有编译器会提示，不是重点）

**你的深拷贝实现已经超过了大部分中级开发者的水平！** 👍

**问题 3 的更好回答：**

React 使用**浅比较**（shallow comparison）来判断 state 是否变化。如果直接修改原对象，对象的引用不变，React 会认为 state 没有变化，不会触发重新渲染。所以我们需要创建新对象：

```javascript
// ❌ 错误：直接修改
state.user.name = "Alice";
setState(state); // 引用不变，不会更新

// ✅ 正确：创建新对象
setState({ ...state, user: { ...state.user, name: "Alice" } });
```

---

## 第二部分：TypeScript 核心（15 分钟）

### 6. 类型定义与推断（3 分钟）

```typescript
// 定义一个用户类型
interface User {
  id: number;
  name: string;
  email?: string;
  role: "admin" | "user" | "guest";
}

// 问题：
// 1. 如何定义一个"只读"的 User 类型？
// 2. 如何定义一个"部分可选"的 User 类型（用于更新用户信息）？
// 3. 如何定义一个"排除某些字段"的 User 类型（比如排除 id）？
// 4. 在你的项目中，如何组织和管理类型定义？
```

**答：**

**1. 只读 User 类型：**

```typescript
// 方案1：使用 Readonly 工具类型
type ReadonlyUser = Readonly<User>;

// 方案2：自定义工具类型
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
type ReadonlyUser2 = MyReadonly<User>;
```

**2. 部分可选的 User 类型：**

```typescript
// 方案1：全部可选（用于更新）
type UpdateUser = Partial<User>;

// 方案2：部分字段可选（自定义）
type PartialOnly<T, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
} & {
  [K in U]?: T[K];
};

// 使用：让 name 和 email 可选，其他必填
type UpdateUserPartial = PartialOnly<User, "name" | "email">;

// 方案3：使用 Omit + Partial + Pick 组合
type UpdateUser2 = Omit<User, "name" | "email"> &
  Partial<Pick<User, "name" | "email">>;

// 注意：交叉类型可能需要展开处理
type Flatten<T> = {
  [K in keyof T]: T[K];
};
type UpdateUserFlat = Flatten<UpdateUser2>;
```

**3. 排除某些字段的 User 类型：**

```typescript
// 方案1：使用 Omit 工具类型
type UserWithoutId = Omit<User, "id">;

// 方案2：自定义 Omit
type MyOmit<T, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};
type UserWithoutId2 = MyOmit<User, "id">;
```

**4. 项目中的类型管理：**

在实际项目中，我们会：

- 与后端协调，确定好接口字段的必填/可选属性
- 在 `src/types` 目录下按模块组织类型定义
- 使用工具类型转换来适配不同场景（如创建、更新、查询）
- 对于复杂的类型转换，会封装成通用的工具类型复用

**评分：92/100** ⭐⭐⭐⭐⭐

**评价：**

- ✅ 问题 1（25/25 分）：完全正确！既知道用 `Readonly`，也能自己实现
- ✅ 问题 2（22/25 分）：思路很好！展示了高级的类型编程能力
  - ✅ 理解了 `Partial`、`Omit`、`Pick` 的组合使用
  - ✅ 能自定义 `PartialOnly` 工具类型
  - ✅ 知道交叉类型可能需要 `Flatten` 处理
  - ⚠️ 小问题：题目问的是"部分可选"，`Partial<User>` 是全部可选，不太符合题意（扣 3 分）
- ✅ 问题 3（25/25 分）：完全正确！既知道用 `Omit`，也能自己实现
- ✅ 问题 4（20/25 分）：回答了实际经验，但可以更具体
  - ✅ 提到了与后端协调
  - ✅ 提到了使用工具类型转换
  - ⚠️ 可以补充：类型文件的组织结构、命名规范等

**优点：**

- 🎉 **TypeScript 功底扎实**：熟练使用映射类型、条件类型、模板字面量类型
- 🎉 **理解深入**：知道交叉类型的展开问题，这是高级知识点
- 🎉 **实战经验**：提到了与后端协调、工具类型复用
- ✅ 既知道内置工具类型，也能自己实现

**面试官视角：**
"这个候选人的 TypeScript 水平很高！

1. 熟练使用内置工具类型
2. 能自己实现工具类型（映射类型 + 条件类型）
3. 知道 Flatten 展开交叉类型（这是高级技巧）
4. 有实际项目经验

这已经是高级/资深开发者的水平了！"

**小建议：**

- 💡 问题 2：题目问"部分可选"，可以先说 `Partial<Pick<User, 'name' | 'email'>>` 这种更符合题意的方案
- 💡 问题 4：可以补充类型文件的组织结构，比如：
  ```
  src/types/
    ├── api/          # API 相关类型
    ├── models/       # 数据模型
    ├── utils/        # 工具类型
    └── index.ts      # 统一导出
  ```

**总结：这是一个优秀的回答，展示了扎实的 TypeScript 功底和实战经验！** 🎉👍

---

### 7. 泛型应用（3 分钟）

```typescript
// 实现一个通用的 API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 问题：
// 1. 如何使用这个类型定义用户列表的响应？
//答：传入不同的类型以定义泛型的值，例如
// 单个用户
type User = {
  id: number;
  name: string;
};
type userResponse = ApiResponse<User>;
// 用户列表
type usersResponse = ApiResponse<User[]>;
// 2. 如何定义一个通用的请求函数，返回类型是 ApiResponse<T>？
// 3. 在你的项目中，如何封装 API 请求？
```

---

### 8. 类型守卫（3 分钟）

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  // 问题：如何实现这个函数？
  // 要求：使用类型守卫，确保类型安全
}

// 在你的项目中，有没有用过类似的联合类型？
```

---

### 9. 工具类型（3 分钟）

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// 问题：
// 1. 如何定义一个"创建 Todo"的类型（排除 id 和 createdAt）？
// 2. 如何定义一个"更新 Todo"的类型（所有字段可选，但必须有 id）？
// 3. 常用的 TypeScript 工具类型有哪些？（至少说出5个）
```

---

### 10. React 组件类型（3 分钟）

```typescript
// 问题：
// 1. 如何定义一个函数组件的 Props 类型？
// 2. 如何定义一个带 children 的组件？
// 3. 如何定义一个带泛型的组件？
// 4. 在你的项目中，如何处理组件的类型定义？

// 示例：定义一个 Button 组件的类型
```

---

## 第三部分：React 基础与进阶（20 分钟）

### 11. Hooks 基础（3 分钟）

```typescript
// 问题：
// 1. useState 和 useRef 的区别是什么？
// 2. useEffect 的依赖数组是如何工作的？
// 3. 什么时候用 useMemo，什么时候用 useCallback？
// 4. 在你的项目中，有没有封装过自定义 Hook？举个例子。
```

---

### 12. 组件优化（3 分钟）

```typescript
// 场景：一个列表组件，有 1000 条数据，滚动时很卡

interface Item {
  id: number;
  name: string;
  price: number;
}

function ItemList({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// 问题：
// 1. 这个组件有什么性能问题？
// 2. 如何优化？（至少给出3种方案）
// 3. 在你的项目中，遇到过类似的性能问题吗？怎么解决的？
```

---

### 13. 状态管理（3 分钟）

```typescript
// 问题：
// 1. Context 和 Redux 的区别是什么？
// 2. 什么时候用 Context，什么时候用 Redux？
// 3. 如何避免 Context 导致的不必要的重渲染？
// 4. 在你的项目中，如何管理全局状态？
```

---

### 14. 副作用处理（4 分钟）

```typescript
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  return <div>{user?.name}</div>;
}

// 问题：
// 1. 这个组件有什么问题？（至少指出3个）
// 2. 如何处理加载状态和错误状态？
// 3. 如何处理组件卸载时的清理？
// 4. 在你的项目中，如何封装数据请求逻辑？
```

---

### 15. 表单处理（4 分钟）

```typescript
// 实现一个登录表单，包含：
// - 用户名和密码输入框
// - 表单验证（用户名不能为空，密码至少6位）
// - 提交时显示 loading 状态
// - 错误处理

// 问题：
// 1. 如何实现这个表单？（写出核心代码）
// 2. 如何优化表单性能？（避免每次输入都重渲染）
// 3. 在你的项目中，如何处理复杂表单？
```

---

### 16. 组件设计（3 分钟）

```typescript
// 问题：
// 1. 什么是受控组件和非受控组件？
// 2. 如何设计一个可复用的 Input 组件？
// 3. 如何设计一个可复用的 Modal 组件？
// 4. 在你的项目中，封装过哪些通用组件？举个例子。
```

---

## 第四部分：项目实战（10 分钟）

### 17. 项目经验（5 分钟）

**请结合你的实际项目经验回答：**

1. **项目背景**：

   - 你做过的最复杂的项目是什么？
   - 项目的技术栈是什么？
   - 你在项目中负责哪些模块？

2. **技术难点**：

   - 你在项目中遇到过什么技术难点？
   - 具体是什么问题？
   - 你是如何分析和解决的？
   - 最终效果如何？（最好有量化数据）

3. **技术选型**：
   - 为什么选择这个技术方案？
   - 有没有考虑其他方案？
   - 如果让你重新做，你会怎么优化？

---

### 18. 代码实现（5 分钟）

**场景**：实现一个搜索组件，要求：

- 输入框输入时，实时搜索
- 防抖处理（500ms）
- 显示搜索结果列表
- 支持 loading 和 error 状态
- 使用 TypeScript

```typescript
// 请写出核心代码（不需要完整实现，写出关键逻辑即可）

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

function SearchComponent() {
  // 你的实现
}
```

---

## 📊 评分标准

### 初级（60 分以下）

- 基础概念不清楚
- 没有实际项目经验
- 代码能力弱

### 中级（60-80 分）

- 基础概念清楚
- 有实际项目经验
- 能独立解决问题
- 代码质量好

### 高级（80-95 分）

- 理论知识扎实
- 项目经验丰富
- 有架构设计能力
- 能提出优化方案

### 资深（95 分以上）

- 精通原理
- 有深度思考
- 有方法论
- 能带团队

---

## 💡 答题技巧

### 1. 理论题答题模板

```
1. 简单说原理（30%）
2. 举实际例子（50%）
3. 说注意事项（20%）
```

**示例**：

> **问**：说说 useEffect 的依赖数组？
>
> **答**：
>
> - **原理**：依赖数组决定了 effect 何时重新执行。如果依赖项变化，effect 会重新执行。
> - **实际例子**：在得物项目中，我用 useEffect 监听 userId 变化来获取用户数据。当 userId 变化时，重新请求数据。
> - **注意事项**：要避免遗漏依赖项，可以用 ESLint 插件检查。如果依赖项是对象或函数，要注意引用相等性问题。

---

### 2. 实战题答题模板

```
1. 问题分析（20%）
2. 解决方案（50%）
3. 效果评估（20%）
4. 反思优化（10%）
```

**示例**：

> **问**：如何优化列表性能？
>
> **答**：
>
> - **问题分析**：列表有 1000 条数据，每次滚动都重新渲染所有列表项，导致卡顿。
> - **解决方案**：
>   1. 虚拟列表：只渲染可见的 20 个列表项
>   2. React.memo：避免不必要的重渲染
>   3. useCallback：缓存事件处理函数
> - **效果评估**：首屏速度提升 50%，滚动流畅度明显改善
> - **反思优化**：如果数据量更大，可以考虑分页加载或无限滚动

---

### 3. 不会的题目怎么办？

```
1. 诚实说不懂（不要瞎编）
2. 说说你的理解（展示思考能力）
3. 引导到相关经验（展示学习能力）
```

**示例**：

> **问**：说说 React Fiber 的原理？
>
> **答**：
>
> - **诚实**：我对 Fiber 的底层实现没有深入研究过源码。
> - **理解**：但我知道它的核心作用是通过时间切片和优先级调度来优化渲染性能。
> - **相关经验**：在项目中，我遇到过用户边滚动列表边输入时卡顿的问题。我通过虚拟列表和 React.memo 优化后，输入变得很流畅。我理解这背后也有 Fiber 的功劳，它让高优先级的用户输入不被列表渲染阻塞。

---

## 🎯 重点提示

### 对于有项目经验的候选人

1. **多举实际例子**：每个理论题都尽量结合项目经验
2. **量化效果**：说优化时，给出具体数据（提升 50%、减少 70% 等）
3. **展示思考**：说说为什么这样做，有没有考虑其他方案
4. **主动引导**：把理论题引导到你擅长的项目经验

### 对于理论知识薄弱的候选人

1. **不要慌**：理论不是全部，实战经验更重要
2. **诚实回答**：不懂就说不懂，不要瞎编
3. **展示能力**：通过项目经验展示你的实际能力
4. **学习态度**：表现出愿意学习和提升的态度

---

## 📚 参考答案

> **说明**：参考答案将在面试结束后提供，建议先独立完成再对照答案。

---

**祝你面试顺利！🚀**
