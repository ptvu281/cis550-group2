import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ProviderRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
					<td>{this.props.name}</td>
					<td>{this.props.avg_copay}</td>
					<td>{this.props.avg_coins}</td>
					<td>{this.props.num_plans}</td>
					<td>{this.props.avg_num}</td>
			</tr>
		);
	}
}
