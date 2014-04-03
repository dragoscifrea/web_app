define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'utils/Events',
    'hbs!templates/pages/landing/LandingTemplate',
    'jqueryValidation',

],  function($, _, Backbone, Marionette, Events, Template, JqueryValidation) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'div',
        className : '',

        regions: {
            // folderArea: '.folder-area'
        },

        events: {

        },

        initialize: function(options) {
            this.model = new Model();
        },

        render: function() {
            this.$el.html(Template(this.model.attributes));
        },

        onShow: function () {

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
