# React + TypeScript 学习文档

> 完整知识点梳理 + 最佳实践 + 代码示例

---

## 目录

1. [React 核心概念](#一react-核心概念)
2. [React Hooks 深入](#二react-hooks-深入)
3. [React 性能优化](#三react-性能优化)
4. [React 状态管理](#四react-状态管理)
5. [TypeScript 基础](#五typescript-基础)
6. [TypeScript 高级类型](#六typescript-高级类型)
7. [React + TypeScript 实战](#七react--typescript-实战)

---

## 一、React 核心概念

### 1.1 React 生命周期

#### 类组件生命周期

**三个阶段：**

1. **挂载阶段（Mounting）**
   - `constructor()` - 初始化 state，绑定方法
   - `static getDerivedStateFromProps()` - 从 props 派生 state
   - `render()` - 返回 JSX
   - `componentDidMount()` - DOM 挂载后，数据请求、订阅

2. **更新阶段（Updating）**
   - `static getDerivedStateFromProps()`
   - `shouldComponentUpdate()` - 性能优化，返回 false 阻止渲染
   - `render()`
   - `getSnapshotBeforeUpdate()` - 更新前获取 DOM 快照
   - `componentDidUpdate()` - 更新完成，DOM 操作

3. **卸载阶段（Unmounting）**
   - `componentWillUnmount()` - 清理定时器、取消订阅

**示例：**

```typescript
class UserProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    // 数据请求
    fetchUser(this.props.userId).then(user => {
      this.setState({ user });
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // 性能优化
    return this.props.userId !== nextProps.userId;
  }

  componentWillUnmount() {
    // 清理
    this.cancelRequest();
  }

  render() {
    return <div>{this.state.user?.name}</div>;
  }
}
```

---

#### Hooks 模拟生命周期

```typescript
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);

  // componentDidMount + componentDidUpdate
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // componentDidMount（仅挂载时）
  useEffect(() => {
    console.log('组件挂载');
  }, []);

  // componentWillUnmount（卸载时）
  useEffect(() => {
    return () => {
      console.log('组件卸载');
    };
  }, []);

  // componentDidUpdate（排除首次）
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    console.log('组件更新');
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

---

### 1.2 虚拟 DOM 和 Diff 算法

**虚拟 DOM：**
- JavaScript 对象表示真实 DOM 树
- 更新时先对比虚拟 DOM，找出最小差异
- 批量更新真实 DOM，减少重排重绘

**Diff 算法优化策略：**

1. **同层比较**：只比较同层节点，不跨层
2. **类型比较**：不同类型直接替换
3. **Key 优化**：使用 key 复用节点

```typescript
// ❌ 错误：使用 index 作为 key
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ✅ 正确：使用唯一 ID
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

**为什么需要 key？**

```typescript
// 没有 key：删除第一个元素时，React 会更新所有元素
[A, B, C] → [B, C]  // 更新 3 次

// 有 key：React 只删除 A
[{id:1,A}, {id:2,B}, {id:3,C}] → [{id:2,B}, {id:3,C}]  // 删除 1 次
```

---

### 1.3 受控组件 vs 非受控组件

#### 受控组件（推荐）

```typescript
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**优点：**
- 数据单一来源
- 易于验证和处理
- 与 React 状态同步

---

#### 非受控组件

```typescript
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return <input ref={inputRef} defaultValue="hello" />;
}
```

**使用场景：**
- 文件上传
- 与第三方库集成
- 简单表单

---

## 二、React Hooks 深入

### 2.1 useState

```typescript
// 基础用法
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// 函数式更新（避免闭包陷阱）
setCount(prev => prev + 1);

// 惰性初始化（只在首次渲染计算）
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation();
  return initialState;
});
```

---

### 2.2 useEffect

```typescript
// 1. 每次渲染后执行
useEffect(() => {
  console.log('每次渲染');
});

// 2. 仅挂载时执行
useEffect(() => {
  console.log('挂载');
}, []);

// 3. 依赖变化时执行
useEffect(() => {
  fetchData(userId);
}, [userId]);

// 4. 清理副作用
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // cleanup
}, []);
```

**闭包陷阱：**

```typescript
// ❌ 错误：count 永远是 0
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // 闭包捕获初始的 count = 0
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 空依赖

  return <div>{count}</div>;
}

// ✅ 正确：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

---

### 2.3 useRef

**三大用途：**

1. **访问 DOM**

```typescript
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  return <input ref={inputRef} />;
}
```

2. **保存可变值（不触发重渲染）**

```typescript
function Timer() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    timerRef.current = setInterval(() => {}, 1000);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return <button onClick={start}>Start</button>;
}
```

3. **保存上一次的值**

```typescript
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// 使用
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

---

### 2.4 useContext

```typescript
// 1. 创建 Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider 组件
function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. 消费 Context
function Button() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return (
    <button className={context.theme}>
      {context.theme}
    </button>
  );
}

