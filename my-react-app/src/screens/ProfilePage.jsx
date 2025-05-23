import React, { useState, useRef, useEffect } from 'react';
import {FaUsers,FaTools, FaUser, FaEdit, FaLock, FaHome, FaEnvelope, FaVenusMars, FaCalendarAlt, FaMapMarkerAlt, FaSignOutAlt,FaInfoCircle,FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Select from 'react-select';
import logo from '../assets/images/logo.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [setShowStreetFields] = useState(false);
  const [streets, setStreets] = useState([]);
  const mapRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [originalUserData, setOriginalUserData] = useState(null);
  const markerRef = useRef(null);
  
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
    workType:'',
    city: '',
    street: '',
    houseNumber: '',
    description: '', 
    _id: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data from backend
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
        setOriginalUserData(data);

        setUserData({
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          workType:data.workType||'',
          city: data.city || '',
          street: data.street || '',
          houseNumber: data.houseNumber || '',
          description: data.description || '',
          _id: data._id || ''
        });
        setOriginalUserData({
          username: data.name || '',
          age: data.age || '',
          email: data.email || '',
          gender: data.gender || '',
          userType: data.isAdmin ? 'Admin' : data.isWorker ? 'Worker' : 'Customer',
          workType:data.workType||'',
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
                await updateLocationFields(pos.lat, pos.lng);
            });
            } else {
            markerRef.current.setLatLng(e.latlng);
            }

            await updateLocationFields(e.latlng.lat, e.latlng.lng, setUserData);
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
                await updateLocationFields(pos.lat, pos.lng, setUserData);
            });
            } else {
                markerRef.current.setLatLng(latlng);
            }

            await updateLocationFields(latlng.lat, latlng.lng,setUserData);
            })
            .addTo(map);
        }, 0);
    }
    }, [showMap]);
      

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser || !storedUser.accessToken) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${userData._id}/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedUser.accessToken
        },
        body: JSON.stringify({
          name: userData.username,
          age: userData.age,
          email: userData.email,
          gender: userData.gender,
          workType: userData.workType,
          city: userData.city,
          street: userData.street,
          houseNumber: userData.houseNumber,
          description: userData.description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // ✅ Update state
      setUserData(prev => ({
        ...prev,
        username: updatedUser.name || prev.username,
        age: updatedUser.age || prev.age,
        email: updatedUser.email || prev.email,
        gender: updatedUser.gender || prev.gender,
        workType: updatedUser.workType || prev.workType,
        city: updatedUser.city || prev.city,
        street: updatedUser.street || prev.street,
        houseNumber: updatedUser.houseNumber || prev.houseNumber,
        description: updatedUser.description || prev.description
      }));

      // ✅ Update localStorage
      localStorage.setItem('userData', JSON.stringify({
        ...storedUser,
        workType: updatedUser.workType || userData.workType
      }));

      setActiveTab('general'); 
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      alert('Error updating profile: ' + err.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // Validate passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New passwords don't match");
        return;
      }
  
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (!storedUser || !storedUser.accessToken) {
        navigate('/login');
        return;
      }
  
      // Note: Changed endpoint from updateUser to updatePassword
      const response = await fetch(`http://localhost:8000/api/users/${userData._id}/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedUser.accessToken
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Use server error message if available
        throw new Error(result.message || 'Failed to update password');
      }
  
      // Clear password fields on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setActiveTab('general');         // 🔥 go back to General
      alert(result.message || 'Password updated successfully!');
    } catch (err) {
      console.error('Password update error:', err);
      alert(`Error updating password: ${err.message || 'Unknown error occurred'}`);
    }
  };

  const updateLocationFields = async (lat, lng, setUserData) => {
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
  
      setUserData(prev => ({ ...prev, city: fullCity }));
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
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  useEffect(() => {
    // Only run after userData is loaded AND city exists
    if (userData.city) {
      const cityOnly = userData.city.split('|')[0].split(',')[0].trim(); // extract Hebrew city name
      fetchStreetsByCity(cityOnly).then(setStreets);
    }
  }, [userData.city]);
  
  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === 'MainPage'){
      if (userData.userType=='Worker')
       navigate('/WorkerMain');
      else if(userData.userType=='Admin')
        navigate('/AdminMain');
      else if(userData.userType=='Customer')
        navigate('/CustomerMain');
    }
    else if (option === 'MyWorks') navigate('/MyWorks');
    else if (option === 'MyCalls') navigate('/MyCalls');
    else if (option === 'UsersList') navigate('/UserManagement');
    else if (option === 'Profile') navigate('/ProfilePage');
    else if (option === 'Help') navigate('/HelpPage');
    else if (option === 'Logout') {
      localStorage.removeItem('userData');
      navigate('/login');
    }
  };

  // All styles defined as a JavaScript object
  const styles = {
    select: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px' },
  container: {
    position: 'fixed',          // Ensure it fills the screen
    top: 0,
    left: 0,
    width: '100vw',             // Full viewport width
    height: '100vh', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url("https://images.unsplash.com/photo-1570129477492-45c003edd2be")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat' ,// Avoid tiling
    overflow: 'hidden'

  },
  header: {
    position: 'fixed',
    width: '97%',
    backgroundColor: '#4a6fa5',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    color: 'white',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'white'
  },
  logoImage: {
    width: '40px',
    height: '40px',
    marginRight: '10px'
  },
  logoHighlight: {
    color: '#ffde59'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',

  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  },
  navActive: {
    color: '#ffde59',
    fontWeight: 600
  },
    main: {
      marginTop: '80px', // adjust based on header height
      display: 'flex',
      flex: 1,
      maxWidth: '1200px',
      margin: '5.5rem auto',
      width: '100%',
      gap: '2rem',
      padding: '0 1rem'
    },
    sidebar: {
      width: '280px',
      flexShrink: 0
    },
    userCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    userAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#4a6fa5',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem'
    },
    avatarIcon: {
      fontSize: '2rem'
    },
    userName: {
      fontSize: '1.2rem',
      marginBottom: '0.5rem'
    },
    userRole: {
      backgroundColor: 'rgba(74, 111, 165, 0.1)',
      color: '#4a6fa5',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 600,
      display: 'inline-block'
    },
    profileTabs: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '0.5rem 0'
    },
    tabBtn: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      border: 'none',
      background: 'none',
      textAlign: 'left',
      fontSize: '0.95rem',
      color: '#343a40',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      backgroundColor: 'rgba(74, 111, 165, 0.1)',
      color: '#4a6fa5',
      borderLeft: '3px solid #4a6fa5'
    },
    tabIcon: {
      fontSize: '1rem',
      width: '20px'
    },
    content: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '2rem'
    },
    section: {
      marginBottom: '1.5rem',
      maxHeight: 'calc(100vh - 200px)', // fits within the screen
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#4a6fa5',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #eee'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    formRow: {
      display: 'flex',
      gap: '1rem'
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      color: '#343a40',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    inputIcon: {
      color: '#4a6fa5',
      fontSize: '0.9rem'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    formInputFocus: {
      outline: 'none',
      borderColor: '#4a6fa5',
      boxShadow: '0 0 0 2px rgba(74, 111, 165, 0.2)'
    },
    formInputDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#666',
      cursor: 'not-allowed'
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #eee'
    },
    saveBtn: {
      backgroundColor: '#4a6fa5',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    saveBtnHover: {
      backgroundColor: '#166088'
    },
    cancelBtn: {
      backgroundColor: '#f0f0f0',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    cancelBtnHover: {
      backgroundColor: '#e0e0e0'
    },
    loading: {
      textAlign: 'center',
      padding: '2rem'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      padding: '1rem'
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
      mapButton: {
        marginTop: '10px',
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        backgroundColor: '#4a6fa5',
        color: 'white',
        cursor: 'pointer'
      },
      menuIcon: {
        fontSize: '1.6rem',
        color: 'white',
        cursor: 'pointer',
        marginLeft: '1.5rem',
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
  };

  if (loading) {
    return <div style={styles.loading}>Loading profile data...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
     <header style={{ ...styles.header, justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={styles.logo}>
          <img src={logo} alt="Logo" style={styles.logoImage} />
          House<span style={styles.logoHighlight}>Fix</span>
        </div>

        {/* Center: Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/CustomerMain' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('MainPage')}
          >
            <FaHome /> MainPage
          </div>
          {userData.userType === 'Customer' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/MyCalls' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MyCalls')}
            >
              <FaTools /> MyCalls
            </div>
          )}
          {userData.userType === 'Worker' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/MyWorks' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('MyWorks')}
            >
              <FaTools /> MyWorks
            </div>
          )}
          {userData.userType === 'Admin' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/UserManagement' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('UsersList')}
            >
              <FaTools /> Users List
            </div>
           )}
          <div
            style={{
              ...styles.menuItem,
              ...(location.pathname === '/ProfilePage' ? styles.activeMenuItem : {})
            }}
            onClick={() => handleMenuSelect('Profile')}
          >
            <FaUser /> Profile
          </div>
          {userData.userType !== 'Admin' && (
            <div
              style={{
                ...styles.menuItem,
                ...(location.pathname === '/HelpPage' ? styles.activeMenuItem : {})
              }}
              onClick={() => handleMenuSelect('Help')}
            >
              <FaInfoCircle /> Help
            </div>
          )}
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

        {/* Right: Page Title (e.g. MainPage) */}
        <div style={styles.rightTitle}>
          <FaHome />
          MainPage
        </div>
      </header>
  
      {/* Main Content */}
      <main style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
            <h3 style={styles.userName}>{userData.username}</h3>
            <p style={styles.userRole}>{userData.userType}</p>
          </div>
  
          <nav style={styles.profileTabs}>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'general' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('general');
                setEditMode(false);
              }}
            >
              <FaUser style={styles.tabIcon} /> General
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'edit' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('edit');
                setEditMode(true);
              }}
            >
              <FaEdit style={styles.tabIcon} /> Change Details
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(activeTab === 'password' ? styles.activeTab : {})
              }}
              onClick={() => {
                setActiveTab('password');
                setEditMode(false);
              }}
            >
              <FaLock style={styles.tabIcon} /> Change Password
            </button>
          </nav>
        </div>
  
        {/* Profile Content */}
        <div style={styles.content}>
          {(activeTab === 'general' || activeTab === 'edit') && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaUser style={styles.inputIcon} /> Username:
                </label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaCalendarAlt style={styles.inputIcon} /> Age:
                </label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaEnvelope style={styles.inputIcon} /> Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                />
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaVenusMars style={styles.inputIcon} /> Gender:
                </label>
                <select
                  name="gender"
                  value={["male", "female", "other"].includes(userData.gender.toLowerCase()) ? capitalizeFirstLetter(userData.gender) : "Other"}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>User Type:</label>
                <input
                  type="text"
                  value={userData.userType}
                  style={{
                    ...styles.formInput,
                    ...styles.formInputDisabled
                  }}
                  disabled
                />
              </div>
              {userData.userType === 'Worker' && (
                <div className={styles.formGroup}>
                  <label style={styles.formLabel}>
                   Work Type:
                  </label>
                  <select
                  name="workType"
                  value={userData.workType}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                  }}
                  disabled={activeTab !== 'edit'}
                >
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Painter">Painter</option>
                  <option value="Handy Man">Handy Man</option>
                </select>
                </div>
              )}
              {userData.userType === 'Worker' && (
                <div className={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <FaHome style={styles.inputIcon} /> Description:
                  </label>
                  <textarea
                    name="description"
                    value={userData.description}
                    onChange={handleInputChange}
                    style={{
                      ...styles.formInput,
                      ...(activeTab !== 'edit' ? styles.formInputDisabled : {}),
                      height: '90px', // make it taller
                      resize: 'vertical'
                    }}
                    disabled={activeTab !== 'edit'}
                    placeholder="Enter a brief description about your services"
                  />
                </div>
              )}

  
              <h2 style={styles.sectionTitle}>Address Information</h2>
  
              <div style={styles.formGroup}>
                <label style={styles.formLabel2}>
                  <FaMapMarkerAlt style={styles.inputIcon} /> City:
                </label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                  style={{
                    ...styles.formInput,
                    ...styles.formInputDisabled
                  }}
                  disabled
                />
                {activeTab === 'edit' && (
                  <div>
                    <button style={styles.mapButton} onClick={() => setShowMap(true)}>
                      Choose from Map
                    </button>
                  </div>
                )}
  
                {showMap && (
                <div style={styles.mapModal(showMap)}>
                    <button style={styles.closeBtn} onClick={() => setShowMap(false)}>Close</button>
                    <div id="leafletMap" style={styles.mapContainer}></div>
                </div>
                )}
              </div>
  
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Street:</label>
                  <input
                    type="text"
                    value={userData.street}
                    disabled
                    style={{
                      ...styles.formInput,
                      backgroundColor: '#edf0f2',
                      cursor: 'not-allowed',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <Select
                    options={streetOptions}
                    value={streetOptions.find(option => option.value === userData.street)}
                    onChange={selected => setUserData(prev => ({ ...prev, street: selected.value }))}
                    isDisabled={activeTab !== 'edit'}
                    placeholder="Select or search for a street"
                  />
                </div>
  
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>House Number:</label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={userData.houseNumber}
                    onChange={handleInputChange}
                    style={{
                      ...styles.formInput,
                      ...(activeTab !== 'edit' ? styles.formInputDisabled : {})
                    }}
                    disabled={activeTab !== 'edit'}
                  />
                </div>
              </div>
  
              {activeTab === 'edit' && (
                <div style={styles.formActions}>
                  <button style={styles.saveBtn} onClick={handleSave}>
                    Save Changes
                  </button>
                  <button 
                    style={styles.cancelBtn} 
                    onClick={() => {
                      setEditMode(false);
                      setActiveTab('general');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
  
          {activeTab === 'password' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Change Password</h2>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Enter current password"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Enter new password"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.formInput}
                  placeholder="Confirm new password"
                />
              </div>
              <button style={styles.saveBtn} onClick={handlePasswordUpdate}>
                Update Password
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;