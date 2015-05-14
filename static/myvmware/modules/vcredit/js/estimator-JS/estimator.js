'use strict';
angular.module('estimator',['ui.router', 'ui.bootstrap', 'ajaxModule', 'angular-bootstrap-select', 'angular-bootstrap-select.extra','estimatorFactoryModule', 'estimatorCtrlModule','chooseServiseCtrlModule', 'configureServiceControllerModule', 'addonControllerModule', 'directivesModule', 'viewEstimateContollerModule','cartSummaryCtrlModule', 'confirmDialog.main'])
.config(function estimatorConfig($stateProvider, $urlRouterProvider, $sceProvider){
	$urlRouterProvider.otherwise('/');
	$sceProvider.enabled(false);
	$stateProvider.state('estimator',{
		url:'/',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/estimator.tpl.html',
				controller:'estimatorCtrl'
			}
		}
	})
	.state('estimatorSteps',{
		url:'/estimatorSteps',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/allSteps.tpl.html',
				controller:'chooseServiseCtrl'
			}
		}
	})
	.state('estimatorSteps.selectService',{
		url:'/selectService',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/selectService.tpl.html',
				controller:'selectServiceCtrl'
			}
		}
	})
	.state('estimatorSteps.configureService',{
		url:'/configureService',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/configureService.tpl.html',
				controller:'configureServiceCtrl'
			}
		}
	})
	.state('estimatorSteps.configureAddons',{
		url:'/configureAddons',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/configureAddons.tpl.html',
				controller:'configureAddonsCtrl'
			}
		}
	})
	.state('estimatorSteps.viewEstimate',{
		url:'/viewEstimate',
		parent:'estimatorSteps',
		views:{
			'allSteps':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/viewEstimate.tpl.html',
				controller:'viewEstimateCtrl'
			}
		}
	})
	.state('cartSummary',{
		url:'/cartSummary',
		views:{
			'estimator-view':{
				templateUrl:vCredit.globalVars.vcredit_path+'templates/estimator/steps/confirmation.tpl.html',
				controller:'cartSummaryCtrl'
			}
		}
	})
})

.controller('selectServiceCtrl', ['$scope', '$state', '$modal', 'newServiceFactory', '$window', function($scope, $state, $modal, newServiceFactory, $window){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : choose-service");
	$scope.ajaxLoader = false;
		
	if($scope.isEmpty(newServiceFactory.chooseService.productFamilyInfo)){
		$scope.localObj = {};

		$scope.localObj.serviceSel = "";
		//newServiceFactory.chooseService = {};
		
		//$state.go('estimator');
		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;

					  } else {
					  	newServiceFactory.chooseService = {};
					  	angular.copy(successData, newServiceFactory.chooseService);
					  	angular.copy(newServiceFactory.chooseService, $scope.chooseServiceData);
					  	$scope.showLoader = false;
					  	vmf.msg.page("");
					  }	
				});
				

			},function(errorData){
				
				$scope.showLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			newServiceFactory.globalVars.estimatorSelectServiceURL,    		// This comes from the jsp config object
			"" // changed scope variable to add secondary admin....
			,'GET'
		);
	}else{
		angular.copy(newServiceFactory.chooseService, $scope.chooseServiceData);

		$scope.localObj.serviceSel = newServiceFactory.chooseService.serviceSel;
		//console.log(newServiceFactory.chooseService.productFamilyInfo);
		//console.log($scope.chooseServiceData);
	}

	$scope.goToConfigureService = function(){

		$scope.ajaxLoader = true;

		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;
						$scope.ajaxLoader = false;

					  } else {
					  	angular.copy(successData.wrapper, newServiceFactory.configureService);
					  	newServiceFactory.chooseService.serviceSel = $scope.localObj.serviceSel;
					  	$scope.showLoader = false;
					  	$scope.ajaxLoader = false;
					  	$state.go('estimatorSteps.configureService');
					  	vmf.msg.page("");
					  	
					  }	
				});

			},function(errorData){
				$scope.ajaxLoader = false;
				$scope.showLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.getServicesUrl,    		// This comes from the jsp config object
			"_vm_productFamilyCode=" + $scope.localObj.serviceSel // changed scope variable to add secondary admin....
			,'GET'
		);

	}

	$scope.displayErrorAlert = function(errorMsg, alertBoxtype, alertWarning, alertServiceDetailLink, showProgressBar){
		if(errorMsg != "" && errorMsg != null && errorMsg != undefined){
			$scope.$emit('alertWarningData',
			{
				//'alertWarningMessage' : errorMsg,
				'alertWarning' : alertWarning,
				'alertServiceDetailLink' : alertServiceDetailLink,
				'showProgressBar' : showProgressBar
			});
			vmf.msg.page("");
			setTimeout(function(){
				vmf.msg.page(errorMsg, "", alertBoxtype,".alertErrorMessageContainer"); //success/info/warning/danger
			}, 500);
			$window.scrollTo(0,0);	
		}
		else{
			vmf.msg.page("");
		}
		
	}
}])

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
}]);


