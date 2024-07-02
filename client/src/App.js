import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileList from './components/FileList';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<FileList />} />
        </Routes>
    </Router>
  );
};

export default App;