define([], function()
{
    return {
        defaultRoutePath: '',
        routes: {
            '/': {
                templateUrl: appURL + 'templates/car-index.html',
                dependencies: [
                appURL + 'controller/IndexController',
                    appURL + 'controller/FirstPageController',
                    appURL + 'services/CommonService',
                    appURL + 'services/QuoteService',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'filter/customFilter',
                    appURL + 'directives/OnlyNumber',
                    appURL + 'services/NewCarService',
                    appURL + 'controller/CustomerController'
                ]
            },
            '/question': {
                templateUrl: appURL + 'templates/car-index.html',
                dependencies: [
                appURL + 'controller/IndexController',
                    appURL + 'controller/FirstPageController',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'services/CommonService',
                    appURL + 'filter/customFilter',
                    appURL + 'services/QuoteService',
                    appURL + 'directives/OnlyNumber',
                    appURL + 'services/NewCarService',
		            appURL + 'controller/CustomerController'
                ]
            },
            '/matrix': {
                templateUrl: appURL + 'templates/Matrix-landing-page.html',
                dependencies: [
                    appURL + 'controller/MatrixLandingController',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'services/QuoteService',
                    appURL + 'services/CommonService',
                    appURL + 'filter/customFilter',
                    appURL + 'services/NewCarService'

                ]
            },
            '/yrs': {
                templateUrl: appURL + 'templates/car-index.html',
                dependencies: [
                    appURL + 'controller/IndexController',
                    appURL + 'controller/FirstPageController',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'services/CommonService',
                    appURL + 'services/QuoteService',
                    appURL + 'filter/customFilter',
                    appURL + 'directives/OnlyNumber',
                    appURL + 'services/NewCarService',
                    appURL + 'controller/CustomerController'
                ]
            },
            '/customer':{
                templateUrl: appURL + 'templates/car-index.html',
                dependencies: [
                    appURL + 'controller/IndexController',
                    appURL + 'controller/FirstPageController',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'services/CommonService',
                    appURL + 'services/QuoteService',
                    appURL + 'filter/customFilter',
                    appURL + 'services/NewCarService',
                    appURL + 'directives/OnlyNumber',
                    appURL + 'controller/CustomerController'
                ]
            },
            '/quote': {
                templateUrl: appURL + 'templates/quotes.html',
                dependencies: [
                    appURL + 'controller/QuotesMainController',
                    appURL + 'services/QuoteService',
                    appURL + 'services/CommonQuoteService',
                    appURL + 'services/CommonService',
                    appURL + 'filter/customFilter',
                    appURL + 'controller/DialogController',
                    appURL + 'controller/DiscountController',
                    appURL + 'controller/ViewPlanController',
                    appURL + 'controller/idvController',
                    appURL + 'controller/compareController',
                    appURL + 'controller/NcbController',
                    appURL + 'directives/OnlyNumber',
                    appURL + 'controller/EmailPlanController'
                ]
            }
        }
    };
});
