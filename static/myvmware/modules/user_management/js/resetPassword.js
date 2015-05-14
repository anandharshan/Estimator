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

myvmware.resetPassword = {
    init: function() {
    	//vmf.scEvent =true;
    	//loadresourceBundel();
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
    	passwordField.keyup(function(){
    		passwordCheckStatus.addClass("hidden");
    		$(this).parents('.ctrlHolder').find('div.messageHolder').find('label').addClass('hidden');
    	});
		passwordField.focusout(function(){
    		passwordCheckStatus.addClass("hidden");
    		$(this).parents('.ctrlHolder').find('div.messageHolder').find('label').addClass('hidden');
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
              
              if(element.parents('.input-wrapper').length>0){
                element.parents('.input-wrapper').after(error);
              }else{
                element.after(error);
              }
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
  		  success : function(label) {
          	label.parent().removeClass('error');
          	label.parents('.ctrlHolder').removeClass('error');
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
					maxlength : $.format(usermanagement.globalVar.maxlengthMsg)
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
	sameAsUsername = usermanagement.globalVar.samePwdUsername;//'Password is the same as username.
}