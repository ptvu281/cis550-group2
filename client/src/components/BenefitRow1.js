import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BenefitRow1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.category}</td>
					<td>{this.props.name}</td>
					<td>{this.props.avg_copay}</td>
			</tr>
		);
	}
}
