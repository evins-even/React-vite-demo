import React from "react";
import ReactDOM from "react-dom/client";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { ConfigProvider } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./src/common/config/redux";
import useStorage from "./src/common/hooks/useStorage";
import { GlobalContext } from "./src/common/config/context";
import "./src/common/config/globalFontSize";
import "./src/common/styles/global.less";
import LoginPage from "./src/pages/Login/LoginPage";
import ResponsiveTest from "./src/pages/ResponsiveTest/ResponsiveTest";
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
  // 设置默认路由
  useEffect(() => {
    // TODO:判断用户是否登录
    console.log("window.location.pathname", window.location.pathname, window.location.pathname.slice(1));
    if (window.location.pathname.slice(1) !== 'login') window.location.pathname = "/login";
  }, []);
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
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/example" element={<ResponsiveTest />} />
              </Routes>
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

