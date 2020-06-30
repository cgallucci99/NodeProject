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
        fetch(`https://api.spoonacular.com/recipes/search?query=${searchText}&number=5&apiKey=b4eb8132e6de41dbae752d1fd776be77`)
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
                                <li key={key} className="list-group-item ">
                                    <div className="media" >
                                        <img className="mr-3" height="100px;" src={'https://spoonacular.com/recipeImages/' + res.id + '-240x150.jpg'} />
                                        <div className="media-body" >
                                            <h5 className="mt-0">
                                                {res.title}
                                            </h5>
                                            <p className="">
                                                Ready in {res.readyInMinutes} minutes. Serves {res.servings}
                                            </p>
                                            <a className="" href={res.sourceUrl}>View Recipe</a>
                                            <AddRecipeButton user={user} authenticated={authenticated} id={res.id} setUserRecipes={setUserRecipes} />
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                }</>)}
        </div>
    );
}

export default SearchPage;