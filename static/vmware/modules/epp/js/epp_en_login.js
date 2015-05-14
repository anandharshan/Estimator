if (typeof(epp) == "undefined")  epp = {};
epp.login = {
	urllogin:null,
	getname_url: "/account/autoLogin.do?vmware=getUserName",
	login_url: "/account/secure/login.do",
	logout_url: "/account/logout.do",
	loginContainer : null,
	username:null,
	th:null,
	loginBox: null,
	init : function() {
        vmf.scEvent =true;
		th = epp.login;
		loginBox = $('#loggedInPanel');
		th.tabEvents();
		urllogin=epp.globalVar.idmAjaxUrl;
		//showing user id
		var getUserNameUrl = (location.protocol + '//'+location.hostname + $("#getUserNameAjaxUrl").val());
		if($('#getUserNameAjaxUrl').val().length){
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
		
		var oBFormCookieVal = vmf.cookie.read("ObFormLoginCookie");
		if(oBFormCookieVal != null && oBFormCookieVal.indexOf("productRegistration.do")  >= 0) {
			$("#tabbed_box_1_tabs").hide();	
			$("#prod_reg_msg").show();
			$("#btnLearnMore").hide();				
		}
		
	 	//Adding even on epp login button of login tab
		$("#epp-login").live('click', function() {
			var isError = false, emailId = $("#username"), pass = $("#password");
			$('#loginEPP').find('.errorMsg').remove();
			if(!th.validateEmailCN(emailId.val())) {
				emailId.parent().before('<div class="ctrlHolder errorMsg clearfix"><label for="username">'+epp.globalVar.enterEmailorCN+'</label></div>');
				isError = true;
			}
			if(!pass.val().length) {
				pass.parent().before('<div class="ctrlHolder errorMsg clearfix"><label for="password">'+epp.globalVar.enterPassword+'</label></div>');
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
		 
		//Adding even on epp profile button of enroll tab
		$("#epp-profile").click(function() {
			var isError = false, emailId = $("#username_enr"), pass = $("#password_enr");
			$('#enrollEPP').find('.errorMsg').remove();
			if(!th.validateEmailCN(emailId.val())) {
				emailId.parent().before('<div class="ctrlHolder errorMsg"><label>'+epp.globalVar.enterEmailorCN+'</label></div>');
				isError = true;
			}
			if(!pass.val().length) {
				pass.parent().before('<div class="ctrlHolder errorMsg"><label>'+epp.globalVar.enterPassword+'</label></div>');
				isError = true;
			}
			if(isError) {
				pass.val('');
				return false;
			}else{
				$(this).attr('disabled',true).addClass('disabled');
				th.submitEnrollTabForm(emailId.val(),pass.val(),urllogin);
			}
			return false;
		});
		//Adding Forgot password code
		 $('#forgotPassword').click( function(){
  			$('#loginForm').attr("action", epp.globalVar.forgotPasswordUrl);
  			$('#loginForm').submit();
  			return false;
		 });
		 //Adding Forgot password code
		 $('#forgotPassword_err').click( function(){
  			$('#enrollForm').attr("action", epp.globalVar.forgotPasswordUrl);
  			$('#enrollForm').submit();
  			return false;
		 });
		 
		//Adding event  when enroll today hyperlink is clicked,from enroll tab
		$("#linkEnroll").live('click',function() {
			location.replace(epp.globalVar.registerTodayURL);
		});
		$("#partnerLink").live('click',function() {
			location.replace(epp.globalVar.partnerCentralURL);
		});
		// When a tab clicked		
		$("#eppLoginWidget a.tab").click(function () { 
			var $this = $(this), content_show = $(this).attr("title");
			// switch all tabs off    
			$this.parents('.tabs:eq(0)').find(".active").removeClass("active");   
			// switch this tab on   
			$this.addClass("active");
			// slide all elements with the class 'content' up
			$this.parents('.tabbed_area:eq(0)').children(".login-Box").hide();   
			// Now figure out what the 'title' attribute value is and find the element with that id.  
			$("#"+content_show).show();
			
			return false;
		}); 
        
        if(epp.globalVar.preSelectTab != "") {
            if(epp.globalVar.preSelectTab == epp.globalVar.preSelectEPP) {
                $('#'+epp.globalVar.preSelectEPP).trigger('click');
            } else if(epp.globalVar.preSelectTab == epp.globalVar.preSelectVPP) {
                $('#'+epp.globalVar.preSelectVPP).trigger('click');
            } else if(epp.globalVar.preSelectTab == epp.globalVar.preSelectTPP) {
                $('#'+epp.globalVar.preSelectTPP).trigger('click');
            }
        }
        
        $('a#enrollLink').live('click',function(){
			var enrollBtn = $('#eppLoginWidget').find('a[title="enrollEPP"]');
			$('html, body').animate({ scrollTop: 0 }, 600);
			if(!enrollBtn.hasClass('active')) enrollBtn.trigger('click');
			return false;
		})
		//code for ominature tracking of log in page loading
		callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : overview']})
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
					$('#epp-login').attr('disabled', '').removeClass('disabled');
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.deactivateEmail1 + '<a href='+epp.globalVar.supportUrl+ ' target="_blank">'+ epp.globalVar.deactivateEmail2+'</a>'+'</label></div>');
					th.deleteDeactivateCookie(deactiveCookie, "/", ".vmware.com");
					$('#password').val('');
				}else if(authCookie != null && authCookie == "20001") {
					$('#epp-login').attr('disabled', '').removeClass('disabled');
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.enterEmailorCN + '</label></div>');
					$('#password').val('');
				}else if((obsCookie != null && obsCookie != "")){
					location.replace(epp.globalVar.inactiveAccountUrl);
				}else{
					$('#username').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.genericError + '</label></div>');
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
	submitEnrollTabForm:function(emailId,pass,urllogin) {
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
					// Make ajax call for retrieving enrollment details
					th.getCustomerEnrollmentDetails();
					// submit form if IDM call is success
					return false;
				} catch(err) {

				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// Make ajax call for retrieving enrollment details
				var deactiveCookie = vmf.cookie.read("deActivationCookie");
				var authCookie = vmf.cookie.read("authentication");
				var obsCookie = vmf.cookie.read("ObSSOCookie");
				if(authCookie != null && authCookie == "20001") {
					$('#epp-profile').attr('disabled', '').removeClass('disabled');
					$('#username_enr').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.enterEmailorCN + '</label></div>');
				}else if(deactiveCookie != null && deactiveCookie != "") {
					$('#epp-profile').attr('disabled', '').removeClass('disabled');
					$('#username_enr').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.deactivateEmail1 + '<a href='+epp.globalVar.supportUrl+ ' target="_blank">'+ epp.globalVar.deactivateEmail2+'</a>'+'</label></div>');
					th.deleteDeactivateCookie(deactiveCookie, "/", ".vmware.com");
				}else if((obsCookie != null && obsCookie != "")){
					location.replace(epp.globalVar.inactiveAccountUrl);
				}else{
					$('#username_enr').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.genericError + '</label></div>');
				}
			}
		});
	},
	getCustomerEnrollmentDetails:function() {
		var getLoggedInCustEnrolledDetailsURL = epp.globalVar.getLoggedInCustEnrolledDetails.replace("/web/", "/group/");
		vmf.ajax.post(getLoggedInCustEnrolledDetailsURL, null, function(jData) {
			if(jData != null && jData.enrollmentStatus == epp.globalVar.incompleteProfile) {
				th.gotoRegistration();
			}
			if(jData != null && jData.enrollmentStatus == epp.globalVar.notRegistered) {
				th.gotoRegistration();
			}
			if(jData != null && jData.enrollmentStatus == epp.globalVar.completeProfile) {
				th.gotoEnrollOptions();
			}
			if(jData != null && jData.enrollmentStatus == epp.globalVar.vpp) {
				th.gotoEnrollEPP();
			}
			if(jData != null && jData.enrollmentStatus == epp.globalVar.epp) {
				th.flipTOLogin();
			}
			if(jData != null && jData.enrollmentStatus == epp.globalVar.approval) {
				$('#epp-profile').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.awaitingApprovalErrorMsg + '</label></div>').end().removeAttr('disabled').removeClass('disabled');
				$("#password_enr").val('');
			}
			
			if(jData == "" || (jData != null && jData.enrollmentStatus == undefined)) {
				$('#epp-profile').parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.errorEnrollmentStatus + '</label></div>').end().removeAttr('disabled').removeClass('disabled');
				$("#password_enr").val('');
			}
		});
	},
	flipTOLogin:function() {
		$('#eppLoginWidget').find('a[title="loginEPP"]').trigger('click');
		$('#logInForm').find('.ctrlHolder.errorMsg').remove();
		$('#username').val($('#username_enr').val()).parent().before('<div class="ctrlHolder errorMsg"><label>' + epp.globalVar.registeredInBoth + '</label></div>');
	},
	gotoEnrollEPP:function() {
		var redirectToEppEnrollOptionsURL = epp.globalVar.redirectToEppEnrollOptions;
		$("#enrollForm").attr("action", redirectToEppEnrollOptionsURL);
		$('#enrollForm').submit();
	},
	gotoEnrollOptions:function() {
		var redirectToEnrollOptionsURL = epp.globalVar.redirectToEnrollOptions;
		$("#enrollForm").attr("action", redirectToEnrollOptionsURL);
		$('#enrollForm').submit();
	},
	gotoRegistration:function() {
		var gotoRegistrationURL = epp.globalVar.gotoRegistration;
		$("#enrollForm").attr("action", gotoRegistrationURL);
		$('#enrollForm').submit();
	},
	validateEmailCN:function(elementValue) {
		return (/^[0-9]/i.test(elementValue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(elementValue));
	},
	rememberMeChecked:function(rememberMeFlag) {
		var emailIdOrCN = $("#username").val();
		var dt = {rememberMe : rememberMeFlag, username : emailIdOrCN}
		var rememberUrl = (location.protocol + '//'+location.hostname + $("#checkRememberMeAjaxUrl").val());
		vmf.ajax.post(rememberUrl,dt,function(jData){$('#loginForm').submit();},function(){$('#loginForm').submit();} )
	},
	tabEvents:function(){
	
		$('#content-left .tabhead li a').click(function(){
			var $title = $(this).attr('id');
			var $tabTitle = $title.toLowerCase();
			if(typeof riaLinkmy != "undefined") riaLinkmy(epp.globalVar.pageName + ' : ' + $tabTitle);
		});
        
        if(epp.globalVar.preSelectTab != "") {
            if(epp.globalVar.preSelectTab == epp.globalVar.preSelectEPP) {
                $('#'+epp.globalVar.preSelectEPP).trigger('click');
            } else if(epp.globalVar.preSelectTab == epp.globalVar.preSelectVPP) {
                $('#'+epp.globalVar.preSelectVPP).trigger('click');
            } else if(epp.globalVar.preSelectTab == epp.globalVar.preSelectTPP) {
                $('#'+epp.globalVar.preSelectTPP).trigger('click');
            }
        }
	},
	loggedIn:{
		init:function(){
			vmf.scEvent = true;
			epp.login.tabEvents();
			//Ominature code for traking login button click
			callBack.addsc({'f':'riaLinkmy','args':[epp.globalVar.pageName + ' : overview']})
		}
	}
}
