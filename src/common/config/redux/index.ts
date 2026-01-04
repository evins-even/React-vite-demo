import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import configReducer from "./slices/configSlice";
// Reducers
// 使用 configureStore 创建 store， 并将 reducer 添加到 store 中
// reducer: 纯函数，接收当前状态和动作，返回新的状态

const store = configureStore({
    reducer: {
        config: configReducer,
        Auth: authReducer,
    }
})

export default store