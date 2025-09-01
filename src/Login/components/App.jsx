import { useState } from "react";
import "../../App.css";
import Forms from "../components/Forms";
function App() {
  const [data, setData] = useState("");
  const [users, setUsers] = useState([]);
  const postData = async () => {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "even",
        email: "15403287024@qq.com",
      }),
    });
    const data = await res.json();
    setData(data);
  };
  const getUser = async () => {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "get",
    });
    const data = await res.json();
    setUsers(data);
  };
  return (
    <div className="App">
      <button onClick={postData}>测试接口</button>
      <p>{JSON.stringify(data)}</p>
      <button onClick={getUser}>获取全部用户信息</button>
      <p>{JSON.stringify(users)}</p>
      <Forms></Forms>
    </div>
  );
}

export default App;
