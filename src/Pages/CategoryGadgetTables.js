import axios from "axios";
import { useState, useEffect } from "react";

function CategoryGadgetTables(props) {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [showModal, setShowModal] = useState(false);
    const [updater, setUpdater] = useState(0);
    const [idCategory, setIdCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'https://localhost:7108/api/Categories/CategoryList',
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            props.setCategory(response.data);
        })
    }, [])

    const handleClickDel = (categories) => {
        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Categories/DeleteCategory',
            data: {
                "id": categories.id
            },
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((data) => {
            props.category.splice(props.category.indexOf(categories), 1);
            setUpdater(updater + 1);
            alert("Succsessfull!");
        });
    }

    const handleEdit = (categories) => {
        setIdCategory(categories.id);
        setCategoryName(categories.nameGadgets);
        setShowModal(true);
    };

    const handleClickEdit = (e) => {
        e.preventDefault();
        if (!categoryName) {
            alert('Please fill in all the fields.');
            return;
        }

        axios({
            method: 'POST',
            url: 'https://localhost:7108/api/Categories/EditGadget',
            data: {
                "id": idCategory,
                "nameGadgets": categoryName
            },
            headers: {
                'Authorization': 'Bearer ' + getToken(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert("Successful");
            })
            .catch(error => {
                console.error(error);
            });
    }


    return (
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
                <tbody>
                    {props.category.map((categories, index) => (
                        <tr key={index}>
                            <td>{categories.id}</td>
                            <td>{categories.nameGadgets}</td>
                            <td><button className='del-btn-category' onClick={() => {handleClickDel(categories)}}>Delete</button>
                            <button className='edit-btn' onClick={() => handleEdit(categories)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Edit Category</h2>
                        <form onSubmit={handleClickEdit}>
                            <input id="edit-category-name" type="text" className="input" placeholder="Enter category name" value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryGadgetTables;