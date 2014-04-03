define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'hbs!templates/header/HeaderTemplate'
],  function($, _, Backbone, Marionette, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'container',

        ui: {
            logo: '.logo',
            logoutButton: '.client-logout',
            heading: '.heading'
        },

        events: {
            'click @ui.logoutButton': 'onClickLogout',
            'click @ui.logo': 'onClickLogo'
        },

        initialize: function(options) {

            this.model = new Model();
            this.model.url = App.config.attributes.baseURL + App.config.attributes.toolURL + App.config.attributes.apiPath + 'Account';
            this.listenTo(this.model, 'sync', this.onLoggedOut, this);
            this.listenTo(this.model, 'error', this.onLoggedOutError, this);

            App.Vent.off('App.UPDATE_LOGIN_STATUS');
            App.Vent.on('App.UPDATE_LOGIN_STATUS', this.updateLoginStatus, this);

            App.Vent.off('App.LOGOUT');
            App.Vent.on('App.LOGOUT', this.onClickLogout, this);
        },

        render: function() {
            this.$el.html(Template);
            this.bindUIElements();
        },

        onShow: function () {
            this.updateLoginStatus();
        },

        updateLoginStatus: function () {

            if (localStorage.isLoggedIn === true || localStorage.isLoggedIn === 'true') {
                this.ui.logoutButton.removeClass('hide');
                this.ui.heading.removeClass('hide');
            } else {
                this.ui.logoutButton.addClass('hide');
                this.ui.heading.addClass('hide');
            }
        },


        onLoggedOut: function () {
            this.ui.logoutButton.addClass('hide');
            localStorage.isLoggedIn = false;
            localStorage.roomName = undefined;
            delete localStorage.roomName;
            // App.router.navigate('#login', {trigger:true});

            console.log(window.location);

            if (window.location.host.match('localhost') || window.location.hostname.match('localhost')) {
                window.open(window.location.origin + window.location.pathname.split('projects')[0] + 'client/#', "_self");
            } else {
                window.open(window.location.origin + window.location.pathname.split('projects')[0], "_self");
            }

        },

        onLoggedOutError: function () {
            console.log('success logging out');
        },

        /*** USER EVENTS ***/
        onClickLogout: function () {
            this.model.fetch();
        },

        onClickLogo: function (e) {
            e.preventDefault();
            window.open(App.config.attributes.baseURL, "_self");
        }
    });

    var Model = Backbone.Model.extend({

        initialize: function() {},

        parse: function(r) {
            return r;
        }
    });

    return view;
});
