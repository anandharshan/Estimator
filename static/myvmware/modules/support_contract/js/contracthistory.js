vmf.ns.use("ice");
ice.contracthistory = {
	loadContractHistoryDataUrl:null,
	contractNumber:null,
	status:null,
	products:null,
	supportLevel:null,
	expiration:null,
	permissionErrorOne:null,
	permissionErrorTwo:null,
	myPermission:null,
	permissionErrorThree:null,
	noDataMsg:null,
	loadingError:null,
	viewContractDetailsUrl:null,
	filterContractHistoryDataUrl:null,
	quoteRequestSummaryUrl:null,
	validationMessage:null,
	orderHistoryUrl:null,
	activitiesLogUrl:null,
	disableCheckBoxToolTipMessage:null,
	ErrorDateRangMsg:null,
	ErrorMessageNoPermission1:null,
	ErrorMessageNoPermission2:null,
	ErrorMessageNoPermission3:null,
	ErrorMessageNoPermission4:null,
	contractHistoryDatas:null,
	greyedInputTooltipMsg:null,
	arrayOfSelectedContractIds:[],
	exportAllToCsvUrl1:null,
	init: function (portletUrl,loadContHistDataUrl,contNum,stat,prod,sLevel,exp,permerrone,permerrtwo,myperm,permerrorthree,noDMsg,loaderr,viewContDetUrl,filtContHistDataUrl,qutReqSumUrl,validMsg,ordHisUrl,actvtUrl,tooltipDisableMsg,ErrorDateRange,ErrorMsgNoPerm1,ErrorMsgNoPerm2,ErrorMsgNoPerm3,ErrorMsgNoPerm4,tooltipMsg,exportAllToCsvUrl) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['support-contract-history']});
		loadContractHistoryDataUrl = loadContHistDataUrl;
		contractNumber = contNum;
		status = stat;
		products = prod;
		supportLevel = sLevel;
		expiration = exp;
		permissionErrorOne = permerrone;
		permissionErrorTwo = permerrtwo;
		myPermission = myperm;
		permissionErrorThree = permerrorthree;
		noDataMsg = noDMsg;
		loadingError = loaderr;
		viewContractDetailsUrl = viewContDetUrl;
		//loadFilterUrl = loadFiltUrl;
		filterContractHistoryDataUrl = filtContHistDataUrl;
		exportAllToCsvUrl1 = exportAllToCsvUrl;
		quoteRequestSummaryUrl = qutReqSumUrl;
		validationMessage = validMsg;
		orderHistoryUrl = ordHisUrl;
		activitiesLogUrl = actvtUrl;
		ErrorDateRangMsg=ErrorDateRange;
		disableCheckBoxToolTipMessage=tooltipDisableMsg;
		ErrorMessageNoPermission1=ErrorMsgNoPerm1;
		ErrorMessageNoPermission2=ErrorMsgNoPerm2;
		ErrorMessageNoPermission3=ErrorMsgNoPerm3;
		ErrorMessageNoPermission4=ErrorMsgNoPerm4;
		ice.eaSelector.loadEASelector();
		ice.contracthistory.greyedInputTooltipMsg=tooltipMsg;
		ice.contracthistory.contractHistoryDatas=[];
		ice.contracthistory.contractHistoryData();
		//Form URL change from /ja/ to /jp/, /ko/ to /kr/ and /zh/ to /cn/ BUG-00065693
		if (quoteRequestSummaryUrl.match('.vmware.com/ja') != null){quoteRequestSummaryUrl = quoteRequestSummaryUrl.replace('.vmware.com/ja','.vmware.com/jp');}
		if (quoteRequestSummaryUrl.match('.vmware.com/ko') != null){quoteRequestSummaryUrl = quoteRequestSummaryUrl.replace('.vmware.com/ko','.vmware.com/kr');}
		if (quoteRequestSummaryUrl.match('.vmware.com/zh') != null){quoteRequestSummaryUrl = quoteRequestSummaryUrl.replace('.vmware.com/zh','.vmware.com/cn');}
		//
		$('#contractHistoryApplyFilter, #resetContractHistoryFilter').attr('disabled', 'disabled').addClass('disabled');
		$('.activitiesLog').addClass('bottomarea');
		$('.bottom').hide();
		vmf.datatable.reload($('#dataTableWrapper'),loadContractHistoryDataUrl,ice.contracthistory.postProcessingData);
		$('#quoteRequest').attr("disabled", false);
		$('input:text, select', $('#filterAreaDiv')).val(' '); // it will clear the fields whenever page is refreshed -BUG-00030423
		//$('input[type=text]:not(.txt_datepicker),select',$('#filterAreaDiv')).val(' ');
		// Do we really required below commented lines, please confrim - Rvooka
		$('.helpLink').css({'right':'0px','top':'18px'});
		$('.filterContract').css('position', 'absolute');
		$('.filterContract').css('right', '0');
		$('.filterContract').css('top', '0');
		$('.filterContract').css('padding', '5px');
		$('.filterContract a').css('margin-right', '15px');
		$('.filterContract a').css('color', '#FFFFFF');
		// end of not required
		//var eDate = new Date();
		//var endDateFinal = eDate.getFullYear()+'/'+ice.contracthistory.zeroPad(eDate.getMonth()+1)+'/'+ice.contracthistory.zeroPad(eDate.getDate());
		ice.contracthistory.loadCalendar();
		if(quoteFormConfStatusData=="success"){
			//$("#requestQuoteConfirmationContent").show();
			vmf.modal.show("requestQuoteConfirmationContent");
			$('#failure_msg').hide();
			$('#failure').hide();
			$('#fileUploadFailure_msg').hide();
			$('#fileUploadFailure').hide();						
		}
		else if(quoteFormConfStatusData=="failure"){
			vmf.modal.show("requestQuoteConfirmationContent");
			$('#success_msg').hide();
			$('#success').hide();
			$('#fileUploadFailure_msg').hide();
			$('#fileUploadFailure').hide();	
		}
		else if (quoteFormConfStatusData=="fileUploadFailure") {
			vmf.modal.show("requestQuoteConfirmationContent");
			$('#failure_msg').hide();
			$('#failure').hide();
			$('#success_msg').hide();
			$('#success').hide();
		}
		$('#closeData').click(function(){
			vmf.modal.hide("requestQuoteConfirmationContent");
		});
		
		$('#quoteRequest').click(function () {ice.contracthistory.showRequestQuotePage();return false;});
		$('#orderHistory').click(function () {window.location = orderHistoryUrl;});
		$('#activitiesLog').click(function () {window.location = activitiesLogUrl;});
		$('#export').click(function () {window.location = portletUrl;return false;});
		$('#managePermissionLink').click(function() {window.location = '/group/vmware/4';  });
		$('#resetContractHistoryFilter').live('click', function () {
			$(this).attr('disabled',true).addClass('disabled');
		ice.contracthistory.resetContractHistoryFilter();return false;
		});
		/* BUG-00050840 start */
		$('#exportAllToCsvButton').attr('title',expTpText);
	    myvmware.hoverContent.bindEvents($('#exportAllToCsvButton'), 'funcleft');
		/* BUG-00050840 end */
		$('#exportAllToCsvButton').click(function () { 
			ice.contracthistory.loadFilteredData(true); return false;
		});
		$('#contractHistoryApplyFilter').live('click', function() {
			$('#error_message').html('');
			var _formValid = $("#contractHistoryFilterForm").valid();
			if (_formValid) {
				if($('#status').val() == "" && $('#products').val() == "" && $("#expirationDateFrom").val() == "" && $("#expirationDateTo").val() == "" && $("#supportLevel").val() == '' && $("#contractId").val() == ''){
					$('#error_message').html(contracthistory.globalVars.minOneFilterMsg);
					vmf.modal.show("errorpopup");
					return false;
				} else if(($("#expirationDateFrom").val() == '' && $("#expirationDateTo").val() != '')){
					$('#error_message').html(contracthistory.globalVars.enterFromDateMsg);
					vmf.modal.show("errorpopup");
					return false;
				} 
				else if(jQuery.trim($("#expirationDateFrom").val()) !=''){	
					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1;
					var yyyy = today.getFullYear();
					if(dd<10){dd='0'+dd;}
					if(mm<10){mm='0'+mm;}
					var endDateValue = yyyy+"-"+mm+"-"+dd;
					if(jQuery.trim($("#expirationDateTo").val()) != ''){
						endDateValue = new Date($("#expirationDateTo").val());
					}else{
						$("#expirationDateTo").val(endDateValue);
					}
					var startDateValue = new Date($("#expirationDateFrom").val());
					var startDateValuecmp = startDateValue.getTime();
					endDateValue = new Date($("#expirationDateTo").val());
					var endDateValuecmp = endDateValue.getTime();
					if( startDateValuecmp > endDateValuecmp ){
						$('#error_message').html(ErrorDateRangMsg);
						vmf.modal.show("errorpopup");
						return false;
					} else {
						ice.contracthistory.loadFilteredData();
					}
				} else {
					ice.contracthistory.loadFilteredData();
				}
			}
			return false;
		});
	},// End of init
	loadCalendar: function(){
		var exp_date_from = vmf.dom.id('expirationDateFrom');
		var exp_date_to = vmf.dom.id('expirationDateTo');
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
		vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
			dateFormat: 'yyyy-mm-dd',
			startDate: '1900-01-01',
			endDate: '2020-12-31',
			startDate_id: vmf.dom.id('expirationDateFrom'),
			endDate_id: vmf.dom.id('expirationDateTo')
		});
		vmf.calendar.resetCalenders(exp_date_from);
		vmf.calendar.resetCalenders(exp_date_to)
		vmf.calendar.setDisplayMonth(exp_date_from, curr_month, curr_year);
		vmf.calendar.setDisplayMonth(exp_date_to, curr_month, curr_year);
		myvmware.common.putplaceHolder('.txt_datepicker');
		// Bind event handler to the startDate calendar
		vmf.dom.addHandler(exp_date_from, "dpClosed", function(e, selectedDate){
			var d = selectedDate[0];
			if(d){
				d = new Date(d);
				vmf.calendar.setStartDate(exp_date_to, d.addDays(1).asString());
			}
		});
		// Bind event handler to the endDate calendar
		vmf.dom.addHandler(exp_date_to, "dpClosed", function(e, selectedDate){
			var d = selectedDate[0];
			if(d){
				d = new Date(d);
				vmf.calendar.setEndDate(exp_date_from, d.addDays(-1).asString());
			}
		});
	},
	postProcessingData: function(table, settings, _json){
		var _errHtml = "<div style='display:none;' id='loadingerrormsg1'><div id='innerMsg' class='error_innermsg'></div></div>";
		$('#loadingerrormsg').attr('style','display:none;');		
		var loadErrorChecker=0;
		$('#exportAllToCsvButton').show();
		if(_json=='' || typeof(_json)=='undefined'){
			ice.contracthistory.clearTable(table,loadingError);
			ice.contracthistory.contractHistoryDatas=[];
			table.find('tbody tr td.dataTables_empty').html(_errHtml);
			$('#loadingerrormsg1').find('div#innerMsg').html('<p>'+loadingError+'</p>');
			$('#loadingerrormsg1').show();
			loadErrorChecker=1;
			$("select#sel_status").html('');
			$("#sel_support_level").html('');
			$('#contractHistoryApplyFilter, #resetContractHistoryFilter').attr('disabled', 'disabled').addClass('disabled');
		}else if(_json.error){
			var _msg = _json.message;
			ice.contracthistory.clearTable(table,_msg);
			ice.contracthistory.contractHistoryDatas=[];
			table.find('tbody tr td.dataTables_empty').html(_errHtml);
			$('#loadingerrormsg1').find('div#innerMsg').html('<p>'+_msg+'</p>');
			$('#loadingerrormsg1').show();
			loadErrorChecker=1;
			$("select#sel_status").html('');
			$("#sel_support_level").html('');
			$('#contractHistoryApplyFilter, #resetContractHistoryFilter').attr('disabled', 'disabled').addClass('disabled');
		} else {
			$("#resetOrderHistoryFilter").attr('disabled', false).removeClass('disabled');
			if (_json.isAllowed == false){
				$('#exportAllToCsvButton').hide();
				ice.contracthistory.clearTable(table,ErrorMessageNoPermission1);
				ice.contracthistory.clearTable(table,ErrorMessageNoPermission2);
				ice.contracthistory.clearTable(table,ErrorMessageNoPermission3);
				ice.contracthistory.contractHistoryDatas=[];
     			        var locale = $('#localeFromLiferayTheme').text().split("_");
			        var currentLocale = (locale[0].toLowerCase() == 'en') ? '' : '/' + locale[1].toLowerCase();
			        var uapLink = currentLocale + '/group/vmware/users-permissions';
				table.find('tbody tr td.dataTables_empty').html(_errHtml);
				$('#loadingerrormsg1').find('div#innerMsg').html('<p class="topPara">'+ErrorMessageNoPermission1+'</p><p class="sub_line">'+ErrorMessageNoPermission4+' <a href="'+ uapLink +'" id="MyPermission"> '+ErrorMessageNoPermission2+' </a> '+ErrorMessageNoPermission3+'</p>');
				$('#loadingerrormsg1').show();
				loadErrorChecker=1;
				$("select#sel_status").html('');
				$("#sel_support_level").html('');
				$('#contractHistoryApplyFilter, #resetContractHistoryFilter').attr('disabled', 'disabled').addClass('disabled');
			} else if(!settings.fnRecordsTotal()){
				ice.contracthistory.clearTable(table,noDataMsg);
				ice.contracthistory.contractHistoryDatas=[];
				table.find('tbody tr td.dataTables_empty').html(_errHtml);
				$('#loadingerrormsg1').find('div#innerMsg').html('<p>'+noDataMsg+'</p>');
				$('#loadingerrormsg1').show();
				loadErrorChecker=1;
			}
		}
		//BUG-00065693 link changer to overwrite LifeRay links 
		/* Not required as the URL handling is done in fnRowCallback  call back ~~~~~~~~~~~~~~~~~~~~***/
		/*if(loadErrorChecker==0){
			var linkLocChecker = $("#dataTableWrapper tbody a.left_space").attr("href");
			if (linkLocChecker.match('.vmware.com/ko') != null){linkLocChecker = linkLocChecker.replace('.vmware.com/ko','.vmware.com/kr');}
			if (linkLocChecker.match('.vmware.com/zh') != null){linkLocChecker = linkLocChecker.replace('.vmware.com/zh','.vmware.com/cn');}
			$("#dataTableWrapper tbody a.left_space").attr("href",linkLocChecker);
		}*/
	},//End of postProcessingData
	clearTable: function(tableId,license_text){
		table = tableId.dataTable();
		table.fnClearTable();
		table.find('tbody tr').css("height","150px").addClass('noborder default')
		.find('td.dataTables_empty').html(license_text);
	},
	contractHistoryData: function () {
		vmf.datatable.build($('#dataTableWrapper'), {
			"aoColumns": [{ "sTitle": '<span class="descending">'+contractNumber+'</span>' , "sWidth" : "90px" },{ "sTitle": '<span class="descending">'+status+'</span>' , "sWidth" : "55px"},{"sType":"num-html","sSortDataType":"dom-text","sTitle": '<span class="descending">'+products+'</span>' , "sWidth" : "auto"},{"sTitle": '<span class="descending">'+supportLevel+'</span>' , "sWidth" : "95px"},{"sTitle": '<span class="descending">'+expiration+'</span>' , "sWidth" : "115px"},{"sTitle": "","bVisible":false}, {"sTitle": "","bVisible":false}, {"sTitle": "" ,"bVisible":false}, {"sTitle": "","bVisible":false }, {"sTitle": "","bVisible":false} ],
			"bServerSide": false,
			"aaData":ice.contracthistory.contractHistoryDatas,
			"bProcessing": true,
			"bAutoWidth": false,
			"bFilter": false,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, myvmware.globalVars.allLbl]],
			"iDisplayLength": 10, 
			"oLanguage": {
				"sProcessing" : contracthistory.globalVars.loadingMsg,
				"sLoadingRecords":"",
				"sLengthMenu": "<label>"+contracthistory.globalVars.itemsPerPage+"</label> _MENU_",
				"sInfo": contracthistory.globalVars.recordsInfo,
				"sInfoEmpty": contracthistory.globalVars.recordsEmpty,
				"sInfoFiltered": contracthistory.globalVars.recordsFiltered,
				"oPaginate": {		        
			        "sPrevious": myvmware.globalVars.previousLbl,
			        "sNext": myvmware.globalVars.nextLbl
			     }
			},
			"sDom": 'zrt<"bottom"lpi<"clear">>',
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
					ice.contracthistory.contractHistoryDatas=jsonRes.aaData;
					var _contractId = aData[5];
					var newHtml=new Array();
					var _contractNumber = aData[0];
					var _expirationFlag = $.trim(aData[6]);
					var _renewEligibleFlag = aData[7];
					var _contractSignedFlag = aData[8];
					var _contractStatus = aData[1];
					var contractIdHtml = '';
					var productHtml	=	'';
					var contractSignedHtml = '';
					var supportSignedHtml = '';
					var _supportUpliftFlag = aData[9];
					// changes as part of BUG-00052407
					var _encryptedContractId = aData[10];
					if (_renewEligibleFlag == 'N') {
						var _toDisable = true;
						var _toChecked = false;
						_expirationFlag = 'false';
					} else {
						var _toDisable = false;
						//Fix:BUG-00027423
						var _toChecked	= false;
					}
					//populate the filter dropdown values
					ice.contracthistory.onSuccessContractFilter(jsonRes);
					contractIdHtml+='<input type="checkbox" name=chkContractID><a href="#">'+aData[0]+'</a>';
					var _prodName = new String(aData[2]);
					productHtml+= (_prodName.length > 110) ? _prodName.substring(0,110)+'...' : _prodName;
					$(nRow).find('td:eq(0)').html(contractIdHtml).find('td:eq(2)').html(productHtml);
					//BUG-00052407 populated URL with encrypted contract ID
					if(viewContractDetailsUrl.match('.vmware.com/ja') !=null ){viewContractDetailsUrl = viewContractDetailsUrl.replace('.vmware.com/ja','.vmware.com/jp');}
					if(viewContractDetailsUrl.match('.vmware.com/zh') !=null ){viewContractDetailsUrl = viewContractDetailsUrl.replace('.vmware.com/zh','.vmware.com/cn');}
					if(viewContractDetailsUrl.match('.vmware.com/ko') !=null ){viewContractDetailsUrl = viewContractDetailsUrl.replace('.vmware.com/ko','.vmware.com/kr');}
					var _contractDetailsCall = viewContractDetailsUrl + '&contractID=' + _encryptedContractId + '&contractStatus=' + _contractStatus;
					$('td:eq(0) input:checkbox', nRow).attr('disabled',_toDisable).attr('checked',_toChecked).val(_contractId).die('click').live('click',function(){
						ice.contracthistory.disableQuoteRequestButton();
					});
					if (_toDisable) $('td:eq(0)', nRow).addClass('tooltip').attr('title',ice.contracthistory.greyedInputTooltipMsg);
					ice.contracthistory.disableQuoteRequestButton();
					$('td:eq(0) a', nRow).addClass('left_space').attr('href',_contractDetailsCall);
					if (_contractSignedFlag == 'Y')	$('td:eq(4)').html(aData[3]+'<span class="new badge">'+contracthistory.globalVars.newLbl+'</span>');
					if (_supportUpliftFlag == 'Y')	$('td:eq(3)').html(aData[2]+'<span class="new badge">'+contracthistory.globalVars.newLbl+'</span>');
					contractIdHtml = '';
					productHtml = '';
					if($(nRow).data("chkState") && $(nRow).data("chkState")!=undefined){ //This is to maintain check box status
						$(nRow).find('input:checkbox').attr('checked', true);
					}
					else{
						$(nRow).find('input:checkbox').attr('checked', false);
					}

				} 
				return nRow;
			},
			"fnDrawCallback":function(){
				 var dtd=this;
				$('.activitiesLog').removeClass('bottomarea');
				if(!$(dtd).find('tfoot').length)
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#dataTableWrapper_paginate").css("display", "block");
				} else {
					$("#dataTableWrapper_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#dataTableWrapper_length option:eq(0)").val(),10)){
					$("#dataTableWrapper_length").css("display", "block");
				} else {$("#dataTableWrapper_length").css("display", "none");}
					if ($(this).find('tbody tr').length ==1 && $(this).find('tbody tr td').hasClass('dataTables_empty')){
					$(this).find('tbody tr').css("height","150px").addClass('noborder default');
					}
				vmf.datatable.addEllipsis();
				myvmware.hoverContent.bindEvents($('.tooltip'), 'defaultfunc');
			},
			"fnInitComplete": function () {
				var dt=this;
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					$(dt).parents(".dataTables_scroll").addClass("bottomarea clear"); //Fix for header misalignment
					setTimeout(function() {dt.fnAdjustColumnSizing(false);}, 500);
				}
				if ($(this).find('tbody tr').length ==1 && $(this).find('tbody tr td').hasClass('dataTables_empty')){
					$(this).find('tbody tr').css("height","150px").addClass('noborder').find('td.dataTables_empty').html('');
				}
				if (!$('#dataTableWrapper tbody tr td').hasClass('dataTables_empty')) {$('#export, #quoteRequest').removeAttr('disabled');}
				(!this.fnSettings().fnRecordsTotal())? $('.bottom').hide() : $('.bottom').show();
			}
		});
		
		var $dataTable = $("#dataTableWrapper");

		$dataTable.find('input:checkbox').die('click').live('click',function(e) {
			if($(this).is(':checked')){
				$(this).closest('tr').data("chkState",true); 
				ice.contracthistory.arrayOfSelectedContractIds.push($(this).val());
			}else{
				$(this).closest('tr').data("chkState",false);
				//ice.contracthistory.arrayOfSelectedContractIds.pop($(this).val());
				//ice.contracthistory.arrayOfSelectedContractIds.splice(ice.contracthistory.arrayOfSelectedContractIds.indexOf($(this).val()),1);
				if ($.inArray($(this).val(),ice.contracthistory.arrayOfSelectedContractIds)!=-1){ //IE7, IE8 Fix BUG-00035215
					ice.contracthistory.arrayOfSelectedContractIds.splice($.inArray($(this).val(),ice.contracthistory.arrayOfSelectedContractIds),1);
				}
			}
			ice.contracthistory.disableQuoteRequestButton();
		});
	},
	zeroPad : function(num) {
		var s = '0'+num;
		return s.substring(s.length-2);
	},
	onSuccessContractFilter: function(data){
		$('#addFilter').hide();
		$('#removeFilter').show();
		var _supportList = data.supportList;
		var _statusList = data.statusList;
		if(_supportList != undefined && _statusList != undefined){
			var options = '<option value="">'+contracthistory.globalVars.selectHintMsg+'</option>';
			var _statusSelect= '<option value="">'+contracthistory.globalVars.selectHintMsg+'</option>';
			for(var i = 0; i < _supportList.length; i++)	{
				if(_supportList[i] != ""){options+='<option value="' + _supportList[i] + '">' + _supportList[i] + '</option>';}
			}
			for(var i = 0; i < _statusList.length; i++)	{
				if(_statusList[i] != "")	{_statusSelect+='<option value="' + _statusList[i] + '">' + _statusList[i] + '</option>';}
			}
			$("select#sel_status").html(_statusSelect);
			$("#sel_support_level").html(options);
			$('#contractHistoryApplyFilter, #resetContractHistoryFilter').removeAttr('disabled').removeClass('disabled');
		}
		var _startDate = vmf.dom.id("expirationDateFrom");
		var _endDate = vmf.dom.id("expirationDateTo");
		vmf.dom.addHandler(_startDate, "dpClosed", function (e, selectedDate) {
			var d = selectedDate[0];
			if (d) {
				d = new Date(d);
				vmf.calendar.setStartDate(_endDate, d.addDays(1).asString());
			}
		});
		vmf.dom.addHandler(_endDate, "dpClosed", function (e, selectedDate) {
			var d = selectedDate[0];
			if (d) {
				d = new Date(d);
				vmf.calendar.setEndDate(_startDate, d.addDays(-1).asString());
			}
		});		
	},
	closeFilter: function () {$('#removeFilter').hide();$('#addFilter').show(); $('#filterAreaDiv').hide('');},
	loadFilter: function () {$('#filterAreaDiv').show();},
	loadContractHistoryFilteredData: function () {ice.contracthistory.loadFilteredData(false);},
	loadFilteredData: function (exportFlag) {
	    var _contractID=$.trim($('#contractId').val());
		$('#contractId').val(_contractID);
		var _postDataUrl = $("#contractHistoryFilterForm").serialize();
		if($.trim($("#expirationDateFrom").val()) == 'YYYY-MM-DD') {
			_postDataUrl = ice.contracthistory.removeParameter(_postDataUrl, 'expirationDateFrom');
		}
		if($.trim($("#expirationDateTo").val()) == 'YYYY-MM-DD') {
			_postDataUrl = ice.contracthistory.removeParameter(_postDataUrl, 'expirationDateTo');
		}
		var _filterDataUrl = filterContractHistoryDataUrl +'&' + _postDataUrl;
		ice.contracthistory.arrayOfSelectedContractIds=[];
		ice.contracthistory.disableQuoteRequestButton();
		if(exportFlag){
			myvmware.common.generateCSVreports(exportAllToCsvUrl1, _postDataUrl, "support-contract-history : export-all", "support-contract-history : Export-to-CSV : Error");
		} else {
			vmf.datatable.reload($('#dataTableWrapper'),_filterDataUrl, ice.contracthistory.postProcessingData);
		}
	},
	resetContractHistoryFilter: function () {
		$('#contractId').val('');
		$('#products').val('');
		$('#expirationDateFrom').val('');
		$('#expirationDateTo').val('');
		$("#sel_status").attr('selectedIndex', 0);
		$("#sel_support_level").attr('selectedIndex', 0);
		$('.activitiesLog').addClass('bottomarea');
		$('.bottom').hide();
		ice.contracthistory.arrayOfSelectedContractIds=[];
		ice.contracthistory.disableQuoteRequestButton();
		vmf.datatable.reload($('#dataTableWrapper'),loadContractHistoryDataUrl, ice.contracthistory.postProcessingData);
	},
	showRequestQuotePage: function () {
		var _arrayOfSelectedContractIds = new Array();
		if (ice.contracthistory.arrayOfSelectedContractIds.length > 0) {
			$('#contractIds').val(ice.contracthistory.arrayOfSelectedContractIds);
			$('#contractForm').attr("action", quoteRequestSummaryUrl);
			$('#contractForm').submit();
			$('#quoterequest').html(contracthistory.globalVars.loadingMsg);
			
		} else {
			$('#contractForm').attr("action", "");
			//$('#contractForm').submit();
			//$('#quoteRequest').attr("disabled", true);
		}
		$('#quoteRequest').attr("disabled", true);
	},
	disableQuoteRequestButton: function () {
		(ice.contracthistory.arrayOfSelectedContractIds.length == 0)?$("#quoteRequest").attr("title", validationMessage).attr("disabled", "disabled").addClass('disabled'):$("#quoteRequest").attr("title", "").removeAttr('disabled').removeClass('disabled');
	},
	removeParameter: function(url, parameter) {
	  var pars= url.split(/[&;]/g);;
	  var prefix = encodeURIComponent(parameter)+'=';

	  for (var i= pars.length; i-->0;)               //reverse iteration as may be destructive
		  if (pars[i].indexOf(prefix)!==-1) {   //idiom for string.startsWith
			  pars.splice(i, 1);
		  }
	  url = pars.join('&');
	  return url;
	}
};
