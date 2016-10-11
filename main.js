'use strict';

require.config({
	baseUrl: 'components/',
	waitSeconds: 20,
	paths:{

		// Controllers
		headerCtrl:"office-layout/controllers/header-controller",
		viewCtrl: "office-layout/controllers/view-controller",
		tooltipDirective: "office-layout/directives/tooltip",
		dragNdrop: "office-layout/directives/drag-drop",
		
		//Vendor files
		jquery: "vendors/jquery/jquery",
		angular: "vendors/angular/angular",
		angularUIRoute: "vendors/angular/angular-ui-router",
		ngSanitize: "vendors/angular/angular-sanitize",

		myRoutes: "office-layout/route",
		application : "office-layout/app",
		ajaxService : "office-layout/services/ajax-service"
	},
	shim:{
		'application':{
			deps: ['jquery','angular', "angularUIRoute","ngSanitize"]
		},
		'ajaxService':{
			deps: ['angular']
		},
		'angular': {
			deps: ['jquery']
		},
		'angularUIRoute' :{
			deps: ['angular']
		},
		'ngSanitize':{
			deps:['angular']
		}
	}
});

// Project level dependencies
require(['application', "myRoutes", "jquery"],
		function(app, routes){
			var $html = angular.element(document.getElementsByTagName('body')[0]);

			angular.element().ready(function(){
				var injector = angular.bootstrap($html, [app['name']]);
			});
		}
	);