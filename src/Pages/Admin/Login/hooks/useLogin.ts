import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginApi, LoginRequest, LoginResponse } from '../api/loginApi';
import { ApiError } from '../../../../common/utils/commonFetch';
import { setCredentials } from '../../../../common/config/redux/slices/authSlice';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 登录 Hook（完全类型安全）
// 职责：只负责登录操作，不负责状态判断
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
    const dispatch = useDispatch();

    const login = async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            // 调用登录 API（完全类型安全）
            const response: LoginResponse = await loginApi(credentials);

            // 保存到 localStorage
            localStorage.setItem('jwtToken', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            localStorage.setItem('userInfo', JSON.stringify(response.user));

            // 同步到 Redux
            dispatch(setCredentials({
                user: response.user,
                token: response.token,
                refreshToken: response.refreshToken,
            }));

            // 跳转到管理端首页
            navigate('/admin/dashboard'); // 可根据实际情况调整

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
