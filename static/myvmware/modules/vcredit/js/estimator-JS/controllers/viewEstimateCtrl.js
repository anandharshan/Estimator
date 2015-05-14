angular.module('viewEstimateContollerModule',[])
.controller('viewEstimateCtrl', ['$scope', '$state', '$modal', 'newServiceFactory','confirmDialog', '$window', function($scope, $state, $modal, newServiceFactory, confirmDialog, $window){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : view-estimate");
	//if($.isEmptyObject(newServiceFactory.serviceObj)){
	//	$state.go('configurator');
	//}
	$("[data-toggle='tooltip']").tooltip('show');
	$scope.globalVars = {};
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	$scope.serviceData = {};
	$scope.addOnData = {};
	$scope.editPhase=false;
	$scope.showCalc=false;
	$scope.validSelectedData = true;
	$scope.errorMsg=null;
	$scope.addOnPase=false;
	$scope.paymentTypeValue = null;
	$scope.addOnConf=false;
	$scope.ajaxLoader = false;
	$scope.displayRemove = true;
	$scope.ref_addOnObj = {};
	$scope.localObj = {};
	$scope.showLoader = true;
	$scope.updateError = false;

	angular.copy(newServiceFactory.configureService, $scope.serviceData);
	if($.isEmptyObject(newServiceFactory.configureService)){
		$state.go('estimatorSteps.selectService');	
	}
	
	
	$scope.someTest=function(){

		console.log($scope.localObj.selTerm);
	}

	//calculation started
	$scope.dueCost=0;
	$scope.totalCost=0;
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
	$scope.serviceCostDue=0;
	$scope.fullTermServiceCost=0;
	
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
		$scope.levelSKU = "";
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
							$scope.annualAddonRecuuring+=data[8].extendedCost;
							$scope.annualVal+=data[8].extendedCost;
							$scope.annualCount++;
						}
						if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
							$scope.annualAddonRecuuring+=data[8].extendedCost;
							var remainingMonths=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
							$scope.annualVal+=(data[8].extendedCost/12) * remainingMonths;
							$scope.annualCount++;
							
						}
						//$scope.addOnRecurring+=parseFloat(data[8].extendedCost);
					}

					$scope.totalAddonCost += parseFloat(data[8].addOnRemainingCost);
					if(data[8].selectedAddonSKU[1] != undefined && data[8].selectedAddonSKU[1] != null){
						//console.log(data[8].supportAddOnRemainingCost);
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
				//$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
			}else{
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostMonthly;
				//$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
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
				//$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
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
				//$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);	
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

		angular.forEach($scope.ref_addOnObj.levelSkuList, function(data){
			if(parseFloat($scope.totalCost * $scope.creditValue) >= parseFloat(data.minValue) && parseFloat($scope.totalCost * $scope.creditValue) <= parseFloat(data.maxValue)){
				$scope.levelSKU = data.sku;
			}
		});
		$scope.updateCartPopOver(newServiceFactory.currentCartId, $scope.totalCeilCost, $scope.ref_addOnObj.core.serviceName, $scope.ref_addOnObj.core.serviceType);

	}
	//calculation ended
	
	$scope.displayAddOnData = function(){
		
		angular.copy(newServiceFactory.viewEstimateObj, $scope.addOnData);
		
		var defaultPaymentType = $scope.addOnData.core.defaultPaymentType;

		var addOnRemainingCost = 0;
		var supportAddOnRemainingCost = 0;
		
		angular.forEach(newServiceFactory.viewEstimateObj.addons, function(addonData){
			var mainAddon = false;
			angular.forEach(addonData,function(data){
				if ($.isEmptyObject(data[8])){
					data[8] = {};  // Selected Addon object
					data[8].selectedAddonSKU = '';
					data[8].extendedCost = 0;
					data[8].supportAddOnExtendedCost = 0;
					data[8].paymentType = [];
					data[8].noCost = "N";
					data[8].discountText = "";

					//if(data[8].selectedQty == null || data[8].selectedQty == undefined){
					//	data[8].earlierSelectedQty = parseInt(data[2]);
					//	data[8].selectedQty = data[8].earlierSelectedQty;
					//}else{
					//	data[8].earlierSelectedQty = data[8].selectedQty;	
					//}
					angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

						angular.forEach(data[3], function(val){
							if(payTypeData.paymentTypeID == val){
								data[8].paymentType.push(payTypeData);
							}
						});
						
					});

					if(defaultPaymentType == null || defaultPaymentType == undefined){
						defaultPaymentType = data[4];
					}

					if(data[8].selectedType == undefined || data[8].selectedType == null){
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
					}
					

					if(data[8].selectedType.paymentTypeID == "1"){
						data[8].billingTypeLabel = $scope.globalVars.forText + " " +  $scope.addOnData.core.prepaidTerm + " " + $scope.globalVars.months;
					}
					else{
						data[8].billingTypeLabel = $scope.globalVars["payment_type"+data[8].selectedType.paymentTypeID];
					}

					if(data[8].selectedQty>0) data[8].selectedAddonSKU = [data[0]];

					data[8].selectedCost = 0;
					data[8].supportAddOnCost = 0;
					
					data[8].dataExist = true;

					var supportTierInfo = {};

					if(data[8].selectedQty == null || data[8].selectedQty == undefined){
						if(data[2] != undefined && data[2] != null){
							data[8].earlierSelectedQty = parseInt(data[2]);
						}else{
							data[8].earlierSelectedQty = 0;
						}
						
						data[8].selectedQty = data[8].earlierSelectedQty;
						//console.log(data[8].earlierSelectedQty);
					}else{
						data[8].earlierSelectedQty = data[8].selectedQty;	
					}

					if(data[6][data[8].selectedType.paymentTypeVal] != null && data[6][data[8].selectedType.paymentTypeVal] != undefined){
						if (data[8].earlierSelectedQty > 0){
							var qtyArray = [];
							//var earlierSelectedCost = 0;
							angular.forEach(data[6][data[8].selectedType.paymentTypeVal], function(val, key){
								qtyArray = key.split("_");
								//console.log(qtyArray[0] + " " + qtyArray[1]);
								if(data[8].earlierSelectedQty >= qtyArray[0] && data[8].earlierSelectedQty <= qtyArray[1]){
									data[8].selectedAddonSKU=[val[1]];
									if(data[7][4] != undefined && data[7][4] != null){
										supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
										data[8].selectedCost = changeNumber(val["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][key]["0"]);
										data[8].supportAddOnCost = changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][key]["0"]);
										data[8].selectedAddonSKU.push(data[7][6][data[8].selectedType.paymentTypeVal][key][1]);	
									}
									else{
										data[8].selectedCost = changeNumber(val["0"]);
										data[8].supportAddOnCost = 0;
									}
									//data[8].selectedAddonSKU=[val[1]];
								}
							});

							data[8].extendedCost = data[8].selectedCost * parseInt(data[8].earlierSelectedQty);
							data[8].supportAddOnExtendedCost = data[8].supportAddOnCost * parseInt(data[8].earlierSelectedQty);

						}else{
							var qtyDefaultIndex = Object.keys(data[6][data[8].selectedType.paymentTypeVal])[0];
							
							// Calculating default cost for qty 1 and checking if support tier is there for service 
							if(data[7][4] != undefined && data[7][4] != null){
								supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
								data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
								data[8].supportAddOnCost = changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);
							}
							else{
								data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);
								data[8].supportAddOnCost = 0;	
							}

							data[8].extendedCost = 0;
							data[8].supportAddOnExtendedCost = 0;
						}

						var strDiscounttext = newServiceFactory.tierDiscount(data[6][data[8].selectedType.paymentTypeVal], supportTierInfo, data[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], data[8].selectedType.paymentTypeID, $scope.addOnData.core.redemptionCurrency);
						data[8].discountText = strDiscounttext;

					}
					else{
						data[8].dataExist = false;
					}

					var selectdType = data[8].selectedType;

					//Cost Calculation for Monthly Billing Term 
					//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
					if(selectdType.paymentTypeID == "2"){
						addOnRemainingCost = (data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[3])/30)) + (data[8].extendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));
						supportAddOnRemainingCost = (data[8].supportAddOnExtendedCost * (parseInt($scope.addOnData.core.remainingTerm[3])/30)) + (data[8].supportAddOnExtendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));
					}

					//Cost Calculation for Annual Billing Term
					//(annualCost * (no of remaining days / 365) * quantity)
					if(selectdType.paymentTypeID == "3"){
						var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
						addOnRemainingCost = data[8].extendedCost * numberOfYears;
						supportAddOnRemainingCost = data[8].supportAddOnExtendedCost * numberOfYears;
					}

					//Cost Calculation for Prepaid Billing Term
					//numberOfDays = 365 * (commitmentTerm / 12)
		            //daysCost = noOfRemainingDays / numberOfDays;
		            //PrepaidCost = prepaid cost * daysCost * quantity
		            //Considering commitmentTerm as 12 for now
					if(selectdType.paymentTypeID == "1"){
						addOnRemainingCost = data[8].extendedCost;
						supportAddOnRemainingCost = data[8].supportAddOnExtendedCost;
					}

					//Cost Calculation for One Time Billing Term
					if(selectdType.paymentTypeID == "4"){
						addOnRemainingCost = data[8].extendedCost;
						supportAddOnRemainingCost = data[8].supportAddOnExtendedCost;
					}


					data[8].addOnRemainingCost = addOnRemainingCost;
					data[8].supportAddOnRemainingCost = supportAddOnRemainingCost;

					//Calculating Total cost in terms of prepaid and monthy for selected Add-on Services
					var selectdTtlCostMnthly = 0;
					var selectdTtlCostPrPaid = 0;
					var selectdTtlCostOneTime = 0;
					var selectdTtlCostYearly = 0;
					var monthlyRecurringCost = 0;
					var haveSelectedQty = false;

					angular.forEach(newServiceFactory.viewEstimateObj.addons, function(addonData){
						angular.forEach(addonData, function(val, key){
							//console.log(key);
							if(val[8].selectedQty > 0){
								if(val[8].selectedType.paymentTypeID == "2"){
									selectdTtlCostMnthly = selectdTtlCostMnthly + val[8].addOnRemainingCost;
									monthlyRecurringCost = monthlyRecurringCost + val[8].extendedCost; 
								}
								if(val[8].selectedType.paymentTypeID == "1"){
									selectdTtlCostPrPaid = selectdTtlCostPrPaid + val[8].addOnRemainingCost;
								}
								if(val[8].selectedType.paymentTypeID == "3"){
									//selectdTtlCostYearly = selectdTtlCostYearly + val[8].addOnRemainingCost;
									selectdTtlCostYearly = selectdTtlCostYearly + val[8].extendedCost;
								}
								if(val[8].selectedType.paymentTypeID == "4"){
									selectdTtlCostOneTime = selectdTtlCostOneTime + val[8].addOnRemainingCost;
								}
								haveSelectedQty =  true;
							}

							if(val[8].noCost == 'Y'){
								haveSelectedQty =  false;
							}
						});
					});

					newServiceFactory.viewEstimateObj.ttlMonthlyRecurringCost = monthlyRecurringCost;
					newServiceFactory.viewEstimateObj.ttltermMonthlyCost = selectdTtlCostMnthly;
					newServiceFactory.viewEstimateObj.ttlPrepaidCost = selectdTtlCostPrPaid;
					newServiceFactory.viewEstimateObj.ttlYearlyCost = selectdTtlCostYearly;
					newServiceFactory.viewEstimateObj.ttlOneTimeCost = selectdTtlCostOneTime;
					
					$scope.ttlMonthlyCost = newServiceFactory.viewEstimateObj.ttlMonthlyRecurringCost;
					$scope.ttlPrepaidCost = newServiceFactory.viewEstimateObj.ttlPrepaidCost;
					$scope.ttlOneTimeCost = newServiceFactory.viewEstimateObj.ttlOneTimeCost;
					$scope.ttlYearlyCost = newServiceFactory.viewEstimateObj.ttlYearlyCost;

					//$scope.calculations(newServiceFactory.viewEstimateObj);

				}

				if(data[8].selectedQty > 0){	
					data[8].selected="selected";
					mainAddon = true;
				}else{
					data[8].selected="no";
				}
			});
			if(mainAddon == true){
				addonData.selectedNode = true;
			}
			else{
				addonData.selectedNode = false;
			}
		});
		

		$scope.calculations(newServiceFactory.viewEstimateObj);
		//console.log(newServiceFactory.serviceObj);
		
		angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

			if(parseInt(payTypeData.paymentTypeID) == parseInt($scope.addOnData.core.defaultPaymentType)){
				//data[8].paymentType.push(payTypeData);
				$scope.paymentTypeValue = payTypeData.paymentTypeVal;
			}
			
		});

		$scope.ref_addOnObj = newServiceFactory.viewEstimateObj;


		var promotionPayType = '';
		angular.forEach($scope.ref_addOnObj.paymentType, function(payTypeData){

			if(parseInt(payTypeData.paymentTypeID) == 0){
				promotionPayType = payTypeData.paymentTypeVal;
			}
			
		});

		$scope.discountDuration = 0;
		$scope.discountPercentage = 0;
		if(promotionPayType != '' && $scope.ref_addOnObj.addons[promotionPayType] != undefined){
			var promotionObject = $scope.ref_addOnObj.addons[promotionPayType][0][6][promotionPayType][Object.keys($scope.ref_addOnObj.addons[promotionPayType][0][6][promotionPayType])][3];
			
			if(promotionObject != undefined && promotionObject != null){
				$scope.discountDuration = parseInt(promotionObject[0]);
				$scope.discountPercentage = parseInt(promotionObject[1]);	
			}
		}

		angular.forEach($scope.ref_addOnObj.paymentType, function(val){
			if(val.paymentTypeID == $scope.ref_addOnObj.core.defaultPaymentType){
				$scope.localObj.selPaymentType = val;		
			}
		});
		//$scope.localObj.selPaymentType = $scope.ref_addOnObj.core.defaultPaymentType;
		
		$scope.updateTerm();	
	}

	$scope.updateTerm = function(){
		
		
		angular.forEach($scope.serviceData.selectedTerms, function(getTerm){
			if($scope.serviceData.currentSelectedTermId == getTerm[1]){
				var checkTerm = false;
				angular.forEach(getTerm[2], function(paymentType){

					if($scope.serviceData.selectedPaymentType == paymentType){
						checkTerm = true;
					}
				});
				if(checkTerm == false){
					$scope.serviceData.selectedPaymentType = getTerm[2][0];	
				}
			}
		});

	}

	$scope.updateTermType = function(){
		newServiceFactory.viewEstimateObj = {};
		$scope.showLoader = true;
		$scope.ajaxLoader = true;
		$scope.currSkuKey = $scope.serviceData.selectedServiceObj.tenantType
									+'_'+$scope.serviceData.currentSelectedTermId						
									+'_'+$scope.serviceData.selectedPaymentType
									+'_'+$scope.serviceData.selectedServiceObj.licenseType
									+'_'+$scope.serviceData.region[$scope.serviceData.region.length-1]
									+'_'+$scope.serviceData.storageType[$scope.serviceData.storageType.length-1];				

		$scope.currSkuValue = $scope.serviceData.crossRefSKUMap[$scope.currSkuKey];

		//console.log($scope.currSkuKey);
		//console.log($scope.currSkuValue);



		$scope.postObj={};
		$scope.postObj.coreID = newServiceFactory.generatedCartId.toString();
		$scope.postObj.coreCrossRefSku = $scope.currSkuValue[0];
		$scope.postObj.skuQuantityMap = {};
		
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0){
					$scope.postObj.skuQuantityMap[data[0]] = data[8].selectedQty.toString();
				}
			});	
		});

		//console.log("_vm_skuDetailList=" + JSON.stringify($scope.postObj));

		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;
						$scope.updateError = true;
						$scope.ajaxLoader = false;
					  } else {
					  	
					  	angular.copy(successData.wrapper, newServiceFactory.viewEstimateObj);
					  	$scope.updateError = false;
					  	$scope.showLoader = false;
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");		  	
					  	$scope.displayAddOnData();
					  }	
				});
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : view-estimate : update");

			},function(errorData){
				$scope.showLoader = false;
				$scope.updateError = true;
				$scope.ajaxLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.getUpdatedAddOnChannelnew,    		// This comes from the jsp config object
			"_vm_skuDetailList=" + JSON.stringify($scope.postObj)                // changed scope variable to add secondary admin....
			,'GET'
		);

	}
	
	if($.isEmptyObject(newServiceFactory.viewEstimateObj)){
		/*newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.showLoader = false;

					  } else {
					  	
					  	angular.copy(successData.wrapper, newServiceFactory.viewEstimateObj);
					  	//angular.copy(newServiceFactory.viewEstimateObj, $scope.ref_addOnObj);
					  	//console.log(newServiceFactory.successServiceObj);
					  	$scope.showLoader = false;
					  	vmf.msg.page("");		  	
					  	$scope.displayAddOnData();
					  }	
				});
				

			},function(errorData){
				$scope.showLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.estimatorAddAdditionalCapacityURL,    		// This comes from the jsp config object
			''                // changed scope variable to add secondary admin....
			,'GET'
		);*/
		$state.go('estimatorSteps.selectService');
		
	}else{
		$scope.showLoader = false;
		$scope.displayAddOnData();
	}

	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));

		return number;
	}
	//console.log($scope.ref_addOnObj);
	//console.log("Discount Duration: " + $scope.discountDuration, "Percentage: " + $scope.discountPercentage);
				
	$(".editForm").hide();
	$scope.notSorted = function(obj){
		if (!obj) {
			return [];
		}
		return Object.keys(obj);
	}
	$(".labelForm").css("display","block");
	$scope.enableEdit=function($event){
		if(angular.element($event.target).is('[disabled=disabled]')){
		 return false;
		}
		var parElem=angular.element($event.target).parents("div")[0];
		$(parElem).find(".labelForm").hide();
		$(parElem).find(".editForm").show();
		var mainDiv=angular.element($event.target).parents("div")[1];
		$(mainDiv).find(".removeAddon").hide();
		$("a.labelForm").attr("disabled","disabled");
		$scope.editPhase=true;
		angular.element($event.target).siblings('.ajaxSpinner').addClass('hide');
		//$scope.editPhase=true;
	}
	$scope.disableEdit=function($event, addOnKey, addOns, index){
		angular.element($event.target).siblings('.ajaxSpinner').removeClass('hide');
		var earlSelQuantity = $scope.addOnData.addons[addOnKey][index][8].selectedQty;
		if(earlSelQuantity == undefined){
			earlSelQuantity = $scope.addOnData.addons[addOnKey][index][2];
		}

		$scope.postObj={};
		$scope.postObj.coreID = newServiceFactory.generatedCartId.toString();
		$scope.postObj.coreCrossRefSku = $scope.ref_addOnObj.core.coreServiceSku;
		$scope.postObj.skuQuantityMap = {};
		
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0){
					$scope.postObj.skuQuantityMap[data[0]] = data[8].selectedQty.toString();
				}
			});	
		});

		$scope.ajaxLoader = true;
		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
					  	$scope.ajaxLoader = false;
						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						addOns[8].selectedQty = earlSelQuantity;
						$scope.changeAddon(addOnKey, addOns);
						$scope.saveQuantity($event);

				  	} else {
				  		$scope.ajaxLoader = false;
					  	vmf.msg.page("");
					  	$scope.saveQuantity($event);
				  	}
				});
			},function(errorData){
				$scope.$apply(function(){
					$scope.ajaxLoader = false;
					$scope.displayErrorAlert(vCredit.globalVars.ajax_error_body, "warning", true, false, true);
					addOns[8].selectedQty = earlSelQuantity;
					$scope.changeAddon(addOnKey, addOns);
					$scope.saveQuantity($event);
				});
			},
			$scope.globalVars.editAddonQuantityInStack,    		// This comes from the jsp config object
			"_vm_skuDetailList=" + JSON.stringify($scope.postObj)
			,'GET'
		);
		
	}

	$scope.saveQuantity = function($event){
		angular.element($event.target).siblings('.ajaxSpinner').addClass('hide');
		var parElem=angular.element($event.target).parents("div")[0];
		$(parElem).find(".labelForm").show();
		$(parElem).find(".editForm").hide();
		$scope.editPhase=true;
		var mainDiv=angular.element($event.target).parents("div")[1];
		$(mainDiv).find(".removeAddon").show();
		$("a.labelForm").removeAttr("disabled");
		var allSaveLinks=$(".addontable").find("a.editForm");
		$scope.countSaveEnable=0;
		angular.forEach(allSaveLinks,function(data){
				if($(data).is(':visible')){
					$scope.countSaveEnable++;
				}
		});
		if($scope.countSaveEnable > 0){
			$scope.editPhase=true;
		}else{
			$scope.editPhase=false;
		}

		if(!$scope.editPhase){
			angular.copy($scope.ref_addOnObj, $scope.addOnData);
		}
	}

	$scope.checkQty = function(qty, addOns){
		var regex = /^\s*$/g;
		if(!angular.isNumber(qty)){
			if(qty.match(regex) != null)
				addOns[8].selectedQty = 0;
		}
	} 
	
	//changeAddon will be triggered when the Qty & type will be changed 
	$scope.saveButtonDisable=false;
	$scope.changeAddon = function(addOnKey, addOns){
		/*if(addOns[8].selectedQty<1){
			$scope.saveButtonDisable=true;
		}else{
			$scope.saveButtonDisable=false;
		}*/
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
		//addOns[8].billingTypeLabel = $scope.globalVars["payment_type"+selectdType.paymentTypeID];
		
		//console.log(selectdQty + " " + selectdType + " " + addOnKey + " " + addOns[8].billingTypeLabel);
		//console.log(addOns);
		
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
					selectdQtyCost = parseFloat(val[0]);
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
						selectdQtyCost = parseFloat(selectdQtyCost) + parseFloat(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][0]);
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
					supportTierInfo = addOns[7][6][selectdType.paymentTypeVal];
					addOns[8].selectedCost = parseFloat(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + parseFloat(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
				}
				else{
					addOns[8].selectedCost = parseFloat(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
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
				addOnRemainingCost = parseFloat(addOns[8].extendedCost);
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
		//console.log($scope.addOnData.addons);

		angular.forEach($scope.ref_addOnObj.addons, function(addonData){
			angular.forEach(addonData, function(val, key){
				//console.log(val[8].noCost);
				if(val[8].selectedQty > 0){
					if(val[8].selectedType.paymentTypeID == "2"){
						selectdTtlCostMnthly = selectdTtlCostMnthly + parseFloat(val[8].addOnRemainingCost);
						monthlyRecurringCost = monthlyRecurringCost + val[8].extendedCost; 
					}
					if(val[8].selectedType.paymentTypeID == "1"){
						selectdTtlCostPrPaid = selectdTtlCostPrPaid + parseFloat(val[8].addOnRemainingCost);
					}
					if(val[8].selectedType.paymentTypeID == "3"){
						selectdTtlCostYearly = selectdTtlCostYearly + parseFloat(val[8].addOnRemainingCost);
					}
					if(val[8].selectedType.paymentTypeID == "4"){
						selectdTtlCostOneTime = selectdTtlCostOneTime + parseFloat(val[8].addOnRemainingCost);
					}
					
				}

				if(val[8].noCost == 'Y'){
					$scope.validSelectedData = false;
				}
				
			});	
		});
		
		$scope.ref_addOnObj.ttlMonthlyRecurringCost = monthlyRecurringCost;
		$scope.ref_addOnObj.ttltermMonthlyCost = selectdTtlCostMnthly;
		$scope.ref_addOnObj.ttlPrepaidCost = selectdTtlCostPrPaid;
		$scope.ref_addOnObj.ttlYearlyCost = selectdTtlCostYearly;
		$scope.ref_addOnObj.ttlOneTimeCost = selectdTtlCostOneTime;
		
		$scope.ttlMonthlyCost = selectdTtlCostMnthly;
		$scope.ttlPrepaidCost = selectdTtlCostPrPaid;
		$scope.ttlYearlyCost = selectdTtlCostYearly;
		$scope.ttlOneTimeCost = selectdTtlCostOneTime;
		$scope.calculations($scope.ref_addOnObj);	
//console.log($scope.validSelectedData);		
	}
		
	//change addon ends

	$scope.removeAddon = function($event, addOnKey, addOns){

		confirmDialog.confirm({
				header : '',
				msg : $scope.globalVars.removeAddonMsg,
				btnYesText : $scope.globalVars.remove,
				btnNoText :$scope.globalVars.cancelBtn,
				confirmIconType : 'confirm' //confirm/alert/info/''
			},{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
		.result.then(function(btn){
				$scope.ajaxLoader = true;
				angular.element($event.target).siblings('.ajaxSpinner').removeClass('hide');
				newServiceFactory.postServices(
					function(successData){
						$scope.$apply(function(){
							if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
							  		angular.element($event.target).siblings('.ajaxSpinner').addClass('hide');
									$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
									$scope.ajaxLoader = false;

						  	} else {
						  		angular.element($event.target).siblings('.ajaxSpinner').addClass('hide');
						  		$scope.ajaxLoader = false;
							  	vmf.msg.page("");
							  	addOns[8].selectedQty = 0;
								$scope.changeAddon(addOnKey,addOns);
								var noAddOnSelected = false;
								angular.forEach($scope.ref_addOnObj.addons, function(addonData){
									var mainAddon = false;
									angular.forEach(addonData,function(data){
										if(data[8].selectedQty > 0){	
											data[8].selected="selected";
											mainAddon = true;
										}else{
											data[8].selected="no";
										}
									});
									if(mainAddon == true){
										addonData.selectedNode = true;
									}
									else{
										addonData.selectedNode = false;
									}
								});			  	
						  	}
						});
					},function(errorData){
						angular.element($event.target).siblings('.ajaxSpinner').addClass('hide');
						$scope.displayErrorAlert(vCredit.globalVars.ajax_error_body, "warning", true, false, true);
						$scope.ajaxLoader = false;
					},
					$scope.globalVars.removeAddonPostURL,    		// This comes from the jsp config object
					"_vm_coreID=" + newServiceFactory.generatedCartId.toString() + "&_vm_addonSku=" + addOns[8].selectedAddonSKU[0]
					,'GET'
				);
		},function(btn){
		});	
	}

	angular.forEach($scope.serviceData.serviceType,function(data){
		if(data.defaultFlag == 'Y'){
			$scope.serviceData.selectedServiceType = data.serviceName;
			angular.forEach(data.term,function(termData){
				if(termData[3] == 'Y'){
					$scope.serviceData.term_payment = termData[0]+' - '+termData[2];
				}
			});

		}
	});
	$scope.showCalcEnable=function(){
		$scope.showCalc=true;
	};
	$scope.showCalcDisable=function(){
		$scope.showCalc=false;
	};

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


	if($scope.ref_addOnObj.core != null & $scope.ref_addOnObj.core != undefined){
		$scope.calculations($scope.ref_addOnObj);	
	}

	
	$scope.postObj = null;
	$scope.submitOrder=function($event, goTo){
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}
		var total_cost = $scope.dueCost;

		if(goTo == 'excel'){
			var step3SubmitOrderUrl = $scope.globalVars.exportSingleServiceNew;
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : view-estimate : export-excel");
		}
		if(goTo == 'addNew'){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : view-estimate : addAnotherService");
		}
		// if(goTo == 'viewSummary'){
		// 	var step3SubmitOrderUrl = $scope.globalVars.viewEstimatePostUrl;
		// }
	
		$scope.postObj={};
		$scope.postObj.coreCrossRefSku = $scope.ref_addOnObj.core.coreServiceSku;
		$scope.postObj.paymentType = $scope.ref_addOnObj.core.defaultPaymentType;
		$scope.postObj.paymentTerm = $scope.ref_addOnObj.core.remainingTerm[2];
		$scope.postObj.skuQuantityMap = {};
		
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
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

		if(goTo == 'excel'){
			$scope.excelImportDownloadURL = step3SubmitOrderUrl + "&_vm_coreID="+newServiceFactory.generatedCartId.toString()+"&" + submitPostData;
		}else{
			$scope.ajaxLoader = true;
			vmf.msg.page("");
		  	$scope.complete("success", goTo);
			// newServiceFactory.postServices(
			// 	function(successData){
			// 		$scope.$apply(function(){
			// 			if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
						  	
			// 				$scope.$apply(function(){
			// 					$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
			// 					$scope.ajaxLoader = false;
			// 				});
							

			// 		  	} else {
			// 			  	$scope.ajaxLoader = false;
			// 			  	vmf.msg.page("");
			// 			  	$scope.complete(successData, goTo);				  	
			// 		  	}
			// 		});
			// 	},function(errorData){
					
			// 		$scope.displayErrorAlert(vCredit.globalVars.ajax_error_body, "warning", true, false, true);
			// 		$scope.ajaxLoader = false;
			// 	},
			// 	step3SubmitOrderUrl,    		// This comes from the jsp config object
			// 	submitPostData
			// 	,'GET'
			// );	
		}
			
		

	};
	
	//submit success
	$scope.complete=function(jData, goTo){

		$scope.errorMsg=null;	
		if(jData.ERROR != undefined){
			$scope.errorMsg="Response error";
			//console.log($scope.errorMsg);
		}else{
			$scope.ajaxLoader = false;
			if(goTo == 'addNew'){
				newServiceFactory.chooseService = {};
				newServiceFactory.generatedCartId = "";
				$state.go('estimatorSteps.selectService');
			}
			if(goTo == 'viewSummary'){
				newServiceFactory.chooseService = {};
				newServiceFactory.generatedCartId = "";
				$state.go('cartSummary');
			}
		}
		
	};

	//submit failed
	$scope.completeError=function(){
		$scope.errorMsg="Submit order service not working";
	};
	
	$scope.goToConfigureAddon=function(){
		/*newServiceFactory.addOnObj = {};
		if($scope.editPhase){
			angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		}else{
			angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
		}*/
		$state.go('estimatorSteps.configureAddons');
	};
	
	$scope.displayInfoModal = function(getModalData){

		$scope.modalData = getModalData;

		$scope.CurrModal = $modal.open({
	      templateUrl: vCredit.globalVars.vcredit_path+'templates/directives/modal.tpl.html',
		  scope : $scope
	    });

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

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
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