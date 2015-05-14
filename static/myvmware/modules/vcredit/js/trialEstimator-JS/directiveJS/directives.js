angular.module('directivesModule',[])
.directive('ngProgressBar',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/trialEstimator/directives/content-progress-bar.tpl.html'
	}
})
.directive('ngContentHeader',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/trialEstimator/directives/content-header.tpl.html'
	}
})
.directive('ngAlertWarning',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/trialEstimator/directives/alert-warning.tpl.html'
	}
});