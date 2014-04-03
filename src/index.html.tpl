<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Web App Base</title>
        <meta name="description" content="" />
        <meta http-equiv="cache-control" content="no-cache" />

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" type="text/css" href="css/main.css" />
        <!--script src="js/vendor/modernizr-2.6.2.min.js"></script-->

        <script type="text/javascript" src="http://www.youtube.com/player_api"></script>

        <script type="text/javascript" data-main="<%- require %>" src="<%- requirePath %>"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->

        <section id="root">
            <header id="header"></header>

            <div id="wrapper" class="container">
                <div id="content-holder"></div>
            </div>
        </section>

        <footer id="footer"></footer>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID and uncomment -->
        <script type="text/javascript">
            // var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            // (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            // g.src='//www.google-analytics.com/ga.js';
            // s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>

        <%
            if (grunt.cli.tasks[0] === "compile") {

            } else {
                var devJsFiles = grunt.config('template');
                devJsFiles = devJsFiles.dev.jsfiles;

                for(var i = 0, len = devJsFiles.length; i < len; i++) {
                    print('<script type="text/javascript" src="' + devJsFiles[i] + '"></script>\n');
                }
            }
        %>

        <div class="popup-container"></div>
    </body>
</html>
