if (typeof(vmware) == "undefined")  vmware = {};
vmware.login = {

	init : function() {
		$('a.learnMore_login').click(function(){
			vmware.login.openHelpPage($(this).attr('href'),'1060px');
			return false;
		})
		var loginSessionTimeOut = $("#loginSessionTimeOut").val();
		if(loginSessionTimeOut == "true") {
			vmware.login.deleteObFormLoginCookie("ObFormLoginCookie","/", "");
		}
		var oBFormLoginCookie = $("#prodCommRegURL").val();
		if(oBFormLoginCookie != null && oBFormLoginCookie.indexOf("productRegistration.do")  >= 0) {
			$("#tabbed_box_1_tabs").hide();
			$("#login_header_id").hide();
		}

		//var langauge=$('#localeFromLiferayTheme').text();
		//vmware.login.loadBundles(langauge);
		vmware.login.updateMessage();

		$("#button_partners").click(function(){

			var isError = false;

			$(".errorMsg label").hide();

  			var username = $("#partners_username").val();
			username = vmf.string.trim(username);
			 $("#partners_username").val(username);

  			var password = $("#partners_password").val();
			password = vmf.string.trim(password);
			 $("#partners_password").val(password);


  			if(username.length == 0){
  				$("#partner_username_error").show();
  				isError = true;
  			}

  			if(password.length == 0){
  				$("#partner_password_error").show();
  				isError = true;
  			}

			if(isError) {
				return false;
			}

  			return true;
  		  });

  		   $("#button_education").click(function(){

			var isError = false;

			$(".errorMsg label").hide();

  			var username = $("#education_username").val();
			username = vmf.string.trim(username);
			 $("#education_username").val(username);

  			var password = $("#education_password").val();
			password = vmf.string.trim(password);
			 $("#education_password").val(password);

  			if(username.length == 0){
  				$("#learn_username_error").show();
  				isError = true;
  			}

  			if(password.length == 0){
  				$("#learn_password_error").show();
  				isError = true;
  			}

			if(isError) {
				return false;
			}

  			return true;
  		  });


		 $('#forgotPassword').click( function(){
  			$('#loginForm').attr("action", "./forgot-password");
  			$('#loginForm').submit();
  			return false;
		 });
		 
		  $('#createPassword').click( function(){
			if ($("#redirectUrl").val() !=undefined){
				$("#redirectUrl").val($("#redirectUrl").val().replace(/&bpid/g,"bpid"));
			}			  
  			$('#loginForm').attr("action", "./createPassword");
  			$('#loginForm').submit();
  			return false;
		 });



		//Tab management - Hide and show the correct tabs
		$('.tabbed_area').each(function(){
			var $this = $(this),
				content_show;
			if($this.children('.tabs').length > 0){
				$this.children('.main-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('rel');
				
				if(typeof content_show !== "undefined"){
					$('#'+content_show).show();
				}
			}
		});


		$("#button-login").click(function(){

			var isError = false;

			$(".errorMsg label").hide();

			 var emailId = $("#username").val();
			 emailId = vmf.string.trim(emailId);
			 $("#username").val(emailId);
			 if (vmware.login.validateEmailCN(emailId) == false) {
				$("#username_error").show();
				isError = true;
			 }

			var pass = $("#password").val();
			pass = vmf.string.trim(pass);
			$("#password").val(pass);
			if(pass.length == 0){
				$("#password_error").show();
				isError = true;
		    }

			if(isError) {
				return false;
			}
			if ($("#loginForm").attr('action') != undefined){
				var action = $("#loginForm").attr('action').replace(/&bpid/g,"bpid");
				$("#loginForm").attr('action' , action);
			}
			if ($("#redirectUrl").val() !=undefined){
				$("#redirectUrl").val($("#redirectUrl").val().replace(/&bpid/g,"bpid"));
			}

			vmware.login.isRememberMeChecked();
			return false;
		});


		$("#button-profile").click(function(){

			var isError = false;

			$(".errorMsg label").hide();

			 var firstName = $("#firstName").val();
			 if (firstName.length == 0) {
				$("#firstName_error").show();
				isError = true;
			 }

			 var lastName = $("#lastName").val();
			 if (lastName.length == 0) {
				$("#lastName_error").show();
				isError = true;
			}

			var email = $("#email").val();
			 if (vmware.login.validateEmail(email) == false) {
				$("#email_error").show();
				isError = true;
			 }

			 if(isError) {
				return false;
			 }

			vmware.login.isEmailRegistered();
			return false;
		});


		// When a link is clicked
		$("a.tab").click(function () {

			/***** Start: Added code as part of CR 199, 200, 203 Login My vmware tab validation *****/
				var elementId = $(this).attr('id');
				if(elementId == "myVMWarePartnersTab" || elementId == "myVMWareEducationTab" ||
				elementId == "myPartnersVMWareTab" || elementId == "myPartnersEducationTab" ||
				elementId == "myEducationVMWareTab" || elementId == "myEducationPartnersTab") {
				return true;
				}
			/***** End: Added code as part of CR 199, 200, 203 Login My vm tab validation *****/

			$this = $(this);
			// switch all tabs off
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");
			// switch this tab on
			$this.addClass("active");
			// slide all elements with the class 'content' up
			$this.parents('.tabbed_area:eq(0)').children(".main-container-wrapper, .login-Box").hide();
			// Now figure out what the 'title' attribute value is and find the element with that id.
			var content_show = $(this).attr("rel");
			$("#"+content_show).show();
			return false;
		});

		vmware.login.delCookie();
		
		//Feedback button URL fix
		if($('#navigation-bottom').length){
		  var $feedback = $('#navigation-bottom');
		  var feedbaklink = $feedback.find('li:last').find('a');
		  var themeLocaleVar = $("#localeFromLiferayTheme").html(); //Gets current locale from myvmware
		  
		  var urlLocaleMapper = {}; //Object that defines the locale's specific URL
		  urlLocaleMapper["en_US"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["en"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["zh_CN"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=ZH-S','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ja_JP"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=JA','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["de_DE"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=DE','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["fr_FR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=FR','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["ko_KR"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=KO','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper["undefined"] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  urlLocaleMapper[""] = "javascript:window.open('https://vmware.co1.qualtrics.com/SE/?SID=SV_3geP03w6FpSj8hf&Q_lang=EN','','width=715,height=675,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');void(0);";
		  
		  feedbaklink.attr('href', urlLocaleMapper[themeLocaleVar]); //sets specific URL as href
		}

	}, // end of init
	validateEmailCN : function (elementValue) {
			return (/^[0-9]/i.test(elementValue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(elementValue));
	},

	validateEmail :	function (elementValue) {
			return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(elementValue);
	},

	isRememberMeChecked : function () {

			var rememberMeFlag = $("#rememberMe").is(":checked");
			var emailIdOrCN = $("#username").val();

			$.ajax({
			type : "POST",
			dataType : "json",
			url : $("#checkRememberMeAjaxUrl").val(),
			data : {
				rememberMe : rememberMeFlag,
				username: emailIdOrCN
			},

			success : function(object) {
				// just submit the form without any check.
				$("#loginForm").submit();
			},

			error: function(jqXHR, textStatus, errorThrown) {
				// just submit the form without any check.
				$("#loginForm").submit();
			}
		});
	},

	isEmailRegistered :	function () {

			var emailId = $("#email").val();

			$.ajax({
			type : "POST",
			dataType : "json",
			url : $("#checkEmailAddressAjaxUrl").val(),
			data : {
				emailAddress : emailId
			},

			success : function(object) {
				$("#emailCheckStatus").hide();

				var isUserRegistered = object.isRegisteredUser;
				var errMsg = loginAlreadyRegisteredMessage;

				if (isUserRegistered == true) {
					// switch all tabs off

					$('#tabCreateProfile').removeClass("active");

					// switch this tab on
					$('#tabLoginMyVmware').addClass("active");

					// slide all elements with the class 'content' up
					$('#createProfile').hide();
					$('#loginMyVmware').show();

					$("#username").val(emailId);

						// clear all errors
					$(".errorMsg label").hide();

					$("#emailCheckStatus").html(errMsg);
					$("#emailCheckStatus").show();

				} else {
					// just submit the form.
					$("#customerRegistrationForm").submit();
				}
			},

			error: function(jqXHR, textStatus, errorThrown) {
					// just submit the form.
					$("#customerRegistrationForm").submit();
			}
		});
	 },

	delCookie : function() {
		var new_date = new Date();
		new_date = new_date.toGMTString();
		var thecookie = document.cookie.split(";");

		for (var i = 0;i < thecookie.length;i++)
		{
			var name = thecookie[i];

			var eqPos = name.indexOf("=");
			var cookieName = eqPos > -1 ? name.substr(0, eqPos) : name;
			
			if (cookieName != null && (cookieName.indexOf("SYMPHONY_USER") != -1 ) )
			{
				 var emailId = $("#username").val();
				 emailId = vmf.string.trim(emailId);
				 var fromSymphonyUserCookie = $("#fromSymphonyUserCookie").val();
				 fromSymphonyUserCookie = vmf.string.trim(fromSymphonyUserCookie);
			    if((emailId != null && emailId != "") && (fromSymphonyUserCookie != null && fromSymphonyUserCookie != "") && (fromSymphonyUserCookie == emailId)) {
					$("#rememberMe").attr('checked', true);
				}
			}

			if (cookieName != null && ( cookieName.indexOf("deActivationCookie") != -1 ) )
			{
				vmware.login.deleteDeactivateCookie(cookieName,"/",".vmware.com");
			}
			if(cookieName != null && ( cookieName.indexOf("ObFormLoginCookie" ) != -1 ) )
			{
				name = unescape(name);
				if(name.indexOf("productRegistration.do") != -1 || name.indexOf("jiveSource") != -1 || name.indexOf("/vpp/") != -1 
					|| name.indexOf("/partnerEval/") != -1 || name.indexOf("alogin") != -1 || name.indexOf("consumer/WSRP") != -1 
					|| name.indexOf("/betanext/") != -1 || name.indexOf("/support/incidentpack") != -1 || name.indexOf("/support/tracksn") != -1)
				{
					vmware.login.deleteObFormLoginCookie(cookieName,"/", "");
				}
			}

		}
	},	

	deleteDeactivateCookie : function( name, path, domain )	{
		document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	},

	deleteObFormLoginCookie : function( name, path, domain )
	{
		document.cookie = name + "=; expires=" + new Date + "; path=" + path;
	},

	/*loadBundles : function(lang)
	{
		 jQuery.i18n.properties({
			name:'message',
			 path:'/static/vmware/modules/login/message/',
			 mode:'map',
			 language:lang,
			 callback: function() {
				 vmware.login.updateMessage();
			 }
		 });
    },*/

	updateMessage : function()
	{
		usernameMessage=login.globalVar.usernameMessage
		passwordMessage=login.globalVar.passwordMessage
		loginUsernameMessage=login.globalVar.loginUsernameMessage
		firstnameMessage=login.globalVar.firstnameMessage
		lastnameMessage=login.globalVar.lastnameMessage
		//forgotPasswordURL=jQuery.i18n.prop("label.common.forgotPasswordURL");
		emailMessage=login.globalVar.emailMessage
		loginAlreadyRegisteredMessage=login.globalVar.loginAlreadyRegisteredMessage
		loginDeactivatedMessage=login.globalVar.loginDeactivatedMessage

		$("#partner_username_error").html(usernameMessage);
		$("#partner_password_error").html(passwordMessage);
		$("#learn_username_error").html(usernameMessage);
		$("#learn_password_error").html(passwordMessage);
		$("#username_error").html(loginUsernameMessage);
		$("#password_error").html(passwordMessage);
		$("#firstName_error").html(firstnameMessage);
		$("#lastName_error").html(lastnameMessage);
		$("#email_error").html(emailMessage);
	},
	openHelpPage:function(URL,customWidth){
		var wd =   customWidth || '695px';
		NewWindow = window.open(URL,"_blank","width="+wd+",height=670,resizable=yes,left=100,top=100,screenX=100,screenY=100,toolbar=no, location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes") ;
		NewWindow.location = URL;
	}
};// end of login



