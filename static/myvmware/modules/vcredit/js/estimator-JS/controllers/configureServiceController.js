angular.module('configureServiceControllerModule',[])
.controller('configureServiceCtrl',['$scope','$state','$modal', 'newServiceFactory', '$timeout', '$window',
function($scope, $state, $modal, newServiceFactory, $timeout, $window){
	newServiceFactory.isDashboardFlow = true;

	$scope.localObj = {}
	$scope.serviceData = {};
	$scope.currState = $state.current.name.split('.')[1];
	$scope.currSku = {};
	$scope.serviceTypeError = false;
	$scope.serviceTermError = true;
	$scope.paymentTypeCount = 0;
	$scope.skuError = false;
	$scope.showPage = false;
	$scope.showLoader = true;
	
	$scope.globalVars = {};
	$scope.serviceTypeCount = 0;
	$scope.ajaxLoader = false;
	
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);
	$("[data-toggle='tooltip']").tooltip('show');
	
	$scope.pageInit = function(){
		var getServicesUrlMod = $scope.globalVars.getServicesUrl;

		if($.isEmptyObject(newServiceFactory.configureService) == true){

			/*newServiceFactory.getServices(function(data){
			  if(!$scope.isEmpty(data.ERROR_MESSAGE)){
				$scope.$apply(function(){
					$scope.showPage = false;

				  	$scope.displayErrorAlert(data.ERROR_MESSAGE, "warning", true, true, false);
				  	$scope.showLoader = false;		
				});
			  	

			  } else {

			  	angular.copy(data.wrapper, newServiceFactory.configureService);
			  	
			  	$scope.$apply(function(){
			  		$scope.displayServiceData(data.wrapper);
			  		$scope.showPage = true;
			  		$scope.showLoader = false;
			  	});
			  	if($(".alert-box").parents().hasClass("alertErrorMessageContainer")){
			  		vmf.msg.page("");	
			  	}
			  }	

			},getServicesUrlMod,'GET');*/
			$state.go('estimatorSteps.selectService');
		} else {
			$scope.displayServiceData(newServiceFactory.configureService);
			$scope.showPage = true;
			$scope.showLoader = false;
			vmf.msg.page("");
		}

	}

	$scope.displayInfoModal = function(getModalData){

		$scope.modalData = getModalData;

		$scope.CurrModal = $modal.open({
	      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal.tpl.html',
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

	$scope.displayTrueUpModal = function(getModalData){
		$scope.trueUpmodalData = getModalData;
		$(".alertErrorMessageContainer").html("");
		vmf.msg.page($scope.trueUpmodalData.data.trueup_text1, "", "warning",".alertErrorMessageContainer");
		window.scrollTo(500,0);
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

	$scope.displayServiceData = function(getData){

		angular.copy(getData, $scope.serviceData);
		
		$scope.setPaymentType = [];
		//console.log($scope.serviceData);
		if($scope.serviceData.showPriceList){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : configure-service : sales-rep");
		}else{
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : estimate : configure-service : public-user");
		}
		
		angular.forEach($scope.serviceData.paymentType[0],function(data){
			$scope.setPaymentType.push(data[0]);
		});
		
		$scope.serviceTypeCount = 0;
		$scope.storageCount = 0
		if($scope.serviceData.storageType[1] !== '')
			$scope.storageCount = 1;

		if($scope.serviceData.paymentType[1] !== '')
			$scope.paymentTypeCount = 1;

		if($scope.serviceData.currency[1] == '' && $scope.serviceData.currency.length == 2){
			angular.forEach($scope.serviceData.currency[0],function(val,key){
				$scope.serviceData.currency[1] = key;
			});
		}

		if($scope.serviceData.region[1] !== ''){

			angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[1]],function(data){
				if(data.defaultFlag == 'Y'){
					$scope.serviceTypeCount++;	
					angular.forEach(data.storage,function(strData){
						angular.forEach(strData,function(strData2,strKey){
							if(strKey == $scope.serviceData.storageType[1]){
								angular.forEach(strData2.terms,function(termData){
									if(termData[3] == 'Y')
										$scope.serviceTermError = false;
								});
							}
						});
					});	
				}
			});

		}

    	$scope.$emit('transferHeaderData',
    			{
    				'HdrCurrency': $scope.serviceData.redemptionCurrencySymbol,
    				'HdrRedCurrency': $scope.serviceData.redemptionCurrency
    			});

	    $scope.setCrosssku();

	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.setCrosssku = function(){

		$scope.skuError = false;
		$scope.allSelected = false;

		$scope.serviceData.currentSelectedTerm = null;
		$scope.serviceData.currentSelectedTermId = null;

		if(!$scope.isEmpty($scope.serviceData.storageType[1]))
			//$scope.storageCount = 1;

		if(!$scope.isEmpty($scope.serviceData.paymentType[1]))
			//$scope.paymentTypeCount = 1;

		if($scope.serviceData.region[1] !== '' && $scope.serviceData.region[1] !== undefined){
			angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[1]],function(data){
				if(data.defaultFlag == 'Y'){
					$scope.serviceData.selectedServiceObj = data;
					$scope.serviceTypeCount = 1;

					angular.forEach(data.storage,function(stData){
						angular.forEach(stData,function(stDataObj,stDataObjKey){
							if(stDataObjKey == $scope.serviceData.storageType[1]){
								angular.forEach(stDataObj.terms,function(termData){
									if(termData[3] == 'Y'){
										//$scope.serviceTermError = false;
										$scope.serviceData.currentSelectedTerm = termData[0];
										$scope.serviceData.currentSelectedTermId = termData[1];
									}
								});
								$scope.serviceData.selectedTerms = stDataObj.terms;
							}		
						});
					});

				}
			});
		}

		if(!$scope.isEmpty($scope.serviceData.region[1])
			&& !$scope.isEmpty($scope.serviceData.selectedServiceObj)
			&& !$scope.isEmpty($scope.serviceData.currentSelectedTermId)
			&& !$scope.isEmpty($scope.serviceData.paymentType[$scope.serviceData.paymentType.length-1])
			&& !$scope.isEmpty($scope.serviceData.selectedServiceObj.licenseType)
			&& !$scope.isEmpty($scope.serviceData.region[$scope.serviceData.region.length-1])
			&& !$scope.isEmpty($scope.serviceData.storageType[$scope.serviceData.storageType.length-1])){

				$scope.allSelected = true;

				$scope.serviceData.selectedPaymentType = $scope.serviceData.paymentType[$scope.serviceData.paymentType.length-1];

				$scope.currSku.sku = $scope.serviceData.selectedServiceObj.tenantType
									+'_'+$scope.serviceData.currentSelectedTermId						
									+'_'+$scope.serviceData.paymentType[$scope.serviceData.paymentType.length-1]
									+'_'+$scope.serviceData.selectedServiceObj.licenseType
									+'_'+$scope.serviceData.region[$scope.serviceData.region.length-1]
									+'_'+$scope.serviceData.storageType[$scope.serviceData.storageType.length-1];				

				$scope.currSku.data = $scope.serviceData.crossRefSKUMap[$scope.currSku.sku];

				if($scope.currSku.data == undefined || $scope.currSku.data == ''){
					$scope.skuError = true;
				} else {
					$scope.serviceData.skuData = $scope.currSku.data;

					$scope.skuError = false;
					$scope.SubmitServiceData = "_vm_crossRefSku=" + $scope.currSku.data[0];
					$scope.coreCeilCost = Math.round($scope.currSku.data[2] * $scope.creditValue);
					$scope.updateCartPopOver(newServiceFactory.currentCartId,$scope.coreCeilCost,$scope.serviceData.serviceName,$scope.serviceData.selectedServiceObj.serviceName);
				}

		} else {
				$scope.skuError = true;
				$scope.currSku.data == null;
		}

		if(!$scope.skuError){
			$scope.trueUpError = false;
			vmf.msg.page("");
		}
	}

	$scope.changeRegion = function(region){

		var serviceCount = null;
		$scope.serviceTypeCount = 0;

		if($scope.serviceData.serviceType[$scope.serviceData.region[$scope.serviceData.region.length-1]] !== undefined)
			serviceCount = $scope.serviceData.serviceType[$scope.serviceData.region[$scope.serviceData.region.length-1]].length;

		//console.log($scope.serviceData.serviceType[$scope.serviceData.region[$scope.serviceData.region.length-1]]);

		if(serviceCount >= 1)
			$scope.serviceTypeCount = serviceCount;
		else
			$scope.serviceTypeCount = 0;

		angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[$scope.serviceData.region.length-1]],function(data){

			//console.log(data);

			if(serviceCount == 1){
				data.defaultFlag = 'Y';				
				$scope.changeService(data);
			} else {
				$scope.storageCount = 0;
				//$scope.serviceData.storageType[1] = '';
				$scope.serviceTermError = true;
				$scope.paymentTypeCount = 0;
				//$scope.serviceData.paymentType[1] = '';
				data.defaultFlag = 'N';
			}
		});

		$scope.setCrosssku();

	}

	$scope.changeService = function(getService){

		$scope.serviceTermError = true;
		var storageCount = 0 ;
		$scope.serviceData.storageType[1] = '';
		var getStorageKey = '' ;

		angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[1]],function(data){

			if(getService == data){
				data.defaultFlag = "Y";
				$scope.serviceData.selectedServiceObj = data;

				angular.forEach(data.storage[0],function(strData){
					if(strData.storageName !== '' && strData.storageName !== undefined)
						storageCount++;
				});

				angular.forEach(data.storage,function(strData){
					angular.forEach(strData,function(strData2,strData2key){
						if(strData2.storageName !== '' && strData2.storageName !== undefined){

							$scope.serviceTermError = true;

							if(storageCount == 1){
								$scope.serviceData.storageType[1] = strData2key;
								$scope.changeStorage(strData2key);							
							} else {							
								$scope.paymentTypeCount = 0;
							}
						}
					});
				});				

			} else {
				data.defaultFlag = "N";
			}

		});

		$scope.storageCount = storageCount;
		$scope.setCrosssku();

	}

	$scope.changeStorage = function(getStorage){

		$scope.selectedTermCount = 0;

		angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[1]],function(data){
			if(data.defaultFlag == 'Y'){
				angular.forEach(data.storage,function(stData,stKey){
					if(stData[$scope.serviceData.storageType[1]] !== undefined){

						var termLength = stData[$scope.serviceData.storageType[1]].terms.length;

						if(termLength >=1 ){
							$scope.serviceTermError = false;	
						} else {
							$scope.serviceTermError = true;
							$scope.paymentTypeCount = 0;
							//$scope.serviceData.paymentType[1] = '';	
						}	

						angular.forEach(stData[$scope.serviceData.storageType[1]].terms,function(termData){
								if(termLength == 1){
									termData[3] = 'Y';
									$scope.changeTermLength(termData[1]);
								} else {
									$scope.paymentTypeCount = 0;
									//$scope.serviceData.paymentType[1] = '';
									termData[3] = 'N';
								}

								if(termData[3] == 'Y')
									$scope.selectedTermCount++;								
						});			


						// If not term is selected by default, select the first term
						/*if($scope.selectedTermCount == 0){			
							stData[$scope.serviceData.storageType[1]].terms[0][3] = 'Y';
							$scope.changeTermLength(stData[$scope.serviceData.storageType[1]].terms[0][1]);
						}*/

					}
				});
			}

		});

		$scope.setCrosssku();
	}

	$scope.changeTermLength = function(getTerm){
		angular.forEach($scope.serviceData.serviceType[$scope.serviceData.region[1]],function(data){
			if(data.defaultFlag == 'Y'){
				angular.forEach(data.storage,function(stData,stKey){
					angular.forEach(stData,function(stDataObj,stDataObjKey){
						if(stDataObjKey == $scope.serviceData.storageType[1]){
							angular.forEach(stDataObj.terms,function(termData){

								if(getTerm == termData[1]){
									termData[3] = 'Y';
									$scope.paymentTypeCount = 1;

									if(termData[2].length == 1){
										$scope.serviceData.paymentType[1] = termData[2][0];							
									} else {
										$scope.serviceData.paymentType[1] = '';
									}
								} else {
									termData[3] = 'N';
								}
							});	
						}
					});
				});
			}
		});
		 $scope.setCrosssku();
	}

	$scope.validateService = function(){

		$scope.serviceTypeError = true;

		if($scope.serviceData.currentSelectedTerm == null)
			$scope.serviceTermError = true;
		else
			$scope.serviceTermError = false;
	}

	$scope.cancelFn = function(){
		newServiceFactory.clearObjects();
		//$state.go('configurator');

		var getParam = newServiceFactory.getParameterByName('_VM_flow');

		if(getParam !== undefined && getParam !== null && getParam == 'sidDetails')
			window.location = vcredit.globalVars.postBackUrlFromExtLink;
		else
			window.location = vcredit.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		newServiceFactory.cancelFlow(callbackFn);	
	}

	$scope.gotoSelectService = function(){
		$state.go("estimatorSteps.selectService");
	}

	$scope.goToAddOns = function(){
		angular.copy($scope.serviceData, newServiceFactory.configureService);
		
		newServiceFactory.addOnObj = {};
		$scope.ajaxLoader = true;
		$scope.addonServiceData = $scope.SubmitServiceData;
		
		newServiceFactory.postServices(
			function(successData){
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.ajaxLoader = false;

					  } else {
					  	
					  	angular.copy(successData, newServiceFactory.successServiceObj);
					  	
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");
					  	$state.go('estimatorSteps.configureAddons');				  	
					  }	
				});
				

			},function(errorData){
				$scope.ajaxLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.estimatorAddAdditionalCapacityURL,    		// This comes from the jsp config object
			$scope.addonServiceData                // changed scope variable to add secondary admin....
			,'GET'
		);

		/*$state.go('newService.configureAddOns');*/
		
	}

	$scope.pageInit();
	$scope.steps = [];
	
	angular.copy(newServiceFactory.steps,$scope.steps);
	
	$scope.pageInitConfigure = function(getCurrState){
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

	}

	$scope.pageInitConfigure($state.current);
	 /*$scope.$on(
		'$stateChangeStart',
		$timeout(function(event, toState, toParams, fromState, fromParams){ 
		    $scope.pageInitConfigure(toState);
		},0)
	);*/

}]);