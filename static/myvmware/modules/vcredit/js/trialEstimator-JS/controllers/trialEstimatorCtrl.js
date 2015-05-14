angular.module('estimatorCtrlModule',[])
.controller('trialEstimatorCtrl', ['$scope', '$state', '$modal', 'newServiceFactory','confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory,confirmDialog, $window){
	//Local variable initialization
	$scope.localObj={};
	$scope.estimateData = {};
	$scope.globalVars = {};
	$scope.showLoader = true;
	$scope.ajaxLoader = false;
	$scope.countrySelection = "";

	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	//For Populating the data in the drop down and the text box.
	$scope.displayData = function(selectServiceData){
		angular.copy(selectServiceData.wrapper, $scope.estimateData);

		if($scope.estimateData.country.length > 1){
			var countrySelectionArray = [];
			var varObject = {};
			varObject.currencyCode = "";
			varObject.region = "";
			varObject.val = $scope.globalVars.selectYourCountry;
			varObject.countryCode = "";
			countrySelectionArray.push(varObject);
			angular.forEach($scope.estimateData.country, function(val){
				var varObject = {};
				varObject.currencyCode = val[5];
				varObject.region = val[7];
				varObject.val = val[1];
				varObject.countryCode = val[0];
				var duplicateVal = false;
				angular.forEach(countrySelectionArray, function(valArray){
					if(valArray.val ==  varObject.val){
						duplicateVal = true;
					}
				});
				if(!duplicateVal){
					countrySelectionArray.push(varObject);	
				}
			});
			$scope.countrySelectionArr = countrySelectionArray;
			$scope.localObj.countrySel = $scope.countrySelectionArr[0];
		}else {
			$scope.localObj.countrySel = $scope.estimateData.country[0];
		}	
		$scope.localObj.custTypeSel = '';
		//console.log($scope.localObj.countrySel);
		if(newServiceFactory.chooseService.custTypeSel != null && newServiceFactory.chooseService.custTypeSel != undefined && newServiceFactory.chooseService.custTypeSel != ''){
			if($scope.estimateData.country.length > 1){
				angular.forEach($scope.countrySelectionArr, function(data, i){
					if(angular.equals(data,newServiceFactory.chooseService.countrySel)){
						$scope.localObj.countrySel = $scope.countrySelectionArr[i];
					}
					
				});
			}
			//$scope.localObj.countrySel = newServiceFactory.chooseService.countrySel;
			$scope.localObj.custTypeSel = newServiceFactory.chooseService.custTypeSel;
		}
		//$scope.localObj.countrySel = $scope.countrySelectionArr[1];
	}

	// Redirection and product family check to make the page independent
	if($.isEmptyObject(newServiceFactory.chooseService) == true){

		if($state.params.prodFamily != null && $state.params.prodFamily != undefined && !$.isEmptyObject($state.params.prodFamily)){
			newServiceFactory.postServices(
				function(successData){
					$scope.$apply(function(){
						if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
							$scope.showLoader = false;

						  } else {
						  	angular.copy(successData, newServiceFactory.chooseService);
						  	$scope.showLoader = false;
						  	$scope.displayData(successData);
						  	vmf.msg.page("");
						  	
						  }	
					});
					

				},function(errorData){
					
					$scope.showLoader = false;
					$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
				},
				newServiceFactory.globalVars.step2BuildanEstimateURL,
				"_vm_productFamilyCode=" + $state.params.prodFamily
				,'GET'
			);
		}else{
			$state.go('payMethod');
		}
	} else {
		$scope.displayData(newServiceFactory.chooseService);
		$scope.showLoader = false;
		vmf.msg.page("");
	}

	$scope.goToConfigureService = function(){
		if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : build-estimate : continue");
		
		newServiceFactory.chooseService.countrySel = $scope.localObj.countrySel;
		newServiceFactory.chooseService.custTypeSel = $scope.localObj.custTypeSel;
		if($scope.estimateData.country.length > 1){
			$scope.currencyCode = $scope.localObj.countrySel.currencyCode + "&_vm_regionName=" + $scope.localObj.countrySel.region + "&_vm_countryCode=" + $scope.localObj.countrySel.countryCode;
		}else{
			$scope.currencyCode = $scope.estimateData.country[0][5] + "&_vm_regionName=" + $scope.estimateData.country[0][7] + "&_vm_countryCode=" + $scope.estimateData.country[0][0];
		}
		

		$scope.ajaxLoader = true;
		$scope.localObj.serviceSel;
		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;
						$scope.ajaxLoader = false;

					  } else {
					  	angular.copy(successData.wrapper, newServiceFactory.configureService);
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
			$scope.globalVars.step3ConfigureServiceURL,
			"_VM_serviceInstanceId="+$scope.globalVars.encodedTrialID+"&_vm_productFamilyCode=" + $scope.estimateData.productFamilyInfo.productFamilyCode +"&_vm_currencyCode=" + $scope.currencyCode + "&_vm_customerType=" + $scope.localObj.custTypeSel
			,'GET'
		);

	}

	$scope.gotoPayMethod = function(){
		$state.go("payMethod");
	}


	//Common Error Handling Codes
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
		$state.go('payMethod');
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