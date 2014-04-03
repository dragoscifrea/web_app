define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'hbs!templates/footer/FooterTemplate',
    'app/views/footer/JoinClubView'
],  function($, _, Backbone, Marionette, Template, JoinClubView) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'div',
        className : '',

        events: {
            'click .join-fan-club': 'openPopup',
            'click .close, .overlay': 'closeButton'
        },

        regions: {
            joinClubPanel: '.join-club-panel'
        },

        initialize: function(options) {
            this.model = new Model();
        },

        render: function() {
            this.$el.html(Template(this.model.atributes));
            this.afterRender();
        },

        afterRender: function () {
            this.joinClubPanel.show(new JoinClubView());

            this.$overlay = this.$('.overlay');
        },

        openPopup: function (e) {
            e.preventDefault();

            this.$overlay.fadeIn(300);

           this.joinClubPanel.$el.removeClass('hide');

           this.joinClubPanel.$el.animate({
                top: "50%"
            }, 500, "swing");


        },

        closeButton: function (e) {
            e.preventDefault();
            var self = this;

           this.joinClubPanel.$el.animate({
                top: "100%",
                marginTop: 0
            }, 500, "swing", function () {
                $(this).addClass('hide');
                $(this).removeAttr('style');

                self.$('#joinForm').removeClass('hide');
                self.$('.success-message').addClass('hide');
                self.$("#email").val('');
            });

            this.$overlay.fadeOut(300);

            this.$('.error-message').addClass('hide');
            this.$('.email-input').removeClass('error');
        }
    });


    var Model = Backbone.Model.extend({

        defaults: {},

        initialize: function() {},

        parse: function(r) {
            return r.data;
        }
    });

    return view;
});
