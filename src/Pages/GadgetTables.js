import axios from "axios";
import { useState, useEffect } from "react";

function GadgetsTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [updater, setUpdater] = useState(0);

    useEffect(() => {
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
        });
    }, [])

    return (
        <div className="table-gadgets">
            <h1>Gadgets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Image</th>
                        <th scope="col">ID</th>
                        <th scope="col">ID Category</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope='col'>Premium</th>
                        <th scope="col">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {props.gadgets.map((gadget, index) => (
                        <tr key={index}>
                            <td><img src={`${gadget.image}`} style={{ width: 80, height: 100 }} /></td>
                            <td>{gadget.id}</td>
                            <td>{gadget.idCategory}</td>
                            <td>{gadget.name}</td>
                            <td>{gadget.price} USD</td>
                            <td>{gadget.isPremium}</td>
                            <td><button className='del-btn' onClick={() => {
                                const delId = gadget.id;

                                axios({
                                    method: 'POST',
                                    url: 'https://localhost:7108/api/Gadgets/DeleteGadget',
                                    data: {
                                        "id": delId,
                                    },
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                }).then((data) => {
                                    props.gadgets.splice(props.gadgets.indexOf(gadget), 1);
                                    setUpdater(updater + 1);
                                    alert("Succsessfull!");
                                });
                            }}>Delete</button>
                                <button className='edit-btn' onClick={() => {
                                    var modal = document.getElementById("myModal");
                                    var span = document.getElementsByClassName("close")[0];
                                    modal.style.display = "block";
                                    span.onclick = function () {
                                        modal.style.display = "none";
                                    }
                                    window.onclick = function (event) {
                                        if (event.target == modal) {
                                            modal.style.display = "none";
                                        }
                                    }
                                }}>Edit</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default GadgetsTables;