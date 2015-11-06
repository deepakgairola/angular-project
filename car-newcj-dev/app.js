define([appURL+'routes', appURL+'services/dependencyResolverFor'], function(config, dependencyResolverFor)
{
    var app = angular.module('app', ['pbHeaderFooter','ngAnimate','new-form-carousel','ngRoute', 'ngCookies','angular-intro',  'ngSanitize','ngAria','ngMaterial','ngMessages','vAccordion']);

    app.value('config', {
        'SERVICE_TAX':1.14
    });

    // Convert string to tile case
    String.prototype.toTitleCase = function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    //Sorting an object based on property object.
    Array.prototype.sortByProp = function(p){
        return this.sort(function(a,b){
            return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
        });
    };

    //Creating a map of unique objects from an array.
    Array.prototype.unique = function(){
        var n = {},r=[];
        for(var i = 0; i < this.length; i++){
            if (!n[this[i]]){
                n[this[i]] = true;
                r.push(this[i]);
            }
        }
        return r;
    };

    //Insert an item at a particular index in an array.
    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

    app.run(['$route', '$rootScope', '$location','$window','$document','$mdDialog', function ($route, $rootScope, $location,$window,$document,$mdDialog) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };

        $rootScope.$on( "$routeChangeSuccess", function(event, data) {

                if (data.$$route) {
                    if(data.loadedTemplateUrl!=undefined){
                        if(data.loadedTemplateUrl.indexOf('quotes')!=-1) {
                            $rootScope.bodyStyle = true;
                        }
                    }
                }

           $mdDialog.cancel();
        });

    }]);

   app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$animateProvider',
        '$sceDelegateProvider',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,$animateProvider,$sceDelegateProvider)
        {

            app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            /*if(window.history && window.history.pushState){
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }*/
            $locationProvider.html5Mode(false);
            if(config.routes !== undefined)
            {
                angular.forEach(config.routes, function(route, path)
                {
                    $routeProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                });
            }

            if(config.defaultRoutePaths !== undefined)
            {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }

            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                'http://cdn.policybazaar.com'
            ]);


        }
    ]);
    return app;
});
