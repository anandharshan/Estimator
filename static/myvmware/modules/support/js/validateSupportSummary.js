var setEaSelector=false;
validateSupportSummary = function()
							{
	$.validator.addMethod("additionalNotesSummary", function(value, element) { 
		var userProvidedAdditionalNotes = $.trim(value);
		var defaultAdditionalComments = $("#additionalNotesDefaultText").val();	 
		if(typeof(userProvidedAdditionalNotes) == "undefined" || userProvidedAdditionalNotes == null || userProvidedAdditionalNotes.length == 0 || userProvidedAdditionalNotes == $.trim(defaultAdditionalComments)){
			return false;
		} else{
			return true;
		}
		
	}, support.globalVars.enterNotes);
	
	$.validator.addMethod("attachmentSummary", function(value, element) { 
		var userProvidedAttachmentDetails = $.trim(value);
		var defaultAttachmentDetails = $("#attachmentDefaultText").val();	 
		if(typeof(userProvidedAttachmentDetails) == "undefined" || userProvidedAttachmentDetails == null || userProvidedAttachmentDetails.length == 0 || userProvidedAttachmentDetails == $.trim(defaultAttachmentDetails)){
			$("textarea#attachmentComments").val('');
			return true;
		} else if(userProvidedAttachmentDetails.length > 400) {
			return false;
		}		
	}, support.globalVars.reduceCharsExcess400);
	
	$.validator.addMethod("closeRequestDescription", function(value, element) { 
		var userProvidedDescriptionDetails = $.trim(value);
		var defaultDescriptionDetails = $("#closeSRDefaultText").val();	 
		if(typeof(userProvidedDescriptionDetails) == "undefined" || userProvidedDescriptionDetails == null || userProvidedDescriptionDetails.length == 0 || userProvidedDescriptionDetails == $.trim(defaultDescriptionDetails)){			
			return false;
		} else{
			return true;
		}		
	}, support.globalVars.requiredLbl);
	
	$.validator.addMethod("escalateRequestDescription", function(value, element) { 
		var userProvidedDescriptionDetails = $.trim(value);
		var defaultDescriptionDetails = $("#escalateSRDefaultText").val();	 
		if(typeof(userProvidedDescriptionDetails) == "undefined" || userProvidedDescriptionDetails == null || userProvidedDescriptionDetails.length == 0 || userProvidedDescriptionDetails == $.trim(defaultDescriptionDetails)){			
			return false;
		} else {
			return true;
		}		
	}, support.globalVars.enterExplanation);
	
	$.validator.addMethod("reopenRequestDescription", function(value, element) { 
		var userProvidedDescriptionDetails = $.trim(value);
		var defaultDescriptionDetails = $("#reopenSRDefaultText").val();	 
		if(typeof(userProvidedDescriptionDetails) == "undefined" || userProvidedDescriptionDetails == null || userProvidedDescriptionDetails.length == 0 || userProvidedDescriptionDetails == $.trim(defaultDescriptionDetails)){			
			return false;
		} else {
			return true;
		}		
	}, support.globalVars.enterExplanation);
	
	$.validator.addMethod("updateEAValidation", function(value, element) { 
		var userSelectedEA = value; /* New EA to be updated */
		var existingEAName = $("#entitlementNameInfo").val();
		var existingEANumber = $("#entitlementAccountNumberInfo").val();
		//VSUS
		var existingFolderName =  $("#folderNameInfo").val();
		if(existingFolderName == "null"){existingFolderName = "";}
		var userSelectedFolder =  $("select#folderListFileSR option:selected").val();		
		var noErrors = false;
		//User Chooses NONE as the option and value passed is ''(empty String)
		if(userSelectedEA == null || $.trim(userSelectedEA) == ''){
			//existing EA is NONE
			if((existingEAName == null || $.trim(existingEAName) == '') && (existingEANumber == null || $.trim(existingEANumber) == '')){
					noErrors = false; //Both existing EA and new EA are same. User should choose a different EA for update.
			}
			//existing EA is XXXX-XXXX
			else{
				noErrors = true; //Update the EA details in SFDC. 
			}
		} 
		//User Chooses the EA XXXX - XXXX as the option and value passed is XXXX-XXXX
		else{
			//existing EA is NONE
			if((existingEAName == null || $.trim(existingEAName) == '') && (existingEANumber == null || $.trim(existingEANumber) == '')){
				noErrors = true; //Update the EA details in SFDC. 								
			} 			
			//existing Ea is XXX-XXX
			else{
				var userProvidedEANumber = userSelectedEA.substring(0, userSelectedEA.indexOf('-'));
				var userProvidedEAName = userSelectedEA.substring(userSelectedEA.indexOf('-') + 1);
				if($.trim(existingEANumber) == $.trim(userProvidedEANumber)){
					//VSUS START
					if($.trim(existingFolderName) == $.trim(userSelectedFolder)){
						noErrors = false; //Both existing EA and new EA are same and folders are also same. User should choose a different EA orFolder for update.
					}else{
						noErrors = true;
					}	
					//VSUS END
				}else{
					noErrors = true; //Update the EA details in SFDC. 
				}
			}
		}
		if(noErrors == true){
			return true;
		}else{
			return false;
		}
			
	}, support.globalVars.selectAnotherAcc);
	

$('#attachmentvalidate').validate({
	errorClass: "error",
        rules : {
              'attachmentComments' : {
                 attachmentSummary : true,
				 maxlength :400
              }   
        },    
        messages : {
			'attachmentComments' : {
                maxlength : $.format(support.globalVars.reduceChars)                            
            }
        },
        errorPlacement : function(error, element) {              
              var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
              errorDiv.html(error);
              errorDiv.addClass('error');
              element.parents('.ctrlHolder').addClass('error');                    
        },
        onfocusout: function(element){
              this.element(element);
        }, 
        submitHandler : function(form){
      	  	form.submit();      	  
        },
        success : function(label){
            label.parent().removeClass('error');
			label.parents('.ctrlHolder').removeClass('error');
        }
});

$('#updateEAvalidate').validate({
	errorClass: "error",
        rules : {
              'detailsVO.entitlementAccount' : {
					updateEAValidation : true					
               }                   
        }, 		
        errorPlacement : function(error, element) {
        	//VSUS
             /* var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');             
              errorDiv.html(error);
              errorDiv.addClass('error');
              element.parents('.ctrlHolder').addClass('error');*/
              $("#changeAccountAsscociationErrorDiv1").html(error);
              $("#changeAccountAsscociationErrorDiv1").addClass('error');
              $("#changeAccountAsscociationErrorDiv1").parents('.ctrlHolder').addClass('error');   
              $("#changeAccountAsscociationErrorDiv").parents('.ctrlHolder').addClass('error');                  
        },
        onfocusout: function(element){
              this.element(element);
        }, 
        submitHandler : function(form){
			$("#bttnUpdateEA").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#bttnUpdateEA").attr("href","javascript:void(0);");	
			$("#cancelAndResetSR").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#cancelAndResetSR").attr("href","javascript:void(0);");	
      	  	form.submit();      	  
        },
        success : function(label){
        	//VSUS
            /*label.parent().removeClass('error');
			label.parents('.ctrlHolder').removeClass('error');*/
        	$("#changeAccountAsscociationErrorDiv1").removeClass('error');
            $("#changeAccountAsscociationErrorDiv1").parents('.ctrlHolder').removeClass('error');   
            $("#changeAccountAsscociationErrorDiv").parents('.ctrlHolder').removeClass('error'); 
        }
});
$('#additionalnotesvalidate').validate({
	errorClass: "error",
        rules : {
              'addnotes' : {
					additionalNotesSummary : true,
					maxlength :4000
               }                   
        },    
        messages : {
              'addnotes' : {
                    maxlength : $.format(support.globalVars.reduceChars)
              }
        },
        errorPlacement : function(error, element) {
        	if(error.html()!= ''){
              var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
              errorDiv.html(error);
              errorDiv.addClass('error');
              element.parents('.ctrlHolder').addClass('error');   
        	}
        },
        onfocusout: function(element){
        	if(element != null){
        		this.element(element);
        	}
        }, 
        submitHandler : function(form){
			$("#additionalNotesButton").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#additionalNotesButton").attr("href","javascript:void(0);");	
			$("#cancelAndResetNotes").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#cancelAndResetNotes").attr("href","javascript:void(0);");	
      	  	form.submit();      	  
        },
        success : function(label){
            label.parent().removeClass('error');
			label.parents('.ctrlHolder').removeClass('error');
        }
});

$('#closevalidate').validate(
                  {
                	  
                  errorClass: "error",
                  rules : {
                        'description' : {
                          closeRequestDescription : true,
                          maxlength :4000
                           },
                           'selectedReason' :{
                        	   required : true
                           }
                             
                  },    
                  messages : {
                        'description' : {                              
                               maxlength : $.format(support.globalVars.reduceChars)
                        },                             
                        'selectedReason' : {
                            required :  support.globalVars.requiredLbl
                            
                      }
                  },
                  errorPlacement : function(error, element) {
                	  if(error.html()!= ''){
                        var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                        errorDiv.html(error);
                        errorDiv.addClass('error');
                        element.parents('.ctrlHolder').addClass('error');
                	  }
                  },
                  onfocusout: function(element){
                	  if(element != null){
                        this.element(element);
                	  }
                  }, 
                  submitHandler : function(form){				  
						$("#bttnClose").addClass("disabled").css("cursor","default").attr("disabled",true);
						$("#bttnClose").attr("href","javascript:void(0);");	
						$("#cancelAndResetClose").addClass("disabled").css("cursor","default").attr("disabled",true);
						$("#cancelAndResetClose").attr("href","javascript:void(0);");	
                	  	form.submit();
                	  
                  },
                  success : function(label){
                        label.parent().removeClass('error');
                  label.parents('.ctrlHolder').removeClass('error');
                  }
            });


$('#escalatevalidate').validate(
        {
      	  
        errorClass: "error",
        rules : {
              'description' : {
                escalateRequestDescription : true,
                maxlength :4000
                 }
                   
        },    
        messages : {
              'description' : {                    
                     maxlength : $.format(support.globalVars.reduceChars)
              }
        },
        errorPlacement : function(error, element) {
        	 if(error.html()!= ''){
	              var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
	              errorDiv.html(error);
	              errorDiv.addClass('error');
	              element.parents('.ctrlHolder').addClass('error');    
        	 }
        },
        onfocusout: function(element){
        	if(element != null){
              this.element(element);
        	}
        }, 
        submitHandler : function(form){
			$("#actionEscalate").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#actionEscalate").attr("href","javascript:void(0);");
			$("#cancelAndResetER").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#cancelAndResetER").attr("href","javascript:void(0);");	
      	  	form.submit();
      	  
        },
        success : function(label){
              label.parent().removeClass('error');
        label.parents('.ctrlHolder').removeClass('error');
        }
  });

$('#reopenvalidate').validate(
        {
      	  
        errorClass: "error",
        rules : {
              'description' : {
                reopenRequestDescription : true,
                maxlength :4000
                 }
                   
        },    
        messages : {
              'description' : {
                     maxlength : $.format(support.globalVars.reduceChars)
              }
        },
        errorPlacement : function(error, element) {
              
              var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
              errorDiv.html(error);
              errorDiv.addClass('error');
              element.parents('.ctrlHolder').addClass('error');                    
        },
        onfocusout: function(element){
              this.element(element);
        }, 
        submitHandler : function(form){
			$("#actionReopen").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#actionReopen").attr("href","javascript:void(0);");
			$("#cancelAndResetReopen").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#cancelAndResetReopen").attr("href","javascript:void(0);");	
      	  	form.submit();
      	  
        },
        success : function(label){
            label.parent().removeClass('error');
			label.parents('.ctrlHolder').removeClass('error');
        }
  });
	if($.browser.msie && $.browser.version == '7.0'){
			$('#additionalNotesButton').click(function() {	
				$('#additionalnotesvalidate').submit();  
			});	

			$('#bttnClose').click(function() {
				$('#closevalidate').submit();  
			});	

			$('#bttnUpdateEA').click(function() {	
				$('#updateEAvalidate').submit();  
			});	

			$('#actionEscalate').click(function() {	
				$('#escalatevalidate').submit();  
			});

			$('#actionReopen').click(function() {	
				$('#reopenvalidate').submit();  
			});
	}
};

