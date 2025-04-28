import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CustomerSignUp from './screens/CustomerSignUp.jsx';
import WorkerSignup from './screens/WorkerSignup.jsx'; 
import ForgotPassword from './screens/ForgotPassword.jsx';
import Login from './screens/Login.jsx';
import ProfilePage from './screens/ProfilePage.jsx'; 





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        <Route path="/WorkerSignup" element={<WorkerSignup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />


      </Routes>
    </Router>
  );
}

export default App;
