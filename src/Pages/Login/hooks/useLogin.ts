import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, LoginRequest, LoginResponse } from '../api/loginApi';
import { ApiError } from '../../../common/utils/commonFetch';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 登录 Hook（完全类型安全）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UseLoginReturn {
    loading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            // 调用登录 API（完全类型安全）
            const response: LoginResponse = await loginApi(credentials);

            // 保存 token
            localStorage.setItem('jwtToken', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            // 保存用户信息
            localStorage.setItem('userInfo', JSON.stringify(response.user));

            // 跳转到首页
            navigate('/home');

        } catch (err) {
            // 类型安全的错误处理
            if (err instanceof ApiError) {
                setError(err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('登录失败，请稍后重试');
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, login };
}
