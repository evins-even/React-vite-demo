import "./style/LoginStyle.css"
import Forms from "./components/Forms";
function LoginPage() {

    return (
        <div className="LoginContainer">
            <div className="banner"><p>这里是登录页</p></div>
            <Forms></Forms>
        </div>
    );
}

export default LoginPage;
