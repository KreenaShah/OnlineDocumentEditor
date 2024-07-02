import React, { useEffect, useState } from "react";
import axios from "axios";
import TinyMCEEditor from "./TinyMCEEditor";
import Fuse from "fuse.js";

const FileList = () => {
  const [file, setFile] = useState(null); // uploading file
  const [files, setFiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        setFiles(res.data);
        setSearchResults(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults(files);
      return;
    }

    const fuse = new Fuse(files, {
      keys: ["originalName"],
      threshold: 0.7, // value closer to 0 = stricter matching (more precise results) && closer to 1 allows for more lenient matching (broader results).
    });
    const results = fuse.search(searchTerm).map((result) => result.item);
    setSearchResults(results);
  };

  // const handleViewFile = (fileId) => {
  //   window.open(`http://localhost:5000/files/${fileId}`, "_blank");
  // };
  const handleViewFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/files/${fileId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Create a new window and write the HTML content
      const newWindow = window.open();
      newWindow.document.open();
      newWindow.document.write(data.content);
      newWindow.document.close();
    } catch (error) {
      console.error('Error fetching the file:', error);
    }
  };
  

  const handleEditFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/${fileId}`);
      setFiles(files.filter(file => file._id !== fileId));
      setSearchResults(searchResults.filter((file) => file._id !== fileId));
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
      setFiles((prevFiles) => [...prevFiles, res.data]);
      setSearchResults((prevFiles) => [...prevFiles, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>File Structure</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <hr></hr>
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <hr />
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>File Name</th>
            <th>View</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((file, index) => (
            <tr key={file._id}>
              <td>{index + 1}</td>
              <td>
                <a
                  href={`http://localhost:5000/files/${file._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.originalName}
                </a>
              </td>
              <td>
                <button onClick={() => handleViewFile(file._id)}>View</button>
              </td>
              <td>
                <button onClick={() => handleEditFile(file._id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteFile(file._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedFileId && <TinyMCEEditor fileId={selectedFileId} />}
    </div>
  );
};

export default FileList;