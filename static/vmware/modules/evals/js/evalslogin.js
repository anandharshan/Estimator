/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  evalslogin.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 07/21/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Sudheesh VP)
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */


/**
 * Create the URL for submitting the Ajax call when user hits on submit button
 * of login forms in eval center which will be intercepted by the authentication
 * System
 */
var fullURL = window.location.toString();

/*Assuming the local host runs on 8080*/
var loc = fullURL.indexOf("8080/");
if (loc == -1){ 
  loc  = fullURL.indexOf(".com/");
}
loc = loc+4;
var actualurl = fullURL.substring(0,loc);
var urllogin = '/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=asynchServeUserData';

var rememberURL = '/group/vmware/evalcenter?p_p_id=evalcenter_WAR_itevals&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=checkRememberMe&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1';
var loginRedirect = '/group/vmware/evalcenter?p_p_id=evalcenter_WAR_itevals&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=loginRegistrationRedirectionCheck&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1';

//validation i18n impl
var emailRequiredMessage=null;
var emailValidationMessage=null;
var emailFieldLengthMessage=null;
var passwordRequiredMessage=null;
var passwordFieldLengthMessage=null;
var firstNameRequiredMessage=null;
var firstNameFieldLengthMessage=null;
var lastNameRequiredMessage=null;
var lastNameFieldLengthMessage=null;
var webgateAuthErrorMessage=null;
var webgateAuthGenericErrorMessage=null;
var alreadyRegsErrorMessage=null;
var freeDomainErrorMessage=null;
var programUnavailbleMessage=null;
var resultAuto=null;
var resultValidDomain=null;
var deactiveUserMessage=null;
var emailRequiredMessageRegn=null;
var eol=null;



/* Function Block starts */

/**
 * This function is used to bind various events to various different elements.
 * Also used to make any initial ajax calls to be made.
 * 
 * @author Sudheesh VP
 */

