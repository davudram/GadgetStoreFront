import '../Styles/Phones.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function PhonesCategory() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [phoneCount, setPhoneCount] = useState([]);

    useEffect(() => {

        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://aspazure20230228181346.azurewebsites.net/api/Gadgets/GadgetsList?idCategory=1', {
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                setPhoneCount(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getGadgetCount();
    });

    const handleAddToCart = (gadget) => {
        fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gadget)
        })
            .then(response => {
                if (response.ok) {
                    setCartItems(prevItems => [...prevItems, gadget]);
                } else {
                    console.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleOpenCart = () => {
        setShowCart(true);
    }

    const handleCloseCart = () => {
        setShowCart(false);
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <nav className="top-menu">
                    <ul className="menu-main">
                        <li onClick={() => { alert("You already in this category!") }}><a href="">Phones</a></li>
                        <li onClick={() => { navigate('/laptops') }}><a href="">Laptop</a></li>
                        <li onClick={() => { navigate('/smartwatches') }}><a href="">Smart Watch</a></li>
                        <li><button className="btn" onClick={handleOpenCart}><i className="fa fa-home"></i>&#128722;</button></li>
                    </ul>
                </nav>

                {showCart && (
                    <div className="cart-modal">
                        <h2>Your Cart</h2>
                        {cartItems.length > 0 ? (
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div className="cart-item" key={item.id}>
                                        <img src={`${item.image}`} className="cart-item-img"></img>
                                        <div className="cart-item-details">
                                            <h3>{item.name}</h3>
                                            <p>{item.price} USD</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                        <button className="close-cart-btn" onClick={handleCloseCart}>Close</button>
                    </div>
                )}

                <div className='filter'>
                    <h1>Filter</h1>
                    <input id="minvalue" type="number" placeholder='Enter min price'></input>
                    <input id="maxvalue" type="number" placeholder='Enter max price'></input>
                    <button id="findGadget">Find</button>
                </div>

                <h1>Phones</h1>
                <div className="cards-gadget">
                    {phoneCount.map(gadget => (
                        <div className='card' key={gadget.id}>
                            <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                            <h2>{gadget.name}</h2>
                            <p>{gadget.price} USD</p>
                            <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                        </div>
                    ))}
                </div>

                <Footer/>
            </header>
        </div>
    );
}

export default PhonesCategory;