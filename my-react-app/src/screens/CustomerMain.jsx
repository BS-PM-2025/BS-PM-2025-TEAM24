import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaUser, FaHome, FaInfoCircle, FaSignOutAlt, FaTools } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Select from 'react-select';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#4a6fa5',
    marginBottom: '0.1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee',
    marginTop:'15px'
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
    zIndex: 2000,
    overflowY:'auto'
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    position: 'relative', 

  },
  modalTitle: {
    marginBottom: '1.5rem',
    color: '#4a6fa5',
    marginLeft:'140px',
    marginTop:'-0.8rem'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '0.2rem',
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
  mapBtn: {
    padding: '6px 6px',
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom:'20px'
  },
  mainContentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  star: {
    cursor: 'pointer',
    fontSize: '2rem',
    color: '#ccc',
    transition: 'color 0.2s ease',
  },
  activeStar: {
    color: '#ffc107',
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
  mapModal: (showMap) => ({
    display: showMap ? 'block' : 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    zIndex: 1000,
    border: '2px solid #4a6fa5',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
  }),
  closeBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1001,
    padding: '6px 14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  mapContainer: {
    width: '100%',
    height: '100%'
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#4a6fa5',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  formLabel2: {
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.3rem',
    color: '#4a6fa5',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee',
    marginTop:'-15px'
  }
};

