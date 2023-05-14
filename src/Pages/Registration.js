import '../Styles/Reg.css';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const Reg = () => {
    axios({
      method: 'post',
      url: 'https://localhost:7108/api/Authenticate/regUser',
      data: {
        "userName": userName,
        "password": password,
        "email": email
      },
      dataType: "dataType",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(data => { alert("Succsessfully created user" + userName) })
      .then(response => { navigate('/') })
  }

  return (
    <div className="reg-container">
      <div className="window-reg">
        <p id="reg">Окно регистрации</p>
        <input id="login-reg" type="text" placeholder="Введите логин" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
        <input id="password-reg" type="password" placeholder="Введите пароль" value={password} onChange={(e) => { setPassword(e.target.value) }} />
        <input id="email-reg" type="email" placeholder="Введите почту" value={email} onChange={(e) => { setEmail(e.target.value) }} />
        <button className="button-reg" onClick={() => { Reg() }}>Enter</button>
      </div>
    </div>
  );
}

export default Registration;
