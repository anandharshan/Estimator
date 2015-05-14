/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  profile.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 04/24/2011
 * ##### AUTHOR: Deloitte Consulting LLP (Jason Smale)
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
var currentStateShow = true;
myvmware.profile = {
    init: function() {
        dropdownFlag = true;
        //vmf.scEvent =true;
        //minimizeAllSections();
        bindPersonalInfoEvents();
        bindCancelEvents();
        populateSelectFields();
        populateJobRoles(true);
        toggleSelectStateDiv(true);
        myvmware.profile.populateReadOnlySelectFields();
        
        getAdditionalInfoXMLResponses($('#CustomerNumber').val());
        
        validateNoOfEmpsValueSelected();      
        actionClick = $("#userAction").val();
        if("true" == actionClick){
            vmf.scEvent =true;
            callBack.addsc({'f':'riaLink','args':['personal-information']});
        }else{
            vmf.scEvent = false;
        }
        // Edit-Cancel-Save buttons     
        $('.fn_edit').click(function() {
            var $fieldset = $(this).parents('fieldset');    
            
            // Hide all the read only fields
            $fieldset.find('.read-only').addClass('hidden');
            
            // Show all the editable fields
            $fieldset.find('.fn_editable').removeClass('hidden');
            
            //Hide edit button
            $fieldset.find('.fn_edit').addClass('hidden');
            
            //Show Save/Cancel buttons
            $fieldset.find('.fn_save,.fn_cancel').removeClass('hidden');
            
            $fieldset.find('.success-msg').addClass('hidden');
            
            /*if(vmf.dropdown && $(this).attr("id")=="editAdditionalInfo"){
                $(".inputHolderClass").remove();
                $("#AQ_virtualization_budget").show();
                vmf.dropdown.build($("#AQ_virtualization_budget"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"left"});
            }*/
            
            return false;
        });
        
        $('.fn_cancel').click(function() {
            var $fieldset = $(this).parents('fieldset');
            
            // Show all the read only fields
            $fieldset.find('.read-only').removeClass('hidden');
            
            // Hide all the error messages
            $fieldset.find('.messageHolder').children().addClass('hidden');
            
            // Revert error message changes
            $fieldset.find('.ctrlHolder').removeClass('error');
            
            // Hide all the editable fields
            $fieldset.find('.fn_editable').addClass('hidden');
            
            //Show edit button
            $fieldset.find('.fn_edit').removeClass('hidden');
            
            //Hide Save/Cancel buttons
            $fieldset.find('.fn_save,.fn_cancel').addClass('hidden');
            
            $fieldset.find('.error_msg').addClass('hidden');
            
            return false;
        });  
        /*
         * functionality implementation of VISL - Uncomment and supply the service path to authUrl to integrate
         */

        // To check for first time user.
        if( v7c.globalVar.showauthtokenblock =="false" || v7c.globalVar.showauthtokenblock =="False"){
                $('#authCode').hide();
        }
        else{
            myvmware.profile.authGenerateAjax();
            
        }
        $('#authCodeDiv').click(function() {
            var currentClass = $(this).closest('fieldset').attr("class");

            if(currentClass=="closed"){
                 
                 $('#authTokenResponse').html('');
                 
            }
            else{
                 $('#authTokenResponse').html('');
                 myvmware.profile.authGenerateAjax();
                 if(currentStateShow==false){
                        $('.liCopyButton').show();
                        $('.hideButtonDescription').show();  
                        $('.showButtonDescription').hide();                      
                 }
                 else{
                        $('.liShowButton').show();
                        $('.showButtonDescription').show(); 
                        $('.hideButtonDescription').hide();   
                 }


            }
           
        });
        
        //regenerate tooltip
        $('.btnRegenerate').mouseover(function(){
                $('#reGenerateTooltip').show();
        });
        $('.btnRegenerate').mouseout(function(){
                $('#reGenerateTooltip').hide();
        });

        //make ajax call to get the Authentication Code add VISL logic here and finally show the auth code component                            
        $('#btnCodeGenerate').click(function() {
            var authUrl = v7c.globalVar.generatecodeurl;
            if(!($('.historyToggle').parent('p').hasClass('closed'))){
                $('.historyToggle').parent('p').addClass('closed');
                $('.authHistoryContainer').toggle();
                }
            var successMsg = v7c.globalVar.generateTokenSuccess;
            myvmware.profile.authRegenerateAjax(authUrl,successMsg);
        });
        //make ajax call to get the Authentication Code add VISL logic here and finally show the auth code component
        $('#confirmRenegerateBtn').click(function() {
            var authUrl = v7c.globalVar.confirmRegenerateDataurl;
			var successMsg = v7c.globalVar.regenerateTokenSuccess;
			var contactSupport = v7c.globalVar.contactSupportLink;
			
            myvmware.profile.authRegenerateAjax(authUrl,successMsg);
                if(!($('.historyToggle').parent('p').hasClass('closed'))){
                $('.historyToggle').parent('p').addClass('closed');
                $('.authHistoryContainer').toggle();
                }
            $('.simplemodal-close').trigger('click');
             $('#btncopyToClipboard').html(v7c.globalVar.copyBtnLabel);
        });
        // To show the data table on clik of h
        $('.historyToggle').click(function() {
            $(this).parent('p').toggleClass('closed');
            $('.authHistoryContainer').toggle();
            //if (!$("#tblAuthHistory thead tr th").hasClass('sorting_asc')) {
                vmf.datatable.build($('#tblAuthHistory'), {
                    "bProcessing": false,
                    "bAutoWidth": false,
                    "bFilter": false,
                    "bInfo": false,
                    "aaSorting": [[1,'asc']],
                    "sDom": 'zrtSpi',
                    "bDestroy":true,
                    "bPaginate": false,
                    "aoColumns": [
                        {"sTitle": "<span class='descending'>" + rs.authCode + "</span>", "sClass":"sorting_asc","sWidth": "80px","mDataProp":function(rData){                          
                            if(rData[1]=='Active' && currentStateShow == false){
                                return "<span class='activeToken'>"+ rData[0] +"</span>";
                            }
                            else if(rData[1]=='Active' && currentStateShow == true){
                                var newString = rData[0].replace(/[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]/g, '*'); 
                                return "<span class='activeToken'>" + newString + "</span>";
                            }
                            else{
                                return "<span>" + rData[0]  + "</span>";
                            }
                        }},
                        {"sTitle": "<span class='descending'>" + rs.authStatus + "</span>", "sClass":"sorting_asc","sWidth": "80px"},
                        {"sTitle": "<span class='descending'>" + rs.authGeneratedState + "</span>", "sClass":"sorting_asc","sWidth": "80px"},
                        {"sTitle": "<span class='descending'>" + rs.authGeneratedBy + "</span>","sClass":"sorting_asc", "sWidth": "150px"},
                        {"sTitle": "<span class='descending'>" + rs.authEmail + "</span>","sClass":"sorting_asc", "sWidth": "150px"}
                    ],
                "oLanguage": {
                    "sLoadingRecords":usermanagement.globalVar.loadingLbl
                },                    
                    "sAjaxSource": v7c.globalVar.historysummaryurl,
                    "error": '',
                    "bServerSide": false
                });
              
           // }
        });        

        $("#tokenDisplayButton").live('click', (function () {
            var parsedJson,eStatus, eMsg, eTokenVal, codeHistoryStatus ; 
            var btnId = $(this).attr('id');         
            var text = $(this).text();          

            if (text === v7c.globalVar.labelShow) {     
                    var authUrl = v7c.globalVar.showtokenurl;
                    vmf.ajax.post(authUrl, '', function(data) {     
                    parsedJson = (typeof data !='object') ? vmf.json.txtToObj(data) : data;
                    eStatus = parsedJson.jsonAuth.error;
                    codeHistoryStatus = parsedJson.jsonAuth.authCodeHistory;
                    eTokenVal = parsedJson.jsonAuth.authCode;
                    fStatus = parsedJson.jsonAuth.firstTimeUser;
            
                    if(eStatus == true){
                        var contactSupport = "<a href= '" +v7c.globalVar.getHelpLink + "' target='_blank'>"+v7c.globalVar.contactSupport+"</a>";
                        var failureMsg = v7c.globalVar.loadsectionError;
                        $('#authTokenResponse').html(failureMsg).addClass('colorRed').removeClass('colorGreen');              
                    }else {
                        if (eStatus != true && fStatus === true) {
                            $('.codeContainer').show();
                            $('.authCodeContainer').hide();
                        }
                      else {
                            $('#authenticationCode').html(eTokenVal);
                            $('.activeToken').html(eTokenVal);
                            $('#'+btnId).html('Hide');  
                            $('.showButtonDescription').hide();                            
                            $('.liShowButton').hide();
                            $('.hideButtonDescription').show();
                            $('.liCopyButton').show();
                            currentStateShow = false;                   
                        }
                    }
                    }); 
            } 
            else if (text === v7c.globalVar.labelHide) {                
                        var newString = $('#authenticationCode').html().replace(/[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]/g, '*');
                        $('#authenticationCode').html(newString);
                        $('#'+btnId).html('Show'); 
                        $('.showButtonDescription').show();
                        $('.hideButtonDescription').hide();
                        $('.liCopyButton').hide();
                        currentStateShow = true;
                }    
            }));
			var errorAddrMsg = myvmware.profile.getParameterByName("errorCode");
			if (errorAddrMsg=="INV-ADD-ERR") {
				$('.invUserAddr').show();
                setTimeout(function(){
                    $("#editCompanyInfo").trigger("click");
                    $(window).scrollTop($('.invUserAddr').offset().top - 10);
                }, 0)
                
            }  
        },
    getParameterByName : function(key, URL_string){
        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + key + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var URL_string = URL_string || window.location.search;
        var results = regex.exec(URL_string);
        if(results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    authGenerateAjax: function() {
        var authUrl = v7c.globalVar.authdataurl, parsedJson, fStatus, fToken,eStatus, codeHistoryStatus ;        
        vmf.ajax.post(authUrl, '', function(data) {                        
            parsedJson = (typeof data !='object') ? vmf.json.txtToObj(data) : data;
            fStatus = parsedJson.jsonAuth.firstTimeUser;
            fToken = parsedJson.jsonAuth.authCode;
            eStatus = parsedJson.jsonAuth.error;
            codeHistoryStatus = parsedJson.jsonAuth.authCodeHistory;
            
            if(eStatus == true){
             	var contactSupport = v7c.globalVar.contactSupportLink;
				var failureMsg = v7c.globalVar.loadsectionError;
                $('#authTokenResponse').html(failureMsg).addClass('colorRed').removeClass('colorGreen');              
            }else {
                if (eStatus != true && fStatus === true) {
                    $('.codeContainer').show();
                    $('.authCodeContainer').hide();
              }
              else {
                    if(currentStateShow==false){
                            $('#authenticationCode').html(fToken);
                            $('.activeToken').html(fToken);
                            $('.liCopyButton').show();
                            $('.liShowButton').hide();
                            $('.hideButtonDescription').show();  
                            $('.showButtonDescription').hide(); 
                            $('.codeContainer').hide();                     
                            $('.authCodeContainer').show();
                            $('#authTokenResponse').html(v7c.globalVar.alreadyHasToken).removeClass('colorGreen').removeClass('colorRed');
                    }
                    else{
                            $('.liShowButton').show();
                            $('.liCopyButton').hide();
                            $('.showButtonDescription').show(); 
                            $('.hideButtonDescription').hide();                     
                            var newString = fToken.replace(/[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]/g, '*');                      
                            $('#authenticationCode').html(newString);
                            $('.codeContainer').hide();                     
                            $('.authCodeContainer').show();
                            $('#authTokenResponse').html(v7c.globalVar.alreadyHasToken).removeClass('colorGreen').removeClass('colorRed');
                     }
                }
            }
               if(codeHistoryStatus==true){
                $("#authCodeHistoryDiv").show();
               }
               else{
                $("#authCodeHistoryDiv").hide();
               }
                   // To initialize the copy functionality        
        vmf.zeroClipboardShow.init("#btncopyToClipboard", rs.lblCopied);
        });

    },
    authRegenerateAjax: function(authUrl,successMsg) {
        var parsedJson,eStatus, eMsg, eTokenVal, codeHistoryStatus ; 
        
        
        vmf.ajax.post(authUrl, '', function(data) {            
             parsedJson = (typeof data !='object') ? vmf.json.txtToObj(data) : data;            
             eStatus = parsedJson.jsonAuth.error;
             eMsg = parsedJson.jsonAuth.errorMsg;
             eTokenVal = parsedJson.jsonAuth.authCode;
			 codeHistoryStatus = parsedJson.jsonAuth.authCodeHistory;
			 var genericErr = parsedJson.jsonAuth.serviceDown;
			 
			//var contactSupport = "<a href= '" +v7c.globalVar.getHelpLink + "' target='_blank'>"+v7c.globalVar.contactSupport+"</a>";
			//var vislDisabledTokenErrMsg = v7c.globalVar.tokenError+" "+contactSupport +" "+ v7c.globalVar.forDetails;
			var vislDisabledTokenErrMsg = v7c.globalVar.combineMessage;
			var genericErrMsg = v7c.globalVar.genericError;
			
            if (eStatus === true) {
            
                if(genericErr === true) {
                    $('#authTokenResponse').html(genericErrMsg).addClass('colorRed').removeClass('colorGreen');
                }else {
                    if(parsedJson.jsonAuth.customerVislFlag == false) {
                        $('#authTokenResponse').html(vislDisabledTokenErrMsg).addClass('colorRed').removeClass('colorGreen');
                    }
                }
            
            }
            else {
                $('.codeContainer').hide();
                $('.authCodeContainer').show();
                $('#authTokenResponse').html(successMsg).addClass('colorGreen').removeClass('colorRed');
                if(currentStateShow == true){
                    var newString = eTokenVal.replace(/[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]/g, '*');
                    $('#authenticationCode').html(newString);
                    $('.liShowButton').show();
                    $('.liCopyButton').hide();
                    $('.showButtonDescription').show(); 
                    $('.hideButtonDescription').hide(); 
                }
                else{
                    $('#authenticationCode').html(eTokenVal);
                    $('.activeToken').html(eTokenVal);
                    $('.liCopyButton').show();
                    $('.liShowButton').hide();
                    $('.hideButtonDescription').show();  
                    $('.showButtonDescription').hide(); 
                }
            }
            if(!eStatus) {
                if(codeHistoryStatus==true){
                    $("#authCodeHistoryDiv").show();
                }
                else{
                    $("#authCodeHistoryDiv").hide();
                }
            }
            
        // To initialize the copy functionality        
        vmf.zeroClipboardShow.init("#btncopyToClipboard", rs.lblCopied);    
            
            
        },function(){myvmware.profile.genericError()},function(){vmf.loading.hide();},null,function(){vmf.loading.show({"overlay":true});});
    },
    genericError: function(){
            alert("Error");
        },
    toggleMinMax: function(buttonObj) {
        var $fieldset;

        if ($(buttonObj).parents('.list-wrapper').length > 0) {
            $fieldset = $(buttonObj).parents('.list-wrapper');
        } else {
            $fieldset = $(buttonObj).parents('fieldset');
        }

        if ($fieldset.hasClass('closed')) {
            $fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').show();
            $fieldset.removeClass('closed');
            $fieldset.find('.ctrlHolder').removeAttr('style');
            $fieldset.find('.ctrlHolder').removeAttr('STYLE');
        } else {
            $fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').hide();
            $fieldset.addClass('closed');
        }
    },
    view: function() {

    },
    openNewWindow: function(url) {

        window.open(url);
    },
    //added for communication Prefrences
    populateReadOnlySelectFields: function() {

        $("#emerContactNo").prepend("<option value='0'>"+usermanagement.globalVar.selectOne+"</option>");

        $("#prefContactMethod").prepend("<option value='0'>"+usermanagement.globalVar.selectOne+"</option>");

        if ($('#emerContactNo').parent().prev('.read-only').html() != 0) {
            var selectEmerContactNoValue = $('#emerContactNo').find('option:selected').text();
            $('#emerContactNo').parent().prev('.read-only').html(selectEmerContactNoValue);
        } else {
            $('#emerContactNo option[value="0"]').attr('selected', 'selected');
            $('#emerContactNo').parent().prev('.read-only').html('');
        }

        if ($('#prefContactMethod').parent().prev('.read-only').html() != 0) {
            var selectPrefContactMethodValue = $('#prefContactMethod').find('option:selected').text();
            $('#prefContactMethod').parent().prev('.read-only').html(selectPrefContactMethodValue);
        } else {
            $('#prefContactMethod option[value="0"]').attr('selected', 'selected');
            $('#prefContactMethod').parent().prev('.read-only').html('');
        }

        var selectTimeZoneValue = $('#timeZone').find('option:selected').text();
        $('#timeZone').parent().prev('.read-only').html(selectTimeZoneValue);

        var selectPrefLanguageValue = $('#prefLanguage').find('option:selected').text();
        $('#prefLanguage').parent().prev('.read-only').html(selectPrefLanguageValue);
    },
    validateBasicProfile: function() {

        $.validator.methods.customRule = function(value, element, param) {
            return value == param;
        };
        $.validator.methods.email = function(value, element) {
            return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(value);
        }

        $.validator.addMethod("notEqual", function(value, element, param) {
            if (value != '' && value != null) {
                return value.toLowerCase() != $(param).val().toLowerCase();
            }
            else {
                return value != $(param).val();
            }
        }, usermanagement.globalVar.specifyDiffValue);

        $.validator.addMethod("equalToVerifyEmail", function(value, element, param) {
            if (value != '' && value != null) {
                return $.trim(value.toLowerCase()) == $.trim($(param).val()).toLowerCase();
            }
            else {
                return $.trim(value) == $.trim($(param).val());
            }
        }, usermanagement.globalVar.specifyDiffValue);

        // $.validator.addMethod("alphaNumeric", function(value, element) { 
        //  return this.optional(element) || /^[a-zA-Z0-9!?$%&?#()@*\+,\/;\[\\\]\^_`{|}~ ]+$/i.test(value); }, "Please enter only digits, letters //and special characters"); 
        
        //BUG-00057883 (HZ 1364488)
		$.validator.addMethod("xssValidation", function(value, element) { 
			return this.optional(element) || /^[a-zA-Z0-9\-\.\'\s]+$/i.test(value); }, usermanagement.globalVar.enterDetails);
		
	    $.validator.addMethod("alphaNumericzip", function(value, element) { 
	        return this.optional(element) || /^[a-zA-Z0-9\-\/\s]+$/i.test(value); }, usermanagement.globalVar.zipValidation); 
	    
	    $.validator.addMethod("phoneNumber", function(value, element) {         
	    	return this.optional(element) || /^[0-9\-\+\.\(..\)\s]+$/i.test(value);     }, usermanagement.globalVar.phoneValidation);   
	  
	    $.validator.addMethod("validEmail", function(value, element) {         
	    	if(value.length < 6) { 
	    		return false;
	    	}
			var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
			return emailPattern.test(value	);
	    }, usermanagement.globalVar.enterValidEmail);
	
	    $.extend($.validator.messages, {
	    	required: usermanagement.globalVar.requiredMsg,
	    	digits: usermanagement.globalVar.enterDigits,
	    	range:$.format(usermanagement.globalVar.digitRange)
	    });

	    $.validator.addClassRules({
	    	classRequired: {
	    		required: true
	    	},
	    	classDigitRangeZeroToTen: {
	    		digits : true,
	    		range : [0,10]
	    	},
	    	classDigitRangeOneToNintyNine: {
	    		digits : true,
	    		range : [1,99]
	    	},
	    	classDigitRangeOneToNineNintyNine: {
	    		digits : true,
	    		range : [1,999]
	    	}
	    });
			
	    $('#personalInfoForm').validate(
				{
					rules : {
		            	'user.firstName' : {
		                    required : true,
		                    maxlength : 50,
		                    //alphaNumeric : true
							//BUG-00057883 (HZ 1364488)
							xssValidation : true
		            	},
		            	'user.lastName' : {
		                    required : true,
		                    maxlength : 50,
		                   // alphaNumeric : true
						   //BUG-00057883 (HZ 1364488)
							xssValidation : true
		            	},
		            	'user.department' : {
		                    required : true
		            	},
		            	'user.jobRole' : {
		            		required : true 
		               	},
		            	'user.jobTitle' : {
		            		maxlength : 50
			                //alphaNumeric : true
		            	},
		            	'user.workPhone' : {
		                    required : true,
		                    maxlength : 20,
		                    phoneNumber : true
		            	},
		            	'user.workPhoneExt' : {
		        			 maxlength : 20,
			                 phoneNumber : true
		        		}
		            },	
		        	messages : {
		        	 
		        		'user.firstName' : {
		        			required : usermanagement.globalVar.requiredMsg,
		        			maxlength: $.format(usermanagement.globalVar.charLimit),
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
							//BUG-00057883 (HZ 1364488)
							xssValidation : usermanagement.globalVar.enterDetails
		        		},
		        		'user.lastName' : {
		        			required : usermanagement.globalVar.requiredMsg,
		        			maxlength: $.format(usermanagement.globalVar.charLimit),
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
							//BUG-00057883 (HZ 1364488)
							xssValidation : usermanagement.globalVar.enterDetails
		        		},
		        		'user.department' : {
		        			required : usermanagement.globalVar.requiredMsg
		        		},
		        		'user.jobRole' : {
		        			required : usermanagement.globalVar.requiredMsg
		        		},
		        		'user.jobTitle' : {
		        			maxlength: $.format(usermanagement.globalVar.charLimit)
		        			//alphaNumeric : 'Please enter only numbers, letters and special characters'
		        		},
		        		'user.workPhone' : {
		        			required : usermanagement.globalVar.requiredMsg,
		                    maxlength : $.format(usermanagement.globalVar.charLimit),
		                    phoneNumber : usermanagement.globalVar.invalidPhoneNum
		        		},
		        		'user.workPhoneExt' : {
		        			 maxlength : $.format(usermanagement.globalVar.charLimit),
			                 phoneNumber : usermanagement.globalVar.invalidPhoneNum
		        		}
		        	},
		            errorPlacement : function(error, element) {
		            	
		            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
		            	errorDiv.html(error);
		            	errorDiv.addClass('error');
		            	element.parents('.ctrlHolder').addClass('error');
		            },
		            onfocusout: function(element){
		            	this.element(element);
		            }, 
					success : function(label) {
	                	label.parent().removeClass('error');
	                	label.parents('.ctrlHolder').removeClass('error');
	                },
	                invalidHandler: function (form, validator) {
						
	                	showDashBoardError($('#user_firstname'));
					}, 
		            submitHandler : function(form){
		            	vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
		            	//appendDiv('savePersonalInfo');
						//setTimeout(function(){
		            	hideDashBoardError($('#user_firstname'));
		            	var options = {
		    				//beforeSubmit : validatePersonalForm , // used for client side validations
		    				async : false,
		            		success : function(data){processResponse(data, $('#savePersonalInfo'));vmf.loading.hide();}, // post-submit callback 
		            		error : function(){vmf.loading.hide();}
		            	};
		    			
		            	$('#personalInfoForm').ajaxSubmit(options);
		            		return false; // always return false to prevent standard browser submit and page navigation 		
		            }
		         	// },100); }
			}); 
	    
	    $('#companyInfoForm').validate(
				{
		            rules : {
		            	'user.organization' : {
		                    required : true,
		                    maxlength : 200,
		                    //alphaNumeric : true
							//BUG-00057883 (HZ 1364488)
							xssValidation : true
		            	},
		            	'user.industry' : {
		                    required : true
		            	},
		            	'user.noOfEmployees' : {
		                    required : true
		            	},		            	
		            	'user.address1' : {
		                    required : true,
		                    maxlength : 200,
		                    //alphaNumeric : true
							//BUG-00057883 (HZ 1364488)
							xssValidation : true
		            	},
		            	'user.address2' : {
		                    maxlength : 100,
		                    //alphaNumeric : true
							//BUG-00057883 (HZ 1364488)
							xssValidation : true
		            	},
		            	'user.city' : {
		                    required : true,
		                    maxlength : 100
		                    //alphaNumeric : true
		            	},
		            	'user.country' : {
		                    required : true
		            	},
		            	'user.zipcode' : {
		                    required : true,
		                    maxlength : 50
		                   // alphaNumericzip : true
		            	},
		            	'user.state' : {
		                    required : {
	                            depends: function(element){
	                               return isStateRequiredForCountry($("#user_country").val());
	                          }
		                    }
		            	}
		            },	
		        	messages : {
		        		'user.organization' : {
		                    required : usermanagement.globalVar.requiredMsg,
		                    maxlength : $.format(usermanagement.globalVar.charLimit),
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						   //BUG-00057883 (HZ 1364488)
							xssValidation : usermanagement.globalVar.enterDetails
		            	},
		            	'user.industry' : {
		                    required :  usermanagement.globalVar.requiredMsg
		            	},
		            	'user.noOfEmployees' : {
		                    required :  usermanagement.globalVar.requiredMsg
		            	},
		            	'user.address1' : {
		                    required :  usermanagement.globalVar.requiredMsg,
		                    maxlength : $.format(usermanagement.globalVar.charLimit),
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						   //BUG-00057883 (HZ 1364488)
							xssValidation : usermanagement.globalVar.enterDetails
		            	},
		            	'user.address2' : {
		                    maxlength : $.format(usermanagement.globalVar.charLimit),
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
						   //BUG-00057883 (HZ 1364488)
							xssValidation : usermanagement.globalVar.enterDetails
		            	},
		            	'user.city' : {
		                    required :  usermanagement.globalVar.requiredMsg,
		                    maxlength : $.format(usermanagement.globalVar.charLimit)
		                   // alphaNumeric : 'Please enter only numbers, letters and special characters'
		            	},
		            	'user.country' : {
		                    required :  usermanagement.globalVar.requiredMsg
		            	},
		            	'user.zipcode' : {
		                    required :  usermanagement.globalVar.requiredMsg,
		                    maxlength : $.format(usermanagement.globalVar.charLimit)
		                   // alphaNumericzip : 'Please enter only numbers, letters,and (space,-,/) special characters'
		            	},
		            	'user.state' : {
		                    required :  usermanagement.globalVar.requiredMsg
		                }
		        	},
		            errorPlacement : function(error, element) {
			          
		            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
		            	errorDiv.html(error);
		            	errorDiv.addClass('error');
		            	//element.parents('.ctrlHolder').addClass('error');
		            	
		            	if(element.attr('id')== 'user_noOfEmployees'){
                           element.parents('.subCtrlHolder').addClass('error');
                            element.parents('.ctrlHolder').find('#numOfEmp').addClass('error');
                        }else{ 
                            element.parents('.ctrlHolder').addClass('error');
                        }

		            },
		            onfocusout: function(element){
		            	this.element(element);
		            }, 
		            invalidHandler: function (form, validator) {
						
	                	showDashBoardError($('#user_zipcode'));
					}, 
		            submitHandler : function(form){
		            	
		            	if($('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').hasClass('error')){
		            		
		            		$('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').find('.messageHolder').find('label').show();
							$('#user_noOfEmployeesInYourCountry').focus();
		            		return false;
		            	}
		            	hideDashBoardError($('#user_zipcode'));
		            	
		            	var isAddressValid = validateAddress($("#user_country").val());
		            	if(!isAddressValid){
		            		return false;
		            	}
		            	
		            	vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
		            	//appendDiv('saveCompanyInfo');
						//setTimeout(function(){
		            	var options = {
		    			async : false,
		            		//success : function(data){processResponse(data, $('#saveCompanyInfo'));} // post-submit callback 
		            		success : function(data){
		            				
    		            				if (data['trilliumInvoked']=='true'){
    		            					
    		            					if(data['isExistsValAddress']=='true'){
    		            						$('#val_address').show();
            									var validatedAddress = data['validatedAddress'].split("~");
            									$('#displayHeader').text(usermanagement.globalVar.validateAddress);
            									$('#comp_info_addresspopup').find('#address_1 div').each(
            										function(i){
            											$(this).html(validatedAddress[i]);
            										}
            									)
            									$('#add1').trigger("click");
            								}else{
            									$('#val_address').hide();
            									$('#displayHeader').text(usermanagement.globalVar.unableToFindAddress);
            									$('#add2').trigger("click");
            								}	
            								validatedAddress = data['userEnteredAddress'].split("~");
            								$('#comp_info_addresspopup').find('#address_2 div').each(function(i){
            									$(this).html(validatedAddress[i]);
            								})
            								vmf.modal.show('comp_info_addresspopup',{checked:true});
    		            					
    		            				}
    		            				else{
    		            					processResponse(data, $('#saveCompanyInfo'));
    		            				}
    		            				//vmf.loading.hide();
                                    if (myvmware.profile.getParameterByName("errorCode") === "INV-ADD-ERR") {
                                        var source = myvmware.profile.getParameterByName('source'),
                                        bpid = myvmware.profile.getParameterByName('bpid'),
                                        betaProgramCode = myvmware.profile.getParameterByName('betaProgramCode'),
                                        goToUrl = source+"&betaProgramCode="+betaProgramCode+"&bpid="+bpid;
                                        window.location.href=goToUrl;
                                        //vmf.loading.show();
                                    }else{
                                       vmf.loading.hide(); 
                                    }
                                    
		            					//$('#saveCompanyInfo').parent().find(".preLoading").remove();
		            			}, // post-submit callback
		            	error : function(){vmf.loading.hide();}
		    			};
		    			
		            	$('#companyInfoForm').ajaxSubmit(options);
		            	return false; 		
		            },
		            success : function(label) {
		            	label.parent().removeClass('error');
	                	label.parents('.ctrlHolder').removeClass('error');
	                	label.parents('.subCtrlHolder').removeClass('error');
                        label.parents('.ctrlHolder').find('#numOfEmp').removeClass('error');

                    }
            });
        
        $('#loginInfoForm').validate(
            {
                errorClass: "error",
                rules : {
                    'user.newEmailAddress' : {
                        required : {
                                    depends:function(){
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
	                    validEmail : true,
	                    notEqual : '#existing_emailAddr',
	                    maxlength : 50
	              	},
					'user.reEnteredEmailAddr': {
	                    equalToVerifyEmail :'#user_newEmailAddress'
	            	}
	            },	
	        	messages : {
	        		'user.newEmailAddress' : {
	        			required :  usermanagement.globalVar.requiredMsg,
	        			validEmail : usermanagement.globalVar.enterValidEmail,
	        			notEqual : usermanagement.globalVar.emailAlreadyRegistered,
	        			maxlength : $.format(usermanagement.globalVar.charLimit)
	        		},
					'user.reEnteredEmailAddr': {
						equalToVerifyEmail : usermanagement.globalVar.emailNotMatch
	            	}
	        	},
	            errorPlacement : function(error, element) {
	            	
	            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
	            	errorDiv.html(error);
	            	errorDiv.addClass('error');
	            	element.parents('.ctrlHolder').addClass('error');	               
	            },
	            showErrors: function(errorMap, errorList) {
					for (var i = 0; errorList[i]; i++) {
						var element = this.errorList[i].element;
						this.errorsFor(element).remove();
					}
					this.defaultShowErrors();
				},
	            onfocusout: function(element){
	            	this.element(element);
	            }, 
	            invalidHandler: function (form, validator) {
					
                	showDashBoardError($('#user_newEmailAddress'));
				}, 
	            submitHandler : function(form){
	            	
	            	hideDashBoardError($('#user_newEmailAddress'));
	    			
	            	form.submit();	
	            },
	            success : function(label){
	            	label.parent().removeClass('error');
                	label.parents('.ctrlHolder').removeClass('error');
	            }
	           
		}); 
	    
	    $('#passwordInfoForm').validate(
				{
		            errorClass: "error",
		            rules : {
		            	'user.newPassword' : {
		                    required : true,
		                    rangelength : [6,20]
		                },
						'user.verifyPwd': {
		                    //required : true,
		                    equalTo : '#user_newPassword'
		            	}
		            },	
		        	messages : {
		        		'user.newPassword' : {
		        			 required :  usermanagement.globalVar.enterPwd,
		        			 rangelength : $.format(usermanagement.globalVar.pwdLimit)
		            	},
						'user.verifyPwd': {
							//required : 'Enter a password.',
							equalTo : usermanagement.globalVar.pwdNotMatch
		            	}
		        	},
		            errorPlacement : function(error, element) {
		            	
		            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
		            	errorDiv.html(error);
		            	errorDiv.addClass('error');
		            	element.parents('.ctrlHolder').addClass('error');
		            },
		            onfocusout: function(element){
		            	this.element(element);
		            }, 
		            invalidHandler: function (form, validator) {
						
	                	showDashBoardError($('#user_newPassword'));
					}, 
		            submitHandler : function(form){
		            	vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
		            	//appendDiv('savePasswordInfo');
						//setTimeout(function(){
		            	hideDashBoardError($('#user_newPassword'));
		            	var options = {
		            		async : false,
		            		success : function(data){processResponse(data, $('#savePasswordInfo'));vmf.loading.hide();}, // post-submit callback 
		            		error : function(){vmf.loading.hide();}
		            	};
		    			
		            	$('#passwordInfoForm').ajaxSubmit(options);
		            		return false; 	
		            },
		            success : function(label){
		            	label.parent().removeClass('error');
	                	label.parents('.ctrlHolder').removeClass('error');
		            }
			}); 
		$('#additionalInfoForm').validate(
			{
				
				errorClass: "error",
	            errorPlacement : function(error, element) {
	            	
	            	var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
	            	errorDiv.html(error);
	            	errorDiv.addClass('error');
	            	element.parents('.ctrlHolder').addClass('error');
	            },
				onfocusout: function(element){
	            	this.element(element);
	            }, 
	            invalidHandler: function (form, validator) {
					
                	showDashBoardError($('#saveAdditionalInfo'));
				}, 
				submitHandler : function(form){
					vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
					//appendDiv('saveAdditionalInfo');
					//setTimeout(function(){
					hideDashBoardError($('#saveAdditionalInfo'));
					var options = {
							async : false,
							success : function(data){processResponse(data, $('#saveAdditionalInfo'));vmf.loading.hide();},
							error : function(){vmf.loading.hide();}
					};
					 $('#additionalInfoForm').ajaxSubmit(options);
					 return false;
			},
				success : function(label){
		            label.parent().removeClass('error');
	                label.parents('.ctrlHolder').removeClass('error');
		        }
			});
		//added for communication prefrences
		$('#preferencesForm').validate(
		{
			
			errorClass: "error",
            errorPlacement : function(error, element) {
                
                var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                errorDiv.html(error);
                errorDiv.addClass('error');
                element.parents('.ctrlHolder').addClass('error');
            },
            onfocusout: function(element){
                this.element(element);
            }, 
            invalidHandler: function (form, validator) {
				
            	showDashBoardError($('#savePreferenceInfo'));
			}, 
			submitHandler : function(form){
				vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
				//appendDiv('savePreferenceInfo');
				//setTimeout(function(){
				hideDashBoardError($('#savePreferenceInfo'));
				var options = {
						async : false,
						success : function(data){processResponse(data, $('#savePreferenceInfo'));vmf.loading.hide();},
						error : function(){vmf.loading.hide();}
				};
				 $('#preferencesForm').ajaxSubmit(options);
				 return false;
			 },
			success : function(label){
	            label.parent().removeClass('error');
                label.parents('.ctrlHolder').removeClass('error');
            }
        });
        //added for Email preferences
        $('#emailPreferencesForm').validate(
        {
            
            errorClass: "error",
            errorPlacement : function(error, element) {
                
                var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                errorDiv.html(error);
                errorDiv.addClass('error');
                element.parents('.ctrlHolder').addClass('error');
            },
            onfocusout: function(element){
                this.element(element);
            }, 
            invalidHandler: function (form, validator) {
                
                showDashBoardError($('#saveEmailPreferenceInfo'));
            }, 
            submitHandler : function(form){
                vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
                //appendDiv('savePreferenceInfo');
                //setTimeout(function(){
                hideDashBoardError($('#saveEmailPreferenceInfo'));
                var options = {
                        async : false,
                        success : function(data){processResponse(data, $('#saveEmailPreferenceInfo'));vmf.loading.hide();},
                        error : function(){vmf.loading.hide();}
                };
                 $('#emailPreferencesForm').ajaxSubmit(options);
                 return false;
             },
            success : function(label){
                label.parent().removeClass('error');
                label.parents('.ctrlHolder').removeClass('error');
            }
        });
    }
};
    
    isQstnPreviouslyAnswrd = function(element){
        
        if($(element).parents('.ctrlHolder').hasClass('hidden'))
            return false;
        else
            return true;
    };
    
    showDashBoardError = function(element){
        
        //var errorDiv = element.parents('fieldset').find('div .errorDashBoard');
        //var error = "";//'<label class="error_msg"> ' + 'Please fix the error(s) below.' + '</label>'; (bug-BUG-00011204)
        //errorDiv.html(error);
        //errorDiv.removeClass('hidden');
        
    };
    
    hideDashBoardError = function(element){
        
        var errorDiv = element.parents('fieldset').find('div .errorDashBoard');
        errorDiv.html('');
        errorDiv.addClass('hidden');
    };
    
    isSelectedCountryUS = function(country){
        
        if(country == "US")
            return true;
    };
    
    checkIfAddressIsValid = function(async){
        
        var selCountry = $("#user_country").val();  
        var errMsg = false; 
            
        var city = $.trim($("#user_city").val());
        var zipCode = $.trim($("#user_zipcode").val());
        var state = $("#user_state").val();
        
        if(city != "" && zipCode != "" &&
                state != "" && selCountry != ""){ 
    
            $.ajax({
                async : async,
                type : "POST",
                dataType : "text json",
                crossDomain: false,
                url : $("#validateUSAddressUrl").val(),
                data : {
                    city : city,
                    zipCode : zipCode,
                    state : state,
                    country : selCountry
                }, 
                success : function(object) {
                     
                    var isValidAddress = object.valid;
                    if (isValidAddress == false) {
                        errMsg = object.errMsg; 
                    }else{                          
                        errMsg="";
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) { 
                    console.log(errorThrown); 
                    console.log(textStatus); 
                }
            });
    
        }
        return errMsg;
    };
    
    validateAddress = function(country){
        
        if(isSelectedCountryUS(country)){
            
            var errMsg = checkIfAddressIsValid(false);
            if(errMsg != ""){
                showDashBoardError($("#user_zipcode"));
                errMsg = "<label class='error' for='txt_zip/postal_code'>" + errMsg + "</label>";
                $("#user_zipcode_error").html(errMsg);
                addErrorClass($("#user_zipcode_error"));
                $("#txt_zip/postal_code").focus();
                $('#txt_zip/postal_code').blur(function() {
                    $("#user_zipcode_error").html(errMsg);
                    addErrorClass($("#user_zipcode_error"));
                });
                return false;
            }else{
                hideDashBoardError($("#user_zipcode"));
                $("#user_zipcode_error").html("");
                return true;
            }
            
        }
        else {
            return true;
        }
    };
function addErrorClass(element) {
    element.parent().addClass('error');
    element.addClass('error');
}

function confirmCompanyInfo()
{
    var options = {
        async : false,
        success : function(data){
            vmf.modal.hide();
            $('#user_address1').val(data.profile.user.address1);
            $('#user_address2').val(data.profile.user.address2);
            $('#user_city').val(data.profile.user.city);
            $('#user_zipcode').val(data.profile.user.zipcode);
            processResponse(data, $('#saveCompanyInfo'));
            } 
    }
    var nSelectedIndex = $('input:radio[name="address"]:checked').val();
    $('#selectedAddr').val(nSelectedIndex);
    $('#trilliumServiceInvoked').val('true');
    $('#companyInfoForm').ajaxSubmit(options);
    return false;       
}

function validateEmail(elementValue) {
    if(elementValue.length < 6) { //BUG-00030619
        return false;
    }
    var emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/;
    return emailPattern.test(elementValue);
}


/**
 * Compares the values selected by the user under No_Of_Emp_Global and No_Of_Emp_Country
 * and displays error message accordingly.
 * 
 */
function validateNoOfEmpsValueSelected(){   
    
    $('#user_noOfEmployees, #user_noOfEmployeesInYourCountry').change(function(){
        
        $('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').find('.messageHolder').html('');
        $('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').removeClass('error');
        
        var selGlobalOption = $('#user_noOfEmployees option:selected');
        var globalOptions = $('#user_noOfEmployees').find('option');
        
        var selCountryOption = $('#user_noOfEmployeesInYourCountry option:selected');
        var countryOptions = $('#user_noOfEmployeesInYourCountry').find('option');
        
        if(selGlobalOption.val() != "" && selGlobalOption.val() != globalOptions[globalOptions.length - 1].value){
            
            if(selCountryOption.val() != "" && selCountryOption.val() != countryOptions[countryOptions.length - 1].value){

				if($('#user_noOfEmployees').attr('selectedIndex') < $('#user_noOfEmployeesInYourCountry').attr('selectedIndex')){
					
					$('#user_noOfEmployeesInYourCountry').addClass('error');
					$('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').addClass('error');
					$('#user_noOfEmployeesInYourCountry').parents('.ctrlHolder').find('.messageHolder').html("<label class='error'>"+usermanagement.globalVar.exceedGlobalEmpMsg+"</label>");
				}
			}
		}
	});
}
