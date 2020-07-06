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
            {removed ? (<button className='float-right btn btn-secondary btn-sm' disabled>&nbsp;&#10003;&nbsp;</button>) :
                (<button className='float-right btn btn-danger btn-sm' onClick={removeFromProfile}>&nbsp;-&nbsp;</button>
                )}
        </>
    );
}

export default RemoveRecipeButton;