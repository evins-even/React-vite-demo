import { StrategyExecutor } from "../../common/utils/CommonUtils";
import { loginModel } from "../model/model";

export function useLogin(prop: loginModel) {
  const LoginStrategy = new StrategyExecutor();
  // 用于校验两次密码输入是否一致
  function compare(data: { password: string; passwordAgain: string }): boolean {
    return LoginStrategy.execute("compare", data);
  }
  //登录方法：需要校验通过
  function login(data: { username: string; password: string }) {}

  return {
    login: () => {},
    logout: () => {},
    compare,
    isLoggedIn: false,
  };
}
