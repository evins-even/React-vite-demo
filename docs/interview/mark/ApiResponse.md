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
// 方案1：从函数类型中提取 Promise 的返回值
type PromiseReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

// 方案2：递归解包多层 Promise（如果需要）
type UnwrapPromise<T> =  T extends Promise<infer R> ?
  UnwrapPromise<R> :
  T extends {
    then: (onfulfilled: (args: infer A) => any) => any
  } ? A : T

// 自动推导 getUserDashboard 的返回类型
type UserDashboard = PromiseReturnType<typeof apiApi.getUserDashboard>;
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

**评分：95/100** ⭐⭐⭐⭐⭐

**评价：**
- ✅ 问题1（25/25分）：完全正确！展示了多种场景的泛型使用（单个、数组、分页）
- ✅ 问题2（25/25分）：**非常优秀！** 展示了高级的类型编程能力
  - ✅ 基础的泛型函数定义正确
  - ✅ 展示了实战场景：多个 API 调用组合并处理数据
  - ✅ 实现了 `PromiseReturnType` 从函数类型提取 Promise 返回值
  - ✅ 实现了 `UnwrapPromise` 递归解包嵌套 Promise
  - 🎉 **知道用 `ReturnType` + 自定义工具类型自动推导复杂返回值**
  - 🎉 **还知道 TypeScript 内置的 `Awaited` 类型**
- ✅ 问题3（20/25分）：回答了封装思路，简洁明了（扣5分：可以更详细）
- 🎉 **加分项**：
  - 展示了 `ReturnType`、`infer`、递归类型的综合运用
  - 考虑了复杂实战场景（多接口组合、数据处理）
  - 知道内置类型和自定义类型的对比

**优点：**
- 🎉 **TypeScript 水平非常高**：
  - 熟练使用泛型、条件类型、`infer` 关键字
  - 能实现递归类型（`UnwrapPromise`）
  - 理解 thenable 对象的类型匹配
- 🎉 **实战思维强**：
  - 考虑了复杂场景（多个 API 组合、数据转换）
  - 知道简单场景手动定义类型，复杂场景自动推导
- 🎉 **类型安全意识**：不想手动维护复杂类型，而是用工具类型推导
- 🎉 **知识广度**：知道 TypeScript 内置的 `Awaited` 类型

**小瑕疵：**
- ⚠️ 问题3可以补充更多细节（如 ApiClient 的具体实现、错误处理、拦截器等）
- ⚠️ 代码中有小的拼写错误：`reponse` 应为 `response`

**面试官视角：**
"这个候选人的 TypeScript 水平非常高！
1. ✅ 熟练使用泛型和条件类型
2. ✅ 能实现复杂的工具类型（递归解包 Promise）
3. ✅ 理解 thenable 对象的类型系统
4. ✅ 有实战经验（多接口组合、数据处理）
5. ✅ 知道内置类型和自定义实现的对比
6. ✅ 类型安全意识强（自动推导而不是手动维护）

这已经是高级/资深开发者的水平了！强烈推荐录用！"

**总结：这是一个非常优秀的回答，展示了扎实的 TypeScript 功底和丰富的实战经验！** 🎉👍