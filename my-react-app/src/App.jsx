import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ForgotPassword from './screens/ForgotPassword.jsx';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
