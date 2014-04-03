requirejs.config({

    urlArgs: 'cb=' + Math.random(),

    config: {
        appName: 'TDF JS Project Base',
    },
    paths: {
        jquery: '../managed/jquery/jquery',
        bootstrap: '../managed/bootstrap/dist/js/bootstrap.min',
        jqueryValidation: '../managed/jquery.validation/jquery.validate',
        underscore: '../managed/underscore-amd/underscore',
        json2: '../managed/json2/json2',
        backbone: '../managed/backbone/backbone-min',
        'jquery.cookie': '../managed/jquery.cookie/jquery.cookie',
        text: '../managed/text/text',
        hbs: '../managed/requirejs-hbs/hbs',
        handlebars: '../managed/handlebars/handlebars',
        marionette: "../managed/marionette/lib/backbone.marionette",
        // tweenmax: '../managed/greensock-js/src/uncompressed/TweenMax',
        spec: '../../jasmine/spec/',
        i18next: '../managed/i18next/release/i18next.amd-1.6.3.min',
        owlCarousel: '../managed/owlcarousel/owl-carousel/owl.carousel.min',
        vimeoApi: '../managed/vimeo-player-api/javascript/froogaloop.min',
        fitText: '../managed/jquery-fittext.js/jquery.fittext',
        flowtype: '../managed/FlowTypeJS/flowtype',
        dotdotdot: '../managed/jquery.dotdotdot/src/js/jquery.dotdotdot.min',
        ajaxUpload: 'utils/AjaxUpload',

    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        'bootstrap': {
            deps: ['jquery'],
            exports: 'Bootstrap'
        },

        'underscore': {
            exports: '_'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'jquery.cookie': {
            deps: ['jquery']
        },
        // 'tweenmax': {
        //     exports: 'TweenMax'
        // },
        'marionette': {
            deps: ['backbone'],
            exports: 'Backbone.Marionette'
        },

        'owlCarousel': {
            deps: ['jquery'],
            exports: 'OwlCarousel'
        },

        'jqueryValidation': {
            deps: ['jquery']
        },

        'vimeoApi': {
            exports: 'VimeoApi'
        },

        'fitText': {
            deps: ['jquery'],
            exports: 'FitText'
        },

        'flowtype': {
            deps: ['jquery']
        },

        'dotdotdot': {
            deps: ['jquery']
        }
    }
});
