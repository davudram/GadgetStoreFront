import axios from "axios";
import { useState } from "react";

function AddCategoryComponent(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const[categoryName, setCategoryName] = useState('');

    const AddCategory = () => {
        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Categories/CreateCategory',
            data: {
                "nameGadgets": categoryName
            },
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((data) => {
            axios({
                method: 'GET',
                url: 'https://localhost:7108/api/Categories/CategoryList',
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                props.setCategory(response.data);
                alert("Successful");
            });
        });
    }

    return (
        <div className="container">
            <h1>Create Categories</h1>
            <input id="add-namegadget" type="text" className="input" placeholder="Enter name category" value={categoryName} onChange={(e) => {setCategoryName(e.target.value)}}/>
            <button id="add-gadgetname" onClick={AddCategory}>Create</button>
        </div>

    )
}

export default AddCategoryComponent;