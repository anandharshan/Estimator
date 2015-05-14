var loggedInUserIsAdministrator = false;
// load account and user details
ice.ui.clearAccountDetails = function(){
	$("#accountsDetailsHeader").html('');
	$("#accountFieldName_SU").html('');
	$("#accountFieldName_SU_email").html('');	
	$("#accountFieldName_PU").html('');
	$("#accountFieldName_PU_email").html('');	
	$("#accountFieldName_PR").html('');
	$("#preferenceSaveMsg").hide();
	ice.ui.preferencesAdminDisableLinks();
};
ice.ui.loadAccountDetails = function(){
	ice.ui.clearAccountDetails();
	$("#accountsDetailsHeader").html('<ul><li>'+ accountDetailPaneLoadingText +'</li></ul>');
	vmf.ajax.post(preferencesGetUserDataURL,
			null, 
			ice.ui.onSuccess_loadAccountDetails, 
			ice.ui.onFail_loadAccountDetails);
};
ice.ui.onSuccess_loadAccountDetails = function(data){
	var _entitlementAccountData = vmf.json.txtToObj(data);
	if(_entitlementAccountData.error){
		ice.ui.showExceptionMessages(_entitlementAccountData.message);
		$("#accountsDetailsHeader").html('');
		return false;
	}
	if(_entitlementAccountData.eaNumber && _entitlementAccountData.eaName){
		$("#accountsDetailsHeader").html(_entitlementAccountData.eaNumber + '<br/>' + _entitlementAccountData.eaName);
	}
	if(_entitlementAccountData.itSuperUser){
		$("#accountFieldName_SU").html(_entitlementAccountData.itSuperUser.firstName + ' ' + _entitlementAccountData.itSuperUser.lastName);
		if(_entitlementAccountData.itSuperUser.email){
			var _emailContentSU = '<a href="mailto:'+_entitlementAccountData.itSuperUser.email+'">'+_entitlementAccountData.itSuperUser.email+'</a>';
			$("#accountFieldName_SU_email").html(_emailContentSU);
		}else{
			$("#accountFieldName_SU_email").html('N/A');
		}
	}else{
		$("#accountFieldName_SU").html('N/A');
		$("#accountFieldName_SU_email").html('');
	}
	if(_entitlementAccountData.procurementUser){
		$("#accountFieldName_PU").html(_entitlementAccountData.procurementUser.firstName + ' ' + _entitlementAccountData.procurementUser.lastName);
		if(_entitlementAccountData.procurementUser.email){
			var _emailContentPU = '<a href="mailto:'+_entitlementAccountData.procurementUser.email+'">'+_entitlementAccountData.procurementUser.email+'</a>';
			$("#accountFieldName_PU_email").html(_emailContentPU);
		}else{
			$("#accountFieldName_PU_email").html('N/A');
		}
	}else{
		$("#accountFieldName_PU").html('N/A');
		$("#accountFieldName_PU_email").html('');
	}
	if(_entitlementAccountData.preferredReseller){
		$("#accountFieldName_PR").html(_entitlementAccountData.preferredReseller);
	}else{
		$("#accountFieldName_PR").html('N/A');
	}
	ice.ui.preferencesAdminDisableLinks();
	if(_entitlementAccountData.requestingUser.superPermission ||
			_entitlementAccountData.requestingUser.procPermission){
		loggedInUserIsAdministrator = true;
		ice.ui.preferencesAdminEnableLinks();
	}
};
ice.ui.onFail_loadAccountDetails = function(data){
	ice.ui.clearAccountDetails();
	$("#accountsDetailsHeader").html('');
	ice.ui.showExceptionMessages(accoutPaneLoadingErrorMsg);
};
//enable links
ice.ui.preferencesAdminEnableLinks = function(){
	$('#changeITSULink').removeClass('secondary');
	$('#changeITPULink').removeClass('secondary');
	$('#changePRLink').removeClass('secondary');
	$("#adminAdditionalInfoId").css('display','block');
	//$("#dropdownForAdmin").css('display','block');
	ice.replaceITSUOrPU.attachLinks('changeITSULink','changeITPULink',ice.ui.loadAccountDetails);
};
// disable links
ice.ui.preferencesAdminDisableLinks = function(){
	$('#changeITSULink').addClass('secondary');
	$('#changeITPULink').addClass('secondary');
	$('#changePRLink').addClass('secondary');
	$("#adminAdditionalInfoId").css('display','none');
	//$("#dropdownForAdmin").css('display','none');
	ice.replaceITSUOrPU.detachLinks('changeITSULink','changeITPULink');
};
//load preferences
ice.ui.loadPreferences = function(){
	$("#preferencesDiv").html('<ul><li>'+ preferencesPaneLoadingText +'</li></ul>');
	vmf.ajax.post(preferencesGetPreferencesDataURL,
			null, 
			ice.ui.onSuccess_loadPreferences, 
			ice.ui.onFail_loadPreferences);
};
ice.ui.onSuccess_loadPreferences = function(data){
	try {
		var jsonPreferences = vmf.json.txtToObj(data);
		if (jsonPreferences.error) {
			$("#preferencesDiv").html('');
			ice.ui.showExceptionMessages(jsonPreferences.message);
			return false;
		}
	} catch (error) {
		// intentionally suppress error
	}
	//$("#preferencesDiv").html(data);
	$("#preferencesDiv")[0].innerHTML = data;
	ice.ui.checkCategoryParentOnLoad();
	ice.ui.toggleCategory();
};
ice.ui.onFail_loadPreferences = function(data){
	$("#preferencesDiv").html('');
	ice.ui.showExceptionMessages(preferencesPaneLoadingErrorMsg);
};
// save preferences
ice.ui.savePreferences = function(){
	var _emailValidationFlag = true;
	if($("#additionalEmailId").val()!='' 
		&& $("#additionalEmailId").val()!=defaultEmailTextBoxText){
		$("#preferencesForm").validate({
			errorPlacement: function(error,element) {
                return true;
             }			
		});
		if($("#additionalEmailId").valid()==0){
			_emailValidationFlag = false;	
		}
	}
	if(_emailValidationFlag){
		$("#preferenceSaveMsg").hide();
		vmf.ajax.post(preferencesSavePreferencesDataURL,
				$("#preferencesForm").serializeArray(), 
				ice.ui.onSuccess_savePreferences, 
				ice.ui.onFail_savePreferences);
		ice.ui.showExceptionMessages(preferencesPaneSavingMsg);
	}else{
		ice.ui.showExceptionMessages(emaiIdValidationMsg);
		$("#additionalEmailId").focus();
	}
};
ice.ui.onSuccess_savePreferences = function(data){
	var jsonPreferencesSave = vmf.json.txtToObj(data);
	if(!jsonPreferencesSave){
		$('#ExceptionMessage').html(preferencesPaneSavingErrMsg);
	}else if(jsonPreferencesSave.error){
		$('#ExceptionMessage').html(jsonPreferencesSave.message);
	}else{
		vmf.modal.hide();
		$('#preferenceSaveMsg').show();
		$('#preferenceSaveMsg').html(preferencesPaneSavingSuccessMsg);
		ice.ui.loadPreferences();
	}
};
ice.ui.onFail_savePreferences = function (data){
	$('#ExceptionMessage').html(preferencesPaneSavingErrMsg);
};

