import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			movieName: "",
			recMovies: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitMovie = this.submitMovie.bind(this);
	}

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitMovie() {
		fetch("http://localhost:8081/recommendations/" + this.state.movieName, {
			method: "GET"
		})
			.then(res => res.json())
			.then(movieList => {
				console.log(movieList); //displays your JSON object in the console
				if (!movieList) return;
				let moviesDivs = movieList.map((movieObj, i) =>
					<RecommendationsRow key={i} title={movieObj.TITLE} id={movieObj.ID} rating={movieObj.RATING} votes={movieObj.VOTE_COUNT}/>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					recMovies: moviesDivs
				});
			})
			.catch(err => console.log(err))
	}
	

	
	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="recommendations" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Recommendations</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Movie Name" value={this.state.movieName} onChange={this.handleMovieNameChange} id="movieName" className="movie-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitMovie}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    				<div className="header"><strong>Movie ID</strong></div>
					            <div className="header"><strong>Rating</strong></div>
					            <div className="header"><strong>Vote Count</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recMovies}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}