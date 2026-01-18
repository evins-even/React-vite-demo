import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import configReducer from "./slices/configSlice";
// Reducers
// 使用 configureStore 创建 store， 并将 reducer 添加到 store 中
// reducer: 纯函数，接收当前状态和动作，返回新的状态

const store = configureStore({
    reducer: {
        config: configReducer,
        auth: authReducer, // 修复：改为小写 auth，与 useAuth.ts 中的访问保持一致
    }
})

// 导出类型，方便在其他地方使用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store