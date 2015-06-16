/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var auth = require('../../stores/app-auth'); // TODO / USE DISPATCHER & ACTIONS
var Login = require('../auth/app-login');
var AppActions = require('../../actions/app-actions.js');
var AuthStore = require('../../stores/app-auth.js');
var Link = Router.Link;


var Header = React.createClass({
  getInitialState: function () {
    return AuthStore.getState();
  },
  setStateOnAuth: function (loggedIn) {
    this.setState(AuthStore.getState());
  },
  componentWillMount: function () {
    AuthStore.authOnChangeHeader(this.setStateOnAuth);
  },
  render: function () {
    var loginOrOut = this.state.loggedIn ?
      <Link to="logout">Log out</Link> :
      <Link to="login">Sign in</Link>;
    return (
      <nav className="navbar navbar-default ">
        <div className="container">
          <div className="container-fluid">
            <div className="navbar-header">
              <a class="navbar-brand" href="#/login">
                <img src={'https://s3-ap-southeast-1.amazonaws.com/sweehoot/hootlogo-small.png'} alt="Brand" height="60" width="100" />
              </a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="about">About</Link></li>
              <li><Link to="dashboard">Posts</Link></li>
              <li>{loginOrOut}</li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});




module.exports = Header;
