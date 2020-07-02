import React, { useState, useEffect } from 'react';

const AddRecipeButton = ({ url, user, authenticated, id, setUserRecipes }) => {
    const [added, setAdded] = useState(false);
    function addToProfile() {
        fetch(`${url}/addRecipe`, {
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
            {added ? (<button className='float-right mr-2 btn btn-secondary btn-sm' disabled>&nbsp;&#10003;&nbsp;</button>) : (
                <>{authenticated ? (
                    <button className='float-right mr-2 btn btn-success btn-sm' onClick={addToProfile}>&nbsp;+&nbsp;</button>
                ) : (<span></span>)}</>
            )}
        </>
    );
}

export default AddRecipeButton;