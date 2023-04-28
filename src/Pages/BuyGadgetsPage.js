import '../Styles/BuyGadget.css';
import Footer from './Footer';

function BuyGadgetsPage() {
    return (
        <div className='App'>
            <h1>Send form</h1>
            <div className="forms-container">
                <div className="buy-forms">
                    <div className="card-data">
                        <h1>Payment</h1>
                        <input type='text' placeholder="Name on Card"></input>
                        <input type='number' placeholder="Credit card number"></input>
                        <input type='number' placeholder="Exp month"></input>
                        <input type='number' placeholder="Exp years"></input>
                        <input type='number' placeholder="CVV"></input>
                        <a href="https://www.shift4shop.com/credit-card-logos.html"><img alt="Credit Card Logos" title="Credit Card Logos" src="https://www.shift4shop.com/images/credit-card-logos/cc-md-4.png" width="309" height="38" border="0" /></a>
                    </div>
                </div>
                <button className='send-card'>Buy</button>
                <div className='example-card' style={{ marginTop: '5%' }}>
                    <h1>Example card</h1>
                    <div className='payment-card'>
                        <div className="card-display">
                            <div className="card-header">
                                <div className="card-title">Credit Card</div>
                                <div className="card-logo">
                                    <img src="https://d28wu8o6itv89t.cloudfront.net/images/mastercardlogopng-1579603310730.png" alt="Card Logo" />
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-number">**** **** **** 1234</div>
                                <div className="card-info">
                                    <div className="card-holder">
                                        <div className="card-label">Card Holder</div>
                                        <div className="card-value">JOHN DOE</div>
                                    </div>
                                    <div className="card-expiry">
                                        <div className="card-label">Expires</div>
                                        <div className="card-value">12/24</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

}

export default BuyGadgetsPage;