if (typeof(myvmware) == "undefined")  
    myvmware = {};

    myvmware.evals= {
    init: function() {
    
        //var langauge=$('#localeFromLiferayTheme').text();
       	//loadBundles(langauge);
        
       	//debug("Init Method Called"+langauge);  
       
       	updateMessage();
        
        $.validator.methods.customRule = function(value, element, param) {
            return value == param;
        };
        
        //check if tab switch needs to be handeled
        screenInitTabSwitch();
        
        //implement login tab form button click 
        $("#button-login").click(function(){
            debug("before Login button click");
            $('#evalLoginId').submit();
            debug("Login button click ended");
        });
        
        //implement register tab form button click 
        $("#button-register-tabcenter").click(function(){
            debug("before Register button click");
            $('#evalRegisterTabId').submit();
            debug("Ended Register button click");
        });
        
        //implement register tab form button click 
        $("#button-continue-login").click(function(){
            debug("before Login Non Tab button click");
            $('#loginFormNonTab').submit();
            debug("Ended Login Non Tab button click");
        });

        //implement register tab form button click 
        $("#button-continue-register").click(function(){
            debug("before Register button Non Tab click");
            $('#evalRegisterNonTab').submit();
            debug("Ended Register button Non Tab click");
        });
        
        
        
        $("#logontab1").click(function(){
            debug("logontab1 clicked");
            $('#tab_login').css("display","block");
            $('#tab_register').css("display","none");

            $('#logontab1').addClass('active');
            $('#logontab2').removeClass('active');
        });

        $("#logontab2").click(function(){
            debug("logontab2 clicked");
            $('#tab_login').css("display","none");
            $('#tab_register').css("display","block");

            $('#logontab2').addClass('active');
            $('#logontab1').removeClass('active');
        });
        
        
        
        //key press events for login fields
        $("#username").keyup(function(e) {
            if(e.keyCode == 13) {
                //if tab form submit the tab form
                if($('#evalLoginId').length > 0 ) {            
                    $("#evalLoginId").submit();
                }
                //if login non tab selected 
                if($('#loginFormNonTab').length > 0){
                    $("#loginFormNonTab").submit();
                }
            }
        });    

        $("#password").keyup(function(e) {
            if(e.keyCode == 13) {
                //if tab form submit the tab form
                if($('#evalLoginId').length > 0 ) {            
                    $("#evalLoginId").submit();
                }
                //if login non tab selected 
                if($('#loginFormNonTab').length > 0){
                    $("#loginFormNonTab").submit();
                }
            }
        });        

        
        //key press events - for registrtaion fields
        $("#FirstName_Register_Tab").keyup(function(e) {
            if(e.keyCode == 13) {            
                $("#evalRegisterTabId").submit();
            }
        });    

        $("#LastName_Register_Tab").keyup(function(e) {
            if(e.keyCode == 13) {
                //if tab form submit the tab form
                $("#evalRegisterTabId").submit();
            }
        }); 
        
        
        $("#Email_Register_Tab").keyup(function(e) {
            if(e.keyCode == 13) {                
                $("#evalRegisterTabId").submit();
            }
        }); 
        
        $("#FirstName").keyup(function(e) {
            if(e.keyCode == 13) {            
            $("#evalRegisterNonTab").submit();
            }
        });    

        $("#LastName").keyup(function(e) {
            if(e.keyCode == 13) {
                //if tab form submit the tab form
                $("#evalRegisterNonTab").submit();
            }
        }); 
        
        
        $("#Email").keyup(function(e) {
            if(e.keyCode == 13) {                
                $("#evalRegisterNonTab").submit();
            }
        });         
        
        
        //BUG-00023055-do a hide of div to remove 'loading' text
        $('#sb-loading-inner').hide();
        
    },
        
        
    //implement validation for Login Tab Form
    validateLoginForm: function(){
        
        debug("Start Login Tab Form Validation");
        
        //override email validation for accomodation CN validation
        $.validator.addMethod("emailCN", function(value, element) {
            var tvalue = jQuery.trim(value);
            //return this.optional(element) || (/^[0-9]/i.test(value) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value));
            //return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z.]{2,5}$/i.test(tvalue));
			return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(tvalue));
        }, itevals.globalVar.invalidEmail);
        
        $('#evalLoginId').validate(
            {
                errorClass: "error-message",
                    rules : {
                        'username' : {
                            required: true,
                            emailCN: true                            
                        },
                        'password': {
                            required : true
                        }
                    },  
                    messages : {
                        'username' : {
                            required : emailRequiredMessage,
                            emailCN : emailValidationMessage
                        },
                        'password': {
                            required : passwordRequiredMessage
                        }
                    },
                    errorPlacement : function(error, element) {
                        
                        //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                        //BUG-00017577
                        $("#error-message-login").html("");
                        var elementName = element.attr("id");
                        //alert(elementName);
                        var elementErrorName = "#"+elementName+"_error";
                        var errorDiv = $(elementErrorName)
                        errorDiv.html(error);                        
                        element.removeClass('error-message');                  
                        element.addClass('text');
                        //BUG-00021531                        
                        $('#error-message-register').html('');
                        $('#FirstName_Register_Tab_error').html('');
                        $('#LastName_Register_Tab_error').html('');
                        $('#Email_Register_Tab_error').html('');
                        //$('#password').val('');
                        
                        
                    },
                    onfocusout: function(element){
                        //this.element(element);
                    },
                    success : function(label){
                        label.parent().removeClass('error');
                        label.parents('.ctrlHolder').removeClass('error');
                    },
                    submitHandler: function(form){
                        submitLoginTabForm();
                        return false;
                    },
                    showErrors: function (errorMap, errorList) {
                        for (var i = 0; errorList[i]; i++) {
                            var element = this.errorList[i].element;
                            this.errorsFor(element).remove();
                        }
                        this.defaultShowErrors();
                    }                    
            }
        );  
        debug("end validateLoginTabForm");       
    },    
        
    // validation for registration Tab
    validateRegistrationTabForm: function(){
        debug("start validateRegistrationTabForm");
        
        $.validator.methods.email = function(value, element) {
    		//return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value);
			return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(value);
    	}
        
        $('#evalRegisterTabId').validate( 
            {
                errorClass: "error-message",
                    rules : {
                        'firstName' : {
                            required: true,                                
                            maxlength : 50
                        },
                        'lastName': {
                            required : true,
                            maxlength: 50
                        },
                        'emailAddress': {
                                required: {
                                    depends:function(){
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
                            email: true,
                            maxlength: 50
                        }
                    },  
                    messages : {
                        'firstName' : {
                            required : firstNameRequiredMessage                            
                        },
                        'lastName': {
                            required : lastNameRequiredMessage
                        },
                        'emailAddress': {
                            required : emailRequiredMessageRegn,
                            email : emailValidationMessage
                        }                            
                    },
                    errorPlacement : function(error, element) {
                        
                        //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                        var elementName = element.attr("id");
                        //alert(elementName);
                        var elementErrorName = "#"+elementName+"_error";
                        var errorDiv = $(elementErrorName)
                        errorDiv.html(error);                        
                        element.removeClass('error-message');                  
                        element.addClass('text');
                        //BUG-00021531
                        $('#error-message-login').html('');
                        $('#password_error').html('');
                        $('#username_error').html('');                        
                        
                    },
                    onfocusout: function(element){
                        //this.element(element);
                    },
                    success : function(label){
                        label.parent().removeClass('error');
                        label.parents('.ctrlHolder').removeClass('error');
                    },
                    submitHandler: function(form){
                        submitRegister_Tab();
                        return false;
                    },
                    showErrors: function (errorMap, errorList) {
                        for (var i = 0; errorList[i]; i++) {
                            var element = this.errorList[i].element;
                            this.errorsFor(element).remove();
                        }
                        this.defaultShowErrors();
                    }                    
                }
            );  
            debug("end validateRegistrationTabForm");       
        },
    
    
    //validate single forms of Login(Non Tab)
        validateLoginNonTabForm: function(){
            
            debug("Start Login NON Tab Form Validation");
            
            //override email validation for accomodation CN validation
            $.validator.addMethod("emailCN", function(value, element) {
                var tvalue = jQuery.trim(value);
                //return this.optional(element) || (/^[0-9]/i.test(value) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value));
                //return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z.]{2,5}$/i.test(tvalue));
				return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(tvalue));
            }, itevals.globalVar.invalidEmail);
            
            $('#loginFormNonTab').validate(
                {
                    errorClass: "error-message",
                        rules : {
                            'username' : {
                                required: true,
                                emailCN: true,
                                maxlength : 100
                            },
                            'password': {
                                required : true
                            }
                        },  
                        messages : {
                            'username' : {
                                required : emailRequiredMessage,
                                emailCN : emailValidationMessage
                            },
                            'password': {
                                required : passwordRequiredMessage
                            }
                        },
                        errorPlacement : function(error, element) {
                            
                        //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                        var elementName = element.attr("id");
                        //alert(elementName);
                        var elementErrorName = "#"+elementName+"_error";
                        var errorDiv = $(elementErrorName)
                        errorDiv.html(error);                        
                        element.removeClass('error-message');                  
                        element.addClass('text');
                        //BUG-00017577
                        $("#error-message-login").html("");

                        //BUG-00015033 - set all regn form error to blank
                        $('#error-message-register').html('');
                        $('#FirstName_error').html('');
                        $('#LastName_error').html('');
                        $('#Email_error').html('');
                        //$('#password').val('');
                        },
                        onfocusout: function(element){
                            //this.element(element);
                        },
                        success : function(label){
                            label.parent().removeClass('error');
                            label.parents('.ctrlHolder').removeClass('error');
                        },
                        submitHandler: function(form){
                            submitLoginForm();
                            return false;
                        },
                        showErrors: function (errorMap, errorList) {
                            for (var i = 0; errorList[i]; i++) {
                                var element = this.errorList[i].element;
                                this.errorsFor(element).remove();
                            }
                            this.defaultShowErrors();
                        }
                        
                }
            );  
            debug("end validateLoginNONTabForm");       
        },  
    //validate single forms of Registration(Non Tab)
        validateRegistrationNonTabForm: function(){
        debug("start validateRegistrationNONTabForm");
        
		$.validator.methods.email = function(value, element) {
    		return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(value);
    	}
		
        $('#evalRegisterNonTab').validate( 
            {
                errorClass: "error-message",
                   rules : {
                        'firstName' : {
                            required: true,                                
                            maxlength : 50
                        },
                        'lastName': {
                            required : true,
                            maxlength: 50
                        },
                        'emailAddress': {
                                required: {
                                    depends:function(){
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
                            email: true,
                            maxlength: 50
                        }
                    },  
                    messages : {
                        'firstName' : {
                            required : firstNameRequiredMessage
                        },
                        'lastName': {
                            required : lastNameRequiredMessage
                        },
                        'emailAddress': {
                            required : emailRequiredMessageRegn,
                            email : emailValidationMessage                            
                        }                            
                    },
                    errorPlacement : function(error, element) {
                        
                        //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                        var elementName = element.attr("id");
                        //alert(elementName);
                        var elementErrorName = "#"+elementName+"_error";
                        var errorDiv = $(elementErrorName)
                        errorDiv.html(error);                        
                        element.removeClass('error-message');                  
                        element.addClass('text');
                        //BUG-00015033 - set all login form error to blank
                        $('#error-message-login').html('');
                        $('#password_error').html('');
                        $('#username_error').html('');                        
                    },
                    onfocusout: function(element){
                        //this.element(element);
                    },
                    success : function(label){
                        label.parent().removeClass('error');
                        label.parents('.ctrlHolder').removeClass('error');
                    },
                    submitHandler: function(form){
                        submitRegister();
                        return false;
                    },
                    showErrors: function (errorMap, errorList) {
                        for (var i = 0; errorList[i]; i++) {
                            var element = this.errorList[i].element;
                            this.errorsFor(element).remove();
                        }
                        this.defaultShowErrors();
                    }
                }
            );  
            debug("end validateRegistrationNONTabForm");       
        },
      
        redirectToForgotPasswdPage : function(url){
        	
        	var emailAddr = $('#username').val();       	
        	if( emailAddr!= '' && emailAddr != null){
        		
        		url = url+ "?username="+emailAddr;
        	}
        	NewWindow = window.open(url,"_blank") ;
    		NewWindow.location = url;
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
		}
    };

    /**
     * handles the ajax call when form is submitted for
     * login form for login Tab
     */
    function submitLoginTabForm()  {
        
    debug("<p>Authenticating Your Creds. Plsssss wait..</p>");
    debug("URL being accessed is :   "+ urllogin );
    
    var uname = jQuery.trim($('#username').val());

    $.ajax({
        type: "POST",
        dataType: "json",
        url: urllogin,
        data: {username:uname,password:$("#password").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :   "+ urllogin );
                try
                {
                    debug("Inside Success Condition");
                    debug("<p>Authentication successful...logging in</p>");
                    var user = object.user;
                    debug("Inside Success Condition User is :   "+user);
                                        
                    //redirection logic in case of erro code set
                    
                    if(object.VM_ERROR != null && object.VM_ERROR.length> 0){
                        if(object.REDIRECT_URL != null && object.REDIRECT_URL.length> 0){
                            window.location = object.REDIRECT_URL;
                            return false;
                        }
                    }
                    
                    
                    
                    // comment the lines if it does not work on dev/qai boxes - start
                    var rememberMeFlag = $("#rememberMe").is(":checked");
                    if(rememberMeFlag)
                        rememberUserDtls(rememberMeFlag);
                    // comment the lines if it does not work on dev/qai boxes - end

                    loginRegistrationRedirectionCheck();
                    
                    if(resultValidDomain == 'invalid'){
                        $("#validEmailDomain").val(resultValidDomain);
                    }
                        
                    
                    if(resultAuto == 'auto'){ 
                        resultAuto = null;
	                        if(eol == 'eol'){
	                        	eol=null;
	                        	var actionUrl = $('[name="frmLoginRegisterAuto"]').attr('action');
	                        	var newActionUrl=actionUrl+'&eol=1';
	                        	$('[name="frmLoginRegisterAuto"]').get(0).setAttribute('action', newActionUrl);
	                        	 document.forms['frmLoginRegisterAuto'].submit();
	                        }else{
                        document.forms['frmLoginRegisterAuto'].submit();
                        }
                    }
                    else{
                        resultAuto = null;
                        document.forms['frmLogin'].submit();
                    }

                    //$("#user").html(user);
                    
                }
                catch(err)
                {
                    debug(err);
                }
            },
            
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
                //debug("Error XMLHttpRequest response text   :   "+XMLHttpRequest.responseText);
                debug("Error XMLHttpRequest resp headers    :   "+XMLHttpRequest.getAllResponseHeaders());
                debug("Error XMLHttpRequest Location        :   "+XMLHttpRequest.getResponseHeader("Location"));
                debug("getting cookie"); 

                var authCookie = getCookie("authentication");
                var deactiveCookie  = getCookie("deActivationCookie");

                debug("cookie:'authentication':"+authCookie);
                debug("cookie:'deActivationCookie':"+deactiveCookie);

                del_cookie("authentication","/");
                del_cookie("deActivationCookie","/");
                
                var obsCookie = getCookie("ObSSOCookie");

                if( authCookie != null && authCookie == "20001"){
                    debug("Incorrect username or password 20001");
                    $("#error-message-login").html(webgateAuthErrorMessage);
                    $('#password').val('');
                }
                else if (deactiveCookie != null && deactiveCookie != ""){
                    debug("obs cookie in failure case");
                    $("#error-message-login").html(deactiveUserMessage);
                    $('#password').val('');
                }
                //BUG-00020781  
                else if (obsCookie != null && obsCookie != ""){
                    debug("obs cookie in failure case");
                    window.location = "/web/vmware/inactiveaccount";                    
                }                
                else{
                    debug("Problem while processing the request. Please try later.");
                    $("#error-message-login").html(webgateAuthGenericErrorMessage);
                }
            }
        });
    }
    
    /**
     * handles the ajax call when form is submitted for
     * registration tab form
     */
        
    function submitRegister_Tab()  {       
        
    debug("<p>Registering Your Creds. Plsssss wait..</p>");            
    $.ajax({
        type: "POST",
        dataType: "json",
        url: $("#checkEmailAddressAjaxUrl").val(),
        data: {emailAddress:$("#Email_Register_Tab").val(), prgShortName:$("#prgShortName").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :"+$("#checkEmailAddressAjaxUrl").val());
                try
                {
                    debug("Inside Success Condition");
                    var emailstatus = object.status;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'registered'){                        
                        $('#error-message-login').html(alreadyRegsErrorMessage);                        
                        $('#username').val($('#Email_Register_Tab').val());
                        $('#tab_login').css("display","block");
                        $('#tab_register').css("display","none");
                        $('#logontab1').addClass('active');
                        $('#logontab2').removeClass('active');
                        
                        debug("setting styles start");
                        //if there are already validation error in login tab set them to false.
                        $('#password_error').html('');
                        $('#username_error').html('');
                        debug("setting styles end");
                        
                    }
                    else if(emailstatus == 'programExpired'){
                        
                    	//CR-00013401
                    	if(object.tryvmware == "tryvmware")
                    		{
                    			window.location = object.redirectURL;
                    		}else{                 	                        	
                    	var form_register_url = $('form[name=frmLoginRegisterTab] #registerURL').val();
                    	if (form_register_url != undefined) {
                    		$('form[name=frmLoginRegisterTab] #registerURL').val(form_register_url.replace("/group/","/web/"));
                    	}
                        var actionUrl = $('form[name=frmLoginRegisterTab]').attr('action');
                        var splitUrlArr = actionUrl.split("&p=");
                        //replace prog shortname
                        var newActionUrl = splitUrlArr[0] +"&p="+ object.latestProgShortName;
                        //append back any addl params after shortname from orig url
                        var ampPos = splitUrlArr[1].indexOf("&");
                        //alert(ampPos);
                        if(ampPos!=-1) {
                           newActionUrl += splitUrlArr[1].substring(ampPos);
                        }
                        newActionUrl += "&eol=1";  //to show popup on registration page
                        $('form[name=frmLoginRegisterTab]').get(0).setAttribute('action', newActionUrl);
                        document.forms['frmLoginRegisterTab'].submit();
                    		}
                        //End CR-00013401
                        
                    }
                    else if (emailstatus == 'invalid-free-domain'){
                        $('#error-message-register').html(freeDomainErrorMessage);
                    }
                    else if (emailstatus == 'invalid program'){
                        $('#error-message-register').html(programUnavailbleMessage);
                    }                    
                    else if (emailstatus == 'success'){
                        document.forms['frmLoginRegisterTab'].submit();
                    }
                    else{
                        debug(": email status is : "+emailstatus);
                    }
                }
                catch(err)
                {
                    debug(err);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
            }
        });
    }

    /**
     * Function is called if screen is refreshed with parameter indicating
     * which tab user is opted for.
     * 
     */        
    function screenInitTabSwitch(){
        
        debug("START init tab switch method");
        if($('#tabselector').length > 0 && $('#tabselector').val() == 'register'){
    
            debug("Setting Register tab");
            $('#logontab2').addClass('active');
            $('#logontab1').removeClass('active');
            
        }
    
        if($('#tabselector').length > 0 && $('#tabselector').val() == 'login'){
            
            debug("Setting Logging tab");
            $('#logontab2').removeClass('active');
            $('#logontab1').addClass('active');             
            //$('#error-message-login').html('This username is already registered');
            
        }
        debug("Init Tab Switch Method ENDED ");
    }
        
    function del_cookie(name, path){
        debug("Deleting 'authentication' Cookie");
        //getCookie("getcookie:"+getCookie("authentication"));
        document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        debug("After deletion: cookie:'authentication':"+getCookie("authentication"));
    }
    
    function del_cookie1(name){
        document.cookie = name +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    }
    
    function getCookie(c_name) {
      if (document.cookie.length>0) {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1) {
          c_start=c_start + c_name.length+1;
          c_end=document.cookie.indexOf(";",c_start);
          if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
      }
      return "";
    }


//del
/**
     * handles the ajax call when form is submitted for
     * login form for login Tab
     */
    function submitLoginForm()  {
        
    debug("<p>Authenticating Your Creds. Plsssss wait..</p>");
    debug("URL being accessed is :   "+ urllogin );
    
    var uname = jQuery.trim($('#username').val());
    
    $.ajax({
        type: "POST",
        dataType: "json",
        url: urllogin,
        data: {username:uname,password:$("#password").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :   "+ urllogin );
                try
                {
                    debug("Inside Success Condition");
                    debug("<p>Authentication successful...logging in</p>");
                    var user = object.user;
                    debug("Inside Success Condition User is :   "+user);

                    //redirection logic in case of erro code set
                    
                    if(object.VM_ERROR != null && object.VM_ERROR.length> 0){
                        if(object.REDIRECT_URL != null && object.REDIRECT_URL.length> 0){
                            window.location = object.REDIRECT_URL;
                            return false;
                        }
                    }
                    
                   
                    // comment the lines if it does not work on dev/qai boxes - start
                    var rememberMeFlag = $("#rememberMe").is(":checked");
                    if(rememberMeFlag)
                        rememberUserDtls(rememberMeFlag);
                    // comment the lines if it does not work on dev/qai boxes - end

                    loginRegistrationRedirectionCheck();  
                    
                    if(resultValidDomain == 'invalid'){
                        $("#validEmailDomain").val(resultValidDomain);
                    }
                    

				if (resultAuto == 'auto') {
							resultAuto = null;
							if (eol == 'eol') {
								eol=null;
								var actionUrl = $(
										'[name="frmLoginRegisterAuto"]').attr(
										'action');
								var newActionUrl = actionUrl + '&eol=1';
								$('[name="frmLoginRegisterAuto"]').get(0)
										.setAttribute('action', newActionUrl);
								document.forms['frmLoginRegisterAuto'].submit();
							} else {
								document.forms['frmLoginRegisterAuto'].submit();
							}
						}
                    else{
                        resultAuto = null;
                        document.forms['frmLogin'].submit();
                    }
                    //$("#user").html(user);
                }
                catch(err)
                {
                    debug(err);
                }
            },
            
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
                //debug("Error XMLHttpRequest response text   :   "+XMLHttpRequest.responseText);
                debug("Error XMLHttpRequest resp headers    :   "+XMLHttpRequest.getAllResponseHeaders());
                debug("Error XMLHttpRequest Location        :   "+XMLHttpRequest.getResponseHeader("Location"));
                debug("getting cookie"); 

                var authCookie = getCookie("authentication");
                var deactiveCookie  = getCookie("deActivationCookie");

                debug("cookie:'authentication':"+authCookie);
                debug("cookie:'deActivationCookie':"+deactiveCookie);

                del_cookie("authentication","/");
                del_cookie("deActivationCookie","/");
                
                var obsCookie = getCookie("ObSSOCookie");

                if( authCookie != null && authCookie == "20001"){
                    debug("Incorrect username or password");
                    $("#error-message-login").html(webgateAuthErrorMessage);
                    $('#password').val('');
                }
                else if (deactiveCookie != null && deactiveCookie != ""){
                    debug("obs cookie in failure case");
                    $("#error-message-login").html(deactiveUserMessage);
                    $('#password').val('');
                }         
                //BUG-00020781  
                else if (obsCookie != null && obsCookie != ""){
                    debug("obs cookie in failure case");
                    window.location = "/web/vmware/inactiveaccount";                    
                }                                
                else{
                    debug("Problem while processing the request. Please try later.");
                    $("#error-message-login").html(webgateAuthGenericErrorMessage);
                }
            }
        });
    }
    
    /**
     * handles the ajax call when form is submitted for
     * registration tab form
     */
        
    function submitRegister()  {       
        
    debug("<p>Registering Your Creds. Second Type..</p>");            
    $.ajax({
        type: "POST",
        dataType: "json",
        url: $("#checkEmailAddressAjaxUrl").val(),
        data: {emailAddress:$("#Email").val() , prgShortName:$("#prgShortName").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :"+$("#checkEmailAddressAjaxUrl").val());
                try
                {
                    debug("Inside Success Condition");
                    var emailstatus = object.status;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'registered'){
                        
                        $('#error-message-login').html(alreadyRegsErrorMessage);                        
                        $('#username').val($('#Email').val());     
                        debug("setting styles2");
                    }
                    else if(emailstatus == 'programExpired'){
                        
                    	//CR-00013401
                        //window.location = object.redirectURL;
                    	if(object.tryvmware == "tryvmware")
                		{
                			window.location = object.redirectURL;
                		}else{
                		
                			$('form[name=frmLoginRegister] #registerURL').val($('form[name=frmLoginRegister] #registerURL').val().replace("/group/","/web/"));
                        var actionUrl = $('form[name=frmLoginRegister]').attr('action');
                        var splitUrlArr = actionUrl.split("&p=");
                        //replace prog shortname
                        var newActionUrl = splitUrlArr[0] +"&p="+ object.latestProgShortName;
                        //append back any addl params after shortname from orig url
                        var ampPos = splitUrlArr[1].indexOf("&");
                        //alert(ampPos);
                        if(ampPos!=-1) {
                           newActionUrl += splitUrlArr[1].substring(ampPos);
                        }
                        newActionUrl += "&eol=1";  //to show popup on registration page
                        $('form[name=frmLoginRegister]').get(0).setAttribute('action', newActionUrl);
                        document.forms['evalRegisterNonTab'].submit();
                		}
                        //End CR-00013401
                        
                    }
                    else if (emailstatus == 'invalid-free-domain'){
                        $('#error-message-register').html(freeDomainErrorMessage);
                    }                    
                    else if (emailstatus == 'success'){
                        document.forms['evalRegisterNonTab'].submit();
                    }
                    else{
                        debug(": email status is : "+emailstatus);
                    }
                }
                catch(err)
                {
                    debug(err);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
            }
        });
    }
    
    /**
     * handles the ajax call when form is submitted for
     * logged in flow for registration link
     */
        
    function submitRegisterContinue()  {       
        
    debug("<p>inside loged in flow...continue registration</p>");            
    $.ajax({
        type: "POST",
        dataType: "json",
        url: $("#checkEmailAddressAjaxFreeDomain").val(),
        data: {emailAddress:$("#emailId").val() , prgShortName:$("#prgShortName").val()},
        success: function(object)
            {
                debug("Inside Success submitRegisterContinue URL being accessed is :"+$("#checkEmailAddressAjaxFreeDomain").val());
                try
                {
                    debug("Inside Success Condition");
                    var emailstatus = object.status;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'success'){
                        
                        document.forms['frmRegisterLoggedFlow'].submit();
                        debug("setting styles2");
                    }
                    else if (emailstatus == 'invalid-free-domain'){
                        $('#error-message-register-continue').html(freeDomainErrorMessage);
                        $('#eval-not-registered-msg').hide();
                        $('#eval-not-registered-link').hide();
                        $('#button-download-license-register').hide();
                    }       
                    else{
                        debug(": email status is : "+emailstatus);
                    }
                }
                catch(err)
                {
                    debug(err);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
            }
        });
    }    
    
    /**
     * Saves the username in a cookie when user clicks on remember me 
     * 
     * @param rememberMeFlag
     */
    function rememberUserDtls(rememberMeFlag) {
        
        var emailIdOrCN = $("#username").val();
        
        $.ajax({
        type : "POST",
        async : false,
        dataType : "json",
        url : rememberURL,
        data : {
            rememberMe : rememberMeFlag,
            username: emailIdOrCN
        },

        success : function(object) {                                        
            debug("cookie created successfully");           
        },
        
        error: function(jqXHR, textStatus, errorThrown) {
             
            debug("TextStatus=                          :   "+textStatus);
            debug("errorThrown=                         :   "+errorThrown);
            debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
            debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
            debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
        }
    });
  }
    

