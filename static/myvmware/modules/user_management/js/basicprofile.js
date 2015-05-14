
	var enableStatesForCountries = new Array("IN","US","AU","CA","CN","JP","BR","MX");
	
	var extraSpaces = '&nbsp;&nbsp;&nbsp;';
	
	var emailAddressHasError=false;
	
	function bindPersonalInfoEvents(){
		vaildateDeactivateProfile();
//		$('#deactivateProfile').click(function(){
//			vaildateDeactivateProfile();
//			return false; //returning false cancels the click event to happen
//		});
		$("#user_newEmailAddress").focusout(checkEmailAddress,true);
		
		$('#deactivateButton').click(function(){
		    deactivateProfile();
			return false; //returning false cancels the click event to happen
		});
		
		$('#savePersonalInfo').click( function(){
			//vmf.loading.show();
			submitPersonalForm();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
			return false; //returning false cancels the click event to happen
		} ); 
		
		$('#saveCompanyInfo').click( function() {
			submitCompanyForm();
			$('.invUserAddr').hide();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
			return false; 
		} );
				
		$('#saveLoginInfo').click(function(){ 
		if(emailAddressHasError ==false){
			
			submitLoginForm();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
			riaLink('change-email'); 
			}
			return false;
		} );
			
		$('#savePasswordInfo').click(function(){ 
			submitChangePasswordForm();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
			return false;
		} );
				
		$('#saveAdditionalInfo').click( function(){
			submitAdditionalInfoForm();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
			return false;
		} );
		
		// bind toggle event to min max button
  	  	$('.profile-minimize-button').click(function() {
  	  		myvmware.profile.toggleMinMax(this);
  			return false;
  		});
  	  	
  	  	//update the states when country is changed
		$('#user_country').change(function(){
			toggleSelectStateDiv(false);
		});
		
		//update the job roles when dept is changed
		$('#user_dept').change(function(){
			populateJobRoles(false);
		});
		
		//Added for the Ominature
  		/*$('#commOmniTab').click(function() {
  			riaLink('communications'); 
  			return false;
  		});*/
		
  		/*$('#presonalInfoTab').click(function() {
  			riaLink('personal-information'); 
  			return false;
  		});*/
  		
		$('#deactivateProfileTrue').click(function() {
			riaLink('deactivate : warning'); 
			return false;
		});
		
		$('#deactivateProfileFalse').click(function() {
			riaLink('deactivate : warning'); 
			return false;
		});
		
		$('#savePreferenceInfo').click( function(){
			$('#preferencesForm').submit();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
  			return false;
		});

		$('#saveEmailPreferenceInfo').click( function(){
			$('#emailPreferencesForm').submit();
			//oo_beta_updateprofile.show();
			myvmware.common.ooInvokeLocaleSurvey('updateprofile');
  			return false;
		});
		
	}
		
	function bindCancelEvents(){
		
		$('#cancelPersonalInfo').click( function(){
			resetPersonalInfoChanges(this);
			return false; //returning false cancels the click event to happen
		} ); 
		
		$('#cancelCompanyInfo').click( function() {
			var errorAddrMsg = myvmware.profile.getParameterByName("errorCode");
			if (errorAddrMsg=="INV-ADD-ERR") {
				$('.invUserAddr').show();                
            }  
			resetCompanyInfoChanges(this); 
			return false; 
		} );
				
		$('#cancelLoginInfo').click(function(){ 
			resetLoginInfoChanges(this);
			return false;
		} );
			
		$('#cancelPasswordInfo').click(function(){ 
			resetPasswordInfoChanges(this);
			return false;
		} );
				
		$('#cancelAdditionalInfo').click( function(){
			resetAdditionalInfoChanges(this);
			return false;
		} );
	}
	
	function minimizeAllSections(){
		
		var $fieldset = $(document).find('fieldset');
		$fieldset.each(function(){
			myvmware.profile.toggleMinMax($(this).find('.profile-minimize-button'));
		});
	}
	
	function processResponse(data, formSubmitted) {
		
		if(typeof data == 'object' && data['updateStatus'] == 'success'){
			
			if($(formSubmitted).attr('id') == 'savePersonalInfo')
				updateWelcomeMessage();
			return enableReadOnlyMode(formSubmitted);
		
		} else if(typeof data == 'object' && data['updateStatus'] == 'error'){
			
			var errorDiv = $(formSubmitted).parents('fieldset').find('div .errorDashBoard');
			errorDiv.html(data['errorMessage']);
			errorDiv.removeClass('hidden');
		}
		else {
			var errorDiv = $(formSubmitted).parents('fieldset').find('div .errorDashBoard');
			errorDiv.html(usermanagement.globalVar.errorTxt);
			errorDiv.removeClass('hidden');
		}
	}
	
	function updateWelcomeMessage(){
		
		var tempHolder=$('#site-tools').find('li.name').html();
		var $myFirstName =$('#site-tools li.name span.userFirstName');
		var $myLastName = $('#site-tools li.name span.userLastName');
		//if(tempHolder.indexOf("logged in as")==-1){
			$myFirstName.html($('#user_firstname').val());
			$myLastName.html($('#user_lastname').val());
			//$('#site-tools').find('li.name').html("<span class='welcomeMsg'>Welcome,</span><span class='userFirstName'>"+ $('#user_firstname').val() + "</span> <span class='userLastName'>" + $('#user_lastname').val()+'</span>');
			//}else{
			//tempHolder=tempHolder.substring(0,tempHolder.indexOf("as")+2);
			//$('#site-tools').find('li.name').html(tempHolder+' '+ $('#user_firstname').val() + ' ' + $('#user_lastname').val());
		//	}
	}
	
	function submitPersonalForm(){
		//vmf.loading.show();
		$('#personalInfoForm').submit();
		
	}
		
	function submitCompanyForm(){
		
		$('#companyInfoForm').submit();
	}
	
	function submitLoginForm(){
		
		$('#loginInfoForm').submit();
	}
	
	function submitChangePasswordForm(){
		
		$('#passwordInfoForm').submit();
	}
	
	function submitAdditionalInfoForm(){
		
		$('#additionalInfoForm').submit();
	}

	function populateSelectFields() {
		
		var fieldLabels = "prefix,department,industry,NoOfEmp_Global,NoOfEmp_Country,country" ;
		fetchLists(fieldLabels);
	
	}
	
	function fetchLists(fieldLabels) {
			
		var fields = {"prefix":"#user_prefix","department":"#user_dept", "industry":"#user_industry","NoOfEmp_Global":"#user_noOfEmployees", 
			"NoOfEmp_Country":"#user_noOfEmployeesInYourCountry","country":"#user_country"};
		
		$.getJSON($("#getListOfValues").val(), {fieldNames:fieldLabels},function(data) {
			 populateValues(data, fields);});
	
	}
	
	function getAdditionalInfoXMLResponses(customerId){
		
		$.getJSON($("#getXMLResponsesURL").val(), {customerId:customerId},function(data) {
			mapAddtnlInfoXMLResponses(data, $('#additionalInfo_fieldset'));});
	}

