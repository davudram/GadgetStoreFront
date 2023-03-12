import '../Styles/Menu.css';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Footer from './Footer';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';

function MainMenu() {

    function getToken() {
        return sessionStorage.getItem("token");
    }

    const [activeIndex, setActiveIndex] = useState(null);
    const contentRefs = useRef([]);
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userName, setUserName] = useState(null);
    const [gadgetCount, setGadgetCount] = useState([]);
    const [search, setSearch] = useState("");
    const [gadgets, setGadgets] = useState([]);
    const [gadgetList, setGadgetList] = useState(gadgetCount);

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
    }, [], [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    function handleClick() {
        const minValue = document.getElementById('minvalue').value;
        const maxValue = document.getElementById('maxvalue').value;
        findGadgets(minValue, maxValue);
    }

    function findGadgets(minPrice, maxPrice) {
        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Gadgets/FilterPriceGadgets?minPrice=${minPrice}&maxPrice=${maxPrice}`, {
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


    const handleSearchClick = () => {
        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Gadgets/SearchGadgetsList?search=${search}`, {
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => setGadgets(data));
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const contentStyles = (index) => ({
        maxHeight: activeIndex === index ? `${contentRefs.current[index].scrollHeight}px` : 0,
        overflow: "hidden",
        transition: "max-height 0.6s ease",
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

        fetch(`https://aspazure20230228181346.azurewebsites.net/api/Cart/DeleteCart?Id=${item.id}`, {
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
        <div className="App">
            <header className="App-header">
                <nav className="top-menu">
                    <ul className="menu-main">
                        <li id="phones" onClick={() => navigate('/phones')}><a href="">Phones</a></li>
                        <li onClick={() => navigate('/laptops')}><a href="">Laptop</a></li>
                        <li onClick={() => navigate('/smartwatches')}><a href="">Smart Watch</a></li>
                        <li><button className="btn" onClick={handleOpenCart}><i className="fa fa-home"></i>&#128722;</button></li>
                    </ul>
                </nav>
                <div className="group">
                    <h1>Gadgets Market &#128241;</h1><br />
                    <input placeholder="&#128269;Search" type="text" className="search" value={search} onChange={handleSearchChange}></input><br></br>
                    <button id="find-search" onClick={handleSearchClick}>Find</button>
                    {gadgets.length > 0 ? (
                        <div className='search-gadgets' style={{marginTop: '4%'}}>
                            {gadgets.map((gadget) => (
                                <div className='card' key={gadget.id}>
                                    <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                                    <h2>{gadget.name}</h2>
                                    <p>{gadget.price} USD</p>
                                    <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>

                {showCart && (
                    <div className="cart-modal">
                        <h2>Your Cart</h2>
                        {cartItems.length > 0 ? (
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div className='cart-item' key={item.id}>
                                        <img src={`${item.productImage}`} className="cart-item-img"></img>
                                        <div className="cart-item-details">
                                            <h3>{item.productName}</h3>
                                            <p>{item.price} USD</p>
                                        </div>
                                        <button id="remove" onClick={() => { handleDelCart(item) }}>
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

                <Carousel>
                    <div>
                        <img src="https://yellow.ua/media/adminforms/homepage_slider_banners/a/r/xartboard_1_16.png.pagespeed.ic._61jKyeonI.webp" />
                    </div>
                    <div>
                        <img src="https://yellow.ua/media/adminforms/homepage_slider_banners/a/r/xartboard_1_18.png.pagespeed.ic.VQc-aCKYv7.webp" />
                    </div>
                    <div>
                        <img src="https://yellow.ua/media/adminforms/homepage_slider_banners/1/3/x1300_2.png.pagespeed.ic.B4DrKwgHtO.webp" />
                    </div>
                    <div>
                        <img src="https://yellow.ua/media/adminforms/homepage_slider_banners/a/r/xartboard_1_9.png.pagespeed.ic.oErOeXHZbk.webp" />
                    </div>
                </Carousel>

                <div className='advertising'>
                    <img src='https://yellow.ua/media/specialaction/image/_/1/x_1_3.jpg.pagespeed.ic.i3WZBAsTKB.webp' style={{ width: '50%', float: 'left', margin: 10 }}></img>
                    <img src='https://yellow.ua/media/catalog/product/cache/8/small_image/211x211/9df78eab33525d08d6e5fb8d27136e95/9/3/x9374067_r_z001a.jpg.pagespeed.ic.N2FTl4h3uR.webp' style={{ float: 'left', margin: 10 }}></img>
                    <p>Dyson Supersonic Hair Dryer (Iron/Fuchsia) HD07</p>
                    <button id='soon'>On sale soon</button>
                </div>


                <div className='content'>
                    <div className='filter'>
                        <h1>Filter</h1>
                        <input id="minvalue" type="number" placeholder='Enter min price'></input>
                        <input id="maxvalue" type="number" placeholder='Enter max price'></input>
                        <button id="findGadget" onClick={handleClick}>Find</button>
                    </div>
                    <h1>Gadgets</h1>
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
                            gadgetCount.map(gadget => (
                                <div className='card' key={gadget.id}>
                                    <img src={`${gadget.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                                    <h2>{gadget.name}</h2>
                                    <p>{gadget.price} USD</p>
                                    <button className="buy-button" onClick={() => handleAddToCart(gadget)}>Add to Cart</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className='faq-info'>
                    <h1>FAQ</h1>
                    <div className="ask">
                        <button className={`question-section ${activeIndex === 0 ? "active" : ""}`} onClick={() => toggleAccordion(0)}>
                            <div className="question-align">
                                <h4 className="question-style">What is your return policy for electronic items?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 0 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[0] = ref} style={contentStyles(0)} className="answer answer-divider">
                                <p>We accept returns on electronic items within 30 days of purchase as long as the item is in its original condition and packaging. If the item is defective, we will offer a full refund or exchange within the first 90 days of purchase. Please note that some items, such as software and certain accessories, may not be eligible for return or exchange. For more information, please see our full return policy on our website or contact our customer service team.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 1 ? "active" : ""}`} onClick={() => toggleAccordion(1)}>
                            <div className="question-align">
                                <h4 className="question-style">Do you offer warranty on your products?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 1 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[1] = ref} style={contentStyles(1)} className="answer answer-divider">
                                <p>Yes, we offer a warranty on most of our products. The length and terms of the warranty may vary depending on the product and manufacturer. Please check the product description or packaging for specific warranty information. If you have any questions or concerns about a warranty, please contact our customer service team for assistance.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 2 ? "active" : ""}`} onClick={() => toggleAccordion(2)}>
                            <div className="question-align">
                                <h4 className="question-style">What forms of payment do you accept?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 2 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[2] = ref} style={contentStyles(2)} className="answer answer-divider">
                                <p>We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. We also accept payment through PayPal and Apple Pay. At this time, we do not accept payment through cash or check.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 3 ? "active" : ""}`} onClick={() => toggleAccordion(3)}>
                            <div className="question-align">
                                <h4 className="question-style">Do you offer free shipping?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 3 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[3] = ref} style={contentStyles(3)} className="answer answer-divider">
                                <p>We offer free standard shipping on orders over $50 within the Ukraine. Some products may not be eligible for free shipping and shipping fees may apply to orders outside of the Ukraine. Please check the product description or contact our customer service team for more information.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 3 ? "active" : ""}`} onClick={() => toggleAccordion(3)}>
                            <div className="question-align">
                                <h4 className="question-style">What is the latest smartphone model available in your store?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 3 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[3] = ref} style={contentStyles(3)} className="answer answer-divider">
                                <p>Our latest smartphone model available in-store is the Iphone 14 Pro Max.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 3 ? "active" : ""}`} onClick={() => toggleAccordion(3)}>
                            <div className="question-align">
                                <h4 className="question-style">Can I try out a product before purchasing it?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 3 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[3] = ref} style={contentStyles(3)} className="answer answer-divider">
                                <p>Yes, we have several demo products available in-store for customers to try before making a purchase.</p>
                            </div>
                        </button>
                    </div>

                </div>
                <Footer />
            </header>
        </div>
    );
}
export default MainMenu;