if (typeof(myvmware) == "undefined")  	myvmware = {};
VMFModuleLoader.loadModule("tablescroll", function(){});
myvmware.support = {
	validateSupportInit:function(){
		$('select#sdpProduct').change(function(){
			var val = horizonSupportProductName.split(';'), horizon="", oThis = this;
			$.each(val, function(i,v){ 
			  	if($.trim($(oThis).val())==v)
			  		horizon = true;
			});
			if(($.trim($(this).val())).toLowerCase() == $.trim((daasSupportProductName).toLowerCase()) || horizon){
				$('input#additionalSID').closest('div.ctrlHolder').show();
				$('input#additionalSID').keypress(function(event) {
					if (event.charCode!=0) {
						var regex = new RegExp("^[a-zA-Z0-9]+$");
						var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
						if (!regex.test(key)) {
							event.preventDefault();
							return false;
						}
					}
				});
			} else {
				$('input#additionalSID').closest('div.ctrlHolder').hide();
			}
		});
		$("#issueDetails").change(function(){fetchData('issueDetails');})
		fetchData('issueDetails');
		if(vmf.dropdown){//EA selector
			if($('#eaSelector').length){
				vmf.dropdown.build($("#eaSelector"), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right",onSelect:fetchEAOnChange});
				getSDPInstances();
				var issueDetailsElem = $('#issueDetails');	
				if(typeof(issueDetailsElem) != "undefined" && issueDetailsElem != null){
					var issueDetails = issueDetailsElem.val();
					if (issueDetails.indexOf('sdp')<0) {getLevelOneFoldersWithFileSRPermission();} 
				}
				else {getLevelOneFoldersWithFileSRPermission();}
			}
		}
		else{$("#eaSelector").change(function(){fetchEAOnChange();})}
		//End of EA selector
		//START : BUG-00011754:Informational text should appear grey until the user clicks/types into the box
		showSuggestion("issueDescription");
		showSuggestion("additionalComment");
		$(':submit').bind('click',function(e){		
			var url = $('#' + $(e.target).attr('id') + 'URL').val();
			$("#supportRequestForm").attr("action",url);
			myvmware.support.validateSupport();
		});
		$('#issueDetails').change(function() {
			if($("#issueDetails").val()=="sdpIssue6" || $("#issueDetails").val()=="sdpIssue7"){$("div#partnerContact").show();}
			else{$("div#partnerContact").hide();}
			if($("#issueDetails").val()=="sdpIssue8"){$("div#addOnDiv").show();}
			else{$("div#addOnDiv").hide();}
			if($("#issueDetails").val()=="")	{
				var parentDiv = $("#issueDetails").parent().parent('.ctrlHolder');
				parentDiv.addClass('error'); 	
			}						
			$("#licenseKeyForProduct").val('');
			$("#licenseKey").val('');
			$("#emailIdOnOrder").val('');
			$("#emailAddressOfUser").val('');
			$("#orderNumber").val('');
			$("#partnerActivationCode").val('');
			$("#redeemOEM").val('');
			$("#selectProduct").val('');
			$("#productVo.selectedProduct").val('');
			$("#folderManagementAction").val('');
			$("#folderName").val('');
			$("#task").val('');
			$("#selectedProduct").val('');
			$("#selectedInstances").val('');
			$("#sdpProduct").val('');
			$("#sdpOrderNumber").val('');
			$("#cstContact").val('');
			$("#partnerContact").val('');
			$("#addOn").val('');
		});
		
		$('#sdpProduct').change(function() {
			//if($("#issueDetails").val()!="sdpIssue6") {
				getSDPInstances();
			//}	
		});
		
		myvmware.support.validateSupport();
	},//end of init
	/*buildTable:function(tbl){
		vmf.datatable.build(tbl,{
			"bRetrieve":true,
			"bAutoWidth": false,
			"bServerSide": false,
			"sScrollY": '96px',
			"bSort":false,
			"sDom": 't',
			"fnInitComplete": function(){
				this.closest('div.dataTables_scroll').addClass("bottomarea");
				myvmware.support.selectedInstaces($('#svcInstances'),this);
			}
		});
	},*/
	selectedInstaces:function(div,tbl){
		$(div).find('input[type=checkbox]').die('click').live('click',function(){
			var tbdy = $(tbl).find('tbody');
			var chkBoxes = tbdy.find('input[type=checkbox]');
			if($(this).attr('id')=="AllSvcInstances"){
				chkBoxes.attr("checked", $(this).is(':checked'))
			}
			else{
				var l = $(tbl).find('tbody input[type=checkbox]:checked').length;
				$('#svcInstances table input#AllSvcInstances').attr("checked", (l==chkBoxes.length))
			}
		})
	}
};
function fetchData(id1){			
	var issueDetailsElem = document.getElementById(id1);	
	if(typeof(issueDetailsElem) != "undefined" && issueDetailsElem != null){
		var issueDetails = document.getElementById(id1).value;
		if(issueDetails =='issue1'){							
			hideAll();						
			show('issue1');								
			show('folderListDiv');				
		}
		if(issueDetails =='issue2'){
			hideAll();
			show('issue2');
			show('folderListDiv');	
			fetchLicenseTaskList("License_Management_Action");								
		}																
		if(issueDetails =='issue3'){
			hideAll()
			show('issue3');		
			show('folderListDiv');		
		}
		if(issueDetails =='issue4'){
			hideAll();
			show('issue4');
			show('folderListDiv');	
			fetchLicenseFolderManagementActionList("Folder_Management_Action");
		}
		if(issueDetails =='issue5'){
			hideAll();
			show('issue5');
			show('folderListDiv');	
			fetchDropdownBasedOnCode("PRODUCT_ACT");
		}											
		if(issueDetails =='issue6'){
			hideAll()
			show('issue6');		
			show('folderListDiv');	
			fetchDropdownBasedOnCode("REDEEM_OEM");
		}
		if(issueDetails =='issue7'){
			hideAll()
			show('issue7');		
			show('folderListDiv');	
		}
		if(issueDetails =='issue8'|| issueDetails ==''){
			hideAll();			
			show('folderListDiv');	
		}
		if(issueDetails =='issue9'){
			hideAll();			
			show('folderListDiv');	
		}
		if(issueDetails =='issue10'){
			hideAll();			
			show('folderListDiv');		
		}				
		if (issueDetails.indexOf('sdp')>=0){
			hideAll();
			hide('folderListDiv');
			show('sdpIssue');	
			fetchDropdownBasedOnCode("SDP_PRODUCT");
			hide('partnerContact');
			hide('addOnDiv');
			if(issueDetails =='sdpIssue6'||issueDetails =='sdpIssue7'){
			show('partnerContact');}
			if(issueDetails =='sdpIssue8'){
			show('addOnDiv');}
			getSDPInstances();
		}		
		if( issueDetails ==support.globalVars.noneLbl){
				hideAll();
			show('folderListDiv');	
		}
	}			
}
function show(id){$('#'+id).show();}
function hideAll(){
	var ids = new Array('issue1','issue2','issue3','issue4','issue5','issue6','issue7','issue8','sdpIssue');
	var len=ids.length;
	for(i=0;i<len;i++){
		//document.getElementById(ids[i]).style.display='none';
		$("#"+ids[i]).hide();
		if($("#"+ids[i]).children().find('div.error_msg').length > 0){
			$("#"+ids[i]).children().find('div.error_msg').html('');
			$("#"+ids[i]).children().removeClass('error');
		}
	}
} 
function hide(id){
	//document.getElementById(id).style.display='none';
	$("#"+id).hide();
	if($("#"+id).children().find('div.error_msg').length > 0){
		$("#"+id).children().find('div.error_msg').html('');
		$("#"+id).children().removeClass('error');
	}
}
//CR-173 : Changing the country in the Technical SR form, should update the preferred phone number field
function renderCountryCallingCode(){
	var countryCallCode = $("select#country option:selected").attr('countryCallingCode');			
	if(typeof(countryCallCode) == "undefined" || countryCallCode == null || $.trim(countryCallCode).length == 0){
		$("input#preferredPhone").val('');
	} else{
		$("input#preferredPhone").val('+' + countryCallCode);
	}	
}
function checkAdditionalComments(){
	var defaultComments = $("#defaultAdditionalComments").val();
	var userAdditionalComments = $("textarea#additionalComment").val();
	if($.trim(userAdditionalComments).length == 0 || userAdditionalComments == $.trim(defaultComments)){
		$("textarea#additionalComment").val('');
	}									
}
//START for cr-280, PROFILE UPDATION as per NEW Requirement
function populateDropDowns(timeZoneURL){
	var countryCallCode = $("select#country option:selected").attr('countryISOCode');
	if(countryCallCode != '' && countryCallCode != undefined){fetchTimeZone(countryCallCode,timeZoneURL);}
}
function fetchTimeZone (countryName, timeZoneURL){
	$.ajax({
		type : "POST",
		dataType : "json",
		url : timeZoneURL,
		data : {code : countryName},
		success : function(returnData) {
			try 	{populateTimeZone(returnData);} catch (err) {}
		}
	});
}
function populateTimeZone(values){
	try {
		var timeZoneList = values.timezonelist;
		$('#time_zone option').remove(); 
		$('#time_zone').append('<option value="">'+support.globalVars.selectOneLbl+'</option>');
		//As per the defect 00024655  there is no need to default to profile timezone
		for ( var i = 0; i < timeZoneList.length; i++) {
			$('#time_zone').append('<option value="'+timeZoneList[i]+'">'+timeZoneList[i]+'</option>');
		}
	} catch (err) {}
}
function fetchStateList (stateListUrl){
	var countryName = $("select#country option:selected").attr('countryISOCode'); 
	if(isStateRequiredForCountry(countryName)){	
		$('#stateDIV').removeClass('hidden');
		var profileCountry = $("#profileCountryOfUser").val()
		if(countryName != '' && (profileCountry == undefined || profileCountry == '')){
			$.ajax({
				type : "POST",
				dataType : "json",
				url : stateListUrl,
				data : {code : countryName},
				success : function(returnData) {
					try {populateStateList(returnData);} catch (err) {}
				}
			});
		}
	}else{$('#stateDIV').addClass('hidden');}
}
function populateStateList(values){
	try {
		var stateList = values.stateList;
		$('#state option').remove(); 
		$('#state').append('<option value="">' + support.globalVars.selectOneLbl +'</option>');
		if(stateList.length > 0){
			$('#stateDIV').removeClass('hidden');
			for ( var i = 0; i < stateList.length; i++) 	{
				$('#state').append('<option value="'+stateList[i].code+'">'+stateList[i].description+'</option>');
			}
		}else{$('#stateDIV').addClass('hidden');}
	} catch (err) {}
}		
function validateAddress(validateURL){
	var country = $("select#country option:selected").attr('countryISOCode');
	if(country == "US"){
		var errMsg = checkIfAddressIsValid(false,validateURL);
		if(errMsg != ""){	
			return false;
		}else{		
			$("#user_zipcode_error").html('');
			return true;
		}
	}
	else {return true;}
};
function checkIfAddressIsValid(async,validateURL){
	var selCountry = $("#country").val();									
	var city = $.trim($("#city").val());
	var zipCode = $.trim($("#zipcode").val());
	var state = $("#state").val();
	var errMsg = false; 
	if(city != "" && zipCode != "" &&	state != "" && selCountry != ""){ 
		$.ajax({
			async : async,
			type : "POST",
			dataType : "text json",
			crossDomain: false,
			url : validateURL,
			data : {city : city,zipCode : zipCode,	state : state,country : selCountry}, 
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
var enableStatesForCountries = new Array("IN","US","AU","CA","CN","JP","BR","MX");
function isStateRequiredForCountry(country) {				
	for(var i=0;i< enableStatesForCountries.length;i++){
		if(enableStatesForCountries[i] == country)
		return true;
	}
}		
//END for cr-280, PROFILE UPDATION as per NEW Requirement
myvmware.support.addScroll=false;
myvmware.support.validateSupport = function(){
	if($("#tbl_instances").length && $("#tbl_instances").is(":visible") && $("#tbl_instances").find("tbody tr").length>0 && !myvmware.support.addScroll){
		($("#tbl_instances tbody tr").length > 3) ? vmf.tablescroll.init('tbl_instances',{height:96, width:554}) : '';
		$.each($("#tbl_instances tbody tr"),function(i,v){
			var val = $(v).find("td:eq(0)").html();
			if (val.indexOf("<span class=\"wbr\"></span>)" == -1)) $(v).find("td:eq(0)").html(vmf.wordwrap(val,2));
		});
		myvmware.support.addScroll=true;
	}
	$.validator.methods.customRule = function(value, element, param){return value == param;	};
	$.validator.addMethod("alphaNumeric", function(value, element) { 
		return this.optional(element) || /^[\w ]+$/i.test(value); }, support.globalVars.onlyNumbers); 
	$.validator.addMethod("phoneNumber", function(value, element) {         
		return this.optional(element) || /^[0-9\-\+\(\). ]+$/i.test(value);}, support.globalVars.numbersNOther);
	$.validator.addMethod("notEqual", function(value, element, param) {
		if(value != '' && value != null){
			return value.toLowerCase() != $(param).val().toLowerCase();
		}
		else {return value != $(param).val();}
	}, support.globalVars.requiredLbl);
	//Added for CR-280 related start
	$.validator.addMethod("validateUSAddress", function(value, element) {
		return validateAddress($("#validateUSAddressURL").val());
	}, support.globalVars.invalidCityMsg);
	$.validator.addMethod("alphaNumericzip", function(value, element) { 
		return this.optional(element) || /^[a-zA-Z0-9\-\/\s]+$/i.test(value); 
	}, support.globalVars.enterOnlyNumsMsg);
	//Added for CR-280 related end
	$.validator.addMethod("secondaryEmail", function(value, element) { 
		var emailAddresses = $.trim(value);
		if(emailAddresses.length == 0){return true;}
		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;	
		var arrayOfEmails = emailAddresses.split(',');
		var noErrors = false;
		var email = '';
		$.each(arrayOfEmails, function(i, obj){
			email = $.trim(obj);
			if(email.length == 0){
				noErrors = false;
				return false; 
			}
			if (emailRegex.test(email)) {
				noErrors = true;
				return;
			}else{
				noErrors = false;
				return false; 
			}
		});										
		if(noErrors == true){return true;}else{return false;}
	},support.globalVars.invalidFormatLbl);
	$('#supportRequestForm').validate({			
		//vmf.scEvent = true;
		submitHandler: function() {
			$("#fileSR_Attachment").removeClass("primary").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#fileSR_SendRequest").removeClass("primary").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#fileSR_Cancel").addClass("disabled").css("cursor","default").attr("disabled",true);
			$("#fileSR_Cancel").attr("href","javascript:void(0);");
			checkAdditionalComments();
			//riaLink('file_SR');												
			document.forms['supportRequestForm'].submit(); 
		},
		errorClass: "error",
		rules :{
			'licenseOEMProduct' : {required : true},
			'issueDetailsVo.severity' : {required : true},
			'issueDetailsVo.severityHighest':{
				required : {
					depends: function(element){
						var severity=$("#selectedSeverity").val();
						var is24x7Entl = $("#isEntitlementFor24x7Availability").val();
						if(severity =='1 - Critical' && is24x7Entl != null && is24x7Entl != "" && (is24x7Entl == true || is24x7Entl == 'true')){	return true;}
						else{return false;}
					}
				}
			},
			'issueDetailsVo.technicalProblemCategory' : {required : true},
			'contactUpdateVo.secondaryEmail' : {secondaryEmail : true},
			'contactUpdateVo.country' : {required : true},
			'issueDetailsVo.problemDescription' :{required : true,maxlength : 4000,notEqual : '#issueDescriptionText'},
			'issueType':{required : true},
			'issueDetails' :{required : true},
			'issueDetailsVo.liceseProblemCategory' :{required : true},
			'problemDescription' :{required :true,maxlength : 4000,notEqual : '#issueDescriptionText'},
			'cstContact':{required :false,maxlength : 100,notEqual : '#issueDescriptionText'},
			'issueDetailsVo.customerProblemCategory' :{required :true},
			'issueDetailsVo.additionalComment' :{maxlength : 4000},
			'userProfileVo.preferrefContactNumber' :{required : true},
			'emailIdToModify' :{email : true},
			'contactUpdateVo.thirdPartyTrackingNumber' :{alphaNumeric : true},
			'contactUpdateVo.pagerNumber' :{alphaNumeric : true},
			'contactUpdateVo.preferrefContactNumber' :{required : true,phoneNumber : true},
			'contactUpdateVo.preferredEmailAddress' :{email : true},
			// code changes as part of BUG-00079881
			'contactUpdateVo.alternativeContactInfo' : {maxlength:255},
			'licenseKey':{
				required : {
					depends: function(element){
						var issueselected=$("#issueDetails").val();
						if(issueselected =='issue2'){return true;}
						else{return false;}
					}
				},
				maxlength : 29
			},
			'task':{
				required : {
					depends: function(element){
						var issueselected1=$("#issueDetails").val();
						if(issueselected1 =='issue2'){return true;}
						else{return false;}
					}
				}
			},
			'emailAddressOfUser':{
				required : {
					depends: function(element){
						var issueselected2=$("#issueDetails").val();
						if(issueselected2 =='issue3'){return true;}
						else{return false;}
					}
				},
				email : true
			},
			'folderName':{
				required : {
					depends: function(element){
						var issueselected3=$("#issueDetails").val();
						if(issueselected3 =='issue4'){return true;}
						else{return false;}
					}
				}
			},
			'folderManagementAction':{
				required : {
					depends: function(element){
						var issueselected4=$("#issueDetails").val();
						if(issueselected4 =='issue4'){return true}
						else{return false;}
					}
				}
			},
			//CHanges for CR-280 of Profile updation from TSR form START
			'contactUpdateVo.address1' :{required : true,maxlength : 200},
			'contactUpdateVo.address2' :{maxlength : 100},
			'contactUpdateVo.city' :{required : true,maxlength : 100},
			'contactUpdateVo.zipcode' :{required : true,maxlength : 50,alphaNumericzip : true,validateUSAddress : true},
			'contactUpdateVo.state' :{
				required : {
					depends: function(element){
						return isStateRequiredForCountry($("select#country option:selected").attr('countryISOCode'));
					}
				}
			},
			'contactUpdateVo.timeZone' :{required : true},
			//CHanges for CR-280 of Profile updation from TSR form END
			// CR-00010093 start
			'licenseKeyForProduct':{
				required : {
					depends: function(element){
						var issueselected5=$("#issueDetails").val();
						if(issueselected5 =='issue5'){return true;}
						else{return false;}
					}
				}
			},
			'productVo.selectedProduct':{
				required : {
					depends: function(element){
						var issueselected6=$("#issueDetails").val();
						if(issueselected6 =='issue5'){return true;}
						else{return false;}
					}
				}
			},													
			'selectedOem':{
				required : {
					depends: function(element){
						var issueselected8=$("#issueDetails").val();
						if(issueselected8 =='issue6'){return true;}
						else{return false;}
					}
				}
			},
			'selectedProduct':{
				required : {
					depends: function(element){
						var issueselected9=$("#issueDetails").val();
						if(issueselected9 != null && issueselected9.indexOf('sdp')>=0){return true;}
						else{return false;}
					}
				}
			}
		},
		messages : {
			'issueDetailsVo.technicalProblemCategory' :{required: support.globalVars.requiredLbl},
			'contactUpdateVo.secondaryEmail' : {email : support.globalVars.invalidFormatLbl},
			'issueDetailsVo.problemDescription' :{required : support.globalVars.requiredLbl,maxlength : support.globalVars.exceedMaxMsg},
			'problemDescription' :{required : support.globalVars.requiredLbl},
			'issueDetailsVo.liceseProblemCategory' :{required : support.globalVars.requiredLbl},
			'issueDetailsVo.customerProblemCategory' :{required : support.globalVars.requiredLbl},
			'issueDetailsVo.severity' :{required :support.globalVars.requiredLbl},
			'issueDetails' :{required:support.globalVars.requiredLbl},
			'issueType':{required :support.globalVars.requiredLbl},
			'userProfileVo.preferrefContactNumber' :{required : support.globalVars.requiredLbl},
			'emailIdToModify' :{email :support.globalVars.invalidFormatLbl},
			'contactUpdateVo.preferrefContactNumber' :{required : support.globalVars.requiredLbl},
			'contactUpdateVo.country' : {required : support.globalVars.requiredLbl},
			'issueDetailsVo.severityHighest':{required: support.globalVars.confirm24x7Msg},
			'contactUpdateVo.preferredEmailAddress':{email:support.globalVars.invalidFormatLbl},
			'issueDetailsVo.additionalComment' :{maxlength : support.globalVars.exceedMaxMsg},
			'licenseKey' :{required: support.globalVars.requiredLbl,maxlength : support.globalVars.exceedMaxMsg},
			'task' :{required: support.globalVars.requiredLbl},
			'emailAddressOfUser' :{required: support.globalVars.requiredLbl, email: support.globalVars.invalidFormatLbl},
			'folderName' :{required: support.globalVars.requiredLbl},
			'folderManagementAction':{required:support.globalVars.requiredLbl},
			'licenseOEMProduct' : {required : support.globalVars.requiredLbl},
			//CHanges for CR-280 of Profile updation from TSR form START
			'contactUpdateVo.address1' :{required : support.globalVars.requiredLbl,maxlength : $.format(support.globalVars.noMoreThanMsg)},
			'contactUpdateVo.address2' :{maxlength : $.format(support.globalVars.noMoreThanMsg)},
			'contactUpdateVo.city' :{required : support.globalVars.requiredLbl,maxlength : $.format(support.globalVars.noMoreThanMsg)},
			'contactUpdateVo.zipcode' :{required : support.globalVars.requiredLbl,maxlength : $.format(support.globalVars.noMoreThanMsg),
				alphaNumericzip : support.globalVars.enterOnlyNumsMsg,
				validateUSAddress : support.globalVars.invalidCityMsg
			},
			'contactUpdateVo.state' :{required : support.globalVars.requiredLbl},
			//time zone made as reuired for enhancement BUG-00031528
			'contactUpdateVo.timeZone' : {required : support.globalVars.requiredLbl},
			//CHanges for CR-280 of Profile updation from TSR form END
			//CR-00010093
			'licenseKeyForProduct':	{required : support.globalVars.requiredLbl},
			'productVo.selectedProduct':{required : support.globalVars.requiredLbl},
			'selectedOem':{required : support.globalVars.requiredLbl},
			'selectedProduct':{required : support.globalVars.requiredLbl}														
		},
		errorPlacement : function(error, element) {
			var parentDiv = element.parent().parent('.ctrlHolder');
			var errorDiv = parentDiv.find('.error_msg');
			errorDiv.html(error);
			errorDiv.removeClass('hidden'); 
			parentDiv.addClass('error');
		},
		onfocusout: function(element){
			if($("#user_zipcode_error").text().length > 30 && element.id=='zipcode'){
				$("#user_zipcode_error").parent().removeClass('error');											
			}else{
				this.element(element);
			}
		},
		success:function(element){
			var parentDiv = element.parent().parent('.ctrlHolder');
			parentDiv.removeClass('error');
		}
	});

//        //  To show info box on support general inquiry
//        var enquiryValue = $.trim($('#custCareDropdown option:selected').val());
//        if (enquiryValue == "Communities" || enquiryValue == "Product Information" || enquiryValue == "Sales" || enquiryValue == "Website Feedback") {
//            $('section.step1').addClass('deadEndInfo');
//        }
//        $('.closeIcon').click(function(){
//           $('.step1').hide();
//        });
}
/*from jsp*/
function fetchDropdownBasedOnCode(param) {			
	$.ajax({
		type : "POST",
		dataType : "json",
		//url : '${getForm}',
		url : getForm,
		data : {code:param},
		success : function(returnData) {
			try {
				if(param=="FORM")
				populateFormDropdown("formType",returnData.dropdownValues);
				if(param=="MODIFY_ADMINISTRATOR"){
					populateFormDropdown("adminType",returnData.dropdownValues);
				}
				if(param=="PRODUCT_ACT"){
					populateFormDropdown("selectProduct",returnData.dropdownValues);
				}
				if(param=="REPLACEMENT_OEM"){
					populateFormDropdown("replcementOEM",returnData.dropdownValues);
				}
				if(param=="REDEEM_OEM"){							
					populateFormDropdown("redeemOEM",returnData.dropdownValues);
				}
				if(param=="SDP_PRODUCT"){							
					populateFormDropdown("sdpProduct",returnData.dropdownValues);
				}

			} catch (err) {
				alert(err);
			}
		}
	});
}
function fetchDropdownBasedOnCodeAndExtrnId(code,extrnId) {
	$.ajax({
		type : "POST",
		dataType : "json",
		//url : '${getAdmin}',
		url:getAdmin,
		data : { code: code,extrnId:extrnId},
		success : function(returnData) {
			try {
				populateFormDropdown("adminTypeToModify",returnData.admins);

			} catch (err) {
				console.log(err);
			}
		}
	});
}
function fetchLicenseTaskList(param) {
	$.ajax({
		type : "POST",
		dataType : "json",
		url:getTaskList,
		data : {code:param},
		success : function(returnData) {
			try {
				populateFormDropdown("task", returnData.dropdownValues);

			} catch (err) {
				console.log(err);
			}
		}
	});
}
function fetchLicenseFolderManagementActionList(param) {
	$.ajax({
		type : "POST",
		dataType : "json",
		url : getActionList ,
		data : {code:param},
		success : function(returnData) {
			try {
				populateFormDropdown("folderManagementAction", returnData.dropdownValues);
			} catch (err) {
				console.log(err);
			}
		}
	});
}
function populateFormDropdown(id,formList){
	try {
		var theOptions = document.getElementById(id);
		var option;
		theOptions[0] = new Option(support.globalVars.selectOneLbl, "");
		for ( var i = 0; i < formList.length; i++) {
			option = new Option(formList[i], formList[i]);
			theOptions[i + 1] = option;
		}
	} catch (err) {}
}
function fetchEAOnChange(){
	getSDPInstances();
	var issueDetailsElem = document.getElementById('issueDetails');	
	if(typeof(issueDetailsElem) != "undefined" && issueDetailsElem != null){
		var issueDetails = issueDetailsElem.value;
		if (issueDetails.indexOf('sdp')<0) {getLevelOneFoldersWithFileSRPermission();} 
	}
	else {getLevelOneFoldersWithFileSRPermission();}
}
//SDP - Start
function selectAllInstances(status){
	$("#svcInstances input").each( function() {
		$(this).attr("checked", status);
	})
}


function getSDPInstances() {
	var eaSelected, productSelected, customerCn, getSdpInstancesUrl, dSettings, tableLen = $("#tbl_instances_chk").children().length;
	eaSelected = ("#eaSelector") ? $("select#eaSelector option:selected").val() : '';
	productSelected = ($("#sdpProduct option").length > 0) ? $("select#sdpProduct option:selected").val() : '';
	customerCn = ($("#customerNumVar").val() != '') ? $("#customerNumVar").val() : '';
	getSdpInstancesUrl = ($("#getSDPInstances").val() != '') ? $("#getSDPInstances").val() : '';
	var val = horizonSupportProductName.split(';'), horizon="", oThis = this;
	$.each(val, function(i,v){ 
	  	if(productSelected==v)
	  		horizon = true;
	});
	if(eaSelected != '' && eaSelected != null && productSelected != '' && !horizon) {
		$('#svcInstances').closest('div.ctrlHolder').show();
		if(tableLen >0) {
			vmf.datatable.reload($('#tbl_instances_chk'),getSdpInstancesUrl,function(){},"POST",{ "entitlementAccountNumber": eaSelected, "customerNumber": customerCn, "productName": productSelected });
		} else {
			vmf.datatable.build($('#tbl_instances_chk'),{
				"bFilter": false,
				"bSort": false,
				"bInfo": false,
				"bAutoWidth": true,
				"bPaginate": false,
				"sScrollY": "96px",
				"bProcessing": true,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"sAjaxSource": getSdpInstancesUrl+'?entitlementAccountNumber='+eaSelected+'&customerNumber='+customerCn+'&productName='+productSelected,
				"aoColumns": [
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'/>","sWidth":"20px"},
					{"sTitle": "<span>"+support.globalVars.serviceNameLbl+"</span>","sWidth":"80px"},
					{"sTitle": "<span>"+support.globalVars.serviceIdLbl+"</span>","sWidth":"80px"},
					{"sTitle": "<span>"+support.globalVars.Region+"</span>","sWidth":"120px"}
				],
				"oLanguage": {
					"sProcessing" : support.globalVars.loadingMsg,
					"sZeroRecords": support.globalVars.noServicesMsg
				},
				"fnInitComplete": function(){
					var sri = this,rowsLength,rowHeight;
					myvmware.common.selectAllChks(sri, '');
					rowsLength = $(sri).find("tbody tr").length;
					if(rowsLength<4){
						rowHeight = $($(sri).find("tbody tr")[0]).outerHeight(true);
						$(sri).closest(".dataTables_scrollBody").css("height",rowsLength*rowHeight + "px");
					} else {
						$(sri).closest(".dataTables_scrollBody").css("height","96px");
					}
				},
				"fnRowCallback": function(nRow, aData) {
					var $nRow=$(nRow);
					$nRow.find("td:eq(0)").html('<input type="checkbox" name="selectedInstances" value="'+aData[2]+':'+aData[1]+':'+aData[3]+'" />');
					return nRow;
				}
				// "fnServerParams": function ( aoData ) {
					// aoData.push( { "entitlementAccountNumber": eaSelected, "customerNumber": customerCn, "productName": productSelected } );
				// }
			});
		}
	} else {
		$('#svcInstances').closest('div.ctrlHolder').hide();
	}
		
		
		
		
		
		
		
		
		// $.ajax({
			// type: "POST",
			// dataType: "Json",
			// url: getSdpInstancesUrl,
			// data: {
				// entitlementAccountNumber: eaSelected,
                // customerNumber: customerCn,
                // productName: productSelected
			// },
			// success: function(returnData) {
				// var data = [], aData = [], returnIns = returnData.svcInstances;
				// if(returnIns != null){
					// for(var i = 0; i < returnIns.length; i++) {
						// aData = [" ", returnIns[i].instanceName, returnIns[i].instanceID];
						// data.push(aData);
					// }
				// }
				// $('#svcInstances').show();
				// populateData(table, dTable, data);
			// },
			// error: function(){
				// alert('Server not responding');
			// }
		// });
	// } else {
		// $('#svcInstances').hide();
	// }
}
/*
function populateData(table, a, data){
	if(a.length == 1) {
		table = table.dataTable();
		oSettings = table.fnSettings();
		table.fnClearTable();
		for (var i=0; i<data.length; i++){
			table.oApi._fnAddData(oSettings, data[i]);
		}
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		table.fnDraw();
		table.oApi._fnInitComplete(oSettings, data[i]);	
		table.oApi._fnProcessingDisplay( oSettings, false );
	} else {
		vmf.datatable.build($('#tbl_instances_chk'),{
			"bFilter": false,
			"bSort": false,
			"bInfo": false,
			"bAutoWidth": true,
			"bPaginate": false,
			"sScrollY": "96px",
			"bProcessing": true,
			"sDom": 'rt<"bottom"lpi<"clear">>',
			"aaData": data,
			"aoColumns": [
				{"sTitle": "<input type='checkbox' class='tbl_selectAll'/>","sWidth":"20px"},
				{"sTitle": "<span class='descending'>Instance Name</span>","sWidth":"200px"},
				{"sTitle": "<span class='descending'>Instance ID</span>","sWidth":"180px"}
			],
			"oLanguage": {
				"sProcessing" : "Loading...",
				"sZeroRecords": "No Services to display"
			},
			"fnInitComplete": function(){
				var sri = this;
				if(!$(sri).find('tfoot').length)
				$(sri).append('<tfoot><tr><td class="bottomarea" colspan="3"></td></tr></tfoot>');
				myvmware.common.selectAllChks(sri, '');
			},
			"fnRowCallback": function(nRow, aData) {
				var $nRow=$(nRow);
				$nRow.find("td:eq(0)").html('<input type="checkbox" value="'+aData[2]+':'+aData[1]+'" />');
				return nRow;
			}
		});
	}
};

/* This function replaced with populateData() - Jayaraman Thiyyadi
function populateSDPInstances(returnData) {
    var instanceListVar = returnData.svcInstances;
    $('#svcInstances table').hide().find('tbody').html('');
    if (instanceListVar.length > 0) {
        var instancesHtml = '';
        for (var j = 0; j < instanceListVar.length; j++) {
            instancesHtml += '<tr><td><input type="checkbox" id="selectedInstances" name="selectedInstances" value ="' + instanceListVar[j].instanceID + ':' + instanceListVar[j].instanceName + '"></td><td>' + instanceListVar[j].instanceName + '</td><td>' + instanceListVar[j].instanceID + '</td></tr>';
        }
        $('#svcInstances table').show().find('tbody').html(instancesHtml);
        myvmware.support.buildTable($('#tbl_instances_chk'))
    };
};
*/

//SDP - End
//VSUS
function getLevelOneFoldersWithFileSRPermission() {
	var eaSelected = '';
	if("#eaSelector"){eaSelected = $("select#eaSelector option:selected").val();}
	var customerCN = $("#customerNumVar").val();
	var productID = $("#supportProductIDVar").val();
	if(productID == "null"){productID="";}
	var getLevelOneFoldersWithFileSRPermissionURL = $("#getLevelOneFoldersWithFileSRPermission").val();
	if(eaSelected != support.globalVars.noneLbl && eaSelected != ''){
		$('#folderListFileSR').html('');
		$('#folderListFileSR').html('').attr('disabled','true');
		$('#folderListFileSR').append('<option value="" selected=selected>'+support.globalVars.loadingMsg+'</option>')
		$.ajax({
			type : "POST",
			dataType : "json",
			url : getLevelOneFoldersWithFileSRPermissionURL,
			data : {
				entitlementAccountNumber : eaSelected,
				customerNumber : customerCN,
				productID	:	productID						
			},
			success : function(returnData) {
				$('#folderListFileSR').html('').attr('disabled','').removeClass('folderListFileSR');
				populateFolderList(returnData);			
				$('#folderListFileSR').siblings('div.inputHolderClass').remove();
				vmf.dropdown.build($('#folderListFileSR'), {optionsDisplayNum:20,ellipsisSelectText:false,ellipsisText:'',optionMaxLength:62,inputMaxLength:37,position:"right"}); 
			},
			error: function(jqXHR, textStatus, errorThrown) { 
				console.log(errorThrown); 
				console.log(textStatus); 
			}
		});
	}else{
		$('#folderListFileSR').siblings('div.inputHolderClass').remove();
		$('#folderListFileSR').html('').attr('disabled','true').addClass('folderListFileSR').css('display','block');
		$('#folderListFileSR').append('<option value="" selected=selected>'+support.globalVars.noneLbl+'</option>')
	}
}
function populateFolderList(values){
	var existingFolderName =  $("#folderNameInfo").val();
	try {
		var folderListVar = values.folderListWithFileSRPermission;		
		$('#folderListFileSR').append('<option value="">'+support.globalVars.noneLbl+'</option>');
		if(folderListVar.length > 0){
			for ( var i = 0; i < folderListVar.length; i++) 	{
				if(existingFolderName == folderListVar[i].folderName){
					$('#folderListFileSR').append('<option value="'+folderListVar[i].folderName+'" selected>'+folderListVar[i].folderName+'</option>');
				}else{
					$('#folderListFileSR').append('<option value="'+folderListVar[i].folderName+'">'+folderListVar[i].folderName+'</option>');
				}
			}
		}
	} catch (err) {
	}
};
var descriptionCounter =0;
var additionalCommmentCounter=0;
function incrementCounter(id)
{
	if(id=="issueDescription") {		
		descriptionCounter++;
		$("textarea#issueDescription").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
	}
	if(id=="additionalComment") {		
		additionalCommmentCounter++;
		$("textarea#additionalComment").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
	}
};
function showSuggestion(id) {
	if(id == "issueDescription") {
		var userProvidedDescription = $("textarea#issueDescription").val();
		var defaultDescription = $("#issueDescriptionText").val();	
	
		if($.trim(userProvidedDescription) == "" || $.trim(userProvidedDescription) == $.trim(defaultDescription)) {
			$("textarea#issueDescription").val(defaultDescription);			
			$("textarea#issueDescription").css("color", "#999999");//grey color(#999999) for default text and #444444(black) for user entered text
		}else{
			$("textarea#issueDescription").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
		}
	}	
	
	if(id == "additionalComment") {
		var userAdditionalComments = $("textarea#additionalComment").val();
		var defaultAdditionalComments = $("#defaultAdditionalComments").val();
		
		if($.trim(userAdditionalComments) == "" || $.trim(userAdditionalComments) == $.trim(defaultAdditionalComments)){
			$("textarea#additionalComment").val(defaultAdditionalComments);
			$("textarea#additionalComment").css("color", "#999999");//grey color(#999999) for default text and #444444(black) for user entered text
		}else{
			$("textarea#additionalComment").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
		}
	}
};
function hideSuggestion(id){
	if(id == "issueDescription") {
		var userProvidedDescription = $("textarea#issueDescription").val();
		var defaultDescription = $("#issueDescriptionText").val();	
	
		if((descriptionCounter == 0) || (descriptionCounter != 0 &&  $.trim(userProvidedDescription) == $.trim(defaultDescription)))	{
			if($.trim(userProvidedDescription) == $.trim(defaultDescription)) {
				$("textarea#issueDescription").val('');
				$("textarea#issueDescription").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
			}
		}
	}
	if(id == "additionalComment") {
		var userProvidedAdditionalComments = $("textarea#additionalComment").val();
		var defaultAdditionalComments = $("#defaultAdditionalComments").val();	
	
		if((additionalCommmentCounter == 0)|| (additionalCommmentCounter != 0 &&  $.trim(userProvidedAdditionalComments) == $.trim(defaultAdditionalComments))) {
			if($.trim(userProvidedAdditionalComments) == $.trim(defaultAdditionalComments)) {		
				$("textarea#additionalComment").val('');
				$("textarea#additionalComment").css("color", "#444444");//grey color(#999999) for default text and #444444(black) for user entered text
			}
		}
	}	
};
