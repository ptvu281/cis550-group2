import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class State extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected state and year,
        // and the list of benefits.
        let stateList = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
		"IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO",
		"MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV","NY","OH","OK","OR","PA",
		"RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV","WY"];
		let stateDivs = stateList.map((stateObj, i) => <option key={i} value={stateObj}>{stateObj}</option>);
        
        let yearList = ["2014", "2015", "2016"];
		let yearDivs = yearList.map((yearObj, i) => <option key={i} value={yearObj}>{yearObj}</option>);
        
        this.state = {
            selectedState: "",
            states: stateDivs,
            selectedYear: "",
            years: yearDivs,
            benefits: [],
		}

        this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
		this.submitStateYear = this.submitStateYear.bind(this);
	}




	// Hint: State submitted is contained in `this.state.selectedState`.
	submitStateYear() {
		fetch("http://localhost:8081/state/" + this.state.selectedState + "/" + this.state.selectedYear, {
			method: "GET"
		})
			.then(res => res.json())
			.then(benefitList => {
				console.log(benefitList); //displays your JSON object in the console
				if (!benefitList) return;
				let benefitDivs = benefitList.map((benefitObj, i) =>
					<RecommendationsRow key={i} title={benefitObj.TITLE} id={benefitObj.ID}/>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					benefits: benefitDivs
				});
			})
			.catch(err => console.log(err))
	}
    
    

    handleChangeState(e) {
		this.setState({
			selectedState: e.target.value
		});
    }
    
    handleChangeYear(e) {
		this.setState({
			selectedYear: e.target.value
		});
	}
	
	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="state"/>
			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">State</div>
			    		<br></br>
                        <div className="dropdown-container">
                            <select value={this.state.selectedState} onChange={this.handleChangeState} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a state -- </option>
                                {this.state.states}
                            </select>
                            <br></br>
                            <select value={this.state.selectedYear} onChange={this.handleChangeYear} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a year -- </option>
                                {this.state.years}
                            </select>
                            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitStateYear}>Submit</button>
			    		</div>
                    </div>
                    <div className="jumbotron">
                        <div className="header-container">
                            <div className="h6">People like ...</div>
                            <div className="headers">
                                <div className="header"><strong>Benefit Name</strong></div>
                                <div className="header"><strong>Benefit ID</strong></div>
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