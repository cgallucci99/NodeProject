import React from 'react';

const RecipeListItem = ({ recipe }) => {
    return (<>
        <div className="media" >
            <img className="mr-3" height="100px;" src={recipe.image} />
            <div className="media-body" >
                <h5 className="mt-0">
                <a className="" href={recipe.sourceUrl}>{recipe.title}</a>
                </h5>
                <p className="">
                    Ready in {recipe.readyInMinutes} minutes. Serves {recipe.servings}
                </p>
            </div>
        </div>
        <div className="btn-group mb-1 mt-2">
            <button className="btn btn-primary" data-toggle="collapse" data-target={"#collapse" + recipe.id}>Summary</button>
            <button className="btn btn-primary" data-toggle="collapse" data-target={"#collapsetwo" + recipe.id}>Nutrition</button>
        </div>
        <div id={"accordion" + recipe.id}>
            <div className="collapse" id={"collapse" + recipe.id} data-parent={"#accordion" + recipe.id}>
                <div className="card card-body" >
                    <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
                </div>
            </div>
            <div className="collapse" id={"collapsetwo" + recipe.id} data-parent={"#accordion" + recipe.id}>
                <div className="card card-body" >
                    <table className="table">
                        <tbody>

                            <tr>
                                <td>Calories:</td><td>{recipe.nutrition.nutrients[0].amount}</td>
                            </tr>
                            <tr>
                                <td>Fat:</td><td>{recipe.nutrition.nutrients[1].amount} {recipe.nutrition.nutrients[1].unit}</td>
                            </tr>
                            <tr>
                                <td>Saturated Fat:</td><td>{recipe.nutrition.nutrients[2].amount} {recipe.nutrition.nutrients[2].unit}</td>
                            </tr>
                            <tr>
                                <td>Carbohydrates:</td><td>{recipe.nutrition.nutrients[3].amount} {recipe.nutrition.nutrients[3].unit}</td>
                            </tr>
                            <tr>
                                <td>Sugar:</td><td>{recipe.nutrition.nutrients[5].amount} {recipe.nutrition.nutrients[5].unit}</td>
                            </tr>
                            <tr>
                                <td>Cholesterol:</td><td>{recipe.nutrition.nutrients[6].amount} {recipe.nutrition.nutrients[6].unit}</td>
                            </tr>
                            <tr>
                                <td>Sodium:</td><td>{recipe.nutrition.nutrients[7].amount} {recipe.nutrition.nutrients[7].unit}</td>
                            </tr>
                            <tr>
                                <td>Protein:</td><td>{recipe.nutrition.nutrients[8].amount} {recipe.nutrition.nutrients[8].unit}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div></>
    )
}

export default RecipeListItem;