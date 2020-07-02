import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import AddRecipeButton from '../components/AddRecipeButton';
import RecipeListItem from '../components/RecipeListItem';
import Loader from 'react-loader-spinner'

const SearchPage = ({ url, user, authenticated, setUserRecipes }) => {
    const [searchResults, setSearchResults] = useState({ "results": [] });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const query = queryString.parse(useLocation().search).search;
    const searchFunc = (searchText) => {
        setError(false);
        fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchText}&number=5&offset=${offset}&apiKey=b4eb8132e6de41dbae752d1fd776be77&addRecipeNutrition=true&addRecipeInformation=true`)
            .then(results => results.json())
            .then(body => {
                if (body.code === 402) {
                    throw new Error();
                }
                setSearchResults(body);
                setLoading(false);
            })
            .catch((err) => {
                setError(true);
            })
        setOffset(offset + 5);
    }
    useEffect(() => {
        setLoading(true);
        searchFunc(query);
    }, [query])
    if (loading) {
        console.log('loading')
        return (
            <div className="container clearfix" >
                <h2 className='text-center'>Loading Results: </h2>
                <div className='d-flex justify-content-center'>
                    <Loader type='TailSpin' color='#000000' height={100} width={100} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="container clearfix" >
                <h2 className='text-center'>Showing Results for "{query}": </h2>
                {loading ? (<p>Loading . . .</p>) :
                    (<>{error ? (<p>there was and error</p>) :
                        (<>
                            <ul className="list-group">
                                {
                                    searchResults.results.map((res, key) => (
                                        <li key={key} className="list-group-item ">
                                            <RecipeListItem recipe={res} />
                                            <AddRecipeButton url={url} user={user} authenticated={authenticated} id={res.id} setUserRecipes={setUserRecipes} />
                                        </li>
                                    ))
                                }
                            </ul>
                            <button className="btn btn-primary float-right mt-2 mr-4" onClick={() => searchFunc(query)} >See More Results</button>
                        </>)
                    }</>)}
            </div>
        );
    }
}

export default SearchPage;