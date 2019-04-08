import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Recipe extends Component {

    render() {
        let recipe = this.props.recipe;
        let list = [];

        recipe.ingredients.forEach((elm) => {
            list.push(<li>
                <Link to={`/recipe/with/${elm}`}>{elm}</Link>
            </li>)
        });

        let difficulty = 'easy';
        if (recipe.prep_time > 20) {
            difficulty = 'hard';
        }

        return (
            <div>
                <h3>{recipe.title}</h3>

                <p>{recipe.description}</p>

                <p>Difficulty: {difficulty}</p>

                <p>Total time: {recipe.total_time}</p>
                <p>Preparation time: {recipe.prep_time}</p>

                <p>
                    Ingredients:
                    <ul>
                        {list}
                    </ul>
                </p>
            </div>
        );
    }
}

export default Recipe;
