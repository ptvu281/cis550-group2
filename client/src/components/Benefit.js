import React from 'react';
import PageNavbar from './PageNavbar';
import BenefitRow1 from './BenefitRow1';
import BenefitRow2 from './BenefitRow2';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//Bootstrap and jQuery libraries
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery';

export default class Benefit extends React.Component {
    constructor(props) {
      super(props);

      let yearList = ["2014", "2015", "2016"];
      let yearDivs = yearList.map((yearObj, i) => <option key={i} value={yearObj}>{yearObj}</option>);

      let optionsList = ["Most Frequent Benefits", "Most Expensive Benefits", "Most Affordable Benefits"];
      let optionsDivs = optionsList.map((optionObj, i) => <option key={i} value={optionObj}>{optionObj}</option>);

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

      let statsList = ['Average', 'Min', 'Max'];
      let statsDiv = statsList.map((statsObj, i) => <option key={i} value={statsObj}>{statsObj}</option>);


      this.state = {
        allYears: yearDivs,
        selectedYear: "",
        allOptions: optionsDivs,
        selectedOption: "",
        benefitsResults: [],
        allBenefits: benefitDivs,
        selectedBenefit: "",
        allStats: statsDiv,
        selectedStats: "",
        pricesResults: []
      };

      this.handleYearChange = this.handleYearChange.bind(this);
      this.handleOptionChange = this.handleOptionChange.bind(this);
      this.handleBenefitChange = this.handleBenefitChange.bind(this);
      this.handleStatsChange = this.handleStatsChange.bind(this);
      this.submitFirstSearch = this.submitFirstSearch.bind(this);
      this.submitSecondSearch = this.submitSecondSearch.bind(this);
    }

    handleYearChange(e) {
        this.setState({
			selectedYear: e.target.value
		});
    }

    handleOptionChange(e) {
        this.setState({
			selectedOption: e.target.value
		});
    }

    handleBenefitChange(e) {
        this.setState({
			selectedBenefit: e.target.value
		});
    }

    handleStatsChange(e) {
        this.setState({
			selectedStats: e.target.value
		});
    }

    submitFirstSearch() {
      fetch("http://localhost:8081/ben1/" + this.state.selectedYear + "/" + this.state.selectedOption, {
        method: "GET"
      })
        .then(res => res.json())
        .then(ben1List => {
        	console.log(ben1List); //displays your JSON object in the console
        	if (!ben1List) return;
        	let ben1Divs = ben1List.map((ben1Obj, i) =>
        		<BenefitRow1 key={i} category={ben1Obj.Category} name={ben1Obj.BenefitName} avg_rate={ben1Obj.avg}/>
        	);
        	//This saves our HTML representation of the data into the state, which we can call in our render function
        	this.setState({
        		ben1List: ben1Divs
        	});
        })
        .catch(err => console.log(err))
    }

    submitSecondSearch() {
      fetch("http://localhost:8081/ben2/" + this.state.selectedBenefit + "/" + this.state.selectedStats, {
        method: "GET"
      })
        .then(res => res.json())
        .then(ben2List => {
          console.log(ben2List); //displays your JSON object in the console
          if (!ben2List) return;
          let ben2Divs = ben2List.map((ben2Obj, i) =>
            <BenefitRow2 key={i} BusinessYear={ben2Obj.BusinessYear} stat={ben2Obj.stat}/>
          );
          //This saves our HTML representation of the data into the state, which we can call in our render function
          this.setState({
            ben2List: ben2Divs
          });
        })
        .catch(err => console.log(err))
      }


    render() {
        return (
          <div className="Dashboard">

            <PageNavbar active="benefits" />

            <br></br>
            <div className="container movies-container">
              <div className="jumbotron">
                <div className="h5">Select a Year to Explore Year-Specific Statistics </div>
                <div className="input-container">
                    <select value={this.state.selectedYear} onChange={this.handleYearChange} className="dropdown" id="yearsDropdown">
			            <option select value> -- Select Year -- </option>
			            {this.state.allYears}
			        </select>

                    <select value={this.state.selectedOption} onChange={this.handleOptionChange} className="dropdown" id="optionsDropdown">
			            <option select value> -- Select Option-- </option>
			            {this.state.allOptions}
			        </select>

                    <button id="submit1stSearchBtn" className="submit-btn" onClick={this.submitFirstSearch}>Submit</button>
                </div>
                <br/>

                <div className="section">
                    <div className="h6" style={{"text-decoration": "underline", "font-size": 17}}> {this.state.selectedOption} </div>
                        <div class="table-wrapper">
              							<table id='dtable' class="fl-table">
              									<thead>
              									<tr>
              											<th>Benefit Category</th>
              											<th>Benefit Name</th>
              											<th>Average Individual Rate</th>
              									</tr>
              									</thead>
              									<tbody>
                                {this.state.ben1List}
              									</tbody>
              							</table>
              					</div>
              		    </div>
                </div>
              </div>

              <br></br>
              <div className="jumbotron">
                <div className="h5"> Changes In Prices Over The Years</div>
                <div className="input-container">
                    <select value={this.state.selectedBenefit} onChange={this.handleBenefitChange} className="dropdown" id="benefitDropdown">
			            <option select value> -- Select Benefit Category -- </option>
			            {this.state.allBenefits}
			        </select>

                    <select value={this.state.selectedStats} onChange={this.handleStatsChange} className="dropdown" id="statsDropdown">
			            <option select value> -- Select Statistics -- </option>
			            {this.state.allStats}
			        </select>

                    <button id="submitMovieBtn" className="submit-btn" onClick={this.submitSecondSearch}>Submit</button>
                </div>
                <br/>
                <div className="movies-container">
                <div class="table-wrapper">
                    <table id='dtable' class="fl-table">
                        <thead>
                        <tr>
                            <th>Year</th>
                            <th>Statistic Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.ben2List}
                        </tbody>
                    </table>
                </div>
                </div>
              </div>
            </div>

        );
      }
}
