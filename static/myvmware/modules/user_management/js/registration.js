/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  registration.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/11/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Vasudeva Moorthy Patnaik)
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */

var shortSmartForm = "shortFormUsrReg";
var communitiesForm = "communitiesUsrReg";
var freeProductForm = "freeProductUsrReg";
var evalProductForm = "evaluationCustReg";
var stdSmartFormUsrReg = "stdSmartFormUsrReg";
var areaOfInterest1="areaOfInterest";
var areaOfInterestHidden=null;

var ftype = null;
var source = null;
var studentJobRoleId = "";
var pressMediaJobRoleId = "";
var industryAnalystJobRoleId = "";
var emailAddressRegistrationMsg = null;
var communityUsernameRegistrationMsg = null;
var isvIdErrMsg = null;
var preSelState = null;
var customerNumber = null;
var program=null;
var saasProgram= null;
var isFreeDomainCheckEnabled=null;
 

/* Function Block starts */

/*
 * This function is used to bind various events to various different elements.
 * Also used to make any initial ajax calls to be made.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function init() {
	vmf.scEvent = true;
	//var langauge=$('#localeFromLiferayTheme').text();
	//loadBundles(langauge);
	
	updateMessage();
	var dateVar = new Date();
	ftype = $("#ftype").val();
	source = $("#source").val();
	deafultsource = $("#sourcePreReq").val();
	areaOfInterestHidden=$("#areaOfInterest").val();
	var prog = $("#programDisplayName").val();
	var siteSection = $("#evalSiteSection").val();
	$("#timeZoneText").val(dateVar);
	$("#txt_email").focusout(checkEmailAddress,true); 
	$("#txt_communityUsername").focusout(checkCommunityUserName); 
	$("#country").change(onCountrySelect);
	//$('#sel_employees_country').change(onEmployeesInCountryChange);
	$("#txt_ISV_number").focusout(function(){
		checkIsvIdNumber(false);
	
	});
	
	if($("#sel_department").val()==""){
		$("#sel_jobRole").attr("disabled", true);
	}

	if(stdSmartFormUsrReg == ftype){ //binding this only for standard smart form.
		
		$('input[name="user.vmwarePartnerCertified"]').change(onVmwarePartnerInfoSelect);
		bindEventToJobRole();
		$("#sel_department").change(onDepartmentChange); 
		
		onVmwarePartnerInfoSelect(); //for processing Yes Partner related events.
		
	// this method is inside tellYourself.js
		initTellYourself();
		//this method is inside tellCompany.js
		initTellCompany();		
		//processAdditionalQuestionsForPartner(true);	
	}
	
	if( evalProductForm == ftype ){
			
		bindEventToJobRole();
		// this method is inside tellYourself.js
		initTellYourself();
		//this method is inside tellCompany.js
		initTellCompany();
		
		hideSalutation();
	}	

	registerFormValidations();
	
	//suppressing key events to allow user to enter only digits.
	restrictKeyPressEvents();
	
	var populateStateBackFromTrilium= $('#backFromTrilliumPage').text();
	if(populateStateBackFromTrilium != undefined && populateStateBackFromTrilium =='true'){
		onCountrySelect();
	}
	customerNumber=$("input[name='user.customerNumber']").val(); //Logged in flow
	if(customerNumber != undefined && customerNumber!='' && customerNumber!=0){
		triggerCountryEventForStatePopulatableCountry();
		handleAdditionalQuestionsPrePopulation();
		processLoggedUserDetails();
	}else{
		triggerCountryEventForStatePopulatableCountry(); //BUG-00031277
	}
	
	if('undefined'!=deafultsource && 'false' == deafultsource){
		vmf.scEvent=false;
		
	}else{
		ominature(source,prog,deafultsource, siteSection);	
	}
	
	validateNoOfEmpsValueSelected();
	if((source=='dwnp')||(source=='DWNP')||(source=='evap')||(source=='EVAP')){
		program=$("#program").val();
		saasProgram= $("#saasProgram").val();
		isFreeDomainCheckEnabled=$("#isFreeDomainCheckEnabled").val();
		if(saasProgram != null && saasProgram=='true'&& isFreeDomainCheckEnabled==1){
			freeDomainCheck(false);
		}
	}
	
	//CR-00013401
	var showEOLPopup = $("#showEOLPopupFlg").val();
	if(showEOLPopup == 'true') {
		vmf.modal.show('eolPopupMsg');
		$('#eolOkBtn').click(function(){
			vmf.modal.hide('eolPopupMsg');
		});
	}
	if((source!='jivp') ||(source!='JIVP')){
	bindEventSubscibe();
	}
}
function bindEventSubscibe(){
$('#subscribe').click(function(){
			if(this.checked){
			$('#subscribe').val(true);
			$('#unSubscribe').val(false);
			 $('#subscribe').attr('checked',true);
			$('#unSubscribe').attr('checked',false);
			}
			else{
			$('#subscribe').val(false);
			$('#unSubscribe').val(true);
			 $('#subscribe').attr('checked',false);
			$('#unSubscribe').attr('checked',true);
			}
			 
		});
}

 
function loadBundles(lang) {
                             jQuery.i18n.properties({
                                name:'message', 
                                 path:'/static/myvmware/modules/user_management/message/', 
                                 mode:'map',
                                 language:lang, 
                                 callback: function() {
                                     updateMessage();
                                 }
                             });
                   }
function updateMessage() {
	requiredMessage=usermanagement.globalVar.requiredMsg;
	validEmailIDMessage=usermanagement.globalVar.invalidEmail;
	//validEmailIDLengthMessage=jQuery.i18n.prop("label.common.validEmailIDLengthMessage");
	validEmailIDNotMatchMessage=usermanagement.globalVar.emailNotMatch;
	validPasswordNotMatchMessage=usermanagement.globalVar.passwordNotMatch;
	alphaNumericMessage=usermanagement.globalVar.validCharsMsg;
	phoneNumberMessage=usermanagement.globalVar.invalidPhoneNum;
	maxlengthMessage=usermanagement.globalVar.maxlengthMsg;
	rangelengthMessage=usermanagement.globalVar.rangelengthMsg;
	digitMessage=usermanagement.globalVar.digitMsg;
	range=usermanagement.globalVar.rangeMsg;
	validAlphaNumericNoSpace=usermanagement.globalVar.invalidUsername;
	selectOne=usermanagement.globalVar.selectOne;
	shortPass = usermanagement.globalVar.tooShortLbl;//'Too Short'
	badPass = usermanagement.globalVar.weakLbl;//'Weak'
	goodPass = usermanagement.globalVar.goodLbl;//'Good'
	strongPass = usermanagement.globalVar.strongLbl;//'Strong'
	defaultPass = usermanagement.globalVar.passwordStrength;//'defeult'
	sameAsUsername = usermanagement.globalVar.samePwdUsername;//'Password is the same as username.'
	
	
	loadingDataForDropDown=usermanagement.globalVar.loadingData;
	summationRangeLengthMessage=usermanagement.globalVar.rangelengthmessage;
	exceedsGlobalEmployeesMessage=usermanagement.globalVar.exceedGlobalEmpMsg;
	deactivatedProfileErrorMessage=usermanagement.globalVar.deactivatedError;
}
/*
 * This function is used to make an Ajax call to check whether the given email
 * address is already registered or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function checkEmailAddress(async) {
	$("#emailCheckStatus").parent().find(".messageHolder").removeClass('hidden');
	$("#emailCheckStatus").html("").hide();
	removeErrorClass($("#emailCheckStatus"));

	var emailId = $("#txt_email").val();
	if (validateEmail(emailId) == false) {
		addErrorClass($("#emailCheckStatus"));
		return;
	}  
		
	if(((source == 'dwnp')||(source =='DWNP')||(source=='evap')||(source=='EVAP'))
	&&(saasProgram != null && saasProgram=='true'&& isFreeDomainCheckEnabled==1)){
		
		
		
		$.ajax({
			
			beforeSend : function(){$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');$("#emailCheckStatus").html("<img src='/static/myvmware/common/img/loading.png' width='16' height='16'/>").show();},
			async : async,
			type : "POST",
			dataType : "text json",
			url : $("#checkEmailAddressAndFreeDomainAjaxUrl").val(),
			data : {
				emailAddress : emailId,
				program : program,
				saasProgram : saasProgram
			},

			success : function(object) {

				try {
					var isAlreadyRegisteredEmail = object.registeredUser;
					var freeDomainFailed = object.freeDomainFailed;
					if (isAlreadyRegisteredEmail) {
						// under this condition the email is registered with the
						// system.
						var vmwenrollmentFlag=object.vmwenrollmentflag;
						var data= null;
						if(vmwenrollmentFlag ==2){
						data=deactivatedProfileErrorMessage;
						}else{
						var redirectUrl = object.redirectUrl;
						var errorMsg =  object.errMsg; //TODO get this value from server.
						var linkLabel = object.linkLabel; 

						data = errorMsg + "<a  href='" + redirectUrl + "' >"+linkLabel+"</a>"; 
						}

						if (data != null) {
							$("#emailCheckStatus").html(data);
							emailAddressRegistrationMsg = data;
							$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');
						} 
						
						addErrorClassForSubAndParentElements($("#emailCheckStatus"));										
					}else{
						
						if(freeDomainFailed!=null && freeDomainFailed !=''){
						domainCheckFailed = freeDomainFailed;
						$("#emailCheckStatus").html(domainCheckFailed);
						emailAddressRegistrationMsg = domainCheckFailed;
						$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');
						addErrorClassForSubAndParentElements($("#emailCheckStatus"));
							
						}else{
						$("#emailCheckStatus").html("");
					    emailAddressRegistrationMsg = null;
						}
					}

				} catch (err) {
					//				console.log(err);(err);
				}
			}
		});
		
	} else{
	$.ajax({
		
		beforeSend : function(){$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');$("#emailCheckStatus").html("<img src='/static/myvmware/common/img/loading.png' width='16' height='16'/>").show();},
		async : async,
		type : "POST",
		dataType : "text json",
		url : $("#checkEmailAddressAjaxUrl").val(),
		data : {
			emailAddress : emailId
		},

		success : function(object) {

			try {
				var isAlreadyRegisteredEmail = object.registeredUser;
				if (isAlreadyRegisteredEmail) {
					// under this condition the email is registered with the
					// system.
					var vmwenrollmentFlag=object.vmwenrollmentflag;
					var data= null;
					if(vmwenrollmentFlag ==2){
					data=deactivatedProfileErrorMessage;
					}else{
					var redirectUrl = object.redirectUrl;
					var errorMsg =  object.errMsg; //TODO get this value from server.
					var linkLabel = object.linkLabel; 

					data = errorMsg + "<a  href='" + redirectUrl + "' >"+linkLabel+"</a>"; 
					}

					if (data != null) {
						$("#emailCheckStatus").html(data);
						emailAddressRegistrationMsg = data;
						$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');
					} 
					
					addErrorClassForSubAndParentElements($("#emailCheckStatus"));					
				} else {
					$("#emailCheckStatus").html("");		  
					emailAddressRegistrationMsg = null;
				
				}

			} catch (err) {
				//				console.log(err);(err);
			}
		}
	});
	}

}
function freeDomainCheck(async){
	
	$.ajax({
		
		beforeSend : function(){$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');$("#emailCheckStatus").html("<img src='/static/myvmware/common/img/loading.png' width='16' height='16'/>").show();},
		async : async,
		type : "POST",
		dataType : "text json",
		url : $("#freeDomainCheckAjaxUrl").val(),
		data : {
			emailAddress : emailId,
			program : program,
			saasProgram : saasProgram
		},

		success : function(object) {

			try {
				var freeDomainFailed = object.freeDomainFailed;
					
					if(freeDomainFailed!=null && freeDomainFailed !=''){
					domainCheckFailed = freeDomainFailed;
					$("#emailCheckStatus").html(domainCheckFailed);
					emailAddressRegistrationMsg = domainCheckFailed;
					$("#emailCheckStatus").parent().find(".messageHolder").addClass('hidden');
					addErrorClassForSubAndParentElements($("#emailCheckStatus"));
						
					}else{
					$("#emailCheckStatus").html("");
				    emailAddressRegistrationMsg = null;
					}

			} catch (err) {
				//				console.log(err);(err);
			}
		}
	});
}

/*
 * This function is used to check whether the entered verify email address is
 * same as the email address.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function verifyEmailAddress() {

	var errorData = usermanagement.globalVar.confirmEmail;

	var emailId = $("#txt_email").val();
	var verifyEmailAddress = $("#txt_verify_email").val();
	if (emailId.indexOf(verifyEmailAddress) == -1) {
		$("#emailVerifyCheckStatus").html(errorData);
		addErrorClass($("#emailVerifyCheckStatus"));
	} else {
		$("#emailVerifyCheckStatus").html("");
		removeErrorClass($("#emailVerifyCheckStatus"));
	}
}

/*
 * This function is used to check whether the entered verify password is same as
 * the password.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function verifyPassword() {

	var errorData = usermanagement.globalVar.diffPwds;

	var password = $("#txt_password").val();
	var verifyPassword = $("#txt_verify_password").val();
	if (password.indexOf(verifyPassword) == -1) {
		$("#passwordVerifyStatus").html(errorData);
		addErrorClass($("#passwordVerifyStatus"));
	} else {
		$("#passwordVerifyStatus").html("");
		removeErrorClass($("#passwordVerifyStatus"));
	}
}

/*
 * This function is used for validating the given email id.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function validateEmail(elementValue) {
	if(elementValue.length < 6) { //BUG-00030619
		return false;
	}
	var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
	return emailPattern.test(elementValue);
}

/*
 * This function is used to make an Ajax call to check whether the given
 * community username is already registered or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function checkCommunityUserName() {
	
	$("#txt_communityUsername_error_msg").hide();
	$("#txt_communityUsername_error_msg").parent().find(".messageHolder").removeClass('hidden');
	$("#txt_communityUsername_error_msg").html("");
	
	// below line checked in for BUG-00031875
	//$('#txt_communityUsername').parents('.ctrlHolder').removeClass('error');
	
	 var communityUserName = $.trim($("#txt_communityUsername").val());      
        if(communityUserName == "" || (!(/^[\w]+$/i.test(communityUserName))) || (communityUserName.length > 50) ){ //BUG-00013073
         if(ftype != communitiesForm){
                 $('#txt_communityUsername').parents('.ctrlHolder').removeClass('error');
                 $('#join_communities').parents('.ctrlHolder').removeClass('error');
                 $("#join_communities").parent().parent().find(".messageHolder").html("");
         }
                return;
        }
		removeErrorClass($("#txt_communityUsername_error_msg"));
	
	$.ajax({
		
		beforeSend : function(){$("#txt_communityUsername_error_msg").parent().find(".messageHolder").addClass('hidden');$("#txt_communityUsername_error_msg").html("<img src='/static/myvmware/common/img/loading.png' width='16' height='16'/>").show();},
		type : "POST",
		async : false,
		dataType : "json",
		url : $("#checkCommunityUserName").val(),
		data : {
			communityUserName : communityUserName 
		},

		success : function(object) {
			$("#txt_communityUsername_error_msg").html("");
			try {
				var alreadyRegistered = object.availablity;
				if (alreadyRegistered == true) {
					var errMsg = object.errMsg;
					$("#txt_communityUsername_error_msg").html(errMsg).show();; 
					$("#txt_communityUsername_error_msg").parent().find(".messageHolder").addClass('hidden');
					addErrorClassForSubAndParentElements($("#txt_communityUsername_error_msg"));
					communityUsernameRegistrationMsg = errMsg;
				} else{
					communityUsernameRegistrationMsg = null;
				}
			} catch (err) {
				//				console.log(err);(err);
			}
		}
	});

}

/*
 * This function is used to make an Ajax call to check for getting state list
 * based on the selected country.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function onCountrySelect() { 

	var selCountry = $("#country").val();  	
	// added if condition to disable below check for logged in flow
	if(customerNumber == undefined || customerNumber =='' || customerNumber==0){
	checkUncheckSubscription(selCountry);
	}
	if (isStatePopulatableCountry(selCountry)) {		

		if(preSelState == null){
			preSelState = $("#state_province").val();
		} 
		clearOptions("#state_province"); // clearing out the previuos options (if any). 
		var options = $("#state_province").attr("options");  
		var option = new Option(loadingDataForDropDown, ""); 
		options[0]= option; 

		$("#stateListDiv").css('display', '');
		//$("#stateListStatus").html('Loading data ..');

		$.ajax({
			type : "POST",
			dataType : "text json",
			crossDomain: false,
			url : $("#statePoupulationUrl").val(),
			data : {
				paramName : "state",
				paramValue : selCountry
			}, 
 
			success : function(object) {
				try {  
					
					var option = new Option(selectOne, "");
					options[0]= option; 				 
					var lovList = object.lovList; 
					
					$.each(lovList, function(idx, value) { 
						var option = new Option(value.description,
								value.code);  
						options[idx+1] = option ;
						
						}); 
					
					$("#state_province").val(preSelState);
					preSelState = '';

				} catch (err) {
					//				console.log(err);(err);
				}
				$("#stateListStatus").html("");
			},
			error: function(jqXHR, textStatus, errorThrown) { 
				//				console.log(err);(errorThrown); 
				//				console.log(err);(textStatus); 
			}
		});

	} else { // Resetting values
		$("#stateListDiv").css('display', 'none');
        $("#state_province").empty();           
                //preSelState = '';     
	} 
	
	
	
	if(source == 'LICP' && ($('input[name="user.vmwarePartnerCertified"]').filter(':checked').val() == "false")){
		
			if("JP" == selCountry){
				$(".additionalQuestions").children('.partnerCallable').show();
			}else{
				$(".additionalQuestions").children('.partnerCallable').hide();
				}
	
		}
		if(source == 'EVAP' && ($("#vmwarePartnerCertified").val() == "false")){
			var jobRoleSelected = $("#sel_jobRole").val(); 
			if("JP" == selCountry){
				$(".additionalQuestions").parents('fieldset').show();
					if(jobRoleSelected!=''&&((studentJobRoleId.indexOf(jobRoleSelected) != -1) || (pressMediaJobRoleId.indexOf(jobRoleSelected) != -1) || (industryAnalystJobRoleId.indexOf(jobRoleSelected) != -1)) ){					
					$(".additionalQuestions").children('.ctrlHolder').hide();
				}
				$(".additionalQuestions").children('.partnerCallable').show();
			}else{
				
				if(jobRoleSelected!=''&&((studentJobRoleId.indexOf(jobRoleSelected) != -1) || (pressMediaJobRoleId.indexOf(jobRoleSelected) != -1) || (industryAnalystJobRoleId.indexOf(jobRoleSelected) != -1)) ){
					$(".additionalQuestions").parents('fieldset').hide();
				}
				$(".additionalQuestions").children('.partnerCallable').hide();
				}
		}
	
	}
	

function checkUncheckSubscription(selCountry){
 
   //var uncheckSubsForCountries = new Array("AU","AT","BD","BE","BT","BR","BG","CA","CK","CR","CY","CZ","DK","EE","FJ","FI","FR","PF","DE","HU","IE","IT","LT","LU","MT","MH","MU","NL","NC","NZ","NO","PW","PG","PE","PL","PT","RO","RU","ES","SE","CH","TR","GB","AW","KY","CI","LV","MC","AN");
	var uncheckSubsForCountries = new Array("AU","AT","BD","BE","BT","BR","BG","CA","CK","CR","CY","CZ","DK","EE","FJ","FI","FR","PF","DE","HU","IE","IT","LT","LU","MT","MH","MU","NL","NC","NZ","NO","PW","PG","PE","PL","PT","RO","RU","ES","SE","CH","TR","GB");
   // List of countries for which uncheck the subscription list needs to be populated  
   var uncheckflag = false;
	 for ( var m = 0; m < uncheckSubsForCountries.length; m++) {
	   if (uncheckSubsForCountries[m] == selCountry){
			uncheckflag = true;
			break;
	  }
 } 

 
  if(uncheckflag){
  $('#unSubscribe').attr('checked',true);
   $('#subscribe').attr('checked',false);
   $('#subscribe').val(false);
   $('#unSubscribe').val(true);
   
  } else {
    $('#subscribe').attr('checked',true);
	$('#subscribe').val(true);
	$('#unSubscribe').attr('checked',false);
	$('#unSubscribe').val(false);
  }
  return false;
 }

 
/*
 * This function is used to validate the given address. Presently, it is done only for US Address.
 * 
 * @param async . this is used to know whether to make a asychronous or synchronous call.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
 
function checkAddress(async){
	
	var selCountry = $("#country").val();  
	var errMsg = false; 
		
		var city = $.trim($("#txt_city").val());//$("#txt_city").val();
		var zipCode = $.trim($("#txt_zip_postal_code").val());//$("#txt_zip_postal_code").val();
		var state = $("#state_province").val();
		
		if(city != "" && zipCode != "" &&
				state != "" && selCountry != ""){ 
			
//			$("#stateListDiv").css('display', ''); 

			$.ajax({
				async : async,
				type : "POST",
				dataType : "text json",
				crossDomain: false,
				url : $("#validateAddressUrl").val(),
				data : {
					city : city,
					zipCode : zipCode,
					state : state,
					country : selCountry
				}, 
				success : function(object) {
					 
						var isValidAddress = object.valid;
						if (isValidAddress == false) {
							errMsg = object.errMsg; 
						}else{							
							errMsg="";
						}
					isValidAddress = object.valid;
					
				},
				error: function(jqXHR, textStatus, errorThrown) { 
					//				console.log(err);(errorThrown); 
					//				console.log(err);(textStatus); 
				}
			});

		}
	return errMsg;
}

function trilliumServiceAddressValidation(){
    var selCountry = $("#country").val();  
	var address1 = $("#txt_address1").val();
	var city = $.trim($("#txt_city").val());
	var zipCode = $.trim($("#txt_zip_postal_code").val());
	var state = $("#state_province").val();
	var str= false;	
			if(city != "" && zipCode != "" &&
					state != "" && selCountry != ""&& address1!=""){ 
				if(isTrilliumCountry(selCountry)){
					$.ajax({
							async : false,
							type : "POST",
							dataType : "text json",
							url : $("#standardizedAddressValidationUrl").val(),
							data : {
								
								city : city,
								zipCode : zipCode,
								state : state,
								country : selCountry,
								address1:address1
							}, 
							success : function(object) {
									var isValidAddress = object.isValid;
									var errMsg = object.errorMsg;
									if (isValidAddress == true && errMsg!="") {
										errMsg = "<label class='error' for='txt_address1'>" + errMsg + "</label>";
										showDashBoardError();
										$("#address1CheckStatus").html(errMsg);
										addErrorClassForSubAndParentElements($("#address1CheckStatus"));
										$("#txt_address1").focus();
										$('#txt_address1').blur(function() {
											$("#address1CheckStatus").html(errMsg);
											addErrorClassForSubAndParentElements($("#address1CheckStatus"));
										});
										str= true;
									}else{
										$("#address1CheckStatus").html("");	
										removeErrorClass($("#address1CheckStatus"));
										str= false;
									}
							}
						});
				}
		}
		return str;
}


/*
 * This function is used to check whether for the selected company the state
 * information needs to be populated.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isStatePopulatableCountry(country) {
	
	if(country == "KR" && $("#localeFromLiferayTheme").text()=="ko_KR"){ //Korean Locale is special condition. When the locale is Korean, states needs to be displayed
	      return true;
	}
	
	var enableStatesForCountries = new Array("IN", "US", "AU", "CA", "CN", "JP","BR","MX"); // List of countries for which state list needs to be populated  

	for ( var i = 0; i < enableStatesForCountries.length; i++) {
		if (enableStatesForCountries[i] == country){		    
			return true;
		}
	}
}
/*
 * This function is used to check whether for the selected county is US
 * 
 * @author Kanhaiya Saxena
 */
