require(['app/views/app','app/router', 'backbone', 'utils/debugger/Debugger', 'Listeners'],
	function (Application, Router, Backbone, Debugger, Listeners) {

	// declare a global varibale that will be used to trigger events
	window.App = {
		Vent : _.extend({}, Backbone.Events)
	};

    // make a backbone monde to get the initial config file
    var ConfigModel = Backbone.Model.extend({
        url: 'data/config.json?date=' + new Date().getTime()
    });

    var configModel = new ConfigModel();
    configModel.on('sync', function (model, xhr, options) {

        if (model.attributes.debug) {
            var debug = new Debugger();
        }

        //save refferences in the global App object for quick reference everywhere in the application
        window.App.router = Router;
        window.App.config = model;
        window.App.app =  Application;
        window.App.variables = {};

        //detect if mobile environment
        var userAgent = navigator.userAgent.toLowerCase();

        if ( userAgent.match(/android/i) || userAgent.match(/webos/i) || userAgent.match(/iphone/i) || userAgent.match(/ipod/i)  || userAgent.match(/blackberry/i) || userAgent.match(/windows phone/i) ){

            $('body').addClass('has-touch');
            App.variables.userAgent = 'mobile';

        }  else if (userAgent.match(/ipad/i) ) {

            $('body').addClass('has-touch');
            App.variables.userAgent = 'ipad';

        } else {
            App.variables.userAgent = 'desktop';
        }


        // just a variable keeping track weather the app should transition animate or not.
        window.App.canAnimate = false;

        Application.Router = Router;

        // This is where we launch the whole application, after we have loaded the configuration from the data/config.json
        Application.start();

        var listeners = new Listeners();

    });

    configModel.on('error', function (model,xhr,options) {
        console.log('There was an error loading the config.json');
    });

    configModel.fetch();
});


/**
 * Here we are initialising jasmine
 * @param  {jquery} $     the jquery library
 * @param  {the index.js map} index describes all the modules that we want to test
 * @return if we are looking at the application and not jasmine testing
 */
require(['jquery', 'spec/index', 'backbone'], function($, index, Backbone) {

    // if we are looking at the app and not at jasmine.html we dont need all the extra logic below
    if (typeof jasmine === 'undefined') {
        return;
    }

    window.App = {
        Vent : _.extend({}, Backbone.Events)
    };

    var jasmineEnv = jasmine.getEnv(),
    htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    $(function() {
        require(index.specs, function() {
            jasmineEnv.execute();
        });
    });
});
