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
var logoutUrl = "/c/portal/logout";
var profileIsComplete=null;
var inactiveUserURL ='/web/vmware/evalcenter?p_p_id=evalcenter_WAR_itevals&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=inactiveUserCookie&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1';

var countriesForUnSubscription = new Array("AU","AT","AW","BD","BE","BT","BL","BR","CA","KY","CK","CR","HR","CY","CZ","DK","EE","FJ",
                "FI","FR","PF","DE","HU","IE","IT","LV","LT","LU","MT","MH","MU","MC","NL","AN","NC","NZ","NO","PW","PG","PE","PL","PT",
                "RO","RU","ES","SE","CH","TR","GB");
var countriesForSubscription = new Array("US","AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AZ","BS","BH","BB","BY","BZ","BJ",
                "BM","BO","BA","BW","BV","IO","BN","BF","BI","KH","CM","CV","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CI","DJ","DM","DO",
                "EC","EG","SV","GQ","ER","ET","FK","FO","GF","TF","GA","GM","GE","GH","GI","GR","GL","GD","GU","GT","GP","GN","GG","GW","GY","HT",
                "HM","VA","HN","HK","IS","IN","ID","IQ","IM","IL","JM","JP","JE","JO","KZ","KE","KI","KP","KI","KW","KG","LA","LB","LS","LR","LY",
                "LI","MO","MK","MG","MV","MW","MY","ML","MR","MQ","YT","MX","FM","MD","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NI","NE","NG",
                "NU","NK","MP","OM","PK","PS","PA","PY","PH","PN","PR","QA","RE","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN",
                "RS","SC","SL","SG","SK","SI","SB","SO","ZA","GE","LK","SR","SJ","SZ","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TM","TC",
                "TV","UG","AE","UA","UM","UY","UZ","VU","VE","VN","VI","VG","WF","EH","YE","ZM","ZW");


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
var requiredMessage=null;
var validEmailIDMessage=null;
var maxlengthMessage=null;
var preSelState = null;
var loadingDataForDropDown = null;
var selectOne=null;
var modalStateLabel=null;
var emailExists=true;
var firstNameString = null;
var lastNameString=null;
var emailString=null;
var requiredErrorMsg=null;
var addressString=null;
var cityString=null;
var zipString=null;
var firstNameReqError=true;
var lastNameReqError=true;
var emailReqError=true;
var addressReqError=true;
var cityReqError=true;
var zipReqError=true;
var countryReqError=true;
var pwdReqError = true;
var confPwdReqError = true;
var pwdError = true;
var emailError=true;
var confPwdMatchError=true;
var invalidEmailFmtError=true;
var touNotChecked=true;
var confPwdErrorString = null;
var requiredTouErrorMsg=null;
var emailstatus=null;
var redirectUrl=null;
var registerFocus=null;
var loginFocus=null;
var vertexErrorMsg=null;
var isValidAddress=true;
var isMSIEFirstLoad=false;
var firstTimeLoad=true;
var stateReqError=false;

/* Function Block starts */

/**
 * This function is used to bind various events to various different elements.
 * Also used to make any initial ajax calls to be made.
 *
 * @author Kaustubh Basu
 */

if (typeof(myvmware) == "undefined")
    myvmware = {};

