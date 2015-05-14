if(typeof(myvmware)=="undefined")myvmware={};

myvmware.shortflowProfile={
	
	init : function() {
		shortflowProfileModal = myvmware.shortflowProfile.modal;
		
		var mdlCfg = shortflowProfileModal.modalConfig; 
		mdlCfg.modalId$ = $(mdlCfg.modalId);
		var mdlCntxt$ = mdlCfg.modalId$;
		mdlCfg.inputElements$ = $(mdlCfg.modalFirstName, mdlCntxt$).add(mdlCfg.modalLastName, mdlCntxt$).add(mdlCfg.modalCountry, mdlCntxt$).add(mdlCfg.modalState, mdlCntxt$).add(mdlCfg.modalAddress, mdlCntxt$).add(mdlCfg.modalCity, mdlCntxt$).add(mdlCfg.modalZip, mdlCntxt$);
		
		mdlCfg.inputElements$.each(function(obj) {
            var t= $(this);
			var m = shortflowProfileModal.map[t.attr('id')];
			if (m && m.type == "text") {
				m.ph = t.attr("placeholder");
			}
        });
		
		shortflowProfileModal.init();	
	},
	
	modal:{// Modal Object for modal popup related code
	
		modalConfig : {
			modalId : "#needmoreinfo",
			modalId$ : "",
			inputElements$ : "",
			
			modalFirstName : "#first_name_prof",
			modalLastName : "#last_name_prof",
			modalCountry : "#country_prof_modal",
			modalState : "#state_prof_modal",
			modalAddress : "#address_prof",
			modalCity : "#city_prof",
			modalZip : "#zip_prof",
			modalContinueButton : "#btn_nmi_continue"
		},
		
		map:{
			"first_name_prof": {"type": "text","ph": "","errCls": "errbox","valid":0},
			"last_name_prof": {"type": "text","ph": "","errCls": "errbox","valid":0},
			"country_prof_modal": {"type": "select","ph": "","errCls": "errbox","valid":0},
			"state_prof_modal": {"type": "select","ph": "","errCls": "errbox","valid":0},
			"address_prof": {"type": "text","ph": "","errCls": "errbox","valid":0},
			"zip_prof": {"type": "text","ph": "","errCls": "errbox","valid":0},
			"city_prof": {"type": "text","ph": "","errCls": "errbox","valid":0}
		},
		
		init:function(){
			vmf.modal.show('needmoreinfo', { 
				checkPosition: true,
				focus: false,
				onShow: function (dialog) {
					$('.genErr').hide();
					// showing pre-populated info in dark font
					shortflowProfileModal.modalConfig.inputElements$.each(function(obj) {
                        var t = $(this),
							m = shortflowProfileModal.map[t.attr('id')];
						if (m.type=="text" && $.trim(t.val()) != "") {
							t.removeAttr('placeholder').removeClass(m.errCls);
						} else if (m.type=="select" && t.find('option:selected').index() != 0) {
							t.removeAttr('placeholder').removeClass('placeholder').removeClass(m.errCls);
						} else if(!$(t).attr('disabled')){
							$(t).addClass(m.errCls)
						}
						
						// fix for browsers not supporting placeholders
						if (!Modernizr.input.placeholder) {
							if (m.type=="text" && $.trim(t.val()) == "") {
								t.val(m.ph);
							}
						}
                    });
					
					$('#btn_nmi_continue').unbind().bind('click',function(){
						var submitForm = false;
						shortflowProfileModal.validate($('#needmoreinfo :input:not(:button)'), true, function() {
							submitForm = shortflowProfileModal.successCallback();
						});
						return submitForm;
					});
					
					shortflowProfileModal.modalConfig.inputElements$.unbind('blur').bind('blur',function(){
						shortflowProfileModal.validate($(this), false);
					});
					
					shortflowProfileModal.modalConfig.inputElements$.unbind('focus').bind('focus',function(){
						var t = $(this),
							m = shortflowProfileModal.map[t.attr('id')];
						if (m.type=="text") {
							t.removeAttr('placeholder').removeClass(m.errCls);
							
							// fix for browsers not supporting placeholders
							if (!Modernizr.input.placeholder) {
								if ($.trim(t.val()) == $.trim(m.ph)) {
									t.val("");
								}
							}
							
						} else if (m.type=="select") {
							t.removeAttr('placeholder').removeClass('placeholder').removeClass(m.errCls);
						}
					});
					
					shortflowProfileModal.modalConfig.modalId$.find(shortflowProfileModal.modalConfig.modalCountry).unbind('change.error').bind('change.error', function(e) {
						var t = $(this),
							m = shortflowProfileModal.map[t.attr('id')];
							state$ = shortflowProfileModal.modalConfig.modalId$.find(shortflowProfileModal.modalConfig.modalState);
						if (!$.trim(state$.val())) {
							state$.addClass('placeholder').removeClass(m.errCls);
						}
                    });
					
					// for state dropdown when prepopulated remove blur
					var state$ = shortflowProfileModal.modalConfig.modalId$.find(shortflowProfileModal.modalConfig.modalState);
					state$.unbind('change.state').bind('change.state', function(e) {
						if ($.trim(state$.val())) {
							state$.removeClass('placeholder');
						}
					});
					
				},
				onClose: function (dialog){										
					//data from vmf, as after redirection controll is not be sent back to vmf.					
					if (window.location.pathname.indexOf("/web/") != -1) {
						window.location = $("#redirectURL").val()+"&otrk=sfprclz"; 
					} else {
						// SiteCatalyst
						if ($("#prgOmnDispName") && $("#prgOmnDispName").val()) {
							sendToOminature( 'group : evals' , $("#prgOmnDispName").val() + ' : notreg : error : profile : exit' );
						}
						vmf.modal.hide();
					}
				}
			});
			
			
			return false;			
		},
		
		successCallback:function() { //Need More Info... Modal popup sucess
			$('#error-message-profile').addClass('hidden');		
			$('#invalid_address_error_modal').hide();
			
			if (!shortflowProfileModal.isAddressValid()) {
				//show error				
				$('#invalid_address_error_modal').show();
				$('#city_prof, #state_prof_modal, #zip_prof').each(function(obj) {
					var t = $(this);
					var m = shortflowProfileModal.map[t.attr('id')];
					if (m && !t.attr("disabled")) {
						t.addClass('errbox').attr("placeholder", m.ph);
					}
				});
				return false;
			}
			
			shortflowProfileModal.submitProfileForm();
			
			return false;		
		},
		
		validate : function(o, fullValidation, cb){
			var flg = 1;
			var t = null;
			var m = null;
			o.each(function(obj){
				t= $(this);
				m = shortflowProfileModal.map[t.attr('id')];
				if (m && !t.attr("disabled")) {
					if( (m.type=="text" && ($.trim(t.val())=="" || (!Modernizr.input.placeholder && $.trim(t.val())==$.trim(m.ph)))) || (m.type=="select" && t.find('option:selected').index() ==0) ){
						placeErr();
						flg=0;
						m.valid =0;
					} else {
						if (m.type=="text") {
								t.removeAttr('placeholder').removeClass(m.errCls);
						} else if (m.type=="select") {
							t.removeAttr('placeholder').removeClass('placeholder').removeClass(m.errCls);
						}
						m.valid =1;
					}
				}
			})
			
			function placeErr(){
				t.addClass('errbox').attr("placeholder", m.ph);
				
				// fix for browsers not supporting placeholders
				if (!Modernizr.input.placeholder) {
					t.val(m.ph);
				}
			}
			
			if(flg && cb){
				$('.genErr').hide();
				if(cb) cb();
			} else if (!flg && fullValidation){
				$('#invalid_address_error_modal').hide();
				$('#generic_error_modal').show();
			}
		},
		
		isAddressValid : function() {
			var isValidAddress = false;
			var country = $("#country_prof_modal").val();
			if (country && country == "US") {			
				var city = $("#city_prof").val();
				var zipCode = $("#zip_prof").val();
				var state = $("#state_prof_modal").val();
				var addressCheckURL = $("#validateUSAddressUrl").val().replace("/web/", "/group/");
				
				$.ajax({
					async : false,
					type: "POST",
					dataType: "json",
					url: addressCheckURL,
					data: {
						city : city,
						zipCode : zipCode,
						state : state,
						country : country
					},
					success: function(object) {
						isValidAddress = object.valid;                        
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						debug("TextStatus=                          :   "+textStatus);
						debug("errorThrown=                         :   "+errorThrown);
						debug("Error XMLHttpRequest Ready State     :   "+XMLHttpRequest.readyState);
						debug("Error XMLHttpRequest status          :   "+XMLHttpRequest.status);
						debug("Error XMLHttpRequest status text     :   "+XMLHttpRequest.statusText);
						isValidAddress = false;  
						
						var errorDiv = $('#error-message-profile');
						errorDiv.html("error-code: AJFA");
        				errorDiv.removeClass('hidden');
						
                }});
			}else{
				isValidAddress = true;
			}
				
			return isValidAddress;
		} ,
		
		submitProfileForm : function() {
			var errorDiv = $('#error-message-profile');
			
			var options = {
    				async : false,
            		success : function(resp){
            			var data = resp.updateStatus;
            			
            			if(data == 'success'){
            				window.location = resp.rurl;
            			}
            			else if(data == 'error'){
            				
            				errorDiv.html(resp.errorMessage);
            				errorDiv.removeClass('hidden');
            			}
            		} 
            };
			errorDiv.addClass('hidden');	
            $('#frmProfileModalId').ajaxSubmit(options);
            return false; // always return false to prevent standard browser submit and page navigation
		}
		
	}// End of Modal Object and Methods ,
		
};

function debug(message){
//    console.log("debug :::: "+message);
}

