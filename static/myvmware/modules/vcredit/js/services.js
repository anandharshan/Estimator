
// New Service
angular
//Creating module for new service
.module('newService',['ui.bootstrap'])
.config(function ($stateProvider, $sceProvider) {

	$sceProvider.enabled(false);

	$stateProvider.state('newService', {
		url: '/newService',
		views: {
			'configurator-view': {					
				templateUrl: vcredit.globalVars.vcredit_path+'templates/all_services/allServices.tpl.html',
				controller: 'newServiceCtrl'
			}
		}
	}).state('newService.configureService', {
		url: '/configureService/:prodFamily',
		parent: 'newService',
		views: {
			'allServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/all_services/steps/configureService.tpl.html',
				controller: 'configureServiceCtrl'
			}
		}	
	}).state('newService.configureAddons', {
		url: '/configureAddons',
		parent: 'newService',
		views: {
			'allServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/all_services/steps/configureAddons.tpl.html',
				controller: 'configureAddonsCtrl'
			}
		}	
	}).state('newService.reviewAndSubmit', {
		url: '/reviewAndSubmit',
		parent: 'newService',
		views: {
			'allServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/all_services/steps/reviewAndSubmit.tpl.html',
				controller: 'reviewAndSubmitCtrl'
			}
		}	
	}).state('newService.complete', {
		url: '/complete',
		parent: 'newService',
		views: {
			'allServices': {
				templateUrl: vcredit.globalVars.vcredit_path+'templates/all_services/steps/complete.tpl.html',
				controller: 'completeCtrl'
			}
		}	
	})
})

