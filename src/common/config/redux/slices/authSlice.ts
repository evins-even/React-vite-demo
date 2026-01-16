import { createSlice } from "@reduxjs/toolkit/react"


// 初始状态
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,        // JWT token
    refreshToken: null, // 刷新token
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken || null
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            state.token = null
            state.refreshToken = null
        }
    }
})
export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer