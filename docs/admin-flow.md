# Admin 页面访问流程详解

## 📋 完整流程图

```
用户访问 /admin
    ↓
【1. 路由匹配阶段】
    ↓
React Router 匹配路由
    ├─ 匹配到 /admin → AdminLayout 组件
    └─ Suspense 处理懒加载（显示 FullLoading）
    ↓
【2. AdminLayout 渲染阶段】
    ↓
AdminLayout 组件执行
    ├─ 检查 pathname === '/admin'？
    │   ├─ 是 → Navigate 重定向到 /admin/login
    │   └─ 否 → 继续
    ↓
渲染 <Outlet /> 子路由
    ↓
【3. 子路由渲染阶段】
    ├─ /admin/login → LoginPage
    └─ /admin/example → ResponsiveTest（需要登录验证）
    ↓
【4. 登录状态检查阶段】
    ↓
LoginPage 或 ProtectedRoute 使用 useAuth
    ├─ useAuth 执行
    │   ├─ 读取 localStorage 的 token
    │   ├─ 同步到 Redux（如果有 token）
    │   └─ 返回 isAuthenticated 状态
    ↓
【5. 页面渲染决策】
    ├─ 未登录 → 显示登录页
    └─ 已登录 → 显示对应页面或重定向
```

## 🔄 详细步骤说明

### 步骤 1：用户访问 /admin

```typescript
// 用户输入：http://localhost:3001/admin
```

### 步骤 2：路由系统处理

**文件：`src/main.tsx`**

```typescript
<BrowserRouter>
  <Routes>
    {/* routes.ts 配置的路由 */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="example" element={<ResponsiveTest />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**流程：**
1. React Router 匹配 `/admin` 路径
2. 找到 `AdminLayout` 组件（懒加载）
3. `Suspense` 显示 `FullLoading`（加载中）
4. `AdminLayout` 代码加载完成

---

### 步骤 3：AdminLayout 组件渲染

**文件：`src/pages/Admin/AdminLayout.tsx`**

```typescript
function AdminLayout() {
  const location = useLocation();
  
  // 如果访问 /admin，重定向到 /admin/login
  if (location.pathname === '/admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="AdminLayout">
      <Outlet /> {/* 渲染子路由 */}
    </div>
  );
}
```

**流程：**
1. 获取当前路径 `location.pathname`
2. 如果是 `/admin`，重定向到 `/admin/login`
3. 否则渲染 `<Outlet />`，显示子路由内容

---

### 步骤 4：登录页面渲染（如果是 /admin/login）

**文件：`src/pages/Admin/Login/LoginPage.tsx`**

```typescript
function LoginPage() {
  return <FormWithoutArco />; // 登录表单
}
```

**用户操作：**
1. 输入用户名和密码
2. 点击登录按钮
3. 触发 `useLogin` hook

---

### 步骤 5：登录流程

**文件：`src/pages/Admin/Login/hooks/useLogin.ts`**

```typescript
const login = async (credentials) => {
  1. 调用 loginApi(credentials) → 请求后端
  2. 后端返回：token, refreshToken, user
  3. 保存到 localStorage：
     - jwtToken
     - refreshToken
     - userInfo
  4. 同步到 Redux：
     dispatch(setCredentials({ user, token, refreshToken }))
  5. 跳转到 /admin/dashboard
}
```

**数据流向：**
```
登录 API 响应
  ↓
localStorage（持久化存储）
  ├─ jwtToken
  ├─ refreshToken
  └─ userInfo
  ↓
Redux Store（内存状态）
  ├─ isAuthenticated: true
  ├─ user: {...}
  ├─ token: "..."
  └─ refreshToken: "..."
