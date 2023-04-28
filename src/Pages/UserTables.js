import axios from "axios";
import { useState, useEffect } from "react";

function UserTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [updater, setUpdater] = useState(0);

    useEffect(() => {
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
        })
    }, [])

    const handleClickDel = (users) => {
        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Managers/delManager',
            data: {
                "userName": users.userName,
                "password": "string",
                "email": "string"
            },
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((data) => {
            props.user.splice(props.user.indexOf(users), 1);
            setUpdater(updater + 1);
            alert("Succsessfull!");
        });
    }


    return (
        <div className="table-users">
            <h1>Users</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {props.user.map((users, index) => (
                        <tr key={index}>
                            <td>{users.id}</td>
                            <td>{users.userName}</td>
                            <td>{users.email}</td>
                            <td><button className='del-btn-user' onClick={() => {handleClickDel(users)}}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTables;