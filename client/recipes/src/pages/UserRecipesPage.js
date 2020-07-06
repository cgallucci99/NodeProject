import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner'

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
                    <p>{recipes[0].title}</p>
                )}

            </div>
        )
    }
}

export default UserRecipesPage;