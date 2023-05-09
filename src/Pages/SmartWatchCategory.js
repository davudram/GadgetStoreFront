import '../Styles/SmartWatch.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
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
    const [sortId, setSortId] = useState(1);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');

    useEffect(() => {

        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://localhost:7108/api/Gadgets/SelectedForCategory?idcategory=3', {
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

        fetch('https://localhost:7108/api/Managers/UserId', {
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

        fetch('https://localhost:7108/api/Cart/AddCart', {
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

    function findGadgets() {
        fetch(`https://localhost:7108/api/Gadgets/FilterPriceByIdCategory?minPrice=${minValue}&maxPrice=${maxValue}&idcategory=3`, {
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

    const handleDelCart = (productId) => {
        fetch(`https://localhost:7108/api/Cart/DeleteCart?Id=${productId}`, {
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
                const updatedCartItems = cartItems.filter(cartItem => cartItem.productId !== productId);
                setCartItems(updatedCartItems);
            })
            .catch(error => console.error(error));
    }

    const handleSortSelect = (e) => {
        setSortId(e.target.value);
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
                                    <CartItem item={item} key={item.productId} handleDelCart={handleDelCart} />
                                ))}
                            </div>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                        <button className="close-cart-btn" onClick={handleCloseCart}>Close</button>
                    </div>
                )}

                <div className='sort-gadget'>
                    <select onChange={handleSortSelect} defaultValue={0}>
                        <option disabled value={0}>Select sort value</option>
                        <option value={1}>Minimum value</option>
                        <option value={2}>Maximum value</option>
                    </select>
                </div>

                <div className='filter'>
                    <h1>Filter</h1>
                    <input id="minvalue" type="number" value={minValue} onChange={(e) => { setMinValue(e.target.value) }} placeholder='Enter min price'></input>
                    <input id="maxvalue" type="number" value={maxValue} onChange={(e) => { setMaxValue(e.target.value) }} placeholder='Enter max price'></input>
                    <button id="findGadget" onClick={findGadgets}>Find</button>
                </div>

                <h1>Smart Watches</h1>
                <div className="cards-watches">
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
                        watchCount.sort((a, b) => {
                            return sortId === '2' ? b.price - a.price : a.price - b.price
                        }).map(gadget => (
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