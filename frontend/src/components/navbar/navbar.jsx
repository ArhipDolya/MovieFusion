import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './navbar.css'


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        
        <nav>
            <Link to="/" className="title">
                MovieFusion
            </Link>
            <div className='menu' onClick={() => {
                setMenuOpen(!menuOpen)
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                <li>
                    <NavLink to="/favorite-movies">Favorite Movies</NavLink>
                </li>
                <li>
                    <NavLink to="/movies">Movies</NavLink>
                </li>
                <li>
                    <NavLink to="/categories">Categories</NavLink>
                </li>
                <li>
                    <NavLink to="/authentication">Sign In</NavLink>
                </li>
            </ul>
        </nav>
        
    );
}

export default Navbar;
