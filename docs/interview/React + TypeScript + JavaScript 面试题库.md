# React + TypeScript + JavaScript 面试题库

> **说明**：本套题目为**面试题库**，共 20 题，涵盖 JavaScript 基础、TypeScript 核心、React 进阶和项目实战。  
> **使用方式**：面试官会根据候选人情况从中选择 8-12 题进行考察，总时长约 60 分钟。  
> **难度**：中等偏上，适合考察 1-3 年经验的 React + TypeScript 开发者。

---

## 📋 题目结构

- **第一部分：JavaScript 基础**（7 题，约 21 分钟）
- **第二部分：TypeScript 核心**（3 题，约 9 分钟）
- **第三部分：React 基础与进阶**（7 题，约 25 分钟）
- **第四部分：项目实战**（3 题，约 18 分钟）

**总计：20 题，面试官可根据实际情况选择题目组合**

---

## 第一部分：JavaScript 基础（15 分钟）

### 1. 闭包与作用域（3 分钟）

**代码：**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
```

**问题：**

1. 上面代码会输出什么？为什么？
2. 如何修改代码让它输出 0, 1, 2？（至少给出 2 种方案）
3. 在实际项目中，你遇到过类似的闭包问题吗？怎么解决的？

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

**代码：**

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
```

**问题：**

1. 上面代码有什么性能问题？如何优化？
2. 如果 res1 失败了，res2 还会执行吗？
3. 在你的项目中，如何处理多个并发请求？

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
// 2. 如何定义一个通用的请求函数，返回类型是 ApiResponse<T>？
// 3. 在你的项目中，如何封装 API 请求？
```

**答：**

**1. 使用泛型定义不同的响应类型：**

```typescript
// 定义用户类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 单个用户的响应
type UserResponse = ApiResponse<User>;

// 用户列表的响应
type UsersResponse = ApiResponse<User[]>;

// 分页数据的响应
interface PageData<T> {
  list: T[];
  total: number;
  page: number;
}
type UsersPageResponse = ApiResponse<PageData<User>>;
```

**2. 定义一个通用的请求函数：**

```typescript
//定义时

//基础请求定义
async function commonRequest<T>(url: string): Promise<ApiResponse<T>> {
  const reponse = await fetch(url)
  return reponse.json()
}
// 使用
const apiApi = {
  // 对于简单类型 手动定义返回接口类型
  async getUser(id:number){
    return commonRequest<{name:string,id:number}>(`/api/user/${id}`)
  }
  //如果接口返回复杂数据
  // 复杂的查询：自动推导
  async getUserDashboard(id: number) {
    const user = await fetch(`/api/user/${id}`).then(r => r.json())
    const stats = await fetch(`/api/user/${id}/stats`).then(r => r.json())
    const posts = await fetch(`/api/user/${id}/posts`).then(r => r.json())

    return {
      user,
      stats: {
        ...stats,
        postsPerDay: stats.totalPosts / stats.daysSinceJoin
      },
      posts: posts.map(p => ({
        ...p,
        isRecent: Date.now() - p.createdAt < 86400000
      }))
    }
  }
}


// 定义自动推导 Promise 返回值的工具类型
type UnwrapPromise<T> =  T extends Promise<infer R> ?
  UnwrapPromise<R> :
  T extends {
    then: (onfulfilled: (args: infer A) => any) => any
  } ? A : T

// 自动推导 getUserDashboard 的返回类型
type UserDashboard = UnwrapPromise<ReturnType<typeof apiApi.getUserDashboard>>;
// 或者使用 TypeScript 内置的 Awaited
type UserDashboard2 = Awaited<ReturnType<typeof apiApi.getUserDashboard>>;

// 使用时
async function main() {
  const ans: UserDashboard = await apiApi.getUserDashboard(1);
  // ans 的类型自动推导为：
  // {
  //   user: any;
  //   stats: { postsPerDay: number; ... };
  //   posts: Array<{ isRecent: boolean; ... }>;
  // }
}
```

**3. 项目中的 API 封装：**

在实际项目中，我会这样封装：

- 创建 `ApiClient` 类统一处理请求（添加 token、错误处理）
- 按模块组织 API（userApi、orderApi 等）
- 使用泛型确保类型安全
- 对于复杂返回值，使用 `ReturnType` 和条件类型自动推导

**评分：92/100** ⭐⭐⭐⭐⭐

**评价：**

- ✅ 问题 1（25/25 分）：完全正确！展示了多种场景的泛型使用（单个、数组、分页）
- ✅ 问题 2（23/25 分）：**非常优秀！** 展示了高级的类型编程能力
  - ✅ 基础的泛型函数定义正确（`commonRequest<T>`）
  - ✅ 展示了实战场景：多个 API 调用组合并处理数据
  - ✅ 实现了 `UnwrapPromise` 递归解包嵌套 Promise 和 thenable
  - ✅ 知道用 `ReturnType` + 自定义工具类型自动推导复杂返回值
  - ✅ 知道 TypeScript 内置的 `Awaited` 类型
  - ⚠️ 小瑕疵：`reponse` 拼写错误（扣 2 分）
- ✅ 问题 3（19/25 分）：回答了封装思路，简洁明了（扣 6 分：可以更详细）
- 🎉 **加分项**：
  - 展示了递归类型、条件类型、`infer` 的综合运用
  - 考虑了复杂实战场景（多接口组合、数据处理）
  - 区分了简单场景（手动定义）和复杂场景（自动推导）

**优点：**

- 🎉 **TypeScript 水平很高**：能实现递归类型，理解 thenable 对象
- 🎉 **实战思维强**：考虑了真实业务场景（计算、判断）
- 🎉 **类型安全意识**：用工具类型自动推导而不是手动维护
- 🎉 **知识广度**：知道内置类型和自定义实现的对比

**面试官视角：**
"TypeScript 水平很高，能实现复杂的工具类型，有实战经验，类型安全意识强。这已经是高级开发者的水平了！推荐录用！"

---

### 8. 类型守卫（3 分钟）

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  // 问题：如何实现这个函数？
  // 要求：使用类型守卫，确保类型安全
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.width * shape.height;
  }
}

// 在你的项目中，有没有用过类似的联合类型？
// 答：用过。我封装过一个通用的表单输入组件，根据传入 `type` 的不同提供不同的功能。我使用了判别联合类型来区分不同的输入类型：
```

