angular.module('estimatorCtrlModule',[])
.controller('estimatorCtrl', ['$scope', '$state', '$modal', 'newServiceFactory', '$window', function($scope, $state, $modal, newServiceFactory, $window){
	$scope.localObj={};
	$scope.showPriceList = "";
	$scope.estimateData = {};
	$scope.globalVars = {};
	$scope.showLoader = true;
	$scope.ajaxLoader = false;
	// newServiceFactory.initialSetupData={};

	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

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
			newServiceFactory.globalVars.estimatorInitialSetupURL,    		// This comes from the jsp config object
			"" // changed scope variable to add secondary admin....
			,'GET'
		);
	
	var arrayFromObject = function(defaultValue, data, selectedkey, selectedVal){
		var varArray = [];
		var varObject = {};
		varObject.key = "";
		varObject.val = defaultValue;
		varArray.push(varObject);
		angular.forEach(data, function(val){
			var varObject = {};
			varObject.key = val[selectedkey];
			varObject.val = val[selectedVal].trim();
			var duplicateVal = false;
			angular.forEach(varArray, function(valArray){
				if(valArray.val ==  val[selectedVal].trim()){
					duplicateVal = true;
				}
			});
			if(!duplicateVal){
				varArray.push(varObject);	
			}
		});
		return varArray;
	}

	
	
	//console.log($scope.estimateData);
	$scope.displayData = function(selectServiceData){
		angular.copy(selectServiceData.wrapper, $scope.estimateData);

		$scope.estimateData.showPriceList ? $scope.showPriceList = true : $scope.showPriceList = false;

		if($scope.showPriceList){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : internal");
		}else{
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : public");
		}
		if($scope.estimateData.showPriceList == true){
			var priceSelectionArray = [];
			var varObject = {};
			varObject.currencyCode = "";
			varObject.region = "";
			//varObject.val = $scope.globalVars.selectPriceList;
			//priceSelectionArray.push(varObject);
			angular.forEach($scope.estimateData.priceList, function(val){
				var varObject = {};
				varObject.currencyCode = val[0];
				//varObject.region = val[7];
				varObject.val = val[1];
				var duplicateVal = false;
				angular.forEach(priceSelectionArray, function(valArray){
					if(valArray.val ==  varObject.val){
						duplicateVal = true;
					}
				});
				if(!duplicateVal){
					priceSelectionArray.push(varObject);	
				}
			});
			
			$scope.priceSelection = priceSelectionArray;
			//console.log($scope.priceSelection);
			$scope.localObj.priceListSel = "";
		}

		if($scope.estimateData.showPriceList == false){
			var countrySelectionArray = [];
			//Structure of object inside countrySelection is given as below.
			// var varObject = {};
			// varObject.currencyCode = "";
			// varObject.region = "";
			// varObject.val = $scope.globalVars.selectYourCountry;
			// varObject.countryCode = "";
			// countrySelectionArray.push(varObject);
			angular.forEach($scope.estimateData.country, function(val){
				var varObject = {};
				varObject.currencyCode = val[5];
				varObject.region = val[7];
				varObject.val = val[1];
				varObject.countryCode = val[0];
				var duplicateVal = false;
				if (varObject.val == $scope.globalVars.defaultEstimatorCountry){
					$scope.localObj.DefaultCountrySelection = varObject;
				}
				angular.forEach(countrySelectionArray, function(valArray){
					if(valArray.val ==  varObject.val){
						duplicateVal = true;
					}
				});
				if(!duplicateVal){
					countrySelectionArray.push(varObject);	
				}
			});

			$scope.countrySelection = countrySelectionArray;
			if($scope.localObj.DefaultCountrySelection != null || $scope.localObj.DefaultCountrySelection != undefined){
				$scope.localObj.countrySel = $scope.localObj.DefaultCountrySelection;
			}else{
				$scope.localObj.countrySel = $scope.countrySelection[0];
			}
		}
		
		
		$scope.localObj.custTypeSel = '';
	
	}

	$scope.chooseService = function(){
		//console.log($scope.localObj.countrySel.key);
		//console.log($scope.localObj.priceListSel.key);
		//console.log($scope.localObj.custTypeSel.key);

		/*newServiceFactory.getServices(function(data){
			$scope.$apply(function(){
				angular.copy(data, newServiceFactory.chooseService);
			});

		},newServiceFactory.globalVars.estimatorSelectServiceURL,"GET");*/
		$scope.ajaxLoader = true;

		if($scope.showPriceList){
			$scope.currencyCode = $scope.localObj.priceListSel.currencyCode + "&_vm_countryCode=''&_vm_regionName=" + $scope.localObj.priceListSel.region;
		}else{
			$scope.currencyCode = $scope.localObj.countrySel.currencyCode + "&_vm_regionName=" + $scope.localObj.countrySel.region + "&_vm_countryCode=" + $scope.localObj.countrySel.countryCode;
		}

		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;
						$scope.ajaxLoader = false;

					  } else {
					  	angular.copy(successData, newServiceFactory.chooseService);
					  	$scope.showLoader = false;
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");
					  	$state.go('estimatorSteps.selectService');				  	
					  }	
				});
				

			},function(errorData){
				
				$scope.showLoader = false;
				$scope.ajaxLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			newServiceFactory.globalVars.estimatorSelectServiceURL,    		// This comes from the jsp config object
			"_vm_currencyCode=" + $scope.currencyCode + "&_vm_customerType=" + $scope.localObj.custTypeSel // changed scope variable to add secondary admin....
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
	
	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

}]);