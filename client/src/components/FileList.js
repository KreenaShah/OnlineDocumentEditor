import React, { useEffect, useState } from "react";
import axios from "axios";
import TinyMCEEditor from "./TinyMCEEditor";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        setFiles(res.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const handleViewFile = (fileId) => {
    console.log("View file:", fileId);
    window.open(`http://localhost:5000/files/${fileId}`, "_blank");
  };

  const handleEditFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      console.log("handleDeleteFile")
      await axios.delete(`http://localhost:5000/${fileId}`);
      setFiles(files.filter(file => file._id !== fileId));
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div>
      <h2>Files</h2>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>File Name</th>
            <th>View</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
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
