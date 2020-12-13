import React from 'react';
import PageNavbar from './PageNavbar';
import StateRow1 from './StateRow1';
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

		let freqList = ["Most Frequent Plans", "Least Frequent Plans"];
		let freqDivs = freqList.map((freqObj, i) => <option key={i} value={freqObj}>{freqObj}</option>);

        this.state = {
            selectedState: "",
            states: stateDivs,
            selectedYear: "",
            freq: freqDivs,
						selectedFreq: "",
            years: yearDivs,
            benefits: [],
		}

        this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
				this.handleChangeFreq = this.handleChangeFreq.bind(this);
				this.submitStateYear = this.submitStateYear.bind(this);
	}




	// Hint: State submitted is contained in `this.state.selectedState`.
	submitStateYear() {
		fetch("http://localhost:8081/state1/" + this.state.selectedState + "/" + this.state.selectedYear + "/" + this.state.selectedFreq, {
			method: "GET"
		})
			.then(res => res.json())
			.then(benefitList => {
				console.log(benefitList); //displays your JSON object in the console
				if (!benefitList) return;
				let benefitDivs = benefitList.map((benefitObj, i) =>
					<StateRow1 key={i} category={benefitObj.category} name={benefitObj.name}/>
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
		handleChangeFreq(e) {
		this.setState({
			selectedFreq: e.target.value
		});
	}

	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="state"/>
			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Frequent Benefits per State</div>
			    		<br></br>
                        <div className="dropdown-container">
                            <select value={this.state.selectedState} onChange={this.handleChangeState} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a state -- </option>
                                {this.state.states}
                            </select>
                            <select value={this.state.selectedYear} onChange={this.handleChangeYear} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a year -- </option>
                                {this.state.years}
                            </select>
														<select value={this.state.selectedFreq} onChange={this.handleChangeFreq} className="dropdown" id="decadesDropdown">
                                <option select value> -- select a frequency -- </option>
                                {this.state.freq}
                            </select>
                            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitStateYear}>Submit</button>
                    </div>
										<div className="section">
		                    <div className="h6" style={{"text-decoration": "underline", "font-size": 17}}> {this.state.selectedOption} </div>
		                        <div class="table-wrapper">
		              							<table id='dtable' class="fl-table">
		              									<thead>
		              									<tr>
		              											<th>Benefit Category</th>
		              											<th>Benefit Name</th>
		              									</tr>
		              									</thead>
		              									<tbody>
		                                {this.state.benefits}
		              									</tbody>
		              							</table>
		              					</div>
		              		    </div>
		                </div>
			    			</div>
	    		</div>
		);
	}
}
