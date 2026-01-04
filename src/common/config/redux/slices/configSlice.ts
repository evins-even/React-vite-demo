import { createSlice, createStore } from "@reduxjs/toolkit/react";

interface ConfigState {
    settings?: {
        color: string;
        menu: boolean;
    };
    userInfo?: {
        name?: string;
        avatar?: string;
        job?: string;
        organization?: string;
        location?: string;
        email?: string;
        permissions: Record<string, string[]>;
    };
}

const initialState: ConfigState = { settings: { color: "blue", menu: true } };

export const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setSettings: (state: ConfigState = initialState, action) => {
            const { settings } = action.payload;
            if (settings) {
                state.settings = { ...state.settings, ...settings };
            }
        },
        setUserInfo: (state: ConfigState = initialState, action) => {
            const { userInfo } = action.payload;
            if (userInfo) {
                state.userInfo = { ...state.userInfo, ...userInfo };
            }
        },
    },
});
function reducer(state, action) {
    console.log('reducer', state, action);
    return state;
}

const store = createStore(reducer);
console.log(store)


export const { setSettings, setUserInfo } = configSlice.actions;
export default configSlice.reducer;