function populateJobRoles(onload){
	 
	 var dept = document.getElementById("user_dept");
	 var selDept =dept.options[dept.selectedIndex].value;
	 if($('#user_dept option:selected').val() ==""){
	 clearOptions("#user_jobrole");
	 $("#user_jobrole").attr("disabled", true);
	 $("#sel_jobRole").removeClass("error");
	 }else{
	 	 $("#user_jobrole").attr("disabled", false);
	 }	 
	 if( selDept != "" && selDept != null)
		 fetchJobRolesForDept(selDept, onload);
}
function clearOptions(selField) {
	if($(selField).attr("options").length>0){
		$(selField).empty();
	}
}

function populateValues(data, fields) {	
	
	try{				
			$.each(fields, function(fieldName,fieldID) {
				valueList = data[fieldName];
				var selectedOption= $(fieldID+" option:selected").val();
				
				// if the option has a value and description as 0, 
				//it implies that user didnt not provide a response during registration
				if(($(fieldID+" option:selected").val() == $(fieldID+" option:selected").text())&&
						$(fieldID+" option:selected").val()== 0){
					selectedOption='';
				}
				var options=$(fieldID).attr("options");
				options[0]= new Option(usermanagement.globalVar.selectOne,"");
				$.each(valueList,function(idx,value){
					options[idx+1] = new Option(value.description,value.code);
				});
				$(fieldID).val(selectedOption);
				if(selectedOption == '' || $(fieldID+" option:selected").val()== '')
					$(fieldID + '_readonly').html('');
				else
					$(fieldID + '_readonly').html($(fieldID+" option:selected").text());
			} );
		}catch (err){
			
			console.log("An error occurred while loading the options");
		}
}

function populateListOfValues(data, fields) {	
	
	try{				
			$.each(fields, function(fieldName,fieldID) {
				valueList = data[fieldName];
				if($(fieldID).attr("options").length>0){
					$(fieldID).empty();
				}
				var options=$(fieldID).attr("options");
				options[0]= new Option(usermanagement.globalVar.selectOne,"");
				var prevSelection = $(fieldID).parent().prev('.read-only').text();
				
				$.each(valueList,function(idx,value){
					options[idx+1] = new Option(value.description,value.code);
					if(prevSelection == value.description){
						options[idx+1].selected = true;
					}
				});
				
				if(prevSelection == ''){ // if the user didnt select any, show the default option
					options[0].selected = true;
				}
			} );
		}catch (err){
			
			console.log("An error occurred while loading the options");
		}
}

function showChangePwdDiv(){
	
	document.getElementById('changePasswordDiv').style.display = "";
} 

function closeChangePwdDiv(){
	
	document.getElementById('changePasswordDiv').style.display = "none";
} 

function toggleOwnerOfVMProdDiv(){
	
	if(document.getElementById('user.vmwarePartnerCertified1').checked)
		document.getElementById('ownerOfVMProdDiv').style.display = "none";
	else
		document.getElementById('ownerOfVMProdDiv').style.display = "";
} 

function isStateRequiredForCountry(country) {
	
	for(var i=0;i< enableStatesForCountries.length;i++){
		if(enableStatesForCountries[i] == country)
			return true;
	}
}

function fetchStatesForCountry(country, onload) {

	if(onload){
		$.getJSON($("#getStatesForSelectedCountry").val(), {countryCode:country},function(data) {
			populateValues(data, {'states':'#user_state'});});
	}
	else {
		$.getJSON($("#getStatesForSelectedCountry").val(), {countryCode:country},function(data) {
			populateListOfValues(data, {'states':'#user_state'});});
	}
}

function fetchJobRolesForDept(dept, onload) {
	
	if(onload){
		$.getJSON($("#getListOfJobRoles").val(), {deptId:dept},function(data) {
			populateValues(data, {'jobroles':'#user_jobrole'});});
	}
	else {
		$.getJSON($("#getListOfJobRoles").val(), {deptId:dept},function(data) {
			populateListOfValues(data, {'jobroles':'#user_jobrole'});});
	}

}

function toggleSelectStateDiv(onload){
	
	var countryField = document.getElementById("user_country");
	var selCountry =countryField.options[countryField.selectedIndex].value;
	
	if(isStateRequiredForCountry(selCountry)){
		$('#stateProvinceDiv').removeClass('hidden');
		fetchStatesForCountry(selCountry, onload);
	}
	else {
		$('#stateProvinceDiv').addClass('hidden');
		//$("#user_state_readonly").empty();
        $("#user_state").empty();
	}
	
}

function parseXml(xml)
{	
	if (jQuery.browser.msie)
	{
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
		var text=""+xml;
		xmlDoc.async="false";
		xmlDoc.loadXML(text);
		return xmlDoc;
	}
	
	return xml;
}