// 4. 自定义 Hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

---

### 2.5 useReducer

```typescript
// 定义类型
type State = { count: number; loading: boolean };

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer 函数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// 使用
function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    loading: false,
  });

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}
```

**何时使用 useReducer：**
- 复杂状态逻辑
- 多个子值的状态对象
- 下一个 state 依赖前一个 state

---

### 2.6 自定义 Hooks

#### useDebounce

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {    
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 使用
function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // 只在防抖后触发搜索
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

---

#### useLocalStorage

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// 使用
const [user, setUser] = useLocalStorage<User>('user', null);
```

---

#### useFetch

```typescript
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// 使用
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data?.name}</div>;
}
```

---

## 三、React 性能优化

### 3.1 React.memo

```typescript
// 包装组件，浅比较 props
const MemoizedComponent = React.memo(function UserCard({ user }: { user: User }) {
  console.log('渲染 UserCard');
  return <div>{user.name}</div>;
});

// 自定义比较函数
const MemoizedComponent = React.memo(
  UserCard,
  (prevProps, nextProps) => {
    // 返回 true = 不重渲染，false = 重渲染
    return prevProps.user.id === nextProps.user.id;
  }
);
```

**使用场景：**
- 纯展示组件
- props 不常变化
- 渲染成本高

---

### 3.2 useMemo

```typescript
function ExpensiveComponent({ items }: { items: Item[] }) {
  // ❌ 每次渲染都计算
  const total = items.reduce((sum, item) => sum + item.price, 0);

  // ✅ 只在 items 变化时计算
  const total = useMemo(() => {
    console.log('计算 total');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <div>Total: {total}</div>;
}
```

**使用场景：**
- 昂贵的计算
- 派生状态
- 避免子组件不必要的重渲染

---

### 3.3 useCallback

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染创建新函数
  const handleClick = () => {
    console.log('clicked');
  };

  // ✅ 缓存函数引用
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // 依赖为空，函数永不变化

  return <MemoizedChild onClick={handleClick} />;
}

const MemoizedChild = React.memo(function Child({ onClick }: { onClick: () => void }) {
  console.log('Child 渲染');
  return <button onClick={onClick}>Click</button>;
});
```

**使用场景：**
- 传递给子组件的回调函数
- 与 React.memo 配合使用
- 依赖项中需要稳定的函数引用

---

### 3.4 代码分割（Code Splitting）

```typescript
// 1. 路由级别分割
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  );
}

// 2. 组件级别分割
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function Page() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(true)}>Show Heavy Component</button>
      {show && (
        <Suspense fallback={<Spinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

---

### 3.5 虚拟滚动（Virtual Scrolling）

```typescript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

### 3.6 性能监控

```typescript
// 使用 React Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Page />
    </Profiler>
  );
}
```

---

## 四、React 状态管理

### 4.1 状态管理方案对比

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| useState + props | 简单组件 | 简单直接 | props 层层传递 |
| Context | 中小型应用 | 内置，无需三方库 | 性能问题 |
| Redux | 大型应用 | 生态完善，可预测 | 样板代码多 |
| Zustand | 中型应用 | 简单，性能好 | 生态较小 |
| Jotai | 原子化状态 | 灵活，性能好 | 学习成本 |
| Recoil | 复杂状态依赖 | 强大，React 官方推荐 | 实验性 |

---

### 4.2 Redux Toolkit

```typescript
// 1. 定义 Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
}

interface UserState {
  users: User[];
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

export const { setLoading, addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

// 2. 配置 Store
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. 类型化的 Hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 4. 使用
function UserList() {
  const users = useAppSelector(state => state.user.users);
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addUser({ id: '1', name: 'John' }));
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={handleAdd}>Add User</button>
    </div>
  );
}
```

---

### 4.3 Zustand

```typescript
import create from 'zustand';

interface UserStore {
  users: User[];
  loading: boolean;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  fetchUsers: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  
  removeUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id),
  })),
  
  fetchUsers: async () => {
    set({ loading: true });
    const users = await fetchUsersAPI();
    set({ users, loading: false });
  },
}));

// 使用
function UserList() {
  const users = useUserStore(state => state.users);
  const addUser = useUserStore(state => state.addUser);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={() => addUser({ id: '1', name: 'John' })}>
        Add User
      </button>
    </div>
  );
}
```

---

## 五、TypeScript 基础

### 5.1 基本类型

```typescript
// 基础类型
let isDone: boolean = false;
let count: number = 10;
let name: string = 'John';
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ['hello', 10];

// 枚举
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;

// Any 和 Unknown
let notSure: any = 4;
let unknown: unknown = 4;

// Void、Null、Undefined
function warnUser(): void {
  console.log('warning');
}

// Never（永不返回）
function error(message: string): never {
  throw new Error(message);
}
```

---

### 5.2 接口（Interface）

```typescript
// 基础接口
interface User {
  id: string;
  name: string;
  age?: number; // 可选属性
  readonly email: string; // 只读属性
}

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = (src, sub) => {
  return src.includes(sub);
};

// 可索引类型
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ['Bob', 'Fred'];

// 类接口
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}

// 接口继承
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

const square: Square = {
  color: 'blue',
  sideLength: 10,
};
```

---

### 5.3 类型别名（Type）

```typescript
// 基础类型别名
type ID = string | number;
type Point = { x: number; y: number };

// 联合类型
type Status = 'pending' | 'success' | 'error';

// 交叉类型
type Person = { name: string };
type Employee = { company: string };
type Worker = Person & Employee;

const worker: Worker = {
  name: 'John',
  company: 'ABC',
};

// 函数类型
type Callback = (data: string) => void;
```

---

### 5.4 泛型（Generics）

```typescript
// 基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

const output = identity<string>('hello');

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 使用多个类型参数
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// 泛型默认类型
interface Container<T = string> {
  value: T;
}
```

---

## 六、TypeScript 高级类型

### 6.1 工具类型

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// 1. Partial - 所有属性可选
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; age?: number; }

// 2. Required - 所有属性必填
type RequiredUser = Required<PartialUser>;
// { id: string; name: string; email: string; age: number; }

// 3. Pick - 选择属性
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string; }

