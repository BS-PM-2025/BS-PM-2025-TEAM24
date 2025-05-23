import React, { useEffect, useState } from 'react';
import { FaUser, FaHome, FaSignOutAlt,FaInfoCircle,FaTools   } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from "react-router-dom";


const container = {
  position: 'fixed',          // Ensure it fills the screen
  top: 0,
  left: 0,
  width: '100vw',             // Full viewport width
  height: '100vh',            // Full viewport height
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
  backgroundSize: 'cover',    // Scale to cover full screen
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', // Avoid tiling
  overflow: 'hidden',
  zIndex: -1                  // Keep it behind all content
};
const header= {
    backgroundColor: '#4a6fa5',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color:'white'
  };
const logoImage= {
    width: '40px',
    height: '40px',
    marginRight: '10px'
  };
const logoHighlight= {
    color: '#ffde59'
  };
const tableStyle = {
  width: '100%',
  maxWidth: '1250px',
  margin: '10px auto',
  backgroundColor: '#f7f7f9',
  borderCollapse: 'collapse',
  borderRadius: '12px',
  overflow: 'auto',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
};

const thStyle = {
  backgroundColor: '#375a8c', // darker, elegant blue
  color: 'white',
  padding: '16px',
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderBottom: '2px solid #e0e0e0'
};

const tdStyle = {
  fontSize: '1.05rem',
  padding: '14px 12px',
  textAlign: 'center',
  backgroundColor: '#f4f7fb', // very light background
  color: '#333',
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold'
};

const buttonStyle = {
  backgroundColor: '#c0392b',
  color: 'white',
  padding: '6px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};
const menuItem= {
    display: 'flex',
    alignItems: 'center',
    padding: '0.4rem 0.8rem',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background 0.3s ease',
    gap: '0.5rem'
  };
  const activeMenuItem= {
  backgroundColor: 'white',
  color: '#4a6fa5',
  fontWeight: 'bold',
  borderRadius: '999px',
  padding: '0.4rem 1.2rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
};
const rightTitle= {
  color: 'white',
  fontSize: '2.1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};
const logo2= {
    display: 'flex',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: '900',
    color: 'white'
  };

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (!user || !user.accessToken) {
      alert('Not authorized. Please log in again.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/users/getAllUsers', {
        headers: {
          'x-access-token': user.accessToken,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok) {
        setUsers(result);
      } else {
        alert('Failed to fetch users.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while fetching users.');
    }
  };

  const deleteUser = async (userId) => {
    const user = JSON.parse(localStorage.getItem('userData'));
    const shouldDelete = window.confirm('Are you sure you want to delete this user?');
    if (!shouldDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/deleteUser`, {
        method: 'DELETE',
        headers: {
          'x-access-token': user.accessToken
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage') navigate('/AdminMain');
    else if (option === 'UsersList') navigate('/UserManagement');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  return (
    <div style={container}>
      <header style={{ ...header, justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={logo2}>
          <img src={logo} alt="Logo" style={logoImage} />
          House<span style={logoHighlight}>Fix</span>
        </div>

        {/* Center: Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/CustomerMain' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/UserManagement' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('UsersList')}
          >
            <FaTools /> Users List
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/ProfilePage' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          <div
            style={{
              ...menuItem,
              ...(location.pathname === '/login' ? activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Logout')}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>

        {/* Right: Page Title (e.g. MainPage) */}
        <div style={rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
        gap: '2rem',
        padding: '0 2rem',
      }}>

        {/* Table container on the right */}
        <div style={{ flex: 1 }}>
          <h1 style={{ textAlign: 'center' }}>Users List</h1>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Account Type</th>
                <th style={thStyle}>Gender</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.isWorker ? 'Worker' : user.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td style={tdStyle}>{user.gender}</td>
                  <td style={tdStyle}>
                    <button style={buttonStyle} onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UsersList;
