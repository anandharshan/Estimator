vmf.ns.use("ice");
ice.orderhistory = {
	activitiesLogUrl:null,
	contractHistoryUrl:null,
	loadOrderHistoryDataUrl:null,
	portletUrl:null,
	loadingError:null,
	noDataMsg:null,
	permissionErrorOne:null,
	permissionErrorTwo:null,
	myPermission:null,
	permissionErrorThree:null,
	loadOrderHistoryFilterUrl:null,
	loadFilterUrl:null,
	viewOrderDetailsUrl:null,
	clearOrderHistoryFilterUrl:null,
	validatorMsg1:null,
	validatorMsg2:null,
	validatorMsg3:null,
	validatorMsg4:null,
	validatorMsg5:null,
	orderIdHeader:null,
	orderDateHeader:null,
	poNumberHeader:null,
	contractId:null,
	maxAllowedMsg:null,
	sixtydaysFilterUrl:null,
	ninetydaysFilterUrl:null,
	invalidorderMsg:null,
	ErrorMessageNoPermission1:null,
	ErrorMessageNoPermission2:null,
	ErrorMessageNoPermission3:null,
	ErrorMessageNoPermission4:null,
	link30dayText:null,
	link60dayText:null,
	link90dayText:null,
	curDatRange:null,
	exportAllToCsvUrl1:null,
    init: function (activitiesUrl,contractUrl,loadOrdHistUrl,exportUrl,loaderr,noDMsg,permerrone,permerrtwo,myperm,permerrorthree,loadFiltrDataUrl,loadFiltUrl,viewOrdDetails,clrfltr,msg1,msg2,msg3,msg4,msg5,orderid,orderdt,ponmber,contractid,maxallwdmsg,sixtydaysUrl,ninetyDaysUrl,invalidorder,ErrorMsgNoPerm1,ErrorMsgNoPerm2,ErrorMsgNoPerm3,ErrorMsgNoPerm4,exportAllToCsvUrl) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['order-history']});
		activitiesLogUrl = activitiesUrl;
		contractHistoryUrl = contractUrl;
		loadOrderHistoryDataUrl = loadOrdHistUrl;
		portletUrl = exportUrl;
		loadingError = loaderr;
		noDataMsg= noDMsg;
		permissionErrorOne = permerrone;
		permissionErrorTwo = permerrtwo;
		myPermission = myperm;
		permissionErrorThree = permerrorthree;
		loadOrderHistoryFilterUrl = loadFiltrDataUrl;
		loadFilterUrl = loadFiltUrl;
		viewOrderDetailsUrl=viewOrdDetails;
		clearOrderHistoryFilterUrl=clrfltr;
		exportAllToCsvUrl1 = exportAllToCsvUrl;
		validatorMsg1=msg1;
		validatorMsg2=msg2;
		validatorMsg3=msg3;
		validatorMsg4=msg4;
		validatorMsg5=msg5;
		orderIdHeader=orderid;
		orderDateHeader=orderdt;
		poNumberHeader=ponmber;
		contractId=contractid;
		maxAllowedMsg=maxallwdmsg;
		sixtydaysFilterUrl=sixtydaysUrl;
		ninetydaysFilterUrl=ninetyDaysUrl;
		invalidorderMsg=invalidorder;
		curDatRange=30;
		ErrorMessageNoPermission1=ErrorMsgNoPerm1;
		ErrorMessageNoPermission2=ErrorMsgNoPerm2;
		ErrorMessageNoPermission3=ErrorMsgNoPerm3;
		ErrorMessageNoPermission4=ErrorMsgNoPerm4;
		link30dayText=$("#30dayfilter").text();
		link60dayText=$("#60dayfilter").text();
		link90dayText=$("#90daysfilter").text();
		ice.orderhistory.clearFilterDatas();
		ice.eaSelector.loadEASelector();
		ice.orderhistory.orderHistoryData(); // building empty datatable
		ice.orderhistory.loadOrderHistory();
		ice.orderhistory.loadCalendar();
		ice.orderhistory.loadFilter();
		$('#contractHistory').click(function () {
			window.location = contractHistoryUrl;
        });
		$('#activitiesLog').click(function () {
			window.location = activitiesLogUrl;
        });
		$('#export').click(function () {
            window.location = portletUrl;
			return false;
		});
		$('#modal_hide').click(function () {
           vmf.modal.hide("errorpopup");
		});
		$('#managePermissionLink').click(function() {		
			window.location = '/group/vmware/4';  
		});
		$('#orderHistoryApplyFilter').click(function () {
            ice.orderhistory.loadFilterForm(false);
			return false;
        });
		$("#resetOrderHistoryFilter").live('click', function () {
			ice.orderhistory.resetOrderHistory();
			return false;
        });
		$('#addFilter').click(function () {
            ice.orderhistory.loadFilter();
			return false;
        });
        $('#removeFilter').click(function () {
            ice.orderhistory.closeFilter();
			return false;
        });
        /* BUG-00050840 start */
		$('#exportAllToCsvButton').attr('title',expTpText);
	    myvmware.hoverContent.bindEvents($('#exportAllToCsvButton'), 'funcleft');
		/* BUG-00050840 end */
		$('#exportAllToCsvButton').click(function () { 
			ice.orderhistory.loadFilterForm(true); return false;
		});	 
		
		$('.filter-content .filter-date').not('.active').each(function() {
				$(this).find('.secondRow select, .secondRow input').attr('disabled', true);
		});
		$('.filter-content .filter-date .onoff').change(function() {
			var $this = $(this);
			$this.parents('.filter-content').find('.filter-date').removeClass('active').find('.secondRow select, .secondRow input').attr('disabled', true);
			$this.parents('.filter-date').addClass('active').find('.secondRow select, .secondRow input').attr('disabled',false);
		});
		$('#60dayfilter').live('click',function (e) {
			if(!$(this).hasClass('disabled')){
				//$('.expand-collapse ul li a').addClass('disabled').css({'color':'#999999'});
				//ice.orderhistory.resetOrderHistory();
				ice.orderhistory.set60days();
				ice.orderhistory.reloadDatatable(sixtydaysFilterUrl);
				return false;
			}
        });
		$('#90dayfilter').live('click',function () {
			if(!$(this).hasClass('disabled')){
				//$('.expand-collapse ul li a').addClass('disabled').css({'color':'#999999'});
				//ice.orderhistory.resetOrderHistory();
				ice.orderhistory.set90days();
				ice.orderhistory.reloadDatatable(ninetydaysFilterUrl);
				return false;
			}
        });
		$('#30dayfilter').live('click',function () {
			if(!$(this).hasClass('disabled')){
				//$('.expand-collapse ul li a').addClass('disabled').css({'color':'#999999'});
				//ice.orderhistory.resetOrderHistory();
				ice.orderhistory.set30days();
				ice.orderhistory.reloadDatatable(loadOrderHistoryDataUrl); 
				return false;
			}
        });
		myvmware.common.putplaceHolder('.txt_datepicker');
		
		$('#filterAreaDiv .onoff').live('click',function() {
			var $this = $(this);
			ice.orderhistory.setDateRange($this.val(),$(this).parent('div.date_filter_o'));			
		});
		if($('#filterAreaDiv input[name=date_range]:checked')){
			ice.orderhistory.setDateRange($('#filterAreaDiv input[name=date_range]:checked').val(),$('#filterAreaDiv input[name=date_range]:checked').parent('div.date_filter_o'));
		}
    },
	setDateRange: function(val,divName){
		$('div.date_filter_o').removeClass('active');
		if(val == 'daterange'){
			$('select#sel_date_range').removeAttr('disabled');
			$('.secondRow .txt_datepicker').datePicker();
			$('.secondRow .txt_datepicker').dpSetDisabled(true);
			$(divName).addClass('active');
		}else{
			$('select#sel_date_range').attr('disabled','disabled');
			$('.secondRow .txt_datepicker').datePicker();
			$('.secondRow .txt_datepicker').dpSetDisabled(false);
			myvmware.common.putplaceHolder('.txt_datepicker')
			$(divName).addClass('active');
		}
	},
	zeroPad : function(num) {
		var s = '0'+num;
		return s.substring(s.length-2)
	},
	loadCalendar: function () {
		var eDate = new Date();
		var endDateFinal = eDate.getFullYear()+'-'+ice.orderhistory.zeroPad(eDate.getMonth()+1)+'-'+ice.orderhistory.zeroPad(eDate.getDate());
		var _startDate = vmf.dom.id("txt_orderDate_from");
		var _endDate = vmf.dom.id("txt_orderDate_to");
		vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
			dateFormat: 'yyyy-mm-dd',
			startDate: '1900-01-01',
			endDate : endDateFinal
		});
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
	loadOrderHistory: function () {		
		$('#loadingerrormsg').hide();
		ice.orderhistory.reloadDatatable(loadOrderHistoryDataUrl); 
    },
	 clearTable: function(tableId,errorText){
		table = $('#'+tableId).dataTable();
		table.fnClearTable(); 
		table.find('tbody tr').css("height","150px").addClass('noborder default')
		     .find('td.dataTables_empty').html('<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+errorText+'</p></div></div>');
	},
	 postProcessingData: function(table, settings, _json){ 
		var _errorText;	
		
		$('#exportAllToCsvButton').show();
		
		if(settings.fnRecordsTotal() == 25 || settings.fnRecordsTotal() > 25) $("#showMoreId").show();				
		else $("#showMoreId").hide();				
		if (_json == null || _json == '{}' || _json=='undefined' || _json.error) {		            				                							
			if(_json.error){
				var _msg = _json.message;
				$('#loadingerrormsg').hide();
				if(_msg == maxAllowedMsg){
					$('#error_message').html(_msg);
					$('#filtererror').html('');
					vmf.modal.show("errorpopup");
					return false;
				}else if(_msg == "XXVM-EMS-ORD-HIS-02"){//19609
					$('#error_message').html(invalidorderMsg);
					$('#filtererror').html('');
					vmf.modal.show("errorpopup");
					return false;
				}
			}else{
				_errorText=loadingError; // loadingError= 'Error in loading'			
				ice.orderhistory.clearTable('dataTableWrapper',_errorText);			
			}			
		}else if(settings.fnRecordsTotal() == 0){ 
			if(_json.isAllowed==false){		
     			        var locale = $('#localeFromLiferayTheme').text().split("_");
			        var currentLocale = (locale[0].toLowerCase() == 'en') ? '' : '/' + locale[1].toLowerCase();
			        var uapLink = currentLocale + '/group/vmware/users-permissions';					
				$('#exportAllToCsvButton').hide();
				_errorText = '<p class="topPara">'+ErrorMessageNoPermission1+'</p><p class="sub_line">'+ErrorMessageNoPermission4+' <a href="'+ uapLink +'" id="MyPermission"> '+ErrorMessageNoPermission2+' </a> '+ErrorMessageNoPermission3+'</p>';
				ice.orderhistory.clearTable('dataTableWrapper',_errorText);	
			} else {
				_errorText=noDataMsg;
				ice.orderhistory.clearTable('dataTableWrapper',_errorText);			
			}
		} 
		else if(settings.fnRecordsTotal() > 0){
     		        var locale = $('#localeFromLiferayTheme').text().split("_");
			var currentLocale = (locale[0].toLowerCase() == 'en') ? '' : '/' + locale[1].toLowerCase();
			var uapLink = currentLocale + '/group/vmware/users-permissions';		
			var _contractHistoryResponse = _json.aaData;
			var _permissionAssigned = _json.isAllowed;
			if (_permissionAssigned == false){	
				_errorText = '<p class="topPara">'+ErrorMessageNoPermission1+' </p><p class="sub_line">'+ErrorMessageNoPermission4+' <a href="'+ uapLink +'" id="MyPermission"> '+ErrorMessageNoPermission2+' </a> '+ErrorMessageNoPermission3+'</p>';
				ice.orderhistory.clearTable('dataTableWrapper',_errorText);		
			}						
		}
		/*switch($("#sel_date_range").val()){ Fix for BUG-00047002
			case "Last 30 days": ice.orderhistory.set30days(); break;
			case "Last 60 days": ice.orderhistory.set60days(); break;
			case "Last 90 days": ice.orderhistory.set90days(); break;
			default: ice.orderhistory.resetDays();
		}*/
	},
    onFailLoadOrderHistory: function (data) {
        $('#loading').hide();
        $('#loadingerrormsg').show();
    },
    showExceptionMessages: function () {
        $('#loadingerrormsg').show();
    },
    orderHistoryData: function () {		
        vmf.datatable.build($('#dataTableWrapper'), {
            "aoColumns": [{ "sTitle": '<span class="descending">'+orderIdHeader+'</span>', "asSorting": [ "desc", "asc" ],"sWidth" : "120px" }, {"sTitle": '<span class="descending">'+orderDateHeader+'</span>',"sWidth" : "120px"}, {"sTitle": '<span class="descending">'+poNumberHeader+'</span>',"sWidth" : "120px"}, {"sTitle": contractId, "bSortable": false,"sWidth" : "120px"}, {"sTitle": ""}],
            "bServerSide": false,
            "bFilter": false,
            "aaData": [],
			"bAutoWidth": false,
			"bProcessing":true,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
			"iDisplayLength": 10, 
			"oLanguage": {
				"sProcessing" : loadingTxt,
				"sLoadingRecords":"",
				"sLengthMenu": "<label>"+orderhistory.globalVar.itemsPerPage+"</label> _MENU_",
				"sInfo": orderhistory.globalVar.recordsInfo,
				"sInfoEmpty": orderhistory.globalVar.recordsEmpty,
				"sInfoFiltered": orderhistory.globalVar.recordsFiltered,
				"sEmptyTable":'',
				"oPaginate": {
		    					"sPrevious": orderhistory.globalVar.DtablesPrevious,
		    					"sNext": orderhistory.globalVar.DtablesNext, 
		    					"sLast": orderhistory.globalVar.DtablesLast, 
		    					"sFirst": orderhistory.globalVar.DtablesFirst
			      				}  
			},
			"sDom": 'zrt<"bottom"lpi<"clear">>',
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){				
					var newHtml=new Array();
					//$(nRow).data("orderNumber", aData[0]).data("orderId",aData[4]).find('td:eq(5)').append(newHtml.join(' '));		
					//BUG-00052407-Encrypted OrderId and Order Number
					$(nRow).data("orderNumber", aData[0]).data("orderId",aData[5]).data("encryptedOrderNumber",aData[6]).find('td:eq(5)').append(newHtml.join(' '));		
					//$(nRow).data("orderNumber", aData[0]).data("orderId",aData[4]).find('td:eq(5)').append(newHtml.join(' '));
					newHtml=[];
				}
				var ex = (aData[7].toUpperCase() == 'Y') ? '<span class="badge ela" title="Enterprise Licensing Agreement">ELA</span>' :''
				var data = '<span class="orderNumber">'+$(nRow).find('td:eq(0)').html()+'</span>' + ex;
				$(nRow).find('td:eq(0)').html(data);
				return nRow;
			},	
			"fnInitComplete": function () {
				if (!$('#dataTableWrapper tbody tr td').hasClass('dataTables_empty')) {
					ice.orderhistory.parseOrderHistoryTable();
					$('#export').removeAttr('disabled');
				}
				if(!this.fnSettings().fnRecordsTotal()){
					//$("#dataTableWrapper_paginate").css("display", "none");
					//$("#dataTableWrapper_length, #dataTableWrapper_info")
					$('.bottom').hide();		
				}	
				else				
					$('.bottom').show();
				//$('.expand-collapse ul li a').removeClass('disabled').css({'color':'#A7E4FF'});
			},
			"fnDrawCallback": function() {
				 var dtd=this;
				$('.activitiesLog').removeClass('bottomarea');
				if(!$(dtd).find('tfoot').length)
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="4"></td></tr></tfoot>');								
				ice.orderhistory.parseOrderHistoryTable();				
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#dataTableWrapper_paginate").css("display", "block");
				} else {
					$("#dataTableWrapper_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#dataTableWrapper_length option:eq(0)").val(),10)){
					$("#dataTableWrapper_length").css("display", "block");
				} else {
					$("#dataTableWrapper_length").css("display", "none");
				}												
				this.fnSetColumnVis(4,false);
				if ($(this).find('tbody tr').length ==1 && $(this).find('tbody tr td').hasClass('dataTables_empty')){
					$(this).find('tbody tr').css("height","150px").addClass('noborder default');					
				}
				vmf.datatable.addEllipsis();
			}//,
			//"bStateSave": true
        });
     },
	loadFilterForm: function (exportFlag) {        
		var _filterconfig = new Object(),cnt = 0,specialCharCount = 0;
		var _intRegex = /^\d+$/; 
		_filterconfig.filterFormId = "orderHistoryFilterForm";
		$('#error_message').html('');
		var _formValid = $("#orderHistoryFilterForm").valid();
		if (_formValid) {
			if(jQuery.trim($("#product").val())!=''){
				var _iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?";
				for (var i = 0; i < jQuery.trim($("#product").val()).length; i++) {    
					if (_iChars.indexOf(jQuery.trim($("#product").val()).charAt(i)) != -1) {    
						specialCharCount++;        
					}   	
				}
				if(specialCharCount>0){
					cnt++;
					$('#error_message').html(validatorMsg1);
					vmf.modal.show("errorpopup"); 
					return false;
				}
			}
			if($('#orderId').val()!=''){
				if(!_intRegex.test($('#orderId').val())){
					cnt++;
					$('#error_message').html(orderhistory.globalVar.enterNumMsg);
					vmf.modal.show("errorpopup");
					return false;
				}
			}
			if($('#contractId').val()!=''){
				if(!_intRegex.test($('#contractId').val())){
					cnt++;
					$('#error_message').html(orderhistory.globalVar.enterNumMsg);
					vmf.modal.show("errorpopup");
					return false;
				}
			}
			
			if (!$("#txt_orderDate_from").attr("disabled") && !$("#txt_orderDate_to").attr("disabled")) {
				if((($("#txt_orderDate_from").val() != '' || $("#txt_orderDate_from").val() != 'YYYY-MM-DD') 
										&& ($("#txt_orderDate_to").val() == '' || $("#txt_orderDate_to").val() == 'YYYY-MM-DD')) 
					|| (($("#txt_orderDate_from").val() == '' || $("#txt_orderDate_from").val() == 'YYYY-MM-DD')
										&& ($("#txt_orderDate_to").val() != '' || $("#txt_orderDate_to").val() != 'YYYY-MM-DD'))){
					var _currentTime = new Date();
					var _month = _currentTime.getMonth() +1;
					var _day = _currentTime.getDate();
					var _year = _currentTime.getFullYear();
					_currentDate	=	_year + "-" +_month + "-" + _day;
					var _currentDateValue = new Date(_currentDate);
					var _currentDateValuecmp = _currentDateValue.getTime();
					var _startDateValue = new Date($("#txt_orderDate_from").val());
					var _startDateValuecmp = _startDateValue.getTime();
					if(($("#txt_orderDate_to").val() == '') && (_startDateValuecmp < _currentDateValuecmp)){
						$("#txt_orderDate_to").val(_currentDate);
						//ice.orderhistory.loadFilteredData();
					}else{
						cnt++;
						$('#error_message').html(validatorMsg3);
						vmf.modal.show("errorpopup");
						return false;
					}
				} 
			}
			if(jQuery.trim($("#txt_orderDate_from").val())!='YYYY-MM-DD' && jQuery.trim($("#txt_orderDate_to").val())!='YYYY-MM-DD') {
				var _startDateValue = new Date($("#txt_orderDate_from").val());
				var _startDateValuecmp = _startDateValue.getTime();
				var _endDateValue = new Date($("#txt_orderDate_to").val());
				var _endDateValuecmp = _endDateValue.getTime();
				var _patt = /^\d{4}-\d{1,2}-\d{1,2}$/;
				if(_patt.test($("#txt_orderDate_from").val()) && _patt.test($("#txt_orderDate_to").val())){
					if(_startDateValuecmp > _endDateValuecmp){
						cnt++;
						$('#error_message').html(validatorMsg4);
						vmf.modal.show("errorpopup");
						return false;
					} 
				} else {
					cnt++;
					$('#error_message').html(validatorMsg5);
					vmf.modal.show("errorpopup");
					return false;
				}
			}
			
			if(exportFlag){
					var flag = false;
					if($("#txt_orderDate_from").attr("disabled")) {

						var dates = ice.orderhistory.getDates();
						$("#txt_orderDate_from").attr("disabled",false);
						$("#txt_orderDate_to").attr("disabled",false);
						
						$("#txt_orderDate_from").val(dates.fDate);
						$("#txt_orderDate_to").val(dates.toDate);
					} else {
						flag = true;
					}
				var _fPerPostData = $("#orderHistoryFilterForm").serialize();
				myvmware.common.generateCSVreports(exportAllToCsvUrl1, _fPerPostData, "order-history : export-all", "order-history : Export-to-CSV : Error");
				
				/*var _exportAllToCsvUrl = exportAllToCsvUrl1 + '&reportFor=fromOrderHistoryExportAll';
				if($('body iframe').length==0){
					$('<iframe name="iframe_exportCSV" id="iframe_exportCSV" style="display: none;" />').appendTo('body');
				}
				$('#orderHistoryFilterForm').attr('action',_exportAllToCsvUrl).attr('target','iframe_exportCSV');
				$('#orderHistoryFilterForm').submit();*/
				
				if(!flag) { //when the user selects eventDate from the date filter then we should not remove the form values.
					$("#txt_orderDate_from").val('YYYY-MM-DD').addClass("hasPlaceholder");
					$("#txt_orderDate_to").val('YYYY-MM-DD').addClass("hasPlaceholder");
					$("#txt_orderDate_from").attr("disabled",true);
					$("#txt_orderDate_to").attr("disabled",true);
				}
			
				//$('#iframe_exportCSV').remove();
			} else {
				if(cnt>0){return false;} 
				else {ice.orderhistory.loadFilteredData();};
			};
		};
	},
	loadFilteredData: function () {
		$('#loadingerrormsg').hide();
		var _postDataUrl = $("#orderHistoryFilterForm").serialize();
		var _filterDataUrl = loadOrderHistoryFilterUrl +'&' + _postDataUrl;
		ice.orderhistory.reloadDatatable(_filterDataUrl); // reload datatable
	},
	getDates:function(){
		var range =$('div.expand-collapse ul li.active').attr('id');
		var days = 30;
		days  =(/60/i.test(range))?60:days;
		days  =(/90/i.test(range))?90:days;
		var newdate = new Date();
		obj = {};
		obj.toDate =   newdate.getFullYear()+"-"+(parseInt(newdate.getMonth())+1)+"-"+newdate.getDate();
		newdate.setDate(newdate.getDate() - days);
		var nd = new Date(newdate);
		obj.fDate= nd.getFullYear()+"-"+(parseInt(nd.getMonth())+1)+"-"+nd.getDate();
		return obj;
	},		
    resetOrderHistory: function () {
		$('#loading').show();
		$('#loadingerrormsg').hide();
		ice.orderhistory.clearFilterDatas(); // clear the data which are in the text box dropdown in the filter section
		ice.orderhistory.reloadDatatable(loadOrderHistoryDataUrl); // reload datatable
    },
	parseOrderHistoryTable: function(){
		$('#dataTableWrapper tbody tr').each(function (index) {
			var _orderNumber = $(this).data('orderNumber');
			//$(this).find('td:nth-child(1)').html('');
			var _orderId = $(this).data('orderId'); 
			//BUG-00052407 to build URL with encrypted contract Id
			var _encryptedOrderNumber = $(this).data('encryptedOrderNumber');
			var _viewOrderDetailsCall = viewOrderDetailsUrl + '&orderId=' + _orderId +'&ordernumber=' + _encryptedOrderNumber;
			$(this).find('td:nth-child(1) span.orderNumber').html("<a href=" + _viewOrderDetailsCall + ">" + _orderNumber + "</a>");			
		});
	},
	loadFilter: function () {
        $('#removeFilter').show();
        $('#addFilter').hide();
        $('#filterAreaDiv').show();
    },
	closeFilter: function () {
        $('#removeFilter').hide();
        $('#addFilter').show();
        $('#filterAreaDiv').hide();
    },
	reloadDatatable : function(url){
		$('.activitiesLog').addClass('bottomarea');
		$('.bottom').hide();
		vmf.datatable.reload($('#dataTableWrapper'), url, ice.orderhistory.postProcessingData);
	},
	set30days: function(){
		$("#30daylist").html(link30dayText).addClass("active");
		$("#60daylist").html('<a id="60dayfilter" href="#">'+link60dayText+'</a>').removeClass('active');
		$("#90dayslist").html('<a id="90dayfilter" href="#">'+link90dayText+'</a>').removeClass('active');
		document.getElementById('sel_date_range').selectedIndex=1;
		
		$('#filterAreaDiv input[name=date_range]').eq(0).trigger('click');
	},
	set60days: function(){
		$("#30daylist").html('<a id="30dayfilter" href="#">'+link30dayText+'</a>').removeClass('active');
		$("#60daylist").html(link60dayText).addClass("active");
		$("#90dayslist").html('<a id="90dayfilter" href="#">'+link90dayText+'</a>').removeClass('active');
		document.getElementById('sel_date_range').selectedIndex=2;

		$('#filterAreaDiv input[name=date_range]').eq(0).trigger('click');
	},
	set90days: function(){
		$("#30daylist").html('<a id="30dayfilter" href="#">'+link30dayText+'</a>').removeClass('active');
		$("#60daylist").html('<a id="60dayfilter" href="#">'+link60dayText+'</a>').removeClass('active');
		$("#90dayslist").html(link90dayText).addClass("active");
		document.getElementById('sel_date_range').selectedIndex=3;
		
		$('#filterAreaDiv input[name=date_range]').eq(0).trigger('click');
	},
	resetDays: function(){
		$("#30daylist").html('<a id="30dayfilter" href="#">'+link30dayText+'</a>').removeClass('active');
		$("#60daylist").html('<a id="60dayfilter" href="#">'+link60dayText+'</a>').removeClass('active');
		$("#90dayslist").html('<a id="90dayfilter" href="#">'+link90dayText+'</a>').removeClass('active');
		document.getElementById('sel_date_range').selectedIndex=0;
		$("#txt_orderDate_from").val('YYYY-MM-DD').addClass("hasPlaceholder");
		$("#txt_orderDate_to").val('YYYY-MM-DD').addClass("hasPlaceholder");
	},
	setCalendarDate:function(oldDay){
		var myDate=new Date();
		myDate.setDate(myDate.getDate()-parseInt(oldDay,10));
		var curr_month =myDate.getMonth()+1;
		if(curr_month < 10)	curr_month = "0"+curr_month;			
		var thirty_date = myDate.getDate();
		if(thirty_date < 10) thirty_date = "0"+thirty_date;
		var _dateMsg = myDate.getFullYear()+'-'+curr_month + '-' +thirty_date;
		$('#txt_orderDate_from').val(_dateMsg).removeClass('hasPlaceholder');
		vmf.calendar.setDisplayMonth("#txt_orderDate_from",myDate.getMonth(),myDate.getFullYear());
		vmf.calendar.setDate("#txt_orderDate_from",_dateMsg);
	},	
	clearFilterDatas : function(){
		$("#txt_orderDate_from").val('YYYY-MM-DD').addClass("hasPlaceholder");
		$("#txt_orderDate_to").val('YYYY-MM-DD').addClass("hasPlaceholder");
		$("#orderId").val('');
		$("#product").val('');
		$("#poNumber").val('');
		$("#contractId").val('');
		ice.orderhistory.set30days();
	}
};
