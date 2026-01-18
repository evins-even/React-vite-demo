import FormWithoutArco from "./components/FormWithoutArco";
import "./style/loginStyle.less";
import frogImage from "../../../assets/images/frog.jpg";
import FormWithoutStateExample from "./components/FormWithoutStateExample";
function LoginPage() {
    return (
        <div className="LoginContainer">
            <img src={frogImage} alt="登录页横幅" className="bannerImgFrog" />
            <FormWithoutArco />
            {/* <FormWithoutStateExample /> */}
            {/* <Banner /> */}
        </div>
    );
}

export default LoginPage;