function mapAddtnlInfoXMLResponses(dataObj, fieldsetObj){
	
	var $fields = fieldsetObj.find('input, select, textarea');
	var xmlResponses = parseXml(dataObj['xmlResponses']);
	var xpathExpr = '';
	//Clear the checkboxes <li>'s
	fieldsetObj.find('.check-box-wrapper:not(".fn_editable") ul').html('');
	
	$fields.each(function(){
	
		// Input fields
		if($(this).is('input[type="text"]')) {	
			xpathExpr = '[questionlabel="'+ $(this).attr('name') +'"]';
			var inputValue = $(xmlResponses).find(xpathExpr).find('value').text();
			
			if(inputValue == null || inputValue == ''){
				$(this).parents('.ctrlHolder').addClass('hidden');
				$(this).parents('.ctrlHolder').find('em').addClass('hidden'); // for additional info section hide the '*' if user has not answered.
				$(this).removeAttr('class');
			}else {
				$(this).val(inputValue);
				$(this).parent().prev('.read-only').html(inputValue);
			}
		}
		
		// Select fields
		if($(this).is('select')) {
			xpathExpr = '[questionlabel="'+ $(this).attr('name') +'"]';
			var selectValue = $(xmlResponses).find(xpathExpr).find('value').text();
			if(selectValue != ''){
				$(this).val(selectValue).attr('selected',true);
				$(this).parents('.ctrlHolder').find('.read-only').html(selectValue);
			}
			else {
				$(this).parents('.ctrlHolder').addClass('hidden');
				$(this).parents('.ctrlHolder').find('em').addClass('hidden');
				$(this).removeAttr('class');
			}
		}
						
		// Checkbox fields
		if($(this).is('input:checkbox')) {										
			
			if($(this).attr('name') == 'AQ_storage_type'){
				
				if($(xmlResponses).find('typeOfStorage').length > 0){
					
					xpathExpr = 'typeOfStorage:contains("'+ $(this).attr('value') + '")';
					var chValue = $(xmlResponses).find(xpathExpr).text();

					if(chValue != ''){
						$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">✓'+$(this).next('label').html()+'</div></li>');
						$(this).attr('checked','checked');
					} else
						$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+ extraSpaces + $(this).next('label').html()+'</div></li>');
				}
				else {
					$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+ extraSpaces + $(this).next('label').html()+'</div></li>');
					$(this).parents('.ctrlHolder').addClass('hidden');
					$(this).parents('.ctrlHolder').find('em').addClass('hidden');
					$(this).removeAttr('class');
				}
			} else if($(this).attr('name') == 'AQ_vshield_products'){
				
				if($(xmlResponses).find('selection').length > 0){
				
					xpathExpr = 'selection:contains("'+ $(this).attr('value') + '")';
					var chValue = $(xmlResponses).find(xpathExpr).text();

					if(chValue != ''){
						$(this).attr('checked', 'checked');
						$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">✓'+$(this).next('label').html()+'</div></li>');
					}
					else {
						$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+ extraSpaces + $(this).next('label').html()+'</div></li>');
					}
				}else {
					$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+ extraSpaces + $(this).next('label').html()+'</div></li>');
					$(this).parents('.ctrlHolder').addClass('hidden');
					$(this).parents('.ctrlHolder').find('em').addClass('hidden');
					$(this).removeAttr('class');
				}
			}
		}	
			
		// Radio button fields				
		if($(this).is('input:radio')) {					
			xpathExpr = '[questionlabel="'+ $(this).attr('name') +'"]';
			var checked = $(xmlResponses).find(xpathExpr).find('value').text();
			
			if(checked == 'true'){
				
				var id = $(this).attr('name')+ "_Yes";
				if($(this).attr('id') == id){
					$(this).attr('checked','checked');
					$(this).parents().prev('.read-only').html($(this).next('label').html());
				}
				else {
					$(this).removeAttr('checked');
				}
			}
			else if(checked == 'false' || checked == ""){
				var id = $(this).attr('name')+ "_No";
				if($(this).attr('id') == id){
					$(this).attr('checked','checked');
					$(this).parents().prev('.read-only').html($(this).next('label').html());
				}
				else {
					$(this).removeAttr('checked');
				}
			}
			else {
				$(this).parents('.ctrlHolder').addClass('hidden');
				$(this).parents('.ctrlHolder').find('em').addClass('hidden');
				$(this).removeAttr('class');
			}
					
		}
		
		// if a question has "showAlways" class, 
		// it should be displayed to the user though he answered or not during registration.
		if($(this).parents('.ctrlHolder').hasClass('showAlways')){
			
			$(this).parents('.ctrlHolder').removeClass('hidden');
		}
	});
	
	toggleVMwareCustQuestion();
	
	$("input[name='AI_vmware_partner']").click(function(){
		toggleVMwareCustQuestion();
	}); 
}

