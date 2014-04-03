define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'jqueryValidation',
    'hbs!templates/popups/AddItemPopupTemplate',
    'ajaxUpload'
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
            $form: '.add-item',
            $closeErrrorButton: '.close-error',
            $errorMessage: '#errorMessage',
            $apiResponseContainer: '.api-response',
            $file: '#file',
            $progressContainer: '.progress-container',
            $progress: '.progress',
            $radios: 'input:radio'
        },

        events: {
            'click @ui.$overlay': 'onClickClose',
            'click @ui.$closeButton': 'onClickClose',
            'click @ui.$cancelButton': 'onClickClose',
            'click @ui.$addButton': 'onClickAdd',
            'click @ui.$closeErrrorButton': 'closeError',
            'change @ui.$file': 'onChangeFile',
            'change @ui.$radios':'onChangeItemType'

        },

        initialize: function(options) {
            this.model = new Model();

            this.model.attributes.projectRoomId = options.viewRef.model.id;

        },

        render: function() {
            this.$el.html(Template(this.model.attributes));

            this.bindUIElements();
            this._initValidation();

            this.animatePopup();

            return this;
        },

        _initValidation: function () {
            this.ui.$form.validate({
                onsubmit: false,
                focusCleanup: true,
                errorElement: 'span',
                highlight: function (element, error) {
                    $(element).parent('div').addClass('error');
                },

                unhighlight: function (element, error) {
                    $(element).parent('div').removeClass('error');
                },
                rules: {
                    file: {
                        required: true
                        // accept: "video/*"
                        // extension: "mp4|avi|mpg|wmv|mov"
                    },
                    link: {
                        required: true,
                        url: true
                    },

                    title: 'required',
                    description: 'required'
                },
                messages: {
                    file: {
                        required: "Please select a filetype"
                        // accept: 'Please only use one of the following extensions: *.mp4, *.avi, *.mpg, *.wmv, *.mov',
                        // extension: 'Please only use one of the following extensions: *.mp4, *.avi, *.mpg, *.wmv, *.mov'
                    },
                    link: {
                        required: 'Please enter the item url',
                        url: 'You must enter a valid url'
                    },

                    title: 'Please enter the file title',
                    description: 'Please enter the file description'
                }
            });
        },

        animatePopup: function () {
            // var self = this;
        },

        addItem: function () {
            this.ui.$form.submit();
        },


         /*** PUBLIC METHODS ***/

        close: function () {
            this.$el.remove();
        },

        loadUploadHelper:function () {
            var self = this;


            this.ui.$form.attr('action', App.config.attributes.baseURL + App.config.attributes.toolURL + 'APIUploads/ProjectRoomFileUpload');


            AjaxHelper.registerAjaxUpload(this.ui.$form[0], {
                onprogress: function (evt)
                {
                    self.ui.$progressContainer.removeClass('hide');
                    var howmuch = Math.ceil((evt.loaded / evt.total) * 100);
                    self.ui.$progress.css('width', howmuch + '%');

                },
                oncomplete: function (data, xhr)
                {
                    self.ui.$progressContainer.addClass('hide');
                    self.ui.$progress.css('width', 0 + '%');

                    if(data.message == 'Success'){
                        self.ui.$errorMessage.html(data.message);
                        self.ui.$apiResponseContainer.removeClass('hide error-msg').addClass('success-msg');
                        setTimeout(function () {
                            App.Vent.trigger('App.REFRESH_FILES');
                            self.close();
                        },3000);

                    } else {
                        self.ui.$errorMessage.html(data.message);
                        self.ui.$apiResponseContainer.removeClass('hide success-msg').addClass('error-msg');
                    }
                },

                onerror: function () {
                    self.ui.$progressContainer.addClass('hide');
                    self.ui.$progress.css('width', 0 + '%');

                    self.ui.$errorMessage.html('There was an error uploading your file');
                    self.ui.$apiResponseContainer.removeClass('hide success-msg').addClass('error-msg');
                }
            });
        },

        /*** CLICK EVENTS ***/

        onClickClose: function () {
            this.close();
        },

        onClickAdd: function () {

            var self = this;

            if (this.$('#fileType').val() === '0') {
                if (this.ui.$form.valid()) {

                    this.ui.$progressContainer.addClass('hide');
                    this.ui.$progress.css('width', 0 + '%');

                    this.addItem();
                }
            } else if (this.$('#fileType').val() === '1') {
                if (this.ui.$form.valid()) {

                    this.model.attributes.title = this.$('#title').val();
                    this.model.attributes.description = this.$('#description').val();
                    this.model.attributes.link = this.$('#link').val();
                    this.model.attributes.fileType = '1';
                    this.model.url = App.config.attributes.baseURL + App.config.attributes.toolURL + 'api/ProjectRoomFiles';

                    this.model.save(null, {
                        success: function () {
                            self.ui.$errorMessage.html('The file was added successfully!');
                            self.ui.$apiResponseContainer.removeClass('hide error-msg').addClass('success-msg');
                            setTimeout(function () {
                                App.Vent.trigger('App.REFRESH_FILES');
                                self.close();
                            },3000);
                        },

                        error: function (model, xhr) {
                            self.ui.$progressContainer.addClass('hide');
                            self.ui.$progress.css('width', 0 + '%');

                            self.ui.$errorMessage.html('There was an error uploading your file');
                            self.ui.$apiResponseContainer.removeClass('hide success-msg').addClass('error-msg');
                        }
                    });
                }
            }


        },

        closeError: function (e) {
            this.ui.$apiResponseContainer.addClass('hide');
        },

        onChangeFile: function (e) {

            var ext = this.ui.$file.val().match(/\.(.+)$/)[1].toLowerCase();
            switch(ext) {

                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':

                case 'zip':
                case '7z':
                case 'mp3':

                case 'pdf':
                case 'ppt':
                case 'pptx':
                case 'xls':
                case 'xlsx':
                case 'doc':
                case 'docx':
                case 'txt':
                case 'rtf':

                case 'avi':
                case 'mp4':
                    this.ui.$errorMessage.html('');
                    this.ui.$apiResponseContainer.addClass('hide');
                break;

                default:
                    this.ui.$errorMessage.html('Uploading that filetype is not allowed, must be one of the following: jpg, jpeg, gif, png, zip, avi, mp4, 7z, mp3, pdf, ppt, ptx, xls, xlsx, doc, docx, txt, rtf');
                    this.ui.$apiResponseContainer.removeClass('hide');
                    this.ui.$file.val('');
                break;
            }
        },

        onChangeItemType: function (e) {
            var $target = $(e.currentTarget);
            $target.attr('id');

            if ($target.attr('id') === 'fromComputer') {

                this.$('.file-container').removeClass('hide');
                this.$('.link-container').addClass('hide');
                this.$('#fileType').val('0');
                this.$('.progress').addClass('hide');
                this.$('.error-msg').addClass('hide');


            } else if ($target.attr('id') === 'externalLink'){
                this.$('.file-container').addClass('hide');
                this.$('.link-container').removeClass('hide');
                this.$('#fileType').val('1');
                this.$('.error-msg').addClass('hide');
            }

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
