define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'hbs!templates/pages/landing/TreeTemplate',

    //

    ], function ($, _, Backbone, Config, TreeTemplate) {

        var TreeViewItem = Backbone.View.extend({
            template :TreeTemplate,

            events:{
                 'click .man-icon' : 'clickManIcon',
                 'click .add-folder' : 'clickAddFolder'
            },

            initialize: function(options) {

                //console.log("initialize");
                 this.model.bind('change:children', this.render, this);

                // Listen to model changes for updating view
                this.model.bind('change', this.update, this);
                //console.log(this.model.getLabel());

                this.projectRoomId = options.projectRoomId;


            },

            render: function() {
                // Load HTML template and setup events
                this.$el.html(this.template);

                this.update();

                return this;
             },

              update: function() {
               // this.setManIcon();

                this.$('a .node-label').html(this.model.getLabel());
//                this.collapsed && this.$('> .node-tree').hide() || this.$('> .node-tree').show();
            },

            clickManIcon: function (model, view) {
                //console.log("show popup change or set user and password");
               // App.Vent.trigger('showPopupUser',{name:model.getLabel(), parentId:model.get('id'), projectRoomId: view.projectRoomId, viewRef : view, action : 'Change User'});
             },

            clickAddFolder: function (model, view) {
                //console.log("add folder");
                //console.log(view.collection);
              //  App.Vent.trigger('showPopupAddFolder',{parentId:model.get('id'), projectRoomId: view.projectRoomId, viewRef : view, action : 'Add Folder'});
            },

            onClickItem: function (e) {
                console.log('aaaa');
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

        return TreeViewItem;
    }
);



