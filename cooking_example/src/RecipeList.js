import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class RecipeList extends Component {

    render() {
        let list = [];

        this.props.recipes.forEach((elm) => {
            list.push(<li>
                <Link to={`/recipe/${elm.id}`}>{elm.title}</Link>
            </li>)
        });

        return (
            <div>
                <h3>{this.props.header}</h3>
                <ul>
                    {list}
                </ul>
            </div>
        );
    }
}

export default RecipeList;
