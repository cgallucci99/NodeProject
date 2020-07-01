import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LogoutPage = ({ setAuthenticated }) => {
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch("http://localhost:8000/api/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        }).then(response => {
            console.log(`response: ${response}`)
            if (response.status === 200) return response.json();
            throw new Error("failed to authenticate user");
        }).then(responseJSON => {
            setMessage(responseJSON.message);
            setAuthenticated(false);
        }).catch(err => {
            console.log(err);
        });
    }, []);
    return (
        <div className="container" style={{ height: "80vh" }}>
            <div className="alert alert-success">
                {message}
                <Link className="ml-3 btn btn-primary" to="/" >Return to Home Page</Link>
            </div>
        </div>
    );
}

export default LogoutPage;