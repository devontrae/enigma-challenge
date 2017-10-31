import React from 'react';
import Layout from '../views/Layout.jsx';
import Interface from '../views/Index.jsx';

export default class App extends React.Component {
	render() {
		return (
			<Layout>
				<Interface />
			</Layout>
		);
	}
}
