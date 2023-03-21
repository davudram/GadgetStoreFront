import '../Styles/Phones.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import Footer from './Footer';

function PhonesCategory() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [phoneCount, setPhoneCount] = useState([]);
    const [gadgetList, setGadgetList] = useState(phoneCount);
    const [userName, setUserName] = useState(null);

    useEffect(() => {

        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://aspazure20230228181346.azurewebsites.net/api/Gadgets/SelectedForCategory?idcategory=1', {
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

        fetch('https://aspazure20230228181346.azurewebsites.net/api/Managers/UserId', {
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to get user id');
                }
                return response.json();
            })
            .then(data => {
                setUserName(data);
            })
            .catch(error => {
                console.error(error);
            });

        getGadgetCount();
    });

    const handleAddToCart = (gadget) => {
        const cartItem = {
            productId: gadget.id,
            productName: gadget.name,
            productImage: gadget.image,
            price: gadget.price,
            quantity: 1,
            userId: userName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        fetch('https://aspazure20230228181346.azurewebsites.net/api/Cart/AddCart', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        })
            .then(response => {
                if (response.ok) {
                    setCartItems(prevItems => [...prevItems, cartItem]);
                } else {
                    console.error(response.statusText);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleDelCart = (item) => {

        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Cart/DeleteCart?Id=${item}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete cart item');
                }
                return response.json();
            })
            .then(data => {
                const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
                setCartItems(updatedCartItems);
            })
            .catch(error => console.error(error));
    }

    function handleClick() {
        const minValue = document.getElementById('minvalue').value;
        const maxValue = document.getElementById('maxvalue').value;
        findGadgets(minValue, maxValue);
    }

    function findGadgets(minPrice, maxPrice) {
        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Gadgets/FilterPriceByIdCategory?minPrice=${minPrice}&maxPrice=${maxPrice}&idcategory=1`, {
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                setGadgetList(data);
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
                        <li onClick={() => { navigate('/menu') }}><a href="">Menu</a></li>
                        <li><button className="btn" onClick={handleOpenCart}><i className="fa fa-home"></i>&#128722;</button></li>
                    </ul>
                </nav>

                {showCart && (
                    <div className="cart-modal">
                        <h2>Your Cart</h2>
                        {cartItems.length > 0 ? (
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <CartItem item = {item} handleDelCart = {handleDelCart}/>
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
                    <button id="findGadget" onClick={handleClick}>Find</button>
                </div>

                <h1>Phones</h1>
                <div className="cards-gadget">
                    {gadgetList.length > 0 ? (
                        gadgetList.map(gadget => (
                            <div className='card' key={gadget.id}>
                                <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                                <h2>{gadget.name}</h2>
                                <p>{gadget.price} USD</p>
                                <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                            </div>
                        ))
                    ) : (
                        phoneCount.map(gadget => (
                            <div className='card' key={gadget.id}>
                                <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                                <h2>{gadget.name}</h2>
                                <p>{gadget.price} USD</p>
                                <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                            </div>
                        ))
                    )}
                </div>

                <Footer />
            </header>
        </div>
    );
}

export default PhonesCategory;