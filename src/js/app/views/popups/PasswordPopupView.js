define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'hbs!templates/popups/PasswordPopupTemplate'
],  function($, _, Backbone, Marionette, JqueryValidate, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'popup',

        ui: {
            $overlay: '.overlay',
            $input : '.subfolder-name',
            $closeButton: '.close',
            $cancelButton: '.btn-cancel',
            $okButton: '.btn-ok',
            $form: '.add-subfolder',
            $apiErrorContainer: '.error-message-container',
            $pwd: '#pwd',
            $errorContainer: '.error-message-container',
            $closeErrorButton: '.close-error'
        },

        events: {
            'click @ui.$overlay': 'onClickClose',
            'click @ui.$closeButton': 'onClickClose',
            'click @ui.$cancelButton': 'onClickClose',
            'click @ui.$okButton': 'onClickOk',
            'click @ui.$closeErrorButton': 'onClickCloseError',
            'keyup @ui.$form': 'onKeyUpForm',

        },

        initialize: function(options) {
            this.viewRef = options.viewRef;

            this.model = new Model();
            this.model.attributes.folderName = this.viewRef.model.attributes.title;
        },

        render: function() {
            this.$el.html(Template(this.model.attributes));

            this.bindUIElements();
            this._initValidation();
            return this;
        },

        _initValidation: function () {
            this.ui.$form.validate({
                onsubmit: true,

                submitHandler: function (form) {
                    return false;
                },
                focusCleanup: true,
                errorElement: 'span',
                highlight: function (element, error) {
                    $(element).parent('div').addClass('error');
                },

                unhighlight: function (element, error) {
                    $(element).parent('div').removeClass('error');
                },
                rules: {
                    pwd: {
                        required: true
                        // minlength: 6
                    }
                },
                messages: {
                    pwd: {
                        required: "Please enter the folder password"
                        // minlength: "The subfolder name must consist of at least 6 characters"
                    }
                }
            });
        },

        onClickOk: function (e) {
            e.preventDefault();

            if (this.ui.$form.valid()) {
                this.checkPassword();
            }
        },

        onKeyUpForm: function (e) {
            e.preventDefault();

            this.ui.$errorContainer.addClass('hide');

            if (e.keyCode === 13) {
                if (this.ui.$form.valid()) {
                    this.checkPassword();
                }
            }
        },

        checkPassword: function () {
            var self = this;


            this.model.attributes.username = this.viewRef.model.attributes.username;
            this.model.attributes.password = this.ui.$pwd.val();
            this.model.url = App.config.attributes.baseURL + App.config.attributes.toolURL + App.config.attributes.apiPath + 'FolderAccount';
            this.model.save(null, {
                success: function (model,xhr, options) {
                    self.viewRef.model.attributes.loggedIn = 1;
                    self.viewRef.toggleCollapse();
                    self.viewRef.update();
                    self.close();
                },

                error:function (model, xhr) {
                    var msg = xhr.responseJSON.message || 'There was an error checking your password';
                    self.ui.$errorContainer.removeClass('hide').children('#errorMessage').html(msg);

                }
            });
        },


        /*** PUBLIC METHODS ***/

        close: function () {
            this.$el.remove();
        },

        /*** CLICK EVENTS ***/

        onClickClose: function () {
            this.close();
        },

        onClickCloseError: function () {
            this.ui.$errorContainer.addClass('hide');
        }

    });


    var Model = Backbone.Model.extend({

        initialize: function() {},

        parse: function(r) {
            return r;
        }
    });

    var TreeNodeModel = Backbone.Model.extend({


        defaults: {
            title: 'Node',
            id: '',
            children: [],   // Children are represented as ids not objects
        },

        initialize: function(options) {
            //console.log('admin model loaded');

        },

        /* Return a suitable label for the Node
         * override this function to better serve the view
         */
        getLabel: function() {
            return this.get('title');
        },

        /* Return an array of actual TreeNodeModel instances
         * override this function depending on how children are store
         */
        getChildren: function() {

            var that = this;

            return _.map(this.get('children'), function(ref) {
                // Lookup by ID in parent collection if string/num
                if (typeof(ref) == 'string' || typeof(ref) == 'number')
                {
                    return that.collection.get(ref);
                }
                // Else assume its a real object
                return ref;
            });
        }
    });

    return view;
});
