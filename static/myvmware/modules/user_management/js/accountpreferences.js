VMFModuleLoader.loadModule("customDropdown", function(){});
//load preferences
var preferencesData;
fireCancelEvent = function() {
	$("#preferencesDiv").html('');
	onSuccess_loadPreferences(preferencesData);
};
loadPreferences = function(){
	$("#preferencesDiv").html('<span class="loading_big">' +preferencesPaneLoadingText+ '</span>' );
	var eaNumber = $("#selectedEANumber").val();	
	var getPrefUrl = preferencesGetPreferencesDataURL+ '&selectedEANumber=' + eaNumber;
	vmf.ajax.post(getPrefUrl,
			null, 
			onSuccess_loadPreferences, 
			onFail_loadPreferences);
};
onSuccess_loadPreferences = function(data){
	preferencesData = data;
	try {
		var jsonPreferences = vmf.json.txtToObj(data);
		if (jsonPreferences.error) {
			$("#preferencesDiv").html('');
			showExceptionMessages(jsonPreferences.message);
			return false;
		}
	} catch (error) {
		// intentionally suppress error
	}
	$("#preferencesDiv").html(data);
	checkCategoryParentOnLoad();
	toggleCategory();
	//minimizeAllSections();	
	$('.profile-minimize-button').click(function() {
		myvmware.accountpreferences.toggleMinMax(this);
		return false;
	});	
};
onFail_loadPreferences = function(data){
	$("#preferencesDiv").html('');
	showExceptionMessages(preferencesPaneLoadingErrorMsg);
};
// save preferences
savePreferences = function(){
	var _emailValidationFlag = true;
	var eaNumber = document.getElementById("selectedEANumber").value;	
	var savePrefUrl = preferencesSavePreferencesDataURL+ '&selectedEANumber=' + eaNumber;

	if(_emailValidationFlag){
		vmf.ajax.post(savePrefUrl,
				$("#preferencesForm").serializeArray(), 
				onSuccess_savePreferences, 
				onFail_savePreferences);		
		vmf.loading.show({"msg":myvmware.globalVars.loadingLbl, "overlay":true});
	}else{
		showExceptionMessages(emaiIdValidationMsg);
		$("#additionalEmailId").focus();
	}
};
onSuccess_savePreferences = function(data){	
	vmf.loading.hide();
	var jsonPreferencesSave = data;
	if(!(jsonPreferencesSave.updateStatus == "success")){
		$('#updateSuccessDiv').html(preferencesPaneSavingErrMsg);
		$('#updateSuccessDiv').css('display','block');
	}else if(jsonPreferencesSave.error){
		$('#updateSuccessDiv').html(jsonPreferencesSave.message);
		$('#updateSuccessDiv').css('display','block');
	}else{
		$('#updateSuccessDiv').html(preferencesPaneSavingSuccessMsg);
		$('#updateSuccessDiv').css('display','block');
		//loadPreferences();
	}
};
onFail_savePreferences = function (data){$('#ExceptionMessage').html(preferencesPaneSavingErrMsg);};
// after loading the preferences check whether children are selected and based on that select the parent
checkCategoryParentOnLoad = function(){
	$("#preferencesDiv input[type='checkbox'][title*='PARENTTITLE_']").each(function(){
		var _allChildrenChecked = true;
		$("#preferencesDiv input[type='checkbox'][title='"+ $(this).attr('name') +"']").each(function(){
			if($(this).attr('checked')!=true){_allChildrenChecked = false;}
		});
		if(_allChildrenChecked){$(this).attr('checked', true);}
		if ($("#preferences_unsubscribe_all").attr('checked') == true){$("#unsubscribeMsg-Box").css('display','block');}
	});
	$("#preferencesDiv input[type='radio'][title*='PARENTTITLE_']").each(function(){
		var _allChildrenChecked = true;
		$("#preferencesDiv input[type='checkbox'][title='"+ $(this).attr('name') +"']").each(function(){
			if($(this).attr('checked')!=true){_allChildrenChecked = false;}
		});
		if(_allChildrenChecked){$(this).attr('checked', true);}
		if ($("#preferences_unsubscribe_all").attr('checked') == true){$("#unsubscribeMsg-Box").css('display','block');}
	});
};
// check all the check boxes under given category
checkCategoryChildren = function(categoryCheckBox){
	$("#preferencesDiv input[type='checkbox'][name*="+ categoryCheckBox.name +"]").each(function(){
		(categoryCheckBox.checked)?$(this).attr('checked', true):$(this).attr('checked', false);
	});
};
// check/uncheck the parent category based on children selection
checkCategoryParent = function(categoryChildCheckBox){
	var _currentCheckBoxStatus = categoryChildCheckBox.checked;
	if(_currentCheckBoxStatus){// chek if all other child check boxes are checked or not
		var _allChildrenStatusChecked = true;
		$("#preferencesDiv input[type='checkbox'][name*="+ categoryChildCheckBox.title +"_]").each(function(){
			if($(this).attr('checked')!=true){
				_allChildrenStatusChecked =false; 
				return false;
			}
		});
		(_allChildrenStatusChecked)?$("#" + categoryChildCheckBox.title).attr('checked',true):$("#" + categoryChildCheckBox.title).attr('checked',false);			
	}else{
		$("#" + categoryChildCheckBox.title).attr('checked',false);
	}
};
// for subscribe check all
checkAll = function(subscribeCheckBox){
	if(subscribeCheckBox.checked){
		$("#preferencesDiv input[type='checkbox']").each(function(){$(this).attr('checked', true);});
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
		$("#unsubscribeMsg-Box").css('display','none');
	}else{
		$("#preferencesDiv input[type='checkbox']").each(function(){
			$(this).attr('checked', false);
		});
		$("#" + unSubscribeFieldId).attr('checked', true);
		$("#unsubscribe_box_id").css('display','block');
		$("#unsubscribeMsg-Box").css('display','block');
	}
};
// for un subscribe un check all
unCheckAll = function(unSubscribeCheckBox){
	if(unSubscribeCheckBox.checked){
		$("#preferencesDiv input[type='checkbox']").each(function(){$(this).attr('checked', false);});
		$("#preferencesDiv input[type='radio']").each(function(){$(this).attr('checked', false);	});
		$("#" + unSubscribeFieldId).attr('checked', true);
		$("#unsubscribe_box_id").css('display','block');
		$("#unsubscribeMsg-Box").css('display','block');
	}else{
		$("#preferencesDiv input[type='checkbox']").each(function(){$(this).attr('checked', true);});
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
		$("#unsubscribeMsg-Box").css('display','none');
	}
};
// if atleast one preference is checked check the subscribe and uncheck the unsubscribe
checkForAllActions=function(selectedCheckBox){
	if(selectedCheckBox.checked){
		$("#" + unSubscribeFieldId).attr('checked', false);
		$("#unsubscribe_box_id").css('display','none');
		$("#unsubscribeMsg-Box").css('display','none');
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
			$("#preferencesDiv input[type='radio'][title='subscribe']").attr('checked', true);
		}
	}else{
		// un check the subscribe, assuming if all are checked only it needs to be checked 
		$("#preferencesDiv input[type='checkbox'][title='subscribe']").attr('checked', false);
		$("#preferencesDiv input[type='radio'][title='subscribe']").attr('checked', false);
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
			$("#unsubscribeMsg-Box").css('display','block');
		}
	}
};
// toggle between + and -
toggleCategory = function(categoryDivId,theHref){
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
// set the additional email id text box text and style
changeEmailIDTxtStyle = function(textBox){
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
// show exceptions
showExceptionMessages = function(message){
	$('#ExceptionMessage').html(message);
	vmf.modal.show("ExceptionMessagePopup");
};
// cancel button is coming from different JSP hence call with function
showMyAccount = function(){window.location = myAccount_url;};
//privacy link is coming from different JSP hence call with function
showPrivacyStatement = function(){showExceptionMessages(privacy_url);};// currently not used
$('#sendRequestLink').click(function() {showExceptionMessages(sendRequest_url);/*pending*/});
myvmware.accountpreferences = {
  	init: function() {
  		//vmf.scEvent = true;
  		minimizeAllSections();
  		myvmware.accountpreferences.accountPrefTabOminature();
  	  	// code which will run on all profile pages
  	  	//if(vmf.dropdown && $("select#selectedEANumber").length){// EA Custom Dropdown binding
			//vmf.dropdown.build($("select#selectedEANumber"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"left",onSelect:loadPreferences()});
		//}
  	  	$('.profile-minimize-button').click(function() {// Open close buttons
  	  		myvmware.accountpreferences.toggleMinMax(this);  	
  	  		return false;
  		});
  		$('a.fn_edit').click(function() {// Edit-Cancel-Save buttons		
  			var $fieldset = $(this).parents('fieldset');	
  			$fieldset.find('.read-only').addClass('hidden');// Hide all the read only fields
			$fieldset.find('.fn_editable').removeClass('hidden');	  			// Show all the editable fields
			$fieldset.find('.fn_edit').addClass('hidden');	//Hide edit button
			$fieldset.find('.fn_save,.fn_cancel').removeClass('hidden');				//Show Save/Cancel buttons
			$fieldset.find('.success-msg').addClass('hidden');
  			return false;
  		});
  		$('a.fn_cancel').click(function() {
			var $fieldset = $(this).parents('fieldset');
  			$fieldset.find('.read-only').removeClass('hidden');	// Show all the read only fields
  			$fieldset.find('.error_msg').addClass('hidden');	// Hide all the error messages
  			$fieldset.find('.ctrlHolder,.subCtrlHolder').removeClass('error');	// Revert error message changes
			$fieldset.find('.fn_editable').addClass('hidden');	// Hide all the editable fields
			$fieldset.find('.success-msg').addClass('hidden');			
			$fieldset.find('.fn_edit').removeClass('hidden');	//Show edit button
			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden');	//Hide Save/Cancel buttons
  			return false;
  		});  	
	},
	
	accountPrefTabOminature : function(){
		callBack.addsc({'f':'riaLink','args':[' account-notifications']});
		//riaLink('account-notifications');
	},
	
	toggleMinMax : function(buttonObj){
		var $fieldset;
		$fieldset = ($(buttonObj).parents('.list-wrapper').length > 0)? $(buttonObj).parents('.list-wrapper'):$(buttonObj).parents('fieldset');
		if($fieldset.hasClass('closed')){
			$fieldset.find('.ctrlHolder, h3, .list-hierarchy-wrapper').show();
			$fieldset.removeClass('closed');
			$fieldset.find('.ctrlHolder, .fn_editable').attr('style','');
		}else{
			$fieldset.find('.ctrlHolder, h3, .list-hierarchy-wrapper').hide();
			$fieldset.addClass('closed');
		}	
	}
};