// 4. Omit - 排除属性
type UserWithoutEmail = Omit<User, 'email'>;
// { id: string; name: string; age: number; }

// 5. Record - 创建键值对类型
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }

// 6. Readonly - 只读
type ReadonlyUser = Readonly<User>;

// 7. ReturnType - 获取函数返回类型
function getUser() {
  return { id: '1', name: 'John' };
}
type UserType = ReturnType<typeof getUser>;

// 8. Parameters - 获取函数参数类型
function createUser(name: string, age: number) {}
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 9. Exclude - 从联合类型中排除
type T = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'

// 10. Extract - 从联合类型中提取
type T2 = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // 'a'

// 11. NonNullable - 排除 null 和 undefined
type T3 = NonNullable<string | number | undefined>; // string | number
```

---

### 6.2 条件类型

```typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false

// 实用条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // string[] | number[]

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Result = UnpackPromise<Promise<string>>; // string
```

---

### 6.3 映射类型

```typescript
// 基础映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 自定义映射类型
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }

// 条件映射类型
type StringPropertiesOnly<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};
```

---

## 七、React + TypeScript 实战

### 7.1 组件类型定义

```typescript
// 函数组件
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled, children }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
      {children}
    </button>
  );
};

// 或者更简洁（推荐）
function Button({ text, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{text}</button>;
}

// 泛型组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// 使用
<List<User>
  items={users}
  renderItem={(user) => <div>{user.name}</div>}
/>
```

---

### 7.2 事件处理类型

```typescript
function Form() {
  // 输入事件
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // 点击事件
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked');
  };

  // 表单提交
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

---

### 7.3 Ref 类型

```typescript
function TextInput() {
  // DOM 元素 ref
  const inputRef = useRef<HTMLInputElement>(null);

  // 可变值 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 自定义组件 ref
  const childRef = useRef<ChildHandle>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}

// 转发 ref
interface ChildProps {
  value: string;
}

const Child = forwardRef<HTMLInputElement, ChildProps>((props, ref) => {
  return <input ref={ref} value={props.value} />;
});

// 使用 useImperativeHandle
interface ChildHandle {
  focus: () => void;
  getValue: () => string;
}

const Child = forwardRef<ChildHandle, ChildProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    getValue: () => {
      return inputRef.current?.value || '';
    },
  }));

  return <input ref={inputRef} />;
});
```

---

### 7.4 Context 类型

```typescript
// 定义 Context 类型
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const user = await loginAPI(email, password);
    setUser(user);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 使用
function LoginButton() {
  const { user, login, logout } = useAuth();

  return (
    <button onClick={user ? logout : () => login('', '')}>
      {user ? 'Logout' : 'Login'}
    </button>
  );
}
```

---

### 7.5 高阶组件（HOC）类型

```typescript
// HOC 类型定义
function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { loading: boolean }> {
  return function WithLoadingComponent({ loading, ...props }: P & { loading: boolean }) {
    if (loading) return <div>Loading...</div>;
    return <Component {...(props as P)} />;
  };
}

// 使用
interface UserListProps {
  users: User[];
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

const UserListWithLoading = withLoading(UserList);

// 使用
<UserListWithLoading users={users} loading={loading} />
```

---

### 7.6 完整示例：Todo App

```typescript
// types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';

// TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

// TodoList.tsx
interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, filter, onToggle, onDelete }) => {
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div>
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// App.tsx
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };
    setTodos(prev => [...prev, newTodo]);
    setInputValue('');
  };

  const handleToggle = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      <h1>Todo App</h1>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd}>Add</button>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <TodoList
        todos={todos}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

---

## 总结

### React 核心知识点
- ✅ 生命周期和 Hooks
- ✅ 虚拟 DOM 和 Diff 算法
- ✅ 性能优化（memo、useMemo、useCallback）
- ✅ 状态管理（Redux、Zustand）
- ✅ 代码分割和懒加载

### TypeScript 核心知识点
- ✅ 基本类型和高级类型
- ✅ 泛型和工具类型
- ✅ 条件类型和映射类型
- ✅ React 组件类型定义

### 最佳实践
1. 优先使用函数组件和 Hooks
2. 合理使用 memo 和 useMemo 优化性能
3. 自定义 Hooks 复用逻辑
4. TypeScript 类型定义完整
5. 代码分割减少首屏加载

---

**学习建议：**
1. 多写项目，实践中学习
2. 阅读优秀开源项目源码
3. 关注 React 和 TypeScript 官方文档更新
4. 参与社区讨论和代码审查

**持续学习！** 🚀

