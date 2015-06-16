var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AuthActions = {
    startAuth: function(username, pass) {
    var payload = {
    	'actionType': AppConstants.AUTH_LOG_IN,
    	'username': username, 
    	'pass': pass
    };
    AppDispatcher.handleViewAction(payload)
    },
}

module.exports = AuthActions;
