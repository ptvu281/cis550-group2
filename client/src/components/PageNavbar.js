import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList = ['about', 'recommendations', 'state', 'benefits', 'provider'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return (
					<a className="nav-item nav-link active" key={i} href={"/" + page}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			}
			else {
				return (
					<a className="nav-item nav-link" key={i} href={"/" + page}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			}
		})

		this.setState({
			navDivs: navbarDivs
		});
	}

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-dark bg-info">
			      <span className="navbar-brand center" style={{"font-weight": "bold", "font-size": 22}}>Health Insurance Marketplace</span>
			      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			        <div className="navbar-nav" style={{"font-weight": "bold", "opacity": 1, "color": "#ffffff", "font-size": 17}}>
			        {this.state.navDivs}
			        </div>
			      </div>
			    </nav>
			</div>
  	);
	}
}