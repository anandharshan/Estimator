vmf.ns.use("ice.ui");

/* VMF (jQuery) validation plugin is used for filter validation */

ice.ui.validatefilter = function(config) {

    $("#errorpopup").hide();
	$("#modal_hide").click(function() {
		vmf.modal.hide();
	});
	
	/*$.validator.addMethod("adminemail", function(value, element) {
		return ($.validator.methods.email.call(this, value, element) && value != '');
	}, 'Please enter correct email address!');*/
	
	/*
	 * Validate license key
	 */
	$.validator.addMethod("licensekey", function(value, element) {
		if(value != null && value != ''){
			if($.trim(value).length >= config.licenseKeyLength) {
				return true;
			}
			else {
				return false;
			}
		}
		return true;
	}, myvmware.common.buildLocaleMsg(myvmware.globalVars.licenseKeyMustbeMsg,config.licenseKeyLength));

	/*
	 * Validate Notes key
	 */
	$.validator.addMethod("notesKey", function(value, element) {
		if(value != null && value != ''){
			if($.trim(value).length >= config.notesKeyLength) {
				return true;
			}
			else {
				return false;
			}
		}
		return true;
	}, myvmware.globalVars.enterTxt);
	
	/*
	 * Validate date of form YYYY-MM-DD
	 */
	$.validator.addMethod("dateYYYYMMDD", function(value, element) {
		var check = false;
	    var re = /^\d{4}-\d{1,2}-\d{1,2}$/;
        var _trimmedVal = $.trim(value);
	    if( re.test(_trimmedVal)) {
	        var adata = _trimmedVal.split('-');
	        var mm = parseInt(adata[1],10);
	        var dd = parseInt(adata[2],10);
	        var yyyy = parseInt(adata[0],10);
	        var xdata = new Date(yyyy,mm-1,dd);
	        if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
	            check = true;
	        else
	            check = false;
	    }
        else if(_trimmedVal.length == 0) { //Check for empty input //BUG-00025502
            check = true;
        }
		else {
	        check = false;
		}
	    return this.optional(element) || check;
	}, myvmware.globalVars.enterDateFormatMsg);
	
	$.validator.addMethod("ordernumber", function(value, element) {
		return ($.validator.methods.number.call(this, value, element));
	}, myvmware.globalVars.enterANumberMsg);
	
	$.validator.addMethod("contractnumber", function(value, element) {
		return ($.validator.methods.number.call(this, value, element));
	}, myvmware.globalVars.enterANumberMsg);
	
	$("#" + config.filterFormId).bind("invalid-form.validate", function() {
		vmf.modal.show("errorpopup");
	}).validate({
		errorElement: "p",
		errorPlacement: function(error, element) {
			error.appendTo("#error_message");
		},
		rules: {
			licenseKey: "licensekey",
			orderDateFrom: "dateYYYYMMDD",
			orderDateTo: "dateYYYYMMDD",
			contractEndDateFrom: "dateYYYYMMDD",
			contractEndDateTo: "dateYYYYMMDD",
			orderNumber: "ordernumber",
			contractNumber: "contractnumber",
			notesKey: "notesKey"
		},
		onsubmit: false,
		onfocusout: false,
		onkeyup: false
	});
	
};

$('#orderNumber').change(function(){
	$('#orderNumber').keyup(function() {
		if($(this).val() != null && $(this).val() != ''){
			ice.ui.disableContractFields();
		}else{
			ice.ui.enableContractFields();
		} 
	});
});
$('#contractNumber').change(function(){
	$('#contractNumber').keyup(function(){
		if($("#contractNumber").val() != null && $("#contractNumber").val() != ''){
			ice.ui.disableOrderFields();
		}else{
			ice.ui.enableOrderFields();
		}
	});
});
/* BUG-00017015 Start Cause: Disable code for date change had an additional check of 'Keyup' which blocked the disabling to happen when date is inputed from datepicker.
Solution: Removed the 'keyup' condition.*/
$('#orderDateFrom').change(function(){
	//$('#orderDateFrom').keyup(function() {
		if(($("#orderDateFrom").val() != null && $("#orderDateFrom").val() !='') || ($("#orderDateTo").val() != null && $("#orderDateTo").val() !='')){
			ice.ui.disableContractFields();
		}else{
			ice.ui.enableContractFields();
		}
	//});
});
$('#contractEndDateTo').change(function(){
	//$('#contractEndDateTo').keyup(function(){
		if(($("#contractEndDateFrom").val() != null && $("#contractEndDateFrom").val() !='') || ($("#contractEndDateTo").val() != null && $("#contractEndDateTo").val() !='')){
			ice.ui.disableOrderFields();
		}else{
			ice.ui.enableOrderFields();
		}
	//});
});
$('#orderDateTo').change(function(){
	//$('#orderDateTo').keyup(function(){
		if(($("#orderDateFrom").val() != null && $("#orderDateFrom").val() !='') || ($("#orderDateTo").val() != null && $("#orderDateTo").val() !='')){
			ice.ui.disableContractFields();
		}else{
			ice.ui.enableContractFields();
		}
	//});
});
$('#contractEndDateFrom').change(function(){
	//$('#contractEndDateFrom').keyup(function() {
		if(($("#contractEndDateFrom").val() != null && $("#contractEndDateFrom").val() !='') || ($("#contractEndDateTo").val() != null && $("#contractEndDateTo").val() !='')){
			ice.ui.disableOrderFields();
		}else{
			ice.ui.enableOrderFields();
		}
	//});
});
// BUG-00017015 End //

