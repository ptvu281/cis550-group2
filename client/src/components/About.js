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

  //Please help me check this. It couldn't work
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
            <div className="h5">Introduction</div>
          </div>

          <br></br>

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
          <div className="jumbotron">
              More stuff here
          </div>
        </div>
      </div>
    );
  }
}
