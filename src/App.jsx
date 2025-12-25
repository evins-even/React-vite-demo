import { useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
function App() {
  const [data, setData] = useState("");
  const [users, setUsers] = useState([]);

  return (
    <div className="App">
      <button onClick={() => {}}>
        <Link to="/login">跳转到登录页</Link>
      </button>
      <p>{JSON.stringify(data)}</p>
      <button onClick={() => {}}>获取全部用户信息</button>
      <p>{users}</p>
    </div>
  );
}

export default App;
