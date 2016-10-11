define(["application"], function(app) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider', '$provide','$controllerProvider',
        function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider, $provide,$controllerProvider) {

            //Change default views and controllers directory
            app.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                service: $provide.service
            };

            //inject our ajaxInterceptor to the $httpProvider
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            // For any unmatched url, redirect to Application Context url
            $urlRouterProvider.otherwise("/home");

            function resolveDependencies($q, $rootScope, dependency) {
                var defer = $q.defer();
                require(dependency, function() {
                    defer.resolve();
                    $rootScope.$apply();
                });
                return defer.promise;
            }

            $stateProvider
                .state('index', {
                    url: '/home',
                    views: {
                        "pageContent": {
                            templateUrl: "components/office-layout/templates/main-view.html"
                        },
                        "headerView@index": {
                            templateUrl: "components/office-layout/templates/header.html"
                        },
                        "layoutView@index": {
                            templateUrl: "components/office-layout/templates/view.html",
                            controller: "viewController as vc",
                            resolve: {
                                load: ["$q", "$rootScope", function($q, $rootScope){
                                        var dependency = ["viewCtrl", "tooltipDirective", "dragNdrop"];
                                        return resolveDependencies($q, $rootScope, dependency);
                                }]
                            }
                        }
                    }
                });
        }
    ]);
});