import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, authenticated }) => {
    const [recipes, setRecipes] = useState([]);
    // const getRecipes = async () => {
    //     var arr = [];
    //     user.recipes.forEach((recipe) => {
    //         fetch(`https://api.spoonacular.com/recipes/${recipe}/information?apiKey=62db462a6cb442368aa7f2cb1af3a615`)
    //         .then(response => response.json())
    //         .then(body => {
    //             arr.push(body);
    //         }).catch(err => {
    //             console.log('err fetching from api');
    //         })
    //     });
    //     setRecipes(arr);
    // }
    // setTimeout(getRecipes, 200);
    // while (!recipes[0]) {
    //     return (<p>Loading . . .</p>)
    // }
    return (
        <div className="container">
            {!authenticated ? (
                <h1>Welcome, please login to view profile</h1>
            ) : (
                    <h1>Welcome, {user.name.givenName}</h1>
                )}
            <button className='btn btn-primary'>View Saved Recipes</button>
            <ul id='recipe-list' className="list-group">
                {recipes.map((recipe, key) => (
                    <li key={key} className='list-group-item' >
                        {recipe.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProfilePage;