import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		let locationList = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
		"IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO",
		"MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV","NY","OH","OK","OR","PA",
		"RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV","WY"];
		let locationDivs = locationList.map((locationObj, i) => <option key={i} value={locationObj}>{locationObj}</option>);

		let ageList = ["0-20", "21 and over", "Family option"];
		let ageDivs = ageList.map((ageObj, i) => <option key={i} value={ageObj}>{ageObj}</option>);

		let smokingList = ["Smoking", "No Smoking"];
		let smokingDivs = smokingList.map((smokeObj, i) => <option key={i} value={smokeObj}>{smokeObj}</option>);

		let familyOptionList = ["Couple", "Primary Subscriber And One Dependent", "Primary Subscriber And Two Dependents",
		"Primary Subscriber And Three Or More Dependents", "Couple And One Dependent"];
		let familyOptionDivs = familyOptionList.map((famObj, i) => <option key={i} value={famObj}>{famObj}</option>);

		this.state = {
			location: "",
			allLocations: locationDivs,
			age: "",
			allAges: ageDivs,
			smoking: "",
			allSmokingOptions: smokingDivs,
			familyOption: "",
			allFamilyOptions: familyOptionDivs,
			recList: []
		};

		this.handleLocationChange= this.handleLocationChange.bind(this);
		this.handleAgeChange = this.handleAgeChange.bind(this);
		this.handleSmokingChange = this.handleSmokingChange.bind(this);
		this.handleFamilyOptionChange = this.handleFamilyOptionChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
	}

	handleLocationChange(e) {
		this.setState({
			location: e.target.value
		});
	}

	handleAgeChange(e) {
		this.setState({
			age: e.target.value
		});
	}

	handleSmokingChange(e) {
		this.setState({
			smoking: e.target.value
		});
	}

	handleFamilyOptionChange(e) {
		this.setState({
			familyOption: e.target.value
		});
	}

	// Will need to further modify link.
	submitSearch() {
		fetch("http://localhost:8081/recommendations/" + this.state.location + "/" + this.state.age + "/" + this.state.smoking + "/" + this.state.family, {
			method: "GET"
		})
			.then(res => res.json())
			.then(recList => {
				console.log(recList); //displays your JSON object in the console
				if (!recList) return;
				let recDivs = recList.map((recObj, i) =>
					<RecommendationsRow key={i} planid={recObj.planid} benefit={recObj.benefit} issuer={recObj.issuer}
					network={recObj.network} copayoon={recObj.copayoon} coinsoon={recObj.coinsoon} indvrate={recObj.indvrate}
					grouprate={recObj.grouprate}/>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					recList: recDivs
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

							<select value={this.state.location} onChange={this.handleLocationChange} className="dropdown" id="locationsDropdown">
			            		<option select value> -- Select Location -- </option>
			            		{this.state.allLocations}
			            	</select>

							<select value={this.state.age} onChange={this.handleAgeChange} className="dropdown" id="agesDropdown">
			            		<option select value> -- Select Age -- </option>
			            		{this.state.allAges}
			            	</select>

							<select value={this.state.smoking} onChange={this.handleSmokingChange} className="dropdown" id="smokingDropdown">
			            		<option select value> -- Select Smoking Preference -- </option>
			            		{this.state.allSmokingOptions}
			            	</select>

							<select value={this.state.family} onChange={this.handleFamilyOptionChange} className="dropdown" id="familyDropdown">
			            		<option select value> -- Select Family Option -- </option>
			            		{this.state.allFamilyOptions}
			            	</select>

			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitSearch}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">Best Health Insurance Plans for You</div>
			    			<div className="headers">
			    				<div className="header"><strong>Plan Id</strong></div>
			    				<div className="header"><strong>Benefit</strong></div>
					            <div className="header"><strong>Issuer</strong></div>
					            <div className="header"><strong>Network</strong></div>
								<div className="header"><strong>Copay Out of Network</strong></div>
								<div className="header"><strong>Coinsurance Out of Network</strong></div>
								<div className="header"><strong>Individual Rate</strong></div>
								<div className="header"><strong>Group Rate</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recList}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}
