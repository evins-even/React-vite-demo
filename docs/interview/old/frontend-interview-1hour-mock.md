# 比特鹰前端工程师面试题 - 1 小时模拟面试

> 应聘者姓名：**\*\*\*\***\_\_**\*\*\*\***
>
> 面试日期：**\*\*\*\***\_\_**\*\*\*\***
>
> 面试官：**\*\*\*\***\_\_**\*\*\*\***
>
> **面试时长：60 分钟**

---

## 时间分配建议

| 部分            | 题数      | 时间        | 分值       |
| --------------- | --------- | ----------- | ---------- |
| JavaScript 基础 | 3 题      | 15 分钟     | 30 分      |
| React 框架      | 2 题      | 12 分钟     | 20 分      |
| CSS/布局        | 2 题      | 10 分钟     | 15 分      |
| TypeScript      | 1 题      | 8 分钟      | 10 分      |
| 编码实践        | 1 题      | 12 分钟     | 20 分      |
| 综合能力        | 1 题      | 3 分钟      | 5 分       |
| **总计**        | **10 题** | **60 分钟** | **100 分** |

---

## 第一部分：JavaScript 基础（15 分钟，30 分）

### 1.1 请解释事件循环（Event Loop）机制，并说明宏任务和微任务的执行顺序（10 分）

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
答：首先我们区分 js 事件，主要分为：同步任务，微任务，宏任务
顺序:首先依次执行同步任务，将微任务和宏任务添加入队，然后执行微任务队列，最后执行宏任务队列，
每个宏任务执行完毕后都要检查是否有新的微任务，有则立即执行所有的微任务，然后检查是否有渲染任务，有则渲染
接着执行下一个宏任务。要注意，渲染任务并不是每次都执行，要看浏览器怎么分配。
输出解释：1 6 为同步任务，然后执行微任务输出 4，然后开始执行宏任务计时器，输出 2，同时新的微任务入队，执行输出 3，然后执行下一个宏任务输出 5
<br><br><br><br><br><br>

---

### 1.2 请解释 JavaScript 中的闭包（Closure），并写出一个实际应用场景的例子（10 分）

**回答：**
答：闭包指的是：一个函数及其词法作用域的总和，内部函数可以访问其外部函数的变量，并且在外部函数执行完毕后依然可以访问。
我会给你一个防抖的例子