export default function CustomerMain() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({ callType: '', city: '',street:'',houseNumber:'' , description: ''});
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const streetOptions = streets.map(street => ({
    value: street,
    label: street
  }));

  const [userData, setUserData] = useState({
    username: '',
    age: '',
    email: '',
    gender: '',
    userType: '',
    city: '',
    street: '',
    houseNumber: '',
    description: '', 
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
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          city: data.city || '',
          street: data.street || '',
          houseNumber: data.houseNumber || '',
          description: data.description || '',
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

  }, []);

  useEffect(() => {
    if (showMap) {
        setTimeout(() => {
        if (mapRef.current) {
            mapRef.current.off();
            mapRef.current.remove();
            mapRef.current = null;
            markerRef.current = null;
        }

        const map = L.map('leafletMap', { zoomControl: false }).setView([31.0461, 34.8516], 8);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        map.on('click', async (e) => {
            if (!markerRef.current) {
            const marker = L.marker(e.latlng, { draggable: true }).addTo(map);
            markerRef.current = marker;

            marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                await updateLocationFields(pos.lat, pos.lng,setFormData);
            });
            } else {
            markerRef.current.setLatLng(e.latlng);
            }

            await updateLocationFields(e.latlng.lat, e.latlng.lng,setFormData);
        });

        L.Control.geocoder({ defaultMarkGeocode: false })
            .on('markgeocode', async (e) => {
            const latlng = e.geocode.center;
            map.setView(latlng, 14);

            if (!markerRef.current) {
                const marker = L.marker(latlng, { draggable: true }).addTo(map);
                markerRef.current = marker;

                marker.on('dragend', async () => {
                const pos = marker.getLatLng();
                await updateLocationFields(pos.lat, pos.lng,setFormData);
            });
            } else {
                markerRef.current.setLatLng(latlng);
            }

            await updateLocationFields(latlng.lat, latlng.lng,setFormData);
            })
            .addTo(map);
        }, 0);
    }
  }, [showMap]);
  useEffect(() => {
      // Only run after userData is loaded AND city exists
      if (userData.city) {
        const cityOnly = userData.city.split('|')[0].split(',')[0].trim(); // extract Hebrew city name
        fetchStreetsByCity(cityOnly).then(setStreets);
      }
  }, [userData.city]);

  const updateLocationFields = async (lat, lng,setFormData) => {
    try {
      const [heData, enData] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`).then(res => res.json()),
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`).then(res => res.json())
      ]);
  
      const extract = (data) => {
        const a = data.address;
        const city = a.city || a.town || a.village || a.hamlet || a.state_district || a.state || "";
        const country = a.country || "";
        return { city, country };
      };
  
      const he = extract(heData);
      const en = extract(enData);
      const fullCity = `${he.city}, ${he.country} | ${en.city}, ${en.country}`;
      
      setFormData(prev => ({ ...prev, city: fullCity }));
      const streets = await fetchStreetsByCity(he.city);
      setStreets(streets); // ✅ new way to update streets
   
    } catch (err) {
      console.error('Error fetching city from coordinates:', err);
    }
  };

  const fetchStreetsByCity = async (cityName) => {
    try {
      const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&accept-language=he&limit=1&extratags=1`;
      const nomRes = await fetch(nominatimURL);
      const nomData = await nomRes.json();
  
      if (!nomData.length) {
        console.warn("City not found in Nominatim:", cityName);
        return [];
      }
  
      const { osm_id, osm_type } = nomData[0];
      let areaId;
  
      if (osm_type === "relation") {
        areaId = 3600000000 + parseInt(osm_id);
      } else if (osm_type === "way") {
        areaId = 2400000000 + parseInt(osm_id);
      } else if (osm_type === "node") {
        areaId = 1600000000 + parseInt(osm_id);
      } else {
        console.error("Unknown OSM type:", osm_type);
        return [];
      }
  
      const query = `
        [out:json][timeout:25];
        area(${areaId})->.searchArea;
        (
          way["highway"]["name"](area.searchArea);
        );
        out tags;
      `;
  
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
  
      const data = await response.json();
      const streetSet = new Set();
  
      data.elements.forEach(el => {
        if (el.tags?.name) {
          streetSet.add(el.tags.name);
        }
      });
  
      return [...streetSet].sort();
  
    } catch (err) {
      console.error("❌ Failed to load streets:", err);
      return [];
    }
  };

  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage') navigate('/CustomerMain');
    else if (option === 'MyCalls') navigate('/MyCalls');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };
  const handleOpenCall = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    if (!storedUser || !storedUser.accessToken) {
      alert("Unauthorized. Please log in again.");
      return;
    }
  
    // Validate required fields
    if (!formData.callType || !formData.city || !formData.street || !formData.houseNumber || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/events/addEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": storedUser.accessToken
        },
        body: JSON.stringify({
          callType: formData.callType,
          city: formData.city,
          street: formData.street,
          houseNumber: formData.houseNumber,
          description: formData.description,
          costumerdetails: [
            `Name: ${storedUser.name}`,
            `Age: ${storedUser.age}`,
            `Gender: ${storedUser.gender}`
          ],
          status:'Open'
          // callID is auto-generated by the DB schema
        })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Your call has been submitted successfully!");
        setShowModal(false);
        setFormData({ callType: '', city: '', street: '', houseNumber: '', description: '' });
      } else {
        alert("❌ Failed to submit call: " + result.message);
      }
    } catch (err) {
      console.error("❌ Error submitting call:", err);
      alert("An unexpected error occurred while submitting the call.");
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

  const cancelbtn = async () => {
    setShowModal(false);
    setFormData({ callType: '', city: '', street: '', houseNumber: '', description: '' });
  }

  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <h1 style={{ margin: 0 }}>
                <FaHome /> MainPage
            </h1>
          <FaBars onClick={() => setMenuOpen(!menuOpen)} style={styles.menuIcon} />
          {menuOpen && (
            <div style={styles.dropdown}>
              <div style={styles.menuItem} onClick={() => handleMenuSelect('MainPage')}>
                <FaHome /> MainPage
              </div>
              <div style={styles.menuItem} onClick={() => handleMenuSelect('MyCalls')}>
                <FaTools /> MyCalls
              </div>
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
      <div style={styles.mainContentRow}>
        <div style={styles.contentBox}>
            <h2 style={styles.welcome}>Welcome {userName}!</h2>
            <p style={styles.paragraph}>
            HouseFix helps you quickly find trusted professionals for your home repairs. Post a call and get offers from local workers allaround the country in the fastest time. <br /><br /> You can open a new call from here:
            </p>
            <button style={styles.openCallButton} onClick={() => setShowModal(true)}>
            <FaTools style={{ marginRight: '8px' }} /> Open Call
            </button>
            <p style={styles.paragraph}>
            <br />If you want to see an explaination about the website <a href="#" onClick={() => navigate('/HelpPage')}>Click Here</a>  
            </p>
        </div>

        {showModal && (
            <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                {/* X button to close */}
                <button
                    onClick={cancelbtn}
                    style={{
                    position: 'absolute',
                    top: '10px',
                    right: '14px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: 'black'
                    }}
                >
                    ×
                </button>

                <h1 style={styles.modalTitle}>Open New Call</h1>
                <h2 style={styles.sectionTitle}>Call Information</h2>

                <label style={styles.formLabel}>Call Type:</label>
                <select
                  style={styles.input}
                  value={formData.callType}
                  onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                >
                  <option value="">Select Call Type</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Painting">Painting</option>
                  <option value="Other">Other</option>
                </select>

                <label style={styles.formLabel}>Description:</label>
                <textarea
                  style={{ 
                    ...styles.input, 
                    height: '50px', 
                    resize: 'vertical', 
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                  placeholder="Add a description about the problem...."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div>
                  <h2 style={styles.sectionTitle}>Address Information</h2>
                  <button
                    style={styles.mapBtn}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        city: userData.city,
                        street: userData.street,
                        houseNumber: userData.houseNumber
                      }));
                    }}                  >
                    Select your SignUp Address
                  </button>
  
                  <h3 style={styles.formLabel2}>Or add another address:</h3>               
                  <div>
                    <label style={styles.formLabel}>City:</label>
                    <input
                      style={styles.input}
                      placeholder="Choose City from the map..."
                      value={formData.city}
                      readOnly
                    />
                    <button style={styles.mapBtn} onClick={() => setShowMap(true)}>
                        Open Map
                    </button>
                    {showMap && (
                    <div style={styles.mapModal(showMap)}>
                        <button style={styles.closeBtn} onClick={() => setShowMap(false)}>Close</button>
                        <div id="leafletMap" style={styles.mapContainer}></div>
                    </div>
                    )}
                  </div>

                  <label style={styles.formLabel}>Street:</label>
                  <Select
                      options={streetOptions}
                      value={streetOptions.find(option => option.value === formData.street)}
                      onChange={selected => setFormData(prev => ({ ...prev, street: selected.value }))}
                      placeholder="Select or search for a street"
                  />

                  <label style={styles.formLabel}>House Number:</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Add your House Number..."
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                    onClick={cancelbtn}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f0f0f0',
                        color: '#555',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                    >
                    Cancel
                    </button>
                    <button style={styles.submitBtn} onClick={handleOpenCall}>
                    Submit
                    </button>
                </div>
                </div>
            </div>
            )}
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
