import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ControlPage from './ControlPage/ControlPage';
import SettingPage from './SettingPage/SettingPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/control" element={<ControlPage/>} />
        <Route path="/" element={<SettingPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
