import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import './CustomSidePane.css';
import {Link} from 'react-router-dom'
import { useAuth } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
const CustomSidePane = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const {LogoutUser,user} =useAuth()
  const logout=()=>{
    console.log("hello world")
    LogoutUser()
    
    navigate("/Login")
  }

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Body className="offcanvas-bg">
        <button type="button" class="btn border-0 btn-lg active text-left">
          <Link to='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
        </button>
        <button type="button" class="btn border-0 btn-lg active text-left">
          <Link to='/leaderboard' style={{ textDecoration: 'none', color: 'inherit' }}>LeaderBoard</Link>
        </button>
        <button type="button" class="btn border-0 btn-lg active text-left">
          <Link to='/friends' style={{ textDecoration: 'none', color: 'inherit' }}>Friends</Link>
        </button>
        <button type="button" class="btn border-0 btn-lg active text-left" onClick={logout}>LogOut
        </button>
        <button type="button" class="btn border-0 btn-lg active text-left">
          <Link to='/contactus' style={{ textDecoration: 'none', color: 'inherit' }}>ContactUs</Link>
        </button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CustomSidePane;