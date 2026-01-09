import api from "../utils/commonFetch";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 用户相关 API 类型定义
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserRequest {
    userName?: string;
    avatar?: string;
    phone?: string;
}

export interface UserListParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    sortBy?: 'createdAt' | 'userName';
    order?: 'asc' | 'desc';
}

export interface UserListResponse {
    list: User[];
    total: number;
    page: number;
    pageSize: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 用户 API 方法
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 获取用户列表（带分页和筛选）
 */
export function getUserListApi(params?: UserListParams): Promise<UserListResponse> {
    return api.get<UserListResponse>('/user/list', {
        params: params as Record<string, string | number | boolean>
    });
}

/**
 * 获取单个用户信息
 */
export function getUserApi(userId: number): Promise<User> {
    return api.get<User>(`/user/${userId}`);
}

/**
 * 更新用户信息
 */
export function updateUserApi(userId: number, data: UpdateUserRequest): Promise<User> {
    return api.put<User, UpdateUserRequest>(`/user/${userId}`, data);
}

/**
 * 删除用户
 */
export function deleteUserApi(userId: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/user/${userId}`);
}

/**
 * 批量删除用户
 */
export function batchDeleteUsersApi(userIds: number[]): Promise<{ message: string; count: number }> {
    return api.post<{ message: string; count: number }, { userIds: number[] }>(
        '/user/batch-delete',
        { userIds }
    );
}

