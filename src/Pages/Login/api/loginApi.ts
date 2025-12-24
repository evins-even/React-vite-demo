import comFetch from "../../../common/utils/commonFetch";
export function LoginApi(data: { email: string, password: string }): Promise<any> {
    return comFetch.post("/auth/LoginAuther", data);
}   