import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default class About extends React.Component {
  constructor(props) {
    super(props);

    
  }


  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Introduction</div>
          </div>

          <br></br>
          <div className="jumbotron">
              More stuff here
          </div>
        </div>
      </div>
    );
  }
}