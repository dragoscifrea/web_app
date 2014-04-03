define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'hbs!templates/popups/AddSubFolderPopupTemplate'
],  function($, _, Backbone, Marionette, JqueryValidate, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'popup',

        ui: {
            $overlay: '.overlay',
            $input : '.subfolder-name',
            $closeButton: '.close',
            $cancelButton: '.btn-cancel',
            $addButton: '.btn-add',
            $form: '.add-subfolder',
            $apiErrorContainer: '.error-message-container'
        },

        events: {
            'click @ui.$overlay': 'onClickClose',
            'click @ui.$closeButton': 'onClickClose',
            'click @ui.$cancelButton': 'onClickClose',
            'click @ui.$addButton': 'onClickAdd'
        },

        initialize: function(options) {
            this.viewRef = options.viewRef;
            this.model = new Model();
        },

        render: function() {
            this.$el.html(Template(this.model.atributes));

            this.bindUIElements();
            this._initValidation();
            return this;
        },

        _initValidation: function () {
            var self = this;

            this.ui.$form.validate({
                onsubmit: true,

                submitHandler: function (form) {
                    self.addSubFolder();
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
                    subname: {
                        required: true,
                        minlength: 3
                    }
                },
                messages: {
                    subname: {
                        required: "Please enter the subfolder name",
                        minlength: "The subfolder name must consist of at least 3 characters"
                    }
                }
            });
        },

        onClickAdd: function (e) {
            e.preventDefault();
            if (this.ui.$form.valid()) {
                this.addSubFolder();
            }
        },

        addSubFolder: function () {
            var self = this;

            var model = new Model();
            model.attributes.name = this.ui.$input.val();
            model.attributes.parentId = this.viewRef.model.attributes.id;
            model.url = App.config.attributes.baseURL +  App.config.attributes.toolURL + App.config.attributes.apiPath + 'ProjectRooms';
            model.save(null,{
                success: function (model, response) {

                    console.log(model.attributes);

                    self.close();
                    var tempModel = new TreeNodeModel();
                    tempModel.attributes.id = model.attributes.data.id;
                    tempModel.attributes.title = model.attributes.data.name;
                    tempModel.attributes.children = [];
                    tempModel.attributes.username = null;

                    self.viewRef.$el.addClass('has-dropdown open');


                    self.viewRef.createOne(self.viewRef.$el.children('.node-tree'), tempModel);
                },

                error: function (model,xhr,options) {
                    var msg =xhr.responseJSON.message ||  xhr.responseJSON.errors['model.name'][0] || 'There was an error when adding the subfolder' ;
                    self.ui.$apiErrorContainer.removeClass('hide').html(msg);
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
