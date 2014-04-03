define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'app/views/popups/ConfirmationPopupView'
],  function($, _, Backbone, Marionette, ConfirmationPopupView) {

    var listeners = Backbone.Marionette.ItemView.extend({

        initialize: function() {

            App.Vent.off('App.SHOW_CONFIRMATION_POPUP');
            App.Vent.on('App.SHOW_CONFIRMATION_POPUP', this.showConfrimationPopup, this);

        },

        showConfrimationPopup: function (options) {
            var confrimationPopup = new ConfirmationPopupView({viewRef:options.viewRef});
            $('.popup-container').html(confrimationPopup.render().el);
        }

    });

    return listeners;
});