function isLangaugeCountry(country) {
	var enableLangaugeForCountries = new Array("US"); // List of countries for which state list needs to be populated  

	for ( var i = 0; i < enableLangaugeForCountries.length; i++) {
		if (enableLangaugeForCountries[i] == country){
			return false;
			}else {
				return true;
			}
	}
}
/*
 * This function is used to check whether somw one has enter community name
 * 
 * @author Kanhaiya Saxena
 */
function isCommunitySelected(community) {
		if (community.length == 0){
			return false;
		}
		else{
			return true;
		}
}
/*
 * check for hidden string in areaOfInterest for enable validation
 * 
 * @author Kanhaiya Saxena
 */
function isValidationRequired() {
	if($('input[name="user.vmwarePartnerCertified"]').filter(':checked').val() == "false"){
		if (areaOfInterestHidden.search("datacenter_cloud_infrastructure")!=-1){
			return true;
		}else if (areaOfInterestHidden.search("infrastructure_operations_management")!=-1){
			return true;
		}else if (areaOfInterestHidden.search("secutiry_products")!=-1){
			return true;
		}else if (areaOfInterestHidden.search("IT_business_management")!=-1){
			return true;
		}else {
		return false;
		}
	}else{
		return false;
	}
		
}
/*
 * check for hidden string in areaOfInterest for enable validation
 * 
 * @author Kanhaiya Saxena
 */
