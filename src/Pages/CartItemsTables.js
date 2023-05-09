import axios from "axios";
import { useState } from "react";

function CartItemsTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [updater, setUpdater] = useState(0);

    return (
        <div className="table-carts">
            <h1>Orders</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Image</th>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">User</th>
                        <th scope="col">Order date</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {props.itemProd.map((carts, index) => (
                        <tr key={index}>
                            <td><img src={`${carts.productImage}`} style={{ width: 80, height: 100 }} /></td>
                            <td>{carts.id}</td>
                            <td>{carts.productName}</td>
                            <td>{carts.price} USD</td>
                            <td>{carts.quantity}</td>
                            <td>{carts.userId}</td>
                            <td>{carts.createdAt}</td>
                            <td><button className='del-btn-order' onClick={(event) => {
                                event.preventDefault();
                                const del = carts.productId;
                                axios({
                                    method: 'POST',
                                    url: `https://localhost:7108/api/Cart/DeleteCart?Id=${del}`,
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                }).then((data) => {
                                    props.itemProd.splice(props.itemProd.indexOf(carts), 1);
                                    setUpdater(updater + 1);
                                    alert("Succsessfull!");
                                });
                            }}>Accept</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CartItemsTables;