// HOL Chooser page code
if (typeof(myvmware) == "undefined")  myvmware = {};
chlog={}; 
cntrlLogin={};

myvmware.chlog = {    
	init:function(){
	cntrlLogin = myvmware.chlog;
	var params = cntrlLogin.getUrlPrarams();
	cntrlLogin.selectedLink = params.selectedLink;
	cntrlLogin.ProgramId = params.p;
	cntrlLogin.parentDocHeight = 0;
	
	$('#prgShortName').val(cntrlLogin.ProgramId);
	$('#redirectURL').val('/web/vmware/evalcenter'+location.search);
	
	if(params.selectedLink=='login') {
		$('#tab_login').removeClass("hide_cntnr");
	}
	else{
		$('#tab_register').removeClass("hide_cntnr");
	}

	$(document).on('click', '#button-login', function (event) {				
		cntrlLogin.submitLoginTabForm();
	});
	$(document).on('click', '#button-register-tabcenter', function (event) {                
		cntrlLogin.submitRegister_Tab();
	});
	$(document).on('click', '#Frgpwd a', function (event) {                
		cntrlLogin.forGotPassLnk();
	});
	
	setInterval(cntrlLogin.resizeParentFrame, 250);
	},
	getUrlPrarams:function() {
		var regex = /[?&]([^=#]+)=([^&#]*)/g,
		url = window.location.href,
		params = {},
		match;
		while(match = regex.exec(url)) {
			params[match[1]] = match[2];
		}
		return params;
	},
	validateLoginForm: function(){  
		cntrlLogin.clearErrors();
        var username  = $.trim($('#username').val());
		var password  = $.trim($('#password').val());
        var flag = true;
		if(username==""){
			$('#username_error').text(plRS.userNameVald);
			flag = false;
		}else{
			if(!cntrlLogin.validateEmailCN(username)){
				$('#username_error').text(plRS.userNameVald);
				flag = false;
			}
		}
		if(password == ""){
			$('#password_error').text(plRS.passwordVald);
			flag = false;
		}
		return flag;
	},
	validateRegisterForm: function(){
		cntrlLogin.clearErrors();
		var flag = true;
        var username  = $.trim($('#Email_Register_Tab').val());
		var firstname  = $.trim($('#FirstName_Register_Tab').val());
		var lastname  = $.trim($('#LastName_Register_Tab').val());
		if(firstname==""){
			$('#FirstName_Register_Tab_error').text(plRS.firstNameErr);
			flag = false;
		}
		if(lastname==""){
			$('#LastName_Register_Tab_error').text(plRS.lastNameErr);
			flag = false;
		}
		if(username==""){
			$('#Email_Register_Tab_error').text(plRS.regEmailErr);
			flag = false;
		}else{
			if(!cntrlLogin.validateEmail(username)){
				$('#Email_Register_Tab_error').text(plRS.regEmailErr);
				flag = false;
			}
		}
		return flag;
	},
    submitLoginTabForm:function()  {
		cntrlLogin.loginchk = '/web/vmware/login?p_p_id=CRFUtilityPortlet_WAR_it-crossfunctional&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=isUserLoggedInURL';
		if(!cntrlLogin.validateLoginForm()){
			return false;
		}
		var uname = jQuery.trim($('#username').val());
		$.ajax({
			
			url: plRS.urllogin,
			type: "POST",
			dataType: "json",
			data: {username:uname,password:$("#password").val()},
			success: function(object)
				{
					try
					{

						if(object.user != null && object.user.length> 0){
							 window.parent.location = '//'+location.hostname+'/group/vmware/evalcenter'+location.search;
							 return false;
						}
						if(object.VM_ERROR != null && object.VM_ERROR.length> 0){
							if(object.REDIRECT_URL != null && object.REDIRECT_URL.length> 0){
								window.parent.location = object.REDIRECT_URL;
								return false;
							}
						}
						
					}
					catch(err)
					{
						$("#error-message-login").html(plRS.webgateAuthGenericErrorMessage);
					}
				},            
				error: function(XMLHttpRequest, textStatus, errorThrown) {
						$.ajax({
							url: cntrlLogin.loginchk,
							dataType: "json",
							success: function (Ustat) {
								if (Ustat.isUserLoggedIn) {
									window.parent.location = '//'+location.hostname+'/group/vmware/evalcenter'+location.search;
									return false;
								} else {
									$("#error-message-login").html(plRS.webgateAuthErrorMessage);
								}
							},
							error: function (xhr, status, error) {
								$("#error-message-login").html(plRS.webgateAuthGenericErrorMessage);
							}
						});
						
				}
			});
    },
	submitRegister_Tab:function()  {

		if(!cntrlLogin.validateRegisterForm()){
			return false;
		}
		$.ajax({
			url: plRS.urlregis,
			type: "POST",
			dataType: "json",
			data: {emailAddress:$("#Email_Register_Tab").val(), prgShortName:cntrlLogin.ProgramId},
			success: function(object)
				{
					try
					{                    
					   
						if(object.isRegisteredUser){                        
						   $('#error-message-login').html(plRS.alreadyRegsErrorMessage);
						   $('#username').val($('#Email_Register_Tab').val());
						   $('#tab_register').addClass("hide_cntnr");
						   $('#tab_login').removeClass("hide_cntnr");
						   return false;
						}
						else{
						   $('#evalRegisterTabId').attr("action",'/web/vmware/registration'+location.search+'&source=evap');
						   $('#evalRegisterTabId').submit();
						   return false;
						}
					}
					catch(err)
					{
						$("#error-message-register").html(plRS.webgateAuthGenericErrorMessage);
					}
				},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#error-message-register").html(plRS.webgateAuthGenericErrorMessage);                
				}
        });
    },
	clearErrors: function(){
		$('#username_error').text('');
		$('#password_error').text('');
		$('#Email_Register_Tab_error').text('');
		$('#error-message-login').text('');
		$('#error-message-register').text('');
		$('#FirstName_Register_Tab_error').text('');
		$('#LastName_Register_Tab_error').text('');
	},
	validateEmailCN : function (elementValue) {
			return (/^[0-9]/i.test(elementValue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(elementValue));
	},
	validateEmail :	function (elementValue) {
			return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(elementValue);
	},
	forGotPassLnk: function(){
		window.parent.location = '//'+location.hostname+'/web/vmware/forgot-password';
		return false;
	},
	resizeParentFrame: function() {
	var docHeight = $('#logon').height()+40;
	  if (docHeight != cntrlLogin.parentDocHeight) {
		cntrlLogin.parentDocHeight = docHeight;
		var locMyV = location.hostname;
		var locDotCom = 'https://'+ locMyV.replace('my', 'www');
		window.parent.postMessage(cntrlLogin.parentDocHeight, locDotCom);
	  }
	}
}