import React, { useState, useEffect } from 'react';

const ProfilePage = ({ user, authenticated }) => {
    const [recipes, setRecipes] = useState([]);
    const [finished, setFinished] = useState(false);
    const func = async () => {
        var arr = [];
        user.recipes.forEach(async (recipe) => {
            const data = await fetch(`http://localhost:8000/api/getRecipe/${recipe}`)
            const res = await data.json();
            arr.push(res);
        })
        return arr;
    }
    useEffect(() => {
        const f = async () => {
            const arr = await func();
            setRecipes(arr);
        }
        f();
    }, [user.recipes]);
    useEffect(() => {
        setFinished(true);
    }, [recipes])

    return (
        <div className="container">
            {!authenticated ? (
                <h1>Welcome, please login to view profile</h1>
            ) : (
                    <h1>Welcome, {user.name.givenName}</h1>
                )}
            <button className='btn btn-primary'>View Saved Recipes</button>
            <ul id='recipe-list' className="list-group">
                {finished ? (recipes.map((recipe, key) => (
                    <li key={key} className='list-group-item' >
                        {recipe.message}
                    </li>
                ))) : (<li>loading</li>)}
            </ul>
        </div>
    );
}

export default ProfilePage;