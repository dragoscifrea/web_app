define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'utils/Events',
    'hbs!templates/pages/digital-projects/DigitalProjectTemplate',
    'app/views/feature/FeatureView',
    'app/views/pages/thumbnail/ThumbnailView',
    'app/views/pages/details/DetailsView',
],  function($, _, Backbone, Marionette, Events, Template, FeatureView, ThumbnailView, DetailsView) {

    var view = Backbone.Marionette.Layout.extend({

        tagName: 'div',
        className : 'digital-projects',

        regions: {
            feature: '#feature',
            content: '#content'
        },

        events: {
        },

        initialize: function(options) {
            this.pageType = 'digitalprojects';

            this.model = new Model();

            App.Vent.off('App.LOAD_PROJECT_DETAILS');
            App.Vent.on('App.LOAD_PROJECT_DETAILS', this.loadProjectDetails, this);
        },

        render: function() {
            this.$el.html(Template(this.model.attributes));
            this.afterRender();
        },

        afterRender: function () {
            // this.feature.show(new FeatureView({type: 'digitalprojects'}));
            this.content.show(new ThumbnailView({type: 'digitalprojects', more: false}));
        },

        loadProjectDetails: function(options){
            this.itemId = options.itemId;

            this.model = new Model();
            this.model.url = App.config.attributes.baseURL + 'softcitizen/' + App.config.attributes.apiPath + this.pageType + '/' + this.itemId;

            this.listenToOnce(this.model, "sync", this.onGetProjectDetails, this);
            this.model.fetch();
        },

        onGetProjectDetails: function () {
            var detailsView = new DetailsView({pageType: this.pageType, itemId: this.itemId});
            this.$('#inlineDetails').html(detailsView.render().el);
            
            // Add delimiter after director / digital items
            detailsView.insertSpacer();
        }
    });


    var Model = Backbone.Model.extend({

        defaults: { },

        initialize: function() {},

        parse: function(r) {
            return r.data;
        }
    });

    return view;
});
