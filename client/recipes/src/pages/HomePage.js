import React, { useState } from 'react';

const HomePage = () => {
    const [searchText, setSearchText] = useState('');
    //<Link className="btn btn-primary" to={'/search?' + searchText} >Search</Link>
    return (
        <div className="container text-center" style={{ height: "80vh" }}>
            <h2 >Welcome to the Recipes Home Page!</h2>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <form className="" action="/search" method='GET'>
                        <div className="input-group mx-auto">
                            <input value={searchText} name='search' onChange={(event) => setSearchText(event.target.value)} type="text" className="form-control" placeholder="Enter your search"></input>
                            <div className="input-group-append">
                                <button className='btn btn-primary' type='submit' >Search</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-3"></div>
            </div>
        </div>
    );
}

export default HomePage;