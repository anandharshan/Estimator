
//Add on Service
angular
//Creating module for addons
.module('addOnService',['ui.bootstrap'])
.config(function ($stateProvider, $sceProvider) {

	$sceProvider.enabled(false);

	$stateProvider.state('addOnService', {
		url: '/addOnService',
		views: {
			'configurator-view': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/add_on/addon.tpl.html',
				controller: 'addOnServiceCtrl'
			}
		}	
	}).state('addOnService.selectService', {
		url: '/selectService/:prodFamily',
		parent: 'addOnService',
		views: {
			'addOnServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/add_on/steps/selectService.tpl.html',
				controller: 'addOnSltServiceCtrl'
			}
		}	
	}).state('addOnService.configureAddons', {
		url: '/configureAddons',
		parent: 'addOnService',
		views: {
			'addOnServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/add_on/steps/configureAddons.tpl.html',
				controller: 'addOnSltAddOnCtrl'
			}
		}	
	}).state('addOnService.reviewAndSubmit', {
		url: '/reviewAndSubmit',
		parent: 'addOnService',
		views: {
			'addOnServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/add_on/steps/reviewAndSubmit.tpl.html',
				controller: 'addOnReviewCtrl'
			}
		}	
	}).state('addOnService.complete', {
		url: '/complete',
		parent: 'addOnService',
		views: {
			'addOnServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/add_on/steps/complete.tpl.html',
				controller: 'addOnSuccessCtrl'
			}
		}	
	})
})
.controller('addOnServiceCtrl',['$scope','$state','$modal', 'newServiceFactory', 'vmf', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, confirmDialog){

	$scope.showFundInfoSection = true;
	$scope.showProgressBar = true;
	$scope.isFundDefaultSelected = true;

	$scope.globalVars = {};
	
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	$scope.setHelpURL = function (getCurrState){
		if(getCurrState.name == "addOnService.reviewAndSubmit"){
			$scope.helpURL = $scope.globalVars.addonService3ReviewandSubmit;
			//console.log("In side Addon for review step 3:: " + getCurrState.name + "" +$scope.helpURL);
		}else{
			$scope.helpURL = $scope.globalVars.configurator_KBArticle_link;
			//console.log("In side Addon:: else case" + $scope.helpURL);
		}
	}

	$scope.pageInit = function(getCurrState){
			$scope.currState = getCurrState.name.split('.')[1];
		    angular.forEach($scope.steps,function(data){
		    	if(data.link == $scope.currState){
		    		$scope.pageHeader = data.header;
		    		$scope.changeFund = data.changeFund;
		    	}
		    });

		    setTimeout(function(){
		    	$('li.active').removeClass('visited');
		    	$('li.active').prevAll().addClass('visited');
		    }, 200);
	}

	$scope.steps = [];
	angular.copy(newServiceFactory.stepsAddon,$scope.steps);

	$scope.pageInit($state.current);

	$scope.$on('changeStepsData',
				function(evt, data){
				$scope.steps = data;	

				angular.forEach($scope.steps,function(data){
			    	if(data.link == $scope.currState){
			    		$scope.pageHeader = data.header;
			    		$scope.changeFund = data.changeFund;
			    	}
			    });
			}
		);

	$scope.$on(
		'$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){ 
		    $scope.pageInit(toState);
		}
	);

	$scope.$on('transferHeaderData',
			function(evt, data){

				$scope.eaAccountDisplay = data.HdrAccountNumber + "-" + data.HdrAccount;
				$scope.eaAccount = data.HdrAccount;
				$scope.getFund = data.HdrFund;
				$scope.getFundId = data.HdrFundId;
				$scope.getBalance = data.Hdrbalance.replace(',','');
				$scope.currency = data.HdrCurrency;
				$scope.currencyLocale = data.HdrRedCurrency;
				$scope.eaAccountNumber = data.HdrAccountNumber;
				$scope.identifierName = data.identifierName;
				$scope.isXaasFund = data.isXaasFund;
				if(data.trueUp == 'Y' || parseInt(data.trueUp) == 1){
					$scope.trueUp = "1";	
				}else{
					$scope.trueUp = "0";
				}
			}
		);

	$scope.$on('displayTrueUpEvt',
			function(evt, data){
				$scope.displayTrueUpModal(data);
			}
	);

	$scope.$on('alertWarningData',
			function(evt, data){
				$scope.alertWarning = data.alertWarning;
			    $scope.alertServiceDetailLink = data.alertServiceDetailLink;
			    //if(data.showProgressBar != "" && data.showProgressBar != null && data.showProgressBar != undefined){
			    	$scope.showProgressBar = data.showProgressBar;
			    //}
			}
	);

	$scope.displayTrueUpModal = function(getModalData){
		$scope.trueUpmodalData = getModalData;
		$(".alertErrorMessageContainer").html("");
		vmf.msg.page($scope.trueUpmodalData.data.trueup_text1, "", "warning",".alertErrorMessageContainer");
		window.scrollTo(500,0);

		// $scope.CurrModal = $modal.open({
		//   templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_trueUp.tpl.html',
	 //      scope : $scope
	 //    });
	}

	//Change Fund Modal Start

	$scope.openChangeFund = function(){
		$scope.errMessage = "";
		$scope.ajaxFundLoader = false;
		$scope.continueFundDisable = false;
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
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : change-fund");

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
			'_VM_eaName='+ $scope.eaAccount +'&_VM_eaNumber='+ $scope.eaAccountNumber
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
					  		//$state.transitionTo('configurator', null, {'reload':true});
					  		//window.location.assign(vcredit.globalVars.configHomeUrl + "&_VM_fundGroupID=" + $scope.selectedFundId);
					  		angular.copy(successData,newServiceFactory.configuratorHomePageData);
					  		angular.copy(successData,newServiceFactory.configuratorLinksObj);
					  		newServiceFactory.clearObjects();
					  		$state.go('configurator');
					  	}

					});
					if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : change-fund : continue");
				},function(errorData){
					$scope.ajaxFundLoader = false;
					$scope.errMessage = $scope.globalVars.ajax_error_body;
				},
				vcredit.globalVars.submitSelectedFundUrl,    		// This comes from the jsp config object
				'_VM_changedFundGroupID='+ $scope.selectedFundId 
				,'GET'
			);
		}
		else{
			$scope.ajaxFundLoader = false;			  	 		  	
	  		$scope.CurrModal.close();
		}
		//$scope.ajaxFundLoader = false;
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
		}
		else{
			vmf.msg.page("");
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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : change-fund : cancel");
	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}


}])
.controller('addOnSltServiceCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : existing-service");
	newServiceFactory.isDashboardFlow = true;
	$scope.serviceData = {};
	$scope.globalVars = {};
	$scope.getToolTipData = null;
	$scope.htmlTooltip = null;
	$scope.skuObj = {};
	
	$scope.showLoader = true;
	$scope.showPage = false;
	$scope.showSelectBtn = true;

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	$scope.getServiceUrl = $scope.globalVars.addonsGetServicesUrl+"&_VM_prdFamilyDetails="+$state.params.prodFamily;

	$scope.pageInit = function(){

		if($.isEmptyObject(newServiceFactory.serviceObj) == true){
			newServiceFactory.postServices(function(data){

					//$scope.$apply(function(){							

							if(!$scope.isEmpty(data.ERROR_MESSAGE) || !$scope.isEmpty(data.wrapper.error_message)){

								$scope.$apply(function(){

								  	
									if(!$scope.isEmpty(data.ERROR_MESSAGE)){
										$scope.displayErrorAlert(data.ERROR_MESSAGE, "warning", true, true, false);
									}else{
										$scope.displayErrorAlert(data.wrapper.error_message, "warning", true, true, false);
									}
								  	

								  	$scope.showPage = false;
								  	$scope.showLoader = false;

								});

							} else {
								vmf.msg.page("");
								$scope.$apply(function(){
									$scope.showLoader = false;
									$scope.showPage = true;
									$scope.displayServiceData(data.wrapper);
								});

							}

					//});						

				},function(errorData){

					$scope.$apply(function(){

						/*$scope.displayInfoModal({
						  		'header' : $scope.globalVars.ajax_error_header,
						  		'body' : $scope.globalVars.ajax_error_body,
						  		'okText' : $scope.globalVars.modal_ok,
						  		'cancelText' : $scope.globalVars.modal_cancel,
						  		'showOk' : true,
						  		'showCancel':false
						  	});*/
						$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, true, false);

						$scope.showLoader = false;

					});

				},
				$scope.getServiceUrl,
				'_VM_tokenFlag='+ ((!$scope.globalVars.tokenFlag.length) ? " ": $scope.globalVars.tokenFlag),
				'GET'
			);

		} else {
			vmf.msg.page("");
			$scope.showPage = true;
			$scope.showLoader = false;
			$scope.displayServiceData(newServiceFactory.serviceObj);
		}		
	}
	
	//Collapse icon 
	$scope.colapse = function($index){
	
	if($('.panel-collapse').eq($index).hasClass('in')){
					$('.openaccordion').eq($index).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
	}
	else {$('.openaccordion').eq($index).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');}
	}
   //Collapse icon ends
	
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

	$scope.getSkuData = function(serviceID){

		if(!$scope.isEmpty($scope.skuObj[serviceID]))
			return;

		var getData = "_VM_serviceID="+serviceID+'&_VM_tokenFlag='+((!$scope.globalVars.tokenFlag.length) ? " ": $scope.globalVars.tokenFlag);
		$scope.skuObj[serviceID] = false;

		newServiceFactory.postServices(
			function(successData){

				$scope.$apply(function(){

					  if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	// Display modal if error
					  	/*$scope.displayInfoModal({
					  		'header' : $scope.globalVars.ajax_error_header,
					  		'body' : successData.ERROR_MESSAGE,
					  		'okText' : $scope.globalVars.modal_ok,
					  		'cancelText' : $scope.globalVars.modal_cancel,
					  		'showOk' : true,
					  		'showCancel':false
					  	});*/
					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);

					  } else {
					  		vmf.msg.page("");
							$scope.skuObj[serviceID] = $scope.skuObj[serviceID] || {};	
					  		angular.copy(successData.wrapper, $scope.skuObj[serviceID]);
					  }

				});	

			},function(errorData){
				/*$scope.displayInfoModal({
				  		'header' : $scope.globalVars.ajax_error_header,
				  		'body' : $scope.globalVars.ajax_error_body,
				  		'okText' : $scope.globalVars.modal_ok,
				  		'cancelText' : $scope.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});*/
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);

			},
			$scope.globalVars.selectServiceUrl,    		// This comes from the jsp config object
			getData
			,'GET'
		);
	}

	// Modal Popup Ok button
	$scope.ok = function(){
		$scope.CurrModal.close();
	}

	// Modal Popup Cancel button
	$scope.cancel = function(){
		$scope.CurrModal.close();
	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.displayServiceData = function(getData){

		//$scope.$apply(function(){
			if(getData.fundInfo == null || getData.fundInfo == undefined){
				newServiceFactory.getFundInfo(getData);
				getData.fundInfo = {};
				angular.copy(newServiceFactory.fundInfo, getData.fundInfo);
			}

			if(getData !== $scope.serviceData)
				angular.copy(getData, $scope.serviceData);

			if(getData !== newServiceFactory.serviceObj)
				angular.copy(getData, newServiceFactory.serviceObj);

			$scope.getToolTipData = $scope.globalVars.addonsServiceToolTip1+" "+$scope.serviceData.fundName+". <a href='"+$scope.globalVars.goToAllServiceURL+"'>"+$scope.globalVars.addonsServiceToolTip2+"</a>";
			$scope.htmlTooltip = $scope.getToolTipData;
						
			
			
			
			$scope.$emit('transferHeaderData',
			{
				'HdrAccount' : $scope.serviceData.account.split('-')[1],
				'HdrAccountNumber' : $scope.serviceData.account.split('-')[0],
				'HdrFund' : $scope.serviceData.fundName,
				'HdrFundId' : $scope.serviceData.fundGroupId,
				'Hdrbalance' : (vcredit.globalVars.serviceCategory!="VSPP") ? $scope.serviceData.fundBalance : $scope.serviceData.fundInfo.fundBalance,
				'HdrCurrency':  $scope.serviceData.fundInfo.redemptionCurrencySymbol,
				'HdrRedCurrency': $scope.serviceData.fundInfo.redemptionCurrency,
				'isXaasFund' : $scope.serviceData.isXaasFund,
				'trueUp' : $scope.serviceData.fundInfo.trueUp,
				'identifierName' : $scope.serviceData.fundInfo.identifierName,
				//Added commitID ....
				'HdrCommitId': $scope.serviceData.commitID

			});
			

		//});

	}

	$scope.selectService = function(id,getEvt){

		$(getEvt.currentTarget).siblings('.ajaxSpinner').removeClass('hide');
		//$(getEvt.currentTarget).addClass('hide'); keeping the disabling there.
		$scope.showSelectBtn = false;

		$scope.serviceData.selectedService = {};

		angular.copy($scope.serviceData.services[id], $scope.serviceData.selectedService);

		//$scope.goToAddOns();

		//console.log($scope.serviceData.services[id]);

		/*$scope.SubmitServiceData = "_VM_flow=addon&_VM_EA=" + $scope.serviceData.eaAccountNumber +
													"&_VM_CN=" + $scope.serviceData.customerNumber +
													"&_VM_SKU=" + $scope.currSku.data[0] +
													"&_VM_CURRENCY=" + $scope.serviceData.currency[1];*/

		$scope.submitSelectAddonServiceData = "_VM_serviceInstanceId=" + $scope.serviceData.services[id].encryptedID + '&_VM_tokenFlag=' + ((!$scope.globalVars.tokenFlag.length) ? " ": $scope.globalVars.tokenFlag);

		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : existing-service-button");

		newServiceFactory.postServices(
			function(successData){
				
				$scope.$apply(function(){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){


						/*if(data.ERROR_CODE == 'VM-SDP-ELIG_ADD_ON-0300'){
								$scope.$emit('alertWarningData',
				    			{
				    				'alertWarningMessage' : successData.ERROR_MESSAGE,
				    				'alertWarning' : true,
				    				'alertServiceDetailLink' : true
				    			});

						}
						else{
							// Display modal if error
						  	$scope.displayInfoModal({
						  		'header' : $scope.globalVars.ajax_error_header,
						  		'body' : successData.ERROR_MESSAGE,
						  		'okText' : $scope.globalVars.modal_ok,
						  		'cancelText' : $scope.globalVars.modal_cancel,
						  		'showOk' : true,
						  		'showCancel':false
						  	});	
						}*/

					  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);

					  	$(getEvt.currentTarget).siblings('.ajaxSpinner').addClass('hide');
						$(getEvt.currentTarget).removeClass('hide');

					} else {
						vmf.msg.page("");
						if(successData.wrapper.core.fundInfo == null ||  successData.wrapper.core.fundInfo == undefined){
					  		newServiceFactory.getFundInfo(successData.wrapper.core);
					  		successData.wrapper.core.fundInfo = {};
							angular.copy(newServiceFactory.fundInfo, successData.wrapper.core.fundInfo);
					  	}
					  	angular.copy(successData, newServiceFactory.successServiceObj);
					  	$scope.goToAddOns();				  	
					}

					$scope.showSelectBtn = true;	
				});

				

			},function(errorData){
				/*$scope.displayInfoModal({
				  		'header' : $scope.globalVars.ajax_error_header,
				  		'body' : $scope.globalVars.ajax_error_body,
				  		'okText' : $scope.globalVars.modal_ok,
				  		'cancelText' : $scope.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});*/
				$scope.$apply(function(){
					$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);

					$(getEvt.currentTarget).siblings('.ajaxSpinner').addClass('hide');
					$(getEvt.currentTarget).removeClass('hide');
					$scope.showSelectBtn = true;	
				});
				
			},
			$scope.globalVars.submitAddonServiceURL,    		// This comes from the jsp config object
			$scope.submitSelectAddonServiceData
			,'GET'
		);

	}

	$scope.cancelFn = function(){
		newServiceFactory.clearObjects();
		//$state.go('configurator');
		window.location = vcredit.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();	
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow");
	}
	
	$scope.displayConfirmModal = function(){
		// var getModalData = {
  // 			'body' : $scope.globalVars.confirm_message,
  // 			'okText' : $scope.globalVars.confirm,
  // 			'cancelText' : $scope.globalVars.cancelBtn,
  // 			'okBtnAction':$scope.cancelConfirmWindow,
  // 			'cancelBtnAction':$scope.continueConfirmWindow
  // 		};
		// $scope.modalData = getModalData;
		// $scope.ConfirmModal = $modal.open({
	 //      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_confirm_tpl.html',
		//   scope : $scope,
		//   windowClass: 'confirm_window'
	 //    });
	    confirmDialog.confirm({
            header : '',
            msg : $scope.globalVars.confirm_message,
            btnYesText : $scope.globalVars.confirm,
            btnNoText : $scope.globalVars.cancelBtn,
            confirmIconType : 'confirm' //confirm/alert/info/''
        },{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
        .result.then(function(btn){
            $scope.cancelFn();
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

	$scope.goToAddOns = function(){
		newServiceFactory.addOnObj = {};
		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		$state.go('addOnService.configureAddons');
	}

	$scope.pageInit();

}])
.controller('addOnSltAddOnCtrl',['$scope','$state', '$location', '$modal', 'newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $location, $modal, newServiceFactory, vmf, $window, confirmDialog){

	//$scope.getAddOnServiceUrl = 'vcredit/json/updated_addOn_service.json';

	$scope.serviceData = {};
	//$scope.addOnData = {};
	if(Object.keys(newServiceFactory.addOnObj).length > 0){
		$scope.addOnData=newServiceFactory.addOnObj;
	}else{
		$scope.addOnData = {};
	}
	$scope.globalVars = vcredit.globalVars;
	$scope.currState = $state.current.name.split('.')[1];
	$scope.addOnFlag = 0;
	$scope.validSelectedData = false;
	$scope.trueUpError=true;
	$scope.showLoader = true;
	$scope.successServiceObj = {};
	$scope.isXaasFund = true;
	$scope.renewalText = $scope.globalVars.renewalBtnText;
	$scope.reviewError = false;
	$scope.ajaxLoader = false;
	$scope.showAddOnPage = true;

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	$scope.getURLParam = newServiceFactory.getURLParam;

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.getURLParam.length <= 0){
		$state.go('configurator');
	}

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false && newServiceFactory.getURLParam !== null && newServiceFactory.getURLParam !== ''){
			
			if(newServiceFactory.getParameterByName('origin') == "all-services" && newServiceFactory.getParameterByName('origin') != '' && newServiceFactory.getParameterByName('origin') != undefined){
				if(typeof riaLinkmy !="undefined") riaLinkmy("all-services : purchase-add-ons : add-additional-capacity");
			}else{
				if(typeof riaLinkmy !="undefined") riaLinkmy("service-details : purchase-add-ons : add-additional-capacity");
			}

			vmf.scEvent = true;
			$scope.steps.splice(0,1);

			$scope.submitSelectAddonServiceData = "&_VM_serviceInstanceId="+ encodeURIComponent(newServiceFactory.getURLParam) + '&_VM_tokenFlag=' + ((!$scope.globalVars.tokenFlag.length) ? " ": $scope.globalVars.tokenFlag);
			$scope.backButtonHide = true;
				
					newServiceFactory.postServices(
						function(successData){
							if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

							  	// Display modal if error
							  	/*$scope.displayInfoModal({
							  		'header' : $scope.globalVars.ajax_error_header,
							  		'body' : successData.ERROR_MESSAGE,
							  		'okText' : $scope.globalVars.modal_ok,
							  		'cancelText' : $scope.globalVars.modal_cancel,
							  		'showOk' : true,
							  		'showCancel':false
							  	});*/
								$scope.$apply(function(){
									$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, true, false);	

								  	$scope.showLoader = false;
								  	$scope.showAddOnPage = false;		
								});
							  	

							  } else {
							  	$scope.$apply(function(){
							  		vmf.msg.page("");

							  		$scope.showLoader = false;
							  		$scope.showAddOnPage = true;
							  		if(successData.wrapper.core.fundInfo == null ||  successData.wrapper.core.fundInfo == undefined){
								  		newServiceFactory.getFundInfo(successData.wrapper.core);
								  		successData.wrapper.core.fundInfo = {};
										angular.copy(newServiceFactory.fundInfo, successData.wrapper.core.fundInfo);
								  	}
								  	
							  		angular.copy(successData, newServiceFactory.successServiceObj);	

							  		$scope.isXaasFund = parseInt(newServiceFactory.successServiceObj.wrapper.core.fundInfo.isXaasFund);

							  		$scope.displayAddOnData(successData);

							  		newServiceFactory.serviceObj.fundName = newServiceFactory.successServiceObj.wrapper.core.fundInfo.name;
							  		newServiceFactory.serviceObj.fundBalance = newServiceFactory.successServiceObj.wrapper.core.fundInfo.fundBalance;
							  		newServiceFactory.serviceObj.redemptionCurrencySymbol = newServiceFactory.successServiceObj.wrapper.core.fundInfo.redemptionCurrencySymbol;
							  		newServiceFactory.serviceObj.trueUp = newServiceFactory.successServiceObj.wrapper.core.fundInfo.trueUp;
							  		newServiceFactory.serviceObj.isXaasFund = newServiceFactory.successServiceObj.wrapper.core.fundInfo.isXaasFund;


							  		$scope.$emit('transferHeaderData',
						    			{
						    				'HdrAccount' : newServiceFactory.successServiceObj.wrapper.core.eaAccount,
						    				'HdrAccountNumber' : newServiceFactory.successServiceObj.wrapper.core.eaAccountNumber,
						    				'HdrFund' : newServiceFactory.successServiceObj.wrapper.core.fundInfo.name,
						    				'HdrFundId' : newServiceFactory.successServiceObj.wrapper.core.fundInfo.fundGroupId,
						    				'Hdrbalance': newServiceFactory.successServiceObj.wrapper.core.fundInfo.fundBalance,
						    				'HdrCurrency': newServiceFactory.successServiceObj.wrapper.core.fundInfo.redemptionCurrencySymbol,
						    				'HdrRedCurrency': newServiceFactory.successServiceObj.wrapper.core.fundInfo.redemptionCurrency,
						    				'isXaasFund' : newServiceFactory.successServiceObj.wrapper.core.fundInfo.isXaasFund,
	    									'identifierName' : newServiceFactory.successServiceObj.wrapper.core.fundInfo.identifierName,
	    									'trueUp' : newServiceFactory.successServiceObj.wrapper.core.trueUp
						    			}
						    		);

							  	});							  	
							  }
							if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : add-products");
						},function(errorData){
							/*$scope.displayInfoModal({
							  		'header' : $scope.globalVars.ajax_error_header,
							  		'body' : $scope.globalVars.ajax_error_body,
							  		'okText' : $scope.globalVars.modal_ok,
							  		'cancelText' : $scope.globalVars.modal_cancel,
							  		'showOk' : true,
							  		'showCancel':false
							  	});*/
							$scope.$apply(function(){
								$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, true, false);
								$scope.showLoader = false;
								$scope.showAddOnPage = false;			
							});
							if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : add-products");
						},
						$scope.globalVars.addonConfigForExistingServiceUrl,    		// This comes from the jsp config object
						$scope.submitSelectAddonServiceData
						,'GET'
					);				

				//remove back button
				//apply postBackUrl to cancel
				//get HeaderDetails - FundInfo, Balance, Trueup etc
				//factory.IsDashboardFlow = false;
	}
	else{
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : add-additional-capacity");
	}


	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}


	$scope.disableButtonForNoAddonSelected = function(){
		var haveSelectedQty = false;
		angular.forEach($scope.addOnData.addons, function(addonData){
			angular.forEach(addonData, function(val, key){
				//console.log(key);
				if(val[8].selectedQty > 0 && val[8].selectedType.paymentTypeID != "0"){
					haveSelectedQty =  true;
				}
			});
		});

		if(haveSelectedQty){
			$scope.validSelectedData = true;
		}else{
			$scope.validSelectedData = false;
		} 
		if($scope.validSelectedData || !$scope.validSelectedData){

			$scope.trueUpError=true;
			vmf.msg.page("");
		}
	}

	
	angular.copy(newServiceFactory.serviceObj, $scope.serviceData);

	if(newServiceFactory.globalVars !== $scope.globalVars)
		angular.copy(newServiceFactory.globalVars, $scope.globalVars);

	/*newServiceFactory.getServices(function(data){
		$scope.displayAddOnData(data);
	},$scope.globalVars.submitAddonServiceURL + "&_VM_serviceInstanceId=M360729971");*/

	angular.copy(newServiceFactory.successServiceObj, $scope.successServiceObj);

	$scope.displayAddOnData = function(getData){
	
		//$scope.$apply(function(){			

			

			if(!$scope.isXaasFund){
				$scope.renewalText = $scope.globalVars.renewalBtnTextNotXaas;	

				angular.forEach($scope.steps, function(val){
					val.header = $scope.globalVars.addonHeaderNotXaas;
				});

				 $scope.$emit('changeStepsData',
		     			$scope.steps
		     	);

			}

			angular.copy(getData.wrapper, $scope.addOnData);			
			angular.copy(getData.wrapper, newServiceFactory.addOnObj);

			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;
				$scope.showAddOnPage = true;	
			}

			$scope.exportExcelURL = $scope.globalVars.addOnFlowExcelImportURL + "&_VM_serviceID=" + $scope.addOnData.core.serviceID;

			var err_message = "";

			if(parseInt($scope.addOnData.core.managePermission) == 0){
				err_message = $scope.globalVars.managePermissionText;
			}
			
			if(parseInt($scope.addOnData.core.fundInfo.fundAccess) == 0 && $scope.isXaasFund){
				if(err_message != ""){
					err_message = err_message + "<br>";
				}

				var strFundAccessText1 = $scope.globalVars.fundAccessText1;

				strFundAccessText1 = strFundAccessText1.replace("{0}", $scope.addOnData.core.fundInfo.name);

				err_message = err_message + strFundAccessText1 + " " + $scope.addOnData.core.fundInfo.fundOwner + " " + $scope.globalVars.fundAccessText2
			}

			vmf.msg.page("");

			if(err_message != ""){
				/*$scope.$emit('alertWarningData',
				{
					'alertWarningMessage' : err_message,
					'alertWarning' : true,
					'alertServiceDetailLink' : false
				});*/
				$scope.displayErrorAlert(err_message, "warning", true, false, false);
				$scope.reviewError = true;	
			}
			

			

			$scope.addOnData.core.totalCoreCost = 0;

			if ($scope.addOnData.core.recurringCost != null && $scope.addOnData.core.recurringCost != undefined){
				$scope.addOnData.core.coreMonthlyCost = parseFloat($scope.addOnData.core.recurringCost["2"][0]);
				$scope.addOnData.core.coreMonthlyAddonCost = parseFloat($scope.addOnData.core.recurringCost["2"][1]);
				$scope.addOnData.core.coreTtlMonthlyCost = $scope.addOnData.core.coreMonthlyCost + $scope.addOnData.core.coreMonthlyAddonCost;
				
				$scope.addOnData.core.coreAnnualCost = parseFloat($scope.addOnData.core.recurringCost["3"][0]);
				$scope.addOnData.core.coreAnnualAddonCost = parseFloat($scope.addOnData.core.recurringCost["3"][1]);
				$scope.addOnData.core.coreTtlAnnualCost = $scope.addOnData.core.coreAnnualCost + $scope.addOnData.core.coreAnnualAddonCost;

				$scope.addOnData.core.totalCoreCost = $scope.addOnData.core.coreTtlMonthlyCost + $scope.addOnData.core.coreTtlAnnualCost;
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
				
				$scope.addOnData.core.remainingTermText = $scope.remainingTerm;
				var addOnRemainingCost = 0;
				var selectdQtyCost = 0;
				var selectdAddonSKU = "";
				angular.forEach($scope.addOnData.addons,function(aData,key){
					angular.forEach(aData,function(data,index){
						data[8] = {};  // Selected Addon object
						data[8].selectedAddonSKU = '';
						data[8].selectedQty = 0;
						data[8].extendedCost = 0;
						data[8].paymentType = [];						
						data[8].noCost = "N";
						data[8].uniqueClass = key.replace(/ /g, "_").replace(/\./g, "__")+"_"+index;
						//data[8].earlierSelectedQty = parseInt(data[2]);
						data[8].discountText = "";

						angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

							angular.forEach(data[3], function(val){
								if(payTypeData.paymentTypeID == val){
									data[8].paymentType.push(payTypeData);
								}
							});
							
						});

						angular.forEach(data[8].paymentType, function(typeData){
							if(typeData.paymentTypeID == data[4]){
								data[8].selectedType = typeData;
								//console.log(typeData);
							}	
						});
						
						// Horizon
						if($scope.addOnData.core.horizon){
							data[8].supportLevelType = [];
							data[8].supportLevelList = {};
							data[8].dependentPaymentTypes = data[13];
							angular.forEach($scope.addOnData.supportLevelType, function(supportLevelData, key){

								angular.forEach(data[11], function(val){
									if(supportLevelData.supportLevelID == val){
										data[8].supportLevelType.push(supportLevelData);
										data[8].supportLevelList[supportLevelData.supportLevelID] = supportLevelData.supportLevelLabel;
										if(supportLevelData.supportLevelID == data[12]){
											data[8].selectedSupportLevel = supportLevelData.supportLevelID;
										}									
									}
								});
								
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

						data[8].dataExist = true;

						var supportTierInfo = {};

						if(data[2][data[8].selectedType.paymentTypeID] != undefined && data[2][data[8].selectedType.paymentTypeID] != null){
							data[8].earlierSelectedQty = parseInt(data[2][data[8].selectedType.paymentTypeID]);
						}
						else{
							data[8].earlierSelectedQty = 0;
						}
						

						//Promotion Check
						var selectedPaymentType = $scope.addOnData.core.horizon?data[6][data[8].supportLevelList[data[8].selectedSupportLevel]][data[8].selectedType.paymentTypeVal]:data[6][data[8].selectedType.paymentTypeVal];
						if(data[8].selectedType.paymentTypeID == "0"){
							data[8].selectedCost = 0;
							data[8].selectedQty = parseInt(data[2]);
							var promotionSKU = [];
							data[8].selectedAddonSKU = [];
							var qtyArray = [];
							angular.forEach(selectedPaymentType, function(val, key){
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
							if(selectedPaymentType != null && selectedPaymentType != undefined){
								if (data[8].earlierSelectedQty > 0){
									var qtyArray = [];
									//var earlierSelectedCost = 0;
									angular.forEach(selectedPaymentType, function(val, key){
										qtyArray = key.split("_");
										//console.log(qtyArray[0] + " " + qtyArray[1]);
										if(data[8].earlierSelectedQty >= qtyArray[0] && data[8].earlierSelectedQty <= qtyArray[1]){
											if(data[7][4] != undefined && data[7][4] != null){
												supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
												data[8].selectedCost = changeNumber(val["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][key]["0"]);	
											}
											else{
												data[8].selectedCost = changeNumber(val["0"]);	
											}
										}
									});
									data[8].extendedCost = data[8].selectedCost * parseInt(data[8].earlierSelectedQty);
								}else{
									var qtyDefaultIndex = Object.keys(selectedPaymentType)[0];
									
									// Calculating default cost for qty 1 and checking if support tier is there for service 
									if(data[7][4] != undefined && data[7][4] != null){
										supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
										data[8].selectedCost = changeNumber(selectedPaymentType[qtyDefaultIndex]["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
									}
									else{
										data[8].selectedCost = changeNumber(selectedPaymentType[qtyDefaultIndex]["0"]);	
									}
									data[8].extendedCost = 0;
								}

								var strDiscounttext = newServiceFactory.tierDiscount(selectedPaymentType, supportTierInfo, data[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], data[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
								data[8].discountText = strDiscounttext;

							}
							else{
								data[8].dataExist = false;
							}
						}

						//data[8].extendedCost = data[8].selectedCost;
						data[8].proratedExtendedCost = 0;

						data[8].billingTermText = "";
						//Cost Calculation for Monthly Billing Term 
						//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
						if(data[8].selectedType.paymentTypeID == "2"){
							//addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[3])/30);
							addOnRemainingCost = (data[8].extendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));
							
							if($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays != $scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays){
								addOnRemainingCost = addOnRemainingCost + roundDecimalToCurrency(data[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays));
								data[8].billingTermText = $scope.addOnData.core.remainingTerm[4].remainingMonthlyDays + " " + $scope.globalVars.days; 
							}
							else{
								//if(parseInt($scope.addOnData.core.remainingTerm[3]) > 0){
								//	data[8].billingTermText = $scope.addOnData.core.remainingTerm[3] + " " + $scope.globalVars.days;
								//}
								//else{
									if($scope.addOnData.core.remainingTerm[2] > 0 && $scope.addOnData.core.remainingTerm[2] != null && $scope.addOnData.core.remainingTerm[2] != undefined){
										data[8].billingTermText = "1 " + $scope.globalVars.months;
									}
								//}	
							}							
						}

						//Cost Calculation for Annual Billing Term
						//(annualCost * (no of remaining days / 365) * quantity)
						if(data[8].selectedType.paymentTypeID == "3"){
							//addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/365);

							if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != undefined){
								data[8].billingTermText = $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] + " " + $scope.globalVars.months + " ";
							}
							
							if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != undefined){
								if(data[8].billingTermText != ""){
									data[8].billingTermText = data[8].billingTermText + $scope.globalVars.andText + " ";
								}
								data[8].billingTermText = data[8].billingTermText + $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] + " " + $scope.globalVars.days;
							}

							var proratedAnnualCost = roundDecimalToCurrency(data[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingAnnualDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentAnnualDays));
				
							var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
							addOnRemainingCost = data[8].extendedCost * numberOfYears;
							if(parseInt($scope.addOnData.core.remainingTerm[2])%12 > 0){
								addOnRemainingCost = addOnRemainingCost + proratedAnnualCost; 
							}
						}

						//Cost Calculation for Prepaid Billing Term
						//numberOfDays = 365 * (commitmentTerm / 12)
			            //daysCost = noOfRemainingDays / numberOfDays;
			            //PrepaidCost = prepaid cost * daysCost * quantity
			            //Considering commitmentTerm as 12 for now
						if(data[8].selectedType.paymentTypeID == "1"){
							//var commitmentTerm = parseInt($scope.addOnData.core.prepaidTerm);
							//if(parseInt($scope.addOnData.core.remainingTerm[2]) >= 12){
								//var numberOfDays = 365 * (commitmentTerm / 12);
							/*}
							else{
								var numberOfDays = 30 * commitmentTerm ;
							}*/
							//var daysCost = parseInt($scope.addOnData.core.remainingTerm[0]) / numberOfDays;
							//addOnRemainingCost = data[8].extendedCost * daysCost;
							addOnRemainingCost = roundDecimalToCurrency(data[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingPrepaidDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentPrepaidDays));
							//addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/(365 * (12/12)));
							data[8].billingTermText = $scope.addOnData.core.remainingTermText;
						}

						//Cost Calculation for One Time Billing Term
						if(data[8].selectedType.paymentTypeID == "4"){
							addOnRemainingCost = data[8].extendedCost;
							data[8].billingTermText = $scope.globalVars.NAtext;
						}

						data[8].addOnRemainingCost = addOnRemainingCost;
					});
				});
					
			}
			$scope.addOnData.ttlMonthlyRecurringCost = 0;
			$scope.addOnData.ttltermMonthlyCost = 0;
			$scope.addOnData.ttlPrepaidCost = 0;
			$scope.addOnData.ttlYearlyCost = 0;
			$scope.addOnData.ttlOneTimeCost = 0;
			
		//});
	}

	if(Object.keys(newServiceFactory.addOnObj).length > 0){
			$scope.addOnFlag=1;
			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;
				$scope.showAddOnPage = true;
				//$scope.validSelectedData = true;
				$scope.disableButtonForNoAddonSelected();	
			}
	}else{
		if(newServiceFactory.isDashboardFlow == true)
			$scope.displayAddOnData($scope.successServiceObj);	//Comment for local copy
	}

	$scope.ttlMonthlyCost = $scope.addOnData.ttlMonthlyRecurringCost;
	$scope.ttlPrepaidCost = $scope.addOnData.ttlPrepaidCost;
	$scope.ttlYearlyCost = $scope.addOnData.ttlYearlyCost;
	$scope.ttlOneTimeCost = $scope.addOnData.ttlOneTimeCost;

	$scope.changeSupportLevel = function(addOnKey, addOns){
		addOns[3] = addOns[13][addOns[8].selectedSupportLevel];
		addOns[4] = addOns[3][0];
		addOns[8].paymentType=[];
		angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

				angular.forEach(addOns[3], function(val){
						if(payTypeData.paymentTypeID == val){
							addOns[8].paymentType.push(payTypeData);
						}
				});
					
		});

		angular.forEach(addOns[8].paymentType, function(typeData){
			if(typeData.paymentTypeID == addOns[4]){
				addOns[8].selectedType = typeData;
				//console.log(typeData);
			}	
		});
		$scope.changeAddon(addOnKey, addOns);
	}

	$scope.checkQty = function(qty, addOns){
		var regex = /^\s*$/g;
		if(!angular.isNumber(qty)){
			if(qty.match(regex) != null)
				addOns[8].selectedQty = 0;
		}
	}
	
	//changeAddon will be triggered when the Qty & type will be changed 
	$scope.changeAddon = function(addOnKey, addOns){
		var selectdQty = addOns[8].selectedQty;
		var selectdType = addOns[8].selectedType;
		var selectdAddon = addOnKey;
		var selectdQtyCost = 0;
		var selectdAddonSKU = "";
		var addOnRemainingCost = 0;

		if(addOns[2][addOns[8].selectedType.paymentTypeID] != undefined && addOns[2][addOns[8].selectedType.paymentTypeID] != null){
			addOns[8].earlierSelectedQty = parseInt(addOns[2][addOns[8].selectedType.paymentTypeID]);
		}
		else{
			addOns[8].earlierSelectedQty = 0;
		}
		
		var earlierSelectedQty = addOns[8].earlierSelectedQty;
		var currentPaymentType;
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
			currentPaymentType = $scope.addOnData.core.horizon? addOns[6][addOns[8].supportLevelList[addOns[8].selectedSupportLevel]][addOns[8].selectedType.paymentTypeVal]:addOns[6][selectdType.paymentTypeVal];
			angular.forEach(currentPaymentType, function(val, key){
				qtyArray = key.split("_");
				if((selectdQty + earlierSelectedQty) >= qtyArray[0] && (selectdQty + earlierSelectedQty) <= qtyArray[1]){
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
						addOns[8].extendedCost = selectdQtyCost * parseInt(selectdQty);
						addOns[8].selectedCost = selectdQtyCost;
						//addOns[8].selectedAddonSKU = selectdAddonSKU;
						arraySKU.push(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][1]);
				}
			}
			addOns[8].selectedAddonSKU = arraySKU;
			
			//Checking if cost is not available
			if(addOns[8].noCost == "Y"){
				addOns[8].extendedCost = 0;
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
			currentPaymentType = $scope.addOnData.core.horizon? addOns[6][addOns[8].supportLevelList[addOns[8].selectedSupportLevel]][addOns[8].selectedType.paymentTypeVal]:addOns[6][addOns[8].selectedType.paymentTypeVal];
			if(currentPaymentType!= null && currentPaymentType != undefined){
				if (addOns[8].earlierSelectedQty > 0){
					var qtyArray = [];
					//var earlierSelectedCost = 0;
					angular.forEach(currentPaymentType, function(val, key){
						qtyArray = key.split("_");
						//console.log(qtyArray[0] + " " + qtyArray[1]);
						if(addOns[8].earlierSelectedQty >= qtyArray[0] && addOns[8].earlierSelectedQty <= qtyArray[1]){
							if(addOns[7][4] != undefined && addOns[7][4] != null){
								supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
								addOns[8].selectedCost = changeNumber(val["0"]) + changeNumber(addOns[7][6][addOns[8].selectedType.paymentTypeVal][key]["0"]);	
							}
							else{
								addOns[8].selectedCost = changeNumber(val["0"]);	
							}
						}
					});
				}else{
					var qtyDefaultIndex = Object.keys(currentPaymentType)[0];
					
					// Calculating default cost for qty 1 and checking if support tier is there for service 
					if(addOns[7][4] != undefined && addOns[7][4] != null){
						supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
						addOns[8].selectedCost = changeNumber(currentPaymentType[qtyDefaultIndex]["0"]) + changeNumber(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
					else{
						addOns[8].selectedCost = changeNumber(currentPaymentType[qtyDefaultIndex]["0"]);	
					}
				}

			}

			addOns[8].extendedCost = 0;
		}

		var strDiscounttext = newServiceFactory.tierDiscount(currentPaymentType, supportTierInfo, addOns[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], addOns[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
		addOns[8].discountText = strDiscounttext;
			
			
			//NOTE: addOns[8].extendedCost already having actualCost * quantity value

			addOns[8].billingTermText = "";
			//Cost Calculation for Monthly Billing Term 
			//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
			if(selectdType.paymentTypeID == "2"){
				addOnRemainingCost = (addOns[8].extendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));

				if($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays != $scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays){
					addOnRemainingCost = addOnRemainingCost + roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays));
					addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[4].remainingMonthlyDays + " " + $scope.globalVars.days; 
				}
				else{
					//if(parseInt($scope.addOnData.core.remainingTerm[3]) > 0){
					//	addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[3] + " " + $scope.globalVars.days;
					//}
					//else{
						if($scope.addOnData.core.remainingTerm[2] > 0 && $scope.addOnData.core.remainingTerm[2] != null && $scope.addOnData.core.remainingTerm[2] != undefined){
							addOns[8].billingTermText = "1 " + $scope.globalVars.months;
						}
					//}	
				}
				
				addOns[8].proratedExtendedCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays));
			}

			//Cost Calculation for Annual Billing Term
			//(annualCost * (no of remaining days / 365) * quantity)
			if(selectdType.paymentTypeID == "3"){
				//addOnRemainingCost = addOns[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/365);

				if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != undefined){
					addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] + " " + $scope.globalVars.months + " ";
				}
				
				if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != undefined){
					if(addOns[8].billingTermText != ""){
						addOns[8].billingTermText = addOns[8].billingTermText + $scope.globalVars.andText + " ";
					}
					addOns[8].billingTermText = addOns[8].billingTermText + $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] + " " + $scope.globalVars.days;
				}

				addOns[8].proratedExtendedCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingAnnualDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentAnnualDays));
				
				var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
				addOnRemainingCost = addOns[8].extendedCost * numberOfYears;
				
				if(parseInt($scope.addOnData.core.remainingTerm[2])%12 > 0){
					addOnRemainingCost = addOnRemainingCost + addOns[8].proratedExtendedCost;
				}
			}

			//Cost Calculation for Prepaid Billing Term
			//numberOfDays = 365 * (commitmentTerm / 12)
            //daysCost = noOfRemainingDays / numberOfDays;
            //PrepaidCost = prepaid cost * daysCost * quantity
            //Considering commitmentTerm as 12 for now
			if(selectdType.paymentTypeID == "1"){
				//var commitmentTerm = parseInt($scope.addOnData.core.prepaidTerm);
				//if(parseInt($scope.addOnData.core.remainingTerm[2]) >= 12){
				//	var numberOfDays = 365 * (commitmentTerm / 12);
				/*}
				else{
					var numberOfDays = 30 * commitmentTerm ;
				}*/
				//var daysCost = parseInt($scope.addOnData.core.remainingTerm[0]) / numberOfDays;
				//addOnRemainingCost = addOns[8].extendedCost * daysCost;
				//addOnRemainingCost = addOns[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/(365 * (12/12)));
				addOnRemainingCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingPrepaidDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentPrepaidDays));
				
				addOns[8].proratedExtendedCost = addOnRemainingCost;
				
				addOns[8].billingTermText = $scope.addOnData.core.remainingTermText;
			}

			//Cost Calculation for One Time Billing Term
			if(selectdType.paymentTypeID == "4"){
				addOnRemainingCost = addOns[8].extendedCost;
				addOns[8].proratedExtendedCost = addOnRemainingCost;
				addOns[8].billingTermText = $scope.globalVars.NAtext;
			}


			addOns[8].addOnRemainingCost = addOnRemainingCost;

			$scope.addOnFinalCalculation();
			$scope.calculations($scope.addOnData);
			
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
		$scope.addOnTotalRecurringArray = [];
		$scope.addOnTotalRecurringRemainingCost = 0;

		angular.forEach($scope.ref_addOnObj.addons, function(addonData){
			angular.forEach(addonData, function(data){	
				
				if(data[8].selectedQty > 0){
					$scope.addOnCount++;
					if(data[8].selectedType.paymentTypeID=="2"){
						if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
							$scope.recurringVal+=roundDecimalToCurrency(data[8].extendedCost * ($scope.ref_addOnObj.core.remainingTerm[4].remainingMonthlyDays/$scope.ref_addOnObj.core.remainingTerm[4].ttlCurrentMonthlyDays));
						}else{
							$scope.recurringVal+=parseFloat(data[8].extendedCost);
						}
						$scope.recurringCount++;
						$scope.addOnRecurring+=parseFloat(data[8].extendedCost);
						$scope.addOnTotalRecurringArray.push(parseFloat(data[8].addOnRemainingCost));
						$scope.addOnTotalRecurringRemainingCost+= parseFloat(data[8].addOnRemainingCost);
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
							$scope.annualCount++;
						}
						if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
							var remainingMonths=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
							$scope.annualCount++;
							
						}
						$scope.annualAddonRecuuring += (parseFloat(data[8].selectedCost) * data[8].selectedQty);
						$scope.annualVal += data[8].proratedExtendedCost;
					}

					$scope.totalAddonCost += data[8].addOnRemainingCost; 
				}
				
			});	
			
		});


		//service value adding based on payment type
		//monthly
		if($scope.ref_addOnObj.core.defaultPaymentType=="2"){
			//due now calculation

			$scope.coreServiceCostMonthly = parseFloat($scope.ref_addOnObj.core.coreMonthlyCost);
			
			if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=($scope.coreServiceCostMonthly/30) * $scope.ref_addOnObj.core.remainingTerm[3];
			}else{
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostMonthly;
			}
			// due now calculation ends
			
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost + $scope.coreServiceCostMonthly);
			//recurring monthly calculations ends
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			$scope.fullTermServiceCost = 0;

			$scope.totalFinalAddonCost = $scope.totalAddonCost;

		}
		
		//Prepaid
		if($scope.ref_addOnObj.core.defaultPaymentType=="1"){
			//due now calculation
			$scope.serviceCostDue = 0;
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost);
			// due now calculation ends
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			
			$scope.fullTermServiceCost = 0;

			$scope.totalFinalAddonCost = $scope.totalAddonCost;

		}
		
		
		//Annually
		if($scope.ref_addOnObj.core.defaultPaymentType=="3"){
			$scope.coreServiceCostAnnually = parseFloat($scope.ref_addOnObj.core.coreAnnualCost);
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) == 0){
				//due cost calculations
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostAnnually;
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
			//due cost calculations
				$scope.serviceCostDue=0;
				var months=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
				$scope.serviceCostDue=($scope.coreServiceCostAnnually / 12) * months;
				
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost);
			//recurring monthly calculations ends
			
			$scope.fullTermServiceCost=0;

			$scope.totalFinalAddonCost = $scope.totalAddonCost;

		}

		$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal);
		
	}

	if($scope.addOnData.core != null & $scope.addOnData.core != undefined){
		$scope.calculations($scope.addOnData);	
	}

	$scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    }

	$scope.gotoConfigure = function(){
		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		$state.go('addOnService.selectService');
	}

	$scope.gotoPrevious = function(){

		//if(newServiceFactory.getURLParam.length >= 1){
			//window.location = vcredit.globalVars.postBackUrlFromExtLink;
		//} else {
		//	angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		//	$state.go('addOnService.selectService');
		//}
		window.location = vcredit.globalVars.sidDetailsUrl + "&_VM_serviceInstanceId=" + $scope.addOnData.core.encodedServiceID;		
	}

	$scope.goToReview = function(){
		$scope.ajaxLoader = true;
		$scope.getReviewed = false;
		if(parseInt($scope.addOnData.core.fundInfo.isXaasFund) == 0 && parseInt($scope.addOnData.core.fundInfo.changeRequest) == 1 && $scope.addOnData.core.fundInfo.changeRequest != undefined && $scope.addOnData.core.fundInfo.changeRequest != null && ($scope.ttlMonthlyCost > 0 || $scope.ttlYearlyCost > 0)){
				$scope.CurrModal = $modal.open({
			      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/payment-method-change-modal.tpl.html',
				  scope : $scope,
				  windowClass: 'overlay-lg'
			    });	
		}else{
			$scope.DCFormCheck();
		}
		
		//newServiceFactory.addOnObj={};
		//angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		//$state.go('addOnService.reviewAndSubmit');
	}

	$scope.continuePaymentCheck = function(getReviewed){
		$scope.CurrModal.close();
		if(getReviewed){
			$scope.DCFormCheck();
		}else{
			return false;			
		}
	}

	$scope.DCFormCheck = function(){
		if($scope.addOnData.core.DCFlag == undefined || $scope.addOnData.core.DCFlag == null){
			$scope.addOnData.core.DCFlag = true;
		}
		//console.log($scope.addOnData);
		var DCForm = $scope.addOnData.core.isDCFormSubmitted;
		if((!DCForm || DCForm == "false") && $scope.addOnData.core.DCFlag){
			var DCModal = false;
			angular.forEach($scope.addOnData.addons, function(addonData){
				angular.forEach(addonData, function(val, key){
					//console.log(key);
					if(val[8].selectedQty > 0){
						if(val[10].length > 0){
							if(val[10][0] == "DIRECTCONNECT" || val[10][0] == "Direct Connect"){
								DCModal = true;							
							}
						}									
					}
				});
			});
			
			if(DCModal){
				$scope.addOnData.core.DCFlag = false;
				$scope.sltDirectConnect = 0;
				$scope.CurrModal = $modal.open({
			      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/direct-connect-confirmation-modal.tpl.html',
				  scope : $scope,
				  windowClass: 'overlay-lg'
			    });	
			}
			else{
				$scope.goToStep3();
			}

		}
		else{
			$scope.goToStep3();
		}

	}

	$scope.continueDirectConnectModal = function(rDirectOption){
		//console.log(rDirectOption);
		$scope.CurrModal.close();
		if(rDirectOption == "1"){
			var totalAddonQuantity = 0;
			angular.forEach($scope.addOnData.addons, function(addonData){
				angular.forEach(addonData, function(val, key){
					//console.log(key);
					if(val[8].selectedQty > 0){
						if(val[10].length > 0 && (val[10][0] == "DIRECTCONNECT" || val[10][0] == "Direct Connect")){
							
								val[8].selectedQty = 0;
								val[8].addOnRemainingCost = 0;
								val[8].extendedCost = 0;
								val[8].selectedAddonSKU = [];
								val[8].selectedCost = 0;
								val[8].proratedExtendedCost = 0;
								$scope.addOnFinalCalculation();
								if(val[6][val[8].selectedType.paymentTypeVal] != null && val[6][val[8].selectedType.paymentTypeVal] != undefined){
									if (val[8].earlierSelectedQty > 0){
										var qtyArray = [];
										//var earlierSelectedCost = 0;
										angular.forEach(val[6][val[8].selectedType.paymentTypeVal], function(value, key1){
											qtyArray = key1.split("_");
											//console.log(qtyArray[0] + " " + qtyArray[1]);
											if(val[8].earlierSelectedQty >= qtyArray[0] && val[8].earlierSelectedQty <= qtyArray[1]){
												if(val[7][4] != undefined && val[7][4] != null){
													val[8].selectedCost = changeNumber(value["0"]) + changeNumber(val[7][6][val[8].selectedType.paymentTypeVal][key1]["0"]);	
												}
												else{
													val[8].selectedCost = changeNumber(value["0"]);	
												}
											}
										});
										val[8].extendedCost = val[8].selectedCost;
									}else{
										var qtyDefaultIndex = Object.keys(val[6][val[8].selectedType.paymentTypeVal])[0];
										
										// Calculating default cost for qty 1 and checking if support tier is there for service 
										if(val[7][4] != undefined && val[7][4] != null){
											val[8].selectedCost = changeNumber(val[6][val[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(val[7][6][val[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
										}
										else{
											val[8].selectedCost = changeNumber(val[6][val[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
										}
										val[8].extendedCost = 0;
									}

								}				
							
						}									
					}
				});
			});
		}
		
		$scope.goToStep3();
	}

	$scope.addOnFinalCalculation = function(){
		//Calculating Total cost in terms of prepaid and monthy for selected Add-on Services
		var selectdTtlCostMnthly = 0;
		var selectdTtlCostPrPaid = 0;
		var selectdTtlCostOneTime = 0;
		var selectdTtlCostYearly = 0;
		var monthlyRecurringCost = 0;
		var haveSelectedQty = false;

		angular.forEach($scope.addOnData.addons, function(addonData){
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
						selectdTtlCostYearly = selectdTtlCostYearly + (parseFloat(val[8].selectedCost) * val[8].selectedQty);
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

		if(haveSelectedQty){
			$scope.validSelectedData = true;
		}else{
			$scope.validSelectedData = false;
		} 

		$scope.addOnData.ttlMonthlyRecurringCost = monthlyRecurringCost;
		$scope.addOnData.ttltermMonthlyCost = selectdTtlCostMnthly;
		$scope.addOnData.ttlPrepaidCost = selectdTtlCostPrPaid;
		$scope.addOnData.ttlYearlyCost = selectdTtlCostYearly;
		$scope.addOnData.ttlOneTimeCost = selectdTtlCostOneTime;
		
		$scope.ttlMonthlyCost = $scope.addOnData.ttlMonthlyRecurringCost;
		$scope.ttlPrepaidCost = $scope.addOnData.ttlPrepaidCost;
		$scope.ttlYearlyCost = $scope.addOnData.ttlYearlyCost;
		$scope.ttlOneTimeCost = $scope.addOnData.ttlOneTimeCost;

		$scope.disableButtonForNoAddonSelected();
	}

	$scope.displayInsufficientError = function(){
		$scope.$emit('displayTrueUpEvt',
			{
	  		'data' : $scope.globalVars,
	  		'fund' : $scope.addOnData.core.fundInfo.name,
	  		'balance' : $scope.addOnData.core.fundInfo.fundBalance,
	  		'currency' : $scope.addOnData.core.fundInfo.redemptionCurrencySymbol,
	  		'currencyLocale' : $scope.addOnData.core.fundInfo.redemptionCurrency,
	  		'class' : 'errorContainer'
  		});
		$scope.ajaxLoader = false;
		$scope.trueUpError=false;
	}

	$scope.goToStep3 = function(){
		vmf.msg.page("");
		var getBalance = $scope.addOnData.core.fundInfo.fundBalance.replace(',','');
		//var total_cost = parseFloat($scope.addOnData.core.cost) + parseFloat($scope.ttlMonthlyCost) + parseFloat($scope.ttlPrepaidCost) + parseFloat($scope.ttlYearlyCost) + parseFloat($scope.ttlOneTimeCost);
		var total_cost = $scope.dueCost;
		// Adding message flag...
		if (vcredit.globalVars.serviceCategory!="VSPP"){
			if(parseInt($scope.addOnData.core.fundInfo.isXaasFund) == 1 && $scope.addOnData.core.fundInfo.trueUp == 'N' && parseFloat(getBalance) < parseFloat(total_cost)){
					$scope.displayInsufficientError();
			  		return false;
			}	
		}else if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.addOnData.core.fundInfo.currentConsumption) + parseFloat($scope.dueCost)) > parseFloat($scope.addOnData.core.fundInfo.threshold)){
					if($scope.addOnData.core.partner != null && $scope.addOnData.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.addOnData.core.partner);
					}
					$scope.displayInsufficientError();
			  		return false;
			}
		}
		
		newServiceFactory.addOnObj={};
		angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		if($scope.validSelectedData){
			$scope.ajaxLoader = false;
			$state.go('addOnService.reviewAndSubmit');
		}
		
	}

	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));

		return number;
	}

	function roundDecimalToCurrency(a){
		if($scope.addOnData.core.fundInfo.redemptionCurrency == 'JPY'){
			return Math.round(a);
		}
		else{
			return Math.round(a*100) / 100;	
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


		if(newServiceFactory.isDashboardFlow)
			//$state.go('configurator');
			window.location = $scope.globalVars.dashboardURL;
		else 
			window.location = vcredit.globalVars.postBackUrlFromExtLink;
	}

	$scope.cancelFlow = function(callbackFn){
		if(parseInt($scope.addOnData.core.fundInfo.fundAccess) == 0 && $scope.isXaasFund){
			callbackFn();
		}else{
			$scope.displayConfirmModal();
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow");	
		}	
	}

	$scope.displayConfirmModal = function(){
		// var getModalData = {
  // 			'body' : $scope.globalVars.confirm_message,
  // 			'okText' : $scope.globalVars.confirm,
  // 			'cancelText' : $scope.globalVars.cancelBtn,
  // 			'okBtnAction':$scope.cancelConfirmWindow,
  // 			'cancelBtnAction':$scope.continueConfirmWindow
  // 		};
		// $scope.modalData = getModalData;
		// $scope.ConfirmModal = $modal.open({
	 //      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_confirm_tpl.html',
		//   scope : $scope,
		//   windowClass: 'confirm_window'
	 //    });
	    confirmDialog.confirm({
            header : '',
            msg : $scope.globalVars.confirm_message,
            btnYesText : $scope.globalVars.confirm,
            btnNoText : $scope.globalVars.cancelBtn,
            confirmIconType : 'confirm' //confirm/alert/info/''
        },{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
        .result.then(function(btn){
            $scope.cancelFn();
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

}])
.controller('addOnReviewCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	
	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow){
		window.location = $scope.globalVars.dashboardURL;
		return false;
	} else if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false){
		window.location = vcredit.globalVars.postBackUrlFromExtLink;
		return false;
		
	}
	
	if(newServiceFactory.isDashboardFlow == true){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : review-and-submit");
	}
	else{
		if(newServiceFactory.getParameterByName('origin') == "all-services" && newServiceFactory.getParameterByName('origin') != '' && newServiceFactory.getParameterByName('origin') != undefined){
			if(typeof riaLinkmy !="undefined") riaLinkmy("all-services : purchase-add-ons : review-and-submit");
		}else{
			if(typeof riaLinkmy !="undefined") riaLinkmy("service-details : purchase-add-ons : review-and-submit");
		}
	}
	$scope.globalVars = {};
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	$scope.serviceData = {};
	$scope.addOnData = {};
	$scope.editPhase=false;
	$scope.showCalc=false;
	$scope.validSelectedData = true;
	$scope.errorMsg=null;
	$scope.addOnPase=true;
	$scope.paymentTypeValue = null;
	$scope.addOnConf=false;
	$scope.ajaxLoader = false;
	$scope.isXaasFund = true;
	$scope.submitBtnText = $scope.globalVars.SubmitBtn;
	$scope.submitOrderNoXaasFund = true;
	$scope.TagName = newServiceFactory.successServiceObj.wrapper.addonRedemptionNotes;

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	if(!$.isEmptyObject(newServiceFactory.addOnObj)){
		if(newServiceFactory.addOnObj.core.submitFlag !== null && newServiceFactory.addOnObj.core.submitFlag !== undefined)
			$scope.submitOrderNoXaasFund = newServiceFactory.addOnObj.core.submitFlag;
	}

	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	if(newServiceFactory.getURLParam.length >= 0){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : review-orders");
	}

	angular.copy(newServiceFactory.serviceObj, $scope.serviceData);
	
	angular.forEach(newServiceFactory.addOnObj.addons, function(addonData){
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
	
	angular.copy(newServiceFactory.addOnObj, $scope.addOnData);

	if(!$.isEmptyObject($scope.addOnData))
		$scope.isXaasFund =  parseInt($scope.addOnData.core.fundInfo.isXaasFund);

	if(!$scope.isXaasFund){
		$scope.submitBtnText = $scope.globalVars.submitBtnTextNotXaas;
	}
	
	angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

		if(parseInt(payTypeData.paymentTypeID) == parseInt($scope.addOnData.core.defaultPaymentType)){
			//data[8].paymentType.push(payTypeData);
			$scope.paymentTypeValue = payTypeData.paymentTypeVal;
		}
		
	});

	$scope.ref_addOnObj=newServiceFactory.addOnObj;
	//console.log($scope.ref_addOnObj);
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
		//$scope.editPhase=true;
	}
	$scope.disableEdit=function($event){
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
	
	$scope.resetEdit=function(elem){
		$(elem).find(".labelForm").show();
		$(elem).find(".editForm").hide();
		$scope.editPhase=true;
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
	}
	
	$scope.changeSupportLevel = function( addOnKey, addOns,$index ){
	    var parElem = $("div."+addOns[8].uniqueClass)[0];
		$scope.resetEdit($(parElem).next("div")[0]);
		addOns[3] = addOns[13][addOns[8].selectedSupportLevel];
		addOns[4] = addOns[3][0];
		addOns[8].paymentType=[];
		angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

				angular.forEach(addOns[3], function(val){
						if(payTypeData.paymentTypeID == val){
							addOns[8].paymentType.push(payTypeData);
						}
				});
					
		});

		angular.forEach(addOns[8].paymentType, function(typeData){
			if(typeData.paymentTypeID == addOns[4]){
				addOns[8].selectedType = typeData;
				//console.log(typeData);
			}	
		});
		$scope.changeAddon(addOnKey, addOns);
	}

	$scope.checkQty = function(qty, addOns){
		if(!angular.isNumber(qty)){
			addOns[8].selectedQty = 0;
		}
	}
	
	//changeAddon will be triggered when the Qty & type will be changed 
	$scope.saveButtonDisable=false;
	$scope.changeAddon = function(addOnKey, addOns){
		var selectdQty = addOns[8].selectedQty;
		var selectdType = addOns[8].selectedType;
		var selectdAddon = addOnKey;
		var selectdQtyCost = 0;
		var selectdAddonSKU = "";
		var addOnRemainingCost = 0;

		if(addOns[2][addOns[8].selectedType.paymentTypeID] != undefined && addOns[2][addOns[8].selectedType.paymentTypeID] != null){
			addOns[8].earlierSelectedQty = parseInt(addOns[2][addOns[8].selectedType.paymentTypeID]);
		}else{
			addOns[8].earlierSelectedQty = 0;
		}
		
		var earlierSelectedQty = addOns[8].earlierSelectedQty;
		var currentPayment;
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
			currentPayment = $scope.addOnData.core.horizon? addOns[6][addOns[8].supportLevelList[addOns[8].selectedSupportLevel]][selectdType.paymentTypeVal]:addOns[6][selectdType.paymentTypeVal];
			angular.forEach(currentPayment, function(val, key){
				qtyArray = key.split("_");
				if((selectdQty + earlierSelectedQty) >= qtyArray[0] && (selectdQty + earlierSelectedQty) <= qtyArray[1]){
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
			currentPayment = $scope.addOnData.core.horizon? addOns[6][addOns[8].supportLevelList[addOns[8].selectedSupportLevel]][addOns[8].selectedType.paymentTypeVal]:addOns[6][addOns[8].selectedType.paymentTypeVal];
			if(currentPayment != null && currentPayment != undefined){
				if (addOns[8].earlierSelectedQty > 0){
					var qtyArray = [];
					//var earlierSelectedCost = 0;
					angular.forEach(currentPayment, function(val, key){
						qtyArray = key.split("_");
						//console.log(qtyArray[0] + " " + qtyArray[1]);
						if(addOns[8].earlierSelectedQty >= qtyArray[0] && addOns[8].earlierSelectedQty <= qtyArray[1]){
							if(addOns[7][4] != undefined && addOns[7][4] != null){
								supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
								addOns[8].selectedCost = parseFloat(val["0"]) + parseFloat(addOns[7][6][addOns[8].selectedType.paymentTypeVal][key]["0"]);	
							}
							else{
								addOns[8].selectedCost = parseFloat(val["0"]);	
							}
						}
					});
				}else{
					var qtyDefaultIndex = Object.keys(currentPayment)[0];
					
					// Calculating default cost for qty 1 and checking if support tier is there for service 
					if(addOns[7][4] != undefined && addOns[7][4] != null){
						supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
						addOns[8].selectedCost = parseFloat(currentPayment[qtyDefaultIndex]["0"]) + parseFloat(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
					else{
						addOns[8].selectedCost = parseFloat(currentPayment[qtyDefaultIndex]["0"]);	
					}
				}

			}

			addOns[8].extendedCost = 0;
		}

		var strDiscounttext = newServiceFactory.tierDiscount(currentPayment, supportTierInfo, addOns[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], addOns[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
		addOns[8].discountText = strDiscounttext;


			//NOTE: addOns[8].extendedCost already having actualCost * quantity value

			addOns[8].billingTermText = "";
			//Cost Calculation for Monthly Billing Term 
			//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
			if(selectdType.paymentTypeID == "2"){
				addOnRemainingCost = (roundDecimalToCurrency(addOns[8].extendedCost) * parseInt($scope.addOnData.core.remainingTerm[2]));
				
				if($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays != $scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays){
					addOnRemainingCost = addOnRemainingCost + roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays));
					addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[4].remainingMonthlyDays + " " + $scope.globalVars.days; 
				}
				else{
					//if(parseInt($scope.addOnData.core.remainingTerm[3]) > 0){
					//	addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[3] + " " + $scope.globalVars.days;
					//}
					//else{
						if($scope.addOnData.core.remainingTerm[2] > 0 && $scope.addOnData.core.remainingTerm[2] != null && $scope.addOnData.core.remainingTerm[2] != undefined){
							addOns[8].billingTermText = "1 " + $scope.globalVars.months;
						}
					//}	
				}

				addOns[8].proratedExtendedCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingMonthlyDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentMonthlyDays));
			}

			//Cost Calculation for Annual Billing Term
			//(annualCost * (no of remaining days / 365) * quantity)
			if(selectdType.paymentTypeID == "3"){
				//addOnRemainingCost = roundDecimalToCurrency(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[0])/365);

				if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] != undefined){
					addOns[8].billingTermText = $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[0] + " " + $scope.globalVars.months + " ";
				}
				
				if(parseInt($scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1]) > 0 && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != null && $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] != undefined){
					if(addOns[8].billingTermText != ""){
						addOns[8].billingTermText = addOns[8].billingTermText + $scope.globalVars.andText + " ";
					}
					addOns[8].billingTermText = addOns[8].billingTermText + $scope.addOnData.core.remainingTerm[5].annualRemainingTerm[1] + " " + $scope.globalVars.days;
				}

				addOns[8].proratedExtendedCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingAnnualDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentAnnualDays));

				var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
				addOnRemainingCost = roundDecimalToCurrency(addOns[8].extendedCost) * numberOfYears;
				if(parseInt($scope.addOnData.core.remainingTerm[2])%12 > 0){
					addOnRemainingCost = addOnRemainingCost + addOns[8].proratedExtendedCost; 
				}
			}

			//Cost Calculation for Prepaid Billing Term
			//numberOfDays = 365 * (commitmentTerm / 12)
            //daysCost = noOfRemainingDays / numberOfDays;
            //PrepaidCost = prepaid cost * daysCost * quantity
            //Considering commitmentTerm as 12 for now
			if(selectdType.paymentTypeID == "1"){
				//var commitmentTerm = parseInt($scope.addOnData.core.prepaidTerm);
				//if(parseInt($scope.addOnData.core.remainingTerm[2]) >= 12){
				//	var numberOfDays = 365 * (commitmentTerm / 12);
				/*}
				else{
					var numberOfDays = 30 * commitmentTerm ;
				}*/
				//var daysCost = parseInt($scope.addOnData.core.remainingTerm[0]) / numberOfDays;
				//addOnRemainingCost = parseInt(addOns[8].extendedCost) * daysCost;
				//addOnRemainingCost = parseInt(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[0])/(365 * (12/12)));
				addOnRemainingCost = roundDecimalToCurrency(addOns[8].extendedCost * ($scope.addOnData.core.remainingTerm[4].remainingPrepaidDays/$scope.addOnData.core.remainingTerm[4].ttlCurrentPrepaidDays));
				
				addOns[8].proratedExtendedCost = addOnRemainingCost;
				
				addOns[8].billingTermText = $scope.addOnData.core.remainingTermText;
			}

			//Cost Calculation for One Time Billing Term
			if(selectdType.paymentTypeID == "4"){
				addOnRemainingCost = roundDecimalToCurrency(addOns[8].extendedCost);
				addOns[8].proratedExtendedCost = addOnRemainingCost;
				addOns[8].billingTermText = $scope.globalVars.NAtext;
			}


			addOns[8].addOnRemainingCost = addOnRemainingCost;

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
						selectdTtlCostMnthly = selectdTtlCostMnthly + roundDecimalToCurrency(val[8].addOnRemainingCost);
						monthlyRecurringCost = monthlyRecurringCost + val[8].extendedCost; 
					}
					if(val[8].selectedType.paymentTypeID == "1"){
						selectdTtlCostPrPaid = selectdTtlCostPrPaid + roundDecimalToCurrency(val[8].addOnRemainingCost);
					}
					if(val[8].selectedType.paymentTypeID == "3"){
						//selectdTtlCostYearly = selectdTtlCostYearly + parseInt(val[8].addOnRemainingCost);
						selectdTtlCostYearly = selectdTtlCostYearly + (roundDecimalToCurrency(val[8].selectedCost) * val[8].selectedQty);
					}
					if(val[8].selectedType.paymentTypeID == "4"){
						selectdTtlCostOneTime = selectdTtlCostOneTime + roundDecimalToCurrency(val[8].addOnRemainingCost);
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
	
	$scope.removeAddon = function(addOnKey, addOns){
		vmf.msg.confirm($scope.globalVars.removeAddonText, $scope.globalVars.removeAddonHeaderText, $scope.globalVars.buttonLabelYes, $scope.globalVars.buttonLabelNo, function(){
				$scope.$apply(function(){
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
							if(data[8].selectedQty > 0 && data[8].selectedType.paymentTypeID != "0"){
								noAddOnSelected = true;
							}
						});
						if(mainAddon == true){
							addonData.selectedNode = true;
						}
						else{
							addonData.selectedNode = false;
						}
					});

					if(!noAddOnSelected){
						$scope.back();
					}

				});
				
				
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
	$scope.getCheckedXaas = { boolValue : false };
	$scope.getChecked = { boolValue : false };
	
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
		$scope.addOnTotalRecurringArray = [];
		$scope.addOnTotalRecurringRemainingCost = 0;

		$scope.addOnFlag = 0;
		if(($scope.ref_addOnObj.addons != null && $scope.ref_addOnObj.addons != undefined) && Object.keys($scope.ref_addOnObj.addons).length > 0){
			$scope.addOnFlag = 1;
		}

		angular.forEach($scope.ref_addOnObj.addons, function(addonData){
			angular.forEach(addonData, function(data){	
				
				if(data[8].selectedQty > 0){
					$scope.addOnCount++;
					if(data[8].selectedType.paymentTypeID=="2"){
						if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
							//$scope.recurringVal+=((parseFloat(data[8].extendedCost))/30)*parseFloat($scope.ref_addOnObj.core.remainingTerm[3]);
							$scope.recurringVal+=roundDecimalToCurrency(data[8].extendedCost * ($scope.ref_addOnObj.core.remainingTerm[4].remainingMonthlyDays/$scope.ref_addOnObj.core.remainingTerm[4].ttlCurrentMonthlyDays));
							
							
						}else{
							$scope.recurringVal+=parseFloat(data[8].extendedCost);
						}
						$scope.recurringCount++;
						$scope.addOnRecurring+=parseFloat(data[8].extendedCost);
						$scope.addOnTotalRecurringArray.push(parseFloat(data[8].addOnRemainingCost));
						$scope.addOnTotalRecurringRemainingCost+= parseFloat(data[8].addOnRemainingCost);
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
							//$scope.annualAddonRecuuring+=data[8].addOnRemainingCost;
							//$scope.annualVal+=data[8].addOnRemainingCost;
							$scope.annualCount++;
						}
						if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
							//$scope.annualAddonRecuuring+=data[8].addOnRemainingCost;
							var remainingMonths=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
							//$scope.annualVal+=(data[8].addOnRemainingCost/12) * remainingMonths;
							$scope.annualCount++;
							
						}
						$scope.annualAddonRecuuring += (parseFloat(data[8].selectedCost) * data[8].selectedQty);
						$scope.annualVal += data[8].proratedExtendedCost;
						//$scope.addOnRecurring+=parseFloat(data[8].extendedCost);
					}

					$scope.totalAddonCost += data[8].addOnRemainingCost; 
					//$scope.totalCost+=data[8].addOnRemainingCost;
				}
				
			});	
			
		});


		//service value adding based on payment type
		//monthly
		if($scope.ref_addOnObj.core.defaultPaymentType=="2"){
			//due now calculation

			$scope.coreServiceCostMonthly = parseFloat($scope.ref_addOnObj.core.coreMonthlyCost);
			
			if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=($scope.coreServiceCostMonthly/30) * $scope.ref_addOnObj.core.remainingTerm[3];
			}else{
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostMonthly;
			}
			// due now calculation ends
			
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost + $scope.coreServiceCostMonthly);
			//recurring monthly calculations ends
			
			//total cost calculations
			//$scope.totalCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreTtlAnnualCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreTtlMonthlyCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			//$scope.fullTermServiceCost = $scope.coreServiceCostMonthly * $scope.ref_addOnObj.core.remainingTerm[2];
			$scope.fullTermServiceCost = 0;

			//$scope.totalFinalAddonCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreAnnualAddonCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreMonthlyAddonCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalFinalAddonCost = $scope.totalAddonCost;

			//$scope.serviceCost = $scope.serviceCostDue;
		}
		
		//Prepaid
		if($scope.ref_addOnObj.core.defaultPaymentType=="1"){
			//due now calculation
			$scope.serviceCostDue = 0;
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost);
			// due now calculation ends
			
			//total cost calculations
			//$scope.totalCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreTtlAnnualCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreTtlMonthlyCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			
			$scope.fullTermServiceCost = 0;

			//$scope.totalFinalAddonCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreAnnualAddonCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreMonthlyAddonCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalFinalAddonCost = $scope.totalAddonCost;

		}
		
		
		//Annually
		if($scope.ref_addOnObj.core.defaultPaymentType=="3"){
			$scope.coreServiceCostAnnually = parseFloat($scope.ref_addOnObj.core.coreAnnualCost);
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) == 0){
				//due cost calculations
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostAnnually;
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) > 0){
			//due cost calculations
				$scope.serviceCostDue=0;
				var months=$scope.ref_addOnObj.core.remainingTerm[2] % 12;
				$scope.serviceCostDue=($scope.coreServiceCostAnnually / 12) * months;
				
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			//total cost calculations
			//$scope.totalCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreTtlAnnualCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreTtlMonthlyCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalCost = $scope.totalAddonCost;
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.ref_addOnObj.core.coreMonthlyAddonCost);
			//recurring monthly calculations ends
			
			//$scope.fullTermServiceCost=($scope.coreServiceCostAnnually / 12) * $scope.ref_addOnObj.core.remainingTerm[2];
			$scope.fullTermServiceCost=0;

			//$scope.totalFinalAddonCost = $scope.totalAddonCost + (($scope.ref_addOnObj.core.coreAnnualAddonCost / 12) * $scope.ref_addOnObj.core.remainingTerm[2]) + ($scope.ref_addOnObj.core.coreMonthlyAddonCost * $scope.ref_addOnObj.core.remainingTerm[2]);
			$scope.totalFinalAddonCost = $scope.totalAddonCost;

		}

		$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal);
		
	}
	//calculation ended

	if($scope.ref_addOnObj.core != null & $scope.ref_addOnObj.core != undefined){
		$scope.calculations($scope.ref_addOnObj);	
	}
	
	//submit button click
	var step3SubmitOrderUrl = $scope.globalVars.step3AddonSubmitUrl;
	//var step3SubmitOrderUrl = "https://www-dev15.vmware.com/admin/updateFundDetails.portal";
	
	$scope.postObj = null;	

	$scope.submitOrder=function($event){
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}
		var totalCapacity = 0;
		var slctdAddonCapacity = 0;
		var slctdDrctCnnctCapacity = 0;
		var directConnectFlow = false;
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0){
					if(data[10].length > 0){
						
						if(data[10][0] == "DIRECTCONNECT" || data[10][0] == "Direct Connect"){
							slctdDrctCnnctCapacity += data[8].selectedQty;
						}
						else{
							slctdAddonCapacity += data[8].selectedQty;
						}
						
						directConnectFlow = true;
					}
				}
			});	
		});
		
		if($scope.ref_addOnObj.core.tenantType == "VPC"){
			totalCapacity = slctdDrctCnnctCapacity;
		}
		if($scope.ref_addOnObj.core.tenantType == "DC"){
			totalCapacity = slctdDrctCnnctCapacity - slctdAddonCapacity;
		}

		var directConnectAvailableQuotaURL = $scope.globalVars.directConnectAvailableQuota;
		
		if(directConnectFlow){
			$scope.ajaxLoader = true;
			newServiceFactory.postServices(
				function(successData){
					if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

					  	// Display modal if error

					  	$scope.$apply(function(){

					  		/*$scope.displayInfoModal({
						  		'header' : vcredit.globalVars.ajax_error_header,
						  		'body' : successData.ERROR_MESSAGE,
						  		'okText' : vcredit.globalVars.modal_ok,
						  		'cancelText' : vcredit.globalVars.modal_cancel,
						  		'showOk' : true,
						  		'showCancel':false
						  	});*/

						  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
							$scope.ajaxLoader = false;
						  	$scope.getChecked.boolValue = false;
						  	$scope.getCheckedXaas.boolValue = false;

					  	});

					  	

					  } else {
					  	vmf.msg.page("");
					  	if(totalCapacity > parseInt(successData.availableQuota)){
					  		$scope.displayInfoModal({
						  		'header' : vcredit.globalVars.directConnectAlertHeader,
						  		'body' : vcredit.globalVars.directConnectAlertBody,
						  		'okText' : vcredit.globalVars.modal_ok,
						  		'cancelText' : vcredit.globalVars.modal_cancel,
						  		'showOk' : true,
						  		'showCancel':false
						  	});
							$scope.ajaxLoader = false;
						  	$scope.getChecked.boolValue = false;
						  	$scope.getCheckedXaas.boolValue = false;
					  	}
					  	else{
					  		$scope.submitOrderComplete();
					  	}
					  }

				},function(errorData){
					/*$scope.displayInfoModal({
					  		'header' : vcredit.globalVars.ajax_error_header,
					  		'body' : vcredit.globalVars.ajax_error_body,
					  		'okText' : vcredit.globalVars.modal_ok,
					  		'cancelText' : vcredit.globalVars.modal_cancel,
					  		'showOk' : true,
					  		'showCancel':false
					  	});*/
					$scope.displayErrorAlert(vcredit.globalVars.ajax_error_body, "warning", true, false, true);
					$scope.ajaxLoader = false;
					$scope.getChecked.boolValue = false;
					$scope.getCheckedXaas.boolValue = false;
				},
				directConnectAvailableQuotaURL,    		// This comes from the jsp config object
				"_VM_serviceInstanceIdValue=" + $scope.ref_addOnObj.core.serviceID + '&_VM_tokenFlag=' + ((!$scope.globalVars.tokenFlag.length) ? " ": $scope.globalVars.tokenFlag)
				,'GET'
			);	
		}
		else{
			$scope.submitOrderComplete();
		}
		
	};
	
	$scope.displayInsufficientError = function(){
		$scope.$emit('displayTrueUpEvt',
			{
	  		'data' : vcredit.globalVars,
	  		'fund' : $scope.ref_addOnObj.core.fundInfo.name,
	  		'balance' : $scope.ref_addOnObj.core.fundInfo.fundBalance,
	  		'currency' : $scope.ref_addOnObj.core.fundInfo.redemptionCurrencySymbol,
	  		'currencyLocale' : $scope.ref_addOnObj.core.fundInfo.redemptionCurrency,
	  		'class' : 'errorContainer'
  		});
	}

	$scope.submitOrderComplete = function(){
		vmf.msg.page("");
		var total_cost = $scope.dueCost;

		var getBalance = $scope.ref_addOnObj.core.fundInfo.fundBalance.replace(',','');
		
		if (vcredit.globalVars.serviceCategory!="VSPP"){
			if(parseInt($scope.ref_addOnObj.core.fundInfo.isXaasFund) == 1 && $scope.ref_addOnObj.core.fundInfo.trueUp == 'N' && parseFloat(getBalance) < parseFloat(total_cost)){

					$scope.displayInsufficientError();

			  		return false;
			}
		}else if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.ref_addOnObj.core.fundInfo.currentConsumption) + parseFloat($scope.dueCost)) > parseFloat($scope.ref_addOnObj.core.fundInfo.threshold)){
					if($scope.ref_addOnObj.core.partner != null && $scope.ref_addOnObj.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.ref_addOnObj.core.partner);
					}
					$scope.displayInsufficientError();
			  		return false;
			}
		}
		

		$scope.postObj=[];
		
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0){
					$scope.fullObj={};
					var skuObj = "";
					angular.forEach(data[8].selectedAddonSKU,function(skuData){
						if(skuObj == ""){
							skuObj = skuData;
						}
						else{
							skuObj = skuObj + ", " + skuData;
						}
					});
					$scope.fullObj.sku=skuObj;
					//$scope.fullObj.sku=data[8].selectedAddonSKU;
					$scope.fullObj.quantity=data[8].selectedQty;
					$scope.fullObj.price=data[8].extendedCost;
					$scope.postObj.push($scope.fullObj);
				}
			});	
		});
		
		var tokenFlag = ((!$scope.globalVars.tokenFlag.length) ? " " : $scope.globalVars.tokenFlag);
		var submitPostData = 'addOnSelfServiceOrderString={"totalAmount":'+$scope.totalCost+', "tokenFlag":"'+tokenFlag +'", "serviceInstanceID":"'+ $scope.ref_addOnObj.core.serviceID +'", "skuDetailList":'+JSON.stringify($scope.postObj)+'}';
		//console.log(submitPostData);
		//enable after integration
		/*newServiceFactory.postServices(function(data){
			$scope.complete(data);
		},$scope.completeError,step3SubmitOrderUrl,submitPostData);*/
		$scope.ajaxLoader = true;
		newServiceFactory.postServices(
			function(successData){
				if(!$scope.isEmpty(successData.ERROR_MESSAGE)){

				  	// Display modal if error
				  	/*$scope.displayInfoModal({
				  		'header' : vcredit.globalVars.ajax_error_header,
				  		'body' : successData.ERROR_MESSAGE,
				  		'okText' : vcredit.globalVars.modal_ok,
				  		'cancelText' : vcredit.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});*/
					$scope.$apply(function(){
						$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, true);
						$scope.ajaxLoader = false;
					  	$scope.getChecked.boolValue = false;
					  	$scope.getCheckedXaas.boolValue = false;	
					});
				  	
				  } else {
				  	vmf.msg.page("");
				  	$scope.complete(successData);				  	
				  }

			},function(errorData){
				/*$scope.displayInfoModal({
				  		'header' : vcredit.globalVars.ajax_error_header,
				  		'body' : vcredit.globalVars.ajax_error_body,
				  		'okText' : vcredit.globalVars.modal_ok,
				  		'cancelText' : vcredit.globalVars.modal_cancel,
				  		'showOk' : true,
				  		'showCancel':false
				  	});*/
				$scope.displayErrorAlert(vcredit.globalVars.ajax_error_body, "warning", true, false, true);
				$scope.ajaxLoader = false;
				$scope.getChecked.boolValue = false;
				$scope.getCheckedXaas.boolValue = false;
			},
			step3SubmitOrderUrl,    		// This comes from the jsp config object
			submitPostData
			,'GET'
		);
		if($.trim(tokenFlag)){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : submit");
		}
		/*newServiceFactory.getServices(function(data){
			$scope.complete(data);
		},"vcredit/json/complete_success.json");*/
	};

	
	//submit success
	$scope.complete=function(jData){
		$scope.errorMsg=null;	
		if(jData.ERROR != undefined){
			$scope.errorMsg="Response error";
			//console.log($scope.errorMsg);
		}
		if(jData.requestNumber != undefined){
			//angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
			$scope.ajaxLoader = false;
			$state.go('addOnService.complete');
			newServiceFactory.completeObj={};
			angular.copy(jData, newServiceFactory.completeObj);
		}
	};
	//submit failed
	$scope.completeError=function(){
		$scope.errorMsg="Submit order service not working";
	};

	function roundDecimalToCurrency(a){
		if($scope.addOnData.core.fundInfo.redemptionCurrency == 'JPY'){
			return Math.round(a);
		}
		else{
			return Math.round(a*100) / 100;	
		}
		
	}

	$scope.back=function(){
		newServiceFactory.addOnObj = {};
		if($scope.editPhase){
			angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		}else{
			angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
		}
		$state.go('addOnService.configureAddons');
	};
	
	
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

	$scope.gotoPrevious = function(){

		//if(newServiceFactory.getURLParam.length >= 1){
			//window.location = vcredit.globalVars.postBackUrlFromExtLink;
		//} else {
		//	angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		//	$state.go('addOnService.selectService');
		//}
		window.location = vcredit.globalVars.sidDetailsUrl + "&_VM_serviceInstanceId=" + $scope.addOnData.core.encodedServiceID;		
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

		if(newServiceFactory.isDashboardFlow)
			//$state.go('configurator');
			window.location = vcredit.globalVars.dashboardURL;
		else 
			window.location = vcredit.globalVars.postBackUrlFromExtLink;

	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow");
	}

	$scope.displayConfirmModal = function(){
		// var getModalData = {
  // 			'body' : $scope.globalVars.confirm_message,
  // 			'okText' : $scope.globalVars.confirm,
  // 			'cancelText' : $scope.globalVars.cancelBtn,
  // 			'okBtnAction':$scope.cancelConfirmWindow,
  // 			'cancelBtnAction':$scope.continueConfirmWindow
  // 		};
		// $scope.modalData = getModalData;
		// $scope.ConfirmModal = $modal.open({
	 //      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_confirm_tpl.html',
		//   scope : $scope,
		//   windowClass: 'confirm_window'
	 //    });
	    confirmDialog.confirm({
            header : '',
            msg : $scope.globalVars.confirm_message,
            btnYesText : $scope.globalVars.confirm,
            btnNoText : $scope.globalVars.cancelBtn,
            confirmIconType : 'confirm' //confirm/alert/info/''
        },{/*size:'lg',keyboard: true,backdrop: false,*/windowClass: 'confirm-modal'})
        .result.then(function(btn){
            $scope.cancelFn();
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }
}])
.controller('addOnSuccessCtrl',['$scope','$state','newServiceFactory',
function($scope, $state, newServiceFactory){

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow){
		window.location = $scope.globalVars.dashboardURL;
		return false;
	} else if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false){
		window.location = vcredit.globalVars.postBackUrlFromExtLink;
		return false;
	}

	if(newServiceFactory.isDashboardFlow == true){
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-add-ons : complete-flow");
	}
	else{
		if(newServiceFactory.getParameterByName('origin') == "all-services" && newServiceFactory.getParameterByName('origin') != '' && newServiceFactory.getParameterByName('origin') != undefined){
			if(typeof riaLinkmy !="undefined") riaLinkmy("all-services : purchase-add-ons : complete-flow");
		}else{
			if(typeof riaLinkmy !="undefined") riaLinkmy("service-details : purchase-add-ons : complete-flow");
		}
	}

	$scope.globalVars = {};
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	$scope.isXaasFund = true;

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	if(newServiceFactory.addOnObj.core !== undefined){
		if(newServiceFactory.addOnObj.core.fundInfo.isXaasFund !== undefined)
			$scope.isXaasFund = parseInt(newServiceFactory.addOnObj.core.fundInfo.isXaasFund);
	}

	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	$scope.completeObjLocal={};
	angular.copy(newServiceFactory.completeObj,$scope.completeObjLocal);
	$scope.globalVars.hasSubmitted = $scope.globalVars.hasSubmitted.replace('{0}', $scope.completeObjLocal.resellerName);
	//$scope.ref_id=$scope.globalVars.referenceId.replace('{0}',$scope.completeObjLocal.requestNumber);
	$scope.ref_id=$scope.completeObjLocal.requestNumber;
	newServiceFactory.clearObjects();
}]);







