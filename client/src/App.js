import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileList from './components/FileList';
import Main from './components/Main';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/file-structure" element={<FileList />} />
        </Routes>
    </Router>
  );
};

export default App;