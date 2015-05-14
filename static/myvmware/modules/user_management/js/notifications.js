/* ########################################################################### *
/* ***** DOCUMENT INFO  ****************************************************** *
/* ########################################################################### *
 * ##### NAME:  notifications.js
 * ##### VERSION: v0.1
 * ##### UPDATED: 05/27/2011
 /* ########################################################################### */
if (typeof myvmware === "undefined"){	myvmware = {};}
myvmware.notifications = {
	extraSpaces : '&nbsp;&nbsp;&nbsp;',
	chkIds:[],
  	init: function() {
  		vmf.scEvent = true;
		myvmware.notifications.prePopulateReadOnlyView($('#savePatchAlertsInfo, #saveSubscriptionInfo'));
		myvmware.notifications.minimizeAllSections();
		myvmware.notifications.bindEvents();
		myvmware.notifications.communicationTabOminature();
		$('#subscription_vmwareEvents, #subscription_vmwareNewsLetter').click(function(){
			var len = myvmware.notifications.chkIds.length;
			myvmware.notifications.chkIds[len] = $(this)
		});
	},
	
	toggleMinMax : function(element){
		var $fieldset = ($(element).parents('.list-wrapper').length > 0)? $(element).parents('.list-wrapper'): $(element).parents('fieldset');
		if($fieldset.hasClass('closed')) {
			$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').show();
			$fieldset.find('.ctrlHolder').removeAttr('style').removeAttr('STYLE');
			$fieldset.removeClass('closed');
		} else {
			$fieldset.find('.ctrlHolder, h3, .note, .list-hierarchy-wrapper, p, .success-msg').not('.hidden').hide();
			$fieldset.addClass('closed');
		}
		return false;
	},
	fireCancelEvent : function(cancelObj) {
		var $fieldset = cancelObj.parents('fieldset');
		$fieldset.find('.fn_edit, .read-only').removeClass('hidden');
		$fieldset.find('label.error').remove();
		$fieldset.find('.fn_save, .fn_cancel, .error_msg, .warning-msg, .messageDiv, .success-msg').addClass('hidden');  			
		$fieldset.find('input:[type="checkbox"]').attr("disabled",true);
		$fieldset.find('label').css("color","#999999");
		//$('fieldset').find('input:[type="checkbox"]').next('label').css("color","#999999");
		$.each(myvmware.notifications.chkIds, function(){
			($(this).is(':checked'))?$(this).removeAttr('checked'):$(this).attr('checked','checked');
		})
		myvmware.notifications.chkIds.length = 0;
		return false;
	},
	validate : function(){
		$.validator.methods.customRule = function(value, element, param) {return value == param;};
		$('#subscriptionForm').validate({
			errorClass: "error_msg",
			rules : {},	
			messages : {},
			errorPlacement : function(error, element) {},
			submitHandler : function(form){
				vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
				var options = {
					async : false,
					success : function(data){
					myvmware.notifications.processResponse(data, $('#saveSubscriptionInfo'));
					vmf.loading.hide();
					}, // post-submit callback 
					error : function(){
						vmf.loading.hide();
						errorMsgParent = $('#saveSubscriptionInfo').parents('fieldset').find(".messageDiv");
						errorMsgParent.addClass("hidden").children().addClass("hidden");
						errorMsgParent.removeClass("hidden").find("#updateErrorDiv").removeClass("hidden");
					}
				};
				$('#subscriptionForm').ajaxSubmit(options);
				return false; 	
			},
			success : function(element){}
		}); 
		$('#patchAlertsForm').validate({
			errorClass: "error_msg",
			rules : {},	
			messages : {	},
			errorPlacement : function(error, element) {},
			submitHandler : function(form){
				vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true});
				var options = {
					async : false,
					success : function(data){
						myvmware.notifications.processResponse(data, $('#savePatchAlertsInfo'));
						vmf.loading.hide();
					},	// post-submit callback 
					error : function(){
						vmf.loading.hide();
						errorMsgParent = $('#savePatchAlertsInfo').parents('fieldset').find(".messageDiv");
						errorMsgParent.addClass("hidden").children().addClass("hidden");
						errorMsgParent.removeClass("hidden").find("#updateErrorDiv").removeClass("hidden");
					}
				};
				$('#patchAlertsForm').ajaxSubmit(options);
				return false; 	
			},
			success : function(element){}
		});  
	},
	minimizeAllSections: function(){
		var $fieldset = $('fieldset').not('.defaultOpen'), $this, $listWrapper;
		$fieldset.each(function(){
			$this=$(this);
			$listWrapper=$this.find('div.list-wrapper');
			if($listWrapper.length){
				$listWrapper.each(function(){
					myvmware.notifications.toggleMinMax($(this).find('.profile-minimize-button').first());
				});
			}
		});
	},
	bindEvents: function(){
		$('#savePatchAlertsInfo').click(function(){
			myvmware.notifications.chkIds.length = 0;
			$('#patchAlertsForm').submit();
			//oo_beta_managesub.show();
			myvmware.common.ooInvokeLocaleSurvey('managesub');
			var msg_position = $('#patchAlertUpdateMsg').offset();        
            window.scrollTo(msg_position.left,msg_position.top);
			 return false;
		});
		$('#saveSubscriptionInfo').click(function(){
			myvmware.notifications.chkIds.length = 0;
			$('#subscriptionForm').submit();
			//oo_beta_managesub.show();
			myvmware.common.ooInvokeLocaleSurvey('managesub');
			return false;
		});
		$("#unsubcheck:checkbox").click(function(){$("#pid").css("color","#333333");});
		$("#cancelUnsubscribe").click(function(){
			$('#unsubcheck:checkbox').attr('checked', false);
			return false;
		});
		$('#unsubscribeInfo').click(function(){
			if(myvmware.notifications.validateCheckBox()){
				myvmware.notifications.unSubscribeDataAjaxCall();
				$('#unsubcheck:checkbox').attr('checked', true);
				//oo_beta_managesub.show();
				myvmware.common.ooInvokeLocaleSurvey('managesub');
				 var new_position = $('#profile-container').offset();        
                window.scrollTo(new_position.left,new_position.top);
			}else{return false;}
		});
  	  	$('.profile-minimize-button').click(function(){// Open close buttons
  			myvmware.notifications.toggleMinMax(this);  			
  			return false;
  		});
  		$('.fn_edit').click(function(){// Edit-Cancel-Save buttons		
  			var $fieldset = $(this).parents('fieldset');
  			$fieldset.find('.read-only, .fn_edit, .success-msg, .messageDiv, .error-msg, .warning_msg').addClass('hidden');
			$fieldset.find('.fn_save, .fn_cancel').removeClass('hidden');
			$fieldset.find('input:[type="checkbox"]').removeAttr("disabled");
			//$fieldset.find('input:[type="checkbox"]').next('label').css("color","#333333");
			$fieldset.find('label').css("color","#333333");
  			return false;
  		});
  		$('.fn_cancel').click(function(){return myvmware.notifications.fireCancelEvent($(this));});	
	},
	validateCheckBox:function(){
		$checkbox = $('#unsubcheck');
			if(!$checkbox.is(':checked')){
				$("#pid").css("color","red");
				return false;
			}else{return true;}
	},
	prePopulateReadOnlyView: function(formMember){
		var $fieldset = formMember.parents('fieldset'), $fields, $thisObj, chValue;
		$fieldset.find('input:checkbox').attr("disabled",true);
		//$('fieldset').find('input:[type="checkbox"]').next('label').css("color","#999999");
		$fieldset.find('label').css("color","#999999");
	},
	unSubscribeAll: function(){
		var $fieldset = $('fieldset').not('.communicationPrefs'), $this, $fields;
		$fieldset.each(function(){
			$this=$(this);
			$this.find('input:checkbox').not('#unsubcheck').removeAttr('checked').attr("disabled",true);
			myvmware.notifications.enableReadOnlyModeUnsubscribe($this,true);
		});
	},
	toggleSubscribe: function(checkboxObj){
		var fieldObj = $(checkboxObj);	
			//var len = myvmware.notifications.chkIds.length;
			myvmware.notifications.chkIds[myvmware.notifications.chkIds.length] = fieldObj		
		//The below condition will return the "ALL" check boxes belonging to each category
		if(fieldObj.attr('id') == 'AllProductsCheckBox'){
			$('#emptyFieldErrorDiv').addClass('hidden');
			if(fieldObj.is(':checked')){
				$("input[name='"+fieldObj.attr('class')+"']").each(function() {
					if(!$(this).is(':checked')){
							$(this).attr('checked','checked');
							myvmware.notifications.chkIds[myvmware.notifications.chkIds.length] = $(this)	;
					}
				});
			}else{
				$("input[name='"+fieldObj.attr('class')+"']").each(function() {
					if($(this).is(':checked')){
							$(this).removeAttr('checked');
							myvmware.notifications.chkIds[myvmware.notifications.chkIds.length] = $(this)	;
					}
				});
			}
		}else{
			if(fieldObj.is(':checked')){
				$('#emptyFieldErrorDiv').addClass('hidden');			
				if(myvmware.notifications.checkAllProductsSelected(fieldObj)){
					$("input[class='"+fieldObj.attr('name')+"']").each(function() {
						if(!$(this).is(':checked')){
							$(this).attr('checked','checked');
							myvmware.notifications.chkIds[myvmware.notifications.chkIds.length] = $(this)	;
						}
				});					
				}
			}else{
				$("input[class='"+fieldObj.attr('name')+"']").each(function() {
					if($(this).is(':checked')){
							$(this).removeAttr('checked');
							myvmware.notifications.chkIds[myvmware.notifications.chkIds.length] = $(this)	;
					}
				});
			}
		}
	},
	checkAllProductsSelected: function(productObj){
		var queryString = '//input[name=\''+ $(productObj).attr('name') + '\']', $fields = productObj.parents('fieldset').find(queryString), allFieldsSelected = true;
		$fields.each(function(){
			if(!$(this).is(':checked')){
				allFieldsSelected = false;
				return false;
			}
		});
		return allFieldsSelected;
	},
	unSubscribeDataAjaxCall: function(){
		var sucessDiv=$("#updateUnsubscribeSuccessDiv"), errorDiv =$("#updateUnsubscribeErrorDiv");
		$.ajax({
			beofreSubmit : vmf.loading.show({"msg":usermanagement.globalVar.loadingLbl, "overlay":true}),
			type : "POST",
			dataType : "text json",
			url : $("#unSubscribeAjaxURL").val(),
			async : false,
			success : function(data) {
				if(typeof data == 'object' && data.updateStatus == 'success'){
					myvmware.notifications.unSubscribeAll();
					sucessDiv.removeClass('hidden');
					errorDiv.addClass('hidden');
				
				} else {
					sucessDiv.addClass('hidden');
					errorDiv.removeClass('hidden');
				}
				vmf.loading.hide();
			},
			error : function(){vmf.loading.hide();},
			complete : function(){vmf.loading.hide();}
		});
	},
	processResponse: function(data, formSubmitted){
		errorMsgParent = $(formSubmitted).parents('fieldset').find(".messageDiv");
		errorMsgParent.addClass("hidden").children().addClass("hidden");
		if(typeof data == 'object' && data.updateStatus == 'success'){
			$('#unsubcheck:checkbox').attr('checked', false);
			return myvmware.notifications.enableReadOnlyMode(formSubmitted);
		} else {
			errorMsgParent.removeClass("hidden").find("#updateErrorDiv").removeClass("hidden");
		}
	},
	enableReadOnlyMode: function(fieldObj){
		var $fieldset = fieldObj.parents('fieldset'), $fields, $that, chValue;
		$fieldset.find('input:[type="checkbox"]').attr("disabled",true);
		//$fieldset.find('input:[type="checkbox"]').next('label').css("color","#999999");
		$fieldset.find('label').css("color","#999999");
		$("#updateUnsubscribeSuccessDiv, #updateUnsubscribeErrorDiv").addClass('hidden');
		$fieldset.find('.fn_save, .fn_cancel').addClass('hidden');
		$fieldset.find('.messageDiv, .success-msg, .read-only, .fn_edit').removeClass('hidden');
	},
	enableReadOnlyModeUnsubscribe: function(fieldset,onSubscribe){
		fieldset.find('.warning_msg, .success-msg, .error_msg, .messageDiv, .fn_save,.fn_cancel, .NoneSelected').addClass('hidden');
		if(!onSubscribe){fieldset.find('.success-msg').removeClass('hidden');}
		fieldset.find('.read-only, .fn_edit').removeClass('hidden');
	},
	communicationTabOminature: function(){callBack.addsc({'f':'riaLink','args':['subscriptions']});},
	appendDiv: function(passedElement){
		$position = $('#'+passedElement);
		$position.parent().prepend('<div class="preLoading" style="float:left; padding-left:550px;"><div class="loading_small">'+usermanagement.globalVar.loadingLbl+'</div></div>');
	}
};