//This function will be used by the SummaryRequestDetails.jsp, where on selecting a drop down value the corresponding section is shown.
detailsDropDown = function() {		
	var $detailsManagement = $('.support-details-wrapper');
	// Change the module which is displayed when the drop down value changes.
	
	$detailsManagement.find('.sup_content').not('#'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected module in the drop down.
	$detailsManagement.find('header p').not('.'+$('#sel_wantTo').val()).hide(); // Hide all but the currently selected paragraph.
	
	/*On page load if the dropdown option is 'Add Attachment'/'Add Additional Notes'/'Close Request'/'Manager Assistance'/'Re-open Request'/'Update EA' then render it.*/
	var iWantToDropDown = $('#sel_wantTo').val();
	if(iWantToDropDown == 'add_attachments' || iWantToDropDown == 'add_additional_notes' || iWantToDropDown == 'close_request' || iWantToDropDown == 'manager_assistance' || iWantToDropDown == 'reopen_request' || iWantToDropDown == 'update_ea'){
		$('header p.'+iWantToDropDown).slideDown();   
    $('#'+iWantToDropDown).removeClass('hidden').show();    
    if( iWantToDropDown == 'add_attachments'){
      $('.htmlUploadDiv').show(); /* to show the htmlupload-div - which is a separate position-absolute elemnt in summarRequestDetails.jsp */
    }
  }
	
	
	$('#sel_wantTo').change(function() {
		var cc = $(this).val();
		$detailsManagement.find('.sup_content:visible').slideUp('fast',function() {
			$('#'+cc).slideDown();
		});
		$detailsManagement.find('header p:visible').slideUp('fast',function() {
			$('header p.'+cc).slideDown();
		});
		$detailsManagement.find('.instruction_text').hide();
		
		if(cc =='add_attachments'){
			$('#add_attachments').removeClass('hidden');
      $('.htmlUploadDiv').show(); /* to show the htmlupload-div - which is a separate position-absolute elemnt in summarRequestDetails.jsp */			
		}else{
			$('#add_attachments').addClass('hidden');
			$('#'+cc).slideDown();
      $('.htmlUploadDiv').hide(); /* to show the htmlupload-div - which is a part of only add-attachment section; should be hidden for all other "i want to" dropdown values */
		}
		if(cc=='update_ea')
		{
			if(vmf.dropdown){
				if($('#eaSelector').length)
				{
					if(setEaSelector==false)
					{
						vmf.dropdown.build($("#eaSelector"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right",onSelect:myvmware.summarydetails.getLevelOneFoldersWithFileSRPermission});
						setEaSelector=true;
						myvmware.summarydetails.getLevelOneFoldersWithFileSRPermission();
					}
				}
			}
		}
	}); 
	// Open close activity
	$('.activity-type a').click(function(){
		$(this).toggleClass("open").next().toggle();
		return false;
	}); 
	
};

/* START : The below code will be used in the Summary Details Page for the Add Attachment/Add Additional Notes Section */
var additionalNotesCounter = 0;
var attachmentCommentsCounter = 0;
var descriptionCounter =0;
var description2Counter =0;
var description3Counter =0;
 
function incrementCounter(id){
	if(id == "addnotes"){		
		additionalNotesCounter++;
		$("textarea#addnotes").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
	}
	if(id == "attachmentComments"){		
		attachmentCommentsCounter++;	
		$("textarea#attachmentCommentsText").css("color", "#444444");//grey color for default text and #444444(black) for user entered text		
	}
	if(id == "description"){		
		descriptionCounter++;
		$("textarea#description").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
	}
	if(id == "description2"){		
		description2Counter++;
		$("textarea#description2").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
	}
	if(id == "description3"){		
		description3Counter++;
		$("textarea#description3").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
	}
}

function showSuggestion(id) {
	if(id == "addnotes") {
		var userAdditionalComments = $("textarea#addnotes").val();
		var defaultAdditionalComments = $("#additionalNotesDefaultText").val();
		
		if($.trim(userAdditionalComments) == "" || $.trim(userAdditionalComments) == $.trim(defaultAdditionalComments)){
			$("#addnotes").val(defaultAdditionalComments);
			$("textarea#addnotes").css("color", "#999999");//grey color for default text and #444444(black) for user entered text
		}
	}
	if(id == "attachmentComments") {
		var userAttachmentComments = $("textarea#attachmentCommentsText").val();
		var defaultAttachmentComments = $("#attachmentDefaultText").val();	
	
		if($.trim(userAttachmentComments) == "" || $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {
			$("textarea#attachmentCommentsText").val(defaultAttachmentComments);
			$("textarea#attachmentCommentsText").css("color", "#999999");//grey color for default text and #444444(black) for user entered text				
			
		}
	}	

	//BUG-00017234 fix start
	if(id == "description") {
		var userAttachmentComments = $("textarea#description").val();
		var defaultAttachmentComments = $("#closeSRDefaultText").val();	
	
		if($.trim(userAttachmentComments) == "" || $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {
			$("textarea#description").val(defaultAttachmentComments);
			$("textarea#description").css("color", "#999999");//grey color for default text and #444444(black) for user entered text				
		}
	}

	if(id == "description2") {
		var userAttachmentComments = $("textarea#description2").val();
		var defaultAttachmentComments = $("#escalateSRDefaultText").val();	
	
		if($.trim(userAttachmentComments) == "" || $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {
			$("textarea#description2").val(defaultAttachmentComments);
			$("textarea#description2").css("color", "#999999");//grey color for default text and #444444(black) for user entered text				
			
		}
	}

	if(id == "description3") {
		var userAttachmentComments = $("textarea#description3").val();
		var defaultAttachmentComments = $("#reopenSRDefaultText").val();	
	
		if($.trim(userAttachmentComments) == "" || $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {
			$("textarea#description3").val(defaultAttachmentComments);
			$("textarea#description3").css("color", "#999999");//grey color for default text and #444444(black) for user entered text				
			
		}
	}
	//BUG-00017234 fix end
}

function hideSuggestion(id) {	
	if(id == "addnotes") {
		$("textarea#addnotes").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
		var userAdditionalComments = $("textarea#addnotes").val();
		var defaultAdditionalComments = $("#additionalNotesDefaultText").val();	
	
		if((additionalNotesCounter == 0) || (additionalNotesCounter != 0 &&  $.trim(userAdditionalComments) == $.trim(defaultAdditionalComments)))	{
			if($.trim(userAdditionalComments) == $.trim(defaultAdditionalComments)) {
				$("#addnotes").val('');
			}
		}
	}
	
	if(id == "attachmentComments") {
		$("textarea#attachmentCommentsText").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
		var userAttachmentComments = $("textarea#attachmentCommentsText").val();
		var defaultAttachmentComments = $("#attachmentDefaultText").val();	
	
		if((attachmentCommentsCounter == 0)|| (attachmentCommentsCounter != 0 &&  $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments))) {
			if($.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {		
				$("textarea#attachmentCommentsText").val('');
			}
		}
	}	
	if(id == "description") {
		$("textarea#description").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
		var userAttachmentComments = $("textarea#description").val();
		var defaultAttachmentComments = $("#closeSRDefaultText").val();	
	
		if((descriptionCounter == 0)|| (descriptionCounter != 0 &&  $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments))) {
			if($.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {		
				$("textarea#description").val('');
			}
		}
	}
	if(id == "description2") {
		$("textarea#description2").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
		var userAttachmentComments = $("textarea#description2").val();
		var defaultAttachmentComments = $("#escalateSRDefaultText").val();	
	
		if((description2Counter == 0)|| (description2Counter != 0 &&  $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments))) {
			if($.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {		
				$("textarea#description2").val('');
			}
		}
	}
	if(id == "description3") {
		$("textarea#description3").css("color", "#444444");//grey color for default text and #444444(black) for user entered text
		var userAttachmentComments = $("textarea#description3").val();
		var defaultAttachmentComments = $("#reopenSRDefaultText").val();	
	
		if((description3Counter == 0)|| (description3Counter != 0 &&  $.trim(userAttachmentComments) == $.trim(defaultAttachmentComments))) {
			if($.trim(userAttachmentComments) == $.trim(defaultAttachmentComments)) {		
				$("textarea#description3").val('');
			}
		}
	}	
}

function getOptionSelected(){
	var selectedOption = $('#sel_wantTo').val();
	if(selectedOption == "add_additional_notes"){
		$('#addnotes').val('');
		showSuggestion("addnotes");
	}	
	if(selectedOption == "add_attachments"){
		$('.error_msg').hide();
		showSuggestion("attachmentComments");
	}
	//BUG-00017234 start
	if(selectedOption == "manager_assistance"){
		$('.error_msg').hide();
		showSuggestion("description2");
	}
	
	if(selectedOption == "close_request"){	
		$('#description').val('');		
		$('#sel_reason').val('');
		$('.error_msg').hide();
		showSuggestion("description");
	}
	
	if(selectedOption == "reopen_request"){	
		$('#description3').val('');
		$('.error_msg').hide();
		showSuggestion("description3");
	}
	//BUG-00017234 end
}
function fetchEAOnChange(){
	//Empty function need for Generic EA Selector
}
/* END : The above code will be used in the Summary Details Page for the Add Attachment/Add Additional Notes Section */
