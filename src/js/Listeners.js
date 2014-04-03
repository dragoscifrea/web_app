define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'app/views/popups/AddItemPopupView',
    'app/views/popups/AddSubFolderPopupView',
    'app/views/popups/PasswordPopupView',
    'app/views/popups/ConfirmationPopupView'
],  function($, _, Backbone, Marionette, AddItemPopupView, AddSubFolderPopupView, PasswordPopupView, ConfirmationPopupView) {

    var listeners = Backbone.Marionette.ItemView.extend({

        initialize: function() {

            App.Vent.off('App.SHOW_ADD_ITEM_POPUP');
            App.Vent.on('App.SHOW_ADD_ITEM_POPUP', this.showAddItemPopup, this);

            App.Vent.off('App.SHOW_ADD_SUBFOLDER_POPUP');
            App.Vent.on('App.SHOW_ADD_SUBFOLDER_POPUP', this.showAddSubfolderPopup, this);

            App.Vent.off('App.SHOW_PASSWORD_POPUP');
            App.Vent.on('App.SHOW_PASSWORD_POPUP', this.showPasswordPopup, this);

            App.Vent.off('App.SHOW_CONFIRMATION_POPUP');
            App.Vent.on('App.SHOW_CONFIRMATION_POPUP', this.showConfrimationPopup, this);

        },

        showAddItemPopup: function (options) {
            var addItemPopup = new AddItemPopupView({viewRef:options.viewRef});
            $('.popup-container').html(addItemPopup.render().el);
            addItemPopup.loadUploadHelper();
        },

        showAddSubfolderPopup: function (options) {
            var addSubFolderPopup = new AddSubFolderPopupView({viewRef:options.viewRef});
            $('.popup-container').html(addSubFolderPopup.render().el);
        },

        showPasswordPopup: function (options) {
            var passwordPopup = new PasswordPopupView({viewRef:options.viewRef});
            $('.popup-container').html(passwordPopup.render().el);
        },

        showConfrimationPopup: function (options) {
            var confrimationPopup = new ConfirmationPopupView({viewRef:options.viewRef});
            $('.popup-container').html(confrimationPopup.render().el);
        }

    });

    return listeners;
});
