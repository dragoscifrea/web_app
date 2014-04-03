define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'i18next'
],  function($, _, Backbone, Marionette, JqueryValidate, Template, i18n) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : '',

        events: {
            'click #joinBtn': '_onClickJoin',
             'keyup #email' : 'onKeyUpInputs'
        },

        initialize: function(options) {
        },

        render: function() {
            this.$el.html(Template);
        },

        emailValidate: function () {
            var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            return expr.test($("#email").val());
        },

        _onClickJoin: function(e) {
            e.preventDefault();
            this.model = new Model();

            // this.emailValidate();

            if (!this.emailValidate($("#email").val())) {
                this.$('.error-message').removeClass('hide');
                this.$('.email-input').addClass('error');
            }
            else {
                this.$('#joinForm').addClass('hide');
                this.$('.success-message').removeClass('hide');

                this.model.url = App.config.attributes.baseURL + 'softcitizen/' + App.config.attributes.apiPath + 'subscribers';
                this.model.attributes.email = this.$("#email").val();
                this.model.save();
            }
        },

        onKeyUpInputs: function () {
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
