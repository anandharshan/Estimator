/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  resetPassword.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/08/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Kanhaiya Saxena)
/* ########################################################################### *

  _    ____  ___                        
 | |  | |  \/  |                        
 | |  | | .  . |__      ____ _ _ __ ___ 
 | |/\| | |\/| |\ \ /\ / / _` | '__/ _ \
 \  /\  / |  | | \ V  V / (_| | | |  __/
  \/  \/\_|  |_/  \_/\_/ \__,_|_|  \___|
 
/* ########################################################################### */


if (typeof(myvmware) == "undefined")  
  myvmware = {};

var urllogin = '/group/vmware/alogin?p_p_id=asynchLoginPortlet_WAR_itvmlogin&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_resource_id=asynchServeUserData';
var activationUrl="/web/vmware/activation?p_p_id=userActivationPortlet_WAR_itusermanagement&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=activateUser&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1";
var authenticationStatus;


myvmware.resetPassword = {
    init: function() {
    	//vmf.scEvent =true;
    //	loadresourceBundel();
    	updateMessageRespassword()
    	myvmware.resetPassword.bindEvents();
    	var emailAddressCheckStatus=$("#emailAddressCheckStatus");
    	var emailAddressField=$("#emailAddress");
    	emailAddressField.keyup(function(){
    		emailAddressCheckStatus.addClass("hidden");
    		$(this).parents('.ctrlHolder').find('div.messageHolder').find('label').addClass('hidden');
    	});
    	var requiredInfoDiv=$("#requiredInfomation");
		var alertBoxDiv =$("#alertBox");
       if( $("#updateStatus").val()=='failure'){
    	   requiredInfoDiv.removeClass('hidden');
    	   alertBoxDiv.removeClass('hidden');
       }else{
    	   requiredInfoDiv.addClass('hidden');
    	   alertBoxDiv.addClass('hidden');
       }
    },
    initActivation: function() {
    	var passwordCheckStatus=$("#passwordCheckStatus");
    	var passwordField=$("#password");
    	passwordField.keyup(function(ev){
    		if (ev.keyCode != 13) {
				passwordCheckStatus.addClass("hidden");
			}
    		//$(this).parents('.ctrlHolder').find('div.messageHolder').find('label').addClass('hidden');
    		
//    		if (ev.which === 13 && isIE()) {
//    			$('#activationForm').submit();
//			}
    	});
		passwordField.focusout(function(){
    		passwordCheckStatus.addClass("hidden");
//    		$(this).parents('.ctrlHolder').find('div.messageHolder').find('label').addClass('hidden');
    	});
    },
    
	bindEvents : function(){
		$('#cancelForgetPass').click( function(){
			location.href = cancelButtonURL;
        });
	},
	
    validate: function(){
        
    	// $("#passwordCheckStatus").addClass("hidden");
    	// Custom validation rule - http://jquery.bassistance.de/validate/demo/custom-methods-demo.html
        $.validator.methods.customRule = function(value, element, param) {
          return value == param;
        };
        
        // Validation code
        $("#resetAndActivationForm").validate({
        	errorPlacement : function(error, element) {
		          
            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
            	errorDiv.html(error);
            	errorDiv.addClass('error');
            	element.parents('.ctrlHolder').addClass('error');
            },
          rules: {
	            password: {
	              required: true,
	              rangelength: [6,20]
	            },
	            password_verify: {
	                required: true,
	                equalTo: "#password"
	              }
          },
          messages: {
	           password: {
	        	   required : usermanagement.globalVar.requiredMsg,
	            	rangelength: $.format(usermanagement.globalVar.pwdLength)
	            },
	            password_verify:{
	            	required : usermanagement.globalVar.requiredMsg,
					equalTo : usermanagement.globalVar.confirmPwd
	            }
           
          },
         onfocusout: function(element){
				this.element(element);
			},
		 success : function(label) {
	          	label.parent().removeClass('error');
	          	label.parents('.ctrlHolder').removeClass('error');
	     }
        });
        
        $("#activationForm").validate({
            errorPlacement: function(error, element) {
              $("#passwordCheckStatus").addClass("hidden");	
              
              
              var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
	          errorDiv.html(error);
	          errorDiv.addClass('error'); 
              element.addClass('error_required');
	          	
            },
            rules: {
              password: {
                required: true,
                rangelength: [6,20]
              }
            },
            messages: {
             password: {
            	 required : usermanagement.globalVar.requiredMsg,
              	rangelength: $.format(usermanagement.globalVar.rangelengthMsg)
              }             
            },
            onfocusout: function(element){
  				this.element(element);
  			},
  			showErrors: function(errorMap, errorList) {
				for (var i = 0; errorList[i]; i++) {
					var element = this.errorList[i].element;
					this.errorsFor(element).remove();
				}
				this.defaultShowErrors();
			},
  		  success : function(label) {
	          	label.parent().removeClass('error');
	          	label.parents('.ctrlHolder').find('input').removeClass('error_required');
	          	label.parents('.ctrlHolder').removeClass('error');
	     }, 
 		 submitHandler: function(form) {
			 
			authenticateUserDetails();
			var obssocookie = getCookie("ObSSOCookie");  
			
			if(authenticationStatus == true || ( obssocookie!=null && $.trim(obssocookie) != "" && obssocookie!="loggedoutcontinue" )){
				activateUser();
				window.location = $('#redirectURL').val(); 
			}
			
			return;
			
	   }
          });
        
        $("#passwordFormCommandForm").validate({
        	
        	 errorPlacement : function(error, element) {
		          
	            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
	            	errorDiv.html(error);
	            	errorDiv.addClass('error');
	            	element.parents('.ctrlHolder').addClass('error');
	            },
            rules: {
              'emailAddress': {
                required: {
                                    depends:function(){
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
                email: true,
                maxlength : 50
              }
            },
            messages: {
            	'emailAddress': {
            		required : usermanagement.globalVar.requiredMsg,
					email : usermanagement.globalVar.invalidEmail,
					maxlength : $.format(usermanagement.globalVar.charLimit)
              }             
            },
            onfocusout: function(element){
  				this.element(element);
  			},
  			success : function(label) {
          	label.parent().removeClass('error');
          	label.parents('.ctrlHolder').removeClass('error');
          }
          });
        
        $('#cancelForgetPass').click( function(){
        	location.href = cancelButtonURL;
        });
        
        $('#resetPassSubmit').click(function(){ 
        	submitresetAndActivationForm();
        	//riaLink('confirmation');
			return false;
		} );
        
        $('#forgetPassSubmit').click(function(){ 
        	submitpasswordFormCommandForm();
        	//riaLink('instructions'); 
			return false;
		} );
        

    }
    
  }

function submitpasswordFormCommandForm(){
	
	$('#passwordFormCommandForm').submit();
}

function submitresetAndActivationForm(){
	
	$('#resetAndActivationForm').submit();
}

 function resetPassConfirmation(){
	riaLink('instructions'); 
	return true;
 }
function resetConfirmation(){
	riaLink('confirmation'); 
	return true;
 }

function loadresourceBundel(){
	var langauge=$('#localeFromLiferayTheme').text();
	loadResBundles(langauge);
}

function loadResBundles(lang) {
    jQuery.i18n.properties({
       name:'message', 
        path:'/static/myvmware/modules/user_management/message/', 
        mode:'map',
        language:lang, 
        callback: function() {
        	updateMessageRespassword();
        }
    });
}


function updateMessageRespassword() {
	
	cancelButtonURL="./login";
	shortPass = usermanagement.globalVar.tooShortLbl;//'Too Short'
	badPass = usermanagement.globalVar.weakLbl;//'Weak'
	goodPass = usermanagement.globalVar.goodLbl;//'Good'
	strongPass = usermanagement.globalVar.strongLbl;//'Strong'
	defaultPass = usermanagement.globalVar.passwordStrength;//'defeult'
	sameAsUsername = usermanagement.globalVar.samePwdUsername;//'Password is the same as username.'//'Password is the same as username.'
}

function authenticateUserDetails(){
	
	
	try
    {
		var obssocookie = getCookie("ObSSOCookie");  
		
		if(obssocookie!=null ){
			del_cookie1("ObSSOCookie");   
		}     
    }
    catch(err)
    {
        debug(err);
    }

    
    debug("Authenticating Your Creds. Plsssss wait.. ");
    debug("URL being accessed is :   "+ urllogin );
    
    
    $.ajax({
        type: "POST",
        dataType: "json",
        url: urllogin,
        async: false,
        data: {username:$("#txt_email").val(),password:$("#password").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :   "+ urllogin );
                try
                {
                    debug("Inside Success Condition"); 
                    var user = object.user;
                    debug("Inside Success Condition User is :   "+user);
                    authenticationStatus = true;
                     
                    
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
                
                del_cookie("authentication","/");
                del_cookie("deActivationCookie","/");

                if( authCookie != null && authCookie == "20001"){

                 $("#password").addClass('error_required');
               	 $("#passwordCheckStatus").html("Incorrect Password"); 
            	 $("#passwordCheckStatus").removeClass('hidden'); 
                     $('#password').val(''); 
                }

                authenticationStatus = false;
            }
        });
    
}


function activateUser(){
    
    $.ajax({
        type: "POST",
        dataType: "json",
        url: activationUrl,
        async: false,
        data: {emailAddress:$("#txt_email").val()},
        success: function(object)
            {
                var status = object.status;
            },
            
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
                debug("TextStatus=    :   "+textStatus);
                 
            }
        });
    
}


function debug(message){
//    console.log("debug :::: "+message);
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
function del_cookie(name, path){
    debug("Deleting 'authentication' Cookie");
    //getCookie("getcookie:"+getCookie("authentication"));
    document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    debug("After deletion: cookie:'authentication':"+getCookie("authentication"));
}

function isIE(){
	var browser = navigator.appName;
	
	if(browser.indexOf("Microsoft") != -1){
		return true;		
	}else{
		return false;
	}
}