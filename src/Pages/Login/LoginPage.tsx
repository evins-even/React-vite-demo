import "./style/loginStyle.less"
import Forms from "./components/Forms";
import frogImage from "../../assets/images/frog.jpg"
import Banner from "./components/Banner";
function LoginPage() {
    return (
        <div className="LoginContainer">
            <img src={frogImage} alt="bannerImgFrog" className="bannerImgFrog" />
            <Forms></Forms>
            <Banner></Banner>
        </div>
    );

}

export default LoginPage;