myvmware.evals= {

                fieldMap : {},

                setupFieldMap: function() {
                        $('input[type=text][placeholder], input[type=password][placeholder], select[placeholder=""]', '#tab_login > form, #tab_register').each(function() {
                var t = $(this);
                                myvmware.evals.fieldMap[t.attr('id')] = {};
                                myvmware.evals.fieldMap[t.attr('id')]['type'] = t.attr('type');
                                myvmware.evals.fieldMap[t.attr('id')]['ph'] = t.attr('placeholder');
            });
                },

                darkenText: function(obj) {
                        var t = $(obj),
                                m = myvmware.evals.fieldMap[t.attr('id')];
                        t.removeAttr('placeholder');
                        if (!Modernizr.input.placeholder && t.attr('type') == 'text' && $.trim(t.val()) == m.ph) {
                                t.val("");
                        }
                },

                /* This method with watermark if empty. It will watermark in non-placeholder browsers text fields */
                watermarkText: function(obj) {
                        var t = $(obj),
                                m = myvmware.evals.fieldMap[t.attr('id')];
                        if ($.trim(t.val()) == "" || (!Modernizr.input.placeholder && (m.type == 'text' /*|| m.type == 'password'*/) && $.trim(t.val()) == m.ph )) {
                                t.attr('placeholder', m.ph);
                                if (!Modernizr.input.placeholder && m.type == 'text') {
                                        t.val(m.ph);
                                }
                        }
                },

                setupFieldEvents: function() {
                        $('input[type=text][placeholder], input[type=password][placeholder], select[placeholder=""]', '#tab_login > form, #tab_register').bind('focus.placeholder', function() {
                                myvmware.evals.darkenText(this);
                        });

                        $('input[type=text][placeholder], input[type=password][placeholder]', '#tab_login > form, #tab_register').bind('blur.placehoder', function() {
                                myvmware.evals.watermarkText(this);
                        });

                        // darken username when prefilled.
                        var t = $('#username'), m = myvmware.evals.fieldMap[t.attr('id')];
                        if (!($.trim(t.val()) == "" || (!Modernizr.input.placeholder && $.trim(t.val()) == m.ph ))) {
                                t.removeAttr('placeholder');
                        }
                },

                isInputFieldValid: function(obj) {
                        var t = $(obj);
                        if (Modernizr.input.placeholder) {
                                return $.trim(t.val()) != '';
                        } else {
                                var m = myvmware.evals.fieldMap[t.attr('id')];
                                return $.trim(t.val()) != '' && $.trim(t.val()) != $.trim(m.ph);
                        }
                },

                highlightError: function(obj, showErrorStyle) {
                        if (!Modernizr.input.placeholder) {
                                var t = $(obj);
                                        i = t.attr('tabindex');
                                if (showErrorStyle) {
                                        t.removeAttr('tabindex').hide().prev().attr('tabindex', i).attr("class","error_required").show();
                                } else {
                                        t.removeAttr('tabindex').hide().prev().attr('tabindex', i).show();
                                }
                        }
                },

                init: function() {

                        // hot-fix for jp flows
                        $('#state_reg').attr('placeholder', '');

                        myvmware.evals.setupFieldMap();
                        myvmware.evals.setupFieldEvents();

                //var langauge=$('#localeFromLiferayTheme').text();
               	//loadBundles(langauge);
              	//debug("Init Method Called"+langauge);
                
                updateMessage();
                
               // $("input").blur();
                $.validator.methods.customRule = function(value, element, param) {
                    return value == param;
                };

                //check if tab switch needs to be handeled
                screenInitTabSwitch();

                //implement login tab form button click
                $("#alt-button-login").click(function(){
                    debug("before Login button click");
                    $('#altEvalLoginId').submit();
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
                    $('#tab_login').css("display","none");
                    $('#tab_register').css("display","block");
                    //$('#first_name_reg').val(firstNameString);
                    debug('Within click function');
                //$('#eula_link').focus();
                    $('#logontab1').addClass('active');
                    $('#logontab2').removeClass('active');
                });

                $("#logontab2").click(function(){
                    debug("logontab2 clicked");
                    $('#tab_login').css("display","block");
                    $('#tab_register').css("display","none");
                    //$('#forgot_pwd_link').focus();
                    $('#logontab2').addClass('active');
                    $('#logontab1').removeClass('active');
                });

                //key press events for login fields
                $("#username").keyup(function(e) {
                    if(e.keyCode == 13) {
                        //if tab form submit the tab form
                        if($('#altEvalLoginId').length > 0 ) {
                            $("#altEvalLoginId").submit();
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
                        if($('#altEvalLoginId').length > 0 ) {
                            $("#altEvalLoginId").submit();
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


                $("#email_reg").keyup(function(e) {
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

                //For binding country
                $("#Country").change(onCountrySelect);
                //For binding country on Profile Modal.
                        modalStateLabel = $("#state_prof_modal").find('option')[0].innerHTML;
                $("#country_prof_modal").change(onCountrySelectFromProfileModal);

                $("#first_name_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                    //$(this).val(firstNameString);
                                    $(this).attr("class","error_required");
                                    firstNameReqError=true;
                                  }else{
                                          firstNameReqError=false;
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#first_name_reg").focus(function(){
                        //registerFocus='#first_name_reg';
                        if(firstNameReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });


                        /* $("#username").focus(function(){
                        if(firstTimeLoad){
                                firstTimeLoad=false;
                                $('#forgot_pwd_link').focus();
                        }
                }); */

                $("#password").blur(function(){
                        if($.trim($(this).val()) == '') {
                             myvmware.evals.highlightError(this, false);
                                }
                        $(this).attr("class","text");
                });

                $("#last_name_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                    $(this).attr("class","error_required");
                                    lastNameReqError=true;
                                   // $(this).val(lastNameString);
                          }else{
                                  lastNameReqError=false;
                          }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#last_name_reg").focus(function(){
                        //registerFocus ='#last_name_reg';
                        if(lastNameReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });

                $("#email_reg").blur(function(){
                        $('#email_reg_error').html("").hide();
                        if(!/^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test($(this).val())){
                                 $('#email_reg_error').html(validEmailIDMessage).show();
                                 $(this).attr("class","error_required");
                                  invalidEmailFmtError = true;
                                  emailReqError = false;
                         }
                        else if(!myvmware.evals.isInputFieldValid(this)) {
                                        emailReqError=true;
                                    //$(this).val(emailString);
                                    $(this).attr("class","error_required");
                                  }else{
                                                invalidEmailFmtError = false;
                                                emailReqError = false;
                                            debug("<p>Registering Your Creds. Plsssss wait..</p>");
                                            $.ajax({
                                                type: "POST",
                                                dataType: "json",
                                                url: $("#checkEmailAddressAjaxUrl").val(),
                                                data: {emailAddress:$("#email_reg").val(), prgShortName:$("#prgShortName").val()},
                                                success: function(object)
                                                    {
                                                        debug("Inside Success URL being accessed is :"+$("#checkEmailAddressAjaxUrl").val());
                                                        try
                                                        {
                                                            debug("Inside Success Condition");
                                                            emailstatus = object.status;
                                                            redirectUrl = object.redirectURL;
                                                            debug("Inside Success Condition User is :   "+emailstatus);
                                                            if(emailstatus == 'registered'){
                                                                $('#email_reg_error').html(alreadyRegsErrorMessage).show();
                                                                $(this).attr("class","error_required");
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
                        if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                                  $('#email_reg_error').html('').hide();
                          }
                });

                $("#email_reg").focus(function(){
                        //registerFocus ='#email_reg';
                        emailstatus = null;
                        if(emailReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });

                $("#password_reg").blur(function(){
                          if($.trim($(this).val()) == "") {
                                  pwdReqError=true;
                                          myvmware.evals.highlightError(this, true);
                                    $(this).attr("class","error_required");
                                  }else if($(this).val().length < 6 || $(this).val().length > 20){
                                          $(this).attr("class","error_required");
                                          $('#password_reg_error').html(myvmware.evals.buildString(passwordFieldLengthMessage,{text:[6,20]})).show();
                                          pwdReqError=true;
                                  }else{
                                          $('#password_reg_error').html("").hide();
                                          pwdReqError=false;
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#password_reg").focus(function(){
                        //registerFocus ='#password_reg';
                        if(pwdReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });
                $("#confPassword").blur(function(){
                          if($.trim($(this).val()) == "") {
                                  confPwdReqError=true;
                                          myvmware.evals.highlightError(this, true);
                                    $(this).attr("class","error_required");
                                  }else{
                                          confPwdReqError=false;
                                          if($(this).val() != $("#password_reg").val()){
                                                  $(this).attr("class","error_required");
                                                  $('#confPassword_error').html(confPwdErrorString).show();
                                                  confPwdMatchError = true;
                                          }else{
                                                  confPwdMatchError = false;
                                                  $('#confPassword_error').html("").hide();
                                          }
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#confPassword").focus(function(){
                        if(confPwdReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });
                $("#address_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                        addressReqError=true;
                                        //$(this).val(addressString);
                                        $(this).attr("class","error_required");
                                  }else{
                                          addressReqError=false;
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#address_reg").focus(function(){
                        //registerFocus ='#address_reg';
                        if(addressReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });
                $("#city_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                        cityReqError=true;
                                   // $(this).val(cityString);
                                    $(this).attr("class","error_required");
                                  }else{
                                          cityReqError=false;
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#city_reg").focus(function(){
                        //registerFocus ='#city_reg';
                        if(cityReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });
                $("#zip_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                   zipReqError=true;
                                   //$(this).val(zipString)
                                   $(this).attr("class","error_required");
                                  }else{
                                          zipReqError=false;
                                  }
                          if(isMSIEFirstLoad){
                                  $(this).attr("class","text");
                          }
                });

                $("#zip_reg").focus(function(){
                        //registerFocus ='#zip_reg';
                        if(zipReqError){
                                $(this).val("");
                        }
                        $(this).attr("class","text focus");
                });
                $("#Country").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                   countryReqError=true;
                                  // $(this).val(zipString);
                                   $(this).attr("class","error_required");
                                  }else{
                                          countryReqError=false;
                                  }
                });
                $("#state_reg").blur(function(){
                          if(!myvmware.evals.isInputFieldValid(this)) {
                                   stateReqError=true;
                                   $(this).attr("class","error_required");
                                  }else{
                                          stateReqError=false;
                                  }
                });
                $("#state_reg").focus(function(){
                        $(this).attr("class","text focus");
                });
                $("#Country").focus(function(){
                        $(this).attr("class","text focus");
                });

                        $('#touCheckboxID [type=checkbox]').bind('click blur', function(){
                                var t = $(this), checkbox = t.parent(), description = checkbox.siblings('#touDescription');
                                if ($(this).is(":checked")) {
                                        touNotChecked=false;
                                        if (description.hasClass('touErrorDescription') || checkbox.hasClass('touErrorCheckbox')) {
                                                description.attr("class","touDescription");
                                                checkbox.attr("class","touCheckbox");
                                        }
                                } else {
                                        touNotChecked=true;
                                        if (description.hasClass('touDescription') || checkbox.hasClass('touCheckbox')) {
                                                description.attr("class","touErrorDescription");
                                                checkbox.attr("class","touErrorCheckbox");
                                        }
                                }
                        });
            },
	
            validateLoginForm: function(){

                debug("Start Login Tab Form Validation");
                //override email validation for accomodation CN validation
                $.validator.addMethod("emailCN", function(value, element) {
                    var tvalue = jQuery.trim(value);
                    //return this.optional(element) || (/^[0-9]/i.test(value) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value));
                    //return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z.]{2,5}$/i.test(tvalue));
                                return this.optional(element) || (/^[0-9]/i.test(tvalue) || /^[a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+@([a-zA-Z0-9._\-`~!#$%^&*+=?'\/{|}]+\.)+[a-zA-Z0-9._\-]+$/i.test(tvalue));
                }, itevals.globalVar.invalidEmail);

                        $.validator.addMethod("requiredTxtPlaceholderField", function(value, element) {
                                return this.optional(element) || myvmware.evals.isInputFieldValid(element);
                        }, itevals.globalVar.fieldRequired);

                $('#altEvalLoginId').validate(
                    {
                        errorClass: "err",
                                        focusInvalid: false,
                            rules : {
                                'username' : {
                                                                required: true,
                                    requiredTxtPlaceholderField: true,
                                    emailCN: true
                                },
                                'password': {
                                                                required: true,
                                    requiredTxtPlaceholderField : true
                                }
                            },
                            messages : {
                                'username' : {
                                                                required: emailRequiredMessage,
                                    requiredTxtPlaceholderField : emailRequiredMessage,
                                    emailCN : emailValidationMessage
                                },
                                'password': {
                                                                required: passwordRequiredMessage,
                                    requiredTxtPlaceholderField : passwordRequiredMessage
                                }
                            },
                            errorPlacement : function(error, element) {

                                //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                                //BUG-00017577
                                //$("#error-message-login").html("").hide();
                                var elementName = element.attr("id");
                                //alert(elementName);
                                var elementErrorName = "#"+elementName+"_error";
                                var errorDiv = $(elementErrorName);
                                errorDiv.html(error).show();
                                element.removeClass('error-message');
                                element.addClass('text');
                                //BUG-00021531
                                $('#error-message-register').html('');
                                $('#FirstName_Register_Tab_error').html('');
                                $('#LastName_Register_Tab_error').html('');
                                $('#email_reg_error').html('').hide();
                                                        $('#required_error').html('').hide();
                                //$('#password').val('');
                                /* if($("#password").val() == '') {
                                        $("#password_error").html(passwordRequiredMessage);
                                           // $("#password").attr("class","error_required");
                                          }else{
                                                $("#password_error").html('');
                                          } */

                            },
                            onfocusout: function(element){
                                //this.element(element);
                            },
                            success : function(label){
                                /*label.parent().removeClass('error');
                                label.parents('.ctrlHolder').removeClass('error');*/
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
                debug("end validateLoginTabForm");
            },

            // validation for registration Tab
            validateRegistrationForm: function(){

                debug("start validateRegistrationForm");

                $.validator.methods.email = function(value, element) {
                        //return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value);
                                return /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9.]+$/i.test(value);
                }

                $('#evalRegisterTabId').validate(
                    {
                        errorClass: "error-message",
                            rules : {
                                /*'user.emailAddress': {
                                                                email : true,
                                                                minlength : 6,
                                                                maxlength : 100
                                                        }*/
                            },
                            messages : {
                                /*'user.emailAddress': {
                                                                email : validEmailIDMessage,
                                                                minlength : validEmailIDMessage,
                                                                maxlength: $.format(maxlengthMessage)
                                                        } */
                            },
                            errorPlacement : function(error, element) {

                               /* //var errorDiv = element.parents('.ctrlHolder').find('.messageHolder');
                                var elementName = element.attr("id");
                                //alert(elementName);
                                var elementErrorName = "#"+elementName+"_error";
                                var errorDiv = $(elementErrorName);
                                errorDiv.html(error);
                                element.removeClass('error-message');
                                element.addClass('text');
                                //BUG-00021531
                                $('#error-message-login').html('');
                                $('#password_error').html('');
                                $('#username_error').html(''); */

                            },
                            onfocusout: function(element){
                                //this.element(element);
                            },
                            success : function(label){
                                label.parent().removeClass('error');
                                label.parents('.ctrlHolder').removeClass('error');
                            },
                            submitHandler: function(form){
                                submitRegisterForm();
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
                    debug("end validateRegistrationForm");
                },

                redirectToForgotPasswdPage : function(url){

                        var emailAddr = $('#username').val();
                        if( emailAddr!= '' && emailAddr != null){

                                url = url+ "?username="+emailAddr;
                        }
                        NewWindow = window.open(url,"_blank") ;
                        NewWindow.location = url;
                },

             	redirectToNewPage : function(url){

                        NewWindow = window.open(url,"_blank") ;
                        NewWindow.location = url;
                },

                activatePlaceholders: function() {
                        if(!Modernizr.input.placeholder) {
                                isMSIEFirstLoad=true;
                                $('input[type=text][placeholder]', '#tab_login > form, #tab_register').focus(function() {
                                  var input = $(this);
                                  if (input.val() == input.attr('placeholder')) {
                                        input.val('');
                                        input.removeClass('placeholder');
                                  }
                                }).each(function(index, element) {
                      var input = $(this);
                                  if ($.trim(input.val()) == '' || $.trim(input.val()) == $.trim(input.attr('placeholder'))) {
                                        input.val(input.attr('placeholder'));
                                        //input.removeClass('placeholder');
                                  }
                    });;
                                        $('input[type=text][placeholder]', '#tab_login > form, #tab_register').blur(function() {
                                  var input = $(this);
                                  if (input.val() == '' || input.val() == input.attr('placeholder')) {
                                        input.addClass('placeholder');
                                        input.val(input.attr('placeholder'));
                                  }
                                });
                                isMSIEFirstLoad=false;

                                        $('input[type=password][placeholder], input[type=password][placeholder]', '#tab_login > form, #tab_register').each(function(index, element) {
                        var t = $(this),
                                                        m = myvmware.evals.fieldMap[t.attr('id')];
                                                var tph = $($('<input class="text required" type="text" style="display: none;" />').insertBefore(t))
                                                        .attr('tabindex', t.attr('tabindex'))
                                                        .attr('id', t.attr('id') + '_ph')
                                                        .attr('value', m.ph)
                                                        .attr('placeholder', m.ph);
                                                t.removeAttr('tabindex');
                                                t.hide().siblings(tph).show();

                                                tph.bind('focus.placeholder', function() {
                                                        var elem = $(this), i = elem.attr('tabindex');
                                                        elem.removeAttr('tabindex').hide().next().attr('tabindex', i).show().focus();
                                                });
                    });
                                /*$('form').submit(function(){
                                        $this = $(this);
                                        var input = $($this).find('input');
                                        alert(input);

                                                if (input.hasClass('placeholder')) {
                                                        that.value = '';
                                                        alert(input.val());
                                                }

                                });*/
                        }
                },
			     
			     /**
				 *Creates new text with replacing special chars like {0},{1} - indicates for text data and {tag0},{tag1} - indicates for html data. 
				 * 
				 *@param {string} dynamicTxt is the actual text before updating with dynamic data
				 *@param {object} dataObj is the dynamic data object, which includes two keys text and html, these keys contains array of values
				 *@return {string} text udpated with dynamic data
				 */
				buildString:function(dynamicTxt,dataObj ){
					try{
					    var re = /\{(.*?)\}/g;
					    var matches;
					    while ((matches = re.exec(dynamicTxt)) !== null)
					    {
					        var hasHTML = matches[1].split("tag");
					        if(hasHTML.length > 1){
					          dynamicTxt = dynamicTxt.replace(matches[0],dataObj.html[hasHTML[1]])
					        }
					        else{
					          dynamicTxt = dynamicTxt.replace(matches[0],dataObj.text[matches[1]])
					        }
					    }
					}
					catch(e){
					    alert("There is a problem in dynamicTxt or dataObj params, details are...\n\n"+e);
					    return dynamicTxt;
					}
					return dynamicTxt;
				    
				}

};
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

                    if(resultAuto == 'auto'){
                        var programExpriation = $("#prgExpired").val();
                        if(programExpriation == 1){
                                //this program has expired.
                                document.forms['evalRegisterNonTabAutoForm'].submit();
                                return;
                        }

                        checkForProfileCompleteness();

                        if(profileIsComplete == false){
                                handleOnLoadProfileModal();
                                                        myvmware.shortflowProfile.init();
                            return;
                        }
                        //capture omniture :If user is logging in and is registered already, do not send omniture name.
                        captureOmniturForTryFree();
                        registerProductForCustomer(); //Auto Registering the customer for the given product.
                        updateAdditionalQuestionsAndEloquaFields(); //for entering bare minimum data related to eloqua.
                    }

                    resultAuto = null;
                    document.forms['altFrmLogin'].submit();

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
                    $("#error-message-login").html(webgateAuthErrorMessage).show();
                    $('#password').val('');
                }
                else if (deactiveCookie != null && deactiveCookie != ""){
                    debug("obs cookie in failure case");
                    $("#error-message-login").html(deactiveUserMessage).show();
                    $('#password').val('');
                    ajaxLogout(true); //BUG-00037074

                    try
                    {
                         del_cookie("deActivationCookie","/",".vmware.com");

                    }catch(err){
                        debug(err);
                    }
                }
                //BUG-00020781
                else if (obsCookie != null && obsCookie != ""){
                        debug("obs cookie in failure case");
                        ajaxLogout(false); //for deleting the obssocookie
                        inactiveUserCookie();
                        window.location = "/web/vmware/evals/inactiveaccount?sf=true&p="+$("#prgShortName").val();          ;
                }
                else{
                    debug("Problem while processing the request. Please try later.");
                    $("#error-message-login").html(webgateAuthGenericErrorMessage).show();
                }
            }
        });
    }
function debug(message){
    //console.log("debug :::: "+message);
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



function screenInitTabSwitch(){

    debug("START init tab switch method");
    if($('#tabselector').length > 0 && $('#tabselector').val() == 'register'){

        debug("Setting Register tab");
        $('#logontab1').addClass('active');
        $('#logontab2').removeClass('active');

    }

    if($('#tabselector').length > 0 && $('#tabselector').val() == 'login'){

        debug("Setting Logging tab");
        $('#logontab1').removeClass('active');
        $('#logontab2').addClass('active');
        //$('#error-message-login').html('This username is already registered');

    }
    debug("Init Tab Switch Method ENDED ");
}

function updateMessage() {
    //maxlengthMessage=jQuery.i18n.prop("label.common.maxlengthMessage");
    validEmailIDMessage=itevals.globalVar.validEmail;
    //requiredMessage=jQuery.i18n.prop('label.common.requiredMessage');
    emailRequiredMessage=itevals.globalVar.enterEmailOrCN;
    emailValidationMessage=itevals.globalVar.enterEmailOrCN;
    emailFieldLengthMessage=itevals.globalVar.validEmail;
    passwordRequiredMessage=itevals.globalVar.enterPassword;
    passwordFieldLengthMessage=itevals.globalVar.passwordLength; 
    firstNameRequiredMessage=itevals.globalVar.enterFirstName;
    //firstNameFieldLengthMessage=itevals.globalVar.firstNameLenErr;
    lastNameRequiredMessage=itevals.globalVar.enterLastName;
	//lastNameFieldLengthMessage=itevals.globalVar.lastNameLenErr;
    webgateAuthErrorMessage=itevals.globalVar.incorrectUserOrPWD;
    webgateAuthGenericErrorMessage=itevals.globalVar.processError;
    alreadyRegsErrorMessage=itevals.globalVar.emailRegistered;
    freeDomainErrorMessage=itevals.globalVar.enterOtherEmail;
    programUnavailbleMessage=itevals.globalVar.invalidProgram;
    deactiveUserMessage=itevals.globalVar.emailDeactived;
    emailRequiredMessageRegn=itevals.globalVar.enterEmail;
    loadingDataForDropDown=itevals.globalVar.loading;
    selectOne=itevals.globalVar.starState;
    firstNameString=itevals.globalVar.starFirstname;
    lastNameString=itevals.globalVar.starLastname;
    emailString=itevals.globalVar.starEmail;
    requiredErrorMsg=itevals.globalVar.starRequired;
    addressString=itevals.globalVar.starAddress;
    cityString=itevals.globalVar.starCity;
    zipString=itevals.globalVar.starZip;
    confPwdErrorString=itevals.globalVar.passwordError;
    requiredTouErrorMsg=itevals.globalVar.userAgreementError;
    vertexErrorMsg=itevals.globalVar.invalidAddress;
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
//    debug("After deletion: cookie:'authentication':"+getCookie("authentication"));
}

function del_cookie1(name){
    document.cookie = name +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}

function createCookie(name,value) {
        /*if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
        }*/
        document.cookie = name+"="+value+"; path=/";
}

function checkErrorFields(){
        if(firstNameReqError){
                   $('#first_name_reg').attr("class","error_required");
           }
           if(lastNameReqError){
                   $('#last_name_reg').attr("class","error_required");
           }
           if(emailReqError){
                   $('#email_reg').attr("class","error_required");
           }
           if(addressReqError){
                   $('#address_reg').attr("class","error_required");
           }
           if(cityReqError){
                   $('#city_reg').attr("class","error_required");
           }
           if(zipReqError){
                   $('#zip_reg').attr("class","error_required");
           }
           if(pwdReqError){
                   $('#password_reg').attr("class","error_required");
                   if (!Modernizr.input.placeholder) {
                                $('#password_reg').prev().attr("class","error_required");
                   }
           }
           if(countryReqError){
                   $('#Country').attr("class","error_required");
           }
           if(confPwdReqError){
                   $('#confPassword').attr("class","error_required");
                   if (!Modernizr.input.placeholder) {
                                $('#confPassword').prev().attr("class","error_required");
                   }
           }
           if (touNotChecked) {
                        $('#touDescription').attr("class","touErrorDescription");
                        $('#touCheckboxID').attr("class","touErrorCheckbox");
           }
           if(stateReqError){
                   $('#state_reg').attr("class","error_required");
           }
}

/**
 * Check if the country is US or not
 *
 * @param country
 * @returns {Boolean}
 */
function isSelectedCountryUS(country){

        if(country == "US")
                return true;
}
function registerEmail(){
        $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: $("#checkEmailAddressAjaxUrl").val(),
        data: {emailAddress:$("#email_reg").val(), prgShortName:$("#prgShortName").val()},
        success: function(object)
            {
                debug("Inside Success URL being accessed is :"+$("#checkEmailAddressAjaxUrl").val());
                try
                {
                    debug("Inside Success Condition");
                    emailstatus = object.status;
                    redirectUrl = object.redirectURL;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'registered'){
                        $('#email_reg_error').html(alreadyRegsErrorMessage).show();
                        $(this).attr("class","error_required");
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
function submitRegisterForm()  {
        $('#vertex_error').html("").hide();
        $('#required_error').html("").hide();
        $('#tou_required_error').html("");
         if(firstNameReqError || lastNameReqError || emailReqError || addressReqError
                           || cityReqError || zipReqError || pwdReqError || countryReqError || confPwdReqError
                           || confPwdMatchError || invalidEmailFmtError || stateReqError || touNotChecked){
                checkErrorFields();
                   $('#required_error').html(requiredErrorMsg).show();
           }
         else {
                   registerEmail();
                   if(emailstatus == 'programExpired'){
                   window.location = redirectUrl;
               }
                   else if (emailstatus == 'invalid-free-domain'){
                   $('#email_reg_error').html(freeDomainErrorMessage).show();
                   $(this).attr("class","error_required");
               }
                   else if (emailstatus == 'invalid program'){
                   $('#email_reg_error').html(programUnavailbleMessage).show();
                   $(this).attr("class","error_required");
               }
                   else if (emailstatus == 'success'){
                   emailExists=false;

               }
               else {
                   debug(": email status is : "+emailstatus);
               }
                   if(!$('#tou').is(':checked')){
                        $('#required_error').html(requiredErrorMsg).show();
                          // $(this).attr("touCheckbox","touCheckbox.error");
                           //$(this).attr("touDesc","touCheckbox.error");
                        $('#touDescription').attr("class","touErrorDescription");
                                $('#touCheckboxID').attr("class","touErrorCheckbox");
                   }else if(!emailExists){

                           var selCountry = $("#Country").val();
                                if(isSelectedCountryUS(selCountry)){
                                        checkUSAddressValidation();
                                }
                           debug("Vertex validation is ::                         :   "+isValidAddress);
                           //on success US validation;method returns true, hence forth form gets submitted
                           if(!isValidAddress){
                                   debug("Vertex Error message ");
                                   $('#vertex_error').html(vertexErrorMsg).show();
                                   isValidAddress=true;
                                }else{
                                        //captureOmniturForTryFree();
                                        document.forms['frmLoginRegisterTab'].submit();
                                }
                    }
            else{
                $('#error-message-login').html(alreadyRegsErrorMessage).show();
                $('#username').val($('#email_reg').val()).removeAttr('placeholder');;
                $('#tab_login').css("display","block");
                $('#tab_register').css("display","none");
                $('#logontab2').addClass('active');
                $('#logontab1').removeClass('active');

                debug("setting styles start");
                //if there are already validation error in login tab set them to false.
                $('#password_error').html('').hide();
                $('#username_error').html('').hide();
                debug("setting styles end");
            }
                }

   }



/**
 * checks for the current user if there is evalhistory available
 * Used for auto submit of register for user
 * @param rememberMeFlag
 */
function loginRegistrationRedirectionCheck() {

    //var emailIdOrCN = $("#username").val();
    var loginRedirectLangURL = null;
    if($("#langName").val() == 'en'){
        loginRedirectLangURL = loginRedirect;
    }
    else{
        loginRedirectLangURL = "/"+$("#langName").val()+loginRedirect;
    }

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
function registerProductForCustomer(){
        $.ajax({
        type : "POST",
        async: false,
        dataType : "json",
        url : $("#registerProductForCustomerURL").val().replace("/web/", "/group/"),
        data : {
                prgShortName:$("#prgShortName").val()
        },

        success : function(object1) {
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

/*
 * This function is used to check whether for the selected company the state
 * information needs to be populated.
 *
 */
function isStatePopulatableCountry(country) {

        if(country == "KR" && $("#localeFromLiferayTheme").text()=="ko_KR"){ //Korean Locale is special condition. When the locale is Korean, states needs to be displayed
              return true;
        }

        var enableStatesForCountries = new Array("IN", "US", "AU", "CA", "CN", "JP","BR","MX"); // List of countries for which state list needs to be populated

        for ( var i = 0; i < enableStatesForCountries.length; i++) {
                if (enableStatesForCountries[i] == country){
                        return true;
                }
        }
}

function clearOptions(selField) {
        if($(selField).attr("options").length>0){
                $(selField).empty();
        }
}

function onCountrySelect() {

        var selCountry = $("#Country").val();

        debug("Country Value " + selCountry);
        if (isStatePopulatableCountry(selCountry)) {
                stateReqError=true;
                if(preSelState == null){
                        preSelState = $("#state_reg").val();
                }
                clearOptions("#state_reg"); // clearing out the previuos options (if any).
                var options = $("#state_reg").attr("options");
                var option = new Option(loadingDataForDropDown, "");
                options[0]= option;

                $("#state_reg").removeAttr("disabled");
                //$("#stateListStatus").html('Loading data ..');

                $.ajax({
                        type : "POST",
                        dataType : "text json",
                        crossDomain: false,
                        url : $("#stateListURL").val(),
                        data : {
                                paramName : "state",
                                countryCode : selCountry
                        },

                        success : function(object) {
                                try {

                                        var option = new Option(selectOne, "");
                                        options[0]= option;
                                        var lovList = object.states;

                                        $.each(lovList, function(idx, value) {
                                                var option = new Option(value.description,
                                                                value.code);
                                                options[idx+1] = option ;

                                                });

                                        $("#state_reg").val(preSelState);
                                        preSelState = '';

                                } catch (err) {
                                                                //	console.log(err);
                                }
                                $("#stateListStatus").html("");
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                                //				console.log(err);(errorThrown);
                                //				console.log(err);(textStatus);
                        }
                });


        } else { // Resetting values
        $("#state_reg").empty();
        var options = $("#state_reg").attr("options");
        var option = new Option(selectOne, "");
                options[0]= option;
        $("#state_reg").attr("disabled","true");
         stateReqError=false;       //preSelState = '';
         $("#state_reg").attr("class","text");
        }
        var available = validateDefaultSubOrUnsubForCountry(selCountry, countriesForSubscription, true);
        if(!available){
                validateDefaultSubOrUnsubForCountry(selCountry, countriesForUnSubscription, false);
        }

}

function updateAdditionalQuestionsAndEloquaFields(){
        $.ajax({
        type : "POST",
        async: false,
        dataType : "json",
        url :  $("#populateAdditionalQuestionsURL").val().replace("/web/", "/group/"),
        data : {
                prgShortName:$("#prgShortName").val(),
                eloqua:$("#eloquaFields").val()

        },

        success : function(object1) {
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


/*
This function executes when a user clicks on TryFree in Loggedin-Not regsitered state in short flow
*/
    function submitShortLoggedinFlowRegister()  {

    debug("<p>inside loged in flow...continue registration</p>");
    captureOmniturForTryFree();
    $.ajax({
        type: "POST",
        dataType: "json",
        url: $("#checkEmailAddressAjaxFreeDomain").val(),
        data: {emailAddress:$("#emailId").val() , prgShortName:$("#prgShortName").val()},
        success: function(object)
            {

                debug("Inside Success submitShortLoggedinFlowRegister URL being accessed is :"+$("#checkEmailAddressAjaxFreeDomain").val());
                try
                {
                    debug("Inside Success Condition");
                    var emailstatus = object.status;
                    debug("Inside Success Condition User is :   "+emailstatus);
                    if(emailstatus == 'success'){

                        checkForProfileCompleteness();

                        if(profileIsComplete == false){
                                handleOnLoadProfileModal();
                                                        myvmware.shortflowProfile.init();
                            return;
                        }

                        registerProductForCustomer(); //Auto Registering the customer for the given product.
                        updateAdditionalQuestionsAndEloquaFields(); //for entering bare minimum data related to eloqua.
                        document.forms['shortLgdRgstrFlowFrm'].submit();
                        debug("setting styles2");
                    }
                    else if (emailstatus == 'invalid-free-domain'){
                        $('#error-message-register-continue').html(freeDomainErrorMessage);
                        $('#eval-not-registered-msg').hide();
                        $('#button-try-free-register').hide();
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

    function ajaxLogout(async){

        $.ajax({
            type: "POST",
            dataType: "json",
            url: logoutUrl,
            async: async,
            success: function(object)
                {

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

                 /*
    This function executes for US Address Validation.
    */
        function checkUSAddressValidation()  {

            debug("<p>inside checkUSAddressValidation...</p>");
            var city = $("#city_reg").val();
            var zip = $("#zip_reg").val();
            var state = $("#state_reg").val();
            var country = $("#Country").val();

            if(city != "" && zip != "" &&
                        state != "" && country != ""){
            $.ajax({
                async : false,
                type: "POST",
                dataType: "json",
                url: $("#validateUSAddressUrl").val(),
                data: {
                                city : city,
                                zipCode : zip,
                                state : state,
                                country : country

                        },
                success: function(object)
                    {
                        debug("Inside Success checkUSAddressValidation URL being accessed is :"+$("#validateUSAddressUrl").val());
                        try
                        {
                            debug("Inside Success Condition");
                            isValidAddress = object.valid;
                            debug("Inside Success Condition User is :   "+isValidAddress);

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

      }


        function checkForProfileCompleteness(){
                profileIsComplete = null;

                $.ajax({
                type : "POST",
                async: false,
                dataType : "json",
                url : $("#chkUsrProfCompUrl").val().replace("/web/", "/group/"),
                data : {
                },

                success : function(object) {
                        profileIsComplete = object.isUserProfileComplete;
                        if(profileIsComplete==false){

                                var country = object.country;
                                var state = object.state;

                                $("#first_name_prof").val(object.firstName);
                                $("#last_name_prof").val(object.lastName);
                                $("#address_prof").val(object.address);
                                $("#city_prof").val(object.city);
                                $("#country_prof_modal").val(country);
                                $("#zip_prof").val(object.zipcode);

                                if(country != undefined && country!='' && state != undefined && state!='' && state!=null){
                                        onCountrySelectWithStateFromProfileModal(state);
                                }

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


    function onCountrySelectFromProfileModal() {

                var selCountry = $("#country_prof_modal").val();

                debug("Country Value " + selCountry);
                if (isStatePopulatableCountry(selCountry)) {

                        if(preSelState == null){
                                preSelState = $("#state_prof_modal").val();
                        }
                        clearOptions("#state_prof_modal"); // clearing out the previuos options (if any).
                        var options = $("#state_prof_modal").attr("options");
                        var option = new Option(loadingDataForDropDown, "");
                        options[0]= option;

                        $("#state_prof_modal").removeAttr("disabled");
                        //$("#stateListStatus").html('Loading data ..');

                        $.ajax({
                                type : "POST",
                                dataType : "text json",
                                crossDomain: false,
                                url :  $("#stateListURL").val().replace("/web/", "/group/"),
                                data : {
                                        paramName : "state",
                                        countryCode : selCountry
                                },

                                success : function(object) {
                                        try {

                                                var option = new Option(modalStateLabel, "");
                                                options[0]= option;
                                                var lovList = object.states;

                                                $.each(lovList, function(idx, value) {
                                                        var option = new Option(value.description,
                                                                        value.code);
                                                        options[idx+1] = option ;

                                                        });

                                                $("#state_prof_modal").val(preSelState);
                                                        $("#state_prof_modal").addClass("errbox");
                                                preSelState = '';

                                        } catch (err) {
                                                                                //console.log(err);
                                        }
                                        $("#stateListStatus").html("");

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                        //				console.log(err);(errorThrown);
                                        //				console.log(err);(textStatus);
                                }
                        });

                } else { // Resetting values
                $("#state_prof_modal").empty();
                var options = $("#state_prof_modal").attr("options");
                var option = new Option(modalStateLabel, "");
                        options[0]= option;
                $("#state_prof_modal").attr("disabled","true");
                        //preSelState = '';
                }
        }


    function onCountrySelectWithStateFromProfileModal(preSelState) {

                var selCountry = $("#country_prof_modal").val();

                debug("Country Value " + selCountry);

                        clearOptions("#state_prof_modal"); // clearing out the previuos options (if any).
                        var options = $("#state_prof_modal").attr("options");
                        var option = new Option(loadingDataForDropDown, "");
                        options[0]= option;

                        $("#state_prof_modal").removeAttr("disabled");
                        //$("#stateListStatus").html('Loading data ..');

                        $.ajax({
                                type : "POST",
                                dataType : "text json",
                                crossDomain: false,
                                url :  $("#stateListURL").val().replace("/web/", "/group/"),
                                data : {
                                        paramName : "state",
                                        countryCode : selCountry
                                },

                                success : function(object) {
                                        try {

                                                var option = new Option(modalStateLabel, "");
                                                options[0]= option;
                                                var lovList = object.states;

                                                $.each(lovList, function(idx, value) {
                                                        var option = new Option(value.description,
                                                                        value.code);
                                                        options[idx+1] = option ;

                                                        });

                                                $("#state_prof_modal").val(preSelState);
                                                preSelState = '';

                                        } catch (err) {
                                                                        //	console.log(err);
                                        }
                                        $("#stateListStatus").html("");
                                                $("#state_prof_modal").trigger('change.state');
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                        //				console.log(err);(errorThrown);
                                        //				console.log(err);(textStatus);
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

 function inactiveUserCookie() {

        var emailIdOrCN = $("#username").val();

        $.ajax({
        type : "POST",
        async : false,
        dataType : "json",
        url : inactiveUserURL,
        data : {
            username: emailIdOrCN
        },

        success : function(object) {
            debug("cookie created successfully");
        },

        error: function(jqXHR, textStatus, errorThrown) {
            debug("error in inactive user cookie creation");
            debug("TextStatus=                          :   "+textStatus);
            debug("errorThrown=                         :   "+errorThrown);
            debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
            debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
            debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
        }
    });
  }
    /**
     * Method to validate the subscription and unsubscription for a country in registration page.
     *
     */
    function validateDefaultSubOrUnsubForCountry(selCountry, countries,check){

           var flag = false;
                 for ( var m = 0; m < countries.length; m++) {
                   if (countries[m] == selCountry){
                           flag = true;
                                break;
                   }
                 }


          if(flag) {
                          if(check){
                           $('#subscribe').attr('checked',true);
                           return true;
                          } else {
                            $('#subscribe').attr('checked',false);
                            return false;
                          }
          }

          return false;
    }




    /*Omniture Event handler*/
     function captureOmniture(eventName){
        callBack.addsc({'f':'riaLink','args':[eventName]});
    }

     function captureOmniturForTryFree(){
         var pageName = 'web : registration : evals';
         sendToOminature(pageName,$("#prgOmnDispName").val());

     }

     function handleOnLoadProfileModal(){
        var pageName = 'group : evals';
                var omnitureData=$("#prgOmnDispName").val()+' : notreg : error : profile';
                sendToOminature(pageName,omnitureData);
     }


     function del_cookie( name, path, domain )	{
                document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }