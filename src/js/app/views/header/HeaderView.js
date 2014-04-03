define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'hbs!templates/header/HeaderTemplate'
],  function($, _, Backbone, Marionette, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : '',

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

            App.Vent.on('App.UPDATE_LOGIN_STATUS', this.updateLoginStatus, this);
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
