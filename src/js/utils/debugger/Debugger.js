define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!utils/debugger/Debugger'
],  function($,_, Backbone, DebugTemplate) {

    var DebugView = Backbone.View.extend({

        template: DebugTemplate,

        events: {
            'click #debugger151-button' : '_onClickDebug'
        },

        initialize: function() {
            this.render();
            this._initLogger();
        },

        render: function() {

            if (typeof jasmine !== 'undefined') {
                return;
            }

            var $debugger = this.template();
            $('body').append($debugger);
            this.setElement($('#debugger151'));

        },

        _initLogger: function () {

            var self = this;
            var exLog = console.log;
            console.log = function(msg) {
                exLog.apply(this, arguments);

                var args1 = arguments[0];
                var args2 = arguments[1] || '';
                self.$('.debugger151-inner').append('<p>' + args1 +  args2 + '</p>');
            };

        },

        _onClickDebug: function (e) {
            this.$('.debugger151-outer').toggle();
        }

    });

    return DebugView;
});
