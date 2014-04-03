define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'hbs!templates/pages/landing/TreeTemplate',
    'app/views/pages/landing/TreeViewItem'

    ], function ($, _, Backbone, Config, TreeTemplate, TreeViewItem) {

        var TreeView = Backbone.View.extend({
            tagName: 'li',
            className: 'tree-item',
            template :TreeTemplate,

            events:{
            },

            initialize: function(options) {

                this.model = options.model;
                // When models children change, rebuild the tree
                this.projectRoomId = options.projectRoomId;
                // Listen to model changes for updating view
                this.model.bind('change', this.update, this);

                // Collapse state
                this.collapsed = true;

                this.setLockStatus();
            },

            setLockStatus: function() {

                if(this.model.get('username')){

                    if (this.model.attributes.loggedIn === 0) {
                        this.$('.lock').first().removeClass('icon-unlock').addClass('icon-lock');
                    } else if (this.model.attributes.loggedIn === 1) {
                        this.$('.lock').first().removeClass('icon-lock').addClass('icon-unlock');
                    }

                    // TODO: compare if password is cached inside sesion to change lock



                } else {
                    this.$('.lock').removeClass('icon-lock icon-unlock');
                }
            },

            setupEvents: function() {
                // Hack to get around event delegation not supporting ">" selector
                var that = this;

                this.$('> .node-collapse').click(function() {
                    that.onClickItem();
                });

                this.$('a .icon-plus-sign').on('click', function(event){
                    that.clickAddFolder(event);
                });

                this.$('a .man-icon').on('click', function(event){
                    that.clickManIcon(event);
                });

                //delete events
                this.$('.node-collapse').on('mouseenter', function(event){
                    var item = event.currentTarget;
                    if(that.model.get('id') != that.projectRoomId)
                        $(item).children('.delete').addClass('icon-trash');
                });

                this.$('.node-collapse').on('mouseleave', function(event){
                    var item = event.currentTarget;
                     $(item).children('.delete').removeClass('icon-trash');
                });

                this.$('a .delete').on('click', function(event){
                    that.deleteFolder(event);
                });

                this.$('a .edit-folder').on('click', function(event){
                    that.editFolder(event);
                });
            },

            refreshCurrentFolder:function() {
                App.Vent.trigger("App.REFRESH_CURRENT_FOLDER", {viewRef: this});
            },

            setSelectedItem:function(item) {
                // _.each( $('.tree-item').siblings(), function(itemEl) {
                //     $(itemEl).removeClass('active');
                //     // $(itemEl).removeClass('open');
                // });

                $('.tree-item').removeClass('active');

                if(item.hasClass('.has-dropdown')) {
                    item.addClass('open');
                }

                item.addClass("active");
                // item.children('.node-tree').children('.tree-item').removeClass('active');

            },

            deleteFolder: function(event) {

                var treeView = this.$el.parent().parent();
                // App.Vent.trigger('showPopup',{popup_type: 'delete', elTree:treeView, viewRef : this, action : 'Delete Folder', message : 'Are you sure you want to delete this folder?'});
                App.Vent.trigger('App.SHOW_CONFRIMATION_POPUP', {title:'Delete Folder', description:'Are you sure you want to remove the folder ' + this.model.attributes.title + ' ?', viewRef: this});
            },

            editFolder:function(events) {
                App.Vent.trigger('showPopupAddFolder',{popup_type: 'update', parentId:this.model.get('id'), modelTree:this.model, projectRoomId: this.projectRoomId, treeView:treeView, viewRef : this, action : 'Update Folder:'});
            },

            deleteConfirmed:function(elDeleteTree) {

                var self = this;

                $.ajax({
                    url: App.config.attributes.baseURL +  App.config.attributes.toolURL + App.config.attributes.apiPath + 'ProjectRooms/' + this.model.get('id'),
                    type: 'delete',
                    data: {},
                    success: function (data) {
                        self.remove();
                    }
                });
            },

            toggleCollapse: function() {
                var COLLAPSE_SPEED = 50;

                // this.collapsed = !this.collapsed; //???? WTF

                if (this.collapsed)
                {
                    this.collapsed = false;
                    if (this.$el.hasClass('has-dropdown')) {
                        this.$el.addClass('open');
                    }

                    this.$('> .node-tree').slideDown(COLLAPSE_SPEED);
                    this.refreshCurrentFolder();
                    this.setSelectedItem(this.$('> .node-collapse').parent('li'));
                }
                else
                {
                    this.collapsed = true;
                    this.$el.removeClass('open');

                    this.refreshCurrentFolder();
                    this.$('> .node-tree').slideUp(COLLAPSE_SPEED);

                }

                this.setSelectedItem(this.$('> .node-collapse').parent('li'));

            },

            update: function() {
                this.setLockStatus();

                this.$('a .node-label').first().html(this.model.getLabel());

                //check if  treeview is  root
                if(this.model.get('id') == this.projectRoomId) {
                    this.$('a .edit-folder').removeClass('icon-edit');
                    this.$('.node-collapse').addClass('is-project').hide();
                    this.$('.node-tree').css('display', 'block');
                } else {

                    if(this.collapsed){
                        this.$('> .node-tree').hide();
                    } else {
                        this.$('> .node-tree').show();
                    }
                }
            },


            render: function() {

                // Load HTML template and setup events
                this.$el.html(this.template);
                this.setupEvents();

                if (this.model.attributes.children.length > 0) {
                    this.$el.addClass('has-dropdown');
                }

                if (this.model.collection) {
                    // if its the second item it should be active by default
                    if (this.model.collection.indexOf(this.model) === 1) {

                        if ( _.isUndefined(this.model.attributes.username) || this.model.attributes.loggedIn === 1) {
                            this.collapsed = true;
                            this.toggleCollapse();
                            this.setSelectedItem(this.$el);
                        }
                    }
                }

                // Render this node
                this.update();
                this.createAll();

                return this;
             },

             createAll:function(){
                that = this;

                var tree = this.$('> .node-tree'), childView = null;
                _.each(this.model.getChildren(), function(model) {
                    that.createOne(tree, model);

                });

                if (childView)
                {
                    // Fixup css on last item to improve look of tree
                    childView.$el.addClass('last-item').before($('<li/>').addClass('dummy-item'));
                }
             },

             createOne:function(tree, model) {

                 childView = new TreeView({
                        model: model
                    });

                tree.append(childView.$el);
                childView.render();
             },

            clickManIcon: function (event) {
                var elTree = $(event.currentTarget);
                App.Vent.trigger('showPopupUser',{modelTree:this.model, viewRef : this, elTree: elTree, action : 'Change User'});
             },

             onClickItem: function () {
                 if ( _.isUndefined(this.model.attributes.username) || _.isNull(this.model.attributes.username) ) {
                    return this.toggleCollapse();
                } else {

                    if (this.model.attributes.loggedIn === 0) {
                        App.Vent.trigger('App.SHOW_PASSWORD_POPUP', {viewRef:this});
                    } else {
                        return this.toggleCollapse();
                    }
                }
             },


            // clickAddFolder: function (event) {
            //     var treeView = $(event.currentTarget).parent().parent().children('ul');
            //     App.Vent.trigger('showPopupAddFolder',{parentId:this.model.get('id'), modelTree:this.model, projectRoomId: this.projectRoomId, treeView:treeView, viewRef : this, action : 'Add Folder'});
            // }
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


        return TreeView;
    }
);


