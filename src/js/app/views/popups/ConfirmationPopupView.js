define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'hbs!templates/popups/ConfirmationPopup'
],  function($, _, Backbone, Marionette, JqueryValidate, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'popup',

        ui: {
            $overlay: '.overlay',
            $closeButton: '.close',
            $cancelButton: '.btn-cancel',
            $okButton: '.btn-ok',
        },

        events: {
            'click @ui.$overlay': 'onClickClose',
            'click @ui.$closeButton': 'onClickClose',
            'click @ui.$cancelButton': 'onClickClose',
            'click @ui.$okButton': 'onClickOk'
        },

        initialize: function(options) {
            this.viewRef = options.viewRef;
            this.model = new Model();
            this.model.attributes.title = this.viewRef.model.attributes.title || this.viewRef.model.attributes.name;
        },

        render: function() {
            this.$el.html(Template(this.model.attributes));

            this.bindUIElements();
            return this;
        },



        onClickOk: function (e) {
            e.preventDefault();

            this.close();
            this.viewRef.onDeleteConfirmed();
        },

        /*** PUBLIC METHODS ***/

        close: function () {
            this.$el.remove();
        },

        /*** CLICK EVENTS ***/

        onClickClose: function () {
            this.close();
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
