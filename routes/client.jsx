const React = require('react');

const Layout = require('../views/Layout.jsx');
const Interface = require('../views/Index.jsx');

module.exports = React.createClass({
  render: () => (
    <div id="container">
      <Layout>
        <Interface />
      </Layout>
    </div>
  ),
});
