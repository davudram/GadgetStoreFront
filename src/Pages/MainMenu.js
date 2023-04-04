import '../Styles/Menu.css';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Footer from './Footer';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';
import CartItem from './CartItem';

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
    const [premiumGadgets, setPremiumGadgets] = useState([]);
    const [search, setSearch] = useState("");
    const [gadgets, setGadgets] = useState([]);
    const [gadgetList, setGadgetList] = useState(gadgetCount);

    useEffect(() => {
        const getGadgetCount = async () => {
            try {
                const response = await axios.get('https://localhost:7108/api/Gadgets/GadgetsList', {
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

        const getPremiumGadgets = async () => {
            try {
                const response = await axios.get('https://localhost:7108/api/Gadgets/SearchByIsPremium?checkPremium=True', {
                    headers: {
                        'Authorization': 'Bearer ' + getToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                setPremiumGadgets(response.data);
            }
            catch (error) {
                console.error(error);
            }
        }

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
        getPremiumGadgets();
    }, [], [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchClick = () => {
        fetch(`https://localhost:7108/api/Gadgets/SearchGadgetsList?search=${search}`, {
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
                        <div className='search-gadgets' style={{ marginTop: '4%', marginBottom: '15%' }}>
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
                                    <CartItem item={item} key={item.productId} handleDelCart={handleDelCart} />
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

                <h1>Premium Gadgets</h1>
                <div className='cards-premium-gadgets'>
                    {premiumGadgets.map(premium => (
                        <div className='premium-card' key={premium.id}>
                            <span></span>
                            <img src={`${premium.image}`} className="regular-img" style={{ height: 130, width: 100 }}></img>
                            <h2>{premium.name}</h2>
                            <p>{premium.price} USD</p>
                            <button className="buy-button" onClick={() => handleAddToCart(premium)}>Add to Cart</button>
                        </div>
                    ))}
                </div>

                <div className='content'>
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
                        <button className={`question-section ${activeIndex === 4 ? "active" : ""}`} onClick={() => toggleAccordion(4)}>
                            <div className="question-align">
                                <h4 className="question-style">What is the latest smartphone model available in your store?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 4 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[4] = ref} style={contentStyles(4)} className="answer answer-divider">
                                <p>Our latest smartphone model available in-store is the Iphone 14 Pro Max.</p>
                            </div>
                        </button>
                    </div>

                    <div className="ask">
                        <button className={`question-section ${activeIndex === 5 ? "active" : ""}`} onClick={() => toggleAccordion(5)}>
                            <div className="question-align">
                                <h4 className="question-style">Can I try out a product before purchasing it?</h4>
                                <FiPlus className={`question-icon ${activeIndex === 3 ? "rotate" : ""}`} />
                            </div>
                            <div ref={(ref) => contentRefs.current[5] = ref} style={contentStyles(5)} className="answer answer-divider">
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