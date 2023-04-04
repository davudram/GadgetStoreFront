import axios from "axios";
import { useState } from "react";

function AddProductComponent(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [categoryId, setCategoryId] = useState('');
    const [isPremium, setIsPremium] = useState('');
    const [gadgetsName, setGadgetsName] = useState('');
    const [priceGadget, setPriceGadget] = useState('');
    const [images, setImages] = useState('');

    const AddGadget = () => {
        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Gadgets/CreateGadget',
            data: {
                "idCategory": categoryId,
                "isPremium": isPremium,
                "name": gadgetsName,
                "price": priceGadget,
                "image": images
            },
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((data) => {
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
                alert("Successful");
            });
        });
    }

    return (
        <div className="container">
            <h1>Create Gadget</h1>
            <input id="add-idcategory" type="number" className="input" placeholder="Enter id category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
            <input id="add-img" type="text" className="input" placeholder="Enter url image" value={images} onChange={(e) => setImages(e.target.value)} />
            <input id="add-name" type="text" className="input" placeholder="Enter name product" value={gadgetsName} onChange={(e) => setGadgetsName(e.target.value)} />
            <input id="add-price" type="number" className="input" placeholder="Enter price product" value={priceGadget} onChange={(e) => setPriceGadget(e.target.value)} />
            <select id="add-isPremium" className="input" defaultValue={0} onChange={(e) => setIsPremium(e.target.value)}>
                <option disabled value={0}>Select worth value</option>
                <option value="True">True</option>
                <option value="False">False</option>
            </select>
            <br />
            <button id="add-prod" onClick={AddGadget}>Create</button>
        </div>
    )
}

export default AddProductComponent;