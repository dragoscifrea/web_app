define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'utils/Events',
    'hbs!templates/pages/landing/LandingTemplate',
    'app/views/pages/landing/TreeView',
    'app/views/pages/landing/FolderAreaView',
    'jqueryValidation',

],  function($, _, Backbone, Marionette, Events, Template, TreeView, FolderAreaView, JqueryValidation) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'div',
        className : 'project-room',

        regions: {
            folderArea: '.folder-area'
        },

        events: {
            'click .add-folder-button': 'showAddPanel',
            'click .button-add': 'onClickAdd',
            'click .btn-close-panel': 'hideAddPanel'
        },

        initialize: function(options) {
            this.model = new Model();
            this.isRoom = true;

            this.projectRoomId = options.projectId;

            App.Vent.off("App.REFRESH_CURRENT_FOLDER");
            App.Vent.on("App.REFRESH_CURRENT_FOLDER", this.refreshCurrentFolder, this);
        },

        render: function() {
            this.$el.html(Template(this.model.attributes));
        },

        onShow: function () {
            this.getCurentUser();
            this.initValidation();
        },

        initValidation: function () {
            this.$('.add-folder').validate({
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
                    'folder-name': {
                        required: true
                    }
                },
                messages: {
                    'folder-name': {
                        required: "Please enter the folder name"
                    }
                }
            });
        },

        getCurentUser: function () {
            this.userModel = new Model();
            this.userModel.url = App.config.attributes.baseURL + App.config.attributes.toolURL +  App.config.attributes.apiPath +'ProjectRooms' ;
            this.listenToOnce(this.userModel, 'sync', this.onGetUser, this);
            this.listenTo(this.userModel, 'error', this.onGetUserError, this);
            this.userModel.fetch();
        },

        onGetUser: function (model) {

            if (model.attributes[0].userType === 'ProjectRoomUser') {
                this.roomData = {
                    roomId: this.userModel.attributes[0].id,
                    roomUser: this.userModel.attributes[0].userName,
                    roomName: this.userModel.attributes[0].name
                };

                this.addTreeView();

                // hack for showing the project name
                // $('.user-name').html(this.roomData.roomUser);
                $('.project-room-name').html(this.roomData.roomName);
            } else {
                // other kind of user logged in, logging out
                App.Vent.trigger('App.LOGOUT');
            }



        },

        onGetUserError: function (model, xhr) {

            if (xhr.status === 401) {
                alert(xhr.responseJSON.message);
                App.Vent.trigger('App.LOGOUT');
            }


        },

        addTreeView: function(argument) {

            this.$('.tree-view').html('');
            var projectFolderCollectionURL = App.config.attributes.baseURL + App.config.attributes.toolURL +  App.config.attributes.apiPath + 'ProjectRoomFolders/' + this.roomData.roomId;
            this.treeNodeCollection = new TreeNodeCollection({url : projectFolderCollectionURL});
            this.listenTo(this.treeNodeCollection, 'sync', this.createTree, this);
            this.treeNodeCollection.fetch();

        },

        createTree: function (options){
            this.model = this.treeNodeCollection.first();

            // if (this.model.attributes.username === null || this.model.attributes.username === "") {
            //     this.$('.update-room-user-label').html('Add');
            // } else {
            //     this.$('.update-room-user-label').html('Update');
            // }

            // this.$('.project-name').html('Edit Project Room: ' + this.model.attributes.title);
            this.treeView = new TreeView( {el: $('.tree-view'), model: this.model, projectRoomId: this.roomData.roomId } );
            this.treeView.render();
        },

        showAddPanel: function (e) {
            e.preventDefault();
            this.$('.add-folder-panel').removeClass('hide');

        },

        hideAddPanel: function (e) {
            e.preventDefault();
            this.$('.add-folder-panel').addClass('hide');
        },

        onClickAdd: function (e) {
            e.preventDefault();

            if (!this.$('.add-folder').valid()) {
                return;
            }

            var addFolderModel = new Model();

            addFolderModel.url = App.config.attributes.baseURL + App.config.attributes.toolURL +  App.config.attributes.apiPath + 'ProjectRooms';
            addFolderModel.attributes.name = this.$('.project-name-ti').val();
            addFolderModel.attributes.parentId = this.roomData.roomId;

            var self = this;

            addFolderModel.save(null, {

                success: function (model, response) {
                    var tempModel = new TreeNodeModel();
                    tempModel.attributes.id = model.attributes.id;
                    tempModel.attributes.title = model.attributes.name;
                    tempModel.attributes.children = [];

                    self.treeView.createOne(this.$('.node-tree').first(), tempModel);
                    self.$('.project-name-ti').val('');
                },

                error: function (model,xhr, options) {

                    App.Vent.trigger('App.SHOW_POPUP', {title:'Error', description:xhr.responseJSON.errors['model.name'][0]});
                }
            });
        },

        refreshCurrentFolder: function (treeViewRef) {
            this.folderArea.show(new FolderAreaView(treeViewRef));
        },

        onClickUpdateMainUser: function(e){
            e.preventDefault();

            App.Vent.trigger('App.SHOW_ADD_USER_POPUP',{viewRef:this, folderArea: this});
        },

        updateLabels: function(e){

            if (this.model.attributes.username === null || this.model.attributes.username === "") {
                this.$('.update-room-user-label').html('Add');
            } else {
                this.$('.update-room-user-label').html('Update');
            }

        },

        onClickGoBack: function(e){
            e.preventDefault();
            App.router.navigate('#projects', {trigger:true});
        }
    });


    var Model = Backbone.Model.extend({

        initialize: function() {},

        parse: function(r) {
            return r.data;
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

    var TreeNodeCollection = Backbone.Collection.extend({
        model: TreeNodeModel,

        initialize:function (options) {
            this.url = options.url;
        }

    });

    return view;
});
