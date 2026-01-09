# API 调用最佳实践

基于我们的 `FetchInterceptor` 和泛型系统的最佳实践指南。

## 📋 目录

1. [基础用法](#基础用法)
2. [类型安全](#类型安全)
3. [错误处理](#错误处理)
4. [性能优化](#性能优化)
5. [高级技巧](#高级技巧)

---

## 基础用法

### ✅ 推荐：定义清晰的类型

```typescript
// 1. 定义请求参数类型
interface LoginRequest {
    email: string;
    password: string;
}

// 2. 定义响应数据类型
interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
    };
}

// 3. 类型安全的 API 调用
export function loginApi(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse, LoginRequest>('/auth/login', data);
}
```

### ❌ 不推荐：使用 any

```typescript
// ❌ 不好：没有类型提示
export function loginApi(data: any): Promise<any> {
    return api.post('/auth/login', data);
}
```

---

## 类型安全

### 1. 泛型参数的正确使用

```typescript
// ✅ 完整的泛型参数
api.post<ResponseType, RequestType>(url, data, config);

// 示例
interface User {
    id: number;
    name: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
}

// ✅ TypeScript 会检查 data 的类型
const user = await api.post<User, CreateUserRequest>(
    '/user',
    {
        name: 'test',
        email: 'test@example.com'
    }
);

// ❌ TypeScript 错误：缺少 email 字段
const user = await api.post<User, CreateUserRequest>(
    '/user',
    { name: 'test' }  // 类型错误
);
```

### 2. 响应数据类型推断

```typescript
// ✅ 自动推断返回类型
const getUserApi = (id: number): Promise<User> => {
    return api.get<User>(`/user/${id}`);
};

// 使用时自动推断
const user = await getUserApi(1);
console.log(user.name);  // ✅ TypeScript 知道 user 有 name 属性
```

### 3. 可选字段的处理

```typescript
interface UpdateUserRequest {
    name?: string;
    email?: string;
    avatar?: string;
}

// ✅ 所有字段都是可选的
await api.put<User, UpdateUserRequest>('/user/1', {
    name: 'new name'  // 只更新 name
});

await api.put<User, UpdateUserRequest>('/user/1', {
    name: 'new name',
    email: 'new@email.com'  // 更新多个字段
});
```

---

## 错误处理

### 1. 使用 ApiError 类型

```typescript
import { ApiError } from '@/common/utils/commonFetch';

try {
    const user = await getUserApi(1);
} catch (err) {
    // ✅ 类型安全的错误处理
    if (err instanceof ApiError) {
        console.error('业务错误:', err.code, err.message);
        
        switch (err.code) {
            case 401:
                // 跳转登录
                break;
            case 403:
                // 显示权限错误
                break;
            case 404:
                // 显示不存在
                break;
        }
    } else if (err instanceof Error) {
        console.error('网络错误:', err.message);
    }
}
```

### 2. 全局错误处理

```typescript
// commonFetch.ts 中已经配置了全局错误拦截器
// 会自动处理 401、403、404、500 等常见错误
// 你只需要在组件中处理特定的业务逻辑
```

### 3. 自定义错误处理

```typescript
try {
    const user = await getUserApi(999);
} catch (err) {
    if (err instanceof ApiError && err.code === 404) {
        // 特殊处理：用户不存在
        console.log('用户不存在，创建默认用户');
        return createDefaultUser();
    }
    throw err;  // 其他错误继续抛出
}
```

---

## 性能优化

### 1. 请求去重

```typescript
// 防止短时间内重复请求
class RequestDeduplicator {
    private pending = new Map<string, Promise<any>>();

    async request<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        if (this.pending.has(key)) {
            return this.pending.get(key)!;
        }

        const promise = fetcher().finally(() => {
            this.pending.delete(key);
        });

        this.pending.set(key, promise);
        return promise;
    }
}

// 使用
const deduplicator = new RequestDeduplicator();

// 即使快速点击多次，也只会发送一个请求
const result = await deduplicator.request(
    'user-1',
    () => getUserApi(1)
);
```

### 2. 请求缓存

```typescript
// 缓存不经常变化的数据
class RequestCache {
    private cache = new Map<string, { data: any; timestamp: number }>();

    async request<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = 60000
    ): Promise<T> {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.data;
        }

        const data = await fetcher();
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
    }
}

// 使用
const cache = new RequestCache();

// 60秒内重复请求会使用缓存
const config = await cache.request(
    'app-config',
    () => api.get('/config'),
    60000
);
```

### 3. 并发控制

```typescript
// 限制同时请求数量
class ConcurrencyController {
    private running = 0;

    constructor(private max: number = 3) {}

    async add<T>(fetcher: () => Promise<T>): Promise<T> {
        while (this.running >= this.max) {
            await new Promise(r => setTimeout(r, 100));
        }

        this.running++;
        try {
            return await fetcher();
        } finally {
            this.running--;
        }
    }
}

// 使用：批量请求时限制并发
const controller = new ConcurrencyController(3);

const userIds = [1, 2, 3, ..., 100];
const promises = userIds.map(id =>
    controller.add(() => getUserApi(id))
);

const users = await Promise.all(promises);
```

---

## 高级技巧

### 1. 通用分页请求

```typescript
interface PaginatedResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

async function fetchPaginated<T>(
    endpoint: string,
    page: number,
    pageSize: number
): Promise<PaginatedResponse<T>> {
    return api.get<PaginatedResponse<T>>(endpoint, {
        params: { page, pageSize }
    });
}

// 使用
const products = await fetchPaginated<Product>('/product/list', 1, 10);
const orders = await fetchPaginated<Order>('/order/list', 1, 20);
```

### 2. 请求重试（指数退避）

```typescript
async function requestWithRetry<T>(
    fetcher: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> {
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fetcher();
        } catch (err) {
            if (i === maxRetries) throw err;
            
            const delay = 1000 * Math.pow(2, i);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error('Should not reach here');
}

// 使用
const result = await requestWithRetry(
    () => api.get('/unstable-api'),
    3
);
```

### 3. 请求取消

```typescript
function useCancelableRequest() {
    const [controller, setController] = useState<AbortController | null>(null);

    const request = async <T,>(fetcher: () => Promise<T>) => {
        // 取消之前的请求
        controller?.abort();

        const newController = new AbortController();
        setController(newController);

        try {
            return await fetcher();
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('请求已取消');
            }
            throw err;
        }
    };

    const cancel = () => {
        controller?.abort();
        setController(null);
    };

    return { request, cancel };
}

// 使用
const { request, cancel } = useCancelableRequest();

// 开始请求
request(() => api.get('/api/data'));

// 取消请求
cancel();
```

### 4. 自定义 Hook 封装

```typescript
interface UseApiOptions<T> {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}

function useApi<T>(
    fetcher: () => Promise<T>,
    options: UseApiOptions<T> = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetcher();
            setData(result);
            options.onSuccess?.(result);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : '请求失败';
            setError(message);
            options.onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => {
        if (options.immediate) {
            execute();
        }
    }, []);

    return { data, loading, error, execute };
}

// 使用
function UserProfile({ userId }: { userId: number }) {
    const { data: user, loading, error, execute } = useApi(
        () => getUserApi(userId),
        {
            immediate: true,
            onSuccess: (user) => {
                console.log('用户加载成功:', user.name);
            },
            onError: (err) => {
                console.error('加载失败:', err);
            }
        }
    );

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    if (!user) return null;

    return (
        <div>
            <h2>{user.name}</h2>
            <button onClick={execute}>刷新</button>
        </div>
    );
}
```

---

## 📝 总结

### 核心原则

1. **类型安全第一**：始终定义清晰的类型
2. **错误处理完善**：使用 ApiError 进行类型安全的错误处理
3. **性能优化**：合理使用缓存、去重、并发控制
4. **代码复用**：封装通用的 Hook 和工具函数

### 检查清单

- [ ] 是否定义了请求和响应的类型？
- [ ] 是否处理了可能的错误情况？
- [ ] 是否考虑了性能优化（缓存、去重）？
- [ ] 是否可以复用（封装成 Hook）？
- [ ] 是否有适当的 loading 和 error 状态？

### 参考资料

- [FetchInterceptor 源码](../src/common/api/FetchInterceptor.ts)
- [commonFetch 配置](../src/common/utils/commonFetch.ts)
- [使用示例](../src/examples/ApiUsageExample.tsx)
- [高级用法](../src/examples/AdvancedApiUsage.tsx)

