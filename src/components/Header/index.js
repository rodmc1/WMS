import './style.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header>
      <NavLink to="/">
        <img src="/assets/images/logo.svg" alt="Warehouse Management System"/>
      </NavLink>
    </header>
  )
}

export default Header;