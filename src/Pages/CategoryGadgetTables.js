import axios from "axios";
import { useState, useEffect } from "react";

function CategoryGadgetTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [updater, setUpdater] = useState(0);

    useEffect(() => {
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
        })
    }, [])


    return (
        <div className="table-gadgets">
            <h1>Category</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Category</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                {props.category.map(categories => (
                    <tbody className='tbody' key={categories.id}>
                        <tr>
                            <td>{categories.id}</td>
                            <td>{categories.nameGadgets}</td>
                            <td><button className='del-btn-category' onClick={() => {
                                const del = categories.id;

                                axios({
                                    method: 'POST',
                                    url: 'https://localhost:7108/api/Categories/DeleteCategory',
                                    data: {
                                        "id": del
                                    },
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                }).then((data) => {
                                    props.category.splice(props.category.indexOf(categories), 1);
                                    setUpdater(updater + 1);
                                    alert("Succsessfull!");
                                });
                            }}>Delete</button></td>
                        </tr>
                    </tbody>
                ))}
            </table>
        </div>
    )
}

export default CategoryGadgetTables;