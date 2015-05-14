'use strict';
angular.module('addonControllerModule',[])
.controller('configureAddonsCtrl',['$scope','$state','$modal','newServiceFactory', '$window',
function($scope, $state, $modal, newServiceFactory, $window){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : add-additional-capacity");
	$scope.ajaxLoader = false;
	if($.isEmptyObject(newServiceFactory.configureService)){
		/*newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.ajaxLoader = false;

					  } else {
					  	
					  	angular.copy(successData, newServiceFactory.successServiceObj);
					  	//console.log(newServiceFactory.successServiceObj);
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");		  	
					  	$scope.displayAddOnData(newServiceFactory.successServiceObj);
					  }	
				});
				

			},function(errorData){
				$scope.ajaxLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.estimatorAddAdditionalCapacityURL,    		// This comes from the jsp config object
			''                // changed scope variable to add secondary admin....
			,'GET'
		);*/
		$state.go('estimatorSteps.selectService');
	}


	$scope.getAddOnServiceUrl = vCredit.globalVars.fetchAddonServiceDetailsUrl;
	$scope.serviceData = {};
	
	if(Object.keys(newServiceFactory.addOnObj).length > 0){
		$scope.addOnData=newServiceFactory.addOnObj;
	}else{
		$scope.addOnData = {};
	}
	
	$scope.currState = $state.current.name.split('.')[1];
	$scope.globalVars = {};
	$scope.addOnFlag = 0;
	$scope.validSelectedData = true; 
	$scope.trueUpError = true;
	$scope.showLoader = true;
	$scope.successServiceObj = {};

	angular.copy(newServiceFactory.configureService, $scope.serviceData);
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);

	
	angular.copy(newServiceFactory.successServiceObj, $scope.successServiceObj);  //comment for local copy
	
	$scope.displayAddOnData = function(getData){
		//$scope.$apply(function(){			// remove this for dev-15

			angular.copy(getData.wrapper, $scope.addOnData);			
			angular.copy(getData.wrapper, newServiceFactory.addOnObj);

			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;	
			}

			//console.log(Object.keys($scope.addOnData.addons).length);
			if(($scope.addOnData.addons != null && $scope.addOnData.addons != undefined) && Object.keys($scope.addOnData.addons).length > 0){
				$scope.remainingTerm = "";
				$scope.addOnFlag = 1;
				if($scope.addOnData.core.remainingTerm[1] > 0 && $scope.addOnData.core.remainingTerm[1] != null && $scope.addOnData.core.remainingTerm[1] != undefined){
					$scope.remainingTerm = $scope.remainingTerm + $scope.addOnData.core.remainingTerm[1] + " " + $scope.globalVars.years + " ";
				}
				if($scope.addOnData.core.remainingTerm[2] > 0 && $scope.addOnData.core.remainingTerm[2] != null && $scope.addOnData.core.remainingTerm[2] != undefined){
					if($scope.remainingTerm != ""){
						$scope.remainingTerm = $scope.remainingTerm + $scope.globalVars.andText + " ";
					}
					$scope.remainingTerm = $scope.remainingTerm + $scope.addOnData.core.remainingTerm[2] + " " + $scope.globalVars.months + " ";
				}
				if($scope.addOnData.core.remainingTerm[3] > 0 && $scope.addOnData.core.remainingTerm[3] != null && $scope.addOnData.core.remainingTerm[3] != undefined){
					if($scope.remainingTerm != ""){
						$scope.remainingTerm = $scope.remainingTerm + $scope.globalVars.andText + " ";
					}
					$scope.remainingTerm = $scope.remainingTerm + $scope.addOnData.core.remainingTerm[3] + " " + $scope.globalVars.days;
				}
				
				var defaultPaymentType = $scope.addOnData.core.defaultPaymentType;

				var promotionPayType = '';
				angular.forEach($scope.addOnData.paymentType, function(payTypeData){

					if(parseInt(payTypeData.paymentTypeID) == 0){
						promotionPayType = payTypeData.paymentTypeVal;
					}
					
				});
				
				$scope.discountDuration = 0;
				$scope.discountPercentage = 0;
				if(promotionPayType != '' && $scope.addOnData.addons[promotionPayType] != undefined){
					var promotionObject = $scope.addOnData.addons[promotionPayType][0][6][promotionPayType][Object.keys($scope.addOnData.addons[promotionPayType][0][6][promotionPayType])][3];
					
					if(promotionObject != undefined && promotionObject != null){
						$scope.discountDuration = parseInt(promotionObject[0]);
						$scope.discountPercentage = parseInt(promotionObject[1]);	
					}
				}

				var selectdQtyCost = 0;
				var selectdAddonSKU = "";
				angular.forEach($scope.addOnData.addons,function(aData){

					angular.forEach(aData, function(data){

						data[8] = {};  // Selected Addon object
						data[8].selectedAddonSKU = '';
						data[8].selectedQty = 0;
						data[8].extendedCost = 0;
						data[8].supportAddOnExtendedCost = 0;
						data[8].paymentType = [];
						data[8].noCost = "N";
						data[8].discountText = "";

						angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

							angular.forEach(data[3], function(val){
								if(parseInt(payTypeData.paymentTypeID) == parseInt(val)){
									data[8].paymentType.push(payTypeData);
								}
							});
							
						});

						if(defaultPaymentType == null || defaultPaymentType == undefined){
							defaultPaymentType = data[4];
						}

						angular.forEach(data[8].paymentType, function(typeData){
							if(parseInt(typeData.paymentTypeID) == parseInt(defaultPaymentType)){
								data[8].selectedType = typeData;
								//console.log(typeData);
							}	
						});

						if(data[8].selectedType == undefined || data[8].selectedType == null){
							angular.forEach(data[8].paymentType, function(typeData){
								if(parseInt(typeData.paymentTypeID) == parseInt(data[4])){
									data[8].selectedType = typeData;
								}	
							});
						}

						if(data[8].selectedType.paymentTypeID == "1"){
							data[8].billingTypeLabel = $scope.globalVars.forText + " " +  $scope.addOnData.core.prepaidTerm + " " + $scope.globalVars.months;
						}
						else{
							data[8].billingTypeLabel = $scope.globalVars["payment_type"+data[8].selectedType.paymentTypeID];
						}
						
						//data[8].billingTypeLabel = $scope.globalVars["payment_type"+data[8].selectedType.paymentTypeID];
						
						data[8].selectedCost = 0;
						data[8].supportAddOnCost = 0;

						//console.log(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);
						
						data[8].dataExist = true;

						var supportTierInfo = {};

						//Promotion Check
						if(data[8].selectedType.paymentTypeID == "0"){
							data[8].selectedCost = 0;
							data[8].selectedQty = parseInt(data[2]);
							var promotionSKU = [];
							data[8].selectedAddonSKU = [];
							var qtyArray = [];
							angular.forEach(data[6][data[8].selectedType.paymentTypeVal], function(val, key){
								qtyArray = key.split("_");
								if(data[8].selectedQty >= parseInt(qtyArray[0]) && data[8].selectedQty <= parseInt(qtyArray[1])){
								//if(key.indexOf(selectdQty)>=0){
									selectdQtyCost = changeNumber(val[0]);
									selectdAddonSKU = val[1];
									data[8].extendedCost = selectdQtyCost * parseInt(data[8].selectedQty);
									data[8].selectedCost = selectdQtyCost;
									//addOns[8].selectedAddonSKU = selectdAddonSKU;
									promotionSKU.push(selectdAddonSKU);
									data[8].noCost = "N";
								}
							});
							data[8].selectedAddonSKU = promotionSKU;
							data[8].addOnRemainingCost = 0;
						}
						else{
							// Calculating default cost for qty 1 and checking if support tier is there for service
							if(data[6][data[8].selectedType.paymentTypeVal] != null && data[6][data[8].selectedType.paymentTypeVal] != undefined){
								var qtyDefaultIndex = Object.keys(data[6][data[8].selectedType.paymentTypeVal])[0];
								if(data[7][4] != undefined && data[7][4] != null){
									supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
									data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);
									data[8].supportAddOnCost = changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
								}
								else{
									data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
									data[8].supportAddOnCost = 0;
								}

								var strDiscounttext = newServiceFactory.tierDiscount(data[6][data[8].selectedType.paymentTypeVal], supportTierInfo, data[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], data[8].selectedType.paymentTypeID, $scope.addOnData.core.redemptionCurrency);
								data[8].discountText = strDiscounttext;
									
							}
							else{
								data[8].dataExist = false;
							}	
						}
						 
						
						//data[8].extendedCost = data[8].selectedCost;
						data[8].extendedCost = 0;
						data[8].supportAddOnExtendedCost = 0

					});

					
				});	
			}
			$scope.addOnData.ttlMonthlyRecurringCost = 0;
			$scope.addOnData.ttltermMonthlyCost = 0;
			$scope.addOnData.ttlPrepaidCost = 0;
			$scope.addOnData.ttlYearlyCost = 0;
			$scope.addOnData.ttlOneTimeCost = 0;

			//console.log($scope.addOnData);

		//}); // remove this for dev-15
	}
	
	if(Object.keys(newServiceFactory.addOnObj).length > 0){
			$scope.addOnFlag=1;
			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;	
			}
	}else{
		$scope.displayAddOnData($scope.successServiceObj);	//Comment for local copy
	}

	$scope.ttlMonthlyCost = $scope.addOnData.ttlMonthlyRecurringCost;
	$scope.ttlPrepaidCost = $scope.addOnData.ttlPrepaidCost;
	$scope.ttlYearlyCost = $scope.addOnData.ttlYearlyCost;
	$scope.ttlOneTimeCost = $scope.addOnData.ttlOneTimeCost;

	$scope.checkQty = function(qty, addOns){
		var regex = /^\s*$/g;
		if(!angular.isNumber(qty)){
			if(qty.match(regex) != null)
				addOns[8].selectedQty = 0;
		}
	}
	
	//changeAddon will be triggered when the Qty & type will be changed 
	$scope.changeAddon = function(addOnKey, addOns, addOnIndex){
		var selectdQty = addOns[8].selectedQty;
		var selectdType = addOns[8].selectedType;
		var selectdAddon = addOnKey;
		var selectdQtyCost = 0;
		var selectdAddonSKU = "";
		var addOnRemainingCost = 0;
		var supportAddOnRemainingCost = 0;
		var supportTierInfo = {};
			
		addOns[8].noCost = "Y";
		$scope.validSelectedData = true;

		if(addOns[8].selectedType.paymentTypeID == "1"){
			addOns[8].billingTypeLabel = $scope.globalVars.forText + " " +  $scope.addOnData.core.prepaidTerm + " " + $scope.globalVars.months;
		}
		else{
			addOns[8].billingTypeLabel = $scope.globalVars["payment_type"+addOns[8].selectedType.paymentTypeID];
		}
		
		if(parseInt(selectdQty)>0 && !isNaN(selectdQty)){
			// Calculating cost w.r.t QTY & type selected for individual Service
			selectdQty = parseInt(selectdQty);
			var qtyArray = [];
			var qtySelectedKey = "";
			var arraySKU = [];
			angular.forEach(addOns[6][selectdType.paymentTypeVal], function(val, key){
				qtyArray = key.split("_");
				if(selectdQty >= parseInt(qtyArray[0]) && selectdQty <= parseInt(qtyArray[1])){
				//if(key.indexOf(selectdQty)>=0){
					selectdQtyCost = changeNumber(val[0]);
					selectdAddonSKU = val[1];
					addOns[8].extendedCost = selectdQtyCost * parseInt(selectdQty);
					addOns[8].selectedCost = selectdQtyCost;
					//addOns[8].selectedAddonSKU = selectdAddonSKU;
					arraySKU.push(selectdAddonSKU);
					addOns[8].selectedType = selectdType;
					addOns[8].selectedQty = selectdQty;
					addOns[8].noCost = "N";
					qtySelectedKey = key;
				}
			});
			
			//Calculating support cost w.r.t QTY & type selected and adding to actual cost
			if(addOns[7][6] != undefined && addOns[7][6] != null){
				
				if(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey] != undefined && addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey] != null){
						supportTierInfo = addOns[7][6][selectdType.paymentTypeVal];
						selectdQtyCost = selectdQtyCost + changeNumber(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][0]);
						//selectdAddonSKU = selectdAddonSKU+","+addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][1];
						addOns[8].supportAddOnExtendedCost = parseFloat(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][0]) * parseInt(selectdQty);
						addOns[8].extendedCost = selectdQtyCost * parseInt(selectdQty);
						addOns[8].selectedCost = selectdQtyCost;
						//addOns[8].selectedAddonSKU = selectdAddonSKU;
						arraySKU.push(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][1]);
				}
				//console.log(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][0] + " " + addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][1]);
			}
			
			addOns[8].selectedAddonSKU = arraySKU;

			//Checking if cost is not available
			if(addOns[8].noCost == "Y"){
				addOns[8].extendedCost = 0;
				addOns[8].supportAddOnExtendedCost = 0;
				addOns[8].selectedCost = 0;
			}
						
		}
		else{
			addOns[8].noCost = "N";
			addOns[8].selectedAddonSKU = '';
			var regExString = /(^$)|(^\d$)/;
			//console.log(regExString.test(selectdQty));
			if(regExString.test(selectdQty)){
				
				addOns[8].selectedQty = selectdQty;	
				
			}else{
				addOns[8].selectedQty = 0;
			}
			
			addOns[8].selectedCost = 0;

			// Calculating default cost for qty 1 and checking if support tier is there for service
			if(addOns[6][addOns[8].selectedType.paymentTypeVal] != null && addOns[6][addOns[8].selectedType.paymentTypeVal] != undefined){
				var qtyDefaultIndex = Object.keys(addOns[6][addOns[8].selectedType.paymentTypeVal])[0];
				if(addOns[7][4] != undefined && addOns[7][4] != null){
					supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
					addOns[8].selectedCost = changeNumber(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
				}
				else{
					addOns[8].selectedCost = changeNumber(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
				}	
			}

			addOns[8].extendedCost = 0;
			addOns[8].supportAddOnExtendedCost = 0;
		}

		var strDiscounttext = newServiceFactory.tierDiscount(addOns[6][addOns[8].selectedType.paymentTypeVal], supportTierInfo, addOns[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], addOns[8].selectedType.paymentTypeID, $scope.addOnData.core.redemptionCurrency);
		addOns[8].discountText = strDiscounttext;

			//NOTE: addOns[8].extendedCost already having actualCost * quantity value


			//Cost Calculation for Monthly Billing Term 
			//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
			if(selectdType.paymentTypeID == "2"){
				addOnRemainingCost = (parseFloat(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[3])/30)) + (parseFloat(addOns[8].extendedCost) * parseInt($scope.addOnData.core.remainingTerm[2]));
				supportAddOnRemainingCost = (parseFloat(addOns[8].supportAddOnExtendedCost) * (parseInt($scope.addOnData.core.remainingTerm[3])/30)) + (parseFloat(addOns[8].supportAddOnExtendedCost) * parseInt($scope.addOnData.core.remainingTerm[2]));
			}

			//Cost Calculation for Annual Billing Term
			//(annualCost * (no of remaining days / 365) * quantity)
			if(selectdType.paymentTypeID == "3"){
				var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
				addOnRemainingCost = addOns[8].extendedCost * numberOfYears;
				supportAddOnRemainingCost = addOns[8].supportAddOnExtendedCost * numberOfYears;
			}

			//Cost Calculation for Prepaid Billing Term
			//numberOfDays = 365 * (commitmentTerm / 12)
            //daysCost = noOfRemainingDays / numberOfDays;
            //PrepaidCost = prepaid cost * daysCost * quantity
            //Considering commitmentTerm as 12 for now
			if(selectdType.paymentTypeID == "1"){
				addOnRemainingCost = addOns[8].extendedCost;
				supportAddOnRemainingCost = addOns[8].supportAddOnExtendedCost;
			}

			//Cost Calculation for One Time Billing Term
			if(selectdType.paymentTypeID == "4"){
				addOnRemainingCost = addOns[8].extendedCost;
				supportAddOnRemainingCost = addOns[8].supportAddOnExtendedCost;
			}


			addOns[8].addOnRemainingCost = addOnRemainingCost;
			addOns[8].supportAddOnRemainingCost = supportAddOnRemainingCost;

		//Calculating Total cost in terms of prepaid and monthy for selected Add-on Services
		var selectdTtlCostMnthly = 0;
		var selectdTtlCostPrPaid = 0;
		var selectdTtlCostOneTime = 0;
		var selectdTtlCostYearly = 0;
		var monthlyRecurringCost = 0;

		angular.forEach($scope.addOnData.addons, function(addonData){
			angular.forEach(addonData, function(val, key){
				if(val[8].selectedQty > 0){
					if(val[8].selectedType.paymentTypeID == "2"){
						selectdTtlCostMnthly = selectdTtlCostMnthly + val[8].addOnRemainingCost;
						monthlyRecurringCost = monthlyRecurringCost + val[8].extendedCost;
					}
					if(val[8].selectedType.paymentTypeID == "1"){
						selectdTtlCostPrPaid = selectdTtlCostPrPaid + val[8].addOnRemainingCost;
					}
					if(val[8].selectedType.paymentTypeID == "3"){
						selectdTtlCostYearly = selectdTtlCostYearly + val[8].addOnRemainingCost;
					}
					if(val[8].selectedType.paymentTypeID == "4"){
						selectdTtlCostOneTime = selectdTtlCostOneTime + val[8].addOnRemainingCost;
					}
					
				}

				if(val[8].noCost == 'Y'){
					$scope.validSelectedData = false;
				}
				if($scope.validSelectedData){

					$scope.trueUpError=true;
				}
				
			});
		});
		
		//console.log(monthlyRecurringCost);
		
		$scope.addOnData.ttlMonthlyRecurringCost = monthlyRecurringCost;
		$scope.addOnData.ttltermMonthlyCost = selectdTtlCostMnthly;
		$scope.addOnData.ttlPrepaidCost = selectdTtlCostPrPaid;
		$scope.addOnData.ttlYearlyCost = selectdTtlCostYearly;
		$scope.addOnData.ttlOneTimeCost = selectdTtlCostOneTime;
		
		$scope.ttlMonthlyCost = $scope.addOnData.ttlMonthlyRecurringCost;
		$scope.ttlPrepaidCost = $scope.addOnData.ttlPrepaidCost;
		$scope.ttlYearlyCost = $scope.addOnData.ttlYearlyCost;
		$scope.ttlOneTimeCost = $scope.addOnData.ttlOneTimeCost;
		
		//console.log($scope.addOnData);

		$scope.calculations($scope.addOnData);
	}

	var discountCostValue = function(paymentTypeId, serviceCost, term){
		var discountCost = 0;
		if(paymentTypeId == "1"){
			discountCost = ($scope.discountDuration / parseInt(term)) * ($scope.discountPercentage / 100) * serviceCost;
		}else if(paymentTypeId == "2"){
			discountCost = serviceCost * ($scope.discountPercentage / 100);
		}else if(paymentTypeId == "3"){
			discountCost = ($scope.discountDuration / 12) * ($scope.discountPercentage / 100) * serviceCost;
		}
		return discountCost; 
	}

	function roundDecimalToCurrency(a){
		if($scope.addOnData.core.redemptionCurrency == 'JPY'){
			return Math.round(a);
		}
		else{
			return Math.round(a*100) / 100;	
		}
	}

	$scope.calculations=function(dataref){
		$scope.dueCost=0;
		$scope.totalCost=0;
		$scope.totalAddonCost = 0;
		$scope.oneTimeCount=0;
		$scope.oneTimeVal=0;
		$scope.prepaidCount=0;
		$scope.prepaidVal=0;
		$scope.annualCount=0;
		$scope.annualVal=0;
		$scope.recurringVal=0;
		$scope.recurringCount=0;
		$scope.addOnRecurring=0;
		$scope.newAddOnRecurring=0;
		$scope.addOnCount=0;
		$scope.annualRecuuring=0;
		$scope.annualAddonRecuuring=0;
		$scope.serviceCostDue=0;
		$scope.fullTermServiceCost=0;
		$scope.coreServiceCostMonthly = 0;
		$scope.coreServiceCostAnnually = 0;
		$scope.ref_addOnObj=dataref;
		$scope.totalAddOnCeilCost = 0;
		$scope.totalCeilCost = 0;

		angular.forEach($scope.ref_addOnObj.addons, function(addonData){
			angular.forEach(addonData, function(data){	
				
				if(data[8].selectedQty > 0){
					$scope.addOnCount++;
					if(data[8].selectedType.paymentTypeID=="2"){
						if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
							$scope.recurringVal+=((parseFloat(data[8].extendedCost))/30)*parseFloat($scope.ref_addOnObj.core.remainingTerm[3]);
						}else{
							$scope.recurringVal+=parseFloat(data[8].extendedCost);
						}
						$scope.recurringCount++;
						$scope.addOnRecurring+=parseFloat(data[8].extendedCost);
					}
					if(data[8].selectedType.paymentTypeID=="4"){
						$scope.oneTimeVal+=data[8].addOnRemainingCost;
						$scope.oneTimeCount++;
					}
					if(data[8].selectedType.paymentTypeID=="1"){
						$scope.prepaidVal+=data[8].addOnRemainingCost;
						$scope.prepaidCount++;
					}
					if(data[8].selectedType.paymentTypeID=="3"){
						
						if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) == 0){
							$scope.annualAddonRecuuring+=data[8].addOnRemainingCost;
							$scope.annualVal+=data[8].addOnRemainingCost;
							$scope.annualCount++;
						}
						if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
							$scope.annualAddonRecuuring+=data[8].addOnRemainingCost;
							var remainingMonths=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
							$scope.annualVal+=(data[8].addOnRemainingCost/12) * remainingMonths;
							$scope.annualCount++;
							
						}
					}

					$scope.totalAddonCost += parseFloat(data[8].addOnRemainingCost);
					if(data[8].selectedAddonSKU[1] != undefined && data[8].selectedAddonSKU[1] != null){
						$scope.totalAddOnCeilCost = $scope.totalAddOnCeilCost + Math.round(parseFloat(data[8].supportAddOnRemainingCost) * $scope.creditValue) + Math.round((parseFloat(data[8].addOnRemainingCost) - parseFloat(data[8].supportAddOnRemainingCost)) * $scope.creditValue);
					}
					else{
						$scope.totalAddOnCeilCost += Math.round(parseFloat(data[8].addOnRemainingCost) * $scope.creditValue);
					} 
				}
				
			});	
			
		});

		//Discount Calculation for Add-ons

		if($scope.discountDuration > 0 && $scope.discountPercentage > 0){
			
			if($scope.recurringVal > 0){
				var monthlyAddonDiscountCost = 0;
				monthlyAddonDiscountCost = roundDecimalToCurrency(discountCostValue(2, $scope.recurringVal));
				$scope.recurringVal = $scope.recurringVal - monthlyAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - (monthlyAddonDiscountCost * $scope.discountDuration);
				$scope.totalAddOnCeilCost = $scope.totalAddOnCeilCost - Math.round(monthlyAddonDiscountCost * $scope.discountDuration * $scope.creditValue);   
			}
			if($scope.annualVal > 0){
				var annualAddonDiscountCost = 0;
				annualAddonDiscountCost = roundDecimalToCurrency(discountCostValue(3, $scope.annualVal));
				$scope.annualVal = $scope.annualVal - annualAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - annualAddonDiscountCost;
				$scope.totalAddOnCeilCost = $scope.totalAddOnCeilCost - Math.round(annualAddonDiscountCost * $scope.creditValue);
			}
			if($scope.prepaidVal > 0){
				var prepaidAddonDiscountCost = 0;
				prepaidAddonDiscountCost = roundDecimalToCurrency(discountCostValue(1, $scope.prepaidVal, $scope.ref_addOnObj.core.remainingTerm[2]));
				$scope.prepaidVal = $scope.prepaidVal - prepaidAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - prepaidAddonDiscountCost;
				$scope.totalAddOnCeilCost = $scope.totalAddOnCeilCost - Math.round(prepaidAddonDiscountCost * $scope.creditValue);
			}
		}

		//service value adding based on payment type
		//monthly
		if($scope.ref_addOnObj.core.defaultPaymentType=="2"){
			//due now calculation

			$scope.coreServiceCostMonthly = parseFloat($scope.ref_addOnObj.core.cost);
			
			if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=($scope.coreServiceCostMonthly/30) * $scope.ref_addOnObj.core.remainingTerm[3];
			}else{
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostMonthly;
			}
			// due now calculation ends

			//Discount if promotion is there
			var discountCost = 0;
			if($scope.discountDuration > 0 && $scope.discountPercentage > 0){
				$scope.serviceCostDue=0;
				discountCost = roundDecimalToCurrency(discountCostValue($scope.ref_addOnObj.core.defaultPaymentType, $scope.coreServiceCostMonthly));
				$scope.serviceCostDue = $scope.coreServiceCostMonthly - discountCost;
			}

			$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);

			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.coreServiceCostMonthly);
			//recurring monthly calculations ends
			
			$scope.fullTermServiceCost = $scope.coreServiceCostMonthly * $scope.ref_addOnObj.core.remainingTerm[2];

			if(discountCost > 0){
				$scope.fullTermServiceCost = $scope.fullTermServiceCost - (discountCost * $scope.discountDuration);
			}

			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + $scope.fullTermServiceCost;
			$scope.totalCeilCost = $scope.totalAddOnCeilCost + Math.round($scope.fullTermServiceCost * $scope.creditValue);
			//total cost calculations ends
		}
		
		//Prepaid
		if($scope.ref_addOnObj.core.defaultPaymentType=="1"){
			//due now calculation

			$scope.coreServiceCostPrePaid = parseFloat($scope.ref_addOnObj.core.cost);

			$scope.serviceCostDue=$scope.coreServiceCostPrePaid;

			//Discount if promotion is there
			var discountCost = 0;
			if($scope.discountDuration > 0 && $scope.discountPercentage > 0){
				$scope.serviceCostDue=0;
				discountCost = roundDecimalToCurrency(discountCostValue($scope.ref_addOnObj.core.defaultPaymentType, $scope.coreServiceCostPrePaid, $scope.ref_addOnObj.core.remainingTerm[2]));
				$scope.serviceCostDue = parseFloat($scope.ref_addOnObj.core.cost) - discountCost;
			}

			$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			// due now calculation ends

			$scope.fullTermServiceCost = $scope.coreServiceCostPrePaid;

			if(discountCost > 0){
				$scope.fullTermServiceCost = $scope.fullTermServiceCost - discountCost;
			}
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + $scope.fullTermServiceCost;
			$scope.totalCeilCost = $scope.totalAddOnCeilCost + Math.round($scope.fullTermServiceCost * $scope.creditValue);
			//total cost calculations ends
		}
		
		
		//Annually
		if($scope.ref_addOnObj.core.defaultPaymentType=="3"){
			$scope.coreServiceCostAnnually = parseFloat($scope.ref_addOnObj.core.cost);
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) == 0){
				//due cost calculations
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostAnnually;
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.annualAddonRecuuring +  $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
				//due cost calculations
				$scope.serviceCostDue=0;
				var months=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
				$scope.serviceCostDue=($scope.coreServiceCostAnnually / 12) * months;
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.annualAddonRecuuring + $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}

			//Discount if promotion is there
			var discountCost = 0;
			if($scope.discountDuration > 0 && $scope.discountPercentage > 0){
				$scope.serviceCostDue=0;
				discountCost = roundDecimalToCurrency(discountCostValue($scope.ref_addOnObj.core.defaultPaymentType, $scope.coreServiceCostAnnually));
				$scope.serviceCostDue = parseFloat($scope.ref_addOnObj.core.cost) - discountCost;
			}

			$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);

			$scope.fullTermServiceCost=($scope.coreServiceCostAnnually / 12) * $scope.ref_addOnObj.core.remainingTerm[2];
			
			if(discountCost > 0){
				$scope.fullTermServiceCost = $scope.fullTermServiceCost - discountCost;
			}
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + $scope.fullTermServiceCost;
			$scope.totalCeilCost = $scope.totalAddOnCeilCost + Math.round($scope.fullTermServiceCost * $scope.creditValue);
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			//recurring monthly calculations ends
			
			
		}
		$scope.updateCartPopOver(newServiceFactory.currentCartId, $scope.totalCeilCost, $scope.addOnData.core.serviceName, $scope.addOnData.core.serviceType);
	}
	//calculation ended

	if($scope.addOnData.core != null & $scope.addOnData.core != undefined){
		var promotionPayType = '';
		angular.forEach($scope.addOnData.paymentType, function(payTypeData){

			if(parseInt(payTypeData.paymentTypeID) == 0){
				promotionPayType = payTypeData.paymentTypeVal;
			}
			
		});
		
		$scope.discountDuration = 0;
		$scope.discountPercentage = 0;
		if(promotionPayType != '' && $scope.addOnData.addons[promotionPayType] != undefined){
			var promotionObject = $scope.addOnData.addons[promotionPayType][0][6][promotionPayType][Object.keys($scope.addOnData.addons[promotionPayType][0][6][promotionPayType])][3];
			
			if(promotionObject != undefined && promotionObject != null){
				$scope.discountDuration = parseInt(promotionObject[0]);
				$scope.discountPercentage = parseInt(promotionObject[1]);	
			}
		}
		$scope.calculations($scope.addOnData);	
	}
	
	$scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    }

    $scope.gotoConfigure = function(){
		angular.copy($scope.serviceData, newServiceFactory.configureService);
		$state.go('estimatorSteps.configureService');	
	}
    
	$scope.goToViewEstimator = function(){
		$scope.ajaxLoader = true;
		vmf.msg.page("");

		$scope.postObj={};

		if(newServiceFactory.generatedCartId == ""){
			$scope.postObj.coreID = newServiceFactory.currentCartId;
		}else{
			$scope.postObj.coreID = newServiceFactory.generatedCartId.toString();
		}
		
		$scope.postObj.coreCrossRefSku = $scope.addOnData.core.coreServiceSku;
		$scope.postObj.paymentType = $scope.addOnData.core.defaultPaymentType;
		$scope.postObj.paymentTerm = $scope.addOnData.core.remainingTerm[2];
		$scope.postObj.skuQuantityMap = {};
		
		angular.forEach($scope.addOnData.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0){
					//$scope.fullObj={};
					var skuObj = "";
					angular.forEach(data[8].selectedAddonSKU,function(skuData){
						if(skuObj == ""){
							skuObj = skuData;
						}
						else{
							skuObj = skuObj + ", " + skuData;
						}
					});
					$scope.postObj.skuQuantityMap[skuObj] = data[8].selectedQty.toString();
					//$scope.postObj.skuQuantityMap.push($scope.fullObj);
				}
			});	
		});

		var submitPostData = '';

		submitPostData = '_vm_skuDetailList='+JSON.stringify($scope.postObj);

		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
					  	
							$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
							$scope.ajaxLoader = false;

				  	} else {
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");
					  	newServiceFactory.addOnObj={};
						angular.copy($scope.addOnData, newServiceFactory.addOnObj);
						angular.copy($scope.addOnData, newServiceFactory.viewEstimateObj);
						newServiceFactory.generatedCartId = successData.wrapper.coreID;
						$state.go('estimatorSteps.viewEstimate');				  	
				  	}
				});
			},function(errorData){
				
				$scope.displayErrorAlert(vCredit.globalVars.ajax_error_body, "warning", true, false, true);
				$scope.ajaxLoader = false;
			},
			$scope.globalVars.saveEstimate,    		// This comes from the jsp config object
			submitPostData
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

	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));
		return number;
	}

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

	$scope.cancelFn = function(){
		newServiceFactory.clearObjects();
		//$state.go('configurator');
		window.location = vCredit.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		newServiceFactory.cancelFlow(callbackFn);	
	}

}]);