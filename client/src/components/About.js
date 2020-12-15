import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Category, RevenueBar, SalaryBar} from './Components';

export default class About extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      categoryList: [],
      percentList: [],
    }
  }

  componentDidMount() {
		fetch("http://localhost:8081/about", {
			method: "GET"
		  })
			.then(res => res.json())
			.then(allList => {
				console.log(allList); //displays your JSON object in the console
        if (!allList) return;
        var categoryList = [];
        var percentList = [];
        allList.map((allObj, i) => {
          categoryList.push(allObj.Category);
          percentList.push(allObj.Percent);
        });
				// This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
          categoryList: categoryList,
          percentList: percentList
        });
        console.log(categoryList);
        console.log(percentList);
			})
			.catch(err => console.log(err))
  }

  
  

  render() {
    return (
      <div className="Dashboard">

        <PageNavbar active="about" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="display-4" style={{'text-align': 'center', 'color': '#003366',"font-weight": "bold"}}>Welcome to Health Insurance Marketplace DB!</div>
            <hr class="my-4"></hr>
            <div className="lead" style={{'text-align': 'center', 'color': '#003366', "font-size": 25}}> We're here to help you navigate the US health insurance market</div>
          </div>

          <br></br>

          <div className="jumbotron">
            <div className="h5" style={{"font-weight": "bold", "font-size": 25}}> About</div>
            <br></br>
            <div style={{"font-size": 18}}> Our website gives you information on different health insurance plans based on specific criteria, 
              using datasets from the US Department of Health and Human Services on health and dental plans offered 
              to individuals and small businesses through the US Health Insurance Marketplace. </div>
            <br></br>
            <div style={{"font-size": 18}}> - Recommendations page finds the best insurance plans for you based on your personal information</div>
            <br></br>
            <div style={{"font-size": 18}}> - State page shows you insurance statistics for the state of your choice</div>
            <br></br>
            <div style={{"font-size": 18}}> - Benefits page shows you year-specific statistics and yearly price changes for the benefit category of your choice</div>
            <br></br>
            <div style={{"font-size": 18}}> - Provider page shows you provider-specific statistics for the year of your choice</div>
            <br></br>
            <div style={{"font-size": 18}}> - If there is any insurance-related term that you don't understand, you can consult the Health Insurance Dictionary Chatbot
              at the bottom left of the page
            </div>
          </div>
          

          <div className="jumbotron">
            <div className="h5">Plan Benefits Category Distribution (Top 10)</div>
            <Category
              height="200"
              labels={this.state.categoryList}
              series={this.state.percentList}
            />
          </div>
          <br/>
          <div className="jumbotron container">
            <div className="row">
              <div className="col-lg-6">
                <RevenueBar
                  labels={["2014", "2015", "2016"]}
                  issuerNetworkNum={[764, 1301, 1266]}
                  planNum={[18689, 31253, 27381]}
                  individualRate={[186.12, 185.94, 192.04]}
                />
              </div>
              <div className="col-lg-6">
              <SalaryBar
                labels={["WI", "TX", "FL", "OH", "IL", "PA", "AZ", "MI", "GA", "IN", "VA"]}
                salaryData={[7135, 6441, 5130, 5092, 4299, 4208, 3345, 3248, 2893, 2347, 2256]}
              />
              </div>
            </div>
          </div>
          <br/>
        </div>
      </div>
    );
  }
}
