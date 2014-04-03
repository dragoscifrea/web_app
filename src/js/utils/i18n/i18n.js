/**
 * This is a helper class for initialising the i18next library,
 * and passing it to the Handlebars templating library through a helper function
 */

define([
    'handlebars',
    'i18next',
    'jquery'
],  function(Handlebars, i18n, $) {

    var resources = {

        // HERE BE EN
        en: {
            translation: {

                app: {
                    title: "TDF JS Project Base",

                    login: {
                        usernamePlaceHolder: "Username",
                        passwordPlaceHolder: "Password",
                        loginButton: "Login",
                        forgotPassword: "Lost your password?"

                    },

                    home: {
                        title: "This is the Home Screen en.",
                        banner: {
                            title: "This is the banner region in the HomeView (internationalized)."
                        },
                        content: "This is the content region in the HomeView (internationalized)."
                    }
                }
            }
        },

        // HERE BE FR
        fr: {
            translation: {

                app: {
                    title: "DF JS Projet de Base",

                    login: {
                        usernamePlaceHolder: "Nom d'utilisateur",
                        passwordPlaceHolder: "Mot de passe",
                        loginButton: "S'identifier",
                        forgotPassword: "Mot de passe perdu?"

                    },

                    home: {
                        title: "C'est l'écran d'accueil",
                        banner: {
                            title: "C'est la région de la bannière dans le HomeView"
                        },
                        content: "Il s'agit de la zone de contenu dans le HomeView"
                    }
                }
            }
        }
    };

    i18n.init({ resStore: resources });

    var temp = i18n.lng().substr(0,2);

    $('html').addClass(temp);


    Handlebars.registerHelper('i18n', function(context, options) {

        var opts = i18n.functions.extend(options.hash, context);
        if (options.fn) opts.defaultValue = options.fn(context);

        var result = i18n.t(opts.key, opts);

        return new Handlebars.SafeString(result);
    });
});