```javascript
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

面试官追问：你提到了防抖，那能简单说说在 React 中如何使用这个防抖函数吗？比如搜索框场景？
<br>
答：实时搜索场景，为了防止用户每次输入都触发搜索，可以使用防抖, 但是 react 中，最好使用 useRef 持有 timer

```javascript
function useDebounce<T extends (...args) => void>({ func,delay }: { func: T ,delay:number=500}) {
    const funcRef = useRef<T>(func);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(()=>{
        funcRef.current = func
    },[func])
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return useCallback((...args: any) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            funcRef.current(...args);
        }, delay);
    }, [delay]) as T;
}
const searchFunc = function(args:any){}
const debounceSearch = useDebounce(searchFunc,500)
debounceSearch()
```

<br><br><br><br><br><br><br><br>

---

### 1.3 说明 `var`、`let`、`const` 的区别，以及什么是暂时性死区（TDZ）？（10 分）

**回答：**
答：var 声明的变量在函数作用域和全局作用域中提升，可以在赋值前被访问。
let/const 声明的变量也会被提升（理论上）但是在赋值前处于暂时性死区，访问报错。
const 声明的基本数据类型和对象地址不能被改变，可以称为常量。
暂时性死区是为了解决 var 变量提升的问题，防止变量在被赋值前使用。
<br><br><br><br><br><br>

---

## 第二部分：React 框架（12 分钟，20 分）

### 2.1 请解释 React 的生命周期，以及 Hooks 中如何模拟生命周期（10 分）

**回答：**
答：react Class 声明周期主要可以分为三个阶段：挂载阶段-更新阶段-卸载阶段
挂载阶段：主要有 3 个核心方法
constructor()-用于初始化 State，以及绑定方法，render()-返回 JSX,componentDidMount()-DOM 挂载后使用，用于请求数据，DOM 操作。
更新阶段：3 个核心方法
shouldComponentUpdate()-性能优化，决定是否重新渲染，render()-重新渲染,componentDidUpdate()-更新完成，可以操控 DOM。
卸载阶段：componentWillUnmount()-清理计时器，清理监听
Hooks 中通过 useState 模拟 constructor 和 State。使用 useEffect 模拟 componentDidMount componentDidUpdate componentWillUnmount 三个声明周期

```javascript
// 在DOM挂载后执行
useEffect(() => {}, []);
// 依赖被更改，DOM挂载后执行
useEffect(() => {}, [deps]);
//要注意 deps 只是浅比较
// 卸载阶段执行 cleanup 要是一个函数
useEffect(() => {
  return cleanup;
});
```

shouldComponentUpdate 通过 React.memo,useMemo 模拟

<br><br><br><br><br><br>

---

### 2.2 如何避免组件不必要的重渲染？请说明 `memo`、`useMemo`、`useCallback` 的使用场景（10 分）

**回答：**
答：不必要重渲染最重要的是减少不必要的数据更新，例如精细化依赖

```javascript
const { name, id, sex } = props;
const [a, setA] = useState("");
const [b, setB] = useState(0);
const [c, setC] = useState(0);
// 这样每个依赖变化都会触发多个刷新 (当然只是例子，实际开发中会直接使用props)
useEffect(() => {
  setA(name);
  setB(id);
  setC(sex);
}, [name, id, sex]);
//分成3个useEffect 可以避免不必要的更新
```

memo 用于存储组件，会浅比较组件依赖是否发生变化，无变化时不触发重新渲染，useMemo 用于存储派生状态，在依赖项不发生变化时，不会触发修改函数重新创建，useCallback 用于存储函数，在函数依赖不产生变化时，不会重新创建函数。
面试官追问：能举个具体例子吗？比如一个列表组件，每个列表项都有删除按钮，如何优化？

```javascript
interface listItem {
  id: number;
  name: string;
}
function Parent({ items }:{items:listItem[]}) {
  const [list, setList] = useState<listItem[]>(items ?? [] as listItem[]);
  const deleteFunc = useCallback(() => {/**具体删除逻辑 */}, [/** 函数内部依赖 */]);
  return <MemoizedList items={list} />;
}
const MemoizedList = React.memo(function List({
  items,
  deleteFunc,
}: {
  items: listItem[],
  deleteFunc: (id: number) => void,
}) {
  console.log("MemoizedList 渲染了"); // 只有 props 变化时才渲染

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <p>{item.name}</p>
          <button onClick={() => deleteFunc(item.id)}>删除</button>
        </li>
      ))}
    </ul>
  );
});
```

<br><br><br><br><br><br>

---

## 第三部分：CSS/布局（10 分钟，15 分）

### 3.1 请解释 CSS 盒模型，并说明 `box-sizing` 的作用（7 分）

**回答：**
答：css 盒模型主要分为标准盒模型和替代盒模型
标准盒模型(box-sizing:content-box)
width/height 属性只代表标签内容宽度，标签整体宽度需要加上 padding 和 border 大小，实际占位需要加上 margin，
替代盒模型(box-sizing:border-box)
width/height 代表标签整体宽度，也就是内容宽度加 padding 和 border,实际占位加上 margin 大小。
实际开发中推荐使用替代盒模型。
<br><br><br><br><br><br>

---

### 3.2 如何实现水平垂直居中？请写出至少 3 种方法（8 分）

**方法一：**
使用 flex 布局

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

<br><br><br>

**方法二：**
使用 grid 布局

```css
.parent {
  display: grid;
  place-items: center;
}
```

<br><br><br>

**方法三：**
使用定位

```css
.parent {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

<br><br><br>

---

## 第四部分：TypeScript（8 分钟，10 分）

### 4.1 请解释以下工具类型的作用：`Partial`、`Required`、`Pick`、`Omit`、`Record`（10 分）

**回答：**
答：Partial<T>使所有属性变得可选，Required<T>使所有属性必须，Pick<K,P>从 K 中选择 P 的属性，要注意 P extends keyof P，Omit<K,P> 从 K 中排除 P 的属性，同样要注意 P extends keyof P ，Record<K,T>创建以 K 为键以 T 为值得键值对

<br><br><br><br><br><br>

---

## 第五部分：编码实践（12 分钟，20 分）

### 5.1 实现一个防抖（Debounce）函数（20 分）

**要求：**

- 在指定时间内，多次调用只执行最后一次
- 支持立即执行模式
- 支持取消功能

```javascript
function debounce(fn, delay, immediate = false) {
  // 请在此处实现
  let result;
  let timer;
  function debounceFn(...args) {
    const content = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      const isFirst = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (isFirst) result = fn.apply(content, args);
    } else {
      timer = setTimeout(() => fn.apply(content, args), delay);
    }
    return result;
  }
  debounceFn.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounceFn;
}

// 测试用例
const search = debounce((keyword) => {
  console.log("搜索:", keyword);
}, 500);

search("a");
search("ab");
search("abc"); // 只有这次会执行
```

**修正后实现：**

```javascript
function debounce(fn, delay, immediate = false) {
  let timer = null;

  function debounceFn(...args) {
    if (timer) clearTimeout(timer);

    if (immediate) {
      const callNow = !timer; // 首次调用
      timer = setTimeout(() => {
        timer = null; // 重置，下次可以再次立即执行
      }, delay);
      if (callNow) return fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  }

  debounceFn.cancel = () => {
    if (timer) {
      clearTimeout(timer); // ← 修正：timer 不是 timeout
      timer = null;
    }
  };

  return debounceFn;
}
```

<br><br><br><br><br><br><br><br><br><br><br><br><br><br>

---

## 第六部分：综合能力（3 分钟，5 分）

### 6.1 描述一个你最近完成的技术挑战项目，遇到了什么困难，如何解决的？（5 分）

**回答：**
答：最近遇到了一个复杂业务，多个场景需要共用同一个页面，如果为每一个场景编写独立的样式和业务逻辑非常复杂，
于是我通过合并场景共同业务方法，类似样式结构，决定采用抽象工厂模式实现，首先我分离数据层和视图层，将业务抽离为抽象工厂类的抽象方法，通过不同业务工厂继承抽象工厂并具体实现，成功实现多场景能力，同时由于部分数据需要多层透传，经过比对useReducer，zustand和useContext，我决定采用useContext实现上下文同步以降低复杂度。
<br><br><br><br><br><br>

---

## 面试评分表

| 评分项             | 分数     | 评语 |
| ------------------ | -------- | ---- |
| 1.1 Event Loop     | /10      |      |
| 1.2 闭包           | /10      |      |
| 1.3 var/let/const  | /10      |      |
| 2.1 React 生命周期 | /10      |      |
| 2.2 性能优化       | /10      |      |
| 3.1 盒模型         | /7       |      |
| 3.2 居中方法       | /8       |      |
| 4.1 TS 工具类型    | /10      |      |
| 5.1 编码实践       | /20      |      |
| 6.1 综合能力       | /5       |      |
| **总分**           | **/100** |      |

---

## 评分标准

### 优秀（90-100 分）

- 概念理解深刻，表达清晰
- 能给出多个实际案例
- 代码质量高，考虑边界情况
- 有自己的思考和见解

### 良好（75-89 分）

- 核心概念掌握正确
- 能给出基本示例
- 代码基本正确
- 有一定实践经验

### 及格（60-74 分）

- 基本概念了解
- 示例不够完整
- 代码有小问题
- 实践经验不足

### 不及格（<60 分）

- 概念理解错误
- 无法给出示例
- 代码有明显错误
- 缺乏实践经验

---

## 综合评价

**技术能力：**

<br><br><br>

**沟通表达：**

<br><br><br>

**学习能力：**

<br><br><br>

**问题解决能力：**

<br><br><br>

**总体评价：**

<br><br><br><br><br><br>

---

## 是否推荐录用

□ 强烈推荐（90 分以上）  
□ 推荐（75-89 分）  
□ 待定（60-74 分）  
□ 不推荐（60 分以下）

**薪资建议：** **\*\*\*\***\_\_**\*\*\*\***

**入职时间：** **\*\*\*\***\_\_**\*\*\*\***

---

**面试官签名：**\*\*\***\*\_\_**\*\*\*\*** 日期：**\*\*\*\***\_\_\*\***\*\*\*\*\*\*
