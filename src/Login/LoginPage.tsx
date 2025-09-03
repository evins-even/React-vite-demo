import { useState } from "react";
import "./style/LoginStyle.css"
import Forms from "./components/Forms";
import LoginBoard from "./components/LoginBoard";
function LoginPage() {

    return (
        <div className="LoginContainer">
            <p>这里是登录页</p>
           {/*  <LoginBoard></LoginBoard>
            <Forms></Forms> */}
        </div>
    );
}

export default LoginPage;
