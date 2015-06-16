/** @jsx React.DOM */
var Login = require('../components/auth/app-login');
var AuthStore = require('../stores/app-auth.js');

var AuthenticationMixin = {
	  statics: {
	    willTransitionTo: function (transition) {
	      if (!AuthStore.getState().loggedIn) {
	        Login.attemptedTransition = transition;
	        transition.redirect('/login');
					swal("Error", "You have to login before accessing this!", "error");
	      }
	    }
	  }
	}


module.exports = AuthenticationMixin;