```

---

### 步骤 6：登录状态检查（useAuth）

**文件：`src/common/hooks/useAuth.ts`**

```typescript
export function useAuth() {
  // 1. 组件挂载时自动检查
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 2. 检查流程
  const checkAuthStatus = async () => {
    // 2.1 读取 localStorage
    const token = localStorage.getItem('jwtToken');
    const userInfoStr = localStorage.getItem('userInfo');
    
    // 2.2 如果没有 token，清除状态
    if (!token) {
      dispatch(logout());
      return;
    }
    
    // 2.3 同步到 Redux
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      dispatch(setCredentials({
        user: userInfo,
        token: token,
        refreshToken: localStorage.getItem('refreshToken'),
      }));
    }
  };

  // 3. 返回状态
  return {
    isAuthenticated: auth.isAuthenticated && !!auth.token,
    user: auth.user,
    checking: false,
  };
}
```

**检查时机：**
- ✅ 组件挂载时（`useEffect`）
- ✅ 手动调用 `checkAuthStatus()`
- ✅ 页面刷新时（重新执行）

---

### 步骤 7：受保护路由（需要登录的页面）

**示例：访问 `/admin/example`**

```typescript
// 可以在 ResponsiveTest 组件中：
function ResponsiveTest() {
  const { isAuthenticated, checking } = useAuth();
  
  if (checking) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  
  return <div>受保护的内容</div>;
}
```

---

## 🎯 完整流程示例

### 场景 1：首次访问 /admin（未登录）

```
1. 用户访问 /admin
   ↓
2. React Router → AdminLayout
   ↓
3. AdminLayout 检测 pathname === '/admin'
   ↓
4. Navigate 重定向到 /admin/login
   ↓
5. 渲染 LoginPage
   ↓
6. LoginPage 使用 useAuth 检查状态
   ├─ useAuth 读取 localStorage → 没有 token
   ├─ Redux: isAuthenticated = false
   └─ 显示登录表单
```

### 场景 2：用户登录

```
1. 用户在登录表单输入账号密码
   ↓
2. 点击登录 → useLogin.login()
   ↓
3. 调用 loginApi → 请求后端
   ↓
4. 后端返回 token、user
   ↓
5. 保存到 localStorage
   ↓
6. 同步到 Redux
   ↓
7. navigate('/admin/dashboard')
   ↓
8. 跳转到管理端首页
```

### 场景 3：刷新页面（已登录状态）

```
1. 用户刷新页面（已有 token）
   ↓
2. React Router 重新匹配路由
   ↓
3. AdminLayout 渲染
   ↓
4. 子路由组件使用 useAuth
   ↓
5. useAuth.checkAuthStatus() 执行
   ├─ 读取 localStorage → 有 token
   ├─ 同步到 Redux
   └─ isAuthenticated = true
   ↓
6. 显示页面内容（不需要重新登录）
```

### 场景 4：访问受保护页面（/admin/example）

```
1. 用户访问 /admin/example
   ↓
2. React Router → AdminLayout → ResponsiveTest
   ↓
3. ResponsiveTest 使用 useAuth
   ├─ checking: false
   └─ isAuthenticated: true（已有 token）
   ↓
4. 显示 ResponsiveTest 内容
```

---

## 🔑 关键点总结

### 1. **状态存储位置**

| 位置 | 用途 | 生命周期 |
|------|------|---------|
| **localStorage** | 持久化存储 | 浏览器关闭后仍然存在 |
| **Redux Store** | 内存状态 | 页面刷新后需要重新同步 |

### 2. **状态同步时机**

- ✅ 登录成功时（useLogin）
- ✅ 页面刷新时（useAuth.checkAuthStatus）
- ✅ 组件挂载时（useAuth 的 useEffect）

### 3. **路由保护**

```typescript
// 方案 1：在组件内部判断
function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return <div>受保护内容</div>;
}

// 方案 2：创建 ProtectedRoute 组件
function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();
  if (checking) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  return children;
}
```

---

## 📝 改进建议

目前 AdminLayout 没有进行登录验证，建议添加：

```typescript
function AdminLayout() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();
  
  if (checking) return <FullLoading />;
  
  // 如果访问 /admin，重定向到登录页或首页
  if (location.pathname === '/admin') {
    return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
  }
  
  // 如果不是登录页且未登录，重定向到登录页
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="AdminLayout">
      <Outlet />
    </div>
  );
}
```

