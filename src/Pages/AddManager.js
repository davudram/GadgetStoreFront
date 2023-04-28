import axios from "axios";
import { useState } from "react";

function AddManager(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const AddManagers = () => {
        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Authenticate/regManager',
            data: {
                "userName": login,
                "password": password,
                "email": email
            },
            dataType: 'dataType',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((data) => {
            axios({
                method: 'GET',
                url: 'https://localhost:7108/api/Managers/selectUser',
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                props.setUser(response.data);
                alert("Successful");
            });
        });
    }

    return (
        <div className="container">
            <h1>Create Manager</h1>
            <input id="add-login" type="text" className="input" placeholder="Enter login" value={login} onChange={(e) => { setLogin(e.target.value) }} />
            <input id="add-password" type="text" className="input" placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <input id="add-email" type="text" className="input" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <br /><button id="add-manager" onClick={AddManagers}>Create</button>
        </div>

    )
}

export default AddManager;