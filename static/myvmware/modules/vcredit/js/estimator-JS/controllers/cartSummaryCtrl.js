angular.module('cartSummaryCtrlModule',[])
.controller('cartSummaryCtrl', ['$scope', '$state', '$modal', 'newServiceFactory','confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory,confirmDialog, $window){
	//console.log("cartSummaryCtrl is loaded.");
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : cart-summary");
	$scope.localObj={};
	$scope.globalVars = {};
	newServiceFactory.cartDetail = {};
	$scope.serviceData = {};
	$scope.serviceData.services = {};
	$scope.showLoader = true;
	$scope.removeAjaxLoader = false;
	$("[data-toggle='tooltip']").tooltip('show');

	var paymentType = {
		"0":"Promotion",
		"1":"Prepaid",
		"2":"Monthly",
		"3":"Annually",
		"4":"One Time"
	}
	$scope.ajaxLoader = false;

	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	newServiceFactory.postServices(
		function(successData){
			$scope.$apply(function(){
				if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
					$scope.showLoader = false;
					$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
				  } else {
				  	angular.copy(successData, newServiceFactory.cartDetail);
				  	$scope.showLoader = false;
				  	vmf.msg.page("");
				  	$scope.serviceData.services = newServiceFactory.cartDetail.wrapper.serviceList;
				  	$scope.currencySymbol = newServiceFactory.cartDetail.wrapper.currencySymbol;
				  	$scope.currencyCode = newServiceFactory.cartDetail.wrapper.currencyCode;
				  	if(!$scope.isEmpty(newServiceFactory.cartDetail.wrapper.sppTokenToMSRP)){
						$scope.tokenValue = parseFloat(newServiceFactory.cartDetail.wrapper.sppTokenToMSRP.tokenValue);
						$scope.msrpValue = parseFloat(newServiceFactory.cartDetail.wrapper.sppTokenToMSRP.msrpValue);
						$scope.creditValue = $scope.tokenValue / $scope.msrpValue;
					}
				  }	
			});
		},function(errorData){
			$scope.showLoader = false;
			$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
		},
		newServiceFactory.globalVars.serviceEstimateUrl,    		// This comes from the jsp config object
		"" // changed scope variable to add secondary admin....
		,'GET'
	);

	$scope.keysOfObj = function(obj){
		if (!obj) {
			return [];
		}
		return Object.keys(obj);
	}

	/*Code for removal of service STARTS*/

	$scope.removeService = function($event,index){
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}
		confirmDialog.confirm({
				header : '',
				msg : $scope.globalVars.removeServiceMessage,
				btnYesText : $scope.globalVars.remove,
				btnNoText :$scope.globalVars.cancelBtn,
				confirmIconType : 'confirm' //confirm/alert/info/''
			},{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
		.result.then(function(btn){
			$scope.callBackFnToremoveService(index, '1');
		},function(btn){
		});	
	}

	$scope.removeServiceAddOn = function($event,index, addOn_Name, addOnIndex){
		//console.log(index +  addOn_Name  + addOnIndex);
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}

		confirmDialog.confirm({
				header :  '',
				msg : $scope.globalVars.removeAddonMsg,
				btnYesText : $scope.globalVars.remove,
				btnNoText :$scope.globalVars.cancelBtn,
				confirmIconType : 'confirm' //confirm/alert/info/''
		},{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
		.result.then(function(btn){
			$scope.callBackFnToremoveService(index, addOn_Name, addOnIndex);
		},function(btn){
		});
	}

	$scope.callBackFnToremoveService = function(coreSeriveiIndex,addOn_Name,addOnServiceIndex){
		$scope.removeAjaxLoader = true;
		//sent the request to back end for removing the Compute Service
		var serviceData = newServiceFactory.cartDetail.wrapper.serviceList;
						
		var postObj = "";

		postObj = "_vm_coreID=" + serviceData[coreSeriveiIndex].id.toString();

		if(addOn_Name != '1'){
			postObj = postObj + "&_vm_addonSku=" + serviceData[coreSeriveiIndex]['addons'][addOn_Name][addOnServiceIndex][0];
		}

		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;
						$scope.removeAjaxLoader = false;
					  } else {
					  	$scope.removeAjaxLoader = false;
					  	$scope.showLoader = false;
					  	vmf.msg.page("");		  	
					  	
					  	if(addOn_Name == '1'){//core service
							serviceData.splice(coreSeriveiIndex, 1);
							if(serviceData.length == 0){
								$state.go('estimatorSteps.selectService');
							}
						}else {//add on
							serviceData[coreSeriveiIndex]['addons'][addOn_Name].splice(addOnServiceIndex, 1);
						}
						$scope.serviceData.services = newServiceFactory.cartDetail.wrapper.serviceList;
					  }	
				});
				

			},function(errorData){
				$scope.removeAjaxLoader = false;
				$scope.showLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.removeAddonPostURL,    		// This comes from the jsp config object
			postObj                // changed scope variable to add secondary admin....
			,'GET'
		);

		
	}



	/*Code for removal of service ENDS*/
	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
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

	$scope.getbillingTypeSting = function(billingType){
		return(paymentType[billingType]);
	}

	$scope.addAllCost = function(){
		var totalCost = 0;
		for(var service in $scope.serviceData.services){
			totalCost += service.core.cost;
		}
		return totalCost;
	}

	//Collapse icon switching logic
	$scope.colapse = function($index){
		if($('.panel-collapse').eq($index).hasClass('in')){
			$('.openaccordion').eq($index).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
		}
		else {
			$('.openaccordion').eq($index).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
		}
	}

	/* Calcultion for final page STARTS*/

	//Calculate the cost of Each service
	$scope.costOfService = function(serviceInfo){
		var cartItemCost = 0;
		cartItemCost += $scope.ceilCost(serviceInfo.core.extendedCost);
		for(var addOn_Name in serviceInfo.addons){
			cartItemCost += $scope.costOfEachAddon(serviceInfo, addOn_Name);
		}
		return cartItemCost;
	}

	//Caculate the total cost
	$scope.totalServicesCost = function(allServiceInfo){
		var totalCost = 0;
		for(var serviceInfo in allServiceInfo){
			totalCost += $scope.costOfService(allServiceInfo[serviceInfo]);
		}
		return totalCost;
	}

	$scope.levelSKU = function(){
		var varLevelSKU = "";
		var totalCost = $scope.totalServicesCost($scope.serviceData.services);
		//console.log(totalCost);
		angular.forEach(newServiceFactory.cartDetail.wrapper.levelSkuList, function(data){
			if(parseFloat(totalCost) >= parseFloat(data.minValue) && parseFloat(totalCost) <= parseFloat(data.maxValue)){
				varLevelSKU = data.sku;
			}
		});
		return varLevelSKU;
	}
	//calculate cost for each Add ON
	$scope.costOfEachAddon = function(serviceInfo, addOn_Name){
		var computeCost = 0, addOn_Arr = [], addOn_Item ;
		//calcutaion for compute cost
		addOn_Arr = serviceInfo.addons[addOn_Name];	
		for(var i in addOn_Arr){
			computeCost += $scope.costofEachSingleAddOn(addOn_Arr, i);
		}
		return computeCost;
	}

	$scope.ceilCost = function(cost){
		var varCeilCost = Math.round(parseFloat(cost) * $scope.creditValue);
		return varCeilCost;
	}

	$scope.costofEachSingleAddOn = function(addOn_Arr, addOnIndex){
		var computeCost = 0, addOn_Item ;
		addOn_Item = addOn_Arr[addOnIndex];
		computeCost += $scope.ceilCost(parseFloat(addOn_Item[6]));
		if(addOn_Item[7] != null && addOn_Item[7][6]){
			computeCost += $scope.ceilCost(parseFloat(addOn_Item[7][6]));
		}
		return computeCost;
	}

	$scope.goToAddService = function(){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : cart-summary : addAnotherService");
		$state.go('estimatorSteps.selectService');
	}

	$scope.exportToExcel = function(){
		// $scope.ajaxLoader = true;
		// newServiceFactory.postServices(
		// 	function(successData){
		// 		$scope.$apply(function(){
		// 			if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
		// 				$scope.ajaxLoader = false;
		// 				$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
		// 			  } else {
		// 			  	$scope.ajaxLoader = false;
		// 			  	vmf.msg.page("");
		// 			  }	
		// 		});
		// 	},function(errorData){
		// 		$scope.ajaxLoader = false;
		// 		$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
		// 	},
		// 	newServiceFactory.globalVars.exportExcelSummary,    		// This comes from the jsp config object
		// 	"" // changed scope variable to add secondary admin....
		// 	,'GET'
		// );
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : cart-summary : export-excel");
	}

	/* Calcultion for final page ENDS*/
}]);