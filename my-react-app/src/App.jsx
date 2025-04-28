import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CustomerSignUp from './screens/CustomerSignUp.jsx';




function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;
