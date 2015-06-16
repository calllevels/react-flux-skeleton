var AppDispatcher = require('../dispatchers/app-dispatcher'),
    AppConstants = require('../constants/app-constants'),
    EventEmitter = require('events').EventEmitter,
    React = require('react/addons'),
    request = require('superagent'),
    authApi = "http://www.example.com/oauth";

var CHANGE_EVENT = "change";

var _authData = {
      login_error: false,
      auth_token: null,
      loggedIn: !!localStorage.token
    };
    // your state container where

var _auth = {
  login: function (username, pass, cb) {
    console.log('login',username, pass);
    cb = cb || function(backdata){};

    if (localStorage.token) {
      _authData.loggedIn = true;
      cb(true);
      this.onChange(true);
      return;
    }

    sendRequest(username, pass, function (res) {
      if (res.authenticated) {
        localStorage.token = res.token;
        _authData.auth_token=res.token;
        _authData.loggedIn = true;
        console.log(res.expires_in);
        cb(true);
        this.onChange(true);
        swal({title: "Hola!", text: "Welcome back user", timer: 1500,  showConfirmButton: false, type: "success" });
      } else if(res.login_error) {
        _authData.login_error=true;
        cb(false);
        this.onChange(false);
        swal({title: "Wrong username/password", text: "", showConfirmButton: false, timer: 1500, type: "error" });
      } else {
        _authData.error=true;
        this.logout();
        cb(false);
        this.onChange(false);
      }
    }.bind(this));
  },
  getToken: function () {
    return localStorage.token;
  },

  logout: function (cb) {
    _authData.auth_token=null;
    _authData.loggedIn = false;
    localStorage.removeItem('token');
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },
  FbOauthRequest: function (response) {
    fb_token = response.fb_token;
    console.log(fb_token);
    if (fb_token) {
      localStorage.token = fb_token;
      this.onChange(true); // triggering header to update state
    }
  },
  onChange: function (loggedIn) {
    this.onChangeRedirect(loggedIn);
    this.onChangeHeader(loggedIn);
  },
  // this on change is fired up in order
  // to change route to /dashboard after successful login
  onChangeRedirect: function() {},
  // this on change is fired up in order
  // to change header state login/logout
  onChangeHeader: function() {}
};

function sendRequest(username, pass, cb) {
  var loginApi = authApi + 'username=' + username + '&password=' + pass;
  setTimeout(function () {
    request
    .post(loginApi)
    .end(function(res){
      console.log(res.body);
      if (res.status == 200) {
        cb({
          login_error: false,
          authenticated: true,
          token: res.body['access_token'],
          expires_in: res.body['expires_in'],
          refresh_token: res.body['refresh_token']
        });
      } else {
        cb({
          login_error: true,
          authenticated: false,
          token:null
        });
      }
      AuthStore.emitChange();
    });
  }, 0);
}

var AuthStore = React.addons.update(EventEmitter.prototype, {$merge: {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },
  authGetToken:function(){
    return _auth.getToken();
  },
  authLoggedIn:function(){
    return _authData.loggedIn;
  },
  authOnChange:function(cb){
    _auth.onChangeRedirect = cb;
  },
  authOnChangeHeader:function(cb){
    _auth.onChangeHeader = cb;
  },
  authLogout:function(){
    return _auth.logout();
  },
  getState: function() {
    return _authData;
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action;
    console.log(action);
    switch(action.actionType){
      case AppConstants.AUTH_LOG_IN:
      _auth.login(action.username, action.pass);
      break;
      case AppConstants.FB_OAUTH_TOKEN_SUCCESS:
        _auth.FbOauthRequest(action.response);
        break;
      // below is just a boiler plate (uncomment if required)
      // case AppConstants.FB_OAUTH_TOKEN_SUCCESS:
      //   _FbOauthRequest(action.response);
      //   break;
    }
    AuthStore.emitChange();

    return true;
  })
}});

module.exports = AuthStore;
