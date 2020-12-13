import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StateRow2 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.state}</td>
					<td>{this.props.category}</td>
					<td>{this.props.individual}</td>
					<td>{this.props.copay}</td>
					<td>{this.props.above_average}</td>
			</tr>
		);
	}
}
