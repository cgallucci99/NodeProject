import React, { useState } from 'react';
import RecipeListItem from '../components/RecipeListItem';
import RemoveRecipeButton from '../components/RemoveRecipeButton';

const ProfilePage = ({ user, authenticated, setUserRecipes }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [clicked, setClicked] = useState(false);
    function getRecipes() {
        if (user.recipes.length !== 0) {
            setClicked(true);
            setLoading(true);
            var str = "";
            user.recipes.forEach((recipe, index) => {
                if (index === user.recipes.length - 1) {
                    str += recipe;
                } else {
                    str += recipe + ",";
                }
            })
            fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${str}&apiKey=b4eb8132e6de41dbae752d1fd776be77&includeNutrition=true`)
                .then(response => response.json())
                .then(body => {
                    if (body.code === 402 || body.code === 400) {
                        throw new Error();
                    }
                    setRecipes(body);
                    setLoading(false);
                }).catch(err => {
                    console.log('err fetching from api');
                    setError(true);
                })
        }
    }

    return (
        <div className="container" style={{ height: "80vh" }}>
            {!authenticated ? (
                <h1>Welcome, please login to view profile</h1>
            ) : (
                    <>
                        <h1>Welcome, {user.name.givenName}</h1>
                        {clicked ? (<span></span>) : (
                            <button className='btn btn-primary' onClick={getRecipes}>View Saved Recipes</button>
                        )}
                    </>
                )}
            {clicked ? (
                <ul id='recipe-list' className="list-group mt-3">
                    {error ? (<p>there was an error</p>)
                        : (<>{loading ? (<p>loading </p>)
                            : (recipes.map((recipe, key) => (
                                <li key={key} className='list-group-item' >
                                    <RecipeListItem recipe={recipe} />
                                    <RemoveRecipeButton id={recipe.id} setUserRecipes={setUserRecipes} />
                                </li>
                            )))}</>)}
                </ul>
            ) : <span></span>}
        </div>
    );
}

export default ProfilePage;