/*
Changes for Resiter Button inside tab content- logged in flow
*/
    function submitRegisterButtonContinue()  {       
        
    debug("<p>inside loged in flow...continue registration</p>");            
    $.ajax({
        type: "POST",
        dataType: "json",
        url: $("#checkEmailAddressAjaxFreeDomain").val(),
        data: {emailAddress:$("#emailId").val() , prgShortName:$("#prgShortName").val()},
        success: function(object)
            {
                debug("Inside Success submitRegisterContinue URL being accessed is :"+$("#checkEmailAddressAjaxFreeDomain").val());
                try
                {
                    debug("Inside Success Condition");
                    var emailstatus = object.status;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'success'){
                        
                        document.forms['frmRgstrLgdFlwDnldTab'].submit();
                        debug("setting styles2");
                    }
                    else if (emailstatus == 'invalid-free-domain'){
                        $('#error-message-register-continue').html(freeDomainErrorMessage);
                        if($('#eula_decline').length == 0 ) {
                            var registerbuttonmessage='<div id="eula_decline" class="alert-box-wrapper">'+
                            '<div class="alert-box-holder">'+
                            '<div class="alert-title">'+freeDomainErrorMessage+'</div>'+                            
                            '</div></div>';                        
                            $('#tab_download').prepend(registerbuttonmessage);
                        }
                        $('#eval-not-registered-msg').hide();
                        $('#eval-not-registered-link').hide();
                        $('#button-download-license-register').hide();
                    }       
                    else{
                        debug(": email status is : "+emailstatus);
                    }
                }
                catch(err)
                {
                    debug(err);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=                          :   "+textStatus);
                debug("errorThrown=                         :   "+errorThrown);
                debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
                debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
                debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
            }
        });
    }    


