angular.module('payMethodContollerModule',[])
.controller('payMethodCtrl', ['$scope', '$state', '$modal', 'newServiceFactory','confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory, confirmDialog, $window){
	$scope.globalVars = {};
	$scope.paymentOrder = {};
	$scope.showLoader = true;
	$scope.ajaxLoader = false;
	$scope.paymethod = null;
	$scope.purchaseOrderSelect = false;
	$scope.localObj = {};
	$scope.localObj.payOption = null;
	$scope.localObj.subscriptionFund = null;
	$scope.continueBtnDisable = true;
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	//Taging to be triggered on loading of the page
	if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : how-to-buy");

	$scope.displayData = function(){
		$scope.paymentOrder = newServiceFactory.payOrderJSON;
					
		if(newServiceFactory.payOrderJSON.fundGroupPaymentMethod == null || newServiceFactory.payOrderJSON.fundGroupPaymentMethod.length == 0){
			$scope.localObj.payOption = 'PO';
			$scope.purchaseOrderSelect = false;
			$scope.continueBtnDisable = false;
		}else{
			$scope.purchaseOrderSelect = true;
		}
	}

	if($.isEmptyObject(newServiceFactory.payOrderJSON)){
		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
						$scope.showLoader = false;
						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
					  } else {
						newServiceFactory.payOrderJSON = {};
					  	angular.copy(successData.wrapper, newServiceFactory.payOrderJSON);
						$scope.displayData();
					  	$scope.showLoader = false;
					  	vmf.msg.page("");
					  }	
				});
			},function(errorData){
				$scope.showLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			newServiceFactory.globalVars.purchaseSubscriptionServiceURL
			,'GET'
		);
	}else{
		$scope.showLoader = false;
		vmf.msg.page("");
		$scope.displayData();
		$scope.localObj.payOption = newServiceFactory.payOrderJSON.payOption;
		$scope.continueBtnDisable = false;
	}
	
	$scope.continueBtn = function(){
		if($scope.localObj.payOption == "PO" || $scope.localObj.subscriptionFund != null){
			$scope.continueBtnDisable = false;
		}else{
			$scope.continueBtnDisable = true;
		}
	}

	$scope.payMethodContinue = function () {

		if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : how-to-buy : continue");

		newServiceFactory.payOrderJSON.payOption = $scope.localObj.payOption;
		
		if($scope.localObj.payOption == "PO"){
			$scope.ajaxLoader = true;
			newServiceFactory.postServices(
				function(successData){
					$scope.$apply(function(){
						if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
							$scope.ajaxLoader = false;

						  } else {
						  	angular.copy(successData, newServiceFactory.chooseService);
						  	$scope.ajaxLoader = false;
							$state.go('estimator');
						  }	
					});

				},function(errorData){
					
					$scope.ajaxLoader = false;
					$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
				},
				newServiceFactory.globalVars.step2BuildanEstimateURL,
				"_VM_serviceInstanceId="+$scope.globalVars.encodedTrialID+"&_vm_productFamilyCode=" + $scope.paymentOrder.productFamilyCode
				,'GET'
			);
		} else if($scope.localObj.payOption == "SF") {
			window.location.href = $scope.globalVars.configuratorURL+"?_VM_flow=trial&_VM_serviceInstanceId="+$scope.globalVars.encodedTrialID+"&_VM_fundGroupID="+$scope.localObj.subscriptionFund+"#/newService/configureService/"+$scope.paymentOrder.productFamilyCode;
		}
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

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.cancelFn = function(){
		newServiceFactory.clearObjects();
		window.location = $scope.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();
	}
	
	$scope.displayConfirmModal = function(){
	    confirmDialog.confirm({
            header : '',
            msg : $scope.globalVars.confirm_message,
            btnYesText : $scope.globalVars.confirm,
            btnNoText : $scope.globalVars.cancelBtn,
            confirmIconType : 'confirm' //confirm/alert/info/''
        },{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
        .result.then(function(btn){
            $scope.cancelFn();
        },function(btn){
   
        }); 
	}
}]);