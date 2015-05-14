'use strict';
angular.module('estimator',['ui.router', 'ui.bootstrap', 'ajaxModule', 'angular-bootstrap-select', 'angular-bootstrap-select.extra','estimatorFactoryModule', 'payMethodContollerModule','estimatorCtrlModule','chooseServiseCtrlModule', 'configureServiceControllerModule', 'addonControllerModule', 'directivesModule', 'viewEstimateContollerModule', 'confirmDialog.main'])
.config(function estimatorConfig($stateProvider, $urlRouterProvider, $sceProvider){
	$urlRouterProvider.otherwise('/');
	$sceProvider.enabled(false);

	$stateProvider
	.state('payMethod',{
		url:'/payMethod',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/payMethod.tpl.html',
				controller:'payMethodCtrl'
			}
		}
	})
	.state('estimator',{
		url:'/:prodFamily',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/trialEstimator.tpl.html',
				controller:'trialEstimatorCtrl'
			}
		}
	})
	.state('estimatorSteps',{
		url:'/estimatorSteps',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/steps/allSteps.tpl.html',
				controller:'chooseServiseCtrl'
			}
		}
	})
	.state('estimatorSteps.configureService',{
		url:'/configureService',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/steps/configureService.tpl.html',
				controller:'configureServiceCtrl'
			}
		}
	})
	.state('estimatorSteps.configureAddons',{
		url:'/configureAddons',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/steps/configureAddons.tpl.html',
				controller:'configureAddonsCtrl'
			}
		}
	})
	.state('estimatorSteps.viewEstimate',{
		url:'/viewEstimate',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/trialEstimator/steps/viewEstimate.tpl.html',
				controller:'viewEstimateCtrl'
			}
		}
	})
})
.filter('customCurrency', ["$filter", function ($filter) {       
    return function(amount, currencySymbol, locale){

        var currency = $filter('currency'); 
        var finalCurr;   

        if(amount < 0){        	
             finalCurr = currency(amount, currencySymbol).replace("(", "-").replace(")", ""); 
        } else {
        	 finalCurr = currency(amount, currencySymbol);
        }
        
        var sep = finalCurr.indexOf('.');

        if(locale == 'JPY') { 
        	return finalCurr.substring(0, sep);
      	}else{
      		return finalCurr;
      	}

    };
}])
.run(function($rootScope) {
    $rootScope.Object = Object;
});

