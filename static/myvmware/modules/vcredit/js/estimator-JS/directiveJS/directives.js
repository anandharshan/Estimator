angular.module('directivesModule',[])
.directive('ngProgressBar',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/estimator/directives/content-progress-bar.tpl.html'
	}
})
.directive('ngContentHeader',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/estimator/directives/content-header.tpl.html'
	}
})
.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.stopEvent, function (e) {
                e.stopPropagation();
            });
        }
    };
})
.directive('ngAlertWarning',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vCredit.globalVars.vcredit_path+'templates/estimator/directives/alert-warning.tpl.html'
	}
});