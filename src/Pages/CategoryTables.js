import axios from 'axios';
import { useState, useEffect } from 'react';
import '../Styles/CategoryTable.css';

function CategoryTables() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [category, setCategory] = useState([]);
    const [gadget, setGadget] = useState([]);
    const [userRole, setUserRole] = useState('');


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
            setCategory(response.data);
        })

       axios({
            method: 'GET',
            url: 'https://localhost:7108/api/Managers/getUserRole',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setUserRole(response.data.role);
        })

        axios({
            method: 'GET',
            url: 'https://localhost:7108/api/Gadgets/GadgetsList',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setGadget(response.data);
        })
    })


    return (
        <div className="App">
            <header className="App-header">
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
                        {category.map(categories => (
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
                                        }).then(data => alert("Successful"))
                                    }}>Delete</button></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

                <div className="table-gadgets">
                    <h1>Gadgets</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Image</th>
                                <th scope="col">ID</th>
                                <th scope="col">ID Category</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        {gadget.map(gadgets => (
                            <tbody key={gadgets.id}>
                                <tr>
                                    <td><img src={`${gadgets.image}`} style={{ width: 80, height: 100 }} /></td>
                                    <td>{gadgets.id}</td>
                                    <td>{gadgets.idCategory}</td>
                                    <td>{gadgets.name}</td>
                                    <td>{gadgets.price} USD</td>
                                    <td><button className='del-btn' onClick={() => {
                                        const delId = gadgets.id;

                                        axios({
                                            method: 'POST',
                                            url: 'https://localhost:7108/api/Gadgets/DeleteGadget',
                                            data: {
                                                "id": delId,
                                            },
                                            headers: {
                                                'Authorization': 'Bearer ' + getToken(),
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        }).then(data => alert("Succsessfull!"));
                                    }}>Delete</button>
                                        <button className='edit-btn' onClick={() => {
                                            var modal = document.getElementById("myModal");
                                            var span = document.getElementsByClassName("close")[0];
                                            modal.style.display = "block";
                                            span.onclick = function () {
                                                modal.style.display = "none";
                                            }
                                            window.onclick = function (event) {
                                                if (event.target == modal) {
                                                    modal.style.display = "none";
                                                }
                                            }
                                        }}>Edit</button>

                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

                <div id="for-crud">
                {userRole === 'Admin' && (
                    <div className="container">
                        <h1>Create Manager</h1>
                        <input id="add-login" type="text" className="input" placeholder="Enter login" />
                        <input id="add-password" type="text" className="input" placeholder="Enter password" />
                        <input id="add-email" type="text" className="input" placeholder="Enter email" />
                        <br /><button id="add-manager" onClick={() => {
                            const login = document.getElementById('add-login').value;
                            const password = document.getElementById('add-password').value;
                            const email = document.getElementById('add-email').value;
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
                            }).then(data => alert("Succsessfull"))
                        }}>Create</button>
                    </div>
                )}

                    {userRole === 'Admin' && (
                        <div className="container">
                            <h1>Delete Manager</h1>
                            <input id="del-login" type="text" className="input" placeholder="Enter login" />
                            <br />
                            <button id="del-manager" onClick={() => {
                                const userName = document.getElementById('del-login').value;
                                axios({
                                    method: 'POST',
                                    url: 'https://localhost:7108/api/Managers/delManager',
                                    data: {
                                        "userName": userName,
                                        "password": "string",
                                        "email": "string"
                                    },
                                    dataType: 'dataType',
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                }).then(function (response) {
                                    alert('Manager deleted successfully!');
                                })
                                    .catch(function (error) {
                                        alert('An error occurred while deleting user with username ' + userName);
                                    });
                            }}>Delete</button>
                        </div>
                    )}

                    <div className="container">
                        <h1>Create Categories</h1>
                        <input id="add-namegadget" type="text" className="input" placeholder="Enter name category" />
                        <br /><button id="add-gadgetname" onClick={() => {
                            const addCategory = document.getElementById('add-namegadget').value;
                            axios({
                                method: 'POST',
                                url: 'https://localhost:7108/api/Categories/CreateCategory',
                                data: {
                                    "nameGadgets": addCategory
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + getToken(),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            }).then(data => alert("Successful"))
                        }}>Create</button>
                    </div>

                    <div className="container">
                        <h1>Create Gadget</h1>
                        <input id="add-idcategory" type="number" className="input" placeholder="Enter id category" />
                        <input id="add-img" type="text" className="input" placeholder="Enter url image" />
                        <input id="add-name" type="text" className="input" placeholder="Enter name product" />
                        <input id="add-price" type="number" className="input" placeholder="Enter price product" />
                        <br /><button id="add-prod" onClick={() => {
                            const categoryId = document.getElementById('add-idcategory').value;
                            const images = document.getElementById('add-img').value;
                            const gadgetsName = document.getElementById('add-name').value;
                            const priceGadget = document.getElementById('add-price').value;

                            axios({
                                method: 'POST',
                                url: 'https://localhost:7108/api/Gadgets/CreateGadget',
                                data: {
                                    "idCategory": categoryId,
                                    "name": gadgetsName,
                                    "price": priceGadget,
                                    "image": images
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + getToken(),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            }).then(data => alert("Successful"))
                        }}>Create</button>
                    </div>
                </div>

                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="close">&times;</span>
                            <h1>Edit gadgets</h1>
                        </div>
                        <div className="modal-body">
                            <input id="edit-id" type="number" className="input" placeholder="Enter id" />
                            <input id="edit-idprod" type="number" className="input" placeholder="Enter id category" />
                            <input id="edit-img" type="text" className="input" placeholder="Enter url image" />
                            <input id="edit-prod" type="text" className="input" placeholder="Enter name product" />
                            <input id="edit-priceprod" type="number" className="input" placeholder="Enter price product" />
                            <br /><button id="edit-confirm-prod" onClick={() => {
                                const editId = document.getElementById('edit-id').value;
                                const editIdCategory = document.getElementById('edit-idprod').value;
                                const editImg = document.getElementById('edit-img').value;
                                const editGadget = document.getElementById('edit-prod').value;
                                const editPrice = document.getElementById('edit-priceprod').value;

                                axios({
                                    method: 'POST',
                                    url: 'https://localhost:7108/api/Gadgets/EditGadget',
                                    data: {
                                        "id": editId,
                                        "idCategory": editIdCategory,
                                        "name": editGadget,
                                        "price": editPrice,
                                        "image": editImg
                                    },
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(response => {
                                        alert("Succsessfull");
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}>Create</button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default CategoryTables;