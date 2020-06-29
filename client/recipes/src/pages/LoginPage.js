import React from 'react';

const LoginPage = () => {
    const login = () => {
        window.open("http://localhost:8000/api/auth/google", "_self");
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <h2>Welcome to Recipes!</h2>
                    <p>Login to gain access to saving recipes and more!</p>
                    <button className="btn btn-primary" onClick={() => login()} >Sign in with google</button>
                </div>
                <div className="col-3"></div>
            </div>

        </div>
    )
}

export default LoginPage;