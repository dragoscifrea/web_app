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
            ':projectRoom': 'landing',
            '*default' : 'default'
        }

    });

  return new Router({controller: Controller});

});
