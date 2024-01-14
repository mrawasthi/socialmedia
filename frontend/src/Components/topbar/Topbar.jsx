// src/components/TopBar.jsx
import React, { useState } from 'react';
import './topBar.css'; 
import { Link } from 'react-router-dom';
import CustomNavbar from './CustomNav';
import CustomSidePane from './SidePane';
import 'bootstrap/dist/css/bootstrap.min.css';

const TopBar = () => {
    const [showSidePane, setShowSidePane] = useState(false);
  
    const toggleSidePane = () => {
      setShowSidePane(!showSidePane);
    };
  
    const handleCloseSidePane = () => {
      setShowSidePane(false);
    };
  
    return (
      <div className="app">
        <CustomNavbar toggleSidePane={toggleSidePane} />
        <CustomSidePane show={showSidePane} handleClose={handleCloseSidePane} />
        {/* Add your main content here */}
      </div>
    );
  };


export default TopBar;
