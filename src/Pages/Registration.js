import '../Styles/Reg.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Registration() {

  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div className="window-reg">
          <p id="reg">Окно регистрации</p>
          <input id="login-reg" type="text" placeholder="Введите логин" /><br></br>
          <input id="password-reg" type="text" placeholder="Введите пароль" /><br></br>
          <input id="email-reg" type="text" placeholder="Введите почту" /><br></br>
          <button className="button" onClick={() => {
            const userName = document.getElementById('login-reg').value;
            const password = document.getElementById('password-reg').value;
            const email = document.getElementById('email-reg').value;
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
              .then(data => {alert("Succsessfully created user" + userName)})
              .then(response => {navigate('/')})  
          }}>Enter</button>
        </div>
      </header>
    </div>
  );
}

export default Registration;
