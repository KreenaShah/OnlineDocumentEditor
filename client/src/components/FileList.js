import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TinyMCEEditor from './TinyMCEEditor';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/all');
        setFiles(res.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // const handleViewFile = (fileId) => {
  //   window.open(`http://localhost:5000/file/${fileId}`, '_blank');
  // };

  const handleViewFile = (fileId) => {
    setSelectedFileId(fileId);
};

  const handleEditFile = (fileId) => {
    // Implement edit functionality if needed
    console.log('Edit file:', fileId);
  };

  const handleDeleteFile = (fileId) => {
    // Implement delete functionality if needed
    console.log('Delete file:', fileId);
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
              <td><a href={`http://localhost:5000/${file._id}`} target="_blank" rel="noopener noreferrer">{file.filename}</a></td>
              <td>
                <button onClick={() => handleViewFile(file._id)}>View</button>
              </td>
              <td>
                <button onClick={() => handleEditFile(file._id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteFile(file._id)}>Delete</button>
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
