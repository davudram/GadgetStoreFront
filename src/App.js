import './Styles/App.css'
import axios from 'axios';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  var item_value = sessionStorage.getItem("token");
  sessionStorage.setItem("token", item_value);

  const LogIn = () => {
    axios({
      method: 'post',
      url: 'https://localhost:7108/api/Authenticate/login',
      data: {
        "userName": userName,
        "password": password
      },
      dataType: "dataType",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(data => sessionStorage.setItem('token', data['data']['token']))
      .then(response => { navigate('/menu') })
  }

  return (
    <div className="app-container">
        <div className="window-enter">
          <div className="window-elements">
            <p id="enter">Войти в аккаунт</p>
            <input id="login-enter" type="text" placeholder="Введите логин" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
            <input id="password-enter" type="password" placeholder="Введите пароль" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <button className="button-log" onClick={() => { LogIn() }}>Enter</button>
          </div>
          <div className='help-nav'>
            <Link to="/registration" style={{ padding: "10px" }}>Нет аккаунта? Зарегистрируйтесь.</Link><br />
            <Link to="/admin" style={{ padding: "5px" }}>Для персонала</Link><br />
            <Outlet />
          </div>
        </div>
    </div>
  );
}

export default App;