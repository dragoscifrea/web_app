/*
 * The controller is basically just a collection of methods that correspond
 * to routes and are called by the application router.
 */
/*jslint browser: true*/
define([
    'app/views/app',
    'app/views/pages/landing/LandingView',
    'app/views/pages/login/LoginView'

    ], function(app, LandingView, LoginView) {
    'use strict';

    return {

        // The home page
        landing: function(param) {

            if (localStorage.isLoggedIn === true || localStorage.isLoggedIn === 'true') {
                this._showPage(new LandingView());
            } else {
                this._showPage(new LoginView());
                // App.router.navigate('#login', {trigger:false});
            }

        },

        // The login page.
        login: function() {
            this._showPage(new LoginView());
        },

        default: function () {
            localStorage.isLoggedIn = false;
            this.login();
        },

        _showPage: function (page) {
            app.layout.content.show(page);
        }
    };
});
