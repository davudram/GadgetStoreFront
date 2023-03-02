import '../Styles/Menu.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function MainMenu() {

    function getToken() {
        return sessionStorage.getItem("token");
    }

    function findGadgets(minPrice, maxPrice) {
        const url = 'https://aspazure20230228181346.azurewebsites.net/api/Gadgets/FilterPriceGadgets';
        const params = {
            minPrice: minPrice,
            maxPrice: maxPrice
        };

        axios.get(url, { params })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [gadgetCount, setGadgetCount] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [gadgets, setGadgets] = useState([]);
    const cities = [{ name: 'Днепр', phoneNumber: '+38(098) 555-5555' }, { name: 'Харьков', phoneNumber: '+38(097) 555-5555' }, { name: 'Киев', phoneNumber: '+38(096) 555-5555' }, { name: 'Запорожье', phoneNumber: '+38(098) 535-5255' }, { name: 'Херсон', phoneNumber: '+38(098) 515-5545' },];

    useEffect(() => {
        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://aspazure20230228181346.azurewebsites.net/api/Gadgets/GadgetsList', {
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                setGadgetCount(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const getGadgets = async () => {
            try {
                const response = await axios.get(`https://aspazure20230228181346.azurewebsites.net/api/GadgetsList?idCategory=${selectedCategory}`, {
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                setGadgets(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetch(`https://aspazure20230228181346.azurewebsites.net/api/GadgetsList?search=${search}`)
            .then((res) => res.json())
            .then((data) => setGadgets(data));

        getGadgetCount();
        getGadgets();
    }, [selectedCategory], [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchClick = () => {
        fetch(`https://aspazure20230228181346.azurewebsites.net/api/GadgetsList?search=${search}`)
            .then((res) => res.json())
            .then((data) => setGadgets(data));
    };

    function handleClick() {
        const minValue = document.getElementById('minvalue').value;
        const maxValue = document.getElementById('maxvalue').value;
        findGadgets(minValue, maxValue);
    }
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
        <div className="App">
            <header className="App-header">
                <nav className="top-menu">
                    <ul className="menu-main">
                        <li id="phones" onClick={() => setSelectedCategory('phones')}><a href="">Phones</a></li>
                        <li onClick={() => setSelectedCategory('laptops')}><a href="">Laptop</a></li>
                        <li onClick={() => setSelectedCategory('smartwatch')}><a href="">Smart Watch</a></li>
                        <li><button className="btn" onClick={handleOpenCart}><i className="fa fa-home"></i>&#128722;</button></li>
                    </ul>
                </nav>
                {gadgets.map((gadget) => (
                    <div key={gadget.id}>{gadget.name}</div>
                ))}
                <div className="group">
                    <h1>Gadgets Market</h1>
                    <input placeholder="&#128269;Search" type="text" className="search" value={search} onChange={handleSearchChange}></input><br></br>
                    <button id="find-search" onClick={handleSearchClick}>Find</button>
                    <ul>
                        {gadgets.map((gadget) => (
                            <li key={gadget.id}>{gadget.name}</li>
                        ))}
                    </ul>
                </div>

                <div className='filter'>
                    <h1>Filter</h1>
                    <input id="minvalue" type="number" placeholder='Enter min price'></input>
                    <input id="maxvalue" type="number" placeholder='Enter max price'></input>
                    <button id="findGadget" onClick={handleClick}>Find</button>
                </div>

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
                <h1>Gadgets</h1>
                <div className="cards-gadget">
                    {gadgetCount.map(gadget => (
                        <div className='card' key={gadget.id}>
                            <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                            <h2>{gadget.name}</h2>
                            <p>{gadget.price} USD</p>
                            <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
                <footer style={{ backgroundColor: '#f5f5f5', padding: '20px 0', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {cities.map(city => (
                                <p key={city.name} style={{ marginRight: '20px', marginBottom: '10px' }}>
                                    {city.name}: <a href={`tel:${city.phoneNumber}`} style={{ color: '#333', textDecoration: 'none' }}>{city.phoneNumber}</a>
                                </p>
                            ))}
                        </div>
                    </div>
                </footer>
            </header>
        </div>
    );
}
export default MainMenu;