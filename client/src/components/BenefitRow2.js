import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BenefitRow2 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.four}</td>
					<td>{this.props.five}</td>
					<td>{this.props.six}</td>
			</tr>
		);
	}
}