// after loading the preferences check whether children are selected and based on that select the parent
ice.ui.checkCategoryParentOnLoad = function(){
	$("#preferencesDiv input[type='checkbox'][title*='PARENTTITLE_']").each(function(){
		var _allChildrenChecked = true;
		$("#preferencesDiv input[type='checkbox'][title='"+ $(this).attr('name') +"']").each(function(){
			if($(this).attr('checked')!=true){
				_allChildrenChecked = false;
			}
		});
		if(_allChildrenChecked){
			$(this).attr('checked', true);
		}
	});
};

// check all the check boxes under given category
ice.ui.checkCategoryChildren = function(categoryCheckBox){
	$("#preferencesDiv input[type='checkbox'][name*="+ categoryCheckBox.name +"]").each(function(){
		if(categoryCheckBox.checked){
			$(this).attr('checked', true);
		}else{
			$(this).attr('checked', false);
		}
	});
};
// check/uncheck the parent category based on children selection
ice.ui.checkCategoryParent = function(categoryChildCheckBox){
	var _currentCheckBoxStatus = categoryChildCheckBox.checked;
	if(_currentCheckBoxStatus){// chek if all other child check boxes are checked or not
		var _allChildrenStatusChecked = true;
		$("#preferencesDiv input[type='checkbox'][name*="+ categoryChildCheckBox.title +"_]").each(function(){
			if($(this).attr('checked')!=true){
				_allChildrenStatusChecked =false; 
				return false;
			}
		});
		if(_allChildrenStatusChecked){
			$("#" + categoryChildCheckBox.title).attr('checked',true);			
		}else{
			$("#" + categoryChildCheckBox.title).attr('checked',false);	
		}
	}else{
		$("#" + categoryChildCheckBox.title).attr('checked',false);
	}
};
// for subscribe check all
ice.ui.checkAll = function(subscribeCheckBox){
	if(subscribeCheckBox.checked){
		$("#preferencesDiv input[type='checkbox']").each(function(){
			$(this).attr('checked', true);
		});
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
	}else{
		$("#preferencesDiv input[type='checkbox']").each(function(){
			$(this).attr('checked', false);
		});
		$("#" + unSubscribeFieldId).attr('checked', true);
		$("#unsubscribe_box_id").css('display','block');
	}
};
// for un subscribe un check all
ice.ui.unCheckAll = function(unSubscribeCheckBox){
	if(unSubscribeCheckBox.checked){
		$("#preferencesDiv input[type='checkbox']").each(function(){
			$(this).attr('checked', false);
		});
		$("#" + unSubscribeFieldId).attr('checked', true);
		$("#unsubscribe_box_id").css('display','block');
	}else{
		$("#preferencesDiv input[type='checkbox']").each(function(){
			$(this).attr('checked', true);
		});
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
	}
};
// if atleast one preference is checked check the subscribe and uncheck the unsubscribe
ice.ui.checkForAllActions=function(selectedCheckBox){
	if(selectedCheckBox.checked){
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
		// assuming that if all the preferences are checked then the subscribe need to be checked
		var _allChecked=true;
		$("#preferencesDiv input[type='checkbox']").each(function(){
			if($(this).attr('checked')!=true 
				&& $(this).attr('id')!=unSubscribeFieldId
				&& $(this).attr('title')!='subscribe'){
				_allChecked = false;
			}
		});
		if(_allChecked){
			$("#preferencesDiv input[type='checkbox'][title='subscribe']").attr('checked', true);
		}
	}else{
		// un check the subscribe, assuming if all are checked only it needs to be checked 
		$("#preferencesDiv input[type='checkbox'][title='subscribe']").attr('checked', false);
		var _allUnChecked=true;
		$("#preferencesDiv input[type='checkbox']").each(function(){
			if($(this).attr('checked') 
				&& $(this).attr('id')!=unSubscribeFieldId
				&& $(this).attr('title')!='subscribe'){
				_allUnChecked = false;
			}
		});
		if(_allUnChecked){
			$("#" + unSubscribeFieldId).attr('checked', true);
			$("#unsubscribe_box_id").css('display','block');
		}
	}
};
//toggle between + and -
ice.ui.toggleCategory = function(){
	$('.profile-maximize-button').click(function(){
	  var $this = $(this),
	      $fieldset = $this.parent().parent('fieldset');
	
	  if($fieldset.hasClass('open')){
	    $fieldset.removeClass('open').addClass('closed');
	    $fieldset.find('> ul').hide();
	  } else {
	    $fieldset.removeClass('closed').addClass('open');
	    $fieldset.find('> ul').show();
	  }
	
	  return false;
	});
};
/*
ice.ui.toggleCategory = function(categoryDivId,theHref){
	if($("#" + categoryDivId).css('display')=='none'){
		$("#" + categoryDivId).css('display','block');
		$(theHref).addClass("profile-maximize-button");
		$(theHref).removeClass("profile-minimize-button");
	}else{
		$("#" + categoryDivId).css('display','none');
		$(theHref).addClass("profile-minimize-button");
		$(theHref).removeClass("profile-maximize-button");
	}
	return false;
};
*/
// set the additional email id text box text and style
ice.ui.changeEmailIDTxtStyle = function(textBox){
	if(textBox.value!='' 
		&& textBox.value!=defaultEmailTextBoxText){
		$(textBox).removeClass('text_input_grey');
		$(textBox).addClass('text_input');
		$(textBox).attr('style','width:237px;');
	}else{
		$(textBox).removeClass('text_input');
		$(textBox).addClass('text_input_grey');
		textBox.value = defaultEmailTextBoxText;
	}
};
// clear default text
ice.ui.checkEmailIDText = function(textBox){
	if(textBox.value==defaultEmailTextBoxText){
		textBox.value='';
	}
};
// show exceptions
ice.ui.showExceptionMessages = function(message){
	$('#ExceptionMessage').html(message);
	vmf.modal.show("ExceptionMessagePopup");
};
// cancel button is coming from different JSP hence call with function
ice.ui.showMyAccount = function(){
	window.location = myAccount_url;
};
//privacy link is coming from different JSP hence call with function
ice.ui.showPrivacyStatement = function(){// currently not used
	//window.location = privacy_url;
	ice.ui.showExceptionMessages(privacy_url);
};
$('#sendRequestLink').click(function() {
	//window.location = sendRequest_url;
	ice.ui.showExceptionMessages(sendRequest_url);//pending
});
$('#changePRLink').click(function() {		
	//window.location = change_PreferredReseller_url;
	ice.ui.showExceptionMessages(change_PreferredReseller_url);//pending
});
