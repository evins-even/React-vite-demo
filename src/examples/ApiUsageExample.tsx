import { useState, useEffect } from 'react';
import { getUserListApi, getUserApi, updateUserApi, User, UserListParams } from '../common/api/userApi';
import { ApiError } from '../common/utils/commonFetch';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例1：获取用户列表（带类型安全）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function UserListExample() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // ✅ 完全类型安全的调用
            const params: UserListParams = {
                page: 1,
                pageSize: 10,
                keyword: 'test',
                sortBy: 'createdAt',
                order: 'desc'
            };

            const response = await getUserListApi(params);
            
            // ✅ response 自动推断为 UserListResponse 类型
            setUsers(response.list);
            console.log('总数:', response.total);

        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
                console.error('业务错误:', err.code, err.message);
            } else {
                setError('获取用户列表失败');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;

    return (
        <div>
            <h2>用户列表</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {/* ✅ TypeScript 自动提示 user 的所有属性 */}
                        {user.userName} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例2：获取单个用户（带错误处理）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function UserDetailExample({ userId }: { userId: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // ✅ 返回值自动推断为 User 类型
                const userData = await getUserApi(userId);
                setUser(userData);
            } catch (err) {
                if (err instanceof ApiError) {
                    if (err.code === 404) {
                        console.error('用户不存在');
                    } else if (err.code === 403) {
                        console.error('没有权限查看该用户');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div>加载中...</div>;
    if (!user) return <div>用户不存在</div>;

    return (
        <div>
            <h2>用户详情</h2>
            <p>用户名: {user.userName}</p>
            <p>邮箱: {user.email}</p>
            {user.avatar && <img src={user.avatar} alt="头像" />}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例3：更新用户（带类型检查）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function UpdateUserExample({ userId }: { userId: number }) {
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            // ✅ TypeScript 会检查参数类型
            const updatedUser = await updateUserApi(userId, {
                userName,
                // phone: '123456789', // 可选字段
            });

            console.log('更新成功:', updatedUser);
            alert('更新成功！');

        } catch (err) {
            if (err instanceof ApiError) {
                alert(`更新失败: ${err.message}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="新用户名"
            />
            <button type="submit" disabled={submitting}>
                {submitting ? '提交中...' : '更新'}
            </button>
        </form>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例4：自定义 Hook（可复用）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UseUserReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useUser(userId: number): UseUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);
            const userData = await getUserApi(userId);
            setUser(userData);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('获取用户信息失败');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return { user, loading, error, refetch: fetchUser };
}

// 使用自定义 Hook
export function UserProfileExample({ userId }: { userId: number }) {
    const { user, loading, error, refetch } = useUser(userId);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    if (!user) return <div>用户不存在</div>;

    return (
        <div>
            <h2>{user.userName}</h2>
            <p>{user.email}</p>
            <button onClick={refetch}>刷新</button>
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例5：并发请求（Promise.all）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function BatchFetchExample() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchMultipleUsers = async () => {
            try {
                // ✅ 并发请求多个用户
                const userIds = [1, 2, 3, 4, 5];
                const promises = userIds.map(id => getUserApi(id));
                
                // ✅ TypeScript 自动推断为 User[]
                const usersData = await Promise.all(promises);
                setUsers(usersData);

            } catch (err) {
                console.error('批量获取失败:', err);
            }
        };

        fetchMultipleUsers();
    }, []);

    return (
        <div>
            <h2>批量获取用户</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.userName}</li>
                ))}
            </ul>
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 示例6：错误处理最佳实践
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ErrorHandlingExample() {
    const handleRequest = async () => {
        try {
            const user = await getUserApi(999);
            console.log(user);
        } catch (err) {
            // ✅ 类型安全的错误处理
            if (err instanceof ApiError) {
                switch (err.code) {
                    case 401:
                        console.error('未登录，跳转到登录页');
                        // window.location.href = '/login';
                        break;
                    case 403:
                        console.error('没有权限');
                        break;
                    case 404:
                        console.error('用户不存在');
                        break;
                    case 500:
                        console.error('服务器错误');
                        break;
                    default:
                        console.error('业务错误:', err.message);
                }
            } else if (err instanceof Error) {
                if (err.name === 'TimeoutError') {
                    console.error('请求超时');
                } else {
                    console.error('网络错误:', err.message);
                }
            } else {
                console.error('未知错误');
            }
        }
    };

    return (
        <button onClick={handleRequest}>
            测试错误处理
        </button>
    );
}

