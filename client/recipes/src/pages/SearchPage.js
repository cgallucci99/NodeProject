import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState({ "results": [] });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const query = queryString.parse(useLocation().search).search;
    const searchFunc = (searchText) => {
        setError(false);
        setLoading(true);
        fetch(`https://api.spoonacular.com/recipes/search?query=${searchText}&number=5&apiKey=62db462a6cb442368aa7f2cb1af3a615`)
            .then(results => results.json())
            .then(body => {
                if(body.code===402) {
                    throw new Error();
                }
                setSearchResults({"results": body});
            })
            .catch((err) => {
                setError(true);
            })
        setLoading(false);
    }
    useEffect(() => {
        console.log(`query: ${query}`);
        searchFunc();
    }, [query])
    return (
        <div className="container">
            <h2>Results: </h2>
            {loading ? (<p>Loading . . .</p>) :
                (<>{error ? (<p>there was and error</p>) :

                    <ul className="list-group">
                        {
                            searchResults.results.map((res, key) => (
                                <li key={key} className="list-group-item">
                                    {res.title}
                                </li>
                            ))
                        }
                    </ul>
                }</>)}
        </div>
    );
}

export default SearchPage;