define([ 
	"angularUIRoute", 
	"ajaxService", 
	], 
	function(){
		return angular.module("app", [
			"ui.router",
			'ajaxService',
			"ngSanitize"
			]);
});