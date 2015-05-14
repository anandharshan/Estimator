vmf.ns.use("ice");
vmf.scEvent=true;
ice.renewrequest = {
	coTermDateUrl:null,
	searchPartnersUrl:null,
	populateCountryUrl:null,
	populateStateUrl:null,
	changePreferredPartnerUrl:null,
	selectedPartnerName:null,
	globalHTML:null,
	CountryCodes:null,
	countrycode:null,
	slectRenewPartner:null,
	selectVmwarePartner:null,
	init: function (coTrmDate,searchPartnersUri,populateCountryUri,populateStateUri,changePreferredPartnerUri,renewRadioLabel1,renewRadioLabel2) {
		coTermDateUrl = coTrmDate;
		searchPartnersUrl = searchPartnersUri;
		populateCountryUrl = populateCountryUri;
		populateStateUrl = populateStateUri;
		changePreferredPartnerUrl = changePreferredPartnerUri;
		CountryCodes='';
		countrycode='';
		CountryCodeAfterChange = '';
		slectRenewPartner=renewRadioLabel1;
		selectVmwarePartner=renewRadioLabel2;
		vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {dateFormat: 'yyyy-mm-dd'});		// Initialize the calendars
		$('.section-wrapper .column.h427').css({'height':'162px'});
		$('.fn_cancel').click(function() { vmf.modal.hide(); });
		$('#partnerSearchArea').next().hide();
		$('#preferred_partner').blur(function () {ice.renewrequest.changeReadonlyState();});
		/*Select a partner link*/
		if($.trim(($('#preferred_partner').val()))!=""){
			$('#selPartner').hide()
			$('#preferredPartnerChange').show()
		}else{
			$('#selPartner').show()
			$('#preferredPartnerChange').hide()
		}
		if($("#partner_data") && $.trim($("#partner_data").text()).length) $("#partner_data").removeClass("hidden");
		$('#back').click(function () {
			$('#quoteRequestForm').removeAttr("action");
			//parent.history.back();
			history.go(-2);
			return false;
		});
		$('#pref11,#pref12').click(function(){
			var _optionRadioButton = document.getElementsByName('pref1');
			var current_id=$(this).attr('id');
			//alert(current_id)
			if(current_id=="pref12")
			{
				$('#partnerTable').find('tr').each(function(){
					$(this).find('input[type=radio]').removeAttr('checked');
					$(this).find('input[type=radio]').attr('disabled',true);
				});
				partnerNameAfterSearch="VMware Direct";
			} else {
				$('#partnerTable').find('tr').each(function(){
					$(this).find('input[type=radio]').attr('disabled',false);
				});
			}

			for(i=0;i<_optionRadioButton.length;i++){
				if(_optionRadioButton[i].checked==true){
					if(_optionRadioButton[i].value=='yes'){
						$('#saveButton').addClass('disabled');
						$('#saveButton').attr('disabled',true);
					} else if(_optionRadioButton[i].value=='no'){
						$('#saveButton').removeClass('disabled');
						$('#saveButton').attr('disabled',false);
					}
				}
			}
		});
		$(".partnerListData").live('click',function(){
			selectedPartnerName=$(this).attr('partnername');
		});		
		$("#saveButton").click(function(){
			if($("#pref12").attr('checked')==true)
				ice.renewrequest.VmwareSelectPartner();
			else if($("#pref11").attr('checked')==true)		
				ice.renewrequest.savePartnerPreference();
			if($.trim($('#preferred_partner').val()) ==''){
				$('#selPartner').show();
				$('#preferredPartnerChange').hide();
			}
			else{
				$('#selPartner').hide();
				$('#preferredPartnerChange').show();
			}
			if(typeof(riaLinkmy) == "function"){
				riaLinkmy("support-contract-history : request-quote-step-2 : change-preferred-renewals-partner : save");
			}
			return false;
		});
		$("#partnerCountry").change(function(){
			CountryCodes="CA,US";
			countrycode=$(this).val();
			var _strHTML = '';
			var _splitCountrycodes = CountryCodes.split(',');
			if(_splitCountrycodes[0]==countrycode||_splitCountrycodes[1]==countrycode){
				CountryCodeAfterChange = $(this).val();
				ice.renewrequest.loadState();
			} else {
				_strHTML += '<option value="">'+renewrequest.globalVars.stateOptionDefault+'</option>';
				$('#partnerState').html(_strHTML);
			}
		});
		$('#partnerTable').find('.vspace2 input[type=radio]').live('click',function(){$('#saveButton').removeClass('disabled').attr('disabled',false);});
		$("#txt_quote_duration, #txt_purchase_date, #preferred_partner").attr("readonly", "readonly");
		$("#txt_coterm").not(":selected").attr("disabled", "disabled");
		$("#txt_purchase_date").click(function () {$('#txt_purchase_date').val('');	});
		$("#txt_attachment").click(function () {$('#txt_attachment').val('');});
		$(".findBtn").click(function () {ice.renewrequest.searchPartner();});
		$('.partnerNameInput,#partnerState,#partnerCountry').keypress(function(e) {
			if(e.which == 13) {
				$(this).blur();
				$('.findBtn').focus().click();
			}
		});
		$("#sendRequest").click(function () {
			var _valfailed = 'false';
			var _maxFileSize = 2097152;
			var _allowedFileTypes = Array('csv', 'doc', 'txt', 'docx', 'xls', 'xlsx','png');
			var _fileName = $('input[type=file]').val();
			if (_fileName != '') { // Attachment validation..
				var _fileInput = $('#txt_attachment')[0];
				var _fileSize = _fileInput.files[0].fileSize;
				var _ext = _fileName.split('.').pop().toLowerCase();
				if ((jQuery.inArray(_ext, _allowedFileTypes)) == -1) {
					$('#typevalidation').show();
					_valfailed = 'true';
				}
				if (_fileSize > _maxFileSize) {
					$("#sizevalidation").show();
					_valfailed = 'true';
				}
			}
			var _tagRemovedCommentVal = ice.renewrequest.stripTags($.trim(($('#comments').val())));
			$('#comments').val(_tagRemovedCommentVal);
			var _commentVal = $.trim(($('#comments').val()));
			var _commentlen = _commentVal.length;
			if (_commentlen > 500) {
				$('#commentsvalidation').show();
				_valfailed = 'true';
			}
			var _prefPartner = $.trim(($('#preferred_partner').val()));
			if(_prefPartner == ''){
				$('#partnervalidation').show();
				_valfailed='true';
			}
			if (_valfailed == 'true') {
				return false;
			} else {
				if(typeof(riaLinkmy) == 'function'){
            		riaLinkmy("support-contract-history : request-quote-step-2 : renewal-request-submitted");
        		}
				setTimeout(function(){
					$('#quoteRequestForm').submit();
				},500);
				$("#sendRequest").attr('disabled', 'disabled');
				return false;
			}
		});
		$("#duration").change(function () {
			$('#txt_quote_duration').val('');
			if ($(this).val() == 'Non-Standard Term') {
			$("#txt_coterm").css('background', '');
				$("#txt_coterm").not(":selected").attr("disabled", "");
				var _serializedForm = $("#quoteRequestForm").serialize();
				//riaLink(coTermDateUrl);
				$.ajax({
					type: 'POST',
					url: coTermDateUrl,
					dataType: 'json',
					data: _serializedForm,
					success: function (data) {
						var _coTerm = data.coterm;
						$('#txt_quote_duration').val(_coTerm);
						$("#txt_quote_duration").css("background","").removeAttr("readonly").removeAttr("disabled");// if Non Standard Term is selected the co-term dates should be enabled
					}
				});
			} else {
			    $("#txt_quote_duration").css("background","#e2e2e2").attr("disabled", "disabled").attr("readonly", "readonly");				
				$("#txt_coterm").css('background', '#e2e2e2');
				$("#txt_coterm").not(":selected").attr("disabled", "disabled");
			}
		});
		$("#preferredPartnerChange, #selPartner").live('click',function () {
			riaLinkmy('support-contract-history : request-quote-step-2 : change-preferred-renewals-partner');
			//vmf.loading.show({"msg":"Change Preffered Partner is loading ", "overlay":true}); // not required since we are already showing loading.. text in both state and country sections
			vmf.modal.show("changePreferredPartnerContent2",{onShow: function (dialog) {
					$('.mfilter a').toggle(function(){
						$('.mfilter a').html($('.mfilter a').html().replace('- '+renewrequest.globalVars.collapseLbl,'+ '+renewrequest.globalVars.expandLbl));$('.partnerSearchArea').slideUp();return false;},
						function(){$('.mfilter a').html($('.mfilter a').html().replace('+ '+renewrequest.globalVars.expandLbl,'- '+renewrequest.globalVars.collapseLbl));$('.partnerSearchArea').slideDown();return false;}
					)
					$('.partnerSearchArea').css({'border':'none'}).find('.required').css({'padding':'0'});
				}
			});
			$(".selectNwPartner").html(slectRenewPartner);
			$(".selectVMwPartner").html(renewrequest.globalVars.partnerMsg);
			//$('.partnerDiv .partnerSearchArea').css({'float': 'right','width': '267px'});
			//$('.partnerNameInput').css({'float': 'right','width': '280px'});
			$('.partnerNameInput').css({'position': 'absolute','right': '143px','width': '246px'}); //Fix for #BUG-00081566
			$("#pref11").attr('checked',true);
			CountryCodeAfterChange='US';
			ice.renewrequest.loadCountry();
			ice.renewrequest.loadState();	
			return false;
		});
		if($('#txt_attachment').length > 0){
			$('#btn_brwse').mousemove(function(e){
				if($.browser.webkit){
					$('#txt_attachment').css({'left': 30,'top': 2,'height':22});
				}else{
					$('#txt_attachment').css({'left': 30});
				}
			});	
			$('#txt_attachment').bind('change',function(){
				var fileName = $(this).val().split(/\\/).pop();
				$('#txt_doc').val(fileName);
			});						
		}
		callBack.addsc({'f':'riaLinkmy','args':['support-contract-history : request-quote-step-2']});
		//Form URL change from /ja/ to /jp/, /ko/ to /kr/ and /zh/ to /cn/ BUG-00065693
		var locOmntVar=$("#quoteRequestForm").attr("action");
        if (locOmntVar.match('.vmware.com/ja') != null){locOmntVar = locOmntVar.replace('.vmware.com/ja','.vmware.com/jp');}
        if (locOmntVar.match('.vmware.com/ko') != null){locOmntVar = locOmntVar.replace('.vmware.com/ko','.vmware.com/kr');}
        if (locOmntVar.match('.vmware.com/zh') != null){locOmntVar = locOmntVar.replace('.vmware.com/zh','.vmware.com/cn');}
        $("#quoteRequestForm").attr("action",locOmntVar);
	}, // End of Init
	loadCountry: function()	{
		$('#partnerCountry').html('<option val="">'+renewrequest.globalVars.loadingMsg+'</option>');
		var _strHTML = '';
		$.ajax({
			type: 'POST',
			url: populateCountryUrl,
			success: function (event) {
				var _jsonResponse = vmf.json.txtToObj(event);
				_strHTML += '<option value="" selected="selected">'+renewrequest.globalVars.countryOptionDefault+'</option>';
				for(i=0;i<_jsonResponse.length;i++){
					if(_jsonResponse[i].isoCountryCode=="US"){
						_strHTML += '<option value="'+_jsonResponse[i].isoCountryCode+'" selected="selected">'+_jsonResponse[i].description+'</option>';
					}else{
						_strHTML += '<option value="'+_jsonResponse[i].isoCountryCode+'">'+_jsonResponse[i].description+'</option>';
					}
				}
				$('#partnerCountry').html(_strHTML);
			},
			error: function (statusError, msgtext) {
				vmf.modal.hide();
				if (msgtext == "parsererror") {
					$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+renewrequest.globalVars.parseErrMsg+'</span>');
					vmf.modal.show("ErrorMyAccountPopup");
				}
			}
		});
	},
	loadState: function()	{
	var _strHTML = '';
	$('#partnerState').html('<option val="">'+renewrequest.globalVars.loadingMsg+'</option>');
	var countryId = $("#country").val();
		if(CountryCodeAfterChange!="" && countryId!=""){
			var _stateUrlWithAgrs = populateStateUrl+"&countryCode="+CountryCodeAfterChange;
			$.ajax({
				type: 'POST',
				url: _stateUrlWithAgrs,
				success: function (event) {
					var _jsonResponse = vmf.json.txtToObj(event);
					_strHTML += '<option value="">'+renewrequest.globalVars.stateOptionDefault+'</option>';
					for(i=0;i<_jsonResponse.length;i++){
						_strHTML += '<option value="'+_jsonResponse[i].state+'">'+_jsonResponse[i].description+'</option>';
					}
					$('#partnerState').html(_strHTML);
						vmf.modal.show("changePreferredPartnerContent2");
				},
				error: function (statusError, msgtext) {
					vmf.modal.hide();
					if (msgtext == "parsererror") {
						$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+renewrequest.globalVars.parseErrMsg+'</span>');
						vmf.modal.show("ErrorMyAccountPopup");
					}
				}
			});
		}else
		{
			_strHTML = '<option value="">'+renewrequest.globalVars.stateOptionDefault+'</option>';
			$('#partnerState').html(_strHTML);
		}
	},
	savePartnerPreference:function(){
		var _partnerId = '', _partAddrs = '', _originalAddrs ='';
		$('#partnerTable').find('tr').each(function(){
			if($(this).find('td input[type=radio]').attr('checked')==true){
				_partnerId = $(this).find('td input[type=radio]').val();
				_partAddrs = $(this).find('td:nth-child(2)').text();
				_originalAddrs = $(this).find('td:nth-child(2)').html(); 			
			}
		});
		var _partAddrs_split = _partAddrs.split('#');
		$("#partner_data").html(_originalAddrs).removeClass('hidden');
		$('#preferred_partner').val(_partAddrs);		
		vmf.modal.hide();           
	},
	VmwareSelectPartner:function(){
		var _partAddrs = renewrequest.globalVars.partnerMsg;
		$('#preferred_partner').val(_partAddrs); 
		$("#partner_data").html(_partAddrs).removeClass('hidden');
		vmf.modal.hide();  
	},
	/*********************************ends here*******************/
	changeReadonlyState: function () {
	var _readonlyStatus = $('#preferred_partner').attr('readonly');
		if (_readonlyStatus == false) {
			$('#preferred_partner').attr('readonly', 'readonly');
			$('#preferred_partner').css('border', '0');
		}
	},
	searchPartner : function() {
		$('.section-wrapper .column.h427').css({'height':'427px'});
		$("#PartnerTotalCount").html("");
		$(".PartnerErrorMsg").remove();
		$("#partnerName").css("border","none");
		var _partnerName=$("#partnerName").val();
		var _partnerCountry=$("#partnerCountry").val();
		var _partnerState=$("#partnerState").val();
		$('#partnerCountryErrorMsg , #partnerStateErrorMsg, #partnerNameErrorMsg').hide();
		$("#partnerCountry, #partnerState , #partnerName").css("border",'')
		var _cnt = 0;
		if(_partnerName==""){
			$("#partnerName").focus();$("#partnerName").css("border","1px solid #D9541E");
			$('#partnerNameErrorMsg').show().html(renewrequest.globalVars.partnerNameErrMsg);
			_cnt = _cnt+1;
		} else {}
		if(_partnerCountry==""){
			$("#partnerCountry").focus();
			$("#partnerCountry").css("border","1px solid #D9541E");
			$('#partnerCountryErrorMsg').show().html(renewrequest.globalVars.countryErrMsg);
			_cnt = _cnt+1;
		}
		else if(_partnerCountry=="US" || _partnerCountry=="CA"){
			if(_partnerState==""){
				$("#partnerState").focus();
				$("#partnerState").css("border","1px solid #D9541E");
				$('#partnerStateErrorMsg').show().html(renewrequest.globalVars.stateErrMsg);
				_cnt = _cnt+1;
			} else {}
		}else {}
		if(_cnt == 0){
			$("#simplemodal-container").css('top','0px'); //Fix for BUG-00019359
			$("#partnerTable").html("");
			$('#searchPartnerRender').slideDown('slow'); //Fix for BUG-00031917
			$("#loadingPartner").show();
			_partnerName = $("#partnerName").val();
			_partnerCountry = $("#partnerCountry").val();
			_partnerState = $("#partnerState").val();
			$("#partnerName1").val(_partnerName);
			$("#partnerCountry1").val(_partnerCountry);
			$("#partnerState1").val(_partnerState);
			_postDataUrl = searchPartnersUrl +'&' + $("#changePartnerForm").serialize();
			vmf.ajax.post(_postDataUrl, null, ice.renewrequest.onSuccessLoadParner, ice.renewrequest.onFailLoadLoadParner);
		}
	},
	onSuccessLoadParner: function (data) {				
		try {
			var _jsonResponse = vmf.json.txtToObj(data);
			var _jsonLength = _jsonResponse.length;
			$("#PartnerTotalCount").html('('+_jsonResponse.length+')');
			if(_jsonLength>0){
				var _jsonStr = "<tbody>";
				for(i=0;i<_jsonLength;i++){
					if(_jsonResponse[i].partySiteId!=null){
						patId=_jsonResponse[i].partySiteId;
					}else{
						patId="";
					}
					_jsonStr +='<tr><td class="vspace2 w20"><input id="partnerDetails" type="hidden" name="partnerDetails" value="'+patId+'"><input type="radio" value="'+patId+'" partnerName="'+_jsonResponse[i].partnerName+'"  name="partner1" class="partnerListData"></td><td class="vspace2 label">'+_jsonResponse[i].partnerName+'<br /><span> '+_jsonResponse[i].addressLine1+', '+_jsonResponse[i].city+', '+_jsonResponse[i].province+', '+_jsonResponse[i].country+'<div style="display:none;">.#PartnerID:'+_jsonResponse[i].partnerID+'</div></span></td><td></td></tr>';       							
				}
				_jsonStr += '</tbody>';
				$("#partnerTable").html(_jsonStr);
				$("#loadingPartner").hide();
			}
			else{
				$('#loadingPartner').html(renewrequest.globalVars.noPartnerMatch);
			}
		} catch (err) {			
			$('#loadingPartner').html(renewrequest.globalVars.noPartnerMatch);
		}
	},
	onFailLoadLoadParner: function (statusError, msgtext) {
		if (msgtext == "parsererror") {
			$('#errorMyAccount').replaceWith('<span id="errorMyAccount">'+renewrequest.globalVars.parseErrMsg+'</span>');
			vmf.modal.show("ErrorMyAccountPopup");
		}
	},
	stripTags:function(input,allowed) {
		allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); 
		var _tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		_commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		var _removeSpecial=/[(\u00C1)(\u00E1)(\u00C2)(\u00E2)(\u00B4)(\u00C6)(\u00E6)(\u00C0)(\u00E0)(\u2135)(\u0391)(\u03B1)(\u0026)(\u2227)(\u2220)(\u0027)(\u00E5)(\u00C5)(\u2248)(\u00E3)(\u00C3)(\u00E4)(\u00C4)(\u201E)(\u0392)(\u03B2)(\u00A6)(\u2022)(\u2229)(\u00E7)(\u00C7)(\u00B8)(\u00A2)(\u03A7)(\u03C7)(\u02C6)(\u2663)(\u2245)(\u00A9)(\u21B5)(\u222A)(\u00A4)(\u2021)(\u2020)(\u2193)(\u21D3)(\u00B0)(\u0394)(\u03B4)(\u2666)(\u00F7)(\u00E9)(\u00C9)(\u00EA)(\u00CA)(\u00E8)(\u00C8)(\u2205)(\u2003)(\u2002)(\u0395)(\u03B5)(\u2261)(\u0397)(\u03B7)(\u00F0)(\u00D0)(\u00EB)(\u00CB)(\u20AC)(\u2203)(\u0192)(\u2200)(\u00BD)(\u00BC)(\u00BE)(\u2044)(\u0393)(\u03B3)(\u2265)(\u003E)(\u2194)(\u21D4)(\u2665)(\u2026)(\u00ED)(\u00CD)(\u00EE)(\u00CE)(\u00A1)(\u00EC)(\u00CC)(\u2111)(\u221E)(\u222B)(\u0399)(\u03B9)(\u00BF)(\u2208)(\u00EF)(\u00CF)(\u039A)(\u03BA)(\u039B)(\u03BB)(\u2329)(\u00AB)(\u2190)(\u21D0)(\u2308)(\u201C)(\u2264)(\u230A)(\u2217)(\u25CA)(\u200E)(\u2039)(\u2018)(\u003C)(\u00AF)(\u2014)(\u00B5)(\u00B7)(\u2212)(\u039C)(\u03BC)(\u2207)(\u00A0)(\u2013)(\u2260)(\u220B)(\u00AC)(\u2209)(\u2284)(\u00F1)(\u00D1)(\u039D)(\u03BD)(\u00F3)(\u00D3)(\u00F4)(\u00D4)(\u0152)(\u0153)(\u00F2)(\u00D2)(\u203E)(\u03C9)(\u03A9)(\u039F)(\u03BF)(\u2295)(\u2228)(\u00AA)(\u00BA)(\u00F8)(\u00D8)(\u00F5)(\u00D5)(\u2297)(\u00F6)(\u00D6)(\u00B6)(\u2202)(\u2030)(\u22A5)(\u03A6)(\u03C6)(\u03A0)(\u03C0)(\u03D6)(\u00B1)(\u00A3)(\u2033)(\u2032)(\u220F)(\u221D)(\u03A8)(\u03C8)(\u0022)(\u221A)(\u3009)(\u232A)(\u00BB)(\u2192)(\u21D2)(\u2309)(\u201D)(\u211C)(\u00AE)(\u230B)(\u03A1)(\u03C1)(\u200F)(\u203A)(\u2019)(\u201A)(\u0161)(\u0160)(\u22C5)(\u00A7)(\u00AD)(\u03A3)(\u03C3)(\u03C2)(\u223C)(\u2660)(\u2282)(\u2286)(\u2211)(\u2283)(\u00B9)(\u00B2)(\u00B3)(\u2287)(\u00DF)(\u03A4)(\u03C4)(\u2234)(\u0398)(\u03B8)(\u03D1)(\u2009)(\u00FE)(\u00DE)(\u02DC)(\u00D7)(\u2122)(\u00FA)(\u00DA)(\u2191)(\u21D1)(\u00FB)(\u00DB)(\u00F9)(\u00D9)(\u00A8)(\u03D2)(\u03A5)(\u03C5)(\u00FC)(\u00DC)(\u2118)(\u039E)(\u03BE)(\u00FD)(\u00DD)(\u00A5)(\u00FF)(\u0178)(\u0396)(\u03B6)(\u200D)(\u200C):\&\<\>\=\-\+\#\^\*\(\%\“\‘\[\]\~\\\|\/]+/g;
		return input.replace(_removeSpecial, '').replace(_commentsAndPhpTags, '').replace(_tags, function ($0, $1) {        
			return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	}
};