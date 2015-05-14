/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  resetPassword.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/08/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Ajay Patel)
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
    	//updateMessageRespassword()
    	myvmware.resetPassword.bindEvents();
    	
    	var emailAddressField=$("#emailAddress");
  
		var alertBoxDiv =$("#alertBox");
        
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
        $("#createPasswordForm").validate({
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
              },
			emailAddress: {
                required: {
                                    depends:function(){
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
                email: true,
                 
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
            },
			emailAddress:{
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
        
        $('#cancelForgetPass').click( function(){
        	location.href = cancelButtonURL;
        });
        
        $('#createPassSubmit').click(function(){ 
        	submitpasswordFormCommandForm();
        	//riaLink('confirmation');
			return false;
		} );
		
		$('#cancelPasswordSubmit').click( function(){
			var redirectionUrl = $('#redirectionURL').val();
  			location.href = redirectionUrl;
		 });
        
             

    }
    
  }

function submitpasswordFormCommandForm(){	
	$('#createPasswordForm').submit();
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