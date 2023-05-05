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
    const [premium, setIsPremium] = useState('');
    const [editId, setEditId] = useState('');
    const [editIdCategory, setEditIdCategory] = useState('');
    const [editImg, setEditImg] = useState('');
    const [editGadget, setEditGadget] = useState('');
    const [editPrice, setEditPrice] = useState('');

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

    const handleClickEdit = () => {
        if (!editId || !editIdCategory || !editImg || !editGadget || !editPrice) {
            alert('Please fill in all the fields.');
            return;
        }

        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Gadgets/EditGadget',
            data: {
                "id": editId,
                "idCategory": editIdCategory,
                "isPremium": premium,
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
                alert("Successful");
            })
            .catch(error => {
                console.error(error);
            });
    }


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

                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="close">&times;</span>
                            <h1>Edit gadgets</h1>
                        </div>
                        <div className="modal-body">
                            <input id="edit-id" type="number" className="input" placeholder="Enter id" value={editId} onChange={(e) => { setEditId(e.target.value) }} />
                            <input id="edit-idprod" type="number" className="input" placeholder="Enter id category" value={editIdCategory} onChange={(e) => { setEditIdCategory(e.target.value) }} />
                            <input id="edit-img" type="text" className="input" placeholder="Enter url image" value={editImg} onChange={(e) => { setEditImg(e.target.value) }} />
                            <input id="edit-prod" type="text" className="input" placeholder="Enter name product" value={editGadget} onChange={(e) => { setEditGadget(e.target.value) }} />
                            <input id="edit-priceprod" type="number" className="input" placeholder="Enter price product" value={editPrice} onChange={(e) => { setEditPrice(e.target.value) }} />
                            <select id="edit-isPremium" className="input" defaultValue={0} onChange={(e) => setIsPremium(e.target.value)}>
                                <option disabled value={0}>Select worth value</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                            </select>
                            <br /><button id="edit-confirm-prod" onClick={() => { handleClickEdit() }}>Edit</button>
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