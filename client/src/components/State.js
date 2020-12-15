import React from 'react';
import PageNavbar from './PageNavbar';
import StateRow1 from './StateRow1';
import StateRow2 from './StateRow2';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class State extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected state and year,
        // and the list of benefits.
        let stateList = ["AK", "AL", "AR", "AZ", "DE", "FL", "GA", "HI",
		"IA", "ID", "IL", "IN", "KS", "LA", "ME", "MI", "MO",
		"MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV","OH","OK","OR","PA",
		"SC", "SD", "TN", "TX", "UT", "VA", "WI", "WV","WY"];
		let stateDivs = stateList.map((stateObj, i) => <option key={i} value={stateObj}>{stateObj}</option>);

        let yearList = ["2014", "2015", "2016"];
		let yearDivs = yearList.map((yearObj, i) => <option key={i} value={yearObj}>{yearObj}</option>);

		let freqList = ["Most Frequent Plans", "Least Frequent Plans"];
		let freqDivs = freqList.map((freqObj, i) => <option key={i} value={freqObj}>{freqObj}</option>);

		let benefitList = ['Dental - Adult', 'Dental - Child', 'Dental - General',
		'Surgery', 'Maternity Care', 'Mental Health',
		'Primary Care', 'Specialist', 'Hospital Services','Emergency Services','Other Health Services',
		'Respite/Hospice Care', 'Medication',
		'Rehabilitation', 'Habilitation', 'Medical Devices/Prosthetics',
		'Radiology/Laboratory', 'Diagnostic/Preventive',
		'Complementary Medicine', 'Vision', 'Sexual/Reproductive Health',
		'Chronic Diseases', 'Clinical Trial', 'Special Circumstances',
		'Nutrition/Wellness', 'Autism Spectrum', 'Telemedicine',
		'Alcohol/Tobacco','Other'];
		let benefitDivs = benefitList.map((benefitObj, i) => <option key={i} value={benefitObj}>{benefitObj}</option>);

        this.state = {
            selectedState: "",
            states: stateDivs,
						selectedState2: "",
            states2: stateDivs,
            selectedYear: "",
            freq: freqDivs,
						selectedFreq: "",
            years: yearDivs,
						allBenefits: benefitDivs,
		        selectedBenefit: "",
            benefits: [],
						averages: []
		}

        this.handleChangeState = this.handleChangeState.bind(this);
				this.handleChangeState2 = this.handleChangeState2.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
				this.handleChangeFreq = this.handleChangeFreq.bind(this);
				this.handleBenefitChange = this.handleBenefitChange.bind(this);
				this.submitStateYear = this.submitStateYear.bind(this);
				this.submitAverageSearch = this.submitAverageSearch.bind(this);
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

	submitAverageSearch() {
		fetch("http://localhost:8081/state2/" + this.state.selectedState2 + "/" + this.state.selectedBenefit, {
			method: "GET"
		})
			.then(res => res.json())
			.then(averagesList => {
				console.log(averagesList); //displays your JSON object in the console
				if (!averagesList) return;
				let averagesDivs = averagesList.map((averagesObj, i) =>
					<StateRow2 key={i} state={averagesObj.state} category={averagesObj.category} individual={averagesObj.individual} copay={averagesObj.copay} above_average={averagesObj.above_average}/>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					averages: averagesDivs
				});
			})
			.catch(err => console.log(err))
	}

    handleChangeState(e) {
		this.setState({
			selectedState: e.target.value
		});
    }

		handleChangeState2(e) {
		this.setState({
			selectedState2: e.target.value
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
	handleBenefitChange(e) {
			this.setState({
		selectedBenefit: e.target.value
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




				<br></br>
				<div className="container recommendations-container">
					<div className="jumbotron">
						<div className="h5">Average Statistics per Benefit Category per State</div>
						<div className="input-container">
							<select value={this.state.selectedState2} onChange={this.handleChangeState2} className="dropdown" id="decadesDropdown">
									<option select value> -- select a state -- </option>
									{this.state.states2}
							</select>

							<select value={this.state.selectedBenefit} onChange={this.handleBenefitChange} className="dropdown" id="benefitDropdown">
							<option select value> -- select a benefit category -- </option>
							{this.state.allBenefits}
							</select>

							<button id="submitMovieBtn" className="submit-btn" onClick={this.submitAverageSearch}>Submit</button>
						</div>
						<br/>
						<div className="movies-container">
							<div class="table-wrapper">
								<table id='dtable' class="fl-table">
									<thead>
									<tr>
											<th>State</th>
											<th>Benefit Category</th>
											<th>Average Individual Rate</th>
											<th>Average Copay out of Net</th>
											<th>Above Nation Average # of Benefits?</th>
									</tr>
									</thead>
									<tbody>
									{this.state.averages}
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
