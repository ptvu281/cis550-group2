import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="recResults">
				<div className="plan-id">{this.props.planid}</div>
				<div className="benefit">{this.props.benefit}</div>
				<div className="issuer">{this.props.issuer}</div>
				<div className="network">{this.props.network}</div>
				<div className="copayoon">{this.props.copayoon}</div>
				<div className="coinsoon">{this.props.coinsoon}</div>
				<div className="indv-rate">{this.props.indvrate}</div>
				<div className="group-rate">{this.props.grouprate}</div>
			</div>
		);
	}
}
