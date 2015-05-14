/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  script.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 06/01/2011
/* ########################################################################### */

if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.mycommunication = {
  	init: function() {
  		//vmf.scEvent =true;
  		prepopulateAreasOfInt();
  		populateReadOnlySelectFields();
  		//accountPrefTabOminature();
  		$('#savePreferenceInfo').click( function(){
  			submitPreferencesForm();
  			return false;} );
  		$('#saveAreaOfInterest').click( function(){
  			submitAreaOfInterestForm();
  			return false;} );
  		
  		$('#areaOfInterestForm').submit(function() {	
  				
  				var options = {
  					async : false,	
  					success : function(data){processResponse(data, $('#saveAreaOfInterest'));}
  				};
  				$(this).ajaxSubmit(options);
  				
  				return false;
  			});
  		
  		$('#preferencesForm').submit(function() {	
  			
  			var options = {
  				async : false,	
  				success : function(data){processResponse(data, $('#savePreferenceInfo'));}
  			};
  			$(this).ajaxSubmit(options);
  			
  			return false;
  		});
  		
  		minimizeAllSections();
  	  	// code which will run on all profile pages
  	  	
  	  	// Open close buttons
  	  	$('.profile-minimize-button').click(function() {
  	  		myvmware.mycommunication.toggleMinMax(this);  	
  	  		return false;
  		});
  		
  		
  		// Edit-Cancel-Save buttons		
  		$('a.fn_edit').click(function() {
  			var $fieldset = $(this).parents('fieldset');	
 			
  			// Hide all the read only fields
  			$fieldset.find('.read-only').addClass('hidden');
  			
  			// Show all the editable fields
			$fieldset.find('.fn_editable').removeClass('hidden');
  			
			//Hide edit button
			$fieldset.find('.fn_edit').addClass('hidden');
			
			//Show Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').removeClass('hidden');
			
			$fieldset.find('.success-msg').addClass('hidden');
  			
  			return false;
  		});
  		
  		$('a.fn_cancel').click(function() {
			var $fieldset = $(this).parents('fieldset');
			
			// Show all the read only fields
  			$fieldset.find('.read-only').removeClass('hidden');
  			
  			// Hide all the error messages
  			$fieldset.find('.error_msg').addClass('hidden');
  			
  			// Revert error message changes
  			$fieldset.find('.ctrlHolder,.subCtrlHolder').removeClass('error');
			
			// Hide all the editable fields
			$fieldset.find('.fn_editable').addClass('hidden');
			
			$fieldset.find('.success-msg').addClass('hidden');
			
			//Show edit button
			$fieldset.find('.fn_edit').removeClass('hidden');
			
			//Hide Save/Cancel buttons
			$fieldset.find('.fn_save,.fn_cancel').addClass('hidden');
  			
  			
  			return false;
  		});  	
  		
  	//Added for the Ominature
  		/*$('#commOmniTab').click(function() {
  			console.log('my comjs Communication Tab');
  			riaLink('communications'); 
  			return false;
  		});
  		$('#prefOmniTab').click(function() {
  			console.log('my comjs account-preferences Tab');
  			riaLink('account-preferences'); 
  			return false;
  		});*/
	},
	
	toggleMinMax : function(buttonObj){
		var $fieldset;
		
		if($(buttonObj).parents('.list-wrapper').length > 0){
			$fieldset = $(buttonObj).parents('.list-wrapper');
		}else{
			$fieldset = $(buttonObj).parents('fieldset');
		}
		
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

function accountPrefTabOminature(){
	callBack.addsc({'f':'riaLink','args':['account-preferences']});
}
