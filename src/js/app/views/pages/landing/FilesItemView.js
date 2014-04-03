define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'flowtype',
    'dotdotdot',
    'utils/Events',
    'hbs!templates/pages/landing/FilesItemTemplate'
],  function($, _, Backbone, Marionette, Flowtype, Dotdotdot, Events, Template) {

    var view = Backbone.Marionette.ItemView.extend({

        tagName: 'div',
        className : 'item',

        events: {
            'click .delete-video' : 'deleteVideo',
            'click .image' : 'onClickImage'
        },

        initialize: function(options) {
            this.model = options.model;
            this.roomId = options.roomId;

            this.listenTo(this.model, 'destroy', this.onModelDestroy, this);
        },

        render: function() {

            var temp = this.model.attributes.name.split('.');
            var e = temp[temp.length-1];

            if (this.model.attributes.fileType === 0) {

                if (e === 'tiff' || e === 'bmp' || e === 'gif' || e === 'jpg' || e === 'jpeg' || e === 'png') {
                    this.model.attributes.type = 'picture';
                    this.model.attributes.imgSource = App.config.attributes.baseURL +  App.config.attributes.toolURL + 'ApiDownloads/ProjectRoomFileDownload/'  + this.model.attributes.id + '?projectRoomId=' + this.roomId;
                } else if (e === 'mp4' || e === 'flv' || e === 'swf' || e === 'avi' || e === 'mov' || e === '3gp' || e === 'ogv') {
                    this.model.attributes.type = 'movie';
                    this.model.attributes.imgSource = 'images/placeholder-small.png';
                    this.model.attributes.fileTypeLabel = e;
                } else if (e === 'mp3' || e === 'ogg' || e === 'wav' || e === 'aiff' || e === 'm4a') {
                    this.model.attributes.type = 'audio';
                    this.model.attributes.imgSource = 'images/placeholder-small.png';
                    this.model.attributes.fileTypeLabel = e;
                } else {
                    this.model.attributes.type = 'file';
                    this.model.attributes.imgSource = 'images/placeholder-small.png';
                    this.model.attributes.fileTypeLabel = e;
                }

                this.model.attributes.downloadURL = App.config.attributes.baseURL +  App.config.attributes.toolURL + 'ApiDownloads/ProjectRoomFileDownload/'  + this.model.attributes.id + '?projectRoomId=' + this.roomId;

                this.$el.html(Template(this.model.attributes));
            } else if (this.model.attributes.fileType === 1 || this.model.attributes.fileType === null) {

                this.model.attributes.type = 'file';
                this.model.attributes.imgSource = 'images/placeholder-small.png';
                this.model.attributes.fileTypeLabel = 'link';
                this.$el.html(Template(this.model.attributes));

                this.$('.image').css({'cursor': 'pointer'});
                this.$('.view-details').addClass('hide');
            }

            return this;
        },

        deleteVideo: function (e) {
            e.preventDefault();

            App.Vent.trigger('App.SHOW_CONFIRMATION_POPUP', {viewRef: this});
        },

        onDeleteConfirmed: function () {
            var self = this;
            this.model.url = App.config.attributes.baseURL + App.config.attributes.toolURL + App.config.attributes.apiPath + 'projectrooms/' + this.roomId + '/files/' + this.model.attributes.id;
            this.model.destroy();
        },

        onModelDestroy: function () {
            this.remove();
        },

        onShow: function () {

        },

        initDotDotDot: function() {
            this.$('.caption h3').dotdotdot({
                wrap: 'word',
                watch: 'window'
            });
        },

        onClickImage: function (e) {
            e.preventDefault();

            if (this.model.attributes.fileType === 1) {
                window.open(this.model.attributes.name, "_blank");
            }
        }
    });

    return view;
});
