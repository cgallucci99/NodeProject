import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom';
import RecipeListItem from '../components/RecipeListItem';

const UserRecipesPage = ({ url, user, authenticated }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const getUserRecipes = () => {
        fetch(`${url}/api/getUserRecipes`, {
            method: 'get',
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
            .then(results => results.json())
            .then(body => {
                if (body.message === 'fail') {
                    console.log('failed to add')
                } else {
                    setRecipes(body);
                    setLoading(false);
                }
            })
    }
    useEffect(() => {
        setLoading(true);
        getUserRecipes();
    }, [user])
    if (!authenticated) {
        return (
            <h1>Please log in</h1>
        )
    } else {
        return (
            <div className="container">
                <h2>Your Recipes:</h2>
                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Loader type='TailSpin' color='#000000' height={100} width={100} />
                    </div>) : (
                        <ul className="list-group">
                            {
                                recipes.map((recipe, key) => (
                                    <li key={key} className="list-group-item">
                                        <RecipeListItem recipe={recipe} />
                                    </li>
                                ))
                            }
                        </ul>
                    )}

            </div>
        )
    }
}

export default UserRecipesPage;