```typescript
type FormFieldConfig =
  | {
      type: "singleInput";
      placeholder?: string;
      onChange: (value: string) => void;
    }
  | {
      type: "select";
      options: Array<{ label: string; value: string }>;
      onChange: (value: { label: string; value: string }) => void;
    };

function renderFormField(config: FormFieldConfig) {
  switch (config.type) {
    case "singleInput":
      // TypeScript 知道这里 onChange 接收 string
      return <Input onChange={(e) => config.onChange(e.target.value)} />;
    case "select":
      // TypeScript 知道这里 onChange 接收对象
      return <Select options={config.options} onChange={config.onChange} />;
  }
}
```

这样可以确保不同类型的输入组件有不同的回调函数签名，TypeScript 会自动推断类型，避免类型错误。

---

**评分：90/100** ⭐⭐⭐⭐⭐

**评价：**

- ✅ **代码实现（25/25 分）**：完全正确！使用了类型守卫，TypeScript 能正确推断类型
- ✅ **项目经验（20/25 分）**：很好！展示了实际项目中的应用场景
  - ✅ 场景真实（通用表单组件）
  - ✅ 理解了判别联合类型的作用
  - ⚠️ 描述可以更清晰（扣 5 分：建议用代码示例）

**优点：**

- ✅ 代码实现正确，使用了 `if-else` 类型守卫
- ✅ 理解判别联合类型（通过 `kind` 字段区分）
- ✅ 有实际项目经验（表单组件封装）
- ✅ 理解了不同类型对应不同的回调签名

**建议：**

- 💡 可以用 `switch` 语句，更清晰（但 `if-else` 也完全正确）
- 💡 项目经验的描述可以更结构化（用代码示例会更好）

