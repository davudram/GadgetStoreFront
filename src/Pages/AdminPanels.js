import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductComponent from './AddProductComponent';
import CategoryGadgetTables from './CategoryGadgetTables';
import GadgetsTables from './GadgetTables';
import CartItemsTables from './CartItemsTables';
import '../Styles/CategoryTable.css';
import AddCategoryComponent from './AddCategoryComponent';

function AdminPanels() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const nav = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [cartsItems, setCartsItems] = useState([]);
    const [gadgets, setGadgets] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
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
            url: 'https://localhost:7108/api/Cart/GetCart',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setCartsItems(response.data);
        })
    }, []
    )


    return (
        <div className="App">
            <header className="App-header">
                <CategoryGadgetTables category={category} setCategory={setCategory} />
                <GadgetsTables gadgets={gadgets} setGadgets={setGadgets} />
                <CartItemsTables itemProd={cartsItems} />

                <h1>Edit Data</h1>
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

                    <AddCategoryComponent category={category} setCategory={setCategory}/>
                    <AddProductComponent gadgets={gadgets} setGadgets={setGadgets}/>
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom: '3%' }}>
                    <button id='btn-upload' onClick={() => { nav('/card') }}>Upload page</button>
                </div>
            </header>
        </div>
    );
}

export default AdminPanels;