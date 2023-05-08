import React, { useState } from "react";
import axios from "axios";
import '../Styles/Upload.css';

function UploadForm() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [imageUrl, setImageUrl] = useState();

    const saveFile = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
        console.log(file);
        const formData = new FormData();
        formData.append("formFile", file);
        formData.append("fileName", fileName);
        try {
            const res = await axios.post("https://localhost:7108/api/Gadgets/Upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + getToken()
                }
            });
            console.log(res);
            alert("File uploaded successfully: " + res.data);
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div className="upload-form">
            <h1>Upload File</h1>
            <div className="form-group">
                <label>Choose a file to upload:</label>
                <input type="file" onChange={saveFile} />
            </div>
            <div className="form-group">
                <input type="button" value="Upload" onClick={uploadFile} />
            </div>
            {imageUrl && (
                <div className="form-group">
                    <label>Uploaded image URL:</label>
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
                </div>
            )}
        </div>
    );
};


export default UploadForm;
