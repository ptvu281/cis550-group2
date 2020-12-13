import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ProviderRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="name">{this.props.title}</div>
				<div className="id">{this.props.id}</div>
			</div>
		);
	}
}