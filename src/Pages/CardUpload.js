import React, { useState } from 'react';
import '../Styles/Upload.css';

function UploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileInputChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const handleUploadButtonClick = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('https://localhost:7108/api/Gadgets/Upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const { fileName } = await response.json();
            alert(`File '${fileName}' uploaded successfully.`);
        } else {
            alert('An error occurred while uploading the file.');
        }
    };

    return (
        <div className="upload-form-container">
            <h2 className="upload-form-header">Upload Form</h2>
            <label className="upload-form-label" htmlFor="file-input">Choose a file:</label>
            <input className="upload-form-input" type="file" id="file-input" onChange={handleFileInputChange} />
            <button className="upload-form-button" onClick={handleUploadButtonClick} disabled={!selectedFile}>
                Upload
            </button>
            <p className="upload-form-filename">{fileName}</p>
        </div>
    );
};

export default UploadForm;