import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaHome, FaInfoCircle, FaSignOutAlt, FaTools, FaStar, FaRegStar, FaSearch } from 'react-icons/fa';
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
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
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
  menuIcon: {
    fontSize: '1.6rem',
    cursor: 'pointer',
    marginLeft: '1.5rem',
  },
  dropdown: {
    position: 'absolute',
    top: '60px',
    right: '-28px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    width: '180px',
    padding: '2rem 1rem', // ↑ increase top/bottom padding
    zIndex: 2000,
    overflow: 'hidden',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    fontSize: '1rem',
    color: '#333',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    transition: 'background 0.2s ease',
    gap: '0.5rem'
  },
  activeMenuItem: {
    backgroundColor: 'white',
    color: '#4a6fa5',
    fontWeight: 'bold',
    borderRadius: '999px',
    padding: '0.4rem 1.2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  rightTitle: {
    color: 'white',
    fontSize: '2.1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  welcome: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#4a6fa5',
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '2rem',
    lineHeight: 1.8,
  },
  openCallButton: {
    padding: '12px 24px',
    fontSize: '1.1rem',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#4a6fa5'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  mainContentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap', // responsive for small screens
    padding: '4rem 5%',
    gap: '2rem',
    alignItems: 'stretch',  // ⬅️ ensures both boxes align in height

  },
  contentBox: {
    flex: '1 1 45%',
    minWidth: '300px',
    padding: '4rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  ratingContainer: {
    flex: '1 1 35%',
    minWidth: '300px',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    gap: '0.5rem',
  },
  ratingTitle: {
    fontSize: '2rem',
    color: '#4a6fa5', // darker blue to match header/logo
    marginBottom: '1rem'
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
    color: '#375a8c',  // darker blue
    marginBottom: '1rem',
    gap: '10px'
  },
  averageRating: {
    textAlign: 'center',
    margin: '1.5rem 0',
    fontSize: '1.2rem',
    color: '#4a6fa5',
    fontWeight: 'bold',
  },
  ratingList: {
    maxHeight: '300px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  ratingItem: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
    fontSize: '1.2rem',
  },
  ratingUser: {
    fontWeight: 'bold',
    color: '#4a6fa5',
  },
  ratingDate: {
    fontSize: '1rem',
    color: '#777',
    marginTop: '0.3rem',
  },
  star: {
    cursor: 'pointer',
    fontSize: '2rem',
    color: '#ccc',
    transition: 'color 0.2s ease',
  },
  activeStar: {
    color: '#ffc107',
  },
  submitRatingBtn: {
    marginTop: '1.2rem',
    padding: '10px 20px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    opacity: 1
  }
};

