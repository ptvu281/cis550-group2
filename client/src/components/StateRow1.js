import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class StateRow1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.category}</td>
					<td>{this.props.name}</td>
			</tr>
		);
	}
}
