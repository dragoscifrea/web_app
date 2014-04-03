define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'handlebars',
    'app/views/header/HeaderView',
    'app/views/footer/FooterView',
    'utils/i18n/i18n',
    'bootstrap'

], function($, _, Backbone, Marionette, Handlebars, HeaderView, FooterView, i18n, Bootstrap) {
    'use strict';

    // Creates a new Marionette application.
    var App = new Marionette.Application();

    // Start backbone's history for hash navigation after the app was initialized.
    App.on('initialize:after', function() {
        Backbone.history.start({
            pushState: false,
            root: App.root
        });
    });

    // Adds any methods to be run after the app was initialized.
    App.addInitializer(function() {
        this.initAppLayout();
    });

    App.initAppLayout = function() {
        var AppLayout = Backbone.Marionette.Layout.extend({
            el: 'body',

            regions: {
                header: "#header",
                content: "#content-holder",
                footer: "#footer"
            }
        });

        App.layout = new AppLayout();

        App.layout.header.show(new HeaderView());
        App.layout.footer.show(new FooterView());
    };

    return App;
});