function isValidationRequiredForNoOfDesktop() {
		if (($('input[name="user.vmwarePartnerCertified"]').filter(':checked').val() == "false") && (areaOfInterestHidden.search("desktop_end-use_computing")!=-1)){
			return true;
		}else{
		return false;
		}
		
}

/*
 * This function is used to check whether for the selected company, zipcode
 * feild needs to be displayed or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isZipCodePopulatableCountry(country) {
	var enableZipcodeForCountries = new Array("US"); // List of countries
	// for which zipcode
	// list needs to be
	// populated.

	for ( var i = 0; i < enableZipcodeForCountries.length; i++) {
		if (enableZipcodeForCountries[i] == country)
			return true;
	}
}
/*
 * This function is used to check whether for the selected company, city field
 * needs to be displayed or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isCityDivPopulatableCountry(country) {
	var enableCityForCountries = new Array("US"); // List of countries for
	// which city list needs to
	// be populated.

	for ( var i = 0; i < enableCityForCountries.length; i++) {
		if (enableCityForCountries[i] == country)
			return true;
	}
}
/*
 * This function is used to make a Ajax call for checking whether for the given
 * ISV ID number is valid or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function checkIsvIdNumber(async) {
	
	$("#txt_ISV_number_error_msg").html("").hide();
	$("#txt_ISV_number_error_msg").parent().find(".messageHolder").removeClass('hidden');
	removeErrorClass($("#txt_ISV_number_error_msg"));
	
	if(!$.trim($("#txt_ISV_number").val()).length){
		addErrorClass($("#txt_ISV_number_error_msg"));
		 return false;
	}

	$.ajax({
		
		beforeSend : function(){$("#txt_ISV_number_error_msg").parent().find(".messageHolder").addClass('hidden');$("#txt_ISV_number_error_msg").html("<img src='/static/myvmware/common/img/loading.png' width='16' height='16'/>").show();},
		async : async,
		type : "POST",
		dataType : "json",
		url : $("#checkIsvIdNumberUrl").val(),
		data : {
			isvIdNumber : $("#txt_ISV_number").val()
		},

		success : function(object) {
			try {
				var isValidNumber = object.valid;
				if (isValidNumber != null && isValidNumber == false) {
					var errMsg = object.errMsg;
					$("#txt_ISV_number_error_msg").html(errMsg);
					addErrorClassForSubAndParentElements($("#txt_ISV_number_error_msg"));
					isvIdErrMsg = errMsg;
				}else{
					isvIdErrMsg = "";
					$("#txt_ISV_number_error_msg").html("");
					$("#txt_ISV_number_error_msg").parent().find(".messageHolder").addClass('hidden');
					removeErrorClass($("#txt_ISV_number_error_msg"));
				}
			} catch (err) {
				//				console.log(err);(err);
			}
		} 
	});

}

function addErrorClass(element) {
	element.parent().addClass('error');
	//element.addClass('error_msg');
}

function addErrorClassForSubAndParentElements(element) {
	element.parent().addClass('error');
	element.addClass('error_msg');
}

function removeErrorClass(element) {
	element.parent().removeClass('error');
	element.removeClass('error_msg');
	//Added To Fix the bug 13340
	element.parents('.subCtrlHolder').removeClass('error');
	element.parents('.ctrlHolder').find('#numOfEmp').removeClass('error');
	//END
}

function loadDropdowns(fields,url) { 
	populateDefaultOption(fields,loadingDataForDropDown);
	 
//	$.getJSON($(url).val(), function(data) {
//		populateValues(data, fields);
//	})
//	.error(function(fields){populateDefaultOption(fields,"Error Occurred loading list ..");});
		
	$.ajax({
		  url: $(url).val(),
		  dataType: 'text json',
		  success: function(data) {
						populateValues(data, fields);
					}
		});
}
function populateValues(data,fields){
	$.each(fields, function(fieldName,fieldID) {
		valueList = data[fieldName];
		var selectedOption= $(fieldID+" option:selected").val();
		var options=$(fieldID).attr("options");
		
		//options[0]= new Option(selectOne,"");
		$(fieldID+" option")[0].text=selectOne;
		$(fieldID+" option")[0].value="";
		$(fieldID+" option")[0].selected=true;
		$.each(valueList,function(idx,value){ 
			options[idx+1] = new Option(value.description,value.code);
		});
		$(fieldID).val(selectedOption);
		
		if(fieldID == "#sel_department" && selectedOption!=""){
			$(fieldID).change();
			//$(fieldID+" option")[0].removeAttr("selected");
		}

	} );
}
function populateDefaultOption(fields,msg){	
	try{
		$.each(fields, function(fieldName,fieldID){ 
			var option= $(fieldID+" option:selected").val();
			if (!$(fieldID+" option:selected").length) {
				option = new Option(msg,"");			
			}
			$(fieldID).attr("options")[0] = option;
		});
	}catch(e){
		//				console.log(err);(e);
	}
}

function clearOptions(selField) {
	if($(selField).attr("options").length>0){
		$(selField).empty();
	}
}

/**
 * Check if the country is US or not
 * 
 * @param country
 * @returns {Boolean}
 */
function isSelectedCountryUS(country){
	
	if(country == "US")
		return true;
}

function removeErrorClassCommunity(element) {
	if((element.attr('id')== 'communities_error')&& communityUsernameRegistrationMsg != null && $.trim($("#txt_communityUsername").val()).length > 0)
	{
	// do not remove any error
	showDashBoardError();
	}else{
	element.parent().removeClass('error');
	element.removeClass('error_msg');
	//Added To Fix the bug 13340
	element.parents('.subCtrlHolder').removeClass('error');
	element.parents('.ctrlHolder').find('#numOfEmp').removeClass('error');
	//END
	}
}

