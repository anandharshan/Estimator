angular.module('chooseServiseCtrlModule',[])
.controller('chooseServiseCtrl', ['$scope', '$state', '$modal', 'newServiceFactory', 'confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory, confirmDialog, $window){
	$scope.localObj={};
	$scope.localObj.serviceSel="";
	$scope.showProgressBar=true;
	$scope.chooseServiceData = {};
	$scope.globalVars={};
	$scope.totalCartAmount = 0;
	// $scope.chooseServiceInitial = {};

	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	// angular.copy(newServiceFactory.initialSetupData, $scope.chooseServiceInitial);

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.pageInit = function(getCurrState){
			//console.log(getCurrState);
			$scope.currState = getCurrState.name.split('.')[1];
		    angular.forEach($scope.steps,function(data){
		    	if(data.link == $scope.currState){
		    		$scope.pageHeader = data.header;
		    	}
		    });		    
		    
		    setTimeout(function(){
		    	$('li.active').removeClass('visited');
		    	$('li.active').prevAll().addClass('visited');
		    }, 200);

		    if(getCurrState.name == "estimatorSteps.selectService"){
			    newServiceFactory.postServices(
					function(successData){
						//console.log(successData);
						$scope.$apply(function(){
							if(successData.ERROR_MESSAGE != undefined){
							  	//$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, false);
							  	console.log("Error Message present in the Success Data");
							} else {
								//Initializes newServiceFactory.estimatedCredit, for copying the sucessData
								newServiceFactory.estimatedCredit = {};
							  	angular.copy(successData, newServiceFactory.estimatedCredit);
							  	angular.copy(successData.wrapper.sppTokenToMSRP,newServiceFactory.tokenToMSRPConversion);
							  	$scope.calculateTotalAmountAndFormatData();
							  	//vmf.msg.page("");		 --No idea why this was used(Can be removed) 	
							}
						});							

					},function(errorData){
						console.log("Invalid JSON Format. Please Rectify");
						/*$scope.$apply(function(){
							$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, false);
							Error Handling needs to be taken care of.
						});
						*/
					},
					$scope.globalVars.serviceEstimateUrl,
					'',
					'GET'
				);	
		    }

		    vmf.msg.page("");

	}

	
	/*
	*For formating the raw structure given from Json into requried format
	*will Return an array $scope.creditCartInfo having Objects
	*Object will Have properties :: cost,serviceName, serviceType
	*/
	$scope.calculateTotalAmountAndFormatData = function(){
		if(!$scope.isEmpty(newServiceFactory.tokenToMSRPConversion)){
			$scope.tokenValue = parseFloat(newServiceFactory.tokenToMSRPConversion.tokenValue);
			$scope.msrpValue = parseFloat(newServiceFactory.tokenToMSRPConversion.msrpValue);
			$scope.creditValue = $scope.tokenValue / $scope.msrpValue;
		}
		else{
			$scope.tokenValue = 1;
			$scope.msrpValue = 1;
			$scope.creditValue = 1;
		}

		var cartArray = newServiceFactory.estimatedCredit.wrapper.serviceList;
		var cartObj = {};
		$scope.creditCartInfo = [];
		$scope.totalCartAmount = 0;
		$scope.firstTimeUser = true;
		var cartAddOnCost = 0;
			
		angular.forEach(cartArray, function(cartItem){
			cartObj ={};
			var cartItemCost = 0,  addOn_Arr = [], addOnItem ;
			cartItemCost += Math.round(parseFloat(cartItem.core.extendedCost) * $scope.creditValue);

			//calcutaion for storage cost

			angular.forEach(cartItem.addons, function(addOn_Arr){
				angular.forEach(addOn_Arr, function(addOnItem){
					cartAddOnCost = 0;
					if(addOnItem[7] != null && addOnItem[7][6]){
						cartAddOnCost = parseFloat(addOnItem[7][6]);
					}
					cartItemCost += Math.round((cartAddOnCost + parseFloat(addOnItem[6])) * $scope.creditValue);
				});
			});

			cartObj.id = cartItem.id;
			cartObj.cost = cartItemCost;
			cartObj.serviceName = cartItem.core.serviceName;
			cartObj.serviceType = cartItem.core.serviceType;
			cartObj.currentCredit = false;
			$scope.creditCartInfo.push(cartObj);

			$scope.totalCartAmount += cartObj.cost;
		});

		if($scope.totalCartAmount > 0){
			$scope.firstTimeUser = false;
		}
	}

	$scope.updateCartPopOver = function(id, cost, serviceName, serviceType){
		var cartItemCheck = false;
		$scope.totalCartAmount = 0;
		angular.forEach($scope.creditCartInfo, function(cartData){
			if(cartData.id == id){
				cartItemCheck = true;
				cartData.cost = cost;
				cartData.serviceName = serviceName;
				cartData.serviceType = serviceType;
				if(newServiceFactory.generatedCartId == ""){
					cartData.currentCredit = true;
				}else{
					cartData.currentCredit = false;
				}
			}
		});
		if(cartItemCheck == false){
			var cartObj = {};
			cartObj.id = id;
			cartObj.cost = cost;
			cartObj.serviceName = serviceName;
			cartObj.serviceType = serviceType;
			cartObj.currentCredit = true;
			$scope.creditCartInfo.unshift(cartObj);
		}

		angular.forEach($scope.creditCartInfo, function(cartData){
			$scope.totalCartAmount += parseFloat(cartData.cost);
		});

		//console.log($scope.creditCartInfo);
	}

	$scope.showModalPopupToGoTOSumaryPage = function(){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate :cart : view-cart-summary");
		if($scope.currState == 'viewEstimate'){
			$state.go('cartSummary');
		}else{
			confirmDialog.confirm({
					header : '',
					msg : $scope.globalVars.cartPopOver_ModalMsg,
					btnYesText : $scope.globalVars.continueBtn,
					btnNoText : $scope.globalVars.cancelBtn,
					confirmIconType : 'confirm' //confirm/alert/info/''
				},{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
			.result.then(function(btn){
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate :cart : view-cart-summary:continue");
				newServiceFactory.chooseService = {};
				newServiceFactory.generatedCartId = "";
				$state.go('cartSummary');
			},function(btn){
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate :cart : view-cart-summary:cancel");
			});	
		}
			 
	}
	
	$scope.functionForTagging = function(){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate :cart");
	}
	
	$scope.steps = [];
	angular.copy(newServiceFactory.steps,$scope.steps);

	$scope.pageInit($state.current);

	$scope.$on(
		'$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){ 
		    $scope.pageInit(toState);
		   //console.log(toState);
		}
	);
}]);