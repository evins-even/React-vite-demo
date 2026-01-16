import React, { useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { ConfigProvider } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './common/config/redux';
import useStorage from './common/hooks/useStorage';
import { GlobalContext } from './common/config/context';
import './common/config/globalFontSize';
import './common/styles/global.less';
import { convertRoutesToRouteObjects, routes } from './routes/routes';
import { LoadingProvider } from './common/components/LoadingContext';
import FullLoading from './common/components/FullLoading';

// 递归渲染嵌套路由
export const renderRoutes = (routeObjects: ReturnType<typeof convertRoutesToRouteObjects>) => {
  return routeObjects.map((route, index) => (
    <Route key={route.path || index} path={route.path} element={route.element}>
      {route.children && route.children.length > 0 && renderRoutes(route.children)}
    </Route>
  ));
};

function Index() {
  // 从持久化中获取 语言选项
  const [lang, setLang] = useStorage("arco-lang", "en-US");
  const [theme, setTheme] = useStorage("arco-theme", "light");
  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };
  React.useEffect(() => {
    document.body.setAttribute("data-theme", theme ?? "light");
  }, [theme]);
  // 根据语言选项选择语言包
  const getArcoLocale = () => {
    switch (lang) {
      case "en-US":
        return enUS;
      case "zh-CN":
        return zhCN;
      default:
        return zhCN;
    }
  };
  // 默认路由：访问根路径时显示博客主页（已在路由配置中设置）
  // 管理端只能通过 /admin 路径访问
  return (
    /* router-dom 路由组件最外层包裹组件 */
    <BrowserRouter>
      {/* 配置组件 提供框架剩余组件语言包的选择 */}
      <ConfigProvider locale={getArcoLocale()}>
        <React.StrictMode>
          {/*  redux store  提供全局状态管理 */}
          <Provider store={store}>
            {/* 配置组件 提供全局个性化设置管理 */}
            <GlobalContext.Provider value={contextValue}>
              <LoadingProvider>
                <Suspense fallback={<FullLoading />}>
                  <Routes>
                    {renderRoutes(convertRoutesToRouteObjects(routes))}
                  </Routes>
                </Suspense>
              </LoadingProvider>
            </GlobalContext.Provider>
          </Provider>
        </React.StrictMode>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
if (container) {
  ReactDOM.createRoot(container).render(<Index />);
} else {
  throw new Error("no root element")
}

