// Renewal Service

angular
//Creating module for promotion products
.module('renewService',['ui.bootstrap'])
.config(function ($stateProvider, $sceProvider) {

	$sceProvider.enabled(false);

	$stateProvider.state('renewService', {
		url: '/renewService',
		views: {
			'configurator-view': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/renewal/renewal.tpl.html',
				controller: 'renewalCtrl'
			}
		}	
	}).state('renewService.selectService', {
		url: '/selectService/:prodFamily',
		parent: 'renewService',
		views: {
			'renewServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/renewal/steps/selectService.tpl.html',
				controller: 'renewalSltServiceCtrl'
			}
		}	
	}).state('renewService.configureAddons', {
		url: '/configureAddons',
		parent: 'renewService',
		views: {
			'renewServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/renewal/steps/configureAddons.tpl.html',
				controller: 'renewalSltAddOnCtrl'
			}
		}	
	}).state('renewService.reviewAndSubmit', {
		url: '/reviewAndSubmit',
		parent: 'renewService',
		views: {
			'renewServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/renewal/steps/reviewAndSubmit.tpl.html',
				controller: 'renewalReviewCtrl'
			}
		}	
	}).state('renewService.complete', {
		url: '/complete',
		parent: 'renewService',
		views: {
			'renewServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/renewal/steps/complete.tpl.html',
				controller: 'renewalSuccessCtrl'
			}
		}	
	})
})
.controller('renewalCtrl',['$scope','$state','$modal', 'newServiceFactory', 'vmf', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, confirmDialog){

	$scope.showFundInfoSection = true;
	$scope.showProgressBar = true;
	$scope.isFundDefaultSelected = true;

	$scope.globalVars = {};
	
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	$scope.setHelpURL = function (getCurrState){
		if(getCurrState.name == "renewService.selectService"){
			$scope.helpURL = $scope.globalVars.ServiceRenewal1SelectanExistingService;
			//console.log("In renewal for review step 1:: " + getCurrState.name + "" +$scope.helpURL);
		}else{
			$scope.helpURL = $scope.globalVars.configurator_KBArticle_link;
			//console.log("In side renewal:: else case" + $scope.helpURL);
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
	//Collapse icon 
	$scope.colapse = function($index){	
		if($('.panel-collapse').eq($index).hasClass('in')){
			$('.openaccordion').eq($index).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
		}
		else {
			$('.openaccordion').eq($index).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
		}
	}
   //Collapse icon ends
	$scope.steps = [];
	angular.copy(newServiceFactory.stepsRenewal,$scope.steps);

	$scope.pageInit($state.current);

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
			    if(data.showProgressBar != "" && data.showProgressBar != null && data.showProgressBar != undefined){
			    	$scope.showProgressBar = data.showProgressBar;
			    }
			}
	);

	$scope.displayTrueUpModal = function(getModalData){
		$scope.trueUpmodalData = getModalData;
		$(".alertErrorMessageContainer").html("");
		vmf.msg.page($scope.trueUpmodalData.data.trueup_text1, "", "warning",".alertErrorMessageContainer");
		window.scrollTo(500,0);

		/*$scope.trueUpmodalData = getModalData;

		$scope.CurrModal = $modal.open({
		  templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_trueUp.tpl.html',
	      scope : $scope
	    });*/
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
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : change-fund");

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
					if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : change-fund : continue");

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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : change-fund : cancel");
	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}


}])
.controller('renewalSltServiceCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : select-existing-service");
	$scope.serviceData = {};
	$scope.globalVars = {};
	$scope.getToolTipData = null;
	$scope.htmlTooltip = null;	
	$scope.skuObj = {};
	newServiceFactory.isDashboardFlow = true;
	$scope.showSelectBtn = true;
	
	$scope.showLoader = true;
	$scope.showPage = false;

	angular.copy(newServiceFactory.globalVars,$scope.globalVars);
	
	//For Setting the HELP URL
	$scope.setHelpURL($state.current);


	$scope.getServiceUrl = $scope.globalVars.getServiceRenewalURL+"&_VM_prdFamilyDetails="+$state.params.prodFamily;

	$scope.pageInit = function(){

		if($.isEmptyObject(newServiceFactory.serviceObj) == true){
			newServiceFactory.postServices(function(data){

					$scope.$apply(function(){
							$scope.showLoader = false;
							if(!$scope.isEmpty(data.ERROR_MESSAGE) || !$scope.isEmpty(data.wrapper.error_message)){

							  	if(!$scope.isEmpty(data.ERROR_MESSAGE)){
									$scope.displayErrorAlert(data.ERROR_MESSAGE, "warning", true, true, false);
								}else{
									$scope.displayErrorAlert(data.wrapper.error_message, "warning", true, true, false);
								}
								
							  	$scope.showPage = false;

							} else {
								vmf.msg.page("");							
								$scope.showPage = true;
								$scope.displayServiceData(data.wrapper);
							}
					});						

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
				null,
				'GET'
			);

		} else {
			vmf.msg.page("");
			$scope.showPage = true;
			$scope.showLoader = false;
			$scope.displayServiceData(newServiceFactory.serviceObj);
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

	$scope.getSkuData = function(serviceID){

		if(!$scope.isEmpty($scope.skuObj[serviceID]))
			return;

		var getData = "_VM_serviceID="+serviceID;
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
			$scope.globalVars.selectServiceRenewalURL,    		// This comes from the jsp config object
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
		    				'Hdrbalance': (vcredit.globalVars.serviceCategory!="VSPP") ? $scope.serviceData.fundBalance : $scope.serviceData.fundInfo.fundBalance,
		    				'HdrCurrency': $scope.serviceData.fundInfo.redemptionCurrencySymbol,
		    				'HdrRedCurrency': $scope.serviceData.fundInfo.redemptionCurrency,
		    				'isXaasFund' : $scope.serviceData.isXaasFund,
							'trueUp' : $scope.serviceData.fundInfo.trueUp,
							'identifierName' : $scope.serviceData.fundInfo.identifierName
		    			});

		//});

	}

	$scope.selectService = function(id, getEvt){

		$(getEvt.currentTarget).siblings('.ajaxSpinner').removeClass('hide');
		//$(getEvt.currentTarget).addClass('hide'); keeping the disabling there.
		$scope.showSelectBtn = false;

		$scope.serviceData.selectedService = {};

		angular.copy($scope.serviceData.services[id], $scope.serviceData.selectedService);

		//$scope.goToAddOns();

		/*$scope.SubmitServiceData = "_VM_flow=addon&_VM_EA=" + $scope.serviceData.eaAccountNumber +
													"&_VM_CN=" + $scope.serviceData.customerNumber +
													"&_VM_SKU=" + $scope.currSku.data[0] +
													"&_VM_CURRENCY=" + $scope.serviceData.currency[1];*/

		$scope.submitSelectAddonServiceData = "_VM_serviceInstanceId=" + $scope.serviceData.services[id].encryptedID;

		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : existing-service-button");

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
			$scope.globalVars.submitAddonRenewalServiceURL,    		// This comes from the jsp config object
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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow");
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

	$scope.goToAddOns = function(){
		newServiceFactory.addOnObj = {};
		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		$state.go('renewService.configureAddons');
	}

	$scope.pageInit();
}])
.controller('renewalSltAddOnCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : modify-service-terms");
	$scope.serviceData = {};
	//$scope.addOnData = {};
	if(Object.keys(newServiceFactory.addOnObj).length > 0){
		$scope.addOnData=newServiceFactory.addOnObj;
	}else{
		$scope.addOnData = {};
	}
	
	//For Setting the HELP URL
	$scope.setHelpURL($state.current);


	$scope.currState = $state.current.name.split('.')[1];
	$scope.globalVars = {};
	$scope.addOnFlag = 0;
	$scope.validSelectedData = false;
	$scope.showLoader = true;
	$scope.successServiceObj = {};
	$scope.currSku = {};
	$scope.skuError = false;
	$scope.applySuccess = false;
	$scope.applyError = false;
	$scope.applyErrorMsg = '';
	$scope.btnInitDisabled = true;
	$scope.selectedTermObj;
	$scope.globalVars = newServiceFactory.globalVars;
	$scope.showAddOnPage = true;

	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	$scope.getURLParam = newServiceFactory.getURLParam;

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.getURLParam.length <= 0){
		$state.go('configurator');
	}

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false && newServiceFactory.getURLParam !== null && newServiceFactory.getURLParam !== ''){

			$scope.steps.splice(0,1);

			$scope.submitSelectAddonServiceData = "&_VM_serviceInstanceId="+ encodeURIComponent(newServiceFactory.getURLParam);
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
							  		angular.copy(successData, $scope.successServiceObj);
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
											'trueUp' : newServiceFactory.successServiceObj.wrapper.core.fundInfo.trueUp
						    			}
						    		);

							  	});							  	
							  }

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

						},
						$scope.globalVars.renewAddonConfigForExistingServiceUrl,    		// This comes from the jsp config object
						$scope.submitSelectAddonServiceData
						,'GET'
					);				

				//remove back button
				//apply postBackUrl to cancel
				//get HeaderDetails - FundInfo, Balance, Trueup etc
				//factory.IsDashboardFlow = false;
	}
	
	angular.copy(newServiceFactory.serviceObj, $scope.serviceData);

	if(newServiceFactory.globalVars !== $scope.globalVars)
		angular.copy(newServiceFactory.globalVars, $scope.globalVars);

	/*newServiceFactory.getServices(function(data){

		$scope.$apply(function(){
			$scope.displayAddOnData(data);
		});
		
	},$scope.globalVars.submitAddonRenewalServiceURL);*/

	angular.copy(newServiceFactory.successServiceObj, $scope.successServiceObj);

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.objectLength = function(obj){
		var count = 0;
		var i;

		for (i in obj) {
		    if (obj.hasOwnProperty(i)) {
		        count++;
		    }
		}

		return count;
	}

	$scope.changePayment = function(){

		$scope.addOnData.core.payTypeDisplay = [];

		angular.forEach($scope.addOnData.core.selectedServiceTypeObj.storage[0][$scope.addOnData.core.storageType[1]].terms, function(termVal, termKey){
				
				if(termVal[3] == 'Y'){
					angular.forEach(termVal[2], function(typeVal,typeKey){
						angular.forEach($scope.addOnData.paymentType, function(payTypeData, payTypekey){
							if(payTypeData.paymentTypeID == typeVal){
								$scope.addOnData.core.payTypeDisplay.push(payTypeData);
							}			
						});
					});
					$scope.addOnData.core.defaultPaymentType = termVal[2][0];

					angular.forEach($scope.addOnData.core.payTypeDisplay, function(typeData){
						if(typeData.paymentTypeID == $scope.addOnData.core.defaultPaymentType){
							$scope.addOnData.core.selectedPayType = typeData;
						}	
					});
					$scope.serviceConfig.currServiceTerm = termVal[1];
				}				
		});

		//console.log($scope.addOnData.core.defaultPaymentType);

		$scope.calcSku();

	}

	$scope.paymentTypeChange = function(){

		//console.log($scope.addOnData.core.selectedPayType.paymentTypeID);

		$scope.addOnData.core.defaultPaymentType = $scope.addOnData.core.selectedPayType.paymentTypeID;

		$scope.calcSku(); 
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

	// Modal Popup Ok button
	$scope.ok = function(){
		$scope.CurrModal.close();
	}

	// Modal Popup Cancel button
	$scope.cancel = function(){
		$scope.CurrModal.close();
	}

	$scope.applyServiceChange = function(){

		$scope.calcSku();
		$scope.showLoader = true;
		$scope.applySuccess = false;
		$scope.applyError = false;

		newServiceFactory.postServices(
			function(successData){
				if(!$scope.isEmpty(successData.ERROR_MESSAGE)){
					$scope.$apply(function(){
				  		// Display modal if error
				  		$scope.applyError = true;
				  		$scope.applyErrorMsg = successData.ERROR_MESSAGE;
				  	});

				  } else {
				  	$scope.$apply(function(){
				  		vmf.msg.page("");
				  		$scope.btnInitDisabled = true;
				  		$scope.applySuccess = true;
				  		//$scope.addOnData = {};			
						//newServiceFactory.addOnObj = {};
						if(successData.wrapper.core.fundInfo == null ||  successData.wrapper.core.fundInfo == undefined){
					  		newServiceFactory.getFundInfo(successData.wrapper.core);
					  		successData.wrapper.core.fundInfo = {};
							angular.copy(newServiceFactory.fundInfo, successData.wrapper.core.fundInfo);
					  	}
				  		$scope.displayAddOnData(successData);
				  	});				  					  	
				  }
				  if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : service-change : apply");

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
					$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
				})
			},
			$scope.globalVars.applyCoreRenewalServiceURL, 		// This comes from the jsp config object
			$scope.SubmitServiceData
			,'GET'
		);

	}

	$scope.revertServiceChange = function(){
		$scope.btnInitDisabled = true;
		$scope.newData = {};
		$scope.addOnData = {};
		$scope.newData.wrapper = newServiceFactory.addOnObj;
  		$scope.displayAddOnData($scope.newData);	
  		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : service-change : revert");
	}

	$scope.calcSku = function(){

			$scope.btnInitDisabled = false;
			$scope.applySuccess = false;
			$scope.applyError = false;

			angular.forEach($scope.addOnData.core.selectedServiceTypeObj.storage[0][$scope.addOnData.core.storageType[1]].terms, function(termVal, termKey){
				if(termVal[3] == 'Y'){
					$scope.selectedTermId = termVal[1];
				}
			});

			$scope.skuError = true;

			//console.log($scope.addOnData.core.selectedPayType.paymentTypeVal);

			if(!$scope.isEmpty($scope.addOnData.core.coreServiceSku)
			&& !$scope.isEmpty($scope.selectedTermId)
			&& !$scope.isEmpty($scope.addOnData.core.selectedPayType.paymentTypeVal)
			&& !$scope.isEmpty($scope.addOnData.core.storageType[1])){


				$scope.currSku.sku = $scope.addOnData.core.selectedServiceTypeObj.tenantType
										+'_'+$scope.selectedTermId
										+'_'+$scope.addOnData.core.selectedPayType.paymentTypeVal	
										+'_'+$scope.addOnData.core.storageType[1];

				$scope.currSku.data = $scope.addOnData.core.crossRefSKUMap[$scope.currSku.sku];



				if($scope.currSku.data == undefined || $scope.currSku.data == ''){
					$scope.skuError = true;
				} else {
					$scope.addOnData.core.cost = $scope.currSku.data[1];
					$scope.serviceData.skuData = $scope.currSku.data;
					$scope.skuError = false;

					 $scope.SubmitServiceData = "_VM_crossRefSku=" + $scope.currSku.data[0] +
					 							"&_VM_serviceInstanceId=" + $scope.addOnData.core.encodedServiceID +
					 							"&_VM_storage=" + $scope.addOnData.core.storageType[1] +
					 							"&_VM_cmTerm=" + $scope.selectedTermId +
					 							"&_VM_paymentType=" + $scope.addOnData.core.selectedPayType.paymentTypeVal;
				}

			}

			//console.log($scope.currSku.sku);
	}

	$scope.changeTerm = function(getTerm){

		angular.forEach($scope.addOnData.core.selectedServiceTypeObj.storage[0][$scope.addOnData.core.storageType[1]].terms, function(termVal, termKey){
			if(termVal[1] == getTerm){
				termVal[3] = "Y";
				$scope.selectedTermObj = termVal;
				$scope.addOnData.core.selectedTermObj = termVal;
			} else {
				termVal[3] = "N";
			}
		});

		$scope.changePayment();

	}


	$scope.changePartnerObj = function(){
		if (vcredit.globalVars.serviceCategory!="VSPP"){
			angular.forEach($scope.addOnData.core.offeringPartner[0], function(partnerData){
				if(partnerData.id == $scope.addOnData.core.offeringPartner[1]){
					$scope.addOnData.core.selectedPartnerObj = partnerData;
				}	
			});
	    }

	}

	$scope.setSelectedServiceObj = function(){

		angular.forEach( $scope.addOnData.core.coreServices, function(serviceVal, serviceKey){
			if(serviceVal.tenantType == $scope.addOnData.core.selectedServiceTypeId)
				$scope.addOnData.core.selectedServiceTypeObj = serviceVal;
		});

		$scope.changePayment();

	}

	$scope.getStorageName = function(obj){
		var firstKey = $scope.first(obj);
		return $scope.addOnData.core.selectedServiceTypeObj.storage[0][firstKey]['storageName'];
	}

	$scope.first = function(obj) {
	    for (var a in obj) return a;
	}

	$scope.displayAddOnData = function(getData){
		//console.log(getData);
		//$scope.$apply(function(){	
			$scope.addOnData = {};
			newServiceFactory.addOnObj = {};
			$scope.serviceConfig = {};
			//if(getData.wrapper !== $scope.addOnData)
				angular.copy(getData.wrapper, $scope.addOnData);

			//if(getData.wrapper !== newServiceFactory.addOnObj)	

				// Add an AddOnData value to store selected Storage Type

				angular.forEach($scope.addOnData.core.coreServices, function(val, key){
					if(val.defaultFlag == "Y"){
						$scope.addOnData.core.selectedServiceTypeObj = val;
						$scope.addOnData.core.selectedServiceTypeId = val.tenantType;
					}
				});								

				angular.copy($scope.addOnData, newServiceFactory.addOnObj);				

				// Payment Type Display

				$scope.addOnData.core.payTypeDisplay = [];

				angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){
					angular.forEach($scope.addOnData.core.paymentType, function(val){
						if(payTypeData.paymentTypeID == val){
							$scope.addOnData.core.payTypeDisplay.push(payTypeData);
						}
					});				
				});

				angular.forEach($scope.addOnData.core.payTypeDisplay, function(typeData){
					if(typeData.paymentTypeID == $scope.addOnData.core.defaultPaymentType){
						$scope.addOnData.core.selectedPayType = typeData;
						//console.log(typeData);
					}	
				});
				if (vcredit.globalVars.serviceCategory!="VSPP"){
				angular.forEach($scope.addOnData.core.offeringPartner[0], function(partnerData){
					if(partnerData.id == $scope.addOnData.core.offeringPartner[1]){
						$scope.addOnData.core.selectedPartnerObj = partnerData;
					}	
				});}

				if($scope.objectLength($scope.addOnData.core.storageType[0]) == 1){
					angular.forEach($scope.addOnData.core.storageType[0], function(strVal,strKey){
						$scope.selectedStorageVal = strVal;
						$scope.addOnData.core.storageType[1] = strKey;
					});
				}

				// Assign Storage if only 1 available

			if($scope.addOnData.core.selectedServiceTypeObj!=null && $scope.addOnData.core.selectedServiceTypeObj!='undefined'){
				if($scope.objectLength($scope.addOnData.core.selectedServiceTypeObj.storage[0]) == 1){
					angular.forEach($scope.addOnData.core.selectedServiceTypeObj.storage[0], function(val, key){
						$scope.addOnData.core.storageType[1] = key;
					})
				}

				angular.forEach($scope.addOnData.core.selectedServiceTypeObj.storage[0][$scope.addOnData.core.storageType[1]].terms, function(termVal, termKey){
						if(termVal[3] == 'Y'){
							$scope.serviceConfig.currServiceTerm = termVal[1];
							$scope.selectedTermObj = termVal;
							$scope.addOnData.core.selectedTermObj = termVal;
						}
				});
            }
				// Select the first term in all except default Selected Service Type

				angular.forEach($scope.addOnData.core.coreServices, function(coreVal){					
					if(coreVal.defaultFlag == "N"){
						angular.forEach(coreVal.storage[0], function(storageVal){
							angular.forEach(storageVal.terms, function(termVal,termKey){
								if(termKey == 0)
									termVal[3] = "Y";
								else 
									termVal[3] = "N";
							});
						});
					}
				});


			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;
				$scope.showAddOnPage = true;
			}

			$scope.remainingTerm = "";
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
			//console.log(Object.keys($scope.addOnData.addons).length);
			if(($scope.addOnData.addons != null && $scope.addOnData.addons != undefined) && Object.keys($scope.addOnData.addons).length > 0){
				
				$scope.addOnFlag = 1;
				
				var defaultPaymentType = $scope.addOnData.core.defaultPaymentType;
				//console.log($scope.addOnData.addons);
				var addOnRemainingCost = 0;
				var selectdQtyCost = 0;
				var selectdAddonSKU = "";
				angular.forEach($scope.addOnData.addons,function(aData){
					angular.forEach(aData,function(data){
						if ($.isEmptyObject(data[8])){
							data[8] = {};  // Selected Addon object
							data[8].selectedAddonSKU = '';
							data[8].extendedCost = 0;
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

						}
						//if(data[8].selectedQty == null || data[8].selectedQty == undefined){
						//	data[8].earlierSelectedQty = parseInt(data[2]);
						//	data[8].selectedQty = data[8].earlierSelectedQty;
						//}else{
						//	data[8].earlierSelectedQty = data[8].selectedQty;	
						//}
						
						
						if(data[8].selectedQty>0) data[8].selectedAddonSKU = [data[0]];
						
						

						//data[8].billingTypeLabel = $scope.globalVars["payment_type"+data[8].selectedType.paymentTypeID];

						data[8].selectedCost = 0;

						data[8].dataExist = true;

						var supportTierInfo = {};

						if(data[8].selectedQty == null || data[8].selectedQty == undefined){
							if(data[2][data[8].selectedType.paymentTypeID] != undefined && data[2][data[8].selectedType.paymentTypeID] != null){
								data[8].earlierSelectedQty = parseInt(data[2][data[8].selectedType.paymentTypeID]);
							}else{
								data[8].earlierSelectedQty = 0;
							}
							
							data[8].selectedQty = data[8].earlierSelectedQty;
							//console.log(data[8].earlierSelectedQty);
						}else{
							data[8].earlierSelectedQty = data[8].selectedQty;	
						}
						

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
												data[8].selectedAddonSKU.push(data[7][6][data[8].selectedType.paymentTypeVal][key][1]);	
											}
											else{
												data[8].selectedCost = changeNumber(val["0"]);
											}
											//data[8].selectedAddonSKU=[val[1]];
										}
									});

									data[8].extendedCost = data[8].selectedCost * parseInt(data[8].earlierSelectedQty);

								}else{
									var qtyDefaultIndex = Object.keys(data[6][data[8].selectedType.paymentTypeVal])[0];
									
									// Calculating default cost for qty 1 and checking if support tier is there for service 
									if(data[7][4] != undefined && data[7][4] != null){
										supportTierInfo = data[7][6][data[8].selectedType.paymentTypeVal];
										data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(data[7][6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
									}
									else{
										data[8].selectedCost = changeNumber(data[6][data[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
									}

									data[8].extendedCost = 0;
								}

								var strDiscounttext = newServiceFactory.tierDiscount(data[6][data[8].selectedType.paymentTypeVal], supportTierInfo, data[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], data[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
								data[8].discountText = strDiscounttext;

							}
							else{
								data[8].dataExist = false;
							}	
						}

						

						//data[8].extendedCost = data[8].selectedCost;


						//NOTE: addOns[8].extendedCost already having actualCost * quantity value

						var selectdType = data[8].selectedType;

						//Cost Calculation for Monthly Billing Term 
						//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
						if(selectdType.paymentTypeID == "2"){
							addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[3])/30);
							addOnRemainingCost = addOnRemainingCost + (data[8].extendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));
						}

						//Cost Calculation for Annual Billing Term
						//(annualCost * (no of remaining days / 365) * quantity)
						if(selectdType.paymentTypeID == "3"){
							var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
							addOnRemainingCost = data[8].extendedCost * numberOfYears;
							//addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/365);
						}

						//Cost Calculation for Prepaid Billing Term
						//numberOfDays = 365 * (commitmentTerm / 12)
			            //daysCost = noOfRemainingDays / numberOfDays;
			            //PrepaidCost = prepaid cost * daysCost * quantity
			            //Considering commitmentTerm as 12 for now
						if(selectdType.paymentTypeID == "1"){
							//var commitmentTerm = parseInt($scope.addOnData.core.prepaidTerm);
							//if(parseInt($scope.addOnData.core.remainingTerm[2]) >= 12){
								//var numberOfDays = 365 * (commitmentTerm / 12);
							/*}
							else{
								var numberOfDays = 30 * commitmentTerm ;
							}*/
							//var daysCost = parseInt($scope.addOnData.core.remainingTerm[0]) / numberOfDays;
							//addOnRemainingCost = data[8].extendedCost * daysCost;
							//addOnRemainingCost = data[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/(365 * (12/12)));
							addOnRemainingCost = data[8].extendedCost;
						}

						//Cost Calculation for One Time Billing Term
						if(selectdType.paymentTypeID == "4"){
							addOnRemainingCost = data[8].extendedCost;
						}


						data[8].addOnRemainingCost = addOnRemainingCost;

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

						$scope.addOnData.ttlMonthlyRecurringCost = monthlyRecurringCost;
						$scope.addOnData.ttltermMonthlyCost = selectdTtlCostMnthly;
						$scope.addOnData.ttlPrepaidCost = selectdTtlCostPrPaid;
						$scope.addOnData.ttlYearlyCost = selectdTtlCostYearly;
						$scope.addOnData.ttlOneTimeCost = selectdTtlCostOneTime;
						
						$scope.ttlMonthlyCost = $scope.addOnData.ttlMonthlyRecurringCost;
						$scope.ttlPrepaidCost = $scope.addOnData.ttlPrepaidCost;
						$scope.ttlOneTimeCost = $scope.addOnData.ttlOneTimeCost;
						$scope.ttlYearlyCost = $scope.addOnData.ttlYearlyCost;

					});
				});
					
			}
			else{
				$scope.addOnData.ttlMonthlyRecurringCost = 0;
				$scope.addOnData.ttltermMonthlyCost = 0;
				$scope.addOnData.ttlPrepaidCost = 0;
				$scope.addOnData.ttlYearlyCost = 0;
				$scope.addOnData.ttlOneTimeCost = 0;
			}
			
		//});
		//console.log($scope.addOnData);
	}

	if(Object.keys(newServiceFactory.addOnObj).length > 0){
			$scope.addOnFlag=1;
			if($scope.addOnData != null && $scope.addOnData != undefined){
				$scope.showLoader = false;
				$scope.showAddOnPage = true;
				$scope.validSelectedData = true;	
			}

			var wrapAddonData = {};
			wrapAddonData.wrapper = newServiceFactory.addOnObj;

			$scope.displayAddOnData(wrapAddonData);

	}else{
		if(newServiceFactory.isDashboardFlow == true)
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

		if(addOns[2][addOns[8].selectedType.paymentTypeID] != undefined && addOns[2][addOns[8].selectedType.paymentTypeID] != null){
			addOns[8].earlierSelectedQty = parseInt(addOns[2][addOns[8].selectedType.paymentTypeID]);
		}else{
			addOns[8].earlierSelectedQty = 0;
		}
		
		var earlierSelectedQty = addOns[8].earlierSelectedQty;
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
				if((selectdQty) >= qtyArray[0] && (selectdQty) <= qtyArray[1]){
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

			if(addOns[6][addOns[8].selectedType.paymentTypeVal] != null && addOns[6][addOns[8].selectedType.paymentTypeVal] != undefined){
				if (addOns[8].earlierSelectedQty > 0){
					var qtyArray = [];
					//var earlierSelectedCost = 0;
					angular.forEach(addOns[6][addOns[8].selectedType.paymentTypeVal], function(val, key){
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
					var qtyDefaultIndex = Object.keys(addOns[6][addOns[8].selectedType.paymentTypeVal])[0];
					
					// Calculating default cost for qty 1 and checking if support tier is there for service 
					if(addOns[7][4] != undefined && addOns[7][4] != null){
						supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
						addOns[8].selectedCost = changeNumber(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + changeNumber(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
					else{
						addOns[8].selectedCost = changeNumber(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
				}

			}

			addOns[8].extendedCost = 0;
		}

		var strDiscounttext = newServiceFactory.tierDiscount(addOns[6][addOns[8].selectedType.paymentTypeVal], supportTierInfo, addOns[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], addOns[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
		addOns[8].discountText = strDiscounttext;
			
			//NOTE: addOns[8].extendedCost already having actualCost * quantity value


			//Cost Calculation for Monthly Billing Term 
			//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
			if(selectdType.paymentTypeID == "2"){
				addOnRemainingCost = addOns[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[3])/30);
				addOnRemainingCost = addOnRemainingCost + (addOns[8].extendedCost * parseInt($scope.addOnData.core.remainingTerm[2]));
			}

			//Cost Calculation for Annual Billing Term
			//(annualCost * (no of remaining days / 365) * quantity)
			if(selectdType.paymentTypeID == "3"){
				var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
				addOnRemainingCost = addOns[8].extendedCost * numberOfYears;
				//addOnRemainingCost = addOns[8].extendedCost * (parseInt($scope.addOnData.core.remainingTerm[0])/365);
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
				addOnRemainingCost = addOns[8].extendedCost;
			}

			//Cost Calculation for One Time Billing Term
			if(selectdType.paymentTypeID == "4"){
				addOnRemainingCost = addOns[8].extendedCost;
			}


			addOns[8].addOnRemainingCost = addOnRemainingCost;

		//Calculating Total cost in terms of prepaid and monthy for selected Add-on Services
		var selectdTtlCostMnthly = 0;
		var selectdTtlCostPrPaid = 0;
		var selectdTtlCostOneTime = 0;
		var selectdTtlCostYearly = 0;
		var monthlyRecurringCost = 0;
		var haveSelectedQty = false;

		$scope.addOnData.addons[addOnKey][addOnIndex][8] = addOns[8];
		
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
						selectdTtlCostYearly = selectdTtlCostYearly + val[8].addOnRemainingCost;
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
		
		//console.log($scope.addOnData);
			
	}

	$scope.notSorted = function(obj){
        if (!obj) {
            return [];
        }
        return Object.keys(obj);
    }

	$scope.gotoConfigure = function(){
		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		$state.go('renewService.selectService');
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
		vmf.msg.page("");
		newServiceFactory.addOnObj={};
		angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		$scope.addonCost = parseFloat($scope.addOnData.core.cost) + parseFloat($scope.ttlMonthlyCost) + parseFloat($scope.ttlPrepaidCost) + parseFloat($scope.ttlYearlyCost) + parseFloat($scope.ttlOneTimeCost);
		/*var getBalance = $scope.addOnData.core.fundInfo.fundBalance.replace(',','');
		// Adding message flag...
		if(parseInt($scope.addOnData.core.fundInfo.isXaasFund) == 1 && $scope.addOnData.core.fundInfo.trueUp == 'N' && parseFloat(getBalance) < parseFloat($scope.addonCost)){
				$scope.$emit('displayTrueUpEvt',
	    			{
			  		'data' : $scope.globalVars,
			  		'fund' : $scope.addOnData.core.fundInfo.name,
			  		'balance' : $scope.addOnData.core.fundInfo.fundBalance,
			  		'currency' : $scope.addOnData.core.fundInfo.redemptionCurrencySymbol
		  		});
				$scope.ajaxLoader = false;
				
		  		return false;
		}*/
		if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.addOnData.core.fundInfo.currentConsumption) + parseFloat($scope.addonCost)) > parseFloat($scope.addOnData.core.fundInfo.threshold)){
					if($scope.addOnData.core.partner != null && $scope.addOnData.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.addOnData.core.partner);
					}
					$scope.$emit('displayTrueUpEvt',
	    			{
				  		'data' : $scope.globalVars,
				  		'fund' : $scope.addOnData.core.fundInfo.name,
				  		'balance' : $scope.addOnData.core.fundInfo.fundBalance,
				  		'currency' : $scope.addOnData.core.fundInfo.redemptionCurrencySymbol
			  		});
					//$scope.ajaxLoader = false;
			  		return false;
			}
		}
		$state.go('renewService.reviewAndSubmit');
	}

	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));

		return number;
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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow");
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

}])
.controller('renewalReviewCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', '$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){

	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow){
		window.location = $scope.globalVars.dashboardURL;
		return false;
	} else if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false){
		window.location = vcredit.globalVars.postBackUrlFromExtLink;
		return false;
		
	}
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : review-and-submit");
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
	$scope.displayRemove = true;
	angular.copy(newServiceFactory.serviceObj, $scope.serviceData);

	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	angular.forEach(newServiceFactory.addOnObj.addons, function(addonData){
		var mainAddon = false;
		angular.forEach(addonData,function(data){
			if(data[8].selectedQty > 0 && parseInt(data[8].addOnRemainingCost) > 0){	
				data[8].selected="selected";
				mainAddon = true;
			}else{
				data[8].selected="no";
			}
			if (isNaN(data[8].addOnRemainingCost)){
				data[8].addOnRemainingCost = 0;
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
	
	angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

		if(parseInt(payTypeData.paymentTypeID) == parseInt($scope.addOnData.core.defaultPaymentType)){
			//data[8].paymentType.push(payTypeData);
			$scope.paymentTypeValue = payTypeData.paymentTypeVal;
		}
		
	});

	$scope.redemptionNotesRenew = newServiceFactory.addOnObj.addonRedemptionNotes || '';

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
		}
		else{
			addOns[8].earlierSelectedQty = 0;
		}
		
		var earlierSelectedQty = addOns[8].earlierSelectedQty;
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
				if((selectdQty) >= qtyArray[0] && (selectdQty) <= qtyArray[1]){
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

			if(addOns[6][addOns[8].selectedType.paymentTypeVal] != null && addOns[6][addOns[8].selectedType.paymentTypeVal] != undefined){
				if (addOns[8].earlierSelectedQty > 0){
					var qtyArray = [];
					//var earlierSelectedCost = 0;
					angular.forEach(addOns[6][addOns[8].selectedType.paymentTypeVal], function(val, key){
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
					var qtyDefaultIndex = Object.keys(addOns[6][addOns[8].selectedType.paymentTypeVal])[0];
					
					// Calculating default cost for qty 1 and checking if support tier is there for service 
					if(addOns[7][4] != undefined && addOns[7][4] != null){
						supportTierInfo = addOns[7][6][addOns[8].selectedType.paymentTypeVal];
						addOns[8].selectedCost = parseFloat(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]) + parseFloat(addOns[7][6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
					else{
						addOns[8].selectedCost = parseFloat(addOns[6][addOns[8].selectedType.paymentTypeVal][qtyDefaultIndex]["0"]);	
					}
				}

			}

			addOns[8].extendedCost = 0;
		}

		var strDiscounttext = newServiceFactory.tierDiscount(addOns[6][addOns[8].selectedType.paymentTypeVal], supportTierInfo, addOns[8].billingTypeLabel, 0, $scope.addOnData.core.currency[0], addOns[8].selectedType.paymentTypeID, $scope.addOnData.core.fundInfo.redemptionCurrency);
		addOns[8].discountText = strDiscounttext;

			//NOTE: addOns[8].extendedCost already having actualCost * quantity value


			//Cost Calculation for Monthly Billing Term 
			//(monthlyCost * (no of days/30) * quantity) + (monthlyCost * (no of months/1) * quantity)
			if(selectdType.paymentTypeID == "2"){
				addOnRemainingCost = parseFloat(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[3])/30);
				addOnRemainingCost = addOnRemainingCost + (parseFloat(addOns[8].extendedCost) * parseInt($scope.addOnData.core.remainingTerm[2]));
			}

			//Cost Calculation for Annual Billing Term
			//(annualCost * (no of remaining days / 365) * quantity)
			if(selectdType.paymentTypeID == "3"){
				var numberOfYears = parseInt(parseInt($scope.addOnData.core.remainingTerm[2])/12);
				addOnRemainingCost = addOns[8].extendedCost * numberOfYears;
				//addOnRemainingCost = parseFloat(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[0])/365);
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
				addOnRemainingCost = parseFloat(addOns[8].extendedCost);
			}

			//Cost Calculation for One Time Billing Term
			if(selectdType.paymentTypeID == "4"){
				addOnRemainingCost = parseFloat(addOns[8].extendedCost);
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
						});
						if(mainAddon == true){
							addonData.selectedNode = true;
						}
						else{
							addonData.selectedNode = false;
						}
					});

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

					$scope.totalAddonCost += data[8].addOnRemainingCost; 
					//$scope.totalCost+=data[8].addOnRemainingCost;
				}
				
			});	
			
		});


		//service value adding based on payment type
		//monthly
		if($scope.ref_addOnObj.core.defaultPaymentType=="2"){
			//due now calculation

			$scope.coreServiceCostMonthly = parseFloat($scope.ref_addOnObj.core.cost);
			
			if($scope.ref_addOnObj.core.remainingTerm[3] > 0){
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=($scope.coreServiceCostMonthly/30) * $scope.ref_addOnObj.core.remainingTerm[3];
				$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
			}else{
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostMonthly;
				$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
			}
			// due now calculation ends

			
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring + $scope.coreServiceCostMonthly);
			//recurring monthly calculations ends
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + $scope.coreServiceCostMonthly * $scope.ref_addOnObj.core.remainingTerm[2];
			//total cost calculations ends
			$scope.fullTermServiceCost=$scope.coreServiceCostMonthly * $scope.ref_addOnObj.core.remainingTerm[2];

			
		}
		
		//Prepaid
		if($scope.ref_addOnObj.core.defaultPaymentType=="1"){
			//due now calculation
			$scope.serviceCostDue=parseFloat($scope.ref_addOnObj.core.cost);
			$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + parseFloat($scope.ref_addOnObj.core.cost));
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			// due now calculation ends
			
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + parseFloat($scope.ref_addOnObj.core.cost);
			//total cost calculations ends
			
			$scope.fullTermServiceCost=parseFloat($scope.ref_addOnObj.core.cost);
		}
		
		
		//Annually
		if($scope.ref_addOnObj.core.defaultPaymentType=="3"){
			$scope.coreServiceCostAnnually = parseFloat($scope.ref_addOnObj.core.cost);
			if(($scope.ref_addOnObj.core.remainingTerm[2] % 12) == 0){
				//due cost calculations
				$scope.serviceCostDue=0;
				$scope.serviceCostDue=$scope.coreServiceCostAnnually;
				$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);
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
				$scope.dueCost=parseFloat($scope.oneTimeVal + $scope.prepaidVal + $scope.recurringVal + $scope.annualVal + $scope.serviceCostDue);	
				//due cost calculation ends
				
				//recurring annual msrp calculations
				$scope.annualRecuuring = $scope.annualAddonRecuuring + $scope.coreServiceCostAnnually;
				//recurring annual msrp calculation ends
			}
			//total cost calculations
			$scope.totalCost = $scope.totalAddonCost + ($scope.coreServiceCostAnnually / 12) * $scope.ref_addOnObj.core.remainingTerm[2];
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			//recurring monthly calculations ends
			
			$scope.fullTermServiceCost=($scope.coreServiceCostAnnually / 12) * $scope.ref_addOnObj.core.remainingTerm[2];
		}
	}
	//calculation ended

	if($scope.ref_addOnObj.core != null & $scope.ref_addOnObj.core != undefined){
		$scope.calculations($scope.ref_addOnObj);	
	}		
	//submit button click
	var step3SubmitOrderUrl = $scope.globalVars.step3RenewalSubmitURL;
	//var step3SubmitOrderUrl = "https://www-dev15.vmware.com/admin/updateFundDetails.portal";
	
	$scope.postObj = null;
	$scope.submitOrder=function($event){
		vmf.msg.page("");
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}
		var total_cost = $scope.dueCost;

		/*var getBalance = $scope.ref_addOnObj.core.fundInfo.fundBalance.replace(',','');
		
		if(parseInt($scope.ref_addOnObj.core.fundInfo.isXaasFund) == 1 && $scope.ref_addOnObj.core.fundInfo.trueUp == 'N' && parseFloat(getBalance) < parseFloat(total_cost)){

				$scope.$emit('displayTrueUpEvt',
	    			{
			  		'data' : vcredit.globalVars,
			  		'fund' : $scope.ref_addOnObj.core.fundInfo.name,
			  		'balance' : $scope.ref_addOnObj.core.fundInfo.fundBalance,
			  		'currency' : $scope.ref_addOnObj.core.fundInfo.redemptionCurrencySymbol
		  		});

		  		return false;
		}*/

		if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.ref_addOnObj.core.fundInfo.currentConsumption) + parseFloat($scope.dueCost)) > parseFloat($scope.ref_addOnObj.core.fundInfo.threshold)){
					if($scope.ref_addOnObj.core.partner != null && $scope.ref_addOnObj.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.ref_addOnObj.core.partner);
					}
					$scope.$emit('displayTrueUpEvt',
	    			{
				  		'data' : $scope.globalVars,
				  		'fund' : $scope.ref_addOnObj.core.fundInfo.name,
				  		'balance' : $scope.ref_addOnObj.core.fundInfo.fundBalance,
				  		'currency' : $scope.ref_addOnObj.core.fundInfo.redemptionCurrencySymbol
			  		});
					//$scope.ajaxLoader = false;
			  		return false;
			}
		}

		$scope.postObj=[];
		
		$scope.coreSku={};
		$scope.coreSku.sku=$scope.ref_addOnObj.core.coreServiceSku;
		$scope.coreSku.quantity=1;
		$scope.coreSku.price=$scope.ref_addOnObj.core.cost;
		$scope.postObj.push($scope.coreSku);
		
		angular.forEach($scope.ref_addOnObj.addons,function(addonData){
			angular.forEach(addonData,function(data){
				if(data[8].selectedQty > 0 && parseInt(data[8].addOnRemainingCost) > 0){
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

		if($scope.redemptionNotesRenew == null || $scope.redemptionNotesRenew == undefined)
			$scope.redemptionNotesRenew = '';
		var redemptionNoteRenewValue = encodeURIComponent($scope.redemptionNotesRenew);
		if (vcredit.globalVars.serviceCategory!="VSPP"){
		var submitPostData = 'sdpSelfServiceOrderString={"partnerID":"'+$scope.ref_addOnObj.core.offeringPartner[1]+'", "_VM_crossRefSku":"'+ $scope.ref_addOnObj.core.coreServiceSku +'", "totalAmount":"'+$scope.totalCost+'", "serviceInstanceID":"'+ $scope.ref_addOnObj.core.serviceID + '","redemptionNotes":"'+redemptionNoteRenewValue+'", "skuDetailList":'+JSON.stringify($scope.postObj)+'}';
		}
		else{
			var submitPostData = 'sdpSelfServiceOrderString={"_VM_crossRefSku":"'+ $scope.ref_addOnObj.core.coreServiceSku +'", "totalAmount":"'+$scope.totalCost+'", "serviceInstanceID":"'+ $scope.ref_addOnObj.core.serviceID + '","redemptionNotes":"'+redemptionNoteRenewValue+'", "skuDetailList":'+JSON.stringify($scope.postObj)+'}';
		}
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
			},
			step3SubmitOrderUrl,    		// This comes from the jsp config object
			submitPostData
			,'GET'
		);
		/*newServiceFactory.getServices(function(data){
			$scope.complete(data);
		},"vcredit/json/complete_success.json");*/
		
	};
	
	//submit success
	$scope.complete=function(jData){
		$scope.errorMsg=null;	
		if(jData.ERROR != undefined){
			$scope.errorMsg="Response error";
		}
		if(jData.requestNumber != undefined){
			//angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
			$scope.ajaxLoader = false;
			$state.go('renewService.complete');
			newServiceFactory.completeObj={};
			angular.copy(jData, newServiceFactory.completeObj);
		}
	};
	//submit failed
	$scope.completeError=function(){
		$scope.errorMsg="Submit order service not working";
	};

	$scope.back=function(){
		newServiceFactory.addOnObj = {};
		if($scope.editPhase){
			angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		}else{
			angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
		}
		$state.go('renewService.configureAddons');
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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow");	
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }
}])
.controller('renewalSuccessCtrl',['$scope','$state','newServiceFactory',
function($scope, $state, newServiceFactory){
	
	if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow){
		window.location = $scope.globalVars.dashboardURL;
		return false;
	} else if($.isEmptyObject(newServiceFactory.serviceObj) && newServiceFactory.isDashboardFlow == false){
		window.location = vcredit.globalVars.postBackUrlFromExtLink;
		return false;
	}

	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : renew-subscription : complete-flow");
	$scope.globalVars = {};
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);
	
	$scope.completeObjLocal={};

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);


	newServiceFactory.getURLParam = newServiceFactory.getParameterByName('_VM_serviceID');

	angular.copy(newServiceFactory.completeObj,$scope.completeObjLocal);
	//$scope.ref_id=$scope.globalVars.referenceId.replace('{0}',$scope.completeObjLocal.requestNumber);
	$scope.ref_id=$scope.completeObjLocal.requestNumber;
	newServiceFactory.clearObjects();
}]);