function registerFormValidations() { 
	
	var sumMin = 0; //used in elementSummation method.
	var sumMax = 0;
	
	$.validator.methods.customRule = function(value, element, param) {
	      return value == param;
	    };
	
	$.validator.methods.email = function(value, element) {
		return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(value);
	}
	    
    $.validator.addMethod("notEqual", function(value, element, param) {
    	if(value != '' && value != null){
    		return value.toLowerCase() != $(param).val().toLowerCase();
    	}
    	else {
    		return value != $(param).val();
    	}
    }, usermanagement.globalVar.specifyADiffVal); 
    
    //$.validator.addMethod("alphaNumeric", function(value, element) { 
    //	return this.optional(element) || /^[a-zA-Z0-9!�$%&�#()@*\+,\/;\[\\\]\^_`{|}~ ]+$/i.test(value); }, "Please enter only numbers, letters and //special characters"); 
    
    $.validator.addMethod("alphaNumericNoSpace", function(value, element) { 
    	return this.optional(element) || /^[\w ]+$/i.test(value); }, alphaNumericMessage); 
    
    $.validator.addMethod("alphaNumericNoSpaceCommunity", function(value, element) { 
    	return this.optional(element) || /^[\w]+$/i.test(value); }, alphaNumericMessage);
    
    $.validator.addMethod("phoneNumber", function(value, element) {         
    	return this.optional(element) || /^[0-9\-\+\.\(..\)\s]+$/i.test(value);     }, phoneNumberMessage);  
    
	$.validator.addMethod("requiredEula", $.validator.methods.required," ");
	
	$.validator.addMethod("emailequalToIgnoreCase", function (value, element, param) {
        return value.toLowerCase() == $(param).val().toLowerCase();},validEmailIDNotMatchMessage);
	
	$.validator.addMethod("elementSummation", function(value, element, params) {  //BUG-00025555
		 
		var sum = 0;
    	var selectedElements = $('.'+params[2]);
    	$.each(selectedElements, function(idx, value) {
    		var data = $(value).val();
    		if(data != ''){
        		sum = sum+ parseInt(data);  
    		}
		});
	
    	var min = parseInt(params[0])
    	var max = parseInt(params[1]) 
    	
    	if(min<=sum && sum<=max ){
    		return true;
    	}else{
    		return false;
    	}
		
    }, $.format(summationRangeLengthMessage)  );  

    $.extend($.validator.messages, {
		requiredEula: " ",
	    required: requiredMessage,
	    digits:digitMessage,
	    range:$.format(range) 
	});

  $.validator.addClassRules({
		 classRequired: {
			required: {
                depends: function(element) {  
                	return $(element).is(":visible");
                }
    		}
		 },
		classDigitRangeZeroToTen: {
			digits : true,
			range : [1,10]
		 },
		classDigitRangeOneToNintyNine: {
			digits : true,
			range : [1,99]
			 },
		classDigitRangeOneToNineNintyNine: {
			digits : true,
			range : [1,999]
				 },
		classRequiredEula:{
			requiredEula :{
                depends: function(element) {  
                	return $(element).is(":visible");
                }
    		}
		},
		classSumElementsClassDigitRangeOneToNineNintyNine:{
			digits : true,
			elementSummation : [1,999,'classSumElementsClassDigitRangeOneToNineNintyNine']
		}
		});
		
	if(ftype == shortSmartForm){
		$("#shortFormUsrRegForm").validate(
				{
					rules : {
						'user.emailAddress': {
							required : true,
							email : true,
							minlength : 6,
							maxlength : 100
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : '#txt_email'
						}
						,
						'user.password':{
							required : true,
							rangelength: [6,20]
							
						},
						'txt_verify_password' : { 
							equalTo : '#password'
						},
						'user.firstName' : {
							required : true,
		                    maxlength : 50
		                    //alphaNumeric : true
						},
						'user.lastName' : {
							required : true,
		                    maxlength : 50
		                    //alphaNumeric : true
						},
						'user.organization': {
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP' || source == 'ISVP' || source =='ACTP');
					                }
							},
							maxlength : 200
		                    //alphaNumeric : true
						},
						'user.workPhone': {
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP');
					                }
							},
							maxlength : 20,
							phoneNumber : true
						},
						'user.address1': {
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP' || source == 'ISVP' || source =='ACTP');
						      }
							},
							maxlength : 100
							//alphaNumeric : true
						},
						'user.address2': {
							maxlength : 100
							//alphaNumeric : true 
						},
						'user.country':{
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP' || source == 'ISVP'|| source =='ACTP');
					                }
							}
						},
						'user.state':{
							required : {
								depends: function(element){ 
									return isStatePopulatableCountry($("#country").val());
								}
							}
						},
                        'user.city':{
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP' || source == 'ISVP'|| source =='ACTP');
					                }
							},
							maxlength : 100
							//alphaNumeric : true
						},						
						'user.zipcode':{  
							required : {
								 depends: function(element) {
					                    return (source == 'OEMP' || source == 'ISVP'|| source =='ACTP');
					                }
							},
							maxlength : 50
							//alphaNumeric : true
						},
						'user.isvIdNumber':{  
							required : {
								depends: function(element){ 
 									return (source == 'ISVP');
								}
							},
							maxlength : 100,
							alphaNumericNoSpace : true
						},
						'tou.accepted' : {
							required : true
						}
						
					},
					messages : {
						'user.emailAddress': {
							required : requiredMessage,
							email : validEmailIDMessage,
							minlength : validEmailIDMessage,
							maxlength : $.format(maxlengthMessage)
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : validEmailIDNotMatchMessage
						}
						,
						'user.password':{
							required : requiredMessage,
							rangelength: $.format(rangelengthMessage)
						},
						'txt_verify_password' : { 
							equalTo : validPasswordNotMatchMessage
						},
						'user.firstName' : {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
                           // alphaNumeric : 'Please enter only numbers, letters and special characters'
						}
						,
						'user.lastName' : {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.organization': {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.workPhone': {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
						},
						'user.address1': {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
                            //alphaNumeric : 'Please enter only numbers, letters and special characters'							
						},
						'user.address2': {
							maxlength : $.format(maxlengthMessage)
                           // alphaNumeric : 'Please enter only numbers, letters and special characters'							
						},
						'user.country':{
							required : requiredMessage
						},
						'user.state':{
							required : requiredMessage
						},
                        'user.city':{
                        	required :  requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},						
						'user.zipcode':{
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.isvIdNumber':{  
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage),
							alphaNumericNoSpace : alphaNumericMessage
						},
						'tou.accepted' : {
							required : " "
						}
					}
					,
					errorPlacement : function(error, element) { 
						var errorDiv = element.parents('.ctrlHolder').find('.messageHolder'); 
						errorDiv.html(error);
						addErrorClass(errorDiv);			
					}, 
					showErrors: function(errorMap, errorList) {
						for (var i = 0; errorList[i]; i++) {
							var element = this.errorList[i].element;
							this.errorsFor(element).remove();
						}
						this.defaultShowErrors();
						if($('#emailCheckStatus').text().length > 0){
							$('#txt_email').addClass('error');
							$('#txt_email').parents('.ctrlHolder').addClass('error');
							$('#emailCheckStatus').show();
						}
					},
					onfocusout: function(element){
						this.element(element);
					},
					success : function(em) {
						removeErrorClass(em.parent());
					},
					invalidHandler: function (form, validator) {
						showDashBoardError();
//						clearPasswordFields();
					}, 
					submitHandler: function(form) {
						if(customerNumber == undefined || customerNumber=='' || customerNumber==0){
							var processEmail = processEmailAddressCheck(); 
							if(processEmail == true){
								return;
							} 
						}
						
						var processAddress = processAddressCheck();   
						if(processAddress == true){
							return;
						} 
						
						if(source == "ISVP"){
							var processIsvId = processIsvIdCheck();   
							if(processIsvId == true){
								return;
							}  
						}
						
//						if(source == "OEMP"){
//						   	var processTrillium = trilliumServiceAddressValidation(); 
//							if(processTrillium == true){
//							 	return;
//							}  
//						}
						
						
						hideDashBoardError(); 	 
						form.submit();
						$(".button.primary").attr('disabled',true);
				   }
					
				});
	}else if(ftype == communitiesForm){
		
		$("#communitiesUsrRegForm").validate(
				{
					rules : {
						'user.emailAddress': {
							required : true,
							email : true,
							minlength : 6,
							maxlength : 100
						},
						'user.verifyEmailAddress':{
							emailequalToIgnoreCase : '#txt_email'
						},
						'user.password':{
							required : true,
							rangelength: [6,20]
						},
						'txt_verify_password' : { 
							equalTo : '#password'
						},
						'user.firstName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
							
						},
						'user.lastName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
						}, 
						'user.country':{
							required : true
						},
						'user.state':{
							required : {
								depends: function(element){ 
									return isStatePopulatableCountry($("#country").val());
								}
							}
						} , 
						'user.community.username':{
							required : true,
							maxlength : 50,
							alphaNumericNoSpaceCommunity : true
						},
						'user.community.joinVmCommunities':{
							required : true
						},
						'tou.accepted' : {
							required : true
						}
						
					},
					messages : {
						'user.emailAddress': {
							required : requiredMessage,
							email : validEmailIDMessage,
							minlength : validEmailIDMessage,
							maxlength : $.format(maxlengthMessage)
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : validEmailIDNotMatchMessage
						},
						'user.password':{
							required : requiredMessage,
							rangelength: $.format(rangelengthMessage)
						},
						'txt_verify_password' : {
							equalTo : validPasswordNotMatchMessage
						},
						'user.firstName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						}
						,
						'user.lastName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
						}, 
						'user.country':{
							required : requiredMessage
						},
						'user.state':{
							required : requiredMessage
						} , 
						'user.community.username':{
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage),
							alphaNumericNoSpaceCommunity : validAlphaNumericNoSpace //BUG-00013075
						},
						'user.community.joinVmCommunities':{
							required: requiredMessage
						},
						'tou.accepted' : {
							required : " "
						}
					},
					errorPlacement : function(error, element) {
						
						var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
						errorDiv.html(error);
						addErrorClass(errorDiv);			
					},
					showErrors: function(errorMap, errorList) {
						for (var i = 0; errorList[i]; i++) {
							var element = this.errorList[i].element;
							this.errorsFor(element).remove();
						}
						this.defaultShowErrors();
						if($('#emailCheckStatus').text().length > 0){
							$('#txt_email').addClass('error');
							$('#txt_email').parents('.ctrlHolder').addClass('error');
							$('#emailCheckStatus').show();
						}
						if($('#txt_communityUsername_error_msg').text().length > 0){
							$('#txt_communityUsername').addClass('error');
							$('#txt_communityUsername').parents('.ctrlHolder').addClass('error');
							$('#txt_communityUsername_error_msg').show();
						}
					},
					success : function(em) {
						removeErrorClassCommunity(em.parent());
					}, 
					onfocusout: function(element){
						this.element(element);
					},
					invalidHandler: function (form, validator) {
						showDashBoardError();
//						clearPasswordFields();
					}, 
					submitHandler: function(form) {
						
						var processCommunityUsername = processCommunityUsernameCheck();
						
						if(customerNumber == undefined || customerNumber=='' || customerNumber==0){
							var processEmail = processEmailAddressCheck(); 
							if(processEmail == true){
								return;
							} 
						}
						
						
						if(processCommunityUsername == true){
							return;
						}  
						
//						var processAddress = processAddressCheck();   
//						if(processAddress == true){
//							return;
//						}    
						 
						
						hideDashBoardError();
						form.submit();
						$(".button.primary").attr('disabled',true);
				   }
					

				});
		
	}else if(ftype == freeProductForm){
		$("#freeProductUsrRegForm").validate(
				{	
					rules : {
						'user.emailAddress': {
							required : true,
							email : true,
							minlength : 6,
							maxlength : 100
						},
						'user.verifyEmailAddress':{
							emailequalToIgnoreCase : '#txt_email'
						},
						'user.password':{
							required : true,
							rangelength: [6,20]
						},
						'txt_verify_password' : {
							equalTo : '#password'
						},
						'user.firstName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
							
						},
						'user.lastName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
						}, 
		            	'user.workPhone' : {
		            		required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		},
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
		            	'user.workPhoneExt' : { 
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
						'user.city': {
							required : true,
		                    maxlength : 100
		                   // alphaNumeric : true
						}, 
						'user.zipcode':{
							  required : true,
			                  maxlength : 50
			                //  alphaNumeric : true
						},
						'user.organization': {  
							required : true,
							maxlength : 200
		                   // alphaNumeric : true
						},
						'user.address1': {
							required : true,
							maxlength : 100
                           // alphaNumeric : true							
						},
						'user.address2': {
							maxlength : 100
//alphaNumeric : true
						},
						'user.country':{
							required : true
						},
						'user.state':{
							required : {
								depends: function(element){ 
									return isStatePopulatableCountry($("#country").val());
								}
							}
						},
//						'eula.accepted':{
//	required : true
//						},
						'tou.accepted' : {
							required : true
						} 
						
					},
					messages : {
						'user.emailAddress': {
							required : requiredMessage,
							email : validEmailIDMessage,
							minlength : validEmailIDMessage,
							maxlength: $.format(maxlengthMessage)
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : validEmailIDNotMatchMessage
						},
						'user.password':{
							required : requiredMessage,
							rangelength: $.format(rangelengthMessage)
						},
						'txt_verify_password' : {
							equalTo : validPasswordNotMatchMessage
						},
						'user.firstName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.lastName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},   
						'user.workPhone' : { 
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		        		},
		            	'user.workPhoneExt' : { 
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		            	},
						'user.city' : {
		                    required :  requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                    //alphaNumeric : 'Please enter only numbers, letters and special characters'
		            	},
		            	'user.zipcode' : {
		                    required :  requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                   //alphaNumeric : 'Please enter only numbers, letters and special characters'
		            	},
		            	'user.organization': {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.address1': {
							required : requiredMessage,
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.address2': {
							maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.country':{
							required : requiredMessage
						},
						'user.state':{
							required : requiredMessage
						},
//						 'eula.accepted':{
//							required : requiredMessage
//						},
						'tou.accepted' : {
							required : " "
						}
					},
					errorPlacement : function(error, element) {
												
								
							var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
							
							errorDiv.html(error);
							addErrorClass(errorDiv);		
						 
						
					},
					showErrors: function(errorMap, errorList) {
						for (var i = 0; errorList[i]; i++) {
							var element = this.errorList[i].element;
							this.errorsFor(element).remove();
						}
						this.defaultShowErrors();
						if($('#emailCheckStatus').text().length > 0){
							$('#txt_email').addClass('error');
							$('#txt_email').parents('.ctrlHolder').addClass('error');
							$('#emailCheckStatus').show();
						}
					},
					onfocusout: function(element){
						this.element(element);
					},
					success : function(em) {
						removeErrorClass(em.parent());
					},
					invalidHandler: function (form, validator) {
						showDashBoardError();
//						clearPasswordFields();
					}, 
					submitHandler: function(form) {
						if(customerNumber == undefined || customerNumber=='' || customerNumber==0){
							var processEmail = processEmailAddressCheck(); 
							if(processEmail == true){
								return;
							} 
						}
						
						var processAddress = processAddressCheck();   
						if(processAddress == true){
							return;
						}   
						
						hideDashBoardError();
						form.submit();
						$(".button.primary").attr('disabled',true);
				   }

				});
		
	} else if(ftype == evalProductForm) {
		$("#evaluationCustRegForm").validate(
				{ 
					rules : {
						'user.emailAddress': {
							required : true,
							email : true,
							minlength : 6,
							maxlength : 100
						},
						'user.verifyEmailAddress':{
							emailequalToIgnoreCase : '#txt_email'
						},
						'user.password':{
							required : true,
							rangelength: [6,20]
						},
						'txt_verify_password' : {
							equalTo : '#password'
						},
						'user.firstName' : {
		                    required : true,
		                    maxlength : 50
		                    //alphaNumeric : true
		            	},
		            	'user.lastName' : {
		                    required : true,
		                    maxlength : 50
		                    //alphaNumeric : true
		            	},
						'user.department' : {
							required : true
						},
						'user.jobRole' : {
							required : true
						},
						'user.jobTitle' : {
		            		maxlength : 50
			                //alphaNumeric : true
		            	},
		            	'user.workPhone' : {
		            		required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		},
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
		            	'user.workPhoneExt' : { 
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
		            	'user.organization' : {
		                    required : true,
		                    maxlength : 200
		                    //alphaNumeric : true
		            	},
		            	'user.industry' : {
		                    required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		}
		            	},
		            	'user.noOfEmployees' : {
		            		required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		}
		            	}, 
		            	'user.address1' : {
		                    required : true,
		                    maxlength : 100
                            //alphaNumeric : true							
		            	},
		            	'user.address2' : {
		                    maxlength : 100
                            //alphaNumeric : true							
		            	},
		            	'user.city' : {
		                    required : true,
		                    maxlength : 100
		                    //alphaNumeric : true
		            	},
		            	'user.zipcode' : {
		                    required : true,
		                    maxlength : 50
		                   // alphaNumeric : true
		            	},
						'user.country':{
							required : true
						},
						'user.state':{
							required : {
								depends: function(element){ 
									return isStatePopulatableCountry($("#country").val());
								}
							}
						},
//						'eula.accepted':{
//							required : true
//						},
						'user.community.username':{
							required : {
								depends: function(element){ 
									var joinVmComm = $('input[name="user.community.joinVmCommunities"]').filter(':checked').val();
									if(joinVmComm == undefined || joinVmComm == 'undefined'){
										return false;
									}else{
										return true;
									}
									 
								}
							},
							maxlength : 50,
							alphaNumericNoSpaceCommunity : true
						},
						'user.community.joinVmCommunities':{
							required : {
								depends: function(element){ 
								return isCommunitySelected($("#txt_communityUsername").val());
								}
							}
						},
						'tou.accepted' : {
							required : true
						}
						
					},
					messages : {
						'user.emailAddress': {
							required : requiredMessage,
							email : validEmailIDMessage,
							minlength : validEmailIDMessage,
							maxlength: $.format(maxlengthMessage)
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : validEmailIDNotMatchMessage
						},
						'user.password':{
							required : requiredMessage,
							rangelength: $.format(rangelengthMessage)
						},
						'txt_verify_password' : {
							equalTo : validPasswordNotMatchMessage
						},
						'user.firstName' : {
		        			required : requiredMessage,
		        			maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
		        		},
		        		'user.lastName' : {
		        			required : requiredMessage,
		        			maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
		        		},
						'user.department' : {
							required : requiredMessage
						},
						'user.jobRole' : {
							required : requiredMessage
						},
						'user.jobTitle' : {
		        			maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
		        		},
						'user.workPhone' : { 
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		        		},
		            	'user.workPhoneExt' : { 
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		            	},
						'user.organization':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.industry':{
							required : requiredMessage
						},
						'user.noOfEmployees':{
							required : requiredMessage
						}, 
						'user.address1':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
                           // alphaNumeric : 'Please enter only numbers, letters and special characters'							
						},
						'user.address2' : {
		                    maxlength : $.format(maxlengthMessage)
                            //alphaNumeric : 'Please enter only numbers, letters and special characters'							
		            	},
						'user.city':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.zipcode':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.country':{
							required : requiredMessage
						},
						'user.state':{
							required : requiredMessage
						},
//						'eula.accepted':{
//							required : requiredMessage
//						},  
						'user.community.username':{
							required: requiredMessage,
							maxlength: $.format(maxlengthMessage),
							alphaNumericNoSpaceCommunity : validAlphaNumericNoSpace 
						},
						'user.community.joinVmCommunities':{
							required: requiredMessage
						},
						'tou.accepted' : {
							required : " "
						}
					},
					errorPlacement : function(error, element) {
						
						var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
						errorDiv.html(error);
						//addErrorClass(errorDiv);
						//tO FIX THE DEFECT 1334
						//errorDiv.addClass('error_msg');
						if(element.attr('id')== 'sel_employees_globally'){
                            element.parents('.subCtrlHolder').addClass('error');
                            element.parents('.ctrlHolder').find('#numOfEmp').addClass('error');
                        }else{ 
                            element.parents('.ctrlHolder').addClass('error');
                        }
						//END	
					},
					showErrors: function(errorMap, errorList) {
						for (var i = 0; errorList[i]; i++) {
							var element = this.errorList[i].element;
							this.errorsFor(element).remove();
						}
						this.defaultShowErrors();
						if($('#emailCheckStatus').text().length > 0){
							$('#txt_email').addClass('error');
							$('#txt_email').parents('.ctrlHolder').addClass('error');
							$('#emailCheckStatus').show();
						}
						if($('#txt_communityUsername_error_msg').text().length > 0){
							$('#txt_communityUsername').addClass('error');
							$('#txt_communityUsername').parents('.ctrlHolder').addClass('error');
							$('#txt_communityUsername_error_msg').show();
						}
						if($('#sel_employees_country').parents('.ctrlHolder').hasClass('error')){
							
							$('#sel_employees_country').parents('.ctrlHolder').find('.messageHolder').find('label').show();
						}
					},
					onfocusout: function(element){
						this.element(element);
					},
					success : function(em) {
 						removeErrorClass(em.parent());
					},
					invalidHandler: function (form, validator) {
						showDashBoardError();
//						clearPasswordFields();
					}, 
					submitHandler: function(form) { 
						
						if($('#sel_employees_country').parents('.ctrlHolder').hasClass('error')){
							
							$('#sel_employees_country').parents('.ctrlHolder').find('.messageHolder').find('label').show();
							$('#sel_employees_country').focus();
							return false;
						}
						
						if(customerNumber == undefined || customerNumber=='' || customerNumber==0){
							var processEmail = processEmailAddressCheck(); 
							if(processEmail == true){
								return;
							} 
						} 

						var processCommunityUsername = processCommunityUsernameCheck();   
						if(processCommunityUsername == true){
							return;
						}  

						var processAddress = processAddressCheck();   
						if(processAddress == true){
							return;
						}  
		
						hideDashBoardError();  
						$(".button.primary").attr('disabled',true);
						s.sendFormEvent('s', s.pageName, 'UserRegistrationForm');
						setTimeout(function(){form.submit();}, 10000);	
				   }

				});			
	} else if(ftype == stdSmartFormUsrReg){

		$("#stdSmartFormUsrRegForm").validate(
				{
					rules : {
						'user.emailAddress': {
							required : true,
							email : true,
							minlength : 6,
							maxlength : 100
						},
						'user.verifyEmailAddress':{
							emailequalToIgnoreCase : '#txt_email'
						},
						'user.password':{
							required : true,
							rangelength: [6,20]
						},
						'txt_verify_password' : {
							equalTo : '#password'
						},
						'user.firstName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
							
						},
						'user.lastName' : {
							required : true,
							maxlength: 50
							//alphaNumeric : true
						}, 
						'user.department' : {
							required :true
						},
						'user.jobRole' : {
							required : true
						},
//						'user.jobTitle' : { 
//		            		maxlength : 50,
//			                alphaNumeric : true
//		            	},
		            	'user.workPhone' : {
		            		required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		},
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
		            	'user.workPhoneExt' : { 
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
//		            	'areaOfInterest':{
//		            		required : true
//		            	},

						'user.organization' : {
		                    required : true,
		                    maxlength : 200
		                   // alphaNumeric : true
		            	},
		            	'user.industry' : {
		                    required : {
                                depends: function(element) {  
                                	return $(element).is(":visible");
                                }
		            		}
		            	},
//		            	'user.noOfEmployees' : {
//		                    required : {
//                                depends: function(element) {  
//                                	return $(element).is(":visible");
//                                }
//		            		}
//		            	}, 
		            	'user.address1' : {
		                    required : true,
		                    maxlength : 100
                           // alphaNumeric : true							
		            	},
		            	'user.address2' : {
		                    maxlength : 100
                           // alphaNumeric : true							
		            	}
		            	,
		            	'user.city' : {
		                    required : true,
		                    maxlength : 100
		                    //alphaNumeric : true
		            	},
		            	'user.zipcode' : {
		                    required : true,
		                    maxlength : 50
		                   // alphaNumeric : true
		            	},
						'user.country':{
							required : true
						},
//						'user.language':{
//							required : {
//								depends: function(element){ 
//									var value = $('input[name="user.vmwarePartnerCertified"]').val();
//									if("true" == value){  
//										return false;
//									}
//									return isLangaugeCountry($("#country").val());
//								}
//							}
//						},
//						 
						'user.state':{
							required : {
								depends: function(element){ 
									return isStatePopulatableCountry($("#country").val());
								}
							}
						}
						,
						'user.community.username':{
							required : {
								depends: function(element){ 
									var joinVmComm = $('input[name="user.community.joinVmCommunities"]').filter(':checked').val();
									if(joinVmComm == undefined || joinVmComm == 'undefined'){
										return false;
									}else{
										return true;
									}
									 
								}
							},
							maxlength : 50,
							alphaNumericNoSpaceCommunity : true
						},
					'user.community.joinVmCommunities':{
							required : {
								depends: function(element){ 
								return isCommunitySelected($("#txt_communityUsername").val());
								}
							}
						},
						'tou.accepted' : {
							required : true
						}
					
					},
					messages : {
						'user.emailAddress': {
							required : requiredMessage,
							email : validEmailIDMessage,
							minlength : validEmailIDMessage,
							maxlength: $.format(maxlengthMessage)
						},
						'user.verifyEmailAddress':{ 
							emailequalToIgnoreCase : validEmailIDNotMatchMessage
						},
						'user.password':{
							required : requiredMessage,
							rangelength: $.format(rangelengthMessage)
						},
						'txt_verify_password' : {
							equalTo : validPasswordNotMatchMessage
						},
						'user.firstName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						}
						,
						'user.lastName' : {
							required : requiredMessage,
							maxlength: $.format(maxlengthMessage)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.department' : {
							required : requiredMessage
						},
						'user.jobRole' : {
							required : requiredMessage
						},
//						'user.jobTitle' : {
//		        			maxlength: $.format(maxlengthMessage),
//		        			alphaNumeric : alphaNumericMessage
//		        		},
						'user.workPhone' : {
		        			required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		        		},
		            	'user.workPhoneExt' : { 
		                    maxlength : $.format(maxlengthMessage),
		                    phoneNumber : phoneNumberMessage
		            	},
//		        		'areaOfInterest':{
//		            		required : requiredMessage
//		            	},
						'user.organization':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                    //alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.industry':{
							required : requiredMessage
						},
//						'user.noOfEmployees':{
//							required : requiredMessage
//						}, 
						'user.address1':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
							//alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.address2' : {
		                    maxlength : $.format(maxlengthMessage)
                           // alphaNumeric : 'Please enter only numbers, letters and special characters'							
		            	},
						'user.city':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.zipcode':{
							required : requiredMessage,
		                    maxlength : $.format(maxlengthMessage)
		                    //alphaNumeric : 'Please enter only numbers, letters and special characters'
						},
						'user.country':{
							required : requiredMessage
						},
//						'user.language':{
//							required : requiredMessage
//						}, 
						'user.state':{
							required : requiredMessage
						}
						,
						'user.community.username':{
							required: requiredMessage,
							maxlength: $.format(maxlengthMessage),
							alphaNumericNoSpaceCommunity : validAlphaNumericNoSpace 
						},
						'user.community.joinVmCommunities':{
							required: requiredMessage
						},
						'tou.accepted' : {
							required : " "
						}
					
					},
					errorPlacement : function(error, element) {
												
						var errorDiv=null;
						if(element.attr('name')== areaOfInterest1){
							errorDiv = $('#areaOfInterestPlace').find('.messageHolder');
						}else{
							errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
						}
						errorDiv.html(error);
						addErrorClass(errorDiv);	 
						
					},
					showErrors: function(errorMap, errorList) {
						for (var i = 0; errorList[i]; i++) {
							var element = this.errorList[i].element;
							this.errorsFor(element).remove();
						}
						this.defaultShowErrors();
						if($('#emailCheckStatus').text().length > 0){
							$('#txt_email').addClass('error');
							$('#txt_email').parents('.ctrlHolder').addClass('error');
							$('#emailCheckStatus').show();
						}
						if($('#txt_communityUsername_error_msg').text().length > 0){
							$('#txt_communityUsername').addClass('error');
							$('#txt_communityUsername').parents('.ctrlHolder').addClass('error');
							$('#txt_communityUsername_error_msg').show();
						}
					},
					onfocusout: function(element){
						this.element(element);
					},
					success : function(em) {
						removeErrorClass(em.parent());
					},
					invalidHandler: function (form, validator) {
						showDashBoardError();
//						clearPasswordFields();
					}, 
					submitHandler: function(form) { 		 
						
						if(customerNumber == undefined || customerNumber=='' || customerNumber==0){
							var processEmail = processEmailAddressCheck(); 
							if(processEmail == true){
								return;
							} 
						}					
						var processCommunityUsername = processCommunityUsernameCheck();   
						if(processCommunityUsername == true){
							return;
						} 
						
						var processAddress = processAddressCheck();   
						if(processAddress == true){
							return;
						}
						
						hideDashBoardError();
						$(".button.primary").attr('disabled',true);
						s.sendFormEvent('s', s.pageName, 'stdSmartFormUsrRegForm');
						setTimeout(function(){form.submit();}, 10000);
				   }

				});
	} 
}
/*
 * This function is used to display the error dashboard.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function showDashBoardError(){
	$('div .errorDashBoard').css('display', '');
}

/*
 * This function is used to hide the error dashboard.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function hideDashBoardError(){
	$('div .errorDashBoard').css('display', 'none'); 
}

/*
 * This function is used to enable elements.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function enableElement(element){
	element.removeAttr('disabled');
}

/*
 * This function is used to disable elements.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function disableElement(element){
	element.attr('disabled', true);
} 

/*
 * This function is used enable and disable certain element based on the value of the VMware Partner Info selected.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function onVmwarePartnerInfoSelect() {
	var value = $('input[name="user.vmwarePartnerCertified"]').filter(':checked').val();
	
	if("true" == value){ 

		$("#sel_department").parents('.ctrlHolder').show();
		$("#sel_jobRole").parents('.ctrlHolder').show();
//		$("#txt_work_phone").parents('.ctrlHolder').hide(); //BUG-00025780
//		$("#txt_work_phone_ext").parent('.ctrlHolder').hide();

//		$("#txt_work_phone").val('');
//		$("#txt_work_phone_ext").val('');
		
		
	}else{
		
		$("#sel_department").parents('.ctrlHolder').show();
		$("#sel_jobRole").parents('.ctrlHolder').show();
//		$("#txt_work_phone").parents('.ctrlHolder').show();
//		$("#txt_work_phone_ext").parent('.ctrlHolder').show();
		

	} 
	
}

/*
 * This function is used to bind the on change event for job role.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function bindEventToJobRole() {
	$("#sel_jobRole").change(onJobRoleChange);
}

/*
 * This function is called when the the Job Role data is changed.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function onJobRoleChange() {
	
	var jobRoleSelected = $("#sel_jobRole").val(); 
	var selCountry = $("#country").val(); 

	if(jobRoleSelected == undefined ){ //BUG-00030821
		return;
	}
	
	if(( jobRoleSelected!='') && ((studentJobRoleId.indexOf(jobRoleSelected) != -1) || (pressMediaJobRoleId.indexOf(jobRoleSelected) != -1) || (industryAnalystJobRoleId.indexOf(jobRoleSelected) != -1)) ){
		$("#txt_jobTitle").parent('.ctrlHolder').hide();
	//	$("#txt_work_phone").parents('.ctrlHolder').hide();
	//	$("#txt_work_phone_ext").parent('.ctrlHolder').hide();	
	//	$("#sel_industry").parents('.ctrlHolder').hide();	

		$("#txt_jobTitle").val('');
	//	$("#txt_work_phone").val('');
	//	$("#txt_work_phone_ext").val('');
		
		//Fix for BUG 00032907	
		if(ftype != stdSmartFormUsrReg)
		{
			$("#txt_work_phone").parents('.ctrlHolder').hide();
			$("#txt_work_phone_ext").parent('.ctrlHolder').hide();
			$("#txt_work_phone").val('');
			$("#txt_work_phone_ext").val('');
		}		
		if(ftype == evalProductForm || ftype == stdSmartFormUsrReg){  
			$("#sel_employees_globally").parents('.ctrlHolder').hide();  
			$("#sel_employees_country").parents('.ctrlHolder').hide();  			
			$(".sel_employees_globally").hide();			
			$("#sel_industry").parents('.ctrlHolder').hide();
			
			$('#sel_employees_globally').attr('selectedIndex', '0');
			$('#sel_employees_country').attr('selectedIndex', '0');
			$('#sel_industry').attr('selectedIndex', '0'); 
			
			$(".additionalQuestions").parents('fieldset').hide();
			if("JP" == selCountry){
				$(".additionalQuestions").parents('fieldset').show();
				$(".additionalQuestions").children('.ctrlHolder').hide();
				$(".additionalQuestions").children('.partnerCallable').show();
			}else{
				$(".additionalQuestions").children('.partnerCallable').hide();
				}
			
		}
	}else{
 
		$("#txt_jobTitle").parent('.ctrlHolder').show();
		$("#txt_work_phone").parents('.ctrlHolder').show();
		$("#txt_work_phone_ext").parent('.ctrlHolder').show();	

		if(ftype == evalProductForm || ftype == stdSmartFormUsrReg){  
			$("#sel_employees_globally").parents('.ctrlHolder').show();  
			$("#sel_employees_country").parents('.ctrlHolder').show();  
			$("#sel_industry").parents('.ctrlHolder').show(); 			
			$(".sel_employees_globally").show();	
			$(".sel_industry").parents('.ctrlHolder').show();
			
			$(".additionalQuestions").parents('fieldset').show();
			$(".additionalQuestions").children('.ctrlHolder').show();
			if("JP" == selCountry){
				$(".additionalQuestions").children('.partnerCallable').show();
			}else{
				$(".additionalQuestions").children('.partnerCallable').hide();
				}
			
		}
	}
	
}

/*
 * This function is called for processing additional questions, when the partner selected is yes.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processAdditionalQuestionsForPartner(displayAdditionalQuestions){
	
	if($('input[name="user.vmwarePartnerCertified"]').filter(':checked').val() == "true"){
		if(displayAdditionalQuestions){ 
			$(".additionalQuestions").children('.ctrlHolder').hide();
		}
		$(".additionalQuestions").children('.purchasePrdctsDiv').show();
		
//		$(".additionalQuestions").parents('fieldset').hide();
	}else{
//		$(".additionalQuestions").parents('fieldset').show(); 
//		$(".additionalQuestions").children('.ctrlHolder').hide();
		
//		$(".additionalQuestions").children('.purchasePrdctsDiv').hide();

		$(".additionalQuestions").children('.ctrlHolder').hide();
		$("#virtualization_budget").parents('.ctrlHolder').show();
		$(".additionalQuestions").children('.salesCall').show();
		$("#AQ_storage_type").parents('.ctrlHolder').show(); 
	}
}
/*
 * This function is called for processing additional questions for the area of interest section.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processAdditionalQuestionsForAreaOfInterest(data){
	var datas = data.split(",");
	
	var displayGenDiv = false;
	var dispalyDesktopDiv = false;
	
	var noDisplayData =  "vFabric_could_application_platform,application_management,mac_products,other"; 
	var displayGen = "datacenter_cloud_infrastructure,infrastructure_operations_management,secutiry_products,IT_business_management"; 
	var displayDesktop = "desktop_end-use_computing"; 
	
	
	for(var i=0;i<datas.length;i++){ 
		var temp = datas[i];

		if(temp != ""){
			
			if (displayDesktop.indexOf(temp) != -1) {
				dispalyDesktopDiv = true;
		    }
	
			if(displayGen.indexOf(temp) != -1){
				displayGenDiv = true;
			}
		}
	}

	$(".additionalQuestions").children('.noOfDesktops').hide();
	$(".additionalQuestions").children('.AOICommon').hide();
	
	if(dispalyDesktopDiv){
		$(".additionalQuestions").children('.noOfDesktops').show();
	}
	if(displayGenDiv){
		$(".additionalQuestions").children('.AOICommon').show();
	}
	
	$(".additionalQuestions").show();
	 
}

/*
 * This function is called for checking whether the email address is processed or not. Based on this method, the form submission will be happening.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processEmailAddressCheck(){
	checkEmailAddress(false);
	
	if(emailAddressRegistrationMsg != null ){
		showDashBoardError();
//		clearPasswordFields();
		$("#emailCheckStatus").html(emailAddressRegistrationMsg); 
		addErrorClass($("#emailCheckStatus"));
		$("#txt_email").focus();
		return true;
	}
}

/*
 * This function is called for checking whether the email address is processed or not. Based on this method, the form submission will be happening.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processAddressCheck(){
	var selCountry = $("#country").val();  						
	if(isSelectedCountryUS(selCountry)){
		var errMsg = checkAddress(false);
		if(errMsg != ""){
			errMsg = "<label class='error' for='txt_address1'>" + errMsg + "</label>";
			showDashBoardError();
//			clearPasswordFields();
			$("#zipPostalCodeCheckStatus").html(errMsg);
			addErrorClass($("#zipPostalCodeCheckStatus"));
			$("#txt_zip_postal_code").focus();
			$('#txt_zip_postal_code').blur(function() {
				$("#zipPostalCodeCheckStatus").html(errMsg);
				addErrorClass($("#zipPostalCodeCheckStatus"));
			});
			return true;
		}else{
			$("#zipPostalCodeCheckStatus").html("");	
			removeErrorClass($("#zipPostalCodeCheckStatus"));							
		}
	}	
	return false;
}

/*
 * This function is called for checking whether the community username is process or not. Based on this method, the form submission will be happening.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processCommunityUsernameCheck(){
	if(communityUsernameRegistrationMsg != null && $.trim($("#txt_communityUsername").val()).length > 0){
		showDashBoardError();
//		clearPasswordFields();
		$("#txt_communityUsername_error_msg").html(communityUsernameRegistrationMsg).show(); 
		//$("#txt_communityUsername_error_msg").css('display', ''); //BUG-00029417
		//addErrorClass($("#txt_communityUsername_error_msg"));
		addErrorClassForSubAndParentElements($("#txt_communityUsername_error_msg"));
		$("#txt_communityUsername").focus();
		return true;
	}
}
/*
 * This function is called for checking whether the partner info selected is yes or no.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isVmwarePartner(){
	var value = $('input[name="user.vmwarePartnerCertified"]').filter(':checked').val(); 
	if("true" == value){
		return false;
	}else{
		return true;
	}
}

 

function isVmwarePartner_1(){
	var value = $('input[name="user.vmwarePartnerCertified"]').val(); 
	if("true" == value){
		return false;
	}else{
		return true;
	}
}

/*
 * This function is called for loading less valued prospect users..
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function populateLessValuedProspectUserType(){

	$.ajax({
		type : "POST",
		dataType : "text json",
		url : $("#getJobRoleListLessValuedProspectUrl").val(), 
		success : function(object) {

			try {
				var studentRoleTemp = object.Student;
				var temp = "";
				for(var i=0;i<studentRoleTemp.length;i++){
					temp = temp +"," +studentRoleTemp[i];
				}
				studentJobRoleId = temp;
				
				var pressMediaTemp = object.pressMedia;
				temp = "";
				for(var i=0;i<pressMediaTemp.length;i++){
					temp = temp +"," +pressMediaTemp[i];
				}
				pressMediaJobRoleId = temp;
				
				var industryAnalystTemp = object.industryAnalyst;
				temp = "";
				for(var i=0;i<industryAnalystTemp.length;i++){
					temp = temp +"," +industryAnalystTemp[i];
				}
				industryAnalystJobRoleId = temp;
				 

			} catch (err) {
//				//				console.log(err);(err);
			}
		}
	});

}

/*
 * This function is called for checking whether the ISV ID is processed or not. Based on this method, the form submission will be happening.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processIsvIdCheck(){

	checkIsvIdNumber(false);
	
	if(isvIdErrMsg != ""){
		showDashBoardError();
//		clearPasswordFields();
		$("#txt_ISV_number_error_msg").html(isvIdErrMsg);
		addErrorClass($("#txt_ISV_number_error_msg")); 
		$("#txt_ISV_number_error_msg").focus();
		return true;
	}

	return false;
}


/*
 * This function is called for clearing password fields.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function clearPasswordFields(){
	$("#password").val('');
	$("#txt_verify_password").val('');
}

/*
 * This function is called whenever the department is changed..
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function onDepartmentChange(){ 
	
	$("#txt_jobTitle").parent('.ctrlHolder').show();
	$("#txt_work_phone").parents('.ctrlHolder').show();
	$("#txt_work_phone_ext").parent('.ctrlHolder').show();
}
function onAreaOfInterestSelect(){
	
	var value = $('input[name="user.vmwarePartnerCertified"]').filter(':checked').val(); 

	if("false" == value){
		var selectedElements = $("input[name='areaOfInterest']:checked");
		
		if(selectedElements.length > 0){
			var data = "";
			$.each(selectedElements, function(idx, value) {   
				data = data+","+$(value).val();  
				});
			areaOfInterestHidden = data; 
			processAdditionalQuestionsForAreaOfInterest(data);
		}else{
			areaOfInterestHidden = "";
			processAdditionalQuestionsForAreaOfInterest("");
			
		}
	}else{
		areaOfInterestHidden = "";
	}
}
/*
 * This function is called to process the input elements of the form for a logged in user. 
 * This method will mark the empty valued elements (which are required) in red color.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function processLoggedUserDetails(){

	var regForm = $("#ftype").parents('form');
	regForm.find(":input").each(function(){
		
		 var input = $(this); 		 
		 if(input.is(":visible")){
			 var type = input.attr("type");
			 var selectbox = input.attr("id");
			 if(type=="text" || type=="select-one" || type=="checkbox" ){  
				 var name = input.attr("name");
				 var val = input.val();
				
				 if((val == '') && (isRequiredElements(name))){ 
					 input.parents('.ctrlHolder').addClass('error'); 
				 }
				 if(type=="select-one"){
					 var $inputVal = $("#"+selectbox +" option:selected").attr("value");
					 if(($inputVal == "") && (isRequiredElements(name))){ 
						 input.parents('.ctrlHolder').addClass('error'); 
					 }
				 }
			 }
			 if(type=="checkbox"){    
				 if(isRequiredCheckBoxElements(input)){ 
					 input.parents('.ctrlHolder').addClass('error'); 
					 input.change(function() {
							if(!$(this).valid()){
							input.parents('.ctrlHolder').addClass('error');
							}
							});
				 }
			 }
		 } 
		 
	});	 

}
/*
 * This function will check whether the given element is required or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isRequiredElements(elementName){
	
	if(elementName == 'user.state' && preSelState != ''){
		return false;
	}
	if(elementName == 'user.community.username' && ( source == 'LICP' || source == 'DWNP' || source == 'EVAP') ){
		return false;
	}
	
	var unRequiredElement = new Array("user.prefix","user.jobTitle","user.workPhoneExt","user.noOfEmployeesInYourCountry","user.address2"); 

	for ( var i = 0; i < unRequiredElement.length; i++) {
		if (unRequiredElement[i] == elementName)
			return false;
	} 
	
	return true;
}
/*
 * This function will check whether the given check box element is required or not.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function isRequiredCheckBoxElements(element){
	
	var name = element.attr("name");
	var nameFilter = "input[name='"+name+"']";

	var len = $(nameFilter).filter(':checked').length;
	if(len > 0){
		return false;
	}	
			
	var isRequired = element.hasClass("classRequired");
	if(isRequired){		 
		return true;
	}
	var isRequiredEula =element.hasClass("classRequiredEula");
	if(isRequiredEula){
		return true;
	}
	
	return false;
}
/*
 * This function is used to trigger an onChange event for a pre selected country which contains states to be populated.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function triggerCountryEventForStatePopulatableCountry(){
	var country = $("#country");  
	if(country.val() != ''){
		country.change();
	}
}
 

function isTrilliumCountry(country){
	// var trilliumCountries = new Array("US","FR","CA","DE","AU","CH","ES","NL","IT","GB");
    var trilliumCountries = new Array("US","CA","AU"); 
    var str = false;
	for ( var i = 0; i < trilliumCountries.length; i++) {
		if (trilliumCountries[i] == country)
			str=true;
	} 
	
	return str;
}

/*
 * This function is used to prepopulate the additional questions.
 * 
 * @author Vasudeva Moorthy Patnaik
 */