**面试官视角：**
"候选人理解类型守卫，代码实现正确。有实际项目经验，知道在表单组件中使用判别联合类型。这是一个合格的中级开发者的回答。"

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
type createTodo<T, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};
//直接使用Omit
type CreateTodo = Omit<Todo, "id" | "createdAt">;
// 2. 如何定义一个"更新 Todo"的类型（所有字段可选，但必须有 id）？
// 可以使用联合类型
type updateTodo = Pick<Todo, "id"> & Partial<Omit<Todo, "id">>;
// 3. 常用的 TypeScript 工具类型有哪些？（至少说出5个）
//答: Pick Omit 用于操作对象键, Exclude Extract 用于操控联合类型
// Readonly Required Partial 用于操作对象属性修饰符
// ReturnType Parameters 用于操作函数类型
// Awaited 用于操作Promise类型
```

---

### 10. React 组件类型（3 分钟）

```typescript
// 问题：
// 1. 如何定义一个函数组件的 Props 类型？
function myComponents(prop: Props) {}
// 2. 如何定义一个带 children 的组件？
function myComponentsWithChildren({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
// 3. 如何定义一个带泛型的组件？
// 方法1：函数声明（推荐）
function List<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// 使用示例
interface User {
  id: number;
  name: string;
}

<List<User>
  items={users}
  renderItem={(user) => <span>{user.name}</span>} // user 类型自动推断为 User
/>;

// 方法2：箭头函数（注意需要逗号避免 JSX 语法冲突）
const Select = <T>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) => {
  return (
    <select
      onChange={(e) => {
        const selected = options[Number(e.target.value)];
        onChange(selected);
      }}
    >
      {options.map((option, index) => (
        <option key={index} value={index}>
          {String(option)}
        </option>
      ))}
    </select>
  );
};

// 4. 在你的项目中，如何处理组件的类型定义？
/* 一般只在可控组件添加Props类型 对于需要ref操控的组件,会额外暴露 useImperativeHandle 定义的方法类型. */

// 示例：带 ref 的组件类型定义
interface ModalMethods {
  open: () => void;
  close: () => void;
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal = forwardRef<ModalMethods, ModalProps>((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  return visible ? (
    <div>
      {props.title}
      {props.children}
    </div>
  ) : null;
});

// 父组件使用
const modalRef = useRef<ModalMethods>(null);
modalRef.current?.open(); // 类型安全，有智能提示
```

---

## 第三部分：React 基础与进阶（20 分钟）

### 11. Hooks 基础（3 分钟）

```typescript
// 问题：
// 1. useState 和 useRef 的区别是什么？
```

**答：** useState 定义的 state 在发生变化时可以触发相关依赖项的更新，因此常用于存储响应式数据，而 useRef 的数据不会触发响应式更新，同时 useState 的数据更新是异步的，也就是说，对 state 数据的更新不能同步获取，需要注意异步陷阱问题， useRef 的数据是同步更新的。useState 定义的 state 数据不能直接修改，需要使用 set 函数更新，useRef 的数据可以直接修改，通过 ref 的 current 属性可以直接赋值。

**评分：75/100** ⭐⭐⭐

**评价：**

- ✅ **核心区别理解正确**（20/25 分）：
  - ✅ useState 会触发重新渲染，useRef 不会
  - ✅ useState 更新是异步的，useRef 是同步的
  - ✅ useState 需要用 set 函数，useRef 可以直接修改
- ⚠️ **表述不够准确**（-5 分）：
  - "触发相关依赖项的更新" → 应该是"触发组件重新渲染"
  - "异步陷阱问题" → 应该是"闭包陷阱"或"stale closure"
- ⚠️ **缺少重要区别**（-15 分）：
  - ❌ 没有提到 useRef 可以保存 DOM 引用
  - ❌ 没有提到 useRef 的值在组件重新渲染时保持不变
  - ❌ 没有提到 useRef 常用于保存定时器、前一次的值等

**优点：**

- ✅ 理解了核心区别（响应式更新、异步/同步、修改方式）
- ✅ 知道异步陷阱问题

**可以补充的内容：**

**1. 触发重新渲染**

- `useState`：值变化会触发组件重新渲染
- `useRef`：值变化不会触发重新渲染

**2. 更新方式**

- `useState`：必须用 `setState`，不能直接修改
- `useRef`：可以直接修改 `.current`

**3. 更新时机**

- `useState`：异步更新（批量更新）
- `useRef`：同步更新

**4. 值保持**

- `useState`：每次渲染都是新值
- `useRef`：值在组件重新渲染时保持不变（引用不变）

**5. 使用场景**

- `useState`：需要触发 UI 更新的数据
- `useRef`：保存 DOM 引用、定时器 ID、前一次的值等

**6. 闭包陷阱**

- `useState`：需要注意闭包陷阱（stale closure）
- `useRef`：通过 `.current` 访问，总是最新值

**面试官视角：**
"候选人理解了核心区别，知道异步更新和闭包陷阱，但表述不够准确，缺少一些重要区别（如 DOM 引用、值保持）。这是一个合格的中级开发者的回答。"

---

```typescript
// 2. useEffect 的依赖数组是如何工作的？
```

**答：** useEffect 的依赖数组用于判断 useEffect 是否需要更新，React 的更新分为两个阶段：渲染阶段和提交阶段，在一个 useEffect 的更新发生在渲染阶段，react 根据 useEffect 的依赖数组是否变化判断是否需要重新执行 useEffect，然后提交阶段，Diff 算法通过浅比较判断哪些 DOM 需要更新。如果依赖数组是空数组，那么只在组件挂载时和销毁时执行 useEffect，如果存在依赖数组，那么在需要更新时，会先执行 useEffect 的返回函数，然后重新执行 useEffect，如果没有依赖数组，那么每次 state 的更新都会重新执行 useEffect

**评分：60/100** ⭐⭐

**评价：**

- ✅ **核心理解正确**（15/25 分）：
  - ✅ 知道依赖数组的作用（判断是否需要重新执行）
  - ✅ 知道空数组、有依赖、无依赖的区别
  - ✅ 知道清理函数的执行时机（先执行清理，再执行新的 effect）
- ❌ **严重概念错误**（-20 分）：
  - ❌ **"useEffect 的更新发生在渲染阶段"** → 这是错误的！useEffect 是在**提交阶段（commit phase）**执行的，在 DOM 更新**之后**
  - ❌ **"Diff 算法通过浅比较判断哪些 DOM 需要更新"** → 这个和 useEffect 依赖数组没有直接关系，混淆了 React 的渲染机制和 useEffect 的执行机制
- ⚠️ **缺少重要内容**（-15 分）：
  - ❌ 没有提到依赖数组的比较机制（使用 `Object.is` 进行浅比较）
  - ❌ 没有提到 useEffect 的执行时机（DOM 更新后，浏览器绘制前）
  - ❌ 没有提到依赖数组的最佳实践（ESLint 规则、闭包陷阱等）

**正确的理解：**

#### React 更新流程

React 的更新分为两个阶段：

1. **渲染阶段（Render Phase）**：

   - 执行组件函数，生成虚拟 DOM
   - 使用 Diff 算法比较虚拟 DOM
   - 确定需要更新的 DOM 节点
   - ✅ **检查 useEffect 的依赖数组**（使用 `Object.is` 比较）
   - ✅ **标记需要执行的 effect**（如果依赖数组变化）

2. **提交阶段（Commit Phase）**：
   - 更新真实 DOM
   - ✅ **执行被标记的 useEffect**（在 DOM 更新后）
   - 浏览器绘制

#### ⚠️ 重要澄清

- 依赖数组的**检查**发生在渲染阶段
- effect 的**执行**发生在提交阶段
- 原回答"useEffect 的更新发生在渲染阶段"不准确，应该是：
  "useEffect 依赖数组的检查发生在渲染阶段，effect 的执行发生在提交阶段"

#### 不同类型函数的执行时机

**1. 组件函数（Component Function）**

- **执行时机**：渲染阶段（Render Phase）
- **触发条件**：state 或 props 变化、父组件重新渲染
- **特点**：每次渲染都会重新执行，生成新的虚拟 DOM

```typescript
function Component() {
  // 这个函数在渲染阶段执行
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

**2. useEffect 回调函数**

- **执行时机**：提交阶段（Commit Phase）
- **触发条件**：依赖数组变化、组件挂载、组件卸载
- **特点**：在 DOM 更新后执行，不会阻塞渲染

```typescript
useEffect(() => {
  // 这个函数在提交阶段执行（DOM 更新后）
  console.log("effect 执行");
}, [count]);
```

**3. useLayoutEffect 回调函数**

- **执行时机**：提交阶段（Commit Phase），但在浏览器绘制之前
- **触发条件**：依赖数组变化、组件挂载、组件卸载
- **特点**：同步执行，会阻塞浏览器绘制

```typescript
useLayoutEffect(() => {
  // 这个函数在提交阶段执行（DOM 更新后，但绘制前）
  // 同步执行，会阻塞绘制
}, [count]);
```

**4. 事件处理函数**

- **执行时机**：用户交互时（浏览器事件循环）
- **触发条件**：用户点击、输入等操作
- **特点**：异步执行，不阻塞渲染

```typescript
function Component() {
  const handleClick = () => {
    // 这个函数在用户点击时执行（浏览器事件循环）
    setCount(count + 1);
  };
  return <button onClick={handleClick}>点击</button>;
}
```

**5. 清理函数（Cleanup Function）**

- **执行时机**：提交阶段（Commit Phase）
- **触发条件**：组件卸载、依赖项变化（先执行清理，再执行新的 effect）
- **特点**：在 effect 执行前或组件卸载时执行

```typescript
useEffect(() => {
  const timer = setInterval(() => {}, 1000);

  return () => {
    // 这个清理函数在提交阶段执行
    // 1. 依赖项变化时：先执行清理，再执行新的 effect
    // 2. 组件卸载时：执行清理
    clearInterval(timer);
  };
}, [count]);
```

**6. useMemo/useCallback 的回调函数**

- **执行时机**：渲染阶段（Render
- **触发条件**：依赖项变化
- **特点**：在组件函数执行时同步计算

```typescript
const memoizedValue = useMemo(() => {
  // 这个函数在渲染阶段执行（如果依赖项变化）
  return expensiveCalculation(count);
}, [count]);
```

#### useEffect 依赖数组的工作机制

**1. 依赖数组检查（渲染阶段）**

- React 在渲染阶段使用 `Object.is()` 比较依赖项的值
- 如果依赖项的值发生变化，React 会标记这个 effect 需要在提交阶段执行
- 对象和数组使用引用比较（浅比较）
- 这个检查过程是同步的，发生在组件函数执行时

**2. Effect 执行（提交阶段）**

- `useEffect` 在提交阶段执行（DOM 更新后）
- 在浏览器绘制之前执行（异步，但会阻塞绘制）
- 可以使用 `useLayoutEffect` 在绘制之前同步执行

**3. 依赖数组的三种情况**

- `[]`：只在挂载时执行一次，卸载时执行清理函数
- `[dep1, dep2]`：依赖项变化时执行（先清理，再执行新的 effect）
- 无依赖数组：每次渲染都执行（不推荐，容易造成性能问题）

**4. 清理函数**

- 在组件卸载时执行
- 在依赖项变化时，先执行上一次的清理函数，再执行新的 effect

**5. 最佳实践**

- 依赖数组应该包含 effect 中使用的所有外部变量
- 使用 ESLint 的 `exhaustive-deps` 规则检查
- 注意闭包陷阱（stale closure）

#### 完整流程示例

```typescript
function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("effect 执行");
  }, [count]);

  // 渲染阶段：
  // 1. 执行组件函数
  // 2. 检查 [count] 是否变化（使用 Object.is 比较）
  // 3. 如果变化，标记 effect 需要执行

  // 提交阶段：
  // 1. 更新 DOM
  // 2. 执行被标记的 effect
  // 3. 浏览器绘制
}
```

**面试官视角：**
"候选人理解了依赖数组的基本作用，知道三种情况的区别，但有一个严重错误：认为 useEffect 在渲染阶段执行（实际是在提交阶段）。还混淆了 React 的渲染机制和 useEffect 的执行机制。这是一个需要纠正的概念性错误。"

---

```typescript
// 3. 请描述 React 中 state 更新的完整流程，从调用 setState 到页面更新，React 内部经历了哪些阶段？
```

**答：** React 中一次 state 更新主要分为两个阶段：

**渲染阶段（Render Phase）- 可暂停：**

1. React 处理组件函数更新，处理 Hooks（useMemo/useCallback）以生成 Fiber 树（虚拟 DOM）
2. React 确认 useEffect 依赖数组是否需要更新（使用 Object.is 浅比较），对于需要更新的，打上更新标志
3. Diff 算法浅比较 Fiber 树，确认更新范围，标记需要更新的节点，构建 effect 链表

**提交阶段（Commit Phase）- 不可暂停，同步更新：**

1. 开始执行 DOM 更新
2. 如果存在 useLayoutEffect，会同步执行这里的副作用（DOM 更新后，浏览器绘制前）
3. DOM 更新完毕，浏览器绘制
4. 异步执行标记的 useEffect，先执行清理函数（返回函数），然后重新执行 effect 函数

**评分：80/100** ⭐⭐⭐⭐

**评价：**

- ✅ **核心概念清晰**（20/25 分）：
  - ✅ 明确区分了两个阶段（渲染阶段、提交阶段）
  - ✅ 理解了可暂停 vs 不可暂停的特性
  - ✅ 知道 Fiber 树的概念
  - ✅ useEffect 依赖检查和执行时机准确
- ✅ **细节到位**（15/20 分）：
  - ✅ 提到了 Object.is 进行依赖比较
  - ✅ useLayoutEffect 的执行时机正确
  - ✅ useEffect 清理函数的执行顺序正确
- ⚠️ **措辞需优化**（-10 分）：
  - ⚠️ "确认更新范围，提交给浏览器" → 应该说"标记需要更新的节点，构建 effect 链表"
  - ⚠️ "渲染任务" → 应该说"同步副作用"
- ⚠️ **可以更深入**（-10 分）：
  - 可以补充 Fiber 架构的时间切片机制
  - 可以补充优先级调度的概念
  - 可以补充为什么这样设计（用户体验优化）

**优点：**

- ✅ 理解了 React 更新的核心流程
- ✅ 能区分副作用的执行时机（useEffect vs useLayoutEffect）
- ✅ 知道依赖检查和执行是分开的
- ✅ 对可中断性有认识

**深入理解：**

### React 更新的完整流程

#### 1️⃣ 渲染阶段（Render Phase）- 可中断 ⏸️

**工作内容：**

- 重新执行函数组件
- 处理所有 Hooks（useState、useMemo、useCallback 等）
- 生成新的 Fiber 树（虚拟 DOM）
- Diff 算法对比新旧 Fiber 树
- 标记需要更新的节点（增删改）
- 检查 useEffect 依赖数组（Object.is 比较）
- 构建 effect 链表

**关键特性：**

- ✅ **可中断**：通过 Fiber 架构实现
- ✅ **纯计算**：不操作真实 DOM
- ✅ **可重复执行**：中断后可以重新开始

**为什么可以中断？Fiber 架构：**

```typescript
// 传统 Stack Reconciler（不可中断）
function renderTree(node) {
  // 递归，一旦开始无法停止
  node.children.forEach((child) => renderTree(child));
}

// Fiber Reconciler（可中断）
// 将组件树改造成链表结构
type Fiber = {
  child: Fiber | null; // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟节点
  return: Fiber | null; // 父节点
  effectTag: "UPDATE" | "DELETE" | "PLACEMENT";
};

function workLoop(deadline) {
  // 时间切片：每处理一个 Fiber 节点，检查是否超时
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 如果还有工作且有高优先级任务，让出主线程
  if (nextUnitOfWork && hasHigherPriorityWork()) {
    // 暂停当前工作，处理高优先级任务
    return;
  }
}
```

**时间切片机制：**

- React 将渲染工作拆分成多个小任务（每个 Fiber 节点为一个工作单元）
- 每处理几个节点就检查是否需要让出主线程（约 5ms 一个切片）
- 如果有高优先级任务（用户输入、动画），暂停当前工作
- 高优先级任务完成后，恢复之前的工作

**优先级调度：**

```typescript
// React 18 的优先级模型
enum Priority {
  ImmediatePriority = 1, // 立即执行（用户输入、点击）
  UserBlockingPriority, // 用户阻塞（滚动、拖拽）
  NormalPriority, // 正常优先级（数据更新）
  LowPriority, // 低优先级（分析上报）
  IdlePriority, // 空闲时执行（预加载）
}

// 例子：长列表渲染 vs 用户输入
function App() {
  const [text, setText] = useState("");
  const [list] = useState(Array(10000).fill(0));

  return (
    <>
      {/* 高优先级：用户输入立即响应 */}
      <input value={text} onChange={(e) => setText(e.target.value)} />

      {/* 低优先级：长列表渲染可以被中断 */}
      {list.map((_, i) => (
        <Item key={i} />
      ))}
    </>
  );
}
```

#### 2️⃣ 提交阶段（Commit Phase）- 不可中断 🚫⏸️

**工作内容：**

1. **Before Mutation 阶段**：
   - 执行 getSnapshotBeforeUpdate（类组件）
2. **Mutation 阶段**：
   - 执行 useLayoutEffect 的清理函数
   - 更新真实 DOM（插入、更新、删除节点）
   - 执行 useLayoutEffect 的回调（同步）
3. **Layout 阶段**：
   - 浏览器绘制
4. **异步调度**：
   - 执行 useEffect 的清理函数
   - 执行 useEffect 的回调函数

**关键特性：**

- ❌ **不可中断**：必须同步完成
- ⚡ **尽可能快**：因为会阻塞用户交互
- 🎯 **只执行结果**：渲染阶段已经计算好了所有变更

**为什么不可中断？**

- 如果中断，用户会看到不一致的 UI
- DOM 操作必须一次性完成，否则会出现视觉闪烁
- 类似于数据库事务：要么全部成功，要么全部回滚

### 副作用执行时机对比

```typescript
function Component() {
  const [count, setCount] = useState(0);

  // 1. 组件函数：渲染阶段执行
  console.log("1. 组件渲染");

  // 2. useMemo：渲染阶段执行（依赖变化时）
  const expensive = useMemo(() => {
    console.log("2. useMemo 计算");
    return count * 2;
  }, [count]);

  // 3. useLayoutEffect：提交阶段同步执行（DOM 更新后，绘制前）
  useLayoutEffect(() => {
    console.log("3. useLayoutEffect 执行");
    return () => console.log("3. useLayoutEffect 清理");
  }, [count]);

  // 4. useEffect：提交阶段异步执行（浏览器绘制后）
  useEffect(() => {
    console.log("4. useEffect 执行");
    return () => console.log("4. useEffect 清理");
  }, [count]);

  return <div>{count}</div>;
}

// 首次渲染输出顺序：
// 1. 组件渲染
// 2. useMemo 计算
// 3. useLayoutEffect 执行
// （浏览器绘制）
// 4. useEffect 执行

// count 变化时输出顺序：
// 1. 组件渲染
// 2. useMemo 计算
// 3. useLayoutEffect 清理
// 3. useLayoutEffect 执行
// （浏览器绘制）
// 4. useEffect 清理
// 4. useEffect 执行
```

### 完整流程图示

```
触发更新（setState）
    ↓
【渲染阶段 - 可中断】⏸️
    ↓
重新执行组件函数 ────────→ 处理 Hooks (useMemo/useCallback)
    ↓                           ↓
生成新 Fiber 树 ←──────────────┘
    ↓
Diff 算法对比新旧 Fiber 树
    ↓
标记需要更新的节点 (effectTag)
    ↓
检查 useEffect 依赖数组 (Object.is)
    ↓
构建 effect 链表
    ↓
【提交阶段 - 不可中断】🚫⏸️
    ↓
Before Mutation: getSnapshotBeforeUpdate
    ↓
Mutation: 更新真实 DOM
    ↓
执行 useLayoutEffect 清理函数
    ↓
执行 useLayoutEffect 回调（同步）
    ↓
Layout: 浏览器绘制 🎨
    ↓
异步调度：执行 useEffect 清理函数
    ↓
异步调度：执行 useEffect 回调
    ↓
更新完成 ✅
```

### 实际例子：为什么要这样设计？

```typescript
// 场景：用户正在输入，同时有大型列表渲染
function SearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // 用户输入
  const handleInput = (e) => {
    setQuery(e.target.value); // 高优先级
  };

  // 搜索结果
  useEffect(() => {
    search(query).then((data) => {
      setResults(data); // 低优先级（10000 条数据）
    });
  }, [query]);

  return (
    <>
      <input value={query} onChange={handleInput} />
      {/* 渲染 10000 条结果 */}
      {results.map((item) => (
        <ResultItem key={item.id} data={item} />
      ))}
    </>
  );
}

// 传统 Stack Reconciler（React 16 之前）：
// - 用户输入 "a" → 卡顿 200ms（阻塞渲染 10000 个组件）
// - 用户输入 "ab" → 又卡顿 200ms
// - 体验很差 😢

// Fiber Reconciler（React 16+）：
// - 用户输入 "a" → 立即响应（高优先级）
// - 后台慢慢渲染 10000 个组件（可中断）
// - 用户输入 "ab" → 立即响应，中断之前的渲染，重新开始
// - 体验流畅 😊
```

**面试官视角：**
"候选人对 React 更新流程有扎实的理解，能准确区分渲染阶段和提交阶段，知道可中断性的概念，副作用执行时机清晰，细节把控不错（Object.is、清理函数顺序）。措辞上有些小瑕疵，但不影响整体理解。如果能补充 Fiber 架构的时间切片和优先级调度机制，会更加完美。这是一个中级偏上的回答，达到了高级开发者的门槛。"

---

```typescript
// 4. 什么时候用 useMemo，什么时候用 useCallback？在实际项目中如何判断是否需要使用？
```

**答：** useMemo 用于优化衍生状态和高计算成本的运算，useCallback 用于优化函数。实际项目中，我会根据具体场景判断：对于 useCallback，只在函数传递给经过 React.memo 优化的子组件，或者作为其他 Hook 的依赖时才使用；对于 useMemo，则是将运算量较大的任务（例如根据接口返回值生成组件映射表）进行优化，并将依赖数据放入依赖数组，这样能有效减少计算并且避免闭包陷阱。

在处理列表删除等场景时，我会优先考虑使用事件委托的方式在列表父组件拦截事件，由于函数不需要传递给子组件，所以不使用 useCallback，同时配合 React.memo 优化列表组件。

**评分：85/100** ⭐⭐⭐⭐

**评价：**

- ✅ **理解 Hook 优化场景**（20/25 分）：
  - ✅ 知道 useMemo 用于优化计算，useCallback 用于优化函数
  - ✅ 理解只在必要时使用（传递给 memo 组件、作为 Hook 依赖）
  - ✅ 避免过度优化的意识
- ✅ **高级优化技巧**（20/20 分）：
  - ✅ 使用事件委托减少事件处理器数量
  - ✅ 理解事件委托配合 memo 的优化策略
- ✅ **实际应用经验**（20/20 分）：
  - ✅ 有具体的应用场景（组件映射表）
  - ✅ 知道依赖数组的作用
- ⚠️ **小瑕疵**（-15 分）：
  - 初始回答有"所有函数都用 useCallback"的过度优化倾向
  - 但在追问后能快速调整思路，展现更优方案

**优点：**

- ✅ 从过度优化调整到精准优化，学习能力强
- ✅ 掌握事件委托等高级优化手段
- ✅ 能从整个组件树角度思考性能问题

**关键要点：**

**useCallback 使用场景：**

1. ✅ 函数传递给经过 `React.memo` 优化的子组件
2. ✅ 函数作为其他 Hook 的依赖
3. ✅ 函数在 Context 中共享
4. ❌ 其他情况不要用（过度优化）

**useMemo 使用场景：**

1. ✅ 计算成本高（>50ms）
2. ✅ 需要保持引用稳定（对象/数组传给 memo 组件）
3. ❌ 简单计算不要用

**高级技巧：事件委托**

```typescript
// 只在父组件绑定一个事件处理器，而不是每个子项都绑定
const handleDelete = (e) => {
  const todoId = e.target.dataset.id;
  if (todoId) onDelete(todoId);
};

return <ul onClick={handleDelete}>...</ul>;
```

**面试官视角：**
"候选人一开始有过度优化的误区，但在追问后立即展现了更高级的优化思维。不仅理解了 useCallback/useMemo 的正确使用场景，还知道使用事件委托这种更优的方案。能够从整个组件树的角度思考性能优化，这是高级前端开发者的水平。"

---

```typescript
// 5. 在实际项目中，你是如何衡量性能优化是否有效的？能举个你解决的性能问题吗？
```

**答：** 我判断优化有效的依据主要有两个方面：1. 用户实际体验，2. 实际渲染帧数。

之所以分开来讲，是因为由于人眼的机制，超过 60 帧之后的优化用户感知并不明显，所以从用户体验来说，从 30 帧（明显卡顿）提升到 60 帧（运行流畅）就可以显著提升用户体验。实际帧数则是从开发者角度更好地衡量组件质量。

实际工作中，我在开发一个多 tab、每个 tab 都有长列表的管理页功能时，出现了明显的性能问题，多次切换时造成了明显的卡顿。

我使用 React DevTools Profiler 检查发现：其中一个列表的生成并没有使用 useMemo 优化计算，同时列表组件并没有使用 React.memo 优化，这导致了每次数据请求都导致列表重新渲染。

**优化步骤：**

1. 搭建组件映射表，统一引入 React.memo
2. 通过虚拟列表优化长列表渲染（react-window）
3. 将列表生成使用 useMemo 进行优化

**优化效果：** 成功从 30 帧提升到了 70 帧

**评分：90/100** ⭐⭐⭐⭐⭐

**评价：**

- ✅ **衡量标准专业**（25/25 分）：
  - ✅ 双重标准：用户体验 + 技术指标
  - ✅ 理解人眼机制（60 FPS 是体验阈值）
  - ✅ 知道优化的边界，避免过度优化
- ✅ **真实案例完整**（30/30 分）：
  - ✅ 问题场景清晰（多 tab + 长列表）
  - ✅ 使用工具定位问题（React DevTools Profiler）
  - ✅ 解决方案系统（三步优化）
  - ✅ 量化效果（30 FPS → 70 FPS）
- ✅ **高级优化技巧**（25/25 分）：
  - ✅ 虚拟列表（react-window）
  - ✅ 组件 memo 优化
  - ✅ useMemo 缓存计算
- ⚠️ **小瑕疵**（-10 分）：
  - 没有详细说明 React DevTools Profiler 的具体使用方法

**优点：**

- ✅ 从用户视角和技术视角双重衡量优化效果
- ✅ 有完整的问题分析和解决流程
- ✅ 掌握虚拟列表等高级优化手段
- ✅ 能量化优化效果

**关键技术点：**

**虚拟列表原理：**

- 只渲染可见区域的列表项（约 20-30 个）
- 而不是渲染全部 10000 个列表项
- 滚动时动态替换可见项
- 性能提升：O(n) → O(1)

**性能衡量指标：**

- **用户体验层面**：30 FPS（卡顿）→ 60 FPS（流畅）→ >60 FPS（人眼无感知）
- **技术指标**：FPS、Render 次数、渲染耗时、DOM 节点数

**React DevTools Profiler：**

- Flamegraph 火焰图：查看每个组件的渲染耗时
- Ranked 排名：按耗时排序，快速定位瓶颈
- Why did this render：分析重新渲染原因

**面试官视角：**
"候选人展现了从理论到实践的完整能力：理解性能优化的衡量标准（用户体验 + 技术指标），会使用工具定位问题，掌握虚拟列表等高级优化手段，有真实的性能问题解决经验。案例陈述完整，优化效果量化清晰。这是一个合格的高级前端开发者，有扎实的理论基础和丰富的实战经验。"

---

```typescript
// 6. 在你的项目中，有没有封装过自定义 Hook？举个例子。
```

**答：** 我的项目遵循 MVVM 架构，使用自定义 Hook 承担 ViewModel 层的功能。例如搜索页功能，我封装了 `useSearch` Hook，使用 useContext 管理全局状态（搜索关键字、场景码等），内部通过 useCallback 封装搜索方法，使用策略模式根据场景码选择对应的 ViewModel（switch 语句），同时统一处理错误逻辑。视图层只需要调用返回的方法，不需要关心具体实现。

相比于不使用这个 Hook：视图层需要手动传递搜索关键字，ViewModel 需要进行额外的场景和错误处理。

**核心代码：**

```typescript
function useSearch() {
  const { searchKey, searchScene, setResults, setError } =
    useContext(SearchContext);

  const handleSearch = useCallback(async () => {
    try {
      let data;
      switch (searchScene) {
        case "normal":
          data = await normalViewModel(searchKey);
          break;
        case "advanced":
          data = await advancedViewModel(searchKey);
          break;
      }
      setResults(data);
    } catch (error) {
      setError(error); // 统一错误处理
    }
  }, [searchKey, searchScene, setResults, setError]);

  return { handleSearch };
}
```

**评分：85/100** ⭐⭐⭐⭐

**评价：**

- ✅ **架构设计优秀**（30/30 分）：
  - ✅ MVVM 模式分离关注点
  - ✅ 使用 useContext 管理全局状态
  - ✅ 职责清晰（Hook 层 / ViewModel 层 / 视图层）
- ✅ **技术方案合理**（30/30 分）：
  - ✅ useCallback 保证函数引用稳定
  - ✅ 策略模式支持多场景
  - ✅ 统一错误处理，降低 ViewModel 复杂度
- ✅ **代码实现清晰**（20/25 分）：
  - ✅ 逻辑清晰，易于维护
  - ✅ 依赖数组完整
- ⚠️ **描述略有歧义**（-5 分）：
  - 最初描述不够清晰，澄清后逻辑明确

**优点：**

- ✅ 有完整的架构思维和设计模式应用
- ✅ 自定义 Hook 职责单一，复用性强
- ✅ 统一错误处理，提升代码质量
- ✅ 解决了实际业务问题（多场景搜索）

**关键技术点：**

- **MVVM 模式**：Model（数据） - ViewModel（业务逻辑） - View（UI）
- **策略模式**：根据场景码动态选择不同的处理策略
- **useCallback**：缓存函数，避免不必要的重新创建
- **useContext**：跨组件共享状态，避免 props 层层传递
- **统一错误处理**：在 Hook 层统一捕获处理，ViewModel 只负责业务逻辑

**面试官视角：**
"候选人展现了很好的架构设计能力，理解 MVVM 模式和策略模式，能够合理使用 React Hooks 实现复杂的业务逻辑。自定义 Hook 职责清晰，统一错误处理提升了代码质量。这是一个有架构思维的中高级开发者。"

---

```typescript
// 7. 其他问题
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
答：第一：没有使用React.memo优化，这样无法通过浅比较减少items浅层无变动时的渲染，
这里说的浅层无变动指的是：当items是一个对象数组时，在数组的引用和数组中对象的引用无变动时，不进行整个列表的重渲染，同时通过给ItemCard进行React.memo优化，通过浅比较item本身跳过部分无变动ItemCard渲染。
第二：没有使用虚拟列表进行优化，如果items是一个巨大的列表，这样会导致进程阻塞。
第三：没有使用语义化标签，不利于SEO优化。//额外建议
// 2. 如何优化？（至少给出3种方案）
答：首先进行当前组件本身的优化，最大的问题是没有使用虚拟列表进行优化
虚拟列表优化：
1:使用虚拟列表，只渲染当前可视区域以及上下缓冲区域的列表，降低单次渲染数量，可以将时间复杂度从O(n)降低到O(1),
2:通过虚拟列表结合无限滚动，这样每次触底才进行额外数据的渲染，可以进一步优化性能。
接着是业务层面的优化:如果业务允许，使用分页进行优化，每次只渲染固定条数的数据，由用户决定是否分页。
然后是React的优化，对提供items的ItemList的父组件中，items可能存在的复杂运算进行优化，使用useMemo减少复杂运算的重运算，对ItemList本身使用React.memo 通过Object.is浅比较浅层依赖，当items数组引用以及数组内浅层对象引用无变化时，阻止ItemList本身的重渲染，同时通过对ItemCard进行React.memo优化，降低子item浅层引用无变化时对应条目的重渲染。
额外优化：
- 图片懒加载：如果有图片，使用 lazy loading
- 骨架屏：加载时显示占位符，提升感知性能
- 防抖节流：如果有搜索功能，对输入做防抖处理
// 3. 在你的项目中，遇到过类似的性能问题吗？怎么解决的？
答：我的项目中有一位同事出现过类似的问题，我在对功能进行排查时发现，
这位同事错误的使用了虚拟列表，导致原本一个可视窗口显示20条的虚拟列表，被渲染成了20个虚拟列表，这是最大的问题，导致本来的优化变成了负优化。我首先解决了这个问题，然后通过无限滚动进行了额外的性能优化。
然后我使用React.memo结合useMemo对列表项的筛选进行了优化。还有一个业务层面的优化，将筛选选项的请求从"点击筛选按钮时"提前到"进入页面时"预加载，这样用户点击筛选按钮时可以立即看到选项
```

---

### 13. 状态管理（3 分钟）

```typescript
// 1. Context 和 Redux 的区别是什么？
```

**答：**

**1. 用途**

- Context：解决组件多层透传问题（prop drilling）
- Redux：解决复杂应用的状态管理

**2. 性能**

- Context：value 变化时所有消费者重渲染，需手动优化（useMemo/useCallback 或拆分 Context）
- Redux：通过 useSelector 浅比较优化，只有依赖的状态变化才重渲染
  - 注意：useSelector 是浅比较，返回新对象会导致重渲染

**3. 生态和工具**

- Context：React 内置，无额外依赖，无中间件和调试工具
- Redux：丰富生态（Redux DevTools 时间旅行调试、Redux Toolkit、中间件等）

**4. 规范性**

- Redux：强制 dispatch + reducer 模式，状态变化可追踪、可预测
- Context：更灵活（可直接 setState 或配合 useReducer），但缺乏约束

**5. 使用场景**

- Context：简单全局状态（主题、语言、用户信息）
- Redux：复杂状态管理（大型应用、需要中间件和调试工具）

**问：什么时候用 Context，什么时候用 Redux？**<br>

```
答：
要根据具体情况选择：如果是复杂度较低的独立模块，并且使用者有比较好的性能处理意识，那么可以使用Context，
如果是全局状态，例如用户的个性化设置，多个模块共享的状态，或者是复杂度较高，有很多依赖耦合的状态，推荐使用Redux。
我的实际项目中，就遇到过状态管理工具的选择难题，当时正在处理一个较为复杂的独立模块，一开始想用Redux进行管理，但是由于团队内部并没有确定相关规范，并且没有需要多组件共享的状态，在评估后，决定选择使用Context结合useReducer实现类Redux的局部状态管理，并结合React.memo优化性能。
```

**优化回答** <br>
Context：简单状态、不频繁更新、消费者少
Redux：复杂状态、多模块共享、需要中间件和调试

```
案例：我们有个复杂独立模块，评估后选用 Context + useReducer（无需跨模块共享，团队无 Redux 规范），配合 React.memo 优化性能。
```

**问：如何避免 Context 导致的不必要的重渲染？**

答：由于 Context 没有内置的浅比较，我们可以通过：
1：使用多个 useContext 独立状态，防止连带更新
2：使用 React.memo 优化组件，在组件层浅比较减少重渲染
3: 使用 useMemo/useCallback 减少共享的状态/函数不必要的重渲染

**问：在你的项目中，如何管理全局状态？**
答：我最新的项目中，之前并没有引入 Redux，我们没有太复杂的全局状态，所以使用的是 Context 结合 useReducer，通过添加 dispatch 管理全局状态的修改。当前项目中，有一个复杂模块需要多同级组件获取和管理状态，经过评估，选择了轻量化的 zustands 进行管理，可以更简单的实现同级组件状态同步，并且性能也较为优秀。

### 14. 副作用处理（4 分钟）

```typescript
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null); // 状态初始化问题

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
    // 缺少清理函数，请求没有返回前退出该页面会造成内存泄漏
  }, [userId]);

  return <div>{user?.name}</div>; //缺少错误处理和loading状态
}

// 问题：
// 2. 如何处理加载状态和错误状态？
// 3. 如何处理组件卸载时的清理？
// 4. 在你的项目中，如何封装数据请求逻辑？
```

**1. 这个组件有什么问题？（至少指出 3 个）**<br>
答: 1：状态初始化存在问题，使用 null 作为状态初始化是很差的选择，既然使用了 ts，就要确定 user 的类型稳定。
2：缺少错误处理和 loading 状态处理，以及空值处理，请求函数没有错误处理，发生错误时，既无法确定错误的来源，也会阻塞进程，并且无法处理错误。
没有 loading 状态，意味着用户无法正确知道，是否展示了正确的数据。没有空值处理，则在没有数据时无法通知用户。
3：缺少清理函数，请求没有返回前退出该页面会造成内存泄漏，因为请求依然会正常的发出并返回值。

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
