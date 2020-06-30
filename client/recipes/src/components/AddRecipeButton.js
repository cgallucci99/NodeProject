import React, { useState, useEffect } from 'react';

const AddRecipeButton = ({ user, authenticated, id, setUserRecipes }) => {
    const [added, setAdded] = useState(false);
    function addToProfile() {
        fetch('http://localhost:8000/addRecipe', {
            method: 'post',
            body: JSON.stringify({ recipe: id }),
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
                    console.log('failed to add');
                } else {
                    setUserRecipes(body.user.recipeIDs);
                    setAdded(true);
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {
        if (user.recipes.indexOf(id) !== -1) {
            setAdded(true);
        }
    }, [user, id])

    return (
        <>
            {added ? (<span></span>) : (
                <>{authenticated ? (
                    <button className='float-right mr-2 btn btn-primary' onClick={addToProfile}>Add to personal recipes</button>
                ) : (<span></span>)}</>
            )}
        </>
    );
}

export default AddRecipeButton;