function toggleVMwareCustQuestion(){
	
	if($('#AI_vmware_partner_Yes').is(':checked')){
		$('#vmwareCustDiv').removeClass('hidden');
		$('#vmwareCustDiv').find('input').removeClass('hidden');
		$('#vmwareCustDiv').find('input').addClass('classRequired');
	}
	else {
		$('#vmwareCustDiv').addClass('hidden');
		$('#vmwareCustDiv').find('input').addClass('hidden');
		$('#vmwareCustDiv').find('input').removeClass('classRequired');
		$('#AQ_purchased_vmware_products_Yes').removeAttr('checked');
		$('#AQ_purchased_vmware_products_No').attr('checked','checked');
		//$('#vmwareCustDiv').find('input').removeAttr('checked');
	}
}

function enableReadOnlyMode(fieldObj) {
	
	var $fieldset = fieldObj.parents('fieldset');
	var $fields = fieldObj.parents('fieldset').find('input, select, textarea');
			
	//Clear the checkboxes <li>'s
	$fieldset.find('.check-box-wrapper:not(".fn_editable") ul').html('');
	
	$fields.each(function(){
		// See what type it is	
		
		if($(this).is('input[type="text"]')) {
			// Input fields
			inputValue = $(this).val();
			$(this).parent().prev('.read-only').html(inputValue);
			
			if(inputValue != '')
				$(this).parents('.ctrlHolder').find('em').removeClass('hidden'); // for additional info section show the '*' if user has answered.
		}
		
		// Select fields
		if($(this).is('select')) {					
			selectValue = $(this).find('option:selected').text();
			
			if($(this).find('option:selected').val() != '' && $(this).find('option:selected').val() != 0){
				
				$(this).parent().prev('.read-only').html(selectValue);
				$(this).parents('.ctrlHolder').find('em').removeClass('hidden');
			}else{
				$(this).parent().prev('.read-only').html('');
				$(this).parents('.ctrlHolder').find('em').addClass('hidden');
				}
		}
						
		// Checkbox fields
		if($(this).is('input:checkbox')) {										
			chValue = $(this).next('label').html();
			
			if($(this).is(':checked')){			
				$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">✓'+chValue+'</div></li>');
				$(this).parents('.ctrlHolder').find('em').removeClass('hidden');
			}else
				$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+ extraSpaces + chValue+'</div></li>');
		}	
			
		// Radio button fields				
		if($(this).is('input:radio:checked')) {					
			radioValue = $(this).next('label').html();
			$(this).parents().prev('.read-only').html(radioValue);
			$(this).parents('.ctrlHolder').find('em').removeClass('hidden');
		}										
		
	// Show all the read only fields
		$fieldset.find('.read-only').removeClass('hidden');
	
	// Hide all the editable fields
	$fieldset.find('.fn_editable').addClass('hidden');
		
	//Show edit button
	$fieldset.find('.fn_edit').removeClass('hidden');
	
	//Hide Save/Cancel buttons
	$fieldset.find('.fn_save,.fn_cancel').addClass('hidden'); 	
	
	//Remove all error statuses
	$fieldset.find('.ctrlHolder').removeClass('error');
	
	//show the success message
	$fieldset.find('.success-msg').removeClass('hidden');
	
	$fieldset.find('.error_msg').addClass('hidden'); 	
		
	$fieldset.find('.messageHolder').children().addClass('hidden');
		
	});
	return false;
}

