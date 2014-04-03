define(['app/views/pages/home/HomeView'], function(HomeView) {

    if (typeof jasmine === 'undefined') return;


    var homeView = new HomeView();

    describe('HomeView', function () {

        describe('home/landing page', function () {

            it('should be defined(should return an object)', function () {
                expect(homeView).toBeDefined();
            });
        });
    });
});
