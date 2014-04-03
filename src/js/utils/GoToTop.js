define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'utils/Events'

],  function($, _, Backbone, Marionette, Events) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'a',
        className : 'go-to-top',

        events: {
            'click': 'onGoToTop'
        },

        initialize: function(options) {
            App.Vent.off('App.WINDOW_SCROLL');
            App.Vent.on('App.WINDOW_SCROLL', this.onWindowScroll, this);
        },

        render: function() {
        },

        onGoToTop: function(event) {
            event.preventDefault();
            event.stopPropagation();

            App.Vent.trigger('App.SCROLL_TO_TOP');
        },

        onWindowScroll: function(position) {
            if ($(window).scrollTop() > 100) {
                this.$el.fadeIn();
            } else {
                this.$el.fadeOut();
            }

            var topPosition = ($(window).height() / 2) + position.top;

            this.$el.css({
                'top': topPosition
            });
        },
    });

    return view;
});
