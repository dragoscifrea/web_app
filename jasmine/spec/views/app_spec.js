define(['app/views/app'], function(view) {

    if (typeof jasmine === 'undefined') return;

    describe('Main', function () {

        describe('App, Marionette.Application', function () {

            it('should be defined(should return an object)', function () {
                expect(view).toBeDefined();
            });
        });
    });
});
