define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'hbs!templates/pages/login/LoginTemplate'
],  function($, _, Backbone, Marionette, JqueryValidate, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'login',

        ui: {
            $loginForm: '#loginForm',

            $username: '#username',
            $password: '#password',

            $loginButton: '#loginBtn',
            $forgotPswdButton: '#forgotPswdBtn',
            $apiResponse: '.api-response'
        },

        events: {
            "click @ui.$loginButton": "_onClickLogin",
            "click @ui.$forgotPswdButton": "_onClickForgotPassword",
            'keyup @ui.$username': '_onKeyUp',
            'keyup @ui.$password': '_onKeyUp'
        },

        initialize: function(options) {
            this.model = new Model();

            this.listenTo(this.model, 'sync', this.onLoggedIn, this);
            this.listenTo(this.model, 'error', this.onLoginError, this);
        },

        render: function() {
            this.$el.html(Template(this.model.atributes));
        },

        onShow: function () {
            this.bindUIElements();
            this._initValidation();

            App.Vent.trigger('App.UPDATE_LOGIN_STATUS');
        },

        _onClickLogin: function (e) {
            e.preventDefault();

            if (this.ui.$loginForm.valid()) {
                this._login();
            }
        },

        _onClickForgotPassword: function (e) {
            e.preventDefault();
            console.log('forgot pwd click');
        },

        _initValidation: function () {
            this.ui.$loginForm.validate({
                onsubmit: false,
                focusCleanup: false,
                rules: {
                    username: {
                        required: true,
                        // minlength: 6
                    },
                    password: {
                        required: true,
                        // minlength: 6
                    }
                },
                messages: {
                    username: {
                        required: "Please enter a username",
                        // minlength: "Your username must consist of at least 6 characters"
                    },
                    password: {
                        required: "Please provide a password",
                        // minlength: "Your password must be at least 6 characters long"
                    }
                }
            });
        },

        _login: function () {
            this.model.attributes.username = this.ui.$username.val();
            this.model.attributes.password = this.ui.$password.val();
            this.model.url = App.config.attributes.baseURL + App.config.attributes.toolURL + App.config.attributes.apiPath + 'Account';
            this.model.save();
        },

        onLoggedIn: function (model,xhr, options) {

            localStorage.isLoggedIn = true;
            localStorage.id = model.attributes.id;
            localStorage.roomName = model.attributes.slug;
            App.Vent.trigger('App.UPDATE_LOGIN_STATUS');
            App.variables.userName = model.attributes.username;
            App.router.navigate('pending', {trigger:false});
            App.router.navigate(localStorage.roomName, {trigger:true});
        },

        onLoginError: function (model, xhr, response) {
            this.ui.$apiResponse.removeClass('hide').html(xhr.responseJSON.message);
        },

        _onKeyUp: function (e) {

            this.ui.$apiResponse.addClass('hide').html('');

            if (e.keyCode === 13) { // if enter
                this._login();
            }
        }
    });


    var Model = Backbone.Model.extend({

        initialize: function() {},

        parse: function(r) {
            return r.data;
        }
    });

    return view;
});
