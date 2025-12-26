import "./style/loginStyle.less"
import Forms from "./components/Forms";
import frogImage from "../../assets/images/frog.jpg"
function LoginPage() {

    return (
        <div className="LoginContainer">
            <img src={frogImage} alt="Banner" className="banner" />
            <Forms></Forms>
        </div>
    );
}

export default LoginPage;
