import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdMovie } from 'react-icons/md';
import { TbCategory2 } from 'react-icons/tb'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { LuLogIn } from 'react-icons/lu'

import './navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <nav>
            <Link to="/" className="title">
                MovieFusion
            </Link>
            <div
                className="menu"
                onClick={() => {
                    setMenuOpen(!menuOpen);
                }}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? 'open' : ''}>
                <li>
                    <NavLink to="/favorite-movies"> <MdOutlineFavoriteBorder /> Favorite Movies</NavLink>
                </li>
                <li>
                    <NavLink to="/movies">
                        <MdMovie /> Movies
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/categories"> <TbCategory2 /> Categories</NavLink>
                </li>
                <li>
                    <NavLink to="/authentication"> <LuLogIn /> Sign In</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
