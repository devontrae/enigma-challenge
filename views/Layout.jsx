import React from 'react';

export default class Layout extends React.Component {
	render() {
		return (
			<div id="container">
				{this.props.children}
			</div>
		);
	}
}
