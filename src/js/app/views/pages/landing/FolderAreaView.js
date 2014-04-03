define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'flowtype',
    'dotdotdot',
    'utils/Events',
    'hbs!templates/pages/landing/FolderAreaTemplate',
    'app/views/pages/landing/FilesItemView'

],  function($, _, Backbone, Marionette, Flowtype, Dotdotdot, Events, Template, FilesItemView) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'div',
        className : 'container',

        regions: {

        },

        events: {
            'click .add-user-btn': 'onClickAddUser',
            'click .delete-folder': 'onClickDeleteFolder',
            'click .add-item': 'onClickAddItem',
            'click .add-subfolder': 'onClickAddSubFolder',
            'click .rename-folder': 'onClickRenameFolder'
        },

        initialize: function(options) {
            this.folderId = options.viewRef.model.attributes.id;
            this.viewRef = options.viewRef;
            this.model = options.viewRef.model;
            this.viewRef.model.id = this.folderId;

            App.Vent.off('App.REFRESH_FILES');
            App.Vent.on('App.REFRESH_FILES', this.refreshCollection, this);

            this.itemDepth = this.viewRef.$el.parents('ul').length;
        },

        render: function() {

            this.$el.html(Template(this.model.attributes));

            this.loadFiles();

            if (this.itemDepth >= 3) {
                this.$('.add-subfolder').remove();
            }

            if (this.model.attributes.username === null) {
                this.$('.add-user-label').html('Add<br>User');
            } else {
                this.$('.add-user-label').html('Update<br>User');
            }
        },

        onShow: function() {
            this.initDotDotDot();
        },

        updateLabels: function () {
            if (this.model.attributes.username === null || this.model.attributes.username === "") {
                this.$('.add-user-label').html('Add<br>User');
            } else {
                this.$('.add-user-label').html('Update<br>User');
            }
        },

        refreshCollection: function () {
            this.collection.fetch();
        },

        loadFiles: function () {

            this.collection = new Collection();
            this.collection.url = App.config.attributes.baseURL + App.config.attributes.toolURL +  App.config.attributes.apiPath + 'ProjectRooms/' + this.folderId + '/files';
            this.listenTo(this.collection, 'sync', this.onCollectionSync, this);
            this.collection.fetch();
        },

        onCollectionSync: function () {
            this.$filesContainer = this.$('#items .items-list');
            this.$filesContainer.html('');

            if (this.collection.length === 0) {
                this.$filesContainer.html('<div class="item empty">There are no files in this directory</div>');
            } else {
                this.collection.each(this.addFile, this);
            }

            this.$('.nr-of-items').html(this.collection.length + ' items');
        },

        addFile: function (model) {
            var filesItemView = new FilesItemView({model:model, roomId:this.model.attributes.id});

            this.$filesContainer.append(filesItemView.render().el);
            filesItemView.initDotDotDot();
        },

        onClickAddSubFolder: function (e) {
            e.preventDefault();
            App.Vent.trigger('App.SHOW_ADD_SUBFOLDER_POPUP', {viewRef:this.viewRef});
        },

        onClickAddItem: function (e) {
            e.preventDefault();
            App.Vent.trigger('App.SHOW_ADD_ITEM_POPUP', {viewRef:this.viewRef});
        },

        onClickDeleteFolder: function (e) {
            e.preventDefault();
            this.viewRef.deleteFolder();
        },

        onClickRenameFolder: function (e) {
            e.preventDefault();
            App.Vent.trigger('App.SHOW_RENAME_FOLDER_POPUP', {viewRef:this.viewRef, folderArea: this});
        },

        initDotDotDot: function() {
            this.$('.current-folder .title').dotdotdot({
                wrap: 'word',
                watch: 'window'
            });
        }
    });


    var Model = Backbone.Model.extend({

        initialize: function() {},

        parse: function(r) {
            return r;
        }
    });

    var Collection = Backbone.Collection.extend({

        parse: function (r) {
            return r.data;
        }

    });

    return view;
});
