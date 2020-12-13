import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import About from './About';
import Recommendations from './Recommendations';
import State from './State';
import Benefit from './Benefit';
import Provider from './Provider';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<About />
							)}
						/>
						<Route
							exact
							path="/about"
							render={() => (
								<About />
							)}
						/>
						<Route
							path="/recommendations"
							render={() => (
								<Recommendations />
							)}
						/>
						<Route 
							path="/state"
							render={() => (
								<State />
							)}
						/>
						<Route
							path="/benefits"
							render={() => (
								<Benefit />
							)}
						/>
						<Route
							path='/provider'
							render={() => (
								<Provider />
							)}
						/>
					</Switch>
				</Router>
			</div>

			
		);
	}
}