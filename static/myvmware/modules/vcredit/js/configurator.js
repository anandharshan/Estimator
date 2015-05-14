'use strict';
angular
.module('configurator', ['ui.router','ui.bootstrap','newService','addOnService','renewService','ajaxModule','angular-bootstrap-select', 'angular-bootstrap-select.extra', 'dynamicComboBox', 'confirmDialog.main'])
.config(function myAppConfig($stateProvider, $urlRouterProvider, $sceProvider) {

	/*if(labelData.page == "newservice"){
		$urlRouterProvider.otherwise('/newService/configureService');
	}
	else if(labelData.page == "addon"){
		$urlRouterProvider.otherwise('/addOnService/selectService');
	}*/

	$urlRouterProvider.otherwise('/');
	$sceProvider.enabled(false);			// Do not delete this line - Required for IE7.
	$stateProvider.state('configurator', {
		url: '/',
		views: {
			'configurator-view': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/configurator.tpl.html',
				controller: 'configuratorCtrl'
			}
		}
	})
}).controller('configuratorCtrl',['$scope','$state','$modal', 'newServiceFactory','vmf',
function($scope, $state, $modal, newServiceFactory, vmf){
	if(typeof callBack != 'undefined' && typeof callBack.addsc == 'function'){
		callBack.addsc({'f':'riaLinkmy','args':['subscription-services : configurator']});
	}
	
	$scope.configData = {};
	$scope.globalVars = vcredit.globalVars;
	newServiceFactory.serviceObj = {};
	$scope.showFundInfoSection = true;

	$scope.changeFund = true;
	$scope.displayConfigPage = true;
	$scope.disabledText = 'disabled';
	$scope.isFundDefaultSelected = true;
	$scope.showProgressBar = true;
	newServiceFactory.isPraxisComplete = false;

	if (navigator.appVersion.indexOf("MSIE 7.") != -1){
    	$scope.disabledText = '';
    }

	$scope.helpURL  = $scope.globalVars.configurator_KBArticle_link;

	if(newServiceFactory.getParameterByName("_VM_flow") !== ''){
		$scope.displayConfigPage = false;
		if(newServiceFactory.getParameterByName("_VM_flow") == 'addon')
			$state.go('addOnService.configureAddons');
		else if(newServiceFactory.getParameterByName("_VM_flow") == 'renewal')
			$state.go('renewService.configureAddons');

		return false;
	}


	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.chkEmptyObject = function(val){
		return $.isEmptyObject(val);
	}

	$scope.displayData = function(getConfigData){
		$scope.configData = getConfigData;
		$scope.pageHeader = $scope.globalVars.configuratorPageTitle;
		$scope.eaAccountDisplay = getConfigData.header.eaAccountNumber + "-" + getConfigData.header.eaAccountName;
		$scope.eaAccount = getConfigData.header.eaAccountNumber + "-" + getConfigData.header.eaAccountName;
		$scope.eaAccountNumber = getConfigData.header.eaAccountNumber;
		$scope.eaAccountName = getConfigData.header.eaAccountName;
		$scope.getFund = getConfigData.header.fundName;
		$scope.getFundId = getConfigData.header.fundGroupId;
		$scope.getBalance =  getConfigData.header.balance;
		$scope.currency = getConfigData.header.redemptionCurrencySymbol;
		$scope.currencyLocale = getConfigData.header.redemptionCurrency;
		$scope.identifierName = getConfigData.header.commitName;
		$scope.isXaasFund = 1; //getConfigData.header.isXaasFund;
		$scope.trueUp = getConfigData.header.trueUp;
		newServiceFactory.configuratorHomePageData = {};
		//To initialize the Selectboxes
		/*$scope.localObj = {};
		$scope.localObj.selectServiceRenewal = "select";
		$scope.localObj.selectServiceNew = "select";
		$scope.localObj.selectServiceAddon = "select";

		//To Enable/Disable the Select box
		$scope.btnNewServiceContinueDisabled = true;
		$scope.btnAddonServiceContinueDisabled = true;
		$scope.btnRenewServiceContinueDisabled = true;

		$scope.disableSelect = false;

		//dropdown select disable logic for VSPP for configurator
		if(vcredit.globalVars.serviceCategory == "VSPP"){
			var count =  getConfigData.header.activeServiceCount;
			$scope.disableSelect = (count <= 0) ? true : false;
		}*/
	}

	/*//For Enabling and disabling Continue Button
	$scope.enableDisableContinueButton = function(serviceType, prodFamily) {
		//console.log(serviceType, prodFamily);
		var optionSelected;
		if(serviceType == "newService"){
			optionSelected = $scope.localObj.selectServiceNew;
			optionSelected  != null ? $scope.btnNewServiceContinueDisabled = false : $scope.btnNewServiceContinueDisabled = true;
		}else if(serviceType == "addOnService"){
			optionSelected = $scope.localObj.selectServiceAddon;
			optionSelected  != null ? $scope.btnAddonServiceContinueDisabled = false : $scope.btnAddonServiceContinueDisabled = true;
		}else if(serviceType == "renewService"){
			optionSelected = $scope.localObj.selectServiceRenewal;
			optionSelected  != null ? $scope.btnRenewServiceContinueDisabled = false : $scope.btnRenewServiceContinueDisabled = true;
		}
	}

	//For Redirecting to the next service page depending on continue button clicked
	$scope.redirectToServicePage = function(serviceType, prodFamily){
		//console.log(serviceType, prodFamily);

		var redirectState;
		if(serviceType == 'newService'){
			redirectState = serviceType+".configureService";
		}else{
			redirectState = serviceType+".selectService";
		}
		$state.go(redirectState,{'prodFamily':prodFamily});	
	}
	//console.log(newServiceFactory.configuratorHomePageData);*/
	if($scope.displayConfigPage == true){
		if ($.isEmptyObject(newServiceFactory.configuratorHomePageData)){
			newServiceFactory.postServices(
				function(successData){

					$scope.$apply(function(){
						if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	// Display modal if error
					  	$scope.displayInfoModal({
					  		'header' : $scope.globalVars.ajax_error_header,
					  		'body' : successData.ERROR_MESSAGE,
					  		'okText' : $scope.globalVars.modal_ok,
					  		'cancelText' : $scope.globalVars.modal_cancel,
					  		'showOk' : true,
					  		'showCancel':false
					  	});

					  } else {
					  	$scope.displayData(successData);
					  	angular.copy(successData,newServiceFactory.configuratorLinksObj);		  	 		  	
					  }

					});

				},function(errorData){
					$scope.displayInfoModal({
					  		'header' : $scope.globalVars.ajax_error_header,
					  		'body' : $scope.globalVars.ajax_error_body,
					  		'okText' : $scope.globalVars.modal_ok,
					  		'cancelText' : $scope.globalVars.modal_cancel,
					  		'showOk' : true,
					  		'showCancel':false
					  	});
				},
				vcredit.globalVars.getConfiguratorOptionsUrl,    		// This comes from the jsp config object
				null
				,'GET'
			);
		}
		else{
			$scope.displayData(newServiceFactory.configuratorHomePageData);
		}
	}
	
	

	$scope.displayInfoModal = function(getModalData){

		$scope.modalData = getModalData;

		$scope.CurrModal = $modal.open({
	      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal.tpl.html',
		  scope : $scope
	    });

	}

	//Change Fund Modal Start

	$scope.openChangeFund = function(){
		$scope.errMessage = "";
		$scope.ajaxFundLoader = false;
		$scope.continueFundDisable = false;
		$scope.selectedFundName = "";
		$scope.selectedFundId = "";
		newServiceFactory.postServices(
			function(successData){

				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

				  	// Display modal if error
				  	$scope.displayInfoModal({
				  		'header' : $scope.globalVars.ajax_error_header,
				  		'body' : successData.ERROR_MESSAGE,
				  		'okText' : $scope.globalVars.modal_ok,
				  		'cancelText' : $scope.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});

				  } else {
				  	$scope.displayChangeFundModal(successData);			  	 		  	
				  }

				});

			},function(errorData){
				$scope.displayInfoModal({
				  		'header' : $scope.globalVars.ajax_error_header,
				  		'body' : $scope.globalVars.ajax_error_body,
				  		'okText' : $scope.globalVars.modal_ok,
				  		'cancelText' : $scope.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});
			},
			vcredit.globalVars.changeFundModalUrl,    		// This comes from the jsp config object
			'_VM_eaName='+ $scope.eaAccountName +'&_VM_eaNumber='+ $scope.eaAccountNumber
			,'GET'
		);
	}

	$scope.displayChangeFundModal = function(getModalData){
		//console.log(getModalData);
		$scope.changeFundModalData = getModalData;
		$scope.currencySymbol = $scope.currency;
		$scope.sltFund = $scope.getFundId;

		$scope.CurrModal = $modal.open({
	      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/changeFundModal.tpl.html',
		  scope : $scope,
		  windowClass: 'overlay-lg'
	    });

	}

	$scope.changeFundValue = function(fundData){
		//console.log(fundData);
		$scope.selectedFundName = "";
		$scope.selectedFundId = "";
		if(fundData != null || fundData != undefined){
			$scope.continueFundDisable = false;
			$scope.selectedFundName = fundData.name;
			$scope.selectedFundId = fundData.id;
			$scope.selectedFundGroupId = fundData.groupId;
			$scope.isFundDefaultSelected = fundData.defaultFlag;
		}
	}

	$scope.continueChangeFundModal = function(){
		$scope.errMessage = "";
		$scope.ajaxFundLoader = true;
		$scope.continueFundDisable = true;
		$scope.postData = {"_VM_changedFundGroupID" : $scope.selectedFundId};
		//$scope.postData._VM_changedFundGroupID = $scope.selectedFundId;
		if($scope.isFundDefaultSelected == false){
			newServiceFactory.postServices(
				function(successData){

					$scope.$apply(function(){
						if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
							$scope.ajaxFundLoader = false;
							$scope.errMessage = successData.ERROR_MESSAGE;
					  	} else {
					  		//$scope.displayChangeFundModal(successData);
					  		$scope.ajaxFundLoader = false;			  	 		  	
					  		$scope.CurrModal.close();
					  		//$state.transitionTo('configurator', {_VM_fundGroupID:$scope.selectedFundId}, {'reload':true});
	                		//window.location.assign(vcredit.globalVars.configHomeUrl + "&_VM_fundGroupID=" + $scope.selectedFundId);
	                		newServiceFactory.clearObjects();
	                		$scope.displayData(successData);
	                		angular.copy(successData,newServiceFactory.configuratorLinksObj);
					  	}

					});

				},function(errorData){
					$scope.errMessage = $scope.globalVars.ajax_error_body;
				},
				vcredit.globalVars.submitSelectedFundUrl,    		// This comes from the jsp config object
				'_VM_changedFundGroupID='+ $scope.selectedFundId 
				//JSON.stringify($scope.postData)
				,'GET'
			);
		}
		else{
			$scope.ajaxFundLoader = false;			  	 		  	
	  		$scope.CurrModal.close();
		}
		
		//$scope.ajaxFundLoader = false;
	}

	$scope.updateQueryStringParameter = function(uri, key, value) {
	  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	  if (uri.match(re)) {
	    return uri.replace(re, '$1' + key + "=" + value + '$2');
	  }
	  else {
	    return uri + separator + key + "=" + value;
	  }
	}

	$scope.getKey = function(obj){
        return Object.keys(obj);
    }
	//Change Fund Modal End
	
	// Modal Popup Ok button
	$scope.ok = function(){
		$scope.ajaxLoader = false;
		$scope.CurrModal.close();
	}

	// Modal Popup Cancel button
	$scope.cancel = function(){
		$scope.ajaxLoader = false;
		$scope.CurrModal.close();
	}

}])
.factory('newServiceFactory',['$http','ajaxCall','$filter', 'vmf', '$modal', "$rootScope", "$anchorScroll",function($http, ajaxCall, $filter, vmf, $modal, $rootScope, $anchorScroll){

	var factory = {};
	//$window.scrollTo(0,0); tried commenting the code but restart issue still persists....
	$rootScope.$on("$locationChangeSuccess", function() {
               $anchorScroll();
     });
	factory.serviceObj = {};
	factory.offeringPartner={};
	factory.daasFlow=false;
	factory.allPartners={};
	factory.defaultPartner={};
	factory.displaySelectedPartner={};
	factory.selectedBufferPartner={};
	factory.oneTimeClick=false;
	factory.selPartnerRadio=false;
	factory.defaultPartnerCheck=false;
	factory.addOnObj = {};
	factory.globalVars = vcredit.globalVars;
	factory.config = vcredit.globalVars;
	factory.completeObj={};
	factory.successServiceObj = {};
	factory.isDashboardFlow = false;
	factory.getURLParam = '';
	factory.configuratorHomePageData = {};
	factory.adminDetail = {};
	factory.configuratorLinksObj = {};
	factory.isPraxisFlow = false;
	factory.isDaasFlow = false;
	factory.fundInfo = {};
	factory.isPraxisComplete = '';

	factory.getFundInfo = function(data){
		if(data.commitInfo == null || data.commitInfo == undefined){
			console.log("Commit Info is not available. Portal Issue");
		}
		if((data.fundInfo == null || data.fundInfo == undefined) && data.commitInfo != undefined){
			factory.fundInfo.name = data.commitInfo.name;
			factory.fundInfo.identifierName = data.commitInfo.name;
			factory.fundInfo.trueUp = 1;
			factory.fundInfo.fundBalance = (parseFloat(data.commitInfo.commitLevel) - parseFloat(data.commitInfo.currentConsumption)).toString();
			factory.fundInfo.redemptionCurrency = data.commitInfo.redemptionCurrency;
			factory.fundInfo.redemptionCurrencySymbol = data.commitInfo.redemptionCurrencySymbol;
			factory.fundInfo.isXaasFund = 1;
			factory.fundInfo.fundAccess = 1;
			factory.fundInfo.commitLevel = data.commitInfo.commitLevel;
			factory.fundInfo.currentConsumption = data.commitInfo.currentConsumption;
			factory.fundInfo.threshold = data.commitInfo.threshold;
		}
	}

	factory.getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	factory.getServices = function(callbackFn,url,data,method){		
		ajaxCall.call(url, method, data, callbackFn);
	}

	factory.postServices = function(successFn,errorFn,url,data,method){		
		ajaxCall.call(url, method, data, successFn, errorFn);
	}

	factory.clearObjects = function(){
		factory.serviceObj = {};
		factory.addOnObj = {};
		factory.completeObj={};
		factory.successServiceObj = {};
	}

	//For Showing Confirm Dialog Box, with "Yes" and "No" Options
	factory.cancelFlow = function(callbackFn){
		vmf.msg.confirm(factory.globalVars.confirm_message,factory.globalVars.confirm, factory.globalVars.buttonLabelYes, factory.globalVars.buttonLabelNo, function(){
			if(typeof callbackFn == 'function'){
				callbackFn();
			}
		});
	}

	factory.tierDiscount = function(tierInfo, supportTierInfo, label, preSelectedQty, currency, paymentId, currencyCode){
		preSelectedQty = parseInt(preSelectedQty);
		if(isNaN(preSelectedQty) || preSelectedQty == undefined || preSelectedQty == null){
			preSelectedQty = 0;
		}
		//console.log(Object.keys(tierInfo)[Object.keys(tierInfo).length-1]);
		
		var max_tier = Object.keys(tierInfo)[Object.keys(tierInfo).length-1];
		var min_tier = Object.keys(tierInfo)[0];
		var discountTextString = "";
		var qtyArray = [];
		
		if(paymentId == "1"){
			label = "";
		}else{
			label = " " + label;
		}
		angular.forEach(tierInfo, function(val, key){
			
			qtyArray = key.split("_");
			if((parseInt(qtyArray[1])-parseInt(preSelectedQty)) > 0){
				discountTextString += factory.globalVars.quantityText + " ";
				var selectedKey = key;

				var initialQuantity = (parseInt(qtyArray[0])-parseInt(preSelectedQty));
				if(initialQuantity <= 0){
					initialQuantity = 1;
				}

				if(min_tier == max_tier && parseInt(qtyArray[0])!=parseInt(qtyArray[1])){
					discountTextString += parseInt(qtyArray[0]) + "+";
				}else if(min_tier == key){
					discountTextString += parseInt(qtyArray[0]) + "-" + (parseInt(qtyArray[1])-parseInt(preSelectedQty));
				}else if(max_tier != key){
					discountTextString += initialQuantity + "-" + (parseInt(qtyArray[1])-parseInt(preSelectedQty));
				}else{
					discountTextString += initialQuantity + "+";
				}

				var tierCost = 0;
				tierCost = changeNumber(val[0]);
				
				//for support tier quantity when earlier selected quantity > 0
				if((parseInt(qtyArray[0])+parseInt(preSelectedQty)) >= qtyArray[0] && (parseInt(qtyArray[1])+parseInt(preSelectedQty)) <= qtyArray[1]){
					selectedKey = (parseInt(qtyArray[0])+parseInt(preSelectedQty)) + "_" + (parseInt(qtyArray[1])+parseInt(preSelectedQty));				
				}

				//for support cost			
				if(!$.isEmptyObject(supportTierInfo)){
					if(supportTierInfo[selectedKey] != undefined && supportTierInfo[selectedKey] != null){
							tierCost = tierCost + changeNumber(supportTierInfo[selectedKey][0]);
					}
				}
				
				var currFilter = $filter('customCurrency');
				var filteredCurrency = currFilter(tierCost, currency, currencyCode);
				discountTextString += ": "+ filteredCurrency + label + "&nbsp;&nbsp;&nbsp;";

				//discountTextString += ": "+ currency + parseFloat(tierCost).toFixed(2) + label + "&nbsp;&nbsp;&nbsp;";
			}
			
		});


		//console.log(discountTextString);
		return discountTextString;
	}
	
	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));

		return number;
	}

	factory.steps = [
				{
					"link" : "configureService",
					"linkText" : factory.globalVars.configureService,
					"header" : factory.globalVars.PurchaseNewService,
					"active" : 0,
					"changeFund" : true
				},
				{
					"link" : "configureAddons",
					"linkText" : factory.globalVars.addAdditionalCapacity,
					"header" : factory.globalVars.PurchaseNewService,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "reviewAndSubmit",
					"linkText" : factory.globalVars.reviewAndSubmit,
					"header" : factory.globalVars.PurchaseNewService,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "complete",
					"linkText" : factory.globalVars.complete,
					"header" : factory.globalVars.PurchaseNewService,
					"active" : 0,
					"changeFund" : false
				}
			]	
	;

	factory.stepsAddon = [
				{
					"link" : "selectService",
					"linkText" : factory.globalVars.sltExistingService,
					"header" : factory.globalVars.purchaseAddons,
					"active" : 0,
					"changeFund" : true
				},
				{
					"link" : "configureAddons",
					"linkText" : factory.globalVars.addCapacity,
					"header" : factory.globalVars.purchaseAddons,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "reviewAndSubmit",
					"linkText" : factory.globalVars.reviewAndSubmit,
					"header" : factory.globalVars.purchaseAddons,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "complete",
					"linkText" : factory.globalVars.complete,
					"header" : factory.globalVars.purchaseAddons,
					"active" : 0,
					"changeFund" : false
				}
			]	
	;

	factory.stepsRenewal = [
				{
					"link" : "selectService",
					"linkText" : factory.globalVars.sltExistingService,
					"header" : factory.globalVars.serviceRenewalConfiguration,
					"active" : 0,
					"changeFund" : true
				},
				{
					"link" : "configureAddons",
					"linkText" : factory.globalVars.modifyCoreAddonService,
					"header" : factory.globalVars.serviceRenewalConfiguration,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "reviewAndSubmit",
					"linkText" : factory.globalVars.reviewAndSubmit,
					"header" : factory.globalVars.serviceRenewalConfiguration,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "complete",
					"linkText" : factory.globalVars.complete,
					"header" : factory.globalVars.serviceRenewalConfiguration,
					"active" : 0,
					"changeFund" : false
				}
			]	
	;

	return factory;

}])
.factory('configuratorFactory',function(){
	var configFactory = {};

		configFactory.configObj = labelData;

	return configFactory;
})
.factory('vmf',function(){
	return vmf;
})
.directive('ngBreadCrumb',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: { link1:'@bLink1', link2:'@bLink2', link3:'@bLink3' },
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/breadcrumbs.tpl.html'
	}
})
.directive('ngAddonTable',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/addon-table-step2.tpl.html'
	}
})
.directive('ngAddonTableAddonFlow',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/addon-table-step2-Addon-flow.tpl.html'
	}
})
.directive('ngReviewTable', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/review-table-step3.tpl.html'
	}

})
.directive('ngReviewTableAddonFlow', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/review-table-step3-Addon-flow.tpl.html'
	}

})
.directive('ngProgressBar',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/content-progress-bar.tpl.html'
	}
})
.directive('ngContentHeader',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/content-header.tpl.html'
	}
})
.directive('ngAlertWarning',function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope:true,
		templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/alert-warning.tpl.html'
	}
}).filter('customCurrency', ["$filter", function ($filter) {       
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