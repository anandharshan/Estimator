if (typeof(vm) == "undefined")  vm = {};
vm.login = {
	getname_url: "/account/autoLogin.do?vmware=getUserName",
	login_url: "/account/secure/login.do",
	logout_url: "/account/logout.do",

	loginContainer : null,
	username:null,
	init : function() {
		vm.login.validateCookie();
		
							
		//Tab management - Hide and show the correct tabs
		$('.tabbed_area').each(function(){
			var $this = $(this),
			content_show;
			if($this.children('.tabs').length > 0){
				$this.children('.main-container-wrapper').hide();
				content_show = $this.children('.tabs').find('.active').attr('title')
				$('#'+content_show).show();
			}
		});
		
		/****************** Start: Added code as part of CR 199, 200, 203 Login My VMWare tab validation *******************************/
								
		var oBFormCookieVal = vmf.cookie.read("ObFormLoginCookie");
			if(oBFormCookieVal != null && oBFormCookieVal.indexOf("productRegistration.do")  >= 0) {
				$("#tabbed_box_1_tabs").hide();	
				$("#prod_reg_msg").show();
				$("#btnLearnMore").hide();				
		}
				
		$("#button-login").click(function(){
	 
			var isError = false;
			
			$("#username_error").html("");
			removeErrorClass($("#username_error"));
			
			$("#password_error").html("");			 
			removeErrorClass($("#password_error"));
			
			 var emailId = $("#username").val();
			 if (validateEmailCN(emailId) == false) {
				$("#username_error").html("Please enter a valid email address / CN.");	
				isError = true;
			 } 
						
			var pass = $("#password").val();
			if(pass.length == 0){
				$("#password_error").html("Please enter a password");
				isError = true;			
		    }
			
			if(isError) {
				return false;
			}
			
			isRememberMeChecked();
			return false; 
     });
	 
	 
	 $("#button_partners").click(function(){
	 	
		var username = $("#partners_username").val();
		var password = $("#partners_password").val();
		
			$("#partners_error").html("");
			removeErrorClass($("#partners_error"));
			
		if (username.length == 0 && password.length==0) {
			$("#partners_error").html("Please enter a username.<br />Please enter a password.<br />");
			return false;
		} 
			
		if(username.length == 0){
			$("#partners_error").html("Please enter a username");			
			return false;
		}

		if(password.length == 0){
			$("#partners_error").html("Please enter a password");			
			return false;
		}
	 
		return true;
	  });
	  
	   $("#button_education").click(function(){
	 	
		var username = $("#education_username").val();
		var password = $("#education_password").val();
		
			$("#education_error").html("");
			removeErrorClass($("#education_error"));
			
		if (username.length == 0 && password.length==0) {
			$("#education_error").html("Please enter a username.<br />Please enter a password.<br />");
			return false;
		} 
			
		if(username.length == 0){
			$("#education_error").html("Please enter a username");			
			return false;
		}

		if(password.length == 0){
			$("#education_error").html("Please enter a password");			
			return false;
		}
	 
		return true;
	  });
	 
	  
	 $("#button-profile").click(function(){
	 
			var isError = false;
			
			$("#firstName_error").html("");
			removeErrorClass($("#firstName_error"));
			
			$("#lastName_error").html("");
			 removeErrorClass($("#lastName_error"));
			 
			 $("#email_error").html("");
			 removeErrorClass($("#email_error"));
			
			 var firstName = $("#firstName").val();
			 if (firstName.length == 0) {
				$("#firstName_error").html("Please enter a FirstName");
				isError = true;
			 } 	
			
			 var lastName = $("#lastName").val();			
			 if (lastName.length == 0) {
				$("#lastName_error").html("Please enter a LastName");
				isError = true;
			}
	 
			var email = $("#email").val();			
			 if (validateEmail(email) == false) {
				$("#email_error").html("Please enter a valid email address.");	
				isError = true;
			 } 
			 if(isError) {
				return false;
			 }
			 				
			isEmailRegistered();
			return false; 
     });
	 
	 	 
		function removeErrorClass(element) {
			element.parent().removeClass('error');
			element.removeClass('error_msg');
		}

		function validateEmailCN(elementValue) {
			return (/^[0-9]/i.test(elementValue) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(elementValue));		
		}
		
		function validateEmail(elementValue) {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(elementValue);		
		}
		
		
		function addErrorClass(element) {
			element.parent().addClass('error');
			element.addClass('error_msg');
		}

		function isRememberMeChecked() {
			
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
		  }
		  
		  
			function isEmailRegistered() {
			
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
					removeErrorClass($("#emailCheckStatus"));
					
					try {
						var isUserRegistered = object.isRegisteredUser;
						var errMsg = object.errMsg;
						if (isUserRegistered == true) {	
							// switch all tabs off    
							
							$('#tabCreateProfile').removeClass("active");   
							
							// switch this tab on   
							$('#tabLoginMyVmware').addClass("active");   
					  
							// slide all elements with the class 'content' up
							$('#createProfile').hide(); 
							$('#loginMyVmware').show();    
						  
							$("#username").val(emailId);
				
							$("#emailCheckStatus").html(errMsg);  
							addErrorClass($("#emailCheckStatus"));	

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
		   }
		   
		/****************** End: Added code as part of CR 199, 200, 203 Login My VMWare tab validation *******************************/
		
		// When a link is clicked 		
		$("a.tab").click(function () { 
		
			/***** Start: Added code as part of CR 199, 200, 203 Login My VMWare tab validation *****/
				var elementId = $(this).attr('id');
				if(elementId == "myVMWarePartnersTab" || elementId == "myVMWareEducationTab" || 
				 elementId == "myPartnersVMWareTab" || elementId == "myPartnersEducationTab" || 
				 elementId == "myEducationVMWareTab" || elementId == "myEducationPartnersTab") {
					return true;
				}
			/***** End: Added code as part of CR 199, 200, 203 Login My VMWare tab validation *****/
			
			$this = $(this);
			// switch all tabs off    
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");   
			// switch this tab on   
			$this.addClass("active");   
			// slide all elements with the class 'content' up
			$this.parents('.tabbed_area:eq(0)').children(".main-container-wrapper, .login-Box").hide();   
			// Now figure out what the 'title' attribute value is and find the element with that id.  
			var content_show = $(this).attr("title");   
			$("#"+content_show).show();   
			return false;
		}); 

			
		$("#loginBtn").click(function(){
			
			vm.login.validateLogin($('#login_txt_email').val(),$('#login_password').val());
			
			return false;
		})
		
		
	}, // end of init
	validateCookie :function(){
		var ob = vmf.cookie.read("ObSSOCookie");
		
		//var referrer = parseUri(document.referrer);
		if (ob == "loggedout" || ob == "loggedoutcontinue" || ob == null || ob == "") {
			//showLoginField("no", "");
			//showAccountContent("no", "");
			//showUpdateProfile("no");
			//clearUserName();
			//jQuery(".divLoggedOut").show();
			vm.login.loginContainer = 'preLogin'
			
		}
		else {
			vm.login.loginContainer = 'postLogin'
			vm.login.username = vmf.cookie.read('USER_NAME');
			if(vm.login.username == null || vm.login.username == "") {
				setUserName();
			}
			$('#'+vm.login.loginContainer).find('p.username span').html(vm.login.username);
			if (vm.login.username === "" || vm.login.username == null) {
				vmf.cookie.write("ObSSOCookie", "loggedout");
				//showLoginField("no", "");
				//showAccountContent("no", "");
				//showUpdateProfile("no");
				//jQuery(".divLoggedOut").show();
			}
			else {
				//showLoginField("yes", username);
				vm.login.username = vmf.string.htmlentities(vm.login.username, "HTML_SPECIALCHARS");
				//showAccountContent("yes", username);
				//showUpdateProfile("yes");
				//jQuery(".divLoggedIn").show();
			}
		} 
	},
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
				vm.login.username = data.username;
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
