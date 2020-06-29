import React, {useState} from 'react';
import { useLocation} from 'react-router-dom';
import queryString from 'query-string';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState({"results":[]});
    const query = queryString.parse(useLocation().search).search;
    const searchFunc = async (searchText) => {
        console.log(query);
        const results = await fetch(`https://api.spoonacular.com/recipes/search?query=${searchText}&number=5&apiKey=62db462a6cb442368aa7f2cb1af3a615`);
        const body = await results.json();
        setSearchResults(body);
    }
    while (!searchResults.results[0]) {
        searchFunc(query);
        return (<div className="container">
        <h2>Results: </h2> <p>Loading . . .</p> </div>)
    }
    return ( 
        <div className="container">
            <h2>Results: </h2>
            <ul className="list-group">
            {
                searchResults.results.map((res, key) => (
                    <li key={key} className="list-group-item">
                        {res.title}
                    </li>
                ))
            }
            </ul>
        </div>
    );
}

export default SearchPage;