export default function CustomerMain() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [calls, setCalls] = useState([]);

  const fetchRatings = async () => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized: No token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/ratings/getAllRatings", {
        headers: {
          "x-access-token": storedUser.accessToken,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch ratings");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of ratings");
      }

      setRatings(data);
      const avg = data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length;
      setAverageRating(avg || 0);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };
   const handleDeleteRating = async (id) => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser?.accessToken) return;

    try {
      const res = await fetch(`http://localhost:8000/api/ratings/deleteRating/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': storedUser.accessToken }
      });
      if (!res.ok) throw new Error((await res.json()).message);

      const updated = ratings.filter((r) => r._id !== id);
      setRatings(updated);
      const avg = updated.reduce((s, r) => s + Number(r.rating), 0) / (updated.length || 1);
      setAverageRating(avg || 0);
      alert('Rating deleted ✅');
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
    
    fetchRatings();
    fetchCallsByType();
  }, []);

  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage') navigate('/WorkerMain');
    else if (option === 'MyWorks') navigate('/MyWorks');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert("Please select at least one star.");
      return;
    }
  
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("No token found. Please log in.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/ratings/addRating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedUser.accessToken,
        },
        body: JSON.stringify({
          username: storedUser.name,
          usertype: storedUser.isWorker ? 'worker' : 'customer',
          rating: rating,
        }),
      });
    
      const result = await response.json();
    
      if (response.ok) {
        alert("Thanks for your rating!");
        setRating(0);
    
        // Fetch updated ratings safely
        try {
          const refreshed = await fetch("http://localhost:8000/api/ratings/getAllRatings", {
            headers: {
              "x-access-token": storedUser.accessToken
            }
          }).then(res => res.json());
    
          setRatings(refreshed);
          const avg = refreshed.reduce((sum, r) => sum + Number(r.rating), 0) / refreshed.length;
          setAverageRating(avg || 0);
        } catch (fetchErr) {
          console.error("Error refreshing ratings:", fetchErr);
        }
      } else {
        alert("Failed to submit rating: " + result.message);
      }
    } catch (err) {
      alert("Error submitting rating");
      console.error(err);
    }
    
  };
  
  const fetchCallsByType = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken || !storedUser.workType) {
      alert("Unauthorized or missing work type. Please log in again.");
      return;
    }

    if (storedUser.workType=='Plumber')
      var type='Plumbing';
    else if (storedUser.workType=='Electrician')
      var type='Electricity';
    else if (storedUser.workType=='Painter')
      var type='Painting';
    else if (storedUser.workType=='Handy Man')
      var type='Other';

    try {
      const response = await fetch(`http://localhost:8000/api/events/getEventsByType/${type}`, {
        method: "GET",
        headers: {
          "x-access-token": storedUser.accessToken
        }
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setCalls(result); // Save calls to render them
      } else {
        alert("❌ Failed to fetch calls: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error fetching calls:", err);
      alert("An unexpected error occurred while fetching the calls.");
    }
  };
  

  return (
    <div style={styles.container}>
      <header style={{ ...styles.header, justifyContent: 'space-between' }}>
      {/* Left – Logo */}
      <div style={styles.logo}>
        <img src={logo} alt="Logo" style={styles.logoImage} />
        House<span style={styles.logoHighlight}>Fix</span>
      </div>

      {/* Center – Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/WorkerMain' ? styles.activeMenuItem : {})
          }}
          onClick={() => handleMenuSelect('MainPage')}
        >
          <FaHome /> MainPage
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/MyCalls' ? styles.activeMenuItem : {})
          }}
          onClick={() => handleMenuSelect('MyCalls')}
        >
          <FaTools /> MyWorks
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/ProfilePage' ? styles.activeMenuItem : {})
          }}
          onClick={() => handleMenuSelect('Profile')}
        >
          <FaUser /> Profile
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/HelpPage' ? styles.activeMenuItem : {})
          }}
          onClick={() => handleMenuSelect('Help')}
        >
          <FaInfoCircle /> Help
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === '/login' ? styles.activeMenuItem : {})
          }}
          onClick={() => handleMenuSelect('Logout')}
        >
          <FaSignOutAlt /> Logout
        </div>
      </div>

      {/* Right – Page title */}
      <div style={styles.rightTitle}>
        <FaHome />
        MainPage
      </div>
    </header>
      <div style={styles.mainContentRow}>
        <div style={styles.contentBox}>
            <h2 style={styles.welcome}>Welcome {userName}!</h2>
            <p style={styles.paragraph}>
            Here you can see al the Calls that belongs to your work type, ypu can accept any call you want and wait for the customer respond:             
            </p>

            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginTop: '1rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              {calls.length === 0 ? (
                <p>No calls available for your work type.</p>
              ) : (
                calls.map((call) => (
                  <div key={call.callID} style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '6px'
                  }}>
                    <strong>Call Type:</strong> {call.callType}<br />
                    <strong>Description:</strong> {call.description}<br />
                    <strong>Customer:</strong> {call.costumerdetails.join(', ')}<br />
                    <strong>Address:</strong> {call.city}, {call.street} {call.houseNumber}<br />
                    <strong>Date:</strong> {new Date(call.date).toLocaleDateString()}
                  </div>
                ))
              )}
            </div>

            <p style={styles.paragraph}>
            <br />If you want to see an explaination about the website <a href="#" onClick={() => navigate('/HelpPage')}>Click Here</a>  
            </p>
        </div>
            {/* Rating Section */}
            <div style={styles.ratingContainer}>
              <h3 style={styles.ratingTitle}>Rate Your Experience</h3>

              {/* Stars picker */}
              <div style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= rating ? (
                    <FaStar
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ ...styles.star, ...styles.activeStar }}
                    />
                  ) : (
                    <FaRegStar
                      key={star}
                      onClick={() => setRating(star)}
                      style={styles.star}
                    />
                  )
                )}
              </div>

              <button style={styles.submitRatingBtn} onClick={handleRatingSubmit}>
                Submit Rating
              </button>

              {ratings.length > 0 && (
                <>
                  {/* Average */}
                  <div style={styles.averageRating}>
                    Overall Rating: {averageRating.toFixed(1)} / 5 ★
                  </div>

                  {/* List */}
                  <div style={styles.ratingList}>
                    <h4>Recent Ratings</h4>
                    {ratings.map((entry) => {
                      const date = new Date(entry.date).toLocaleDateString('en-GB');
                      const user = JSON.parse(localStorage.getItem('userData'));
                      const isOwner =
                        user?.name?.toLowerCase() ===
                        entry.username?.toLowerCase();

                      return (
                        <div key={entry._id} style={styles.ratingItem}>
                          <div style={styles.ratingUser}>
                            {entry.username} ({entry.usertype}) –{' '}
                            {'★'.repeat(entry.rating)}
                          </div>

                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                          >
                            <span style={styles.ratingDate}>{date}</span>

                            {isOwner && (
                              <button
                                onClick={() => handleDeleteRating(entry._id)}
                                style={{
                                  background: '#dc3545',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 12,
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
        </div>
    </div>
  );
}
