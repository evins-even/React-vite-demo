import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, setCredentials } from '../config/redux/slices/authSlice';
import type { RootState } from '../config/redux';

interface UserInfo {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    token: string | null;
    refreshToken: string | null;
}

/**
 * 认证管理 Hook
 * 负责：登录状态判断、用户信息获取、token 刷新等
 */
export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 使用类型化的 RootState，确保类型安全
    const auth = useSelector((state: RootState) => state.auth);

    // 添加安全检查，防止 auth 为 undefined
    if (!auth) {
        console.error('Redux auth state is undefined. Please check your store configuration.');
    }
    const [checking, setChecking] = useState(true);

    // 检查登录状态
    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
     * 检查认证状态
     * 1. 检查 token 是否存在
     * 2. 验证 token 是否有效（可选：请求后端验证）
     * 3. 同步 Redux 状态
     */
    const checkAuthStatus = async () => {
        try {
            setChecking(true);
            const token = localStorage.getItem('jwtToken');
            const userInfoStr = localStorage.getItem('userInfo');

            if (!token) {
                dispatch(logout());
                setChecking(false);
                return;
            }

            // 如果有用户信息，先设置到 Redux
            if (userInfoStr) {
                try {
                    const userInfo = JSON.parse(userInfoStr);
                    const refreshToken = localStorage.getItem('refreshToken');
                    dispatch(setCredentials({
                        user: userInfo,
                        token: token,
                        refreshToken: refreshToken || null,
                    }));
                } catch (e) {
                    console.error('解析用户信息失败', e);
                }
            }

            // 可选：请求后端验证 token 是否有效
            // try {
            //   const userInfo = await getUserInfoApi(userId);
            //   const refreshToken = localStorage.getItem('refreshToken');
            //   dispatch(setCredentials({ 
            //     user: userInfo, 
            //     token,
            //     refreshToken: refreshToken || null,
            //   }));
            // } catch (error) {
            //   // token 无效，清除状态
            //   handleLogout();
            //   return;
            // }

            setChecking(false);
        } catch (error) {
            // token 无效，清除状态
            dispatch(logout());
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
            setChecking(false);
        }
    };

    /**
     * 登出
     */
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        navigate('/admin/login');
    };

    /**
     * 判断是否已登录
     */
    // 添加安全检查，防止 auth 为 undefined 时报错
    const isAuthenticated = auth?.isAuthenticated && !!auth?.token;

    return {
        isAuthenticated,
        user: auth?.user || null,
        token: auth?.token || null,
        checking, // 是否正在检查登录状态
        checkAuthStatus,
        logout: handleLogout,
    };
}

