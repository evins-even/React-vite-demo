import React, { ComponentType, LazyExoticComponent, lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import deepClone from 'lodash/cloneDeep';

export type RouteType = {
    name: string;
    key: string;
    path?: string;
    breadcrumb?: boolean;
    children?: RouteType[];
    component?: LazyExoticComponent<ComponentType<any>>;
};

// 懒加载组件
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const AdminLayout = lazy(() => import('../pages/Admin/AdminLayout'));
const LoginPage = lazy(() => import('../pages/Admin/Login/LoginPage'));
const ResponsiveTest = lazy(() => import('../pages/ResponsiveTest/ResponsiveTest'));

// 路由配置
export const routes: RouteType[] = [
    {
        name: '博客主页',
        key: 'home',
        path: '/',
        component: HomePage,
    },
    {
        name: '管理端',
        key: 'admin',
        path: '/admin',
        component: AdminLayout,
        children: [
            {
                name: '登录',
                key: 'login',
                path: 'login', // /admin/login
                component: LoginPage,
            },
            {
                name: '示例',
                key: 'example',
                path: 'example', // /admin/example
                component: ResponsiveTest,
            },
            // 可以继续添加其他管理端页面
            // {
            //     name: '首页',
            //     key: 'dashboard',
            //     path: 'dashboard', // /admin/dashboard
            //     component: Dashboard,
            // },
        ]
    },
];

// 将 RouteType[] 转换为 React Router 的 RouteObject[]
export const convertRoutesToRouteObjects = (routes: RouteType[]): RouteObject[] => {
    return routes.map((route) => {
        const routeObject: RouteObject = {
            path: route.path || route.key,
            element: route.component ? React.createElement(route.component) : undefined,
        };

        if (route.children && route.children.length > 0) {
            routeObject.children = convertRoutesToRouteObjects(route.children);
        }

        return routeObject;
    });
};

// 获取所有路由路径（用于权限控制等）
export const getAllRoutePaths = (routes: RouteType[]): string[] => {
    const paths: string[] = [];
    routes.forEach((route) => {
        if (route.path) {
            paths.push(route.path);
        }
        if (route.children) {
            paths.push(...getAllRoutePaths(route.children));
        }
    });
    return paths;
};

// Hook：获取路由配置
export const useRoutes = () => {
    return deepClone(routes);
};