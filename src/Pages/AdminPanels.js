import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductComponent from './AddProductComponent';
import CategoryGadgetTables from './CategoryGadgetTables';
import GadgetsTables from './GadgetTables';
import CartItemsTables from './CartItemsTables';
import '../Styles/CategoryTable.css';
import AddCategoryComponent from './AddCategoryComponent';
import UserTables from './UserTables';
import AddManager from './AddManager';

function AdminPanels() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const nav = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [cartsItems, setCartsItems] = useState([]);
    const [gadgets, setGadgets] = useState([]);
    const [category, setCategory] = useState([]);
    const [user, setUser] = useState([]);

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
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <CategoryGadgetTables category={category} setCategory={setCategory} />
                <GadgetsTables gadgets={gadgets} setGadgets={setGadgets} />
                <CartItemsTables itemProd={cartsItems} />
                {userRole === 'Admin' && (
                    <UserTables user={user} setUser={setUser} />
                )}

                <h1>Edit Data</h1>
                <div id="for-crud">
                    {userRole === 'Admin' && (
                        <AddManager user={user} setUser={setUser} />
                    )}

                    <AddCategoryComponent category={category} setCategory={setCategory} />
                    <AddProductComponent gadgets={gadgets} setGadgets={setGadgets} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginBottom: '3%' }}>
                    <button id='btn-upload' onClick={() => { nav('/card') }}>Upload page</button>
                </div>
            </header>
        </div>
    );
}

export default AdminPanels;