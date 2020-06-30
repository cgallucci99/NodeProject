import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import AddRecipeButton from '../components/AddRecipeButton';

const SearchPage = ({ user, authenticated, setUserRecipes }) => {
    const [searchResults, setSearchResults] = useState({ "results": [] });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const query = queryString.parse(useLocation().search).search;
    const searchFunc = (searchText) => {
        setError(false);
        setLoading(true);
        fetch(`https://api.spoonacular.com/recipes/search?query=${searchText}&number=5&apiKey=f245917d9cf94d6b9dc49f86a962013f`)
            .then(results => results.json())
            .then(body => {
                if (body.code === 402) {
                    throw new Error();
                }
                setSearchResults(body);
            })
            .catch((err) => {
                setError(true);
            })
        setLoading(false);
    }
    useEffect(() => {
        searchFunc(query);
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
                                    {res.title} <AddRecipeButton user={user} authenticated={authenticated} id={res.id} setUserRecipes={setUserRecipes} />
                                </li>
                            ))
                        }
                    </ul>
                }</>)}
        </div>
    );
}

export default SearchPage;