.controller('newServiceCtrl',['$scope','$state','$modal', 'newServiceFactory', 'vmf', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, confirmDialog){

	$scope.globalVars = {};
	$scope.showFundInfoSection = true;
	$scope.showProgressBar = true;
	$scope.isFundDefaultSelected = true;
	$scope.fundError=false;
	
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	$scope.setHelpURL = function (getCurrState){
		if(getCurrState.name == "newService.configureService"){
			$scope.helpURL = $scope.globalVars.newService1ConfigureService;
			//console.log("In side new service for review step 1:: " + getCurrState.name + "" +$scope.helpURL);
		}else{
			$scope.helpURL = $scope.globalVars.configurator_KBArticle_link;
			//console.log("In side new service:: else case" + $scope.helpURL);
		}
	}

	$scope.pageInit = function(getCurrState){
	//console.log(getCurrState);
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
	angular.copy(newServiceFactory.steps,$scope.steps);

	$scope.pageInit($state.current);

	$scope.$on(
		'hideHeaderAndFundInfo',
			function(evt, data){
				$scope.showFundInfoSection = false;
				$scope.showProgressBar = false;
				$scope.successPage = data.successPage;
			}
	);

	$scope.$on(
		'$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){ 
		    $scope.pageInit(toState);
		}
	);

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
				$scope.isXaasFund = data.isXaasFund;
				$scope.identifierName = data.identifierName;
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
				if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : change-fund");

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
					if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : change-fund : continue");

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
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : change-fund : cancel");
	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}


}])
.controller('configureServiceCtrl',['$scope','$state','$modal', 'newServiceFactory', 'vmf','$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	newServiceFactory.isDashboardFlow = true;

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

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
	$scope.localObj.isPraxisFlow = false;
	$scope.localObj.isDaasFlow=false;
	/*sceondary  admin flags...*/
	$scope.newAdmin = false;
	$scope.adminFlag = false;
	$scope.localObj.showChangePromoForm = false;
	$scope.localObj.newPraxisCode = '';
	$scope.localObj.applyPromoLoader = false;
	$scope.localObj.showSubmitPromotionLoader = false;
	$scope.localObj.promoError = false;
	$scope.partnerListError=false;
	//new changes
	//$scope.localObj.countriesModel="US";
	$scope.countries={};
	$scope.localObj.provinceModel='';
	$scope.province={};
	$scope.partners=[];
	//ends

	var leuFirstName;
	var leuLastName;
	var leuEmail;
	/*sceondary  admin flags...*/
	$scope.globalVars = {};
	$scope.serviceTypeCount = 0;
	$scope.ajaxLoader = false;
	$scope.localObj.servName = '';
	$scope.localObj.rightHeader='';
	$scope.localObj.linkText='';
	$scope.localObj.linkUrl='';
	$scope.localObj.desc='';
	//$scope.localObj.selectedPartner="";
	$scope.localObj.searchText="";
	$scope.localObj.searchTextApply="";
	$scope.gotPartnerList=false;
	$scope.displaySelectedPartner=[];
	$scope.partnerSelected=false;
	$scope.partnerList={};
	$scope.partnerListObject = [];
	$scope.localPartnerList={};
	$scope.localObj.selectedId="";
	$scope.localObj.supportType="105-OnDemand Services Online Support";
	$scope.selectedPartnerObj={};
	$scope.existingpartner=false;
	$scope.noPartner=null;
	if (vcredit.globalVars.serviceCategory!="VSPP") {
		$scope.partsel=true;
  	}else{
  		$scope.partsel=false;
  	}
	angular.copy(newServiceFactory.globalVars,$scope.globalVars);

	//affix initialization for floating calculation side bar
	setTimeout(function () {
      $('div.calculationSidebar').affix({
        offset: {
          top: 360
        , bottom: 550
        }
      });
    }, 3000)

	$scope.pageInit = function(){

	// if($state.params.prodFamily == 'VC-HYBRID-SERVICE-PRAXIS'){
	if($state.params.prodFamily != null && $state.params.prodFamily.indexOf('PRAXIS') > -1 ) {
		
		if($state.params.prodFamily.indexOf('DAAS') > -1){
			$scope.localObj.isDaasFlow = true;
			newServiceFactory.isDaasFlow = true;
		}else{
			$scope.localObj.isDaasFlow = false;
			newServiceFactory.isDaasFlow = false;
		}
		
		if(newServiceFactory.isPraxisComplete==true){
			var getParam = newServiceFactory.getParameterByName('_VM_flow');

			if(getParam !== undefined && getParam !== null && getParam == 'sidDetails')
				window.location = vcredit.globalVars.postBackUrlFromExtLink;
			else
				window.location = vcredit.globalVars.dashboardURL;
		}
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : vcloud-air");
		$scope.localObj.isPraxisFlow = true;
		newServiceFactory.isPraxisFlow = true;
		$scope.globalVars.getServicesUrl = $scope.globalVars.praxisSignUpNewService;

		if(!$.isEmptyObject(newServiceFactory.configuratorLinksObj)){
			$scope.localObj.servName = newServiceFactory.configuratorLinksObj["new"][$state.params.prodFamily]["description"];
			$scope.steps[0]['header'] = $scope.globalVars.signUpFor+" "+ $scope.localObj.servName;
		}
	
		$scope.steps[3]['header'] = $scope.globalVars.success;

		$scope.$emit(
			'changeStepsData',
		     $scope.steps
		);

		//$scope.$emit('hideHeaderAndFundInfo');
		$scope.$emit('hideHeaderAndFundInfo',
		{
				"successPage" : false
		});	

	}else{
		newServiceFactory.isPraxisFlow = false;
		if(newServiceFactory.getParameterByName("_VM_flow") !== '' && newServiceFactory.getParameterByName("_VM_flow") == 'convert'){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : convert-service : configure-service");
		}else{
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : configure-service");	
		}
		
	}
	

	var getServicesUrlMod = $scope.globalVars.getServicesUrl+"&_VM_prdFamilyDetails="+$state.params.prodFamily;

	//if(newServiceFactory.configuratorLinksObj)	
		if($.isEmptyObject(newServiceFactory.serviceObj) == true){

			newServiceFactory.getServices(function(data){

			  if(!$scope.isEmpty(data.ERROR_MESSAGE) || !$scope.isEmpty(data.wrapper.error_message)){

				$scope.$apply(function(){
					$scope.showPage = false;
					if(!$scope.isEmpty(data.ERROR_MESSAGE)){
						$scope.displayErrorAlert(data.ERROR_MESSAGE, "warning", true, true, false);	
					}else{
						$scope.displayErrorAlert(data.wrapper.error_message, "warning", true, true, false);	
					}
				  	
				  	$scope.showLoader = false;		
				});
			  	

			  } else {

			  	angular.copy(data.wrapper, newServiceFactory.serviceObj);
			  	if (vcredit.globalVars.serviceCategory!="VSPP") {
			  		$scope.checkExistingPartner(data.wrapper);
			  	}
			  	//For Praxis flow Redemption Tag
			  	//As per new wireframe
			  	angular.forEach(newServiceFactory.serviceObj.praxisSupportSKU,function(value,key){
			  		if(newServiceFactory.serviceObj.praxisSupportSKU[key].labelID == "105"){
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportTxt = $scope.globalVars.onlineSupportText;
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportlink = $scope.globalVars.onDemandOnlineSupportUrl;
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportLrnTxt = $scope.globalVars.supportLrnTxt;
			  		}
			  		if(newServiceFactory.serviceObj.praxisSupportSKU[key].labelID == "96"){
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportTxt = $scope.globalVars.ProductionSupportText;
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportlink = $scope.globalVars.onDemandProductionSupportUrl;
			  			newServiceFactory.serviceObj.praxisSupportSKU[key].supportLrnTxt = $scope.globalVars.supportLrnTxt;
			  		}
			  	})
			  	$scope.praxisSupportSKUAll = newServiceFactory.serviceObj.praxisSupportSKU;
			  	//As per new wireframe for praxis ends...
			  	$scope.redemptionNotesListPraxisFlow = newServiceFactory.serviceObj.redemptionNotes;
				$scope.PraxisFlowdynabox = {value : ''};

			  	$scope.$apply(function(){
			  		$scope.displayServiceData(data.wrapper);
			  		$scope.showPage = true;
			  		$scope.showLoader = false;
			  	});
			  	if($(".alert-box").parents().hasClass("alertErrorMessageContainer")){
			  		vmf.msg.page("");	
			  	}
			  }	

			},getServicesUrlMod,'GET');

		} else {
			$scope.displayServiceData(newServiceFactory.serviceObj);
			$scope.showPage = true;
			$scope.showLoader = false;
			vmf.msg.page("");
		}

		if($.isEmptyObject(newServiceFactory.offeringPartner) == false){
			$scope.completeData={};
			angular.copy(newServiceFactory.allPartners, $scope.completeData);
			$scope.preselectPartner();

		}
		if(newServiceFactory.defaultPartnerCheck == true){
			if (vcredit.globalVars.serviceCategory!="VSPP") {
				$scope.checkExistingPartner(newServiceFactory.serviceObj);
			}

		}

	}
	// new admin flag display
		$scope.radioAdmin = function(){
		var ev = angular.element('#adminNo').attr('id');
		//alert(ev);
		setTimeout(function () {$("#adminForm").parsley()},10);

		if(ev == 'adminNo'){
			//alert('hi');
			 // if (!$("#adminForm").parsley().isValid()) return false;
			$scope.newAdmin = true;
			$scope.adminFields = true;
			$scope.adminFlag = true;
			$scope.userEmpty();
		}
		else {
			$scope.hideRadioAdmin();
				
		}

	}
	$scope.hideRadioAdmin = function(){
		$scope.adminFields = false;
		$scope.newAdmin = false;
		$scope.adminFlag = false;
	}
	$scope.userEmpty = function(){
		
		 var addFields = $('.addSection input');
               
                for (var i = 0; i < addFields.length; i++) {
                    if (addFields[i].value !== "" ) {
                         leuFirstName = $('#firstName').val();
						 leuLastName = $('#lastName').val();
						 leuEmail = $('#inputEmail').val();

						 if(leuFirstName != "" && leuLastName !== "" && leuEmail !== ""){
							$scope.adminFields = false;
							if (!$('#inputEmail').parsley().isValid()){$scope.adminFields = true;}
							else{$scope.adminFields = false;}}
                    } else {
                    			
                        $scope.adminFields = true;
                    }
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

		// $scope.CurrModal = $modal.open({
		//   templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_trueUp.tpl.html',
	 //      scope : $scope
	 //    });
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

	$scope.changePromotion = function(){
		$scope.localObj.showChangePromoForm = true;
		$scope.localObj.newPraxisCode = $scope.serviceData.promotion.promoCode;
	}

	$scope.updatePromotion = function(){		

			$scope.localObj.promoError = false;		

			$scope.localObj.applyPromoLoader = true;
			var applyPromoData = "_VM_fundGroupID="+$scope.serviceData.fundInfo.fundGroupId
								+"&_VM_partnerID="+$scope.selectedPartnerObj.id
								+"&_VM_promoCode="+$scope.localObj.newPraxisCode;

			newServiceFactory.postServices(
			function(successData){
				if(!successData.wrapper.success){
				  	// Display modal if error
				  	$scope.$apply(function(){
					  	$scope.localObj.promoError = $scope.globalVars.invalidPromoCode;
					  	$scope.localObj.applyPromoLoader = false;			  	
				  	});

				  } else {				

				  	$scope.$apply(function(){
				  		angular.copy(successData.wrapper,$scope.serviceData.promotion);
				  		$scope.localObj.applyPromoLoader = false;
				  		$scope.localObj.showChangePromoForm = false;
				  		$scope.localObj.promoError = false;
				  	});
				  			  	
				  }

			},function(errorData){
				$scope.$apply(function(){
					$scope.localObj.promoError = $scope.globalVars.ajax_error_body;	
					$scope.localObj.applyPromoLoader = false;
				  });
			},
			$scope.globalVars.praxisPromoCodeValidation,    		// This comes from the jsp config object
			applyPromoData						             // changed scope variable to add secondary admin....
			,'GET'
		);

	}

	$scope.submitPromotion = function(){		

				$scope.localObj.showSubmitPromotionLoader = true;

				if(vcredit.globalVars.serviceCategory!="VSPP"){
					if($scope.serviceData.promotion.promoCode == null || $scope.serviceData.promotion.promoCode == undefined)
						$scope.serviceData.promotion.promoCode = '';
				}
				/*if($scope.serviceData.configPraxisNotes == null || $scope.serviceData.configPraxisNotes == undefined)
					$scope.serviceData.configPraxisNotes = '';*/
				var selectedPraxisDesc;
				/*angular.forEach($scope.serviceData.praxisSupportSKU, function(val,key){
					if($scope.serviceData.praxisSupportSKU[key][$scope.localObj.supportType] != undefined){
						selectedPraxisDesc = $scope.serviceData.praxisSupportSKU[key][$scope.localObj.supportType];
					}
				});*/
				//console.log($scope.localObj.supportType);
				selectedPraxisDesc = $scope.localObj.supportType.split("-");
				//console.log(selectedPraxisDesc);
				if($scope.PraxisFlowdynabox.value == null || $scope.PraxisFlowdynabox.value == undefined)
					$scope.PraxisFlowdynabox.value = '';
				//console.log($scope.localObj.supportType);
				if(vcredit.globalVars.serviceCategory!="VSPP"){
					$scope.submitPromoData = "_VM_fundGroupID="+$scope.serviceData.fundInfo.fundGroupId
										+"&_VM_partnerID="+$scope.selectedPartnerObj.id
										+"&_VM_promoCode="+$scope.serviceData.promotion.promoCode
										+"&_VM_notes="+encodeURIComponent($scope.PraxisFlowdynabox.value)
										+"&_VM_skuSupportVal="+selectedPraxisDesc[0] //$scope.localObj.supportType
										+"&_VM_skuSupportDesc="+selectedPraxisDesc[1]; //selectedPraxisDesc;
				}else{
					$scope.submitPromoData = "_VM_commitID="+$scope.serviceData.commitInfo.id
										+"&_VM_notes="+encodeURIComponent($scope.PraxisFlowdynabox.value)
										+"&_VM_skuSupportVal="+selectedPraxisDesc[0] //$scope.localObj.supportType
										+"&_VM_skuSupportDesc="+selectedPraxisDesc[1]; //selectedPraxisDesc;
				}

				if ($scope.PraxisFlowdynabox.value){
					var omntTag = encodeURIComponent($scope.PraxisFlowdynabox.value);
					if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : vcloud-air : newtag");
				}

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

							  	$scope.displayErrorAlert(successData.ERROR_MESSAGE, "warning", true, false, false);

							  } else {

							  	angular.copy(successData, newServiceFactory.completeObj);
							  	vmf.msg.page("");							  	
							  	$state.go('newService.complete');				  	
							  }

							  $scope.localObj.showSubmitPromotionLoader = false;

						});							
						if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : submit-promotion");

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
							$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, false);

						  	$scope.localObj.showSubmitPromotionLoader = false;
						});

					},
					$scope.globalVars.praxisSubmitNewService,    		// This comes from the jsp config object
					$scope.submitPromoData                // changed scope variable to add secondary admin....
					,'GET'
				);

				
		}



	
	$scope.displayServiceData = function(getData){
		//$scope.$apply(function(){
			if(getData.fundInfo == null || getData.fundInfo == undefined){
				newServiceFactory.getFundInfo(getData);
				getData.fundInfo = {};
				angular.copy(newServiceFactory.fundInfo, getData.fundInfo);
			}
			angular.copy(getData, $scope.serviceData);
			//$scope.checkExistingPartner();

			if(!$.isEmptyObject(newServiceFactory.adminDetail) && newServiceFactory.adminDetail.adminFlag == true){
				leuFirstName = newServiceFactory.adminDetail.leuFirstName;
				leuLastName = newServiceFactory.adminDetail.leuLastName;
				leuEmail = newServiceFactory.adminDetail.leuEmail;
				$scope.serviceData.leuFirstName = newServiceFactory.adminDetail.leuFirstName;
				$scope.serviceData.leulastName = newServiceFactory.adminDetail.leuLastName;
				$scope.serviceData.leuEmail = newServiceFactory.adminDetail.leuEmail;
				$scope.serviceData.isAdmin = 'No';
				$scope.adminFlag = true;
				//$scope.radioAdmin();
			} else {
				$scope.serviceData.isAdmin = 'Yes';
			}

			if($scope.localObj.isPraxisFlow == true){
				$scope.globalVars.praxisHeaderDescription = $scope.globalVars.praxisHeaderDescription.replace("{0}" , $scope.serviceData.serviceName);

				 if (vcredit.globalVars.serviceCategory!="VSPP"){
				 	if($scope.serviceData.promotion.promoCode == null || $scope.serviceData.promotion.promoCode == ''){
				 		$scope.localObj.showChangePromoForm = true;
				 	}
				 }

				 if($scope.serviceData.serviceName == null){
				 	$state.go('configurator');
				 }

			    $scope.$emit('transferHeaderData',
	    			{
	    				'HdrAccount' : $scope.serviceData.eaAccount,
	    				'HdrAccountNumber' : $scope.serviceData.eaAccountNumber,
	    				'HdrFund' : $scope.serviceData.fundInfo.name,
	    				'HdrFundId' : $scope.serviceData.fundInfo.fundGroupId,
	    				'Hdrbalance': $scope.serviceData.fundInfo.fundBalance,
	    				'HdrCurrency': $scope.serviceData.fundInfo.redemptionCurrencySymbol,
	    				'HdrRedCurrency': $scope.serviceData.fundInfo.redemptionCurrency,
	    				'isXaasFund' : parseInt($scope.serviceData.isXaasFund),
	    				'identifierName' : $scope.serviceData.fundInfo.identifierName,
	    				'trueUp' : $scope.serviceData.fundInfo.trueUp
	    		});


				if($.isEmptyObject(newServiceFactory.configuratorLinksObj)){

					$scope.localObj.servName = $scope.serviceData.serviceName;
					$scope.steps[0]['header'] = $scope.globalVars.signUpFor+" "+ $scope.localObj.servName;				

					$scope.$emit(
						'changeStepsData',
					     $scope.steps
					);

				}



			} else {			

			$scope.setPaymentType = [];
			angular.forEach($scope.serviceData.paymentType[0],function(data){
				$scope.setPaymentType.push(data[0]);
			});
			if (vcredit.globalVars.serviceCategory!="VSPP") {
				if($scope.serviceData.partner[0].length == 1 && $scope.serviceData.partner[1] == ''){
					$scope.serviceData.partner[1] = $scope.serviceData.partner[0][0]['id'];
				}
			}
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
		    				'HdrAccount' : $scope.serviceData.eaAccount,
		    				'HdrAccountNumber' : $scope.serviceData.eaAccountNumber,
		    				'HdrFund' : $scope.serviceData.fundInfo.name,
		    				'HdrFundId' : $scope.serviceData.fundInfo.fundGroupId,
		    				'Hdrbalance': $scope.serviceData.fundInfo.fundBalance,
		    				'HdrCurrency': $scope.serviceData.fundInfo.redemptionCurrencySymbol,
		    				'HdrRedCurrency': $scope.serviceData.fundInfo.redemptionCurrency,
		    				'isXaasFund' : parseInt($scope.serviceData.isXaasFund),
		    				'identifierName' : $scope.serviceData.fundInfo.identifierName,
	    					'trueUp' : $scope.serviceData.fundInfo.trueUp
		    			});

			    $scope.setCrosssku();

			}
		    //$scope.validateService();

		//});
	}

	$scope.isEmpty = function(val){
    	return (val === undefined || val == null || val.length <= 0) ? true : false;
	}

	$scope.setCrosssku = function(){

		$scope.skuError = false;
		$scope.allSelected = false;
		//$scope.selectedPartnerObj = {};

		$scope.serviceData.currentSelectedTerm = null;
		$scope.serviceData.currentSelectedTermId = null;

		if(!$scope.isEmpty($scope.serviceData.storageType[1]))
			//$scope.storageCount = 1;

		if(!$scope.isEmpty($scope.serviceData.paymentType[1]))
			//$scope.paymentTypeCount = 1;

		// if($scope.serviceData.partner[1] !== ''){
		// 	angular.forEach($scope.serviceData.partner[0],function(data){
		// 		if(data.id == $scope.serviceData.partner[1])
		// 			$scope.selectedPartnerObj = data;
		// 		console.log(data);
		// 	});
		// }
		//console.log($scope.selectedPartnerObj);
			
			
		

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
					//$scope.SubmitServiceData = {	
					//								"_VM_flow" : 'addon',
					//								"_VM_EA" : $scope.serviceData.eaAccountNumber,
					//								"_VM_CN" : $scope.serviceData.customerNumber,
					//								"_VM_SKU" : $scope.currSku.data[0],
					//								"_VM_CURRENCY" : $scope.serviceData.currency[1] 
					//							}
					$scope.SubmitServiceData = "_VM_flow=addon&_VM_EA=" + $scope.serviceData.eaAccountNumber +
													"&_VM_CN=" + $scope.serviceData.customerNumber +
													"&_VM_crossRefSku=" + $scope.currSku.data[0] +
													"&_VM_currency=" + $scope.serviceData.fundInfo.redemptionCurrency +
													"&_VM_partnerName="+encodeURIComponent($scope.selectedPartnerObj.name)+
													"&_VM_partnerID=" + $scope.selectedPartnerObj.id; 
													//"&_VM_partnerName=" + $scope.selectedPartnerObj.name;

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

	$scope.checkExistingPartner = function(data){
		if(data.partner[0].length > 1){
			$scope.partsel = false;
			angular.forEach(data.partner[0], function(dataPartner){
				if(dataPartner.id !="VMware"){
					$scope.displaySelectedPartner=[];
					$scope.displaySelectedPartner.push({
                                    id:dataPartner.id,
                                    name:dataPartner.name,
                                    address:dataPartner.address 
                                });

					//$scope.localObj.countriesModel=dataPartner.countryCode;
					//$scope.localObj.provinceModel=dataPartner.stateCode;
					//$scope.localObj.selectedPartner=dataPartner.id;
					newServiceFactory.defaultPartnerCheck=true;
					angular.copy(dataPartner,newServiceFactory.defaultPartner);
					if(newServiceFactory.selPartnerRadio == true){

						$scope.localObj.selectedId="partner";
						$scope.partnerSelected = true;
					}
					if(newServiceFactory.oneTimeClick == false){
						$scope.localObj.selectedId="partner";
						$scope.partnerSelected=true;
						$scope.selectedPartnerObj={};
						$scope.selectedPartnerObj["id"] = dataPartner.id;
						$scope.selectedPartnerObj["name"] = dataPartner.name;
						$scope.selectedPartnerObj["address"] = dataPartner.address;
					}

					
					

				}

			});
			
			

			
		}
		
		
	}


	$scope.vmwareSelected = function(abc){
		// console.log($scope.localObj.selectedId);
		// console.log(abc);
		$scope.partnerSelected=false;
		
		$scope.partsel=false;

			angular.forEach($scope.serviceData.partner[0],function(data){
				if(data.id == abc)
					$scope.selectedPartnerObj = data;
				if(newServiceFactory.isPraxisFlow==false){
					$scope.setCrosssku();	
				}
				
			});
			newServiceFactory.selPartnerRadio = false;
			newServiceFactory.oneTimeClick = true;

	}

	$scope.showPartnersList=function(){
		//console.log($scope.displaySelectedPartner);
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : modify-partner");
		if($scope.displaySelectedPartner.length > 0  && (!$.isEmptyObject(newServiceFactory.statesCountryJson))){
			$scope.partsel=false;
			$scope.partnerSelected=true;
			if(newServiceFactory.defaultPartnerCheck==true){
				$scope.selectedPartnerObj={};
				$scope.selectedPartnerObj["id"] = newServiceFactory.displaySelectedPartner.id;
				$scope.selectedPartnerObj["name"] = newServiceFactory.displaySelectedPartner.name;
				if(newServiceFactory.isPraxisFlow==false){
					$scope.setCrosssku();
				}
				newServiceFactory.selPartnerRadio = true;
			}
				$scope.selectedPartnerObj={};
				//console.log($scope.displaySelectedPartner);
				$scope.selectedPartnerObj["id"] = $scope.displaySelectedPartner[0].id;
				$scope.selectedPartnerObj["name"] = $scope.displaySelectedPartner[0].name;
				if(newServiceFactory.isPraxisFlow==false){
					$scope.setCrosssku();
				}

		}else{

			$scope.partnerModal = $modal.open({
			  templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/partnerList.tpl.html',
		      scope : $scope,
		      keyboard:false,
		      backdrop:false,
		      windowClass:'wider'

		    });
		    $scope.showModalLoader = true;
		    if($.isEmptyObject(newServiceFactory.allPartners)){
		    newServiceFactory.getServices(function(data){

		    	if(!$scope.isEmpty(data.ERROR_MESSAGE)){
					 $scope.$apply(function(){

					 	$scope.showModalLoader=false;
					 	$scope.partnerListError=true;
					 });
		 		}else{
		 				$scope.$apply(function(){
					 	$scope.showModalLoader=false;
					 	$scope.completeData=data.wrapper;
					 	newServiceFactory.statesCountryJson=data.wrapper;
						$scope.countries=$scope.completeData.country;
						$scope.localObj.countriesModel=$scope.completeData.fundCountry;
					 	//if($scope.completeData.partners.length > 0){
					 		angular.copy($scope.completeData, newServiceFactory.allPartners);
						 	$scope.gotPartnerList=true;
						 	$scope.localObj.countriesModel=$scope.completeData.fundCountry;
						 	$scope.populatePartner();	
					 	// }else{
					 	// 	$scope.noPartner=$scope.globalVars.noPartnerFoundText;
					 	// }
					 	

					 });

		 		}
	},newServiceFactory.globalVars.partnerSelectionUrl,'GET');
	}else{

		$scope.showModalLoader = false;
		$scope.completeData={};
		angular.copy(newServiceFactory.allPartners, $scope.completeData);
		$scope.populatePartner();
	}
		}

	}

$scope.changePartnersList=function(){

			$scope.localObj.selectedPartner="";
			$scope.localObj.countriesModel="";
			$scope.localObj.countriesModel=newServiceFactory.allPartners.fundCountry;
			$scope.partners=[];
			$scope.partnerModal = $modal.open({
			  templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/partnerList.tpl.html',
		      scope : $scope,
		      keyboard:false,
		      backdrop:false,
		      windowClass:'wider'

		    });
		    $scope.showModalLoader = true;
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : modify-partner");
		     

		     	 newServiceFactory.getServices(function(data){

		    	if(!$scope.isEmpty(data.ERROR_MESSAGE)){
					 $scope.$apply(function(){

					 	$scope.showModalLoader=false;
					 	$scope.partnerListError=true;
					 });
		 		}else{
		 				$scope.$apply(function(){
					 	$scope.showModalLoader=false;
					 	$scope.completeData=data.wrapper;
					 	newServiceFactory.statesCountryJson=data.wrapper;
						$scope.countries=$scope.completeData.country;
						//$scope.localObj.countriesModel=$scope.completeData.fundCountry;
					 	//if($scope.completeData.partners.length > 0){
					 		angular.copy($scope.completeData, newServiceFactory.allPartners);
						 	$scope.gotPartnerList=true;
						 	//$scope.localObj.countriesModel=$scope.completeData.partners[0].countryCode;
						 	//$scope.localObj.countriesModel=$scope.completeData.fundCountry;
						 	$scope.populatePartner();	
					 	// }else{
					 	// 	$scope.noPartner=$scope.globalVars.noPartnerFoundText;
					 	// }

					 });

		 		}
	},newServiceFactory.globalVars.partnerSelectionUrl,'GET');
		     


}

	$scope.preselectPartner = function(){
		$scope.partsel=false;
		$scope.selectedPartnerObj={};
		angular.copy(newServiceFactory.offeringPartner, $scope.selectedPartnerObj);
		angular.forEach($scope.serviceData.partner[0], function(data){
			 if(data.id == $scope.selectedPartnerObj.id){
				$scope.localObj.selectedId="";
			 	$scope.localObj.selectedId=$scope.selectedPartnerObj.id;
			// 	console.log($scope.localObj.selectedId);
			$scope.partnerSelected=false;
			}

		 });
		if($scope.selectedPartnerObj.id != "VMware"){
				$scope.localObj.selectedId="";
		 		$scope.localObj.selectedId="partner";
				$scope.displaySelectedPartner=[];
				$scope.displaySelectedPartner.push({
                                    id:$scope.selectedPartnerObj.id,
                                    name:$scope.selectedPartnerObj.name,
                                    address:$scope.selectedPartnerObj.address 
                                });
				$scope.partnerSelected=true;
			
		}
		if(!$.isEmptyObject(newServiceFactory.selectedBufferPartner)){
			$scope.displaySelectedPartner=[];
			$scope.localObj.selectedPartner="";
			//$scope.localObj.selectedPartner=newServiceFactory.selectedBufferPartner.id;
					$scope.displaySelectedPartner.push({
                                id:newServiceFactory.selectedBufferPartner.id,
                                name:newServiceFactory.selectedBufferPartner.name,
                                address:newServiceFactory.selectedBufferPartner.address 
                            });
		}
		

	}




	$scope.populatePartner = function(){
		 				$scope.province={};
						$scope.countries=newServiceFactory.statesCountryJson.country;
						$scope.localObj.countriesModel=newServiceFactory.statesCountryJson.fundCountry;
						/*if(!$scope.isEmpty($scope.countries)){
							setTimeout(function(){
							$("#country").selectpicker('refresh');

							}, 300);
						}*/

						// angular.forEach($scope.countries, function(data){
						// 	if(data.country_code == $scope.completeData.fundCountry){
						// 		$scope.localObj.countriesModel = data;
						// 	}
						// });
						
						angular.forEach(newServiceFactory.statesCountryJson.partners, function(provinceInJson){
							if($scope.localObj.countriesModel == provinceInJson.countryCode){
									$scope.province[provinceInJson.stateCode]=provinceInJson.state;
							}
						
						});
						//console.log($scope.province);
						if(!$scope.isEmpty($scope.province)){
							setTimeout(function(){
							$("#province").selectpicker('refresh');

							}, 300);
						}
						$scope.partners=[];
						angular.forEach($scope.completeData.partners, function(partnersInJson){
							if($scope.localObj.provinceModel ==""){
								if((partnersInJson.directReseller  == true) || $scope.localObj.countriesModel == partnersInJson.countryCode){
									$scope.partners.push(partnersInJson);
								}
							}else{
								if((partnersInJson.directReseller  == true) || ($scope.localObj.countriesModel == partnersInJson.countryCode) && ($scope.localObj.provinceModel == partnersInJson.stateCode)){

									$scope.partners.push(partnersInJson);
								}

							}
							

						});


	}
	$scope.filterCountryPartner = function(countrySelected){
		$scope.partnerListError=false;
		$scope.province={};
		$scope.localObj.provinceModel='';
		$scope.partners=[];
		$scope.showModalLoader=true;
		$scope.localObj.searchTextApply="";
			newServiceFactory.getServices(function(data){
				if(!$scope.isEmpty(data.ERROR_MESSAGE)){
					 $scope.$apply(function(){

					 	$scope.showModalLoader=false;
					 	$scope.partnerListError=true;
					 });
		 		}else{
		 				$scope.$apply(function(){
					 	$scope.showModalLoader=false;
					 	$scope.completeData=data;
					 	// angular.copy($scope.completeData, newServiceFactory.allPartners);
					 	$scope.gotPartnerList=true;
					 	angular.forEach($scope.completeData.partners, function(provinceInJson){
							if($scope.localObj.countriesModel == provinceInJson.countryCode && provinceInJson.stateCode != ""){
								$scope.province[provinceInJson.stateCode]=provinceInJson.state;
							}
							$scope.partners.push(provinceInJson);
						});

						if(!$scope.isEmpty($scope.province)){
							setTimeout(function(){
							$("#province").selectpicker('refresh');

							}, 300);
						}
					 	// angular.forEach($scope.completeData.partners, function(partnersInJson){
					 	// 	$scope.partners.push(partnersInJson);

					 	// })

					 });

		 		}
				},newServiceFactory.globalVars.partnerCountrySelectionUrl+'&_VM_fundCountry='+countrySelected,'GET');
						// angular.forEach($scope.completeData.partners, function(partnersInJson){
						// 	if($scope.localObj.countriesModel.country_code == partnersInJson.countryCode){
						// 			$scope.partners.push(partnersInJson);

						// 	}

						// });


	}
	
	$scope.filterProvincePartner = function(provinceSelected){
		$scope.partnerListError=false;
		$scope.partners=[];
		$scope.localObj.searchTextApply="";
		if(provinceSelected != null){
			angular.forEach($scope.completeData.partners, function(partnersInJson){
								if((partnersInJson.stateCode == provinceSelected) || (partnersInJson.directReseller == true)){
										$scope.partners.push(partnersInJson);

								}

							});
		}else{
				angular.forEach($scope.completeData.partners, function(partnersInJson){
								if((partnersInJson.countryCode == $scope.localObj.countriesModel) || (partnersInJson.directReseller == true)){
										$scope.partners.push(partnersInJson);

								}

							});
		}
	}



	$scope.savePartner = function(){
		$scope.partsel=false;
		$scope.displaySelectedPartner=[];
		angular.forEach($scope.completeData.partners, function(data){
			if(data.partnerId == $scope.localObj.selectedPartner){
				$scope.displaySelectedPartner.push({
                                    id:data.partnerId,
                                    name:data.name,
                                    address:data.address 
                                });
				$scope.selectedPartnerObj={};
				$scope.selectedPartnerObj["id"] = data.partnerId;
				$scope.selectedPartnerObj["name"] = data.name;
				$scope.selectedPartnerObj["address"] = data.address;
			}
			
		});
		// angular.forEach($scope.completeData.partners, function(data){
		// 	if(data.prm_id == )


		// })
		angular.copy($scope.selectedPartnerObj,newServiceFactory.selectedBufferPartner);
		$scope.partnerSelected=true;
		$scope.partnerModal.close();
		if(newServiceFactory.isPraxisFlow==false){
					$scope.setCrosssku();
				}
		newServiceFactory.defaultPartnerCheck=false;
		$scope.localObj.provinceModel="";
		$scope.localObj.searchTextApply="";
		$scope.localObj.searchText="";
		
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : modify-partner-save");
	}

	$scope.applySearch = function(){

		$scope.localObj.searchTextApply = {};
		$scope.localObj.searchTextApply.name = "";
		$scope.localObj.searchTextApply.name=$scope.localObj.searchText;
	}

	$scope.cancelPartner = function(){
		$scope.partnerModal.close();
		$scope.partnerListError=false;
		$scope.noPartner=null;
		if($scope.partnerSelected==false){
			$scope.localObj.selectedId=$scope.selectedPartnerObj.id;

		}else{

			$scope.localObj.selectedId="partner";
		}
		$scope.localObj.provinceModel="";
		$scope.localObj.selectedPartner=$scope.selectedPartnerObj["id"];
		$scope.localObj.searchTextApply="";
		$scope.localObj.searchText="";

		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : modify-partner-cancel");
	}

	$scope.isEmptyState= function (obj) {
       return angular.equals({},obj); 
    };

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
		if(!$scope.localObj.isPraxisFlow && ($scope.trueUpError || $scope.skuError || !$scope.currSku.data[0] || $scope.ajaxLoader || $scope.adminFields || $scope.partsel)){
			callbackFn();
		}else{
			$scope.displayConfirmModal();
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow");		
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
  // 		var scopeForModal = $scope.$new();
  // 		scopeForModal.modalData = getModalData;
		// //$scope.modalData = getModalData;
		// $scope.ConfirmModal = $modal.open({
	 //      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_confirm_tpl.html',
		//   scope : scopeForModal,
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
        });


	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

	$scope.displayInsufficientError = function(){
		$scope.$emit('displayTrueUpEvt',
			{
	  		'data' : $scope.globalVars,
	  		'fund' : $scope.serviceData.fundInfo.name,
	  		'balance' : $scope.serviceData.fundInfo.fundBalance,
	  		'currency' : $scope.serviceData.fundInfo.redemptionCurrencySymbol,
	  		'currencyLocale' : $scope.serviceData.fundInfo.redemptionCurrency,
	  		'class' : 'errorContainer'
  		});
		$scope.trueUpError = true;
	}

	$scope.goToAddOns = function(){
		if(newServiceFactory.getParameterByName("_VM_flow") === 'trial'){
			if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : purchase-new-service : add-additional-capacity");
		}

		vmf.msg.page("");
		if (vcredit.globalVars.serviceCategory!="VSPP") {

			var getBalance = $scope.serviceData.fundInfo.fundBalance.replace(',','');
	
			if(parseInt($scope.serviceData.isXaasFund) == 1 && $scope.serviceData.fundInfo.trueUp == '0' && parseFloat(getBalance) < parseFloat($scope.currSku.data[1])){
					$scope.displayInsufficientError();
			  		return false;
			}
		}else if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.serviceData.fundInfo.currentConsumption) + parseFloat($scope.currSku.data[1])) > parseFloat($scope.serviceData.fundInfo.threshold)){
					
					var selectedPartner = null;
					angular.forEach($scope.serviceData.partner[0],function(data){
						if(data.id == $scope.serviceData.partner[1])
							selectedPartner = data.name;						
					});
					//console.log(selectedPartner);
					if(selectedPartner != null && selectedPartner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, selectedPartner);
					}
					$scope.displayInsufficientError();
			  		return false;
			}
		}

		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		angular.copy($scope.selectedPartnerObj, newServiceFactory.offeringPartner);

		newServiceFactory.addOnObj = {};
		newServiceFactory.adminDetail = {};
		newServiceFactory.adminDetail.leuFirstName = leuFirstName;
		newServiceFactory.adminDetail.leuLastName = leuLastName;
		newServiceFactory.adminDetail.leuEmail = leuEmail;
		newServiceFactory.adminDetail.adminFlag = $scope.adminFlag;
		$scope.ajaxLoader = true;
		$scope.newAdminInfo = "&leuFirstName=" + leuFirstName + "&leuLastName="+ leuLastName + "&leuEmail=" + leuEmail;
		if($scope.adminFlag == true){$scope.addonServiceData = $scope.SubmitServiceData + $scope.newAdminInfo;}
		else{$scope.addonServiceData = $scope.SubmitServiceData}
		
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
						$scope.ajaxLoader = false;

					  } else {
					  	if (vcredit.globalVars.serviceCategory!="VSPP") {
					  		successData.wrapper.core.partner=$scope.selectedPartnerObj.name;
					  	}

						if(successData.wrapper.core.fundInfo == null ||  successData.wrapper.core.fundInfo == undefined){
					  		newServiceFactory.getFundInfo(successData.wrapper.core);
					  		successData.wrapper.core.fundInfo = {};
							angular.copy(newServiceFactory.fundInfo, successData.wrapper.core.fundInfo);
					  	}

					  	angular.copy(successData, newServiceFactory.successServiceObj);
					  	
					  	$scope.ajaxLoader = false;
					  	vmf.msg.page("");
					  	$state.go('newService.configureAddons');				  	
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
				$scope.ajaxLoader = false;
				$scope.displayErrorAlert($scope.globalVars.ajax_error_body, "warning", true, false, true);
			},
			$scope.globalVars.submitServiceUrl,    		// This comes from the jsp config object
			$scope.addonServiceData                // changed scope variable to add secondary admin....
			,'GET'
		);

		/*$state.go('newService.configureAddOns');*/
		
	}

	 $scope.pageInit();

}])
.controller('configureAddonsCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, confirmDialog){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : add-capacity");
	if($.isEmptyObject(newServiceFactory.serviceObj)){
		$state.go('configurator');
	}

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	$scope.getAddOnServiceUrl = vcredit.globalVars.fetchAddonServiceDetailsUrl;
	$scope.serviceData = {};
	//$scope.addOnData, 
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

	angular.copy(newServiceFactory.serviceObj, $scope.serviceData);
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);

	/*newServiceFactory.getServices(function(data){
		$scope.displayAddOnData(data);
	},$scope.getAddOnServiceUrl,'GET');*/ // comment this for dev-15

	angular.copy(newServiceFactory.successServiceObj, $scope.successServiceObj);  //comment for local copy
	//console.log($scope.successServiceObj);

	$scope.displayAddOnData = function(getData){
		//console.log(getData);
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
						
						if(!$.isEmptyObject(data[14]) && !$.isEmptyObject(data[14].defaultQuantity)){
							data[8].earlierSelectedQty = parseInt(data[14].defaultQuantity);
						}else{
							data[8].earlierSelectedQty = 0;
						}
						
						
						data[8].selectedQty = data[8].earlierSelectedQty;
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
			}else{
				$scope.addOnData.ttlMonthlyRecurringCost = 0;
				$scope.addOnData.ttltermMonthlyCost = 0;
				$scope.addOnData.ttlPrepaidCost = 0;
				$scope.addOnData.ttlYearlyCost = 0;
				$scope.addOnData.ttlOneTimeCost = 0;
			}
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
				if(!$.isEmptyObject(addOns[14]) && !$.isEmptyObject(addOns[14].defaultQuantity) && addOns[14].defaultQuantity != "0"){
					var selectdQty = addOns[8].selectedQty;
					var selectdType = addOns[8].selectedType;
					var selectdQtyCost = 0;
					var selectdAddonSKU = "";
					var addOnRemainingCost = 0;
					var supportTierInfo = {};

					selectdQty = parseInt(addOns[14].defaultQuantity);	
				
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
				}else{
					addOns[8].selectedQty = 0;
				}	

		}
		//addOns[8].defaultQuantityError = false;
	}
	
	//changeAddon will be triggered when the Qty & type will be changed 
	$scope.changeAddon = function(addOnKey, addOns, addOnIndex){
		//console.log(addOnKey, addOns[4], addOnIndex);
		var selectdQty = addOns[8].selectedQty;
		var selectdType = addOns[8].selectedType;
		var selectdAddon = addOnKey;
		var selectdQtyCost = 0;
		var selectdAddonSKU = "";
		var addOnRemainingCost = 0;
		var supportTierInfo = {};

		var defaultQuantityFlag = false;
		var defaultQuantity = 0;

		addOns[8].defaultQuantityError = false;
		addOns[8].txtError = {};
		if(!$.isEmptyObject(addOns[14]) && !$.isEmptyObject(addOns[14].defaultQuantity) && addOns[14].defaultQuantity != "0"){
			defaultQuantityFlag = true;
			defaultQuantity = parseInt(addOns[14].defaultQuantity) - 1;
		}
			
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
		
		if(parseInt(selectdQty)>defaultQuantity && !isNaN(selectdQty)){
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
			addOns[8].defaultQuantityError = false;
						
		}
		else{
			if(defaultQuantityFlag && !selectdQty.match(/^\s*$/g)){
				
				selectdQty = parseInt(addOns[14].defaultQuantity);	
				
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
				

			if(addOns[8].defaultQuantityError){
				
				addOns[8].txtError= {'border':'1px solid red'};
			}

			}else{
				addOns[8].noCost = "N";
				addOns[8].selectedAddonSKU = '';
				
				//console.log(regExString.test(selectdQty));
				var regExString = /(^$)|(^\d$)/;
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
				
			}
			if(defaultQuantityFlag){
				addOns[8].defaultQuantityError = true;
			}else{
				addOns[8].defaultQuantityError = false;	
			}
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
					//var numberOfDays = 365 * (commitmentTerm / 12);
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
		if($scope.addOnData.core.fundInfo.redemptionCurrency == 'JPY'){
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
					}

					$scope.totalAddonCost += parseFloat(data[8].addOnRemainingCost); 
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
			}
			if($scope.annualVal > 0){
				var annualAddonDiscountCost = 0;
				annualAddonDiscountCost = roundDecimalToCurrency(discountCostValue(3, $scope.annualVal));
				$scope.annualVal = $scope.annualVal - annualAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - annualAddonDiscountCost;
			}
			if($scope.prepaidVal > 0){
				var prepaidAddonDiscountCost = 0;
				prepaidAddonDiscountCost = roundDecimalToCurrency(discountCostValue(1, $scope.prepaidVal, $scope.ref_addOnObj.core.remainingTerm[2]));
				$scope.prepaidVal = $scope.prepaidVal - prepaidAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - prepaidAddonDiscountCost;
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
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			//recurring monthly calculations ends
			
			
		}
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
		angular.copy($scope.serviceData, newServiceFactory.serviceObj);
		$state.go('newService.configureService');	
	}

	$scope.displayInsufficientError = function(){
		$scope.$emit('displayTrueUpEvt',
			{
	  		'data' : $scope.globalVars,
	  		'fund' : $scope.serviceData.fundInfo.name,
	  		'balance' : $scope.serviceData.fundInfo.fundBalance,
	  		'currency' : $scope.serviceData.fundInfo.redemptionCurrencySymbol,
	  		'currencyLocale' : $scope.serviceData.fundInfo.redemptionCurrency,
	  		'class' : 'errorContainer'
  		});
		$scope.trueUpError = true;
	}
    
	$scope.goToReview = function(){
		vmf.msg.page("");
		if(newServiceFactory.getParameterByName("_VM_flow") === 'trial'){
			if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : purchase-new-service : add-additional-capacity");
		}
		if (vcredit.globalVars.serviceCategory!="VSPP") {
			var getBalance = $scope.serviceData.fundInfo.fundBalance.replace(',','');
			//var total_cost = parseFloat($scope.addOnData.core.cost) + parseFloat($scope.ttlMonthlyCost) + parseFloat($scope.ttlPrepaidCost) + parseFloat($scope.ttlYearlyCost) + parseFloat($scope.ttlOneTimeCost);
			var total_cost = $scope.dueCost;
			// Adding message flag...
			if(parseInt($scope.serviceData.isXaasFund) == 1 && $scope.serviceData.fundInfo.trueUp == '0' && parseFloat(getBalance) < parseFloat(total_cost)){
	
					$scope.displayInsufficientError();
			  		return false;
			}
		}else if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat($scope.serviceData.fundInfo.currentConsumption) + parseFloat($scope.dueCost)) > parseFloat($scope.serviceData.fundInfo.threshold)){
					if($scope.addOnData.core.partner != null && $scope.addOnData.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.addOnData.core.partner);
					}
					$scope.displayInsufficientError();
			  		return false;
			}
		}
		newServiceFactory.addOnObj={};
		angular.copy($scope.addOnData, newServiceFactory.addOnObj);
		$state.go('newService.reviewAndSubmit');
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
		window.location = vcredit.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow");
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }

}])
.controller('reviewAndSubmitCtrl',['$scope','$state','$modal','newServiceFactory', 'vmf','$window', 'confirmDialog',
function($scope, $state, $modal, newServiceFactory, vmf, $window, confirmDialog){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : review-and-submit");
	if($.isEmptyObject(newServiceFactory.serviceObj)){
		window.location = vcredit.globalVars.dashboardURL;
		return false;
		//$state.go('configurator');
	}

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

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
	//console.log(newServiceFactory.serviceObj);
	
	//noteslist for populating the dropdown in the review and submit page for new service page.
	$scope.redemptionNotesList = newServiceFactory.addOnObj.redemptionNotes;
  	$scope.dynabox = {value : ''};

	angular.forEach($scope.addOnData.paymentType, function(payTypeData, key){

		if(parseInt(payTypeData.paymentTypeID) == parseInt($scope.addOnData.core.defaultPaymentType)){
			//data[8].paymentType.push(payTypeData);
			$scope.paymentTypeValue = payTypeData.paymentTypeVal;
		}
		
	});

	$scope.ref_addOnObj=newServiceFactory.addOnObj;


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
		//$scope.editPhase=true;
	}
	$scope.disableEdit=function($event, addOns){
		addOns[8].defaultQuantityError1 = false;
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
				if(!$.isEmptyObject(addOns[14]) && !$.isEmptyObject(addOns[14].defaultQuantity) && addOns[14].defaultQuantity != "0"){
					var selectdQty = addOns[8].selectedQty;
					var selectdType = addOns[8].selectedType;
					var selectdQtyCost = 0;
					var selectdAddonSKU = "";
					var addOnRemainingCost = 0;
					var supportTierInfo = {};

					selectdQty = parseInt(addOns[14].defaultQuantity);	
				
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
								selectdQtyCost = selectdQtyCost + changeNumber(addOns[7][6][selectdType.paymentTypeVal][qtySelectedKey][0]);
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
				}else{
					addOns[8].selectedQty = 0;
				}
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
		var supportTierInfo = {};
		addOns[8].noCost = "Y";
		$scope.validSelectedData = true;

		var defaultQuantityFlag = false;
		var defaultQuantity = 0;

		addOns[8].defaultQuantityError1 = false;
		addOns[8].txtError1 = {};

		if(!$.isEmptyObject(addOns[14]) && !$.isEmptyObject(addOns[14].defaultQuantity) && addOns[14].defaultQuantity != "0"){
			defaultQuantityFlag = true;
			defaultQuantity = parseInt(addOns[14].defaultQuantity) - 1;
		}

		if(addOns[8].selectedType.paymentTypeID == "1"){
			addOns[8].billingTypeLabel = $scope.globalVars.forText + " " +  $scope.addOnData.core.prepaidTerm + " " + $scope.globalVars.months;
		}
		else{
			addOns[8].billingTypeLabel = $scope.globalVars["payment_type"+addOns[8].selectedType.paymentTypeID];
		}
		//addOns[8].billingTypeLabel = $scope.globalVars["payment_type"+selectdType.paymentTypeID];
		
		//console.log(selectdQty + " " + selectdType + " " + addOnKey + " " + addOns[8].billingTypeLabel);
		//console.log(addOns);
		
		if(parseInt(selectdQty)>defaultQuantity && !isNaN(selectdQty)){
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
			addOns[8].defaultQuantityError1 = false;		
		}
		else{
			if(defaultQuantityFlag && !selectdQty.match(/^\s*$/g)){
				selectdQty = parseInt(addOns[14].defaultQuantity);
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

				if(addOns[8].defaultQuantityError){
				
				addOns[8].txtError1= {'border':'1px solid red'};
			}
			}else{
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
			}
			if(defaultQuantityFlag){
				addOns[8].defaultQuantityError1 = true;
			}else{
				addOns[8].defaultQuantityError1 = false;	
			}
			
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
					//var numberOfDays = 365 * (commitmentTerm / 12);
				/*}
				else{
					var numberOfDays = 30 * commitmentTerm ;
				}*/
				//var daysCost = parseInt($scope.addOnData.core.remainingTerm[0]) / numberOfDays;
				//addOnRemainingCost = addOns[8].extendedCost * daysCost;
				//addOnRemainingCost = parseInt(addOns[8].extendedCost) * (parseInt($scope.addOnData.core.remainingTerm[0])/(365 * (12/12)));
				addOnRemainingCost = addOns[8].extendedCost;
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
		if($scope.addOnData.core.fundInfo.redemptionCurrency == 'JPY'){
			return Math.round(a);
		}
		else{
			return Math.round(a*100) / 100;	
		}
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

					$scope.totalAddonCost += parseFloat(data[8].addOnRemainingCost); 
					//$scope.totalCost+=data[8].addOnRemainingCost;
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
			}
			if($scope.annualVal > 0){
				var annualAddonDiscountCost = 0;
				annualAddonDiscountCost = roundDecimalToCurrency(discountCostValue(3, $scope.annualVal));
				$scope.annualVal = $scope.annualVal - annualAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - annualAddonDiscountCost;
			}
			if($scope.prepaidVal > 0){
				var prepaidAddonDiscountCost = 0;
				prepaidAddonDiscountCost = roundDecimalToCurrency(discountCostValue(1, $scope.prepaidVal, $scope.ref_addOnObj.core.remainingTerm[2]));
				$scope.prepaidVal = $scope.prepaidVal - prepaidAddonDiscountCost;
				$scope.totalAddonCost = $scope.totalAddonCost - prepaidAddonDiscountCost;
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
			//total cost calculations ends
			//recurring monthly calculations
			$scope.newAddOnRecurring=parseFloat($scope.addOnRecurring);
			//recurring monthly calculations ends
			
			
		}
	}
	//calculation ended

	if($scope.ref_addOnObj.core != null & $scope.ref_addOnObj.core != undefined){
		$scope.calculations($scope.ref_addOnObj);	
	}

	//submit button click
	var step3SubmitOrderUrl = $scope.globalVars.step3SubmitUrl;
	//var step3SubmitOrderUrl = "https://www-dev15.vmware.com/admin/updateFundDetails.portal";
	
	$scope.postObj = null;

	$scope.displayInsufficientError = function(){
		$scope.$emit('displayTrueUpEvt',
			{
	  		'data' : $scope.globalVars,
	  		'fund' : newServiceFactory.serviceObj.fundInfo.name,
	  		'balance' : newServiceFactory.serviceObj.fundInfo.fundBalance,
	  		'currency' : $scope.serviceData.fundInfo.redemptionCurrencySymbol,
	  		'currencyLocale' : $scope.serviceData.fundInfo.redemptionCurrency,
	  		'class' : 'errorContainer'
  		});
		$scope.trueUpError = true;
	}

	$scope.submitOrder=function($event){
		if(angular.element($event.target).attr("disabled") || angular.element($event.target).closest("a.btn-primary").attr("disabled")){
		   return false;		
		}
		if(newServiceFactory.getParameterByName("_VM_flow") === 'trial'){
			if(typeof riaLinkmy !="undefined") riaLinkmy("trial-to-paid : purchase-new-service : review-and-submit");
		}
		var total_cost = $scope.dueCost;
		vmf.msg.page("");
		if (vcredit.globalVars.serviceCategory!="VSPP") {

			var getBalance = newServiceFactory.serviceObj.fundInfo.fundBalance.replace(',','');
	
			if(parseInt(newServiceFactory.serviceObj.isXaasFund) == 1 && newServiceFactory.serviceObj.fundInfo.trueUp == 0 && parseFloat(getBalance) < parseFloat(total_cost)){
	
					$scope.displayInsufficientError();
			  		return false;
			}
		}else if (vcredit.globalVars.serviceCategory=="VSPP"){
			if((parseFloat(newServiceFactory.serviceObj.fundInfo.currentConsumption) + parseFloat($scope.dueCost)) > parseFloat(newServiceFactory.serviceObj.fundInfo.threshold)){
					if($scope.ref_addOnObj.core.partner != null && $scope.ref_addOnObj.core.partner != undefined){
						$scope.globalVars.trueup_text1 = $scope.globalVars.trueup_text1.replace(/\{0\}/g, $scope.ref_addOnObj.core.partner);
					}
					$scope.displayInsufficientError();
			  		return false;
			}
		}


		$scope.postObj=[];
		$scope.coreSku={};
		$scope.coreSku.sku=newServiceFactory.serviceObj.skuData[0];
		$scope.coreSku.quantity=1;
		$scope.coreSku.price=newServiceFactory.serviceObj.skuData[1];
		$scope.postObj.push($scope.coreSku);
		
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

		var submitPostData = '';
		var adminData = '';
		if(newServiceFactory.adminDetail.adminFlag == true){
			/*submitPostData = "&leuFirstName=" + newServiceFactory.adminDetail.leuFirstName + "&leuLastName="+ newServiceFactory.adminDetail.leuLastName + "&leuEmail=" + newServiceFactory.adminDetail.leuEmail;*/
			adminData = '"leuEmail":'+'"'+ newServiceFactory.adminDetail.leuEmail+'"'+',"leuLastName":'+'"'+newServiceFactory.adminDetail.leuLastName+'"'+',"leuFirstName":'+'"'+newServiceFactory.adminDetail.leuFirstName+'"'+',';
		}

		/*if($scope.addOnData.configNotes == null || $scope.addOnData.configNotes == undefined)
			$scope.addOnData.configNotes = '';
		var redemptionNotes = encodeURIComponent($scope.addOnData.configNotes);*/

		if($scope.dynabox.value == null || $scope.dynabox.value == undefined)
			$scope.dynabox.value = '';
		var redemptionNoteValue = encodeURIComponent($scope.dynabox.value);

		if(redemptionNoteValue.length != 0){
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : newtag");
		}

		submitPostData = 'sdpSelfServiceOrderString={'+adminData+'"totalAmount":'+$scope.totalCost+', "partnerID":"'+ newServiceFactory.offeringPartner.id +'","redemptionNotes":"'+redemptionNoteValue+'", "skuDetailList":'+JSON.stringify($scope.postObj);
		
		if(newServiceFactory.getParameterByName("_VM_flow") !== ''){
			if(newServiceFactory.getParameterByName("_VM_flow") == 'convert' && newServiceFactory.getParameterByName("_VM_serviceID") !== ''){
				submitPostData = submitPostData + ', "serviceID":"' +  newServiceFactory.getParameterByName("_VM_serviceID")+'"';
			}
		}

		submitPostData = submitPostData + "}";
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
			//console.log($scope.errorMsg);
		}
		if(jData.requestNumber != undefined){
			//angular.copy($scope.ref_addOnObj, newServiceFactory.addOnObj);
			$scope.ajaxLoader = false;
			$state.go('newService.complete');
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
		$state.go('newService.configureAddons');
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
		//$state.go('configurator');
		window.location = vcredit.globalVars.dashboardURL;
	}

	$scope.cancelFlow = function(callbackFn){
		$scope.displayConfirmModal();
		if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow");
	}

	$scope.displayConfirmModal = function(){
		// var getModalData = {
  // 			'body' : $scope.globalVars.confirm_message,
  // 			'okText' : $scope.globalVars.confirm,
  // 			'cancelText' : $scope.globalVars.cancelBtn,
  // 			'okBtnAction':$scope.cancelConfirmWindow,
  // 			'cancelBtnAction':$scope.continueConfirmWindow
  // 		};
  // 		var scopeForModal = $scope.$new();
  // 		scopeForModal.modalData = getModalData;
		// //$scope.modalData = getModalData;
		// $scope.ConfirmModal = $modal.open({
	 //      templateUrl: vcredit.globalVars.vcredit_path+'templates/directives/modal_confirm_tpl.html',
		//   scope : scopeForModal,
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
			if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
        },function(btn){
            if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
        }); 
	}
	
	// $scope.cancelConfirmWindow = function(){
	// 	$scope.ConfirmModal.close();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : cancel");
	// }

	// $scope.continueConfirmWindow = function(){
	// 	$scope.cancelFn();
	// 	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : cancel-flow : confirm");
	// 	$scope.ConfirmModal.close();
	// }
}])
.controller('completeCtrl',['$scope','$state','newServiceFactory',
function($scope, $state, newServiceFactory){
	if(typeof riaLinkmy !="undefined") riaLinkmy("subscription-services : purchase-new-service : complete-flow");
	$scope.globalVars = {};
	angular.copy(newServiceFactory.globalVars, $scope.globalVars);

	$scope.isPraxisFlow = newServiceFactory.isPraxisFlow;
	
	if($.isEmptyObject(newServiceFactory.serviceObj)){
		window.location = vcredit.globalVars.dashboardURL;
		//$state.go('configurator');
	}

	//For Setting the HELP URL
	$scope.setHelpURL($state.current);

	$scope.completeObjLocal={};
	angular.copy(newServiceFactory.completeObj, $scope.completeObjLocal);
	
	$scope.isXaasFund=newServiceFactory.serviceObj.isXaasFund;
	//$scope.ref_id=$scope.globalVars.referenceId.replace('{0}',$scope.completeObjLocal.requestNumber);
	$scope.ref_id=$scope.completeObjLocal.requestNumber;

	if(newServiceFactory.getParameterByName("_VM_flow") !== '' && newServiceFactory.getParameterByName("_VM_flow") == 'convert'){
		if($scope.completeObjLocal.serviceID != null && $scope.completeObjLocal.serviceID != undefined){
			$scope.cancelServiceHeader = $scope.globalVars.cancelServiceHeader.replace('{0}',$scope.completeObjLocal.serviceID);
		}
		$scope.convertFlow = true;
	}else{
		$scope.convertFlow = false;
	}

	if($scope.isPraxisFlow){
		$scope.isDaasFlow=newServiceFactory.isDaasFlow;

		if($scope.completeObjLocal.wrapper == null && $scope.completeObjLocal.wrapper == undefined){
			window.location = vcredit.globalVars.dashboardURL;
		}
		if($scope.completeObjLocal.wrapper.supportType!=null && $scope.completeObjLocal.wrapper.supportType!=undefined) {
			$scope.globalVars.leftSupportTextDesc = $scope.globalVars.leftSupportTextDesc.replace('{0}', $scope.completeObjLocal.wrapper.supportType);
		} else {
			$scope.globalVars.leftSupportTextDesc="";
		}
		// $scope.praxisComplete_p1_1 = $scope.globalVars.praxisComplete_p1_1.replace('{0}', $scope.completeObjLocal.wrapper.serviceName);
		// $scope.praxisComplete_p1_1 = $scope.praxisComplete_p1_1.replace('{1}', $scope.completeObjLocal.wrapper.eaAccountNumber + " - " + $scope.completeObjLocal.wrapper.eaAccount + " " + $scope.globalVars.using + " " + $scope.completeObjLocal.wrapper.fundName);
		// $scope.praxisComplete_p1_1 = $scope.praxisComplete_p1_1.replace('{2}', $scope.completeObjLocal.wrapper.service);
		$scope.praxisComplete_p1_1 = $scope.globalVars.praxisComplete_p1_1;

		// Usage and Billing....
		$scope.praxisComplete_p1_6 = $scope.globalVars.praxisComplete_p1_6.replace('{0}', $scope.completeObjLocal.wrapper.serviceID);
		$scope.praxisComplete_p1_6 = $scope.praxisComplete_p1_6.replace('{1}', $scope.completeObjLocal.wrapper.eaAccountNumber + " - " + $scope.completeObjLocal.wrapper.eaAccount);
		$scope.praxisComplete_p1_6 = $scope.praxisComplete_p1_6.replace('{2}', $scope.completeObjLocal.wrapper.fundName);
		
		$scope.sidUrl =  $scope.globalVars.sidDetailsUrl
						 +"&_VM_instanceModel="+$scope.completeObjLocal.wrapper.instanceModel
						 +"&_VM_serviceInstanceId="+$scope.completeObjLocal.wrapper.serviceInstanceId
						 +"&_VM_serviceInstanceName="+$scope.completeObjLocal.wrapper.serviceInstanceName
						 +"&_VM_service="+$scope.completeObjLocal.wrapper.service;

		//$scope.daasComplete_p1_1 = $scope.globalVars.daasComplete_p1_1.replace('{0}', $scope.completeObjLocal.wrapper.eaAccountNumber);
		//$scope.daasComplete_p1_1 = $scope.daasComplete_p1_1.replace('{1}', $scope.completeObjLocal.wrapper.eaAccount);
		//$scope.daasComplete_p1_1 = $scope.daasComplete_p1_1.replace('{2}', $scope.completeObjLocal.wrapper.fundName);
		//$scope.daasComplete_p1_1 = $scope.daasComplete_p1_1.replace('{3}', '#');

		$scope.$emit('hideHeaderAndFundInfo',
		{
				"successPage" : true
		});

		newServiceFactory.isPraxisComplete = true;	
	}

	newServiceFactory.clearObjects();
}]);







