import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <a href="index.html"><i className="fa fa-code"></i> DevConnector</a>
            </h1>
            <ul>
                <li><a href="profiles.html">Developers</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>
    )
}

export default Navbar
