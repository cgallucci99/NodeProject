import React, { useState } from 'react';

const RemoveRecipeButton = ({ url, id, setUserRecipes }) => {
    const [removed, setRemoved] = useState(false);
    function removeFromProfile() {
        fetch(`${url}/api/removeRecipe`, {
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
                    console.log('failed to remove');
                } else {
                    setUserRecipes(body.user.recipeIDs);
                    setRemoved(true);
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <>
            {removed ? (<button className='float-right mr-2 btn btn-secondary btn-sm' disabled>Removed</button>) :
                (<button className='float-right mr-2 btn btn-danger btn-sm' onClick={removeFromProfile}>Remove</button>
                )}
        </>
    );
}

export default RemoveRecipeButton;