function resetLoginInfoChanges(cancelButton){
	
	$('#user_newEmailAddress').val('');
	$('#user_reEnteredEmailAddr').val('');
	
}
function checkEmailAddress(async) {

	var emailId = $.trim($("#user_newEmailAddress").val());
	if (validateEmail(emailId) == false) {
		return;
	}

	$.ajax({
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
				var errorDiv = $("#user_emailAddress_error").parents('.ctrlHolder').find('.messageHolder');
				if (isAlreadyRegisteredEmail) {
					emailAddressHasError=true;
					//callBack.addsc({'f':'riaLink','args':['change-email : not-available']});
					// under this condition the email is registered with the
					// system.
					var redirectUrl = object.redirectUrl;
					var errorMsg =  object.errMsg; //TODO get this value from server.
					var linkLabel = object.linkLabel; 
					//var parentDiv= .parents('input-wrapper');
					
					var data = '<label class="error">'+errorMsg+'</label>'; 					

					if (data != null) {
						$("#user_emailAddress_error").html(data);
					} 
					$("#user_emailAddress_error").addClass('error');
					errorDiv.addClass('error');
	            	errorDiv.parents('.ctrlHolder').addClass('error');
					
				} else {
					emailAddressHasError=false;	
					$("#user_emailAddress_error").html("");
					$("#user_emailAddress_error").removeClass('error');
					errorDiv.removeClass('error');
	            	errorDiv.parents('.ctrlHolder').removeClass('error');
				}

			} catch (err) {
				//				console.log(err);(err);
			}
		}
	});
}

function resetPasswordInfoChanges(cancelButton){
	
	var $fieldset = $(cancelButton).parents('fieldset');
	var $fields = $(cancelButton).parents('fieldset').find('input');
	
	$fields.each(function(){
		
		if($(this).is('input[type="password"]')) {
			$("#user_newPassword").keyup();
			$(this).val('');
		}
		
	});
}

function resetPersonalInfoChanges(cancelButton){
	
	var isDeptChanged;
	
	if($('#user_dept option:selected').text() != $('#user_dept').parent().prev('.read-only').text()){
		isDeptChanged = true;
	}
	// reset the values to previously saved ones.
	resetFieldChanges(cancelButton);
	
	if(isDeptChanged){
		if($('#user_dept option:selected').val()==""){
			clearOptions("#user_jobrole");
			$("#user_jobrole").attr("disabled", true);
			$("#sel_jobRole").removeClass("error");
		 }else{
		  $("#user_jobrole").attr("disabled", false);
		}
	
		fetchJobRolesForDept($('#user_dept option:selected').val(), false);
	}
}

function resetCompanyInfoChanges(cancelButton){
	
	var isCountryChanged = false;
	
	if($('#user_country option:selected').text() != $('#user_country').parent().prev('.read-only').text()){
		isCountryChanged = true;
	}
	resetFieldChanges(cancelButton);
	
	if(isCountryChanged){
		
		toggleSelectStateDiv(false);
	}
}

function resetAdditionalInfoChanges(cancelButton){
	
	resetFieldChanges(cancelButton);
	toggleVMwareCustQuestion();
}

function resetFieldChanges(cancelButton){
	
	var $fieldset = $(cancelButton).parents('fieldset');
	var $fields = $(cancelButton).parents('fieldset').find('input, select, textarea');
	
	$fields.each(function(){
		
		if($(this).is('input[type="text"]')) {
			$(this).val($(this).parent().prev('.read-only').html());
		}
		
		// Select fields
		if($(this).is('select')) {						
			var prevSelection = $(this).parent().prev('.read-only').text();
			
			if(prevSelection != ''){
				$(this).find('option').each(function(){
					if($(this).text() == prevSelection)
						$(this).attr('selected','selected');
					else
						$(this).removeAttr('selected');
				});
			}
			else {
				$($(this).find('option[value=""]')).attr('selected','selected');
			}
		}
		
		// Radio button fields				
		if($(this).is('input:radio')) {					
			if($(this).next('label').html() == $(this).parents().prev('.read-only').html())
				$(this).attr('checked','checked');
			else
				$(this).removeAttr('checked');
		}
						
		// Checkbox fields
		if($(this).is('input:checkbox')) {										
			var chValue =$(this).next('label').html();

			if($(this).parents('.check-box-wrapper').prev().find('ul').find('div.read-only:contains("✓'+chValue+'")').length > 0)
				$(this).attr('checked','checked');
			else
				$(this).removeAttr('checked');

		}
	});
}

