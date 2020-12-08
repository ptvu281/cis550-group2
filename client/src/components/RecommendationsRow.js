import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.planid}</td>
					<td>{this.props.benefit}</td>
					<td>{this.props.network}</td>
					<td>{this.props.copayoon}</td>
					<td>{this.props.coinsoon}</td>
					<td>{this.props.indvrate}</td>
					<td>{this.props.grouprate}</td>
			</tr>
		);
	}
}
