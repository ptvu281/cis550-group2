import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import {Category} from './Components';

export default class About extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    let categoryList = ["Surgery", "Chronic Diseases", "Medication", "Maternity Care", "Mental Health",
    "Specialist", "Rehabilitation", "Other Health Services"];
    
    let percentList = [0.0975, 0.0960, 0.0907, 0.0747, 0.0739, 0.0613, 0.0523, 0.4536]
    this.state ={
      categoryList: categoryList,
      percentList: percentList,
    }
  }

  //Please help me check this. It couldn't work
  componentDidMount() {
		fetch("http://localhost:3000/about", {
			method: "GET"
		  })
			.then(res => res.json())
			.then(categoryList => {
				console.log(categoryList); //displays your JSON object in the console
				if (!categoryList) return;

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					categorys: categoryList
				});
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
            <div className="h5">Plan Benefits' Category Distribution</div>
            <Category
              height="200"
              labels={this.state.categoryList}
              series={this.state.percentList}
            />
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
