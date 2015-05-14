/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  resetPwdConfirmation.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 06/30/2011
/* ########################################################################### */

/*
 * This function is used to make an Ajax call to resend email
 * to the user again.
 * 
 * @author Kanhaiya Saxena
 */
if (typeof(myvmware) == "undefined")  
	myvmware = {};

VMFModuleLoader.loadJscripts(['/static/myvmware/modules/user_management/js/jquery.i18n.properties.js']);
var loadingMessage = null;

myvmware.activationInstruction = {
  	init: function(){
  		//vmf.scEvent =true;
  		//var langauge=$('#localeFromLiferayTheme').text();
        //loadBundles(langauge);
        updateMessage();	
  	$('#resendActivationEmailOnClick').click( function(){  	
  			updateMessage();		
  			checkEmailAddress();
  			return false;
  			} );
  		//ominature();
  	},
	inactiveAccount: function(){
		$(window).unload(function() {
		 myvmware.activationInstruction.del_cookies();		
		});
	},
	resendEmail: function(){
		$('#resendChangeEmailOnClick').click( function(){
			updateMessage();
			resendChangeEmail();
  			return false;
  			} );	
	},
	passEmailToLoginPage:function(){
	$('#passEmailToLoginPage').click(function(){ 			
			submitToLoginPage();
			return false;
		} );
	},
	del_cookies: function ()
	  {
		var new_date = new Date();
		new_date = new_date.toGMTString();
		var thecookie = document.cookie.split(";");
		
		for (var i = 0;i < thecookie.length;i++) 
		{
			var name = thecookie[i];
			
			var eqPos = name.indexOf("=");
			var cookieName = eqPos > -1 ? name.substr(0, eqPos) : name;
			
			if (cookieName != null && (cookieName.indexOf("JSESSIONID") != -1 || cookieName.indexOf("ObSSOCookie") != -1  || cookieName.indexOf("ObTEMC") != -1 ))
			{				
				myvmware.activationInstruction.delete_Cookie(cookieName,"/","vmware.com");			
			}
		}
	 },
	 delete_Cookie : function ( name, path, domain ) 
	 {
		document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	 }	 
};

function submitToLoginPage(){
	$('#passEmailToLoginForm').submit();
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
	loadingMessage=usermanagement.globalVar.loadingLbl
}

function checkEmailAddress() {
	//appendDiv('resendActivationEmailOnClick');
	var emailId = $("#txt_email").val();
	var firstName= $("#firstName").val();
	var cn= $("#cn").val();
	var redirectURL=$("#redirectURL").val();
	$.ajax({
		//beofreSubmit : vmf.loading.show({"msg":"Loading... ", "overlay":true}),
		type : "POST",
		dataType : "text json",
		url : $("#resendActivationEmailURLAjaxURL").val(),
		data : {
			emailAddress : emailId,
			firstName: firstName,
			cn: cn,
			redirectURL: redirectURL
		},
		//async : false,
		beforeSend :function(){
		vmf.loading.show({"msg":loadingMessage, "overlay":true})},
		complete:function(){vmf.loading.hide();},
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
function resendChangeEmail() {

	var newEmailVal= $("#newEmail").val();
	/* token removed as part of BUG-00059661*/
	$.ajax({
		//beofreSubmit : vmf.loading.show({"msg":"Loading... ", "overlay":true}),
		type : "POST",
		dataType : "text json",
		url : $("#resendEmailURLAjaxURL").val(),
		data : {
			newEmail : newEmailVal
			/* token removed as part of BUG-00059661*/
		},
		//async : false,
		beforeSend :function(){
		vmf.loading.show({"msg":loadingMessage, "overlay":true})},
		complete:function(){vmf.loading.hide();},
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


function ominature(){
	
	callBack.addsc({'f':'riaLink','args':['activation-instructions']});
}

function appendDiv(passedElement){

	$position = $('#'+passedElement);
	$position.parent().append('<div class="preLoading" style="padding-top:10px;"><div class="loading_small">'+loadingMessage+'</div></div>');

}
