var appURL = '';

require.config({
    baseUrl: config[env].base,
    urlArgs: "bust=v17",
    waitSeconds: 600,
    paths: {
        'jquery':getCdnPath('scripts/components/jquery/jquery-2.1.1'),
        'angular': getCdnPath('scripts/components/angular/angular.min'),
        'angular-route': getCdnPath('scripts/components/angular-route/angular-route.min'),
		'angular-cookies': getCdnPath('scripts/components/angular-cookies/angular-cookies.min'),
        'new-form-carousel':getCdnPath('directives/form-carous'),
		'angular-intro': getCdnPath('scripts/components/angular-intro/angular-intro'),
		'angular-sanitize' : getCdnPath('scripts/components/angular/angular-sanitize.min'),
        'angular-animate':getCdnPath('scripts/components/angular-animate/angular-animate.min'),
        'angular-aria':getCdnPath('scripts/components/angular-aria/angular-aria.min'),
        'angular-material':getCdnPath('scripts/components/angular-material/angular-material'),
        'angular-messages':getCdnPath('scripts/components/angular-messages/angular-messages.min'),
        'header-footer':getCdnHeaderPath('pbHeaderFooter'),
        'vaccordian':getCdnPath('scripts/components/angular/v-accordion.min'),
		'app': appURL+'app'
    },
	shim: {
		'app': {
			deps: ['jquery','angular','angular-route', 'angular-cookies', 'angular-intro','angular-sanitize','angular-animate','angular-aria','angular-material','angular-messages','new-form-carousel','vaccordian','header-footer']
		},
        'angular-route': {
			deps: ['angular']
		},
        'header-footer':{
            deps: ['angular']
        },
		'angular-cookies':{
            deps: ['angular']
        },
		'angular-intro': {
			deps: ['angular']
		},
        'angular-sanitize': {
			deps: ['angular']
		},
        'angular-aria':{
            deps:['angular']
        },
        'angular-animate':{
            deps:['angular']
        },
        'new-form-carousel':{
            deps:['angular','angular-animate']
        },
        'angular-material':{
            deps:['angular','angular-aria','angular-animate']
        },
        'angular-messages':{
            deps:['angular','angular-aria','angular-animate']
        },
        'vaccordian':{
            deps: ['angular','angular-animate']
        }
	}
});

require
(
    [
        'app'
    ],
    function(app)
    {
        angular.bootstrap(document, ['app']);
    }
);