ice.ui.disableOrderFields= function(){
	$("#orderDateFrom").attr('disabled', true);
	$("#orderDateTo").attr('disabled', true);
	$("#orderNumber").attr('disabled', true);
	$('#orderDateFrom, #orderDateTo').next('a').hide();
	
	$("#orderDateFrom, #orderDateTo, #orderNumber").css('background', '#CCCCCC');
};

ice.ui.enableOrderFields= function(){
	$("#orderDateFrom").attr('disabled', false);
	$("#orderDateTo").attr('disabled', false);
	$("#orderNumber").attr('disabled', false);
	$('#orderDateFrom, #orderDateTo').next('a').show();
	$("#orderDateFrom, #orderDateTo, #orderNumber").css('background', '#FFFFFF');
};

ice.ui.disableContractFields = function(){
	$("#contractNumber, #contractEndDateFrom, #contractEndDateTo").attr('disabled', true);
	$("#contractNumber, #contractEndDateFrom, #contractEndDateTo").css('background', '#CCCCCC');
	$('#contractEndDateFrom, #contractEndDateTo').next('a').hide();
};

ice.ui.enableContractFields = function(){
	$("#contractNumber, #contractEndDateFrom, #contractEndDateTo").attr('disabled', false);
	$("#contractNumber, #contractEndDateFrom, #contractEndDateTo").css('background', '#FFFFFF');
	$('#contractEndDateFrom, #contractEndDateTo').next('a').show();
};

ice.ui.validateContractHistoryFilter = function(config) {
    $("#errorpopup").hide();
	$("#modal_hide").click(function() {
		vmf.modal.hide();
	});
	
	$.validator.addMethod("products", function(value, element) {
		if(value != null && value != ''){
			if(value.length >= config.licenseKeyLength) {
				return true;
			}
			else {
				return false;
			}
		}
		return true;
	}, myvmware.common.buildLocaleMsg(myvmware.globalVars.productsMustLen,config.licenseKeyLength));

	/*
	 * Validate date of form YYYY-MM-DD
	 */
	$.validator.addMethod("dateYYYYMMDD", function(value, element) {
		var check = false;
	    var re = /^\d{4}-\d{1,2}-\d{1,2}$/;
	    if( re.test(value)) {
	        var adata = value.split('-');
	        var mm = parseInt(adata[1],10);
	        var dd = parseInt(adata[2],10);
	        var yyyy = parseInt(adata[0],10);
	        var xdata = new Date(yyyy,mm-1,dd);
	        if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
	            check = true;
	        else
	            check = false;
	    }
		else {
	        check = false;
		}
	    return this.optional(element) || check;
	}, myvmware.globalVars.enterDateFormatMsg);
	
	$("#" + config.filterFormId).bind("invalid-form.validate", function() {
		vmf.modal.show("errorpopup");
	}).validate({
		errorElement: "p",
		errorPlacement: function(error, element) {
			error.appendTo("#error_message");
		},
		rules: {
			products: "products",
			expirationDateFrom: "dateYYYYMMDD",
			expirationDateTo: "dateYYYYMMDD"
		},
		onsubmit: false,
		onfocusout: false,
		onkeyup: false
	});
	
};

/*Validation for Support Entitlement Filter*/
ice.ui.validateSupportEntitlementFilter = function(config) {
	
	$.validator.addMethod("contractId", function(value, element) {
		return ($.validator.methods.number.call(this, value, element));
	}, myvmware.globalVars.enterContractIdMsg);

	/*
	 * Validate date of form YYYY-MM-DD
	 */
	$.validator.addMethod("dateYYYYMMDD", function(value, element) {
		var check = false;
		var value = value.split('/').join('-');
	    var re = /^\d{4}-\d{1,2}-\d{1,2}$/;
	    if( re.test(value)) {
	        var adata = value.split('-');
	        var mm = parseInt(adata[1],10);
	        var dd = parseInt(adata[2],10);
	        var yyyy = parseInt(adata[0],10);
	        var xdata = new Date(yyyy,mm-1,dd);
	        if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) )
	            check = true;
	        else
	            check = false;
	    }
		else {
	        check = false;
		}
	    return this.optional(element) || check;
	}, myvmware.globalVars.enterDateFormatMsg);
    
	$("#" + config.formId).validate({
		rules: {
			detailContractId: { "contractId" : true, "maxlength" : 15 },
            detailDateFrom: "dateYYYYMMDD",
            detailDateTo: "dateYYYYMMDD"
		},
        messages: {
            detailContractId: { maxlength: jQuery.format(config.contractIdMaxLen) }
        },
        errorClass: "invalid-input",
        errorElement: "p",
        errorPlacement: function(error, element) {
            error.css({ "color" : "#FF0000", "position" : "absolute", "top" : "52px" ,"width" : element.width() }).appendTo(element.parent());
        },
        onkeyup: false
    });
	
};