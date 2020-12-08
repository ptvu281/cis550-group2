import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    }

    submitSecondSearch() {

    }


    render() {    
        return (
          <div className="Dashboard">
    
            <PageNavbar active="dashboard" />
    
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

                    <button id="submitMovieBtn" className="submit-btn" onClick={this.submitFirstSearch}>Submit</button>
                </div>
                <br/>
                
                <div className="section">
                    <div className="h6" style={{"text-decoration": "underline", "font-size": 17}}> {this.state.selectedOption} </div>
                        <div className="movies-header">
                            <div className="header"><strong>Benefit Category</strong></div>
                            <div className="header"><strong>Benefit Name</strong></div>
                            <div className="header"><strong>Out of Pocket Co-pay</strong></div>
                        </div>    
                        <div className="movies-container">
                            {this.state.benefitsResults}
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
                  <div className="movies-header">
                    <div className="header"><strong>2014</strong></div>
                    <div className="header"><strong>2015</strong></div>
                    <div className="header"><strong>2016</strong></div>
                  </div>
                  <div className="results-container" id="results">
                    {this.state.pricesResults}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
}