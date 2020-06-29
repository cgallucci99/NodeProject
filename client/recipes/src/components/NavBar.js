import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ user, authenticated }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Recipes</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        {/* TODO */}
                        <a className="nav-link" href="#">Link</a>
                    </li>

                </ul>
                {!authenticated ? (
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/login">Login</Link>
                ) : (
                    <>
                    <span className="navbar-text mr-2">Welcome, {user.name.givenName}</span>
                    <Link className="btn btn-outline-success my-2 my-sm-0" to="/logout">Logout</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;