function handleAdditionalQuestionsPrePopulation(){
	var addQueAnswered = $("#aqAnswered").val();
	if(addQueAnswered == undefined){
		return;
	}
	
	addQueAnswered = addQueAnswered.replace(/\+/g, ' ');
	var  addQueAnswered_tmp_1 = addQueAnswered.split("||");	

	var checkCustomerPartener=false;
	if (addQueAnswered.indexOf("AQ_purchased_vmware_products") != -1) {					 
					 for(var i=0;i<addQueAnswered_tmp_1.length;i++){ 
							var  addQueAnswers= addQueAnswered_tmp_1[i].split(":");							
							if("AQ_purchased_vmware_products" == addQueAnswers[0]){
								checkCustomerPartener=addQueAnswers[1];
							}
						}
					if(checkCustomerPartener == 'true'){
						$("#AQ_purchased_vmware_products_Yes").attr('checked','checked');
						$("#AQ_purchased_vmware_products_No").removeAttr('checked');
					}else{
						$("#AQ_purchased_vmware_products_Yes").removeAttr('checked');
						$("#AQ_purchased_vmware_products_No").attr('checked','checked');
					}
				 }	
	
	$(".additionalQuestions").find(":input").each(function(){
		
		 	var input = $(this); 
			var name = input.attr("name"); 		
			 
			 var type = input.attr("type");
			 if(type=="text"){  		 
				 if (addQueAnswered.indexOf(name) != -1) {					 
					 for(var i=0;i<addQueAnswered_tmp_1.length;i++){ 
							var  addQueAnswers= addQueAnswered_tmp_1[i].split(":");							
							if(name == addQueAnswers[0]){
								input.val(addQueAnswers[1]);
							}
						}
				 }
			 }
			 if(type=="select-one"){
				 if (addQueAnswered.indexOf(name) != -1) {					 
					 for(var i=0;i<addQueAnswered_tmp_1.length;i++){ 
							var  addQueAnswers= addQueAnswered_tmp_1[i].split(":");							
							if(name == addQueAnswers[0]){
								input.val(addQueAnswers[1]);
							}
						}
				 }
			 }
			 if(type=="checkbox"){  
				 if (addQueAnswered.indexOf(name) != -1) {					 
					 for(var i=0;i<addQueAnswered_tmp_1.length;i++){ 
							var  addQueAnswers= addQueAnswered_tmp_1[i].split(":");			
							if(name == addQueAnswers[0] && addQueAnswers[1]==input.val()){
								input.attr('checked', true);
							}
						}
				 }
			 }
	});	
	 
}
	function ominature(src,prog,deafultsource, siteSection){
		if("DWNP" == src || "EVAP" ==src){
			if(prog!=""){
				var omievnt = siteSection+' : '+prog;
				callBack.addsc({'f':'riaLink','args':[omievnt]});
			}
		}else{
			sendToOminature(src,deafultsource);
		}
	}

	function sendToOminature(omievent){
		
		if('JIVP' == omievent){
		
			callBack.addsc({'f':'riaLink','args':['communities']});
		}
		
		if('ISVP' == omievent){
			
			callBack.addsc({'f':'riaLink','args':['isv']});
		}
		
		if('false'!=deafultsource && 'LICP' == omievent){
			
			callBack.addsc({'f':'riaLink','args':['license-standard-form']});
		}
		
		if('OEMP' == omievent){
			
			callBack.addsc({'f':'riaLink','args':['oem']});
		}
		
		if('ACTP' == omievent){
			callBack.addsc({'f':'riaLink','args':['short-form']});
		}
		
		/*if('undefined'!=deafultsource && 'false' == deafultsource){
			
			callBack.addsc({'f':'riaLink','args':['']});
		}*/
		
	}

	function regInsOminature(){
		riaLink('registration : activation-instructions'); 
		return true;
	}
	
	
 /**   function onEmployeesInCountryChange() {
        var $this = $(this);
        var employee_country = $('#sel_employees_country').val();
        var employee_globally = $('#sel_employees_globally').val();
        if(employee_country > employee_globally){
              //displaying the error message
              $this.parent().append("<div id='errmsg'>Employee's in Country should be less than Global Employees</div>");
              return false;
        }else{
              $this.parent().find("#errmsg").remove();
              return true;
        }
  }**/
	
  function hideSalutation(){
	  var locales = new Array("ja_JP","ko_KR","zh_CN"); 
	    
		for (var i = 0; i < locales.length; i++) {
			if (locales[i] == $("#localeFromLiferayTheme").text())
				$('#salutation').hide();
		} 
  }
  
 function restrictKeyPressEvents(){
	  
	  $(".classDigitRangeZeroToTen,	.classDigitRangeOneToNintyNine,	" +
	  		".classDigitRangeOneToNineNintyNine,.classSumElementsClassDigitRangeOneToNineNintyNine").keydown(function(event){

	        // Allow only backspace and delete
	        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9) {
	            // let it happen, don't do anything
	        }
	        else {
	            // Ensure that it is a number and stop the keypress
	            if ((event.shiftKey==1) || ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ))) {
	                event.preventDefault(); 
	            }   
	        }
	    });       
  }
 
 /**
  * Compares the values selected by the user under No_Of_Emp_Global and No_Of_Emp_Country
  * and displays error message accordingly.
  * 
  */
 function validateNoOfEmpsValueSelected(){	
		
		$('#sel_employees_globally, #sel_employees_country').change(function(){
			
			$('#sel_employees_country').parents('.ctrlHolder').find('.messageHolder').html('');
			$('#sel_employees_country').parents('.ctrlHolder').removeClass('error');
			
			var selGlobalOption = $('#sel_employees_globally option:selected');
			var globalOptions = $('#sel_employees_globally').find('option');
			
			var selCountryOption = $('#sel_employees_country option:selected');
			var countryOptions = $('#sel_employees_country').find('option');
			
			if(selGlobalOption.val() != "" && selGlobalOption.val() != globalOptions[globalOptions.length - 1].value){
				
				if(selCountryOption.val() != "" && selCountryOption.val() != countryOptions[countryOptions.length - 1].value){

					if($('#sel_employees_globally').attr('selectedIndex') < $('#sel_employees_country').attr('selectedIndex')){
						
						$('#sel_employees_country').addClass('error');
						$('#sel_employees_country').parents('.ctrlHolder').addClass('error');
						$('#sel_employees_country').parents('.ctrlHolder').find('.messageHolder').html("<label class='error'>"+ exceedsGlobalEmployeesMessage +"</label>");
					}
				}
			}
		});
	}

 