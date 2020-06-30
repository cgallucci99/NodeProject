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
            var str = "";
            user.recipes.forEach((recipe, index) => {
                if (index === user.recipes.length - 1) {
                    str += recipe;
                } else {
                    str += recipe + ",";
                }
            })
            fetch(`https://api.spoonacular.com/recipes/informationBulk?ids=${str}&apiKey=b4eb8132e6de41dbae752d1fd776be77`)
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
                                    <div className="media" >
                                        <img className="mr-3" height="100px;" src={recipe.image} />
                                        <div className="media-body" >
                                            <h5 className="mt-0">
                                                {recipe.title}
                                            </h5>
                                            <p className="">
                                                Ready in {recipe.readyInMinutes} minutes. Serves {recipe.servings}
                                            </p>
                                            <p dangerouslySetInnerHTML={{__html: recipe.summary}}>
                                                
                                            </p>
                                            <a className="" href={recipe.sourceUrl}>View Recipe</a>
                                        </div>
                                    </div>
                                </li>
                            )))}</>)}
                </ul>
            ) : <span></span>}
        </div>
    );
}

export default ProfilePage;