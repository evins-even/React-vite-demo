import FormWithoutArco from "./components/FormWithoutArco";
import "./style/loginStyle.less";
import frogImage from "../../../assets/images/frog.jpg";
function LoginPage() {
    return (
        <div className="LoginContainer">
            <img src={frogImage} alt="登录页横幅" className="bannerImgFrog" />
            <FormWithoutArco />
            {/* <Banner /> */}
        </div>
    );
}

export default LoginPage;
