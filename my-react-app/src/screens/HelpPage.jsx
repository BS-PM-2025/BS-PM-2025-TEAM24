import React, { useState, useEffect } from 'react';
import {FaTools, FaQuestionCircle, FaBars, FaUser, FaSignOutAlt, FaInfoCircle,FaHome  } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    display: 'flex',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'rgba(74, 111, 165, 0.9)',
    padding: '1.4rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  logoImage: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  logoHighlight: {
    color: '#ffde59',
  },
  content: {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '4rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxHeight: 'calc(100vh - 6rem)',
    overflow: 'hidden',
  },
  sectionTitle: {
    color: '#4a6fa5',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    marginTop: '0.5rem',
  },
  paragraph: {
    lineHeight: 2,
    color: '#333',
    marginBottom: '1.5rem',
  },
  menuIcon: {
    fontSize: '1.6rem',
    cursor: 'pointer',
    marginLeft: '1.5rem',
  },
  dropdown: {
    position: 'absolute',
    top: '66px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '200px',
    minWidth: '150px',
    padding: '2rem 1rem', // ↑ increase top/bottom padding
    overflow: 'hidden',
    zIndex: 2000,
  },
  menuItem: {
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
  },
  
};

export default function HelpPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    userType: '',
    _id: ''
  });
  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const storedUser = JSON.parse(localStorage.getItem('userData'));
          if (!storedUser || !storedUser.accessToken) {
            navigate('/login');
            return;
          }
  
          const response = await fetch(`http://localhost:8000/api/users/${storedUser.id}`, {
            headers: {
              'x-access-token': storedUser.accessToken
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const data = await response.json();
  
          setUserData({
            userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
            _id: data._id || ''
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [navigate]);
  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage'){
      if (userData.userType=='Worker')
       navigate('/WorkerMain');
      else if(userData.userType=='Admin')
        navigate('/UserManagement');
      else if(userData.userType=='Customer')
        navigate('/CustomerMain');
    }
    else if (option === 'MyWorks') navigate('/MyWorks');
    else if (option === 'MyCalls') navigate('/MyCalls');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <h1 style={{ margin: 0 }}>
            <FaQuestionCircle /> Help
          </h1>
          <FaBars onClick={() => setMenuOpen(!menuOpen)} style={styles.menuIcon} />
            {menuOpen && (
            <div style={styles.dropdown}>
                <div style={styles.menuItem} onClick={() => handleMenuSelect('MainPage')}>
                <FaHome /> MainPage
                </div>
                {/* Conditionally render menu items */}
                {userData.userType === 'Worker' && (
                  <div style={styles.menuItem} onClick={() => navigate('/MyWorks')}>
                    <FaTools /> MyWorks
                  </div>
                )}

                {userData.userType === 'Customer' && (
                  <div style={styles.menuItem} onClick={() => navigate('/MyCalls')}>
                    <FaTools /> MyCalls
                  </div>
                )}
                <div style={styles.menuItem} onClick={() => handleMenuSelect('Profile')}>
                <FaUser /> Profile
                </div>
                <div style={styles.menuItem} onClick={() => handleMenuSelect('Help')}>
                <FaInfoCircle /> Help
                </div>
                <div style={styles.menuItem} onClick={() => handleMenuSelect('Logout')}>
                <FaSignOutAlt /> Logout
                </div>
            </div>
            )}

        </div>
      </header>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Welcome to HouseFix!</h2>
        <p style={styles.paragraph}>
          HouseFix helps you connect with local service providers or find work as one,
          Whether you’re a customer or a worker. <br /> Here’s how to make the most of the platform:
        </p>

        <h2 style={styles.sectionTitle}>For Customers</h2>
        <p style={styles.paragraph}>
          - Open a new call about what you want to fix in your house by clicking the "Open Call" button in the "MainPage".<br />
          - View call history and track status via the "MyCalls" page.<br />
          - Review worker requests and pick based on their location or details.<br />
          - Manage your profile and password through the "Profile" page.
        </p>

        <h2 style={styles.sectionTitle}>For Workers</h2>
        <p style={styles.paragraph}>
          - Browse open calls in the "MainPage" and accept jobs matching your work type.<br />
          - Track accepted or completed jobs in "MyWork".<br />
          - Update your profile or password in the "Profile" page.<br />
          - Add a personal description so customers know who they're working with.
        </p>
      </div>
    </div>
  );
}
