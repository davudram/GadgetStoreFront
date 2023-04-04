import '../Styles/Admin.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignAdmin() {

    const navigate = useNavigate();
    var item_value = sessionStorage.getItem("token");
    sessionStorage.setItem("token", item_value);

    return (
        <div className="window-enter-adm">
            <p id="enter">Приветствую Администратор!</p>
            <input id="login-enter" type="text" placeholder="Введите логин" /><br />
            <input id="password-enter" type="text" placeholder="Введите пароль" /><br />
            <button className="button" onClick={() => {
                const userName = document.getElementById('login-enter').value;
                const password = document.getElementById('password-enter').value;
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
                    .then(response => { navigate('/table') })
            }}>Enter</button>
        </div>
    );
}

export default SignAdmin;