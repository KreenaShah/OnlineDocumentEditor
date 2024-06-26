import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/files" element={<FileList />} />
        </Routes>
    </Router>
  );
};

export default App;