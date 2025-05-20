import React, { useEffect, useState } from 'react';
import { FaUser, FaHome, FaSignOutAlt,FaInfoCircle,FaBars,FaUsers  } from 'react-icons/fa';
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
const Logo= {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'white'
  };
const logoImage= {
    width: '40px',
    height: '40px',
    marginRight: '10px'
  };
const logoHighlight= {
    color: '#ffde59'
  };
const nav= {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };
const navLink= {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  };
const tabIcon= {
  fontSize: '1rem',
  width: '20px'
};

const tableStyle = {
  width: '100%',
  maxWidth: '1250px',
  margin: '25px auto',
  backgroundColor: '#fff',
  borderCollapse: 'collapse',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  maxHeight: 'calc(100vh - 200px)', // fits within the screen
  overflowY: 'auto',
  overflowX: 'hidden'
};

const thStyle = {
  backgroundColor: '#4a6fa5',
  color: 'white',
  padding: '15px',
  textAlign: 'center'
};

const tdStyle = {
  fontSize: '1.2rem',
  padding: '15px',
  textAlign: 'center',
  backgroundColor: '#aed6f1'
};

const buttonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '8px 15px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};
const menuIcon= {
  fontSize: '1.6rem',
  color: 'white',
  cursor: 'pointer',
  marginLeft: '1.5rem',
};
const dropdown= {
  position: 'absolute',
  top: '52px',
  right: '-28px',  // ✅ add this line to align it to the right
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  maxWidth: '200px',
  minWidth: '180px',
  padding: '2rem 0', // ↑ increase top/bottom padding
  overflow: 'hidden',
  zIndex: 2000,
};

const menuItem= {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 1.4rem',
  gap: '0.75rem',
  fontSize: '1rem',
  color: '#333',
  backgroundColor: 'white',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  transition: 'background 0.2s ease',
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
      <header style={header}>
          <div style={Logo}>
            <img src={logo} alt="Logo" style={logoImage} />
            House<span style={logoHighlight}>Fix</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <h1 style={{ margin: 0 }}>
              <FaUsers /> Users List
            </h1>
            <FaBars onClick={() => setMenuOpen(!menuOpen)} style={menuIcon} />
            {menuOpen && (
              <div style={dropdown}>
                <div style={menuItem} onClick={() => handleMenuSelect('MainPage')}>
                  <FaHome /> MainPage
                </div>
                <div style={menuItem} onClick={() => handleMenuSelect('UsersList')}>
                  <FaUsers /> Users List
                </div>
                <div style={menuItem} onClick={() => handleMenuSelect('Profile')}>
                  <FaUser /> Profile
                </div>
                <div style={menuItem} onClick={() => handleMenuSelect('Logout')}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
        </header>
      <main>
        <h1 style={{ textAlign: 'center' }}>Users List</h1>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>User Number</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Account Type</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td style={tdStyle}>{index + 1}</td>
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
      </main>
    </div>
  );
};

export default UsersList;
