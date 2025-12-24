import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import zhCN from "@arco-design/web-react/es/locale/zh-CN";
import enUS from "@arco-design/web-react/es/locale/en-US";
import { ConfigProvider } from "@arco-design/web-react";
import "@arco-design/web-react/dist/css/arco.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./common/Global/redux";
import useStorage from "./common/Hooks/useStorage";
import { GlobalContext } from "./common/Global/context";
import "./common/Global/globalFontSize";
import "./global.less";
import LoginPage from "./Pages/Login/LoginPage";
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
    document.body.setAttribute("data-theme", theme);
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
                <Route path="/" element={<App />} />
              </Routes>
            </GlobalContext.Provider>
          </Provider>
        </React.StrictMode>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Index />);
