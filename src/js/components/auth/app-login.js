/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var AuthStore = require('../../stores/app-auth.js');
var AuthAction = require('../../actions/app-auth.js');


var Login = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  statics: {
    attemptedTransition: null
  },

  getInitialState: function () {
    return AuthStore.getState();

  },
  componentDidMount: function() {
      AuthStore.addChangeListener(this._onChange);
  },
  componentDidUpdate: function() {
    if(this.state.auth_token!==null) {
      this.context.router.replaceWith('/dashboard');
    }
  },
  componentWillUnmount: function() {
      AuthStore.removeChangeListener(this._onChange);
  },
  handleSubmit: function (event) {
    event.preventDefault();
    var username = this.refs.username.getDOMNode().value;
    var pass = this.refs.pass.getDOMNode().value;
    AuthAction.startAuth(username, pass);
  },
  _onChange: function() {this.setState(AuthStore.getState());},
  render: function () {
    var errors = this.state.login_error === true ? <p style={{color: 'red'}}>Bad login information</p> : '';
    return (
      <div className="well well-lg">
        <div className="col-sm-offset-2">
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label for="inputUsername" className="col-sm-2 control-label">Username</label>
              <div className="col-sm-6">
                <input ref="username" type="username" className="form-control" id="inputUsername" placeholder="username" defaultValue="xuanrong123" />
              </div>
            </div>
            <div className="form-group">
              <label for="inputPassword" className="col-sm-2 control-label">Password</label>
              <div className="col-sm-6">
                <input ref="pass" type="password" className="form-control" id="inputPassword" placeholder="Password" defaultValue="password"/>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-6">
                <button type="submit" className="btn btn-default">login</button>
              </div>
            </div>
            {errors}
          </form>
        </div>
      </div>
    );
  }
});

module.exports = Login;
