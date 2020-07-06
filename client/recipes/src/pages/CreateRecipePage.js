import React, {useState }from 'react';
import ImageUploader from 'react-images-upload'

const CreateRecipePage = ({ url, user, authenticated }) => {
    const [pictures, setPictures] = useState([]);
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");

    function createRecipe(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(`${url}/api/createRecipe`, {
            method: 'POST',
            body: data,
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
                console.log('success');
            }
        })
    }

    const onDrop = picture => {
        setPictures([...pictures, picture]);
    }
    if (!authenticated) {
        return (<div className="container mt-5"><h2>Please log in</h2></div>)
    } else {

        return (
            <div className="container mt-5">
                <form method="POST" action={url + "/api/createRecipe"} encType="multipart/form-data">
                    <div className="form-group row">
                        <div className="col-md-1 col-form-label">
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="col-md-3 ">
                            <input type="text" className="form-control" placeholder="Title of recipe" id="title" name="title" />
                        </div>
                        <div className="col-md-1 col-form-label">
                            <label htmlFor="time">Time</label>
                        </div>
                        <div className="col-md-3 ">
                            <input type="text" className="form-control" placeholder="Time in minutes" id="time" name="time" />
                        </div>
                        <div className="col-md-1 col-form-label">
                            <label htmlFor="servings">Servings</label>
                        </div>
                        <div className="col-md-3 ">
                            <input type="text" className="form-control" placeholder="Servings made by recipe" id="servings" name="servings" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredients</label>
                        <textarea className="form-control" placeholder="Separate ingredients on new lines" id="ingredients" name="ingredients" rows={50} style={{height: "100px"}} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructions">Instructions</label>
                        <textarea className="form-control" placeholder="Separate instrucions on new lines" id="instructions" name="instructions" rows={50} style={{height: "100px"}} />
                    </div>
                    <ImageUploader 
                        withIcon={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".png"]}
                        maxFileSize={5000000}
                        name={"image"}
                        label={"Upload an image. Max file size 5MB"}
                        singleImage={true}
                        withPreview={true}
                    />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}

export default CreateRecipePage;