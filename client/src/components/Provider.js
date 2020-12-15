import React from 'react';
import PageNavbar from './PageNavbar';
import ProviderRow from './ProviderRow';
import '../style/Recommendations.css';

//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Provider extends React.Component {
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

        this.state = {
					selectedState: "",
					states: stateDivs,
					selectedYear: "",
					years: yearDivs,
	        providers: [],
		}

		this.submitProvider = this.submitProvider.bind(this);
		this.handleChangeState = this.handleChangeState.bind(this);
		this.handleChangeYear = this.handleChangeYear.bind(this);
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
		var obj;
		$('#dtable').DataTable().clear();
		$('#dtable').DataTable().destroy();
		fetch("http://localhost:8081/provider/" + this.state.selectedState + '/' + this.state.selectedYear, {
			method: "GET"
		})
		.then(res => res.json())
		.then(data => obj = data)
		.then(() => console.log(JSON.stringify(obj)))
		.then(() =>
			$('#dtable').DataTable ({
				"data" : obj,
				"columns" : [
						{ "data" : "name" },
						{ "data" : "avg_copay" },
						{ "data" : "avg_coins" },
						{ "data" : "num_plans" },
						{ "data" : "avg_num" }
				],
				"scrollX": true
		}))
	}
	// 		.then(res => res.json())
	// 		.then(providerList => {
	// 			console.log(providerList); //displays your JSON object in the console
	// 			if (!providerList) return;
	// 			let providerDivs = providerList.map((providerObj, i) =>
	// 				<ProviderRow key={i} name={providerObj.name} avg_copay={providerObj.avg_copay} avg_coins={providerObj.avg_coins} num_plans={providerObj.num_plans} avg_num={providerObj.avg_num} />
	// 			);
	//
	// 			//This saves our HTML representation of the data into the state, which we can call in our render function
	// 			this.setState({
	// 				providers: providerDivs
	// 			});
	// 		})
	// 		.catch(err => console.log(err))
	// }


		handleChangeYear(e) {
		this.setState({
			selectedYear: e.target.value
		});
	}

		handleChangeState(e) {
		this.setState({
			selectedState: e.target.value
		});
		}

	componentDidMount() {
		// initialize datatable
		// $(document).ready(function () {
				$('#dtable').DataTable();
		// });
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
												<select value={this.state.selectedState} onChange={this.handleChangeState} className="dropdown" id="decadesDropdown">
														<option select value> -- select a state -- </option>
														{this.state.states}
												</select>
												<select value={this.state.selectedYear} onChange={this.handleChangeYear} className="dropdown" id="decadesDropdown">
														<option select value> -- select a year -- </option>
														{this.state.years}
												</select>
                            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitProvider}>Submit</button>
											    		</div>
								                    </div>
								</div>
                            <div class="table-wrapper">
		              							<table id='dtable' class="fl-table">
		              									<thead>
		              									<tr>
																			<th>Network Name</th>
																			<th>Average Individual Rate</th>
																			<th>Average Copay out of Net</th>
																			<th># of Plans</th>
																			<th>Average # of Benefits</th>
		              									</tr>
		              									</thead>
		              									<tbody>
		                                	{this.state.providers}
		              									</tbody>
		              							</table>
		              					</div>
                    </div>

		);
	}
}
