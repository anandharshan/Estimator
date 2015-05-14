/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  resetPwdConfirmation.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 06/30/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Kanhaiya Saxcena)
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */

/*
 * This function is used to make an Ajax call to resend email
 * to the user again.
 * 
 * @author Kanhaiya Saxena
 */
if (typeof(myvmware) == "undefined")  
	myvmware = {};

myvmware.resetPwdConfirmation = {
  	init: function(){
  		//vmf.scEvent =true;
  		$('#resendEmailOnClick').click( function(){
  			checkEmailAddress();
  			return false;
  			} );
  		//resetPassOminature();
  	}
};

function checkEmailAddress() {
	//appendDiv('resendEmailOnClick');
	var emailId = $("#txt_email").val();
	$.ajax({
		beofreSubmit : vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true}),
		type : "POST",
		dataType : "text json",
		url : $("#resendEmailAjaxURL").val(),
		data : {
			emailAddress : emailId
		},
		async : false,
		success : function(data) {
			if(typeof data == 'object' && data.updateStatus == 'success'){
				var sucessDiv=$("#updateSuccessDiv");
				var errorDiv =$("#updateErrorDiv");
				sucessDiv.removeClass('hidden');
				errorDiv.addClass('hidden');
			
			} else if(typeof data == 'object' && data.updateStatus == 'error'){
				
				var sucessDiv=$("#updateSuccessDiv");
				var errorDiv =$("#updateErrorDiv");
				sucessDiv.addClass('hidden');
				errorDiv.removeClass('hidden')
			}
			else {
				var sucessDiv=$("#updateSuccessDiv");
				var errorDiv =$("#updateErrorDiv");
				sucessDiv.addClass('hidden');
				errorDiv.removeClass('hidden');
			}
			vmf.loading.hide();
		},
		error : function(){
			vmf.loading.hide();
		}
	});
	
}
function resetPassOminature(){
	
	callBack.addsc({'f':'riaLink','args':['confirmation']});
	
}

function appendDiv(passedElement){

	$position = $('#'+passedElement);
	$position.parent().append('<div class="preLoading" style="padding-top:10px;"><div class="loading_small">'+usermanagement.globalVar.loadingLbl+'</div></div>');

}