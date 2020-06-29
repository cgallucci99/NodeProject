import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [searchText, setSearchText] = useState('');
//<Link className="btn btn-primary" to={'/search?' + searchText} >Search</Link>
    return (
        <div className="container">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <h2>Welcome to the Recipes Home Page!</h2>
                    <form className="form-inline" action="/search" method='GET'>
                        <input value={searchText} name='search' onChange={(event) => setSearchText(event.target.value)} type="text" className="form-control" placeholder="Enter your search"></input>
                        <button className='btn btn-primary' type='submit' >Search</button>
                    </form>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    );
}

export default HomePage;