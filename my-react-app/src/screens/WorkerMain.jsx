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
    overflowY: 'auto',
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
   menuItem: {
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
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '2rem',
    lineHeight: 1.8,
  },
  mainContentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '2rem 5%',
    gap: '2rem',
    alignItems: 'stretch',
    width:'75%',
    margin: '0 auto',
  },
  callsContainer: {
    flex: '1 1 60%',
    minWidth: '300px',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  callsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  callsTitle: {
    fontSize: '1.8rem',
    color: '#4a6fa5',
    fontWeight: 'bold',
    textAlign:'center'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    marginLeft: '0.5rem',
    width: '200px',
  },
  callCard: {
    padding: '1.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #4a6fa5',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  callType: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: '0.5rem',
  },
  callDetail: {
    display: 'flex',
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
  },
  detailLabel: {
    fontWeight: 'bold',
    minWidth: '100px',
    color: '#555',
  },
  acceptButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    transition: 'background 0.3s ease',
    '&:hover': {
      backgroundColor: '#375a8c',
    },
  },
  ratingContainer: {
    flex: '1 1 35%',
    minWidth: '300px',
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  ratingTitle: {
    fontSize: '1.8rem',
    color: '#4a6fa5',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    gap: '0.5rem',
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
    display: 'block',
    margin: '0 auto',
    padding: '0.8rem 2rem',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    '&:hover': {
      backgroundColor: '#375a8c',
    },
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
};

export default function CustomerMain() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

    let type;
    if (storedUser.workType === 'Plumber') type = 'Plumbing';
    else if (storedUser.workType === 'Electrician') type = 'Electricity';
    else if (storedUser.workType === 'Painter') type = 'Painting';
    else if (storedUser.workType === 'Handy Man') type = 'Other';

    try {
      const response = await fetch(`http://localhost:8000/api/events/getEventsByType/${type}`, {
        method: "GET",
        headers: {
          "x-access-token": storedUser.accessToken
        }
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setCalls(result);
      } else {
        alert("❌ Failed to fetch calls: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error fetching calls:", err);
      alert("An unexpected error occurred while fetching the calls.");
    }
  };

  const filteredCalls = calls.filter(call => 
    call.callType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.costumerdetails.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <div style={styles.container}>
    {/* ──────────────── HEADER ──────────────── */}
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

    {/* ──────────────── MAIN ROW ──────────────── */}
    <div style={styles.mainContentRow}>
      {/* Calls section */}
      <div style={styles.callsContainer}>
        <h2 style={styles.ratingTitle}>Available Calls</h2>

        {filteredCalls.length === 0 ? (
          <p>No calls available for your work type.</p>
        ) : (
          filteredCalls.map((call) => (
            <div key={call.callID} style={styles.callCard}>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Call Type:</span>
                <span>{call.callType}</span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Description:</span>
                <span>{call.description}</span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Customer:</span>
                <span>{call.costumerdetails.join(', ')}</span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Address:</span>
                <span>
                  {call.city}, {call.street} {call.houseNumber}
                </span>
              </div>
              <div style={styles.callDetail}>
                <span style={styles.detailLabel}>Date:</span>
                <span>{new Date(call.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating section */}
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