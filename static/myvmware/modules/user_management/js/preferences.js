/**
 * 
 */

$(document).ready(function() {
	
	
});

function minimizeAllSections(){
	
	var $fieldset = $(document).find('fieldset');
	$fieldset.each(function(){
		myvmware.mycommunication.toggleMinMax($(this).find('.profile-minimize-button'));
	});
}

function prepopulateAreasOfInt(){
	
	var $fields = $('#saveAreaOfInterest').parents('fieldset').find('input:checkbox');
	var preSelectedValues = new String($('#seletedCustomerAreaOfInterest').val());
	$fields.each(function(){
		if(preSelectedValues.search($(this).attr('id')) != -1){
			$(this).attr('checked', 'checked');
		}
	});
	var readOnlyDiv1 = $('#areasOfIntRO_block1');
	var areasOfIntBlock1 = $('#areasOfInt_block1');
	var readOnlyDiv2=$('#areasOfIntRO_block2');
	var areasOfIntBlock2= $('#areasOfInt_block2');
	
	$fields = areasOfIntBlock1.find('input:checkbox');
	$fields.each(function(){
		if($(this).is(":checked")){
			readOnlyDiv1.find("ul").append('<li><div class="read-only">✓'+$(this).next('label').html() +'</div></li>');
		}
		else {
			readOnlyDiv1.find("ul").append('<li><div class="read-only">&nbsp;'+$(this).next('label').html() +'</div></li>');
		}
	});
	
	$fields2 = areasOfIntBlock2.find('input:checkbox');
	$fields2.each(function(){
		if($(this).is(":checked")){
			readOnlyDiv2.find("ul").append('<li><div class="read-only">✓'+$(this).next('label').html() +'</div></li>');
		}
		else {
			readOnlyDiv2.find("ul").append('<li><div class="read-only">'+$(this).next('label').html() +'</div></li>');
		}
	});
	
}
function populateReadOnlySelectFields() {
	
	var selectEmerContactNoValue = $('#emerContactNo').find('option:selected').text();
	$('#emerContactNo').parent().prev('.read-only').html(selectEmerContactNoValue);
	
	var selectPrefContactMethodValue = $('#prefContactMethod').find('option:selected').text();
	$('#prefContactMethod').parent().prev('.read-only').html(selectPrefContactMethodValue);
	
	var selectTimeZoneValue = $('#timeZone').find('option:selected').text();
	$('#timeZone').parent().prev('.read-only').html(selectTimeZoneValue);
	
	var selectPrefLanguageValue = $('#prefLanguage').find('option:selected').text();
	$('#prefLanguage').parent().prev('.read-only').html(selectPrefLanguageValue);
	
	var $fieldset = $('#prefLanguage').parents('fieldset');
	
	var emailformat = $fieldset.find('input:radio:checked');
	
	if(emailformat.attr('checked') == undefined){
		$fieldset.find('input:radio').parents('.ctrlHolder').find('.read-only').html('HTML');
		//var $emailFormats = $fieldset.find('input:radio');
		$fieldset.find('input:radio').each(function(){
			if($(this).next('label').html() == 'HTML')
				$(this).attr('checked','checked');
		});
	}
	else {
		var selectEmailFormatValue = emailformat.next('label').html();
		emailformat.parent().parent().prev('.read-only').html(selectEmailFormatValue);
	}
}

function submitPreferencesForm(){
	
	$('#preferencesForm').submit();
	
}
function submitAreaOfInterestForm(){
	
	$('#areaOfInterestForm').submit();
	
}

function processResponse(data, formSubmitted) {
	
	if(typeof data == 'object' && data['updateStatus'] == 'success'){
		
		return enableReadOnlyMode(formSubmitted);
	
	} else {
		$(formSubmitted).parents('fieldset').find('//div[id="updateErrorDiv"]').removeClass('hidden');
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
		}
		
		// Select fields
		if($(this).is('select')) {					
			selectValue = $(this).find('option:selected').text();
			$(this).parent().prev('.read-only').html(selectValue);
		}
						
		// Checkbox fields
		if($(this).is('input:checkbox')) {										
			chValue = $(this).next('label').html();
			if($(this).is(':checked'))
				$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">✓'+chValue+'</div></li>');
			else
				$(this).parents('.check-box-wrapper').prev().find('ul').append('<li><div class="read-only">'+chValue+'</div></li>');
		}	
			
		// Radio button fields				
		if($(this).is('input:radio:checked')) {					
			radioValue = $(this).next('label').html();
			$(this).parents().prev('.read-only').html(radioValue);		
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
	$fieldset.find('.ctrlHolder,.subCtrlHolder').removeClass('error');
	
	$fieldset.find('.success-msg').removeClass('hidden');
	
	$fieldset.find('.error_msg').addClass('hidden');
		
	});
	
	return false;
}