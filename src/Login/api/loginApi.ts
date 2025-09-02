import comFetch from "../../common/utils/commonFetch";
export function LoginApi(data: { email: string, password: string }) {
    comFetch.post("/auth/LoginAuther", data, { params: data })
}   