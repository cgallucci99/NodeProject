import React, { useState } from 'react';

const ProfilePage = ({ user, authenticated }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [clicked, setClicked] = useState(false);
    function getRecipes() {
        if (user.recipes.length !== 0) {
            setClicked(true);
            setLoading(true);
            var arr = [];
            user.recipes.forEach((recipe, index) => {
                fetch(`https://api.spoonacular.com/recipes/${recipe}/information?apiKey=f245917d9cf94d6b9dc49f86a962013f`)
                    .then(response => response.json())
                    .then(body => {
                        if (body.code === 402) {
                            throw new Error();
                        }
                        arr.push(body);
                        if (arr.length === user.recipes.length) {
                            setRecipes(arr);
                            setLoading(false);
                        }
                    }).catch(err => {
                        console.log('err fetching from api');
                        setError(true);
                    })
            });
        }
    }

    return (
        <div className="container">
            {!authenticated ? (
                <h1>Welcome, please login to view profile</h1>
            ) : (
                    <h1>Welcome, {user.name.givenName}</h1>
                )}
            <button className='btn btn-primary' onClick={getRecipes}>View Saved Recipes</button>
            {clicked ? (
                <ul id='recipe-list' className="list-group mt-3">
                    {error ? (<p>there was an error</p>)
                        : (<>{loading ? (<p>loading </p>)
                            : (recipes.map((recipe, key) => (
                                <li key={key} className='list-group-item' >
                                    {recipe.title}
                                </li>
                            )))}</>)}
                </ul>
            ) : <span></span>}
        </div>
    );
}

export default ProfilePage;