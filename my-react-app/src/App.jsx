import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CustomerSignUp from './screens/CustomerSignUp.jsx';
import WorkerSignup from './screens/WorkerSignup.jsx'; 
import ForgotPassword from './screens/ForgotPassword.jsx';
import Login from './screens/Login.jsx';
import ProfilePage from './screens/ProfilePage.jsx'; 
import UserManagement from './screens/UserManagement.jsx'; 
import CustomerMain from './screens/CustomerMain.jsx'; 
import WorkerMain from './screens/WorkerMain.jsx'; 
import HelpPage from './screens/HelpPage.jsx'; 
import AdminMain from './screens/AdminMain.jsx'; 
import WorkerRequests  from './screens/WorkerRequests.jsx';
import WorkerJob       from './screens/WorkerJob.jsx';



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
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/CustomerMain" element={<CustomerMain />} />
        <Route path="/WorkerMain" element={<WorkerMain />} />
        <Route path="/HelpPage" element={<HelpPage />} />
        <Route path="/AdminMain" element={<AdminMain />} />
        <Route path="/WorkerRequests" element={<WorkerRequests />} />
        <Route
          path="/WorkerJob"
          element={
            <WorkerJob
              // pass in the full accepted‐calls list
              jobs={JSON.parse(localStorage.getItem('acceptedCallsFull')) || []}
              // on delete, remove from localStorage and reload so WorkerJob can refresh
              onDelete={callID => {
                const full = JSON.parse(localStorage.getItem('acceptedCallsFull')) || [];
                const updated = full.filter(j => j.callID !== callID);
                localStorage.setItem('acceptedCallsFull', JSON.stringify(updated));
                window.location.reload();
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
