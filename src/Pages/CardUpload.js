import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

function CardUpload() {

    function getToken() {
        return sessionStorage.getItem('token');
    }

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
            const response = await axios.post('https://localhost:7108/api/Gadgets/Upload', formData, {
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

    return (
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
    )
}

export default CardUpload;