function vaildateDeactivateProfile(){
	//riaLink('deactivate : warning');  
	//var custNum=$("#cn").text();
	//if(custNum!=null){
	 // custNum = $.trim($(custNum).val());
	//}
	$.ajax({
		type : "POST",
		dataType : "json",
		url : $("#checkValidateDeactivateProfileURLAjaxUrl").val(),
		//data : {
		//	customerNumber : custNum
		//},
		success : function(object) {

			try {
				var canDeactivated = object.canDeactivate;
				var errCode = object.errorCode;
				
				if(canDeactivated){
				   	$('#validateDeactivateStatus').val(canDeactivated);
				    $('#deactivateProfileTrue').css('display','');
					
				}else if("VM-EMS-ENT-USER-000042"==errCode && canDeactivated==false){
						$('#validateDeactivateStatus').val(canDeactivated);
				      $('#deactivateProfileTrue').css('display','');
				}else{
					$('#deactivateProfileFalse').css('display','');
				}
				
				
				
			} catch (err) {
				//				console.log(err);(err);
			}
		}
	});
}

function deactivateProfile(){
   
	//var custNum=$("#cn").text();
	//var emsStatus=$("#validateDeactivateStatus").val();
	riaLink('deactivate : confirmation');//added for ominature
	//appendDiv('deactivateButton');
	//$btnID = $("#deactivateButton");
	//$btnID.parent().prepend('<div class="preLoading" style="float:left; padding-left:150px;"><div class="loading_small">Loading...</div></div>');
	$.ajax({
		beofreSubmit : vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true}),
		type : "POST",
		dataType : "json",
		url : $("#checkDeactivateProfileURLAjaxUrl").val(),
		//data : {
		//	customerNumber : custNum,
		//	status:emsStatus
		//},
		success : function(object) {

			try {
				var isDeactivated = object.isDeactivated;
				var deactivateMsg = object.deactivateMsg;
				if(isDeactivated){
					$('#text1').hide();
					$('#text2').hide();
					$('#btn_cancel').hide();
					$('#deactivateButton').hide();
					$('#notDeactivated').hide();
					$('#deactivated').show();
					$('#headerId').hide();
					setTimeout(function(){
				    window.location.href=window.location.protocol +  "//" + window.location.host + "/c/portal/logout";
					},3000);
				}else{
				    $('#text1').hide();
					$('#text2').hide();
					$('#btn_cancel').hide();
					$('#deactivateButton').hide();
					$('#notDeactivated').show();
				}
				
			} catch (err) {
				//				console.log(err);(err);
			}
			vmf.loading.hide();
			//$('#deactivateButton').parent().find(".preLoading").remove();
		},
		error : function(){
			vmf.loading.hide();
		}
	});
}
function removeErrorClass(element) {
	element.parent().removeClass('error');
	element.removeClass('error_msg');
}

function validateEmail(elementValue) {
	var existinrEmail=$("#existing_emailAddr").val();
	if(existinrEmail==elementValue){
		return false;
	}
	var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
	return emailPattern.test(elementValue);
}
function appendDiv(passedElement){

	$position = $('#'+passedElement);
	$position.parent().prepend('<div class="preLoading" style="float:left; padding-left:550px;"><div class="loading_small">'+usermanagement.globalVar.loadingLbl+'</div></div>');

}

function changeEmailOminature(){
	riaLink('change-email'); 
	return true;
 }