/*function loadBundles(lang) {
                             jQuery.i18n.properties({
                                name:'message', 
                                 path:'/static/vmware/modules/evals/message/', 
                                 mode:'map',
                                 language:lang, 
                                 callback: function() {
                                     updateMessage();
                                 }
                             });
                   }*/
 
function updateMessage() {
    emailRequiredMessage=itevals.globalVar.enterEmailOrCN;
    emailValidationMessage=itevals.globalVar.enterEmailOrCN;
    emailFieldLengthMessage=itevals.globalVar.validEmail;
    passwordRequiredMessage=itevals.globalVar.enterPassword;
    passwordFieldLengthMessage=itevals.globalVar.incorrectUserOrPWD;
    firstNameRequiredMessage=itevals.globalVar.enterFirstName;
    //firstNameFieldLengthMessage=itevals.globalVar.firstNameLenErr;
    lastNameRequiredMessage=itevals.globalVar.enterLastName;
    //lastNameFieldLengthMessage=itevals.globalVar.lastNameLenErr;
    webgateAuthErrorMessage=itevals.globalVar.incorrectUserOrPWD;
    webgateAuthGenericErrorMessage=itevals.globalVar.processError;
    alreadyRegsErrorMessage=itevals.globalVar.emailExistErr;
    freeDomainErrorMessage=itevals.globalVar.enterOtherEmail;
    programUnavailbleMessage=itevals.globalVar.invalidProgram;    
    deactiveUserMessage=itevals.globalVar.emailDeactived ;
    emailRequiredMessageRegn=itevals.globalVar.enterEmail;
}

    /**
     * checks for the current user if there is evalhistory available
     * Used for auto submit of register for user
     * @param rememberMeFlag
     */
    function loginRegistrationRedirectionCheck() {
        
        //var emailIdOrCN = $("#username").val();
		var locationParent = location.search.replace("?","&");
        var loginRedirectLangURL = null;
        if($("#langName").val() == 'en'){
            loginRedirectLangURL = loginRedirect+locationParent;
        }
        else{
            loginRedirectLangURL = "/"+$("#langName").val()+loginRedirect+locationParent;
        }
		
		//var paramsURL = myvmware.evals.getUrlPrarams();
		
        $.ajax({
        type : "POST",
        async: false,
        dataType : "json",
        url : loginRedirectLangURL,
        data : {
            prgShortName:$("#prgShortName").val()       
        },

        success : function(object1) {                                        
            debug("inside auto");           
            var result = object1.auto;
            if(result == 'yes'){ 
            resultAuto = "auto";
            }
            else{
            resultAuto = "nonauto";
            }
            resultValidDomain =  object1.validEmailDomain;
            eol=object1.eol;
        },
        
        error: function(XMLHttpRequest, textStatus, errorThrown) {
             
            debug("TextStatus=                          :   "+textStatus);
            debug("errorThrown=                         :   "+errorThrown);
            debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
            debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
            debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
        }
    });
  }

    
function debug(message){
    //console.log("debug :::: "+message);
}
