import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CustomerSignUp from './screens/CustomerSignUp.jsx';
import WorkerSignup from './screens/WorkerSignup.jsx'; 
import ForgotPassword from './screens/ForgotPassword.jsx';



function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        <Route path="/WorkerSignup" element={<WorkerSignup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
