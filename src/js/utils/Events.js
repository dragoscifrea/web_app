/** This Class acts as a singleton enabeling the followind events:
 * AVAILABLE EVENTS:
 *    App.WINDOW_RESIZE
 *    App.WINDOW_SCROLL
 */

define([
    'jquery',
    'underscore'
],  function($,_) {

    function Events() {

        this._resizeStart = true;
        this._currentBreakpoint = null;


         //set up window resize events so they can be caught from everywhere inside the app
        this._init = function () {
            this.$window = $(window);

            this.$window.on("resize.app", _.bind(this._onAppResize, this));
            this.$window.on('scroll', _.bind(this._onAppScroll, this));
            this.$window.on('touchmove', _.bind(this._onAppScroll, this));
            this.$window.on('gesturechange', _.bind(this._onAppScroll, this));

            this._initBreakpoints();
        };

        this._initBreakpoints = function() {

            //RESPONSIVE STATIC VARIABLES FOR BREAKPOINTS
            this.BREAKPOINT_MOBILE = {name: 'mobile', min: 0, max: 479};
            this.BREAKPOINT_PHABLET = {name: 'phablet', min: 480, max: 767};
            this.BREAKPOINT_TABLET = {name: 'tablet', min: 768, max: 1023};
            this.BREAKPOINT_DESKTOP = {name: 'desktop', min: 1024, max: 1439};
            this.BREAKPOINT_LARGE = {name: 'large', min: 1440, max: 10000};

            //create array for easy comparrison
            this.BREAKPOINTS = [this.BREAKPOINT_MOBILE, this.BREAKPOINT_PHABLET, this.BREAKPOINT_TABLET, this.BREAKPOINT_DESKTOP, this.BREAKPOINT_LARGE];

            this._currentBreakpoint = this.BREAKPOINT_MOBILE;

            this._checkBreakpoint();

        };

        this._onAppResize = function() {

            if (this._resizeStart) {
                this._resizeStart = false;
                this._onAppResizeStart();
            }

            App.Vent.trigger('App.WINDOW_RESIZE', {height: this.$window.height(), width: this.$window.width()});

            this._lazyResizeEnd();
            this._checkBreakpoint();
        };

        this._onAppResizeEnd = function() {
            this._resizeStart = true;
            App.Vent.trigger('App.WINDOW_RESIZE_END', {height: this.$window.height(), width: this.$window.width()});
        };

        this._onAppResizeStart = function() {
            App.Vent.trigger('App.WINDOW_RESIZE_START', {height: this.$window.height(), width: this.$window.width()});
        };

        this._onAppScroll = function() {

            if ( !("ontouchstart" in window || navigator.msMaxTouchPoints) && (typeof App !== 'undefined') ) {
                App.Vent.trigger('App.WINDOW_SCROLL', {top:this.$window.scrollTop()});
            }

        };

        /**
         * Fire an app wide event for a breakpoint change
         * @return {void}
         */
        this._onBreakpointChange = function() {

            if (typeof App !== 'undefined') {
                App.Vent.trigger('App.BREAKPOINT_CHANGE', this._currentBreakpoint);
            }


        };

        /**
         * Check with breakpoint we are currently in and if it's
         * changed fire off an event
         * @return {void}
         */
        this._checkBreakpoint = function() {

            if (this._currentBreakpoint !== undefined) {
                var width = this.$window.width();
                var currentBreakpoint = this._currentBreakpoint;

                _.each(this.BREAKPOINTS, function(breakpoint) {
                    if ((width >= breakpoint.min) && (width <= breakpoint.max)) {
                        currentBreakpoint = breakpoint;
                    }
                });

                if (currentBreakpoint.name != this._currentBreakpoint.name) {
                    this._currentBreakpoint = currentBreakpoint;
                    this._onBreakpointChange();
                }
            }
        };

        /**
         * Get current breakpoint
         * @return {object} Breakpoint object (with name, min, max properties)
         */
        this.getCurrentBreakpoint = function() {
            return this._currentBreakpoint;
        };

        this.getCurrentBreakpointName = function() {
            return this._currentBreakpoint.name;
        };

        this.getCurrentBreakpointMin = function() {
            return this._currentBreakpoint.min;
        };

        this.getCurrentBreakpointMax = function() {
            return this._currentBreakpoint.max;
        };

        this.getAllBreakpoints = function() {
            return this.BREAKPOINTS;
        };

        this.destroy = function() {
            $(window).off('resize.app');
            $(window).off('scroll');
        };

        this._lazyResizeEnd = _.debounce(this._onAppResizeEnd, 500);
        this._init();

    }

    var returnValue;

    if (typeof Events === 'object') {
        returnValue = Events;
    } else {
        returnValue = new Events();
    }

    return returnValue;
});
