import React from 'react';
import PageNavbar from './PageNavbar';
import ProviderRow from './ProviderRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Provider extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected state and year,
        // and the list of benefits.
		let providerList = ["a", "b"];
		let providerDivs = providerList.map((providerObj, i) => <option key={i} value={providerObj}>{providerObj}</option>);
        
        this.state = {
            selectedProvider: "",
            providers: providerDivs,
            benefits: [],
		}

        this.handleChangeProvider = this.handleChangeProvider.bind(this);
		this.submitProvider = this.submitProvider.bind(this);
	}



	// componentDidMount() {
	// 	// Send an HTTP request to the server.
	// 	fetch("http://localhost:8081/provider", {
	// 	  method: 'GET' // The type of HTTP request.
	// 	})
	// 	  .then(res => res.json()) // Convert the response data to a JSON.
	// 	  .then(providerList => {
	// 		console.log(providerList)
	// 		if (!providerList) return;
	// 		// Map each genreObj in genreList to an HTML element:
	// 		// A button which triggers the showMovies function for each genre.
	// 		let providerDivs = providerList.map((providerObj, i) => <option key={i} value={providerObj}>{providerObj}</option>);
	
	// 		// Set the state of the genres list to the value returned by the HTTP response from the server.
	// 		this.setState({
	// 		  providers: providerDivs
	// 		})
	// 	  })
	// 	  .catch(err => console.log(err))	// Print the error if there is one.
	// }

	// Hint: State submitted is contained in `this.state.selectedState`.
	submitProvider() {
		fetch("http://localhost:8081/provider/" + this.state.selectedProvider, {
			method: "GET"
		})
			.then(res => res.json())
			.then(benefitList => {
				console.log(benefitList); //displays your JSON object in the console
				if (!benefitList) return;
				let benefitDivs = benefitList.map((benefitObj, i) =>
					<ProviderRow key={i} title={benefitObj.TITLE} id={benefitObj.ID} />
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					benefits: benefitDivs
				});
			})
			.catch(err => console.log(err))
	}
    
    

    handleChangeProvider(e) {
		this.setState({
			selectedProvider: e.target.value
		});
    }
    
	
	render() {

		return (
			<div className="movie">
				<PageNavbar active="provider"/>
			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Provider</div>
			    		<br></br>
                        <div className="dropdown-container">
                            <select value={this.state.selectedProvider} onChange={this.handleChangeProvider} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a Provider -- </option>
                                {this.state.providers}
                            </select>
                            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitProvider}>Submit</button>
			    		</div>
                    </div>
                    <div className="jumbotron">
                        <div className="header-container">
                            <div className="h6">Provider information ...</div>
                            <div className="headers">
                                <div className="header"><strong>Benefit Name</strong></div>
                                <div className="header"><strong>Benefit ID</strong></div>
								<div className="header"><strong>Average Copay</strong></div>
								<div className="header"><strong>Average Benefits Number</strong></div>
                            </div>
                        </div>
                        <div className="results-container" id="results">
                            {this.state.benefits}
                        </div>
                    </div>
			    </div>
		    </div>
		);
	}
}