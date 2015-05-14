angular.module('estimatorFactoryModule',[])
.factory('newServiceFactory',['$http','ajaxCall','$filter', '$modal', "$rootScope", "$anchorScroll", function($http, ajaxCall, $filter, $modal, $rootScope, $anchorScroll){

	var factory = {};
	$rootScope.$on("$locationChangeSuccess", function() {
               $anchorScroll();
    });
	factory.chooseService = {};
	factory.configureService ={};
	factory.serviceObj = {};
	factory.viewEstimateObj = {};
	factory.offeringPartner={};
	factory.daasFlow=false;
	factory.allPartners={};
	factory.defaultPartner={};
	factory.displaySelectedPartner={};
	factory.selectedBufferPartner={};
	factory.oneTimeClick=false;
	factory.selPartnerRadio=false;
	factory.defaultPartnerCheck=false;
	factory.addOnObj = {};
	factory.globalVars = vCredit.globalVars;
	factory.config = vCredit.globalVars;
	factory.completeObj={};
	factory.successServiceObj = {};
	factory.isDashboardFlow = false;
	factory.getURLParam = '';
	factory.configuratorHomePageData = {};
	factory.adminDetail = {};
	factory.configuratorLinksObj = {};
	factory.isPraxisFlow = false;
	factory.fundInfo = {};
	factory.currentCartId = "CURRENT_TRIAL_EST";
	factory.generatedCartId = "";
	factory.tokenToMSRPConversion = {};

	factory.getFundInfo = function(data){
		if(data.commitInfo == null || data.commitInfo == undefined){
			console.log("Commit Info is not available. Portal Issue");
		}
		if((data.fundInfo == null || data.fundInfo == undefined) && data.commitInfo != undefined){
			factory.fundInfo.name = data.commitInfo.name;
			factory.fundInfo.identifierName = data.commitInfo.name;
			factory.fundInfo.trueUp = 1;
			if(data.commitInfo.threshold != undefined && !isNaN(data.commitInfo.threshold)){
				factory.fundInfo.fundBalance = data.commitInfo.threshold;
			}else{
				factory.fundInfo.fundBalance = data.commitInfo.commitLevel;
			}
			factory.redemptionCurrency = data.commitInfo.redemptionCurrency;
			factory.redemptionCurrencySymbol = data.commitInfo.redemptionCurrencySymbol;
			factory.fundInfo.isXaasFund = 1;
			factory.fundInfo.fundAccess = 1;
			factory.fundInfo.commitLevel = data.commitInfo.commitLevel;
			factory.fundInfo.currentConsumption = data.commitInfo.currentConsumption;
		}
	}

	factory.getParameterByName = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	factory.getServices = function(callbackFn,url,data,method){		
		ajaxCall.call(url, method, data, callbackFn);
	}

	factory.postServices = function(successFn,errorFn,url,data,method){		
		ajaxCall.call(url, method, data, successFn, errorFn);
	}

	factory.clearObjects = function(){
		factory.serviceObj = {};
		factory.addOnObj = {};
		factory.completeObj={};
		factory.successServiceObj = {};
	}

	//For Showing Confirm Dialog Box, with "Yes" and "No" Options
	factory.cancelFlow = function(callbackFn){
		vmf.msg.confirm(factory.globalVars.cartPopOver_ModalMsg, factory.globalVars.modal_confirm , factory.globalVars.continueBtn, factory.globalVars.modal_cancel, function(){
			if(typeof callbackFn == 'function'){
				callbackFn();
			}
		});
	}

	factory.showConfirmModal = function(modalMsg, modalHeading, modalPositiveBtnLabel, modalNegativeBtnLabel, callbackFn, coreSeriveiIndex, addOn_Name, addOnServiceIndex){
		vmf.msg.confirm(factory.globalVars[modalMsg], factory.globalVars[modalHeading] , factory.globalVars[modalPositiveBtnLabel], factory.globalVars[modalNegativeBtnLabel], function(){
			if(typeof callbackFn == 'function'){
				callbackFn(coreSeriveiIndex, addOn_Name, addOnServiceIndex);
			}
		});
	}

	factory.tierDiscount = function(tierInfo, supportTierInfo, label, preSelectedQty, currency, paymentId, currencyCode){
		preSelectedQty = parseInt(preSelectedQty);
		if(isNaN(preSelectedQty) || preSelectedQty == undefined || preSelectedQty == null){
			preSelectedQty = 0;
		}
		//console.log(Object.keys(tierInfo)[Object.keys(tierInfo).length-1]);
		
		var max_tier = Object.keys(tierInfo)[Object.keys(tierInfo).length-1];
		var min_tier = Object.keys(tierInfo)[0];
		var discountTextString = "";
		var qtyArray = [];
		
		if(paymentId == "1"){
			label = "";
		}else{
			label = " " + label;
		}

		label = "";
		angular.forEach(tierInfo, function(val, key){
			
			qtyArray = key.split("_");
			if((parseInt(qtyArray[1])-parseInt(preSelectedQty)) > 0){
				discountTextString += factory.globalVars.quantityText + " ";
				var selectedKey = key;

				var initialQuantity = (parseInt(qtyArray[0])-parseInt(preSelectedQty));
				if(initialQuantity <= 0){
					initialQuantity = 1;
				}

				if(min_tier == max_tier && parseInt(qtyArray[0])!=parseInt(qtyArray[1])){
					discountTextString += parseInt(qtyArray[0]) + "+";
				}else if(min_tier == key){
					discountTextString += parseInt(qtyArray[0]) + "-" + (parseInt(qtyArray[1])-parseInt(preSelectedQty));
				}else if(max_tier != key){
					discountTextString += initialQuantity + "-" + (parseInt(qtyArray[1])-parseInt(preSelectedQty));
				}else{
					discountTextString += initialQuantity + "+";
				}

				var tierCost = 0;
				tierCost = changeNumber(val[0]);
				
				//for support tier quantity when earlier selected quantity > 0
				if((parseInt(qtyArray[0])+parseInt(preSelectedQty)) >= qtyArray[0] && (parseInt(qtyArray[1])+parseInt(preSelectedQty)) <= qtyArray[1]){
					selectedKey = (parseInt(qtyArray[0])+parseInt(preSelectedQty)) + "_" + (parseInt(qtyArray[1])+parseInt(preSelectedQty));				
				}

				//for support cost			
				if(!$.isEmptyObject(supportTierInfo)){
					if(supportTierInfo[selectedKey] != undefined && supportTierInfo[selectedKey] != null){
							tierCost = tierCost + changeNumber(supportTierInfo[selectedKey][0]);
					}
				}
				
				var currFilter = $filter('customCurrency');
				var filteredCurrency = currFilter(tierCost, currency, currencyCode);
				discountTextString += ": "+ filteredCurrency + label + "&nbsp;&nbsp;&nbsp;";

				//discountTextString += ": "+ currency + parseFloat(tierCost).toFixed(2) + label + "&nbsp;&nbsp;&nbsp;";
			}
			
		});


		//console.log(discountTextString);
		return discountTextString;
	}
	
	function changeNumber(amount){
		var number = Number(amount.replace(/[^0-9\.]+/g,""));

		return number;
	}

	factory.steps = [
				{
					"link" : "configureService",
					"linkText" : factory.globalVars.configureService,
					"header" : factory.globalVars.buildAnEstimate,
					"active" : 0,
					"changeFund" : true
				},
				{
					"link" : "configureAddons",
					"linkText" : factory.globalVars.addAdditionalCapacity,
					"header" : factory.globalVars.buildAnEstimate,
					"active" : 0,
					"changeFund" : false
				},
				{
					"link" : "viewEstimate",
					"linkText" : factory.globalVars.viewEstimate,
					"header" : factory.globalVars.buildAnEstimate,
					"active" : 0,
					"changeFund" : false
				}
			];
	return factory;

}]);