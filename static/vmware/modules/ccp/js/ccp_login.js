if (typeof(ccp) == "undefined")  ccp = {};
ccp.login = {
	urllogin:null,
	getname_url: "/account/autoLogin.do?vmware=getUserName",
	login_url: "/account/secure/login.do",
	logout_url: "/account/logout.do",
	loginContainer : null,
	username:null,
	th:null,
	loginBox: null,
	init : function() {
		th = ccp.login;		
		loginBox = $('#loggedInPanel');
		//th.validateCookie();
		th.getSP();
		urllogin=ccp.globalVar.idmAjaxUrl;
		if($("#getUserNameAjaxUrl").val() != undefined && $("#getUserNameAjaxUrl").val().length > 0){
            var getUserNameUrl = (location.protocol + '//'+location.hostname + $("#getUserNameAjaxUrl").val());
			vmf.ajax.post(getUserNameUrl,null,function(jData){
				if(jData != null && jData.userName.length){ 
					$('#username').val(jData.userName);
					$('#rememberMe').attr("checked","checked");
				}
			});
		}
		//Tab management - Hide and show the correct tabs
		$('#eppLoginWidget .tabbed_area').each(function(){
			var $this = $(this), content_show;
			if($this.children('.tabs').length > 0){
				content_show = $this.children('.tabs').find('.active').attr('title');
				$('#'+content_show).show();
			}
		});
		$('#content-left .tabhead li a').click(function(){
			var $this = $(this), content_show, $title = $this.attr('title');
            //Placeholder for omniture event
			return true;
		});
		/****************** Start: Added code as part of CR 199, 200, 203 Login My VMWare tab validation *******************************/
								
		var oBFormCookieVal = vmf.cookie.read("ObFormLoginCookie");
			if(oBFormCookieVal != null && oBFormCookieVal.indexOf("productRegistration.do")  >= 0) {
				$("#tabbed_box_1_tabs").hide();	
				$("#prod_reg_msg").show();
				$("#btnLearnMore").hide();				
		}
	 	//Adding even on epp login button of login tab
		$("#ccp-login").live('click', function() {
			var isError = false, emailId = $("#username"), pass = $("#password");
			$('#loginCCP').find('.errorMsg').remove();
			if(!th.validateEmailCN(emailId.val())) {
				emailId.parent().before('<div class="ctrlHolder errorMsg clearfix"><label for="username">'+ccp.globalVar.enterEmailorCN+'</label></div>');
				isError = true;
			}
			if(!pass.val().length) {
				pass.parent().before('<div class="ctrlHolder errorMsg clearfix"><label for="password">'+ccp.globalVar.enterPassword+'</label></div>');
				isError = true;
			}
			if(isError) {
				pass.val('');
				return false;
			} else {
				$(this).attr('disabled',true).addClass('disabled');
				th.submitLoginTabForm(emailId.val(),pass.val(),urllogin);
			}
			if(!$('#rememberMe').attr("checked")){th.deleteLoginCookie('EPPUSER','/','');}
			return false;
		});
		// When a tab clicked		
			
		$("#loginBtn").click(function(){
			th.validateLogin($('#login_txt_email').val(),$('#login_password').val());
			return false;
		})
		//Adding Forgot password code
		 $('#forgotPassword').click( function(){
  			$('#loginForm').attr("action", ccp.globalVar.forgotPasswordUrl);
  			$('#loginForm').submit();
  			return false;
		 });
		
		$('a#enrollLink').live('click',function(){
			var enrollBtn = $('#eppLoginWidget').find('a[title="enrollEPP"]');
			$('html, body').animate({ scrollTop: 0 }, 600);
			if(!enrollBtn.hasClass('active')) enrollBtn.trigger('click');
			return false;
		})
		
	}, // end of init
	submitLoginTabForm:function(emailId,pass,urllogin) {
		var uname = emailId;
		$.ajax({
			type : "POST",
			dataType : "json",
			url : urllogin,
			data : {
				username : uname,
				password : pass
			},
			success : function(object) {
				try {
					var user = object.user;
					var rememberMeFlag = $("#rememberMe").is(":checked");
					if(rememberMeFlag){	
						th.rememberMeChecked(rememberMeFlag);	
					}
					else {
						document.forms['loginForm'].submit();
					}
					
				} catch(err) {
					
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				var deactiveCookie = vmf.cookie.read("deActivationCookie");
				var authCookie = vmf.cookie.read("authentication");
				var obsCookie = vmf.cookie.read("ObSSOCookie");
				if(deactiveCookie != null && deactiveCookie != "") {
					$('#ccp-login').attr('disabled', false).removeClass('disabled');
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + ccp.globalVar.deactivateEmail1 + '<a href='+ccp.globalVar.supportUrl+ ' target="_blank">'+ ccp.globalVar.deactivateEmail2+'</a>'+'</label></div>');
					th.deleteDeactivateCookie(deactiveCookie, "/", ".vmware.com");
					$('#password').val('');
				}else if(authCookie != null && authCookie == "20001") {
					$('#ccp-login').attr('disabled', false).removeClass('disabled');
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + ccp.globalVar.enterEmailorCNorPwd + '</label></div>');
					$('#password').val('');
				}else if((obsCookie != null && obsCookie != "")){
					location.replace(ccp.globalVar.inactiveAccountUrl);
				}else{
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + ccp.globalVar.genericError + '</label></div>');
					$('#ccp-login').attr('disabled', false).removeClass('disabled');
				}
			}
		});
		return false;
	},
	deleteDeactivateCookie : function( name, path, domain )	{
		document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	},
	deleteLoginCookie : function( name, path, domain )
	{
		document.cookie = name + "=; expires=" + new Date + "; path=" + path;
	},
	getSP:function(){
		vmf.ajax.post(ccp.globalVar.serviceProvidersURL,null,function(jData){
			if(jData != null){
				var dt = jData.SPDetails.aaData, oList = [], tblHeight = 0;
				$.each(dt,function(i,v){
					oList.push('<tr><td><div class="imgHolder fLeft"><a href="http://'+ v[7] + '" target="_blank"><img src="'+ v[2]+'" /></a></div><div class="spContent fLeft"><p class="nomargin"><b>' + v[3] +'</b> '+  v[4] +'<a href="http://'+ v[7] + '" target="_blank"> '+ccp.globalVar.goToLabel+" "+ v[3] +'</a></p><div class="clear fRight"> Region: '+  v[5] + '</div></div></td></tr>');
				})
				$('#tbl_manageservice tbody').empty().append(oList.join(''));
				for(var i = 0; i<6; i++){
					tblHeight += $('#tbl_manageservice tbody tr:eq('+i+')').height();
				}
				$('#tbl_manageservice').parent().height(tblHeight).css('overflow-y','auto'); 
			}
		});
	},
	showRegistered:function(jData){
		if(jData != null){
			var data = vmf.json.txtToObj(jData);
			if(data.registeredUser){
				$('#eppLoginWidget').find('a[title="loginEPP"]').trigger('click');
				$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>'+ccp.globalVar.registeredInBoth+'</label></div>');
			}
		}
	},
	removeErrorClass:function (element) {
		element.parent().removeClass('error');
		element.removeClass('error_msg');
	},
	validateEmailCN:function(elementValue) {
		return (/^[0-9]/i.test(elementValue) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(elementValue));		
	},
	validateEmail:function(elementValue) {
		return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(elementValue);		
	},
	addErrorClass:function(element) {
		element.parent().addClass('error');
		element.addClass('error_msg');
	},
	isEmailRegistered:function() {
		var emailId = $("#email").val();
		$.ajax({
			type : "POST",
			dataType : "json",
			url : $("#checkEmailAddressAjaxUrl").val(),
			data : {
				emailAddress : emailId
			},
			success : function(object) {
				$("#emailCheckStatus").html("");
				th.removeErrorClass($("#emailCheckStatus"));
				try {
					var isUserRegistered = object.isRegisteredUser;
					var errMsg = object.errMsg;
					if(isUserRegistered == true) {
						// switch all tabs off
						$('#tabCreateProfile').removeClass("active");
						// switch this tab on
						$('#tabLoginMyVmware').addClass("active");
						// slide all elements with the class 'content' up
						$('#createProfile').hide();
						$('#loginMyVmware').show();

						$("#username").val(emailId);

						$("#emailCheckStatus").html(errMsg);
						th.addErrorClass($("#emailCheckStatus"));

						$("#username_error").html("");
						$("#password_error").html("");
					} else {
						// just submit the form without any check.
						$("#customerRegistrationForm").submit();
					}
				} catch (err) {
					//empty block
				}
			}
		});
	},
		rememberMeChecked:function(rememberMeFlag) {
		var emailIdOrCN = $("#username").val();
		var dt = {rememberMe : rememberMeFlag, username : emailIdOrCN}
		var rememberUrl = (location.protocol + '//'+location.hostname + $("#checkRememberMeAjaxUrl").val());
		vmf.ajax.post(rememberUrl,dt,function(jData){$('#loginForm').submit();},function(){$('#loginForm').submit();} )
	},
	/*validateCookie :function(){
		var ob = vmf.cookie.read("ObSSOCookie");
		//var referrer = parseUri(document.referrer);
		if (ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "") {
			th.loginContainer = 'preLogin'
			
		}
		else {
			th.loginContainer = 'postLogin'
			th.username = vmf.cookie.read('USER_NAME');
			if(th.username == null || th.username == "") {
				setUserName();
			}
			$('#'+th.loginContainer).find('p.username span').html(th.username);
			if (th.username === "" || th.username == null) {
				vmf.cookie.write("ObSSOCookie", "loggedout");
			}
			else {
				//showLoginField("yes", username);
				th.username = vmf.string.htmlentities(th.username, "HTML_SPECIALCHARS");
			}
		} 
	},*/
	validateLogin : function(username, password, errorMsgDiv){
		// default error div ID is "loginError"
		errorMsgDiv = errorMsgDiv || "loginError";
		var errDiv = document.getElementById(errorMsgDiv);
		// private function for showing error
		var showError = function(txt){errDiv.innerHTML = txt;}
		var isNumber= /(^-*\d+$)|(^-*\d+\.\d+$)/;
		// matches the RFC 2822 specification except it omits the syntax using double quotes and square brackets
		var isValidEmail = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		showError("");
		if(username.length==0 && password.length==0){
			//new error message as part of auto-entitlement project
			//new error message : E-Mail address or CN is required. 
			//old error message : Email address left blank.\nPassword left blank.
			showError('Please enter your Email Address or Customer Number.\nPassword left blank.');
			return false;
		}
		if(username.length==0){
			//new error message as part of auto-entitlement project
			//new error message E-Mail address or CN is required.
			//old error message : Email address left blank. 
			showError('Please enter your Email Address or Customer Number.');
			return false;
		}
		if(password.length==0){
			showError('Password left blank.');
			return false;
		}
		if(username.length != 0){
			if(username.indexOf("@") != -1) {
				if(!isValidEmail.test(username)){
					showError('Email Address is invalid.');
					return false;
				}
			} else {
					if(isNumber.test(username)){
						var isValidNumber = /(^\d{10}$)/;
						if(!isValidNumber.test(username)){
							showError('Customer Number is invalid.');
							return false;
						}
					} else {
						showError('Customer Number is invalid.');
						return false;
					}
			}
		}
		jQuery.ajax({
			url: login_url,
			type: "POST",
			async: false,
			data: { username: username, password: password },
			dataType: "html",
			complete: success
			}); 
		return true;
	},	// end of validatelogin
	setUserName:  function() {
		jQuery.ajax({
			url: vm.loign.getname_url,
			type: "GET",
			async: false,
			dataType: "json",
			success: function(data) {				
				//2-step
				th.username = data.username;
				vmf.cookie.write("USER_NAME", username);
			}
		});
	},
	clearUserName : function() {
		var name = "USER_NAME";
		var value = "";
		var days = "-1";
		var date = new Date();
		date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
		document.cookie = name + "=" + value + expires + "; path=/";
	}
}// end of login
