import React, { useState } from 'react';

const HomePage = () => {
    const [searchText, setSearchText] = useState('');
    //<Link className="btn btn-primary" to={'/search?' + searchText} >Search</Link>
    return (
        <div id="homepage" className="text-center" style={{ height: "95vh" }}>
            <div className="jumbotron" >
                <h2 className="mt-5 display-4" >Welcome to the Recipes Home Page!</h2>
                <p className="lead">Search for recipes, add them to your profile, and more!</p>
                <hr className="w-50" />
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-md-6">
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
        </div>
    );
}

export default HomePage;