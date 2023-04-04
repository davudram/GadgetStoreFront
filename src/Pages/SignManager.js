import '../Styles/Manager.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignManager() {

    const navigate = useNavigate();
    var item_value = sessionStorage.getItem("token");
    sessionStorage.setItem("token", item_value);

    return (
        <div className="window-enter-manager">
            <p id="enter-manager">Приветствую Менеджер!</p>
            <input id="login-enter-manager" type="text" placeholder="Введите логин" /><br />
            <input id="password-enter-manager" type="text" placeholder="Введите пароль" /><br />
            <button className="button" onClick={() => {
                const userName = document.getElementById('login-enter-manager').value;
                const password = document.getElementById('password-enter-manager').value;
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

export default SignManager;