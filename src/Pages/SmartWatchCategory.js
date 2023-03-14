import '../Styles/SmartWatch.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function LaptopCategory() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [watchCount, setWatchCount] = useState([]);
    const [gadgetList, setGadgetList] = useState(watchCount);
    const [userName, setUserName] = useState(null);

    useEffect(() => {

        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://aspazure20230228181346.azurewebsites.net/api/Gadgets/SelectedForCategory?idcategory=3', {
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                setWatchCount(response.data);
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

    function handleClick() {
        const minValue = document.getElementById('minvalue').value;
        const maxValue = document.getElementById('maxvalue').value;
        findGadgets(minValue, maxValue);
    }

    function findGadgets(minPrice, maxPrice) {
        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Gadgets/FilterPriceByIdCategory?minPrice=${minPrice}&maxPrice=${maxPrice}&idcategory=3`, {
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
                        <li onClick={() => { navigate('/phones') }}><a href="">Phones</a></li>
                        <li onClick={() => { navigate('/laptops') }}><a href="">Laptop</a></li>
                        <li onClick={() => { alert("You already in this category!") }}><a href="">Smart Watch</a></li>
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
                                    <div className='cart-item' key={item.productId}>
                                        <img src={`${item.productImage}`} className="cart-item-img"></img>
                                        <div className="cart-item-details">
                                            <h3>{item.productName}</h3>
                                            <p>{item.price} USD</p>
                                        </div>
                                        <button id="remove" onClick={() => { handleDelCart(item.productId) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                                <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clipRule="evenodd" fillRule="evenodd"></path>
                                            </svg>
                                        </button>
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
                    <button id="findGadget" onClick={handleClick}>Find</button>
                </div>

                <h1>Smart Watches</h1>
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
                        watchCount.map(gadget => (
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

export default LaptopCategory;