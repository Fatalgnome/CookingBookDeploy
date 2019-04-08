import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import RecipeList from "./RecipeList";
import Recipe from "./Recipe";
import NotFound from "./NotFound";

class App extends Component {

    constructor(props) {
        super(props);

        // TODO: Move this data to the server
        this.state = {
            recipes: [],
            selectedRecipe: ""
        };
    }
    componentDidMount() {
        console.log("App component has mounted");
        this.getData();
    }
    getData() {
        // TODO: Replace this data with data from Fetch API request
        fetch('http://localhost:8080/tasks')
            .then(response => response.json())
            .then(recepies => this.setState({recepies}));
    }

    // TODO: Remove these two methods
    getRecipeFromId(id) {
        return this.state.recipes.find((elm) => elm.id === Number(id));
    }

    filterByIngredient(ingredient) {
        return this.state.recipes.filter((elm) => elm.ingredients.includes(ingredient))
    }



    render() {
        return (
            <Router>
                <div className="container">
                    <h1>Cooking Recipes!</h1>

                    <Switch>
                        <Route exact path={'/'}
                               render={(props) =>
                                   <RecipeList {...props}
                                         recipes={this.state.recipes}
                                         header={'All recipes'}/>}
                        />

                        <Route exact path={'/recipe/:id'}
                               render={(props) => <Recipe {...props}
                               recipe={this.getRecipeFromId(props.match.params.id)}/>}
                        />

                        <Route exact path={'/recipe/with/:ingredient'}
                               render={(props) =>
                                   <RecipeList {...props}
                                        recipes={this.  filterByIngredient(props.match.params.ingredient)}
                                        header={`Recipes with ${props.match.params.ingredient}`}/>}
                        />

                        <Route component={NotFound} />
                    </Switch>

                </div>
            </Router>
        );
    }
}

export default App;
