import axios from "axios";
import { useState, useEffect } from "react";

function GadgetsTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editIdCategory, setEditIdCategory] = useState('');
    const [editImg, setEditImg] = useState('');
    const [editGadget, setEditGadget] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [premium, setIsPremium] = useState('');
    const [updater, setUpdater] = useState(0);

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'https://localhost:7108/api/Gadgets/GadgetsList',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            props.setGadgets(response.data);
        });
    }, [])

    const handleEdit = (gadget) => {
        setEditId(gadget.id);
        setEditIdCategory(gadget.idCategory);
        setEditImg(gadget.image);
        setEditGadget(gadget.name);
        setEditPrice(gadget.price);
        setIsPremium(gadget.isPremium);
        setShowModal(true);
    };

    const handleClickEdit = (e) => {
        e.preventDefault();
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
                        <th scope='col'>Premium</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {props.gadgets.map((gadget, index) => (
                        <tr key={index}>
                            <td><img src={`${gadget.image}`} style={{ width: 80, height: 100 }} /></td>
                            <td>{gadget.id}</td>
                            <td>{gadget.idCategory}</td>
                            <td>{gadget.name}</td>
                            <td>{gadget.price} USD</td>
                            <td>{gadget.isPremium}</td>
                            <td><button className='del-btn' onClick={() => {
                                const delId = gadget.id;

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
                                }).then((data) => {
                                    props.gadgets.splice(props.gadgets.indexOf(gadget), 1);
                                    setUpdater(updater + 1);
                                    alert("Succsessfull!");
                                });
                            }}>Delete</button>
                                <button className='edit-btn' onClick={() => handleEdit(gadget)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Edit Gadget</h2>
                        <form onSubmit={handleClickEdit}>
                            <input id="edit-idprod" type="number" className="input" placeholder="Enter id category" value={editIdCategory} onChange={(e) => { setEditIdCategory(e.target.value) }} />
                            <input id="edit-img" type="text" className="input" placeholder="Enter url image" value={editImg} onChange={(e) => { setEditImg(e.target.value) }} />
                            <input id="edit-prod" type="text" className="input" placeholder="Enter name product" value={editGadget} onChange={(e) => { setEditGadget(e.target.value) }} />
                            <input id="edit-priceprod" type="number" className="input" placeholder="Enter price product" value={editPrice} onChange={(e) => { setEditPrice(e.target.value) }} />
                            <select id="edit-isPremium" className="input" defaultValue={0} onChange={(e) => setIsPremium(e.target.value)}>
                                <option disabled value={0}>Select worth value</option>
                                <option value="True">True</option>
                                <option value="False">False</option>
                            </select>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GadgetsTables;