/*
 * The router defines routes and their corresponding methods in the controller.
 */
define([

  // Libraries.
  'backbone',
  'marionette',

  // Modules.
  'app/Controller'

], function(Backbone, Marionette, Controller) {
  'use strict';

    var Router = Backbone.Marionette.AppRouter.extend({

        appRoutes: {
            'login' : 'login',
            '/': 'landing',
            '*default' : 'landing'
        }

    });

  return new Router({controller: Controller});

});
