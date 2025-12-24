import { StrategyExecutor } from "../../../common/utils/CommonUtils";
import { LoginApi } from "../api/loginApi";

export function useLogin() {
    const LoginStrategy = new StrategyExecutor();
    // 用于校验两次密码输入是否一致
    function compare(data: { password: string; passwordAgain: string }): boolean {
        return LoginStrategy.execute("compare", data);
    }
    //登录方法：需要校验通过
    async function login(data: { email: string, password: string }): Promise<any> {
        return await LoginApi(data)
    }

    return {
        login,
        logout: () => { },
        compare,
        isLoggedIn: false,
    };
}
