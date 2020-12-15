import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BenefitRow2 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.BusinessYear}</td>
					<td>{this.props.stat}</td>
			</tr>
		);
	}
}
