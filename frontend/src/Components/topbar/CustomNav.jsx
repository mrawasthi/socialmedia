import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './CustomNav.css'

const CustomNavbar = ({ toggleSidePane }) => {
  return (
    <Navbar  className="ToggleButton">
      <Nav className="ToggleLeftOuter">
        <div className="icon"><i class="fa-solid fa-keyboard"></i></div>
        <Navbar.Brand href="#home" className="ToggleLeftUpper">TypeMASTER</Navbar.Brand>
      </Nav>
      <Nav className="ToggleRightUpper">
        <Nav.Link onClick={toggleSidePane} className="ToggleRight"><button type="button" class="btn btn-bg btn-dark text-white"><i class="fa-solid fa-house"></i></button></Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
