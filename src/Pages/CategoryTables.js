import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/CategoryTable.css';

function CategoryTables() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [category, setCategory] = useState([]);
    const [gadget, setGadget] = useState([]);
    const [cartsItems, setCartsItems] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        setImageUrl(URL.createObjectURL(acceptedFiles[0]));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const uploadFile = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsLoading(true);
        setUploadProgress(0);
        setUploadStatus('');

        const formData = new FormData();
        formData.append('files', selectedFile);

        try {
            const response = await axios.post('https://aspazure20230228181346.azurewebsites.net/api/Gadgets/Upload', formData, {
                headers: {
                    'Authorization': 'Bearer ' + getToken(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsLoading(false);
            setUploadProgress(100);
            setUploadStatus('Success');
            setImageUrl(response.data);

            toast.success('File uploaded successfully');
        } catch (error) {
            setIsLoading(false);
            setUploadProgress(0);
            setUploadStatus('Error');

            toast.error('Error uploading file');
        }
    };

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'https://aspazure20230228181346.azurewebsites.net/api/Categories/CategoryList',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setCategory(response.data);
        })

        axios({
            method: 'GET',
            url: 'https://aspazure20230228181346.azurewebsites.net/api/Cart/GetCart',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setCartsItems(response.data);
        })

        axios({
            method: 'GET',
            url: 'https://aspazure20230228181346.azurewebsites.net/api/Managers/getUserRole',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setUserRole(response.data.role);
        })

        axios({
            method: 'GET',
            url: 'https://aspazure20230228181346.azurewebsites.net/api/Gadgets/GadgetsList',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            setGadget(response.data);
        })
    })


    return (
        <div className="App">
            <header className="App-header">
                <div className="table-gadgets">
                    <h1>Category</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Category</th>
                                <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        {category.map(categories => (
                            <tbody className='tbody' key={categories.id}>
                                <tr>
                                    <td>{categories.id}</td>
                                    <td>{categories.nameGadgets}</td>
                                    <td><button className='del-btn-category' onClick={() => {
                                        const del = categories.id;

                                        axios({
                                            method: 'POST',
                                            url: 'https://aspazure20230228181346.azurewebsites.net/api/Categories/DeleteCategory',
                                            data: {
                                                "id": del
                                            },
                                            headers: {
                                                'Authorization': 'Bearer ' + getToken(),
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        }).then(data => alert("Successful"))
                                    }}>Delete</button></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

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
                                <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        {gadget.map(gadgets => (
                            <tbody key={gadgets.id}>
                                <tr>
                                    <td><img src={`${gadgets.image}`} style={{ width: 80, height: 100 }} /></td>
                                    <td>{gadgets.id}</td>
                                    <td>{gadgets.idCategory}</td>
                                    <td>{gadgets.name}</td>
                                    <td>{gadgets.price} USD</td>
                                    <td><button className='del-btn' onClick={() => {
                                        const delId = gadgets.id;

                                        axios({
                                            method: 'POST',
                                            url: 'https://aspazure20230228181346.azurewebsites.net/api/Gadgets/DeleteGadget',
                                            data: {
                                                "id": delId,
                                            },
                                            headers: {
                                                'Authorization': 'Bearer ' + getToken(),
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        }).then(data => alert("Succsessfull!"));
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
                            </tbody>
                        ))}
                    </table>
                </div>

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
                        {cartsItems.map(carts => (
                            <tbody className='tbody' key={carts.id}>
                                <tr>
                                    <td><img src={`${carts.productImage}`} style={{ width: 80, height: 100 }} /></td>
                                    <td>{carts.id}</td>
                                    <td>{carts.productName}</td>
                                    <td>{carts.price} USD</td>
                                    <td>{carts.quantity}</td>
                                    <td>{carts.userId}</td>
                                    <td>{carts.createdAt}</td>
                                    <td><button className='del-btn-order' onClick={() => {
                                        const del = carts.id;

                                        axios({
                                            method: 'POST',
                                            url: `https://aspazure20230228181346.azurewebsites.net/api/Cart/DeleteCart?Id=${del}`,
                                            headers: {
                                                'Authorization': 'Bearer ' + getToken(),
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        }).then(data => alert("Successful"))
                                    }}>Delete</button></td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

                <h1>Edit Data</h1>
                <div id="for-crud">
                    {userRole === 'Admin' && (
                        <div className="container">
                            <h1>Create Manager</h1>
                            <input id="add-login" type="text" className="input" placeholder="Enter login" />
                            <input id="add-password" type="text" className="input" placeholder="Enter password" />
                            <input id="add-email" type="text" className="input" placeholder="Enter email" />
                            <br /><button id="add-manager" onClick={() => {
                                const login = document.getElementById('add-login').value;
                                const password = document.getElementById('add-password').value;
                                const email = document.getElementById('add-email').value;
                                axios({
                                    method: 'POST',
                                    url: 'https://aspazure20230228181346.azurewebsites.net/api/Authenticate/regManager',
                                    data: {
                                        "userName": login,
                                        "password": password,
                                        "email": email
                                    },
                                    dataType: 'dataType',
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                }).then(data => alert("Succsessfull"))
                            }}>Create</button>
                        </div>
                    )}

                    {userRole === 'Admin' && (
                        <div className="container">
                            <h1>Delete Manager</h1>
                            <input id="del-login" type="text" className="input" placeholder="Enter login" />
                            <br />
                            <button id="del-manager" onClick={() => {
                                const userName = document.getElementById('del-login').value;
                                axios({
                                    method: 'POST',
                                    url: 'https://aspazure20230228181346.azurewebsites.net/api/Managers/delManager',
                                    data: {
                                        "userName": userName,
                                        "password": "string",
                                        "email": "string"
                                    },
                                    dataType: 'dataType',
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                }).then(function (response) {
                                    alert('Manager deleted successfully!');
                                })
                                    .catch(function (error) {
                                        alert('An error occurred while deleting user with username ' + userName);
                                    });
                            }}>Delete</button>
                        </div>
                    )}

                    <div className="container">
                        <h1>Create Categories</h1>
                        <input id="add-namegadget" type="text" className="input" placeholder="Enter name category" />
                        <br /><button id="add-gadgetname" onClick={() => {
                            const addCategory = document.getElementById('add-namegadget').value;
                            axios({
                                method: 'POST',
                                url: 'https://aspazure20230228181346.azurewebsites.net/api/Categories/CreateCategory',
                                data: {
                                    "nameGadgets": addCategory
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + getToken(),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            }).then(data => alert("Successful"))
                        }}>Create</button>
                    </div>

                    <div className="container">
                        <h1>Create Gadget</h1>
                        <input id="add-idcategory" type="number" className="input" placeholder="Enter id category" />
                        <input id="add-img" type="text" className="input" placeholder="Enter url image" />
                        <input id="add-name" type="text" className="input" placeholder="Enter name product" />
                        <input id="add-price" type="number" className="input" placeholder="Enter price product" />
                        <br /><button id="add-prod" onClick={() => {
                            const categoryId = document.getElementById('add-idcategory').value;
                            const images = document.getElementById('add-img').value;
                            const gadgetsName = document.getElementById('add-name').value;
                            const priceGadget = document.getElementById('add-price').value;

                            axios({
                                method: 'POST',
                                url: 'https://aspazure20230228181346.azurewebsites.net/api/Gadgets/CreateGadget',
                                data: {
                                    "idCategory": categoryId,
                                    "name": gadgetsName,
                                    "price": priceGadget,
                                    "image": images
                                },
                                headers: {
                                    'Authorization': 'Bearer ' + getToken(),
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            }).then(data => alert("Successful"))
                        }}>Create</button>
                    </div>
                </div>

                <div id="myModal" className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="close">&times;</span>
                            <h1>Edit gadgets</h1>
                        </div>
                        <div className="modal-body">
                            <input id="edit-id" type="number" className="input" placeholder="Enter id" />
                            <input id="edit-idprod" type="number" className="input" placeholder="Enter id category" />
                            <input id="edit-img" type="text" className="input" placeholder="Enter url image" />
                            <input id="edit-prod" type="text" className="input" placeholder="Enter name product" />
                            <input id="edit-priceprod" type="number" className="input" placeholder="Enter price product" />
                            <br /><button id="edit-confirm-prod" onClick={() => {
                                const editId = document.getElementById('edit-id').value;
                                const editIdCategory = document.getElementById('edit-idprod').value;
                                const editImg = document.getElementById('edit-img').value;
                                const editGadget = document.getElementById('edit-prod').value;
                                const editPrice = document.getElementById('edit-priceprod').value;

                                axios({
                                    method: 'POST',
                                    url: 'https://aspazure20230228181346.azurewebsites.net/api/Gadgets/EditGadget',
                                    data: {
                                        "id": editId,
                                        "idCategory": editIdCategory,
                                        "name": editGadget,
                                        "price": editPrice,
                                        "image": editImg
                                    },
                                    headers: {
                                        'Authorization': 'Bearer ' + getToken(),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(response => {
                                        alert("Succsessfull");
                                    })
                                    .catch(error => {
                                        console.error(error);
                                    });
                            }}>Create</button>
                        </div>
                    </div>
                </div>

                <Card className="my-4" style={{ width: 800, height: 670, marginTop: 100 }}>
                    <h1>Upload Image</h1>
                    <Card.Body>
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Click for upload files</p>
                            )}
                        </div>

                        <div className="file-upload-info">
                            {selectedFile && (
                                <div className="selected-file">
                                    <span className="file-name">{selectedFile.name}</span>
                                    <button className="btn btn-danger btn-sm" onClick={() => {
                                        setSelectedFile(null);
                                        setImageUrl('');
                                    }}>Delete</button>
                                </div>
                            )}

                            {imageUrl && (
                                <div className="uploaded-image">
                                    <img src={imageUrl} alt="Uploaded" />
                                </div>
                            )}

                            {isLoading && (
                                <div className="upload-progress">
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <div className="upload-status">{uploadStatus}</div>
                                </div>
                            )}

                            <button className="btn btn-primary btn-block" onClick={uploadFile}>
                                Upload
                            </button>
                        </div>

                        <ToastContainer />
                    </Card.Body>
                </Card>

            </header>
        </div>
    );
}

export default CategoryTables;