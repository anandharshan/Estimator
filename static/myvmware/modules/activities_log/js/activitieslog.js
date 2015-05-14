vmf.ns.use("ice");
ice.activitieslog = {
	contractHistoryUrl:null,
	orderHistoryUrl:null,
	loadActivityLog:null,
	dateAndTime:null,
	category:null,
	eventType:null,
	user:null,
	activity:null,
	populateEventTypeUrl:null,
	applyFilterUrl:null,	
	loadingError:null,
	noDataMsg:null,
	loadExpandedView:null,
	viewContractDetails:null,
	orderDetailsUrlData:null,
	link1DayText:null,
	link7DayText:null,
	link30DayText:null,
	originalState:null,
	eppOption:null,
	filterOn:false,
    init: function (ordHisUrl,contractUrl,loadActvLog,dttime,catagry,evnttype,User,activty,evenTypeUrl,applyFltUrl,exprtCsv,loaderr,noDMsg,loadExndedView,viewContractDetailsUrl,orderDetailsUrl, link1Day, link7Day, link30Day, exportAllToCsvUrl) {
		vmf.scEvent = true;
		callBack.addsc({'f':'riaLinkmy','args':['activities-log']});
		contractHistoryUrl = contractUrl;
		orderHistoryUrl = ordHisUrl;
		loadActivityLog = loadActvLog;
		dateAndTime = dttime;
		category = catagry;
		eventType = evnttype;
		user = User;
		activity = activty;
		populateEventTypeUrl = evenTypeUrl;
		applyFilterUrl=applyFltUrl;	
		exportAllToCsvUrl1 = exportAllToCsvUrl;		
		loadingError = loaderr;
		noDataMsg= noDMsg;
		loadExpandedView=loadExndedView;
		viewContractDetails=viewContractDetailsUrl;
		orderDetailsUrlData=orderDetailsUrl;
		link1DayText = link1Day; 
		link7DayText = link7Day; 
		link30DayText = link30Day;
		_activityResponse =[];
		ice.activitieslog.originalState =$('#licenseKeyField').is(':visible');
		//ice.activitieslog.get1DayCurrentDate();
		$('#7dayfilter').live('click', ice.activitieslog.click7dayfilter);
		$('#30daysfilter').live('click', ice.activitieslog.click30dayfilter);
		$('#orderHistory').click(function () { window.location = orderHistoryUrl; return false; });
		$('#contractHistory').click(function () { window.location = contractUrl; return false; });
		$('#select_category').change(function () {
			var _category = $('#select_category').val();
			var _url = populateEventTypeUrl+'&category=' + _category;
			$('#applyFilter').attr('disabled', 'disabled').addClass('disabled');
			$("#select_eventType").html('<option>'+ice.activitieslog.showloading()+'</option>');
			$("#select_user").html('<option>'+ice.activitieslog.showloading()+'</option>');
			
			if((_category == 'EPP' || _category =='CCP') && $('#licenseKeyField').is(':visible'))
				$('#licenseKeyField').hide();
            else if(_category != 'EPP' && _category != 'CCP' && $('#licenseKeyField').is(':hidden') && ice.activitieslog.originalState)
				$('#licenseKeyField').show();
				
			// FR-00012559-045 for April release fix.		
			if( _category == 'CCP' ) {
				$('#exportAllToCsvButton').hide();
			} else {
				$('#exportAllToCsvButton').show();
			}
			
			vmf.ajax.post(_url, null, ice.activitieslog.onSuccessLoadEventType, ice.activitieslog.onFailLoadEventType);
        });
		
		$("#txt_orderDate_from").attr('autocomplete',"off");
		$("#txt_orderDate_to").attr('autocomplete',"off");
		
		$("#txt_orderDate_from").live("keyup change", function () {
			ice.activitieslog.validate90Days();
		});
		
		$("#txt_orderDate_to").live("keyup change", function () {
			ice.activitieslog.validate90Days();
		});
		
		$('div#activityLodingDiv').hide();
		$('div#activityDiv').show();
		ice.activitieslog.renderActivityLogDataTable(_activityResponse); // BUILDING EMPTY DATATABLE
		ice.activitieslog.getContractInfoAndLoad();		
		/*$('#export').click(function () { // SINCE EXPORT BUTON IS NOT AVAILABLE, SO COMMENTING THE CODES
            window.location = exportCSVUrl;
			return false;
       });*/
	   /* BUG-00050840 start */
		$('#exportAllToCsvButton').attr('title',expTpText);
	    myvmware.hoverContent.bindEvents($('#exportAllToCsvButton'), 'funcleft');
		/* BUG-00050840 end */
	   $('#exportAllToCsvButton').click(function () { ice.activitieslog.loadFilterForm(true); return false; });	 
	   
	   $('#applyFilter').click(function () { ice.activitieslog.loadFilterForm(false);ice.activitieslog.filterOn = true; return false; });	
		$('#addFilter').click(function () { ice.activitieslog.loadFilter(); return false; });
		$('#removeFilter').click(function () { ice.activitieslog.closeFilter(); return false; });
		$('#reset').click(function () {
			$("#select_category, #select_eventType, #select_user").attr('selectedIndex', 0);			
			$("#txt_orderDate_from, #txt_orderDate_to").val('');						
			if($("#license_key")) $("#license_key").val("");			
			ice.activitieslog.resetActivitieslogFilter();	
			$('#list1day').html(link1DayText);
			$('#list7day').html('<a id="7dayfilter" href="#">'+link7DayText+'</a>');
			$('#list30day').html('<a id="30daysfilter" href="#">'+link30DayText+'</a>');
			//ice.activitieslog.get1DayCurrentDate();
			return false;
        });	
		$('#modal_hide').click(function () { vmf.modal.hide("errorpopup"); });
		$("#showMoreId").click(function() { ice.activitieslog.showMorePopulate(); return false; });
		$('#select_category').trigger('change');
		ice.activitieslog.eppOption = $('#eppKeyOption').html();
    },
	validate90Days: function(){
		var startDate = jQuery.trim($("#txt_orderDate_from").val());
        var endDate = jQuery.trim($("#txt_orderDate_to").val());
		var _patt = /^\d{4}-\d{1,2}-\d{1,2}$/;

		if((startDate != "" && endDate != "") && (_patt.test(startDate) && _patt.test(endDate))){
			var dateFragementsSD = startDate.split('-');
			var dateFragementsED = endDate.split('-');
			dateFragementsSD[1] = ice.activitieslog.datepad(dateFragementsSD[1]-1,2);
			dateFragementsED[1] = ice.activitieslog.datepad(dateFragementsED[1]-1,2);
			
			startDate = new Date(dateFragementsSD[0],dateFragementsSD[1] , dateFragementsSD[2]);
			endDate = new Date(dateFragementsED[0] , dateFragementsED[1], dateFragementsED[2]);
			
			var diff =  Math.floor(( endDate - startDate ) / 86400000); 

				if(diff > 90){
					$('#dateRangeNientyInfo').hide();
					$('#dateRangeNienty').show();
					$('#applyFilter').attr('disabled', 'disabled').addClass('disabled');
					
				}else{
					$('#dateRangeNienty').hide();
					$('#dateRangeNientyInfo').show();
					$('#applyFilter').removeAttr('disabled', 'disabled').removeClass('disabled');
				}
		}else{
			$('#dateRangeNienty').hide();
			$('#dateRangeNientyInfo').show();
			$('#applyFilter').removeAttr('disabled', 'disabled').removeClass('disabled');
		}		
	},
	datepad: function (num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	},
	loadCalendar: function () {
			// Local variables to hold calendar elements
            var _startDate = vmf.dom.id("txt_orderDate_from");
            var _endDate = vmf.dom.id("txt_orderDate_to");
            // Initialize the calendars
            vmf.calendar.build(vmf.dom.get(".txt_datepicker"), { dateFormat: 'yyyy-mm-dd', startDate: '1900-01-01' });
            // Bind event handler to the startDate calendar
            vmf.dom.addHandler(_startDate, "dpClosed", function (e, selectedDate) {
                var d = selectedDate[0];
                if (d) {
                    d = new Date(d);
                    vmf.calendar.setStartDate(_endDate, d.addDays(1).asString());
                }
            });			
            // Bind event handler to the endDate calendar
            vmf.dom.addHandler(_endDate, "dpClosed", function (e, selectedDate) {
                var d = selectedDate[0];
                if (d) {
                    d = new Date(d);
                    vmf.calendar.setEndDate(_startDate, d.addDays(-1).asString());
                }
            });		
	},
   /* LoadActivityLog: function () {
	    $('#showMoreId').hide();				
		vmf.ajax.post(loadActivityLog, null, ice.activitieslog.onSuccessLoadActivityLog, ice.activitieslog.onFailLoadActivityLog);		
    },*/
	LoadActivityLog: function () {
		$('#showMoreId').hide();		
		vmf.datatable.reload($('#dataTableWrapper'), loadActivityLog, ice.activitieslog.postProcessingData);		
	},
	showExceptionMessages: function () {
        $('#loadingerrormsg').show();
    },
	/*onFailLoadActivityLog: function (data) {
	    $("#showMoreId").hide();        
        $('#loadingerrormsg').show();		
    },*/
	onSuccessLoadEventType: function (data) {
	    var _jsonResponse = vmf.json.txtToObj(data);
		if(_jsonResponse.error){
		$("select#select_eventType").html("");
		$("select#select_user").html("");
	    }else{
		var eventTypeRes = _jsonResponse.eventTypeList;
		var userRes = _jsonResponse.userList;
		var userResLen = userRes.length;
		var eventTypeResLen = eventTypeRes.length;
		var options = '<option value="">'+ice.globalVars.allLbl+'</option>';
		var _userSelect= '<option value="">'+ice.globalVars.allLbl+'</option>';
		for(var i = 0; i < userResLen; i++)	{
			if(userRes[i].firstName != "" || userRes[i].lastName != "")	
				_userSelect+='<option value="' + userRes[i].email + '">' + userRes[i].firstName+' '+userRes[i].lastName + '</option>';			
		}
		if($('#select_category').val() == 'CCP'){
			var optionGroups = vmf.json.txtToObj(optionGroupsData);			
			for(var k1=0; k1<optionGroups.length; k1++)
			{
				options += '<optgroup label="' + optionGroups[k1][0] + '">';
				for(var k2=1; k2<optionGroups[k1].length; k2++)
				{
					for(var i = 0; i < eventTypeResLen; i++){
						if(eventTypeRes[i].eventTypeCode == optionGroups[k1][k2]) 
							options += '<option value="' + eventTypeRes[i].eventTypeCode + '">' + eventTypeRes[i].eventTypeDesc + '</option>';
					}
				}
				options += '</optgroup >';
			}			
		}
		else {
			for(var i = 0; i < eventTypeResLen; i++)	{
				if(eventTypeRes[i].eventTypeDesc != "") 
					options += '<option value="' + eventTypeRes[i].eventTypeCode + '">' + eventTypeRes[i].eventTypeDesc + '</option>';			
			}
		}	
		$("select#select_eventType").html(options);
		$("select#select_user").html(_userSelect);
		$('#applyFilter').removeAttr('disabled', 'disabled').removeClass('disabled');
		}
	},
	onFailLoadEventType: function (data) {        
		$('#applyFilter').removeAttr('disabled', 'disabled').removeClass('disabled');
        $('#loadingerrormsg').show();
    },	
	renderActivityLogDataTable: function (data) {
		var _expand;
        vmf.datatable.build($('#dataTableWrapper'), {
            "aoColumns": [{
                "sTitle": "","sWidth" : "5px"
            },{
                "sTitle": '<span class="descending">'+ dateAndTime +'</span>',"sWidth" : "120px"
            }, {
                "sTitle": '<span class="descending">'+ user +'</span>',"sWidth" : "80px"
            }, {
                "sTitle": '<span class="descending">'+category+'</span>',"sWidth" : "95px"
            }, {
                "sTitle": '<span class="descending">'+eventType+'</span>',"sWidth" : "90px"
			}, {
                "sTitle": '<span class="descending">'+activity+'</span>',"sWidth" : "150px"
            },{
                "sTitle": "","bVisible":false
            }],
            "bInfo": false,
            "bServerSide": false,
            "sScrollY": 450,
            "bFilter": false,
            "aaData": data,
			"bAutoWidth": false,
			"sDom" : 'zrtSpi',
			"bProcessing":true,
			"oLanguage": {
					"sProcessing" : loadingTxt,
					"sLoadingRecords":"",
					"sEmptyTable":''
					//"sLengthMenu": "<label>Items per page</label> _MENU_",
					//"sZeroRecords": "Nothing found - sorry",
					//"sInfo": "_START_ - _END_ of _TOTAL_ results",
					//"sInfoEmpty": "0 - 0 of 0 results",
					//"sInfoFiltered": "(filtered from _MAX_ total records)"
			},	
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){				
				var newHtml=new Array()					
					$(nRow).data("auditId",aData[6])
						   .find('td:eq(0)').append(newHtml.join(' '));		
					newHtml=[];
				}
				//aData[5]=aData[5].replace(/</g,"&lt;").replace(/>/g,"&gt;")
				/*aData[5]=aData[5].replace(/[^\s]{15,}/gi,function(str){
						return vmf.wordwrap(str,2);
				});*/ //Doing word wrap for words more than 15 characters
				aData[5]=aData[5].replace(/&lt;/g,"<").replace(/&gt;/g,">");
				aData[5]=aData[5].replace(/\w+/g,function(str){
					if (str.length>15) return vmf.wordwrap(str,2);
					else return str;
				}); //Doing word wrap for words more than 15 characters
				$(nRow).find('td:nth-child(6)').html(aData[5]);
				return nRow;
			},	
			"fnDrawCallback": function(){				
				//this.fnSetColumnVis(6,false);
			},			
			"fnInitComplete": function () {
				_tbl = this;
				if(this.closest('div.dataTables_scrollBody')[0] && this.closest('div.dataTables_scrollBody').attr('style').toLowerCase().indexOf('overflow')!=-1){
					this.closest('div').css("overflow-y","scroll");
					setTimeout(function() {_tbl.fnAdjustColumnSizing(false);}, 100);
				}								
				var _rowCount = data.length; 				
				 if (!$('#dataTableWrapper tbody tr td').hasClass('dataTables_empty')) {
                	$('#export').removeAttr('disabled');
		         }	
				$('.dataTables_scrollBody #dataTableWrapper tbody tr').each(function (index) {				
					if($(this).find('td:nth-child(5)').text() == "License Key Divided" || $(this).find('td:nth-child(5)').text() == "License Key Combined" || $(this).find('td:nth-child(5)').text() == "License Keys Deactivated" || $(this).find('td:nth-child(5)').text() == "Subscription Upgraded" || $(this).find('td:nth-child(5)').text() == "Downgrade" || $(this).find('td:nth-child(5)').text() == "Entitlement Management"  || $(this).find('td:nth-child(5)').text() == "License Adjustment"|| $(this).find('td:nth-child(5)').text() == "License Transfer" || $(this).find('td:nth-child(5)').text() == "License Transferred To" || $(this).find('td:nth-child(5)').text() == "Base key deactivation audit for Returns" || $(this).find('td:nth-child(5)').text() == "Restricted Downgrade" || $(this).find('td:nth-child(5)').text() == "Restricted Upgrade" || $(this).find('td:nth-child(5)').text() == "RollBack Fulfillment"  || $(this).find('td:nth-child(5)').text() == "License Keys Deactivated - Bundle" || $(this).find('td:nth-child(5)').text() == "License Key Moved" || $(this).find('td:nth-child(5)').text() == "New Order" || $(this).find('td:nth-child(5)').text() == "Adjustment Fulfillment" || $(this).find('td:nth-child(5)').text() == "Renewal Method changed" || $(this).find('td:nth-child(5)').text() == "Service - Auto Renew" || $(this).find('td:nth-child(5)').text() == "Subscription Service Renewed" || $(this).find('td:nth-child(5)').text() == "Add-On Request Declined" || $(this).find('td:nth-child(5)').text() == "Subscription Service Status Changed" || $(this).find('td:nth-child(5)').text() == "TGP Fulfillment" || $(this).find('td:nth-child(5)').text() == "Network Connectivity Form Completed" || $(this).find('td:nth-child(5)').text() == "New Service Owner Requested" || $(this).find('td:nth-child(5)').text() == "Service Owner Change Confirmed" || $(this).find('td:nth-child(5)').text() == "Service Owner Request Pending" || $(this).find('td:nth-child(5)').text() == "Service Owner Request Rejected" || $(this).find('td:nth-child(5)').text() == "Deployment Worksheet Completed" || $(this).find('td:nth-child(5)').text() == "Service Owner Request Expired" || $(this).find('td:nth-child(5)').text() == "Usage of resources has begun" || $(this).find('td:nth-child(5)').text() == "ODT Web Form Completed" ) {//BUG-00025015
						 _expand = "found"; 
						 $(this).find('td:nth-child(1)').append('<div class="openCloseSelect"><a class="openClose" href="javascript:void(0);">&nbsp;</a></div>');											
					}
					if(_expand != "found"){
						//$('.dataTables_scrollBody #dataTableWrapper tbody tr').find('td:nth-child(0)').hide();
						//$('.dataTables_scrollHeadInner thead tr').find('th:nth-child(0)').hide();
						//$('.dataTables_scrollBody #dataTableWrapper thead tr').find('th:nth-child(0)').hide();							
					}                   
                });								
				var orderDetailsView = $('#activityLogGrid #dataTableWrapper'); 
				orderDetailsView.find('.openCloseSelect a').click(function(){ 
		    		var _$a = $(this);
					var _nTr = this.parentNode.parentNode.parentNode; 
					
					if (_$a.hasClass('open') && _nTr.haveData){//This row is already open - close it 
						_$a.removeClass('open');
						$(_nTr).next("tr").hide();
						$( _nTr).removeClass('opened');
					}else{
						//Open this row 
						_$a.addClass('open');	
						if(!_nTr.haveData){
							_tbl.fnOpen(_nTr,ice.activitieslog.showloading(), '');
							var _auditId = $(_nTr).data("auditId");
							//_newRowRender='';
							ice.activitieslog.getRoworderdetails(_auditId,_nTr);
							_nTr.haveData	 = true;    
						}else
							$(_nTr).next("tr").show();
							
						$( _nTr).addClass('opened');
					};return false;
				});					
			},			            
            "bPaginate" : false,
			"sPaginationType" : "full_numbers",
			"iDisplayLength": 50,
			//"bStateSave": true,
			"aLengthMenu": [[50]]
        });        
     },
	 loadFilterForm: function(exportFlag)	{		
		$('#error_message').html('');
		var _patt = /^\d{4}-\d{1,2}-\d{1,2}$/;		
		if(jQuery.trim($("#txt_orderDate_from").val())!='' && jQuery.trim($("#txt_orderDate_to").val())!='')
		{		
			var startDateValue = new Date($("#txt_orderDate_from").val());
			var startDateValuecmp = startDateValue.getTime();
			var endDateValue = new Date($("#txt_orderDate_to").val());
			var endDateValuecmp = endDateValue.getTime();			
			if(_patt.test($("#txt_orderDate_from").val()) && _patt.test($("#txt_orderDate_to").val())){
				if(startDateValuecmp > endDateValuecmp ){
					$('#error_message').html(ice.globalVars.endDateVal);
					vmf.modal.show("errorpopup");
					return false;
				}
				var diff =  Math.floor(( Date.parse($("#txt_orderDate_to").val()) - Date.parse($("#txt_orderDate_from").val()) ) / 86400000);        //BUG-00017967                
				if(diff > 365){
					$('#error_message').html(ice.globalVars.dateExceedVal);
					vmf.modal.show("errorpopup");
					return false;
				}
			}
			else {
				$('#error_message').html(ice.globalVars.dateRangeval);
				vmf.modal.show("errorpopup");
				return false;	
			}
		}
		if(jQuery.trim($("#txt_orderDate_from").val())!='' && jQuery.trim($("#txt_orderDate_to").val()) =='')	{			
			if(!_patt.test($("#txt_orderDate_from").val()))	{
				$('#error_message').html(ice.globalVars.dateRangeval);
				vmf.modal.show("errorpopup");
				return false;
			}
			else {
				var _currentTime = new Date();
				var _month = _currentTime.getMonth() +1;
				var _day = _currentTime.getDate();
				var _year = _currentTime.getFullYear();
				if(_day < 10) _day = "0"+_day;			
				if(_month  < 10) _month  = "0"+_month ;				
				_currentDate = _year + "-" +_month + "-" + _day;
				var _currentDateValue = new Date(_currentDate);
				var _currentDateValuecmp = _currentDateValue.getTime();
				var _startDateValue = new Date($("#txt_orderDate_from").val());
				var _startDateValuecmp = _startDateValue.getTime();
				if((_startDateValuecmp > _currentDateValuecmp)){
					$('#error_message').html(ice.globalVars.enterDatesVal);
					vmf.modal.show("errorpopup");
					return false;
				}
				else $("#txt_orderDate_to").val(_currentDate);				
			}
		}
		if(jQuery.trim($("#txt_orderDate_from").val()) =='' && jQuery.trim($("#txt_orderDate_to").val()) !='')	{
			$('#error_message').html(ice.globalVars.enterDatesVal);
			vmf.modal.show("errorpopup");
			return false;		
		}
		if(jQuery.trim($("#license_key").val()) != "")	{
			var licenseKey = jQuery.trim($("#license_key").val());
			var _wildCard = "%";
			var _wildCardPos = licenseKey.indexOf(_wildCard);
			var alpha = /^[A-Za-z0-9]+$/;
			if(_wildCardPos != -1)	{
				if(_wildCardPos < 5) {
					if(licenseKey.length < (_wildCardPos+5))	{
						$('#error_message').html(ice.globalVars.filterVal);
						vmf.modal.show("errorpopup");
						return false;
					}
					else {
						var lastFiveCharacter = licenseKey.substr(licenseKey.length - 5);
						_wildCardPos = lastFiveCharacter.indexOf(_wildCard);
						if(_wildCardPos > -1)	{
							$('#error_message').html(ice.globalVars.filterVal);
							vmf.modal.show("errorpopup");
							return false;					
						} else {
							if(!alpha.test(firstFiveCharacter)) {
								$('#error_message').html(ice.globalVars.filterVal);
								vmf.modal.show("errorpopup");
								return false;
							}
						}					
					}
				} else {
					var firstFiveCharacter = licenseKey.substring(0,5);
					if(!alpha.test(firstFiveCharacter)) {
						$('#error_message').html(ice.globalVars.filterVal);
						vmf.modal.show("errorpopup");
						return false;
					}
				}
			}			
		}
		$('#showMoreId').hide();
		$('#loadingerrormsg').hide();		
		if(exportFlag){ // if export to all button is clicked
			var flag = false;
			if(!ice.activitieslog.filterOn && jQuery.trim($("#txt_orderDate_from").val())=='' && jQuery.trim($("#txt_orderDate_to").val())=='') {
				var dates = ice.activitieslog.getDates();
				$("#txt_orderDate_from").val(dates.fDate);
				$("#txt_orderDate_to").val(dates.toDate);
			} else {
				flag = true;
			}
			var _fPerPostData = $("#activityLogFilterForm").serialize();
			myvmware.common.generateCSVreports(exportAllToCsvUrl1, _fPerPostData, "activity-log : export-all", "activity-log : Export-to-CSV : Error");
			
			/*var _exportAllToCsvUrl = exportAllToCsvUrl1 + '&reportFor=fromActivityLogExportAll';
			if($('body iframe').length==0){
				$('<iframe name="iframe_exportCSV" id="iframe_exportCSV" style="display: none;"/>').appendTo('body');
			}
			$('#activityLogFilterForm').attr('action',_exportAllToCsvUrl).attr('target','iframe_exportCSV');
			$('#activityLogFilterForm').submit();*/

			if(!flag) { //when the user selects eventDate from the date filter then we should not remove the form values.
				$("#txt_orderDate_from").val('');
				$("#txt_orderDate_to").val('');
			}
		} else {
			var _postDataUrl = $("#activityLogFilterForm").serialize();
			var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl+'&action=false';	
			vmf.datatable.reload($('#dataTableWrapper'), _filterDataUrl, ice.activitieslog.postProcessingData);	
			return false;			
		}
	 },
	getDates:function(){
		var range =$('div.expand-collapse ul li.active').attr('id');
		var days = 1;
		days  =(/7/i.test(range))?7:days;
		days  =(/30/i.test(range))?30:days;
		var newdate = new Date();
		obj = {};
		obj.toDate =   newdate.getFullYear()+"-"+(parseInt(newdate.getMonth())+1)+"-"+newdate.getDate();
		newdate.setDate(newdate.getDate() - days);
		var nd = new Date(newdate);
		obj.fDate= nd.getFullYear()+"-"+(parseInt(nd.getMonth())+1)+"-"+nd.getDate();
		return obj;
	},
	 clearTable: function(tableId,errorText){
		table = $('#'+tableId).dataTable();
		table.fnClearTable(); 
		table.find('tbody tr').css("height","150px").addClass('noborder default')
		     .find('td.dataTables_empty').html('<div id="loadingerrormsg"><div id="innerMsg" class="error_innermsg"><p>'+errorText+'</p></div></div>');
	},
	 postProcessingData: function(table, settings, _json){ 
		var _errorText;	
		if(settings.fnRecordsTotal() == 25 || settings.fnRecordsTotal() > 25) $("#showMoreId").show();				
		else $("#showMoreId").hide();				
		if (_json == null || _json == '{}' || _json=='undefined' || _json.error) {		            				                				
			_errorText=loadingError; // loadingError= 'Error in loading'
			ice.activitieslog.clearTable('dataTableWrapper',_errorText);			
		}else {
			var _activityResponse = _json.aaData;
			var _permissionAssigned = _json.isAllowed;
			var _fundOwner = _json.isFundOwner;
			if (_permissionAssigned == true) {
				$('#licenseKeyOption').show(); 
				if($('#select_category').val() !== 'EPP' && $('#select_category').val() !== 'CCP') $('#licenseKeyField').show();
				ice.activitieslog.originalState=true;
			}
			else {$('#licenseKeyOption, #licenseKeyField').hide();	ice.activitieslog.originalState=false;}
			if (_fundOwner == true) {
				if ( $.browser.msie ) {
					if(!$('#eppKeyOption').length) $('#select_category option:last-child').before('<option value="EPP" id="eppKeyOption">'+ice.activitieslog.eppOption+'</option>');
				}
				else $('#eppKeyOption').show();
			} 
			else {
				if ( $.browser.msie ) {if($('#eppKeyOption').length) $('#eppKeyOption').remove();}
				else $('#eppKeyOption').hide();
			}	
		}	
		if(settings.fnRecordsTotal() == 0){ 
				_errorText=noDataMsg;
				ice.activitieslog.clearTable('dataTableWrapper',_errorText);			
		}
		var isEnd = _json.endFlag;
		if(isEnd){
			$("#showMoreId").hide();	
		}else{
			$("#showMoreId").show();	
		}
	},
	 showMorePopulate: function() {		
		$('#loadingerrormsg').hide();		
		var _postDataUrl = $("#activityLogFilterForm").serialize();
		var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl+'&action=true';		
		vmf.datatable.reload($('#dataTableWrapper'), _filterDataUrl, ice.activitieslog.postProcessingData);		
	 }, 
	getRoworderdetails: function (_auditId,_nTr,_newRowRender) {		
		var urlExpDetail = loadExpandedView+"&auditId="+_auditId;
		$.ajax({
			type: "GET",
			//dataType: "text",
			url: urlExpDetail,
			success: function(data) {
										if(data != ""){
											$(_nTr).next("tr").addClass('more-details');
											$(_nTr).next("tr").find("td").html(data);
										}
										else
											alert(data.error);										
			}
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
	resetActivitieslogFilter: function () {		
        ice.activitieslog.resetActivitieslog();
    },
	resetActivitieslog: function () {		
		$('#loadingerrormsg').hide();	
		ice.activitieslog.filterOn = false;	
		vmf.datatable.reload($('#dataTableWrapper'), loadActivityLog, ice.activitieslog.postProcessingData);
		$('#select_category').trigger('change');		
    },
	showloading :function(){
		return sOut='<span class="loading_small">'+loadingTxt+'</span>';
	},
	getContractInfoAndLoad : function(){
		var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        var _contractId = vars["selectedContractID"];
        var _contractStatus = vars["contractStatus"];
        var _ordernumber = vars["ordernumber"];
        var _orderHistory = vars["orderHistory"];
        var _contractHistory = vars["contractHistory"];

        if((_contractId != undefined) && (_contractId != "")){
			window.location = contractHistoryUrl;
        	var contractDetailsUrl = viewContractDetails + '&contractID=' + _contractId + '&contractStatus=' + _contractStatus;
			window.location = contractDetailsUrl;
        }else if((_ordernumber != undefined) && (_ordernumber != "")){
			var orderDetailsUrl = orderDetailsUrlData+'&orderId=0&ordernumber='+_ordernumber;
			window.location = orderDetailsUrl;
		 }else if((_orderHistory != undefined) && (_orderHistory != "")){
			 window.location = orderHistoryUrl;
		 }else if((_contractHistory!= undefined) && (_contractHistory!= "")){
			 window.location = contractHistoryUrl;
		 }else{
			ice.eaSelector.loadEASelector();
			ice.activitieslog.LoadActivityLog();
			ice.activitieslog.loadCalendar();
		 }
	},
	click1dayfilter:function () {
			ice.activitieslog.filterOn = false;	
			$('#list1day').html(link1DayText).addClass('active');
			$('#list7day').html('<a id="7dayfilter" href="#">'+link7DayText+'</a>').removeClass('active');
			$('#list30day').html('<a id="30daysfilter" href="#">'+link30DayText+'</a>').removeClass('active');
			$('#7dayfilter').bind('click', ice.activitieslog.click7dayfilter);
			$('#30daysfilter').bind('click', ice.activitieslog.click30dayfilter);			
			$('#loadingerrormsg').hide();			
			ice.activitieslog.get1DayCurrentDate();
			var _postDataUrl = $("#activityLogFilterForm").serialize();
			$('#txt_orderDate_from').val('');
			$("#txt_orderDate_to").val('');
			var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl+'&action=false';
			vmf.datatable.reload($('#dataTableWrapper'), _filterDataUrl, ice.activitieslog.postProcessingData);			
			return false;
        },
		click7dayfilter:function () {
			ice.activitieslog.filterOn = false;	
			$('#list1day').html('<a id="1dayfilter" href="#">'+link1DayText+'</a>').removeClass('active');
			$('#list7day').html(link7DayText).addClass('active');
			$('#list30day').html('<a id="30daysfilter" href="#">'+link30DayText+'</a>').removeClass('active');
			$('#1dayfilter').bind('click', ice.activitieslog.click1dayfilter);
			$('#30daysfilter').bind('click', ice.activitieslog.click30dayfilter);			
			$('#loadingerrormsg').hide();			
			//get last seven day date			
			var myDate=new Date();
			myDate.setDate(myDate.getDate()-7);
			var curr_month =myDate.getMonth()+1;
			if(curr_month < 10)	curr_month = "0"+curr_month;			
			var seven_date = myDate.getDate();
			if(seven_date < 10)	seven_date = "0"+seven_date;			
			var _dateMsg = myDate.getFullYear()+'-'+curr_month + '-' +seven_date;
			$('#txt_orderDate_from').val(_dateMsg);
			var _postDataUrl = $("#activityLogFilterForm").serialize();
			$('#txt_orderDate_from').val('');
			$("#txt_orderDate_to").val('');
			var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl+'&action=false';
			vmf.datatable.reload($('#dataTableWrapper'), _filterDataUrl, ice.activitieslog.postProcessingData);			
			return false;
        },
		click30dayfilter:function () {
			ice.activitieslog.filterOn = false;	
			$('#list1day').html('<a id="1dayfilter" href="#">'+link1DayText+'</a>').removeClass('active');
			$('#list7day').html('<a id="7dayfilter" href="#">'+link7DayText+'</a>').removeClass('active');
			$('#1dayfilter').bind('click', ice.activitieslog.click1dayfilter);
			$('#7dayfilter').bind('click', ice.activitieslog.click7dayfilter);
			$('#list30day').html(link30DayText).addClass('active');			
			$('#loadingerrormsg').hide();			
			//get last seven day date			
			var myDate=new Date();
			myDate.setDate(myDate.getDate()-30);
			var curr_month =myDate.getMonth()+1;
			if(curr_month < 10)	curr_month = "0"+curr_month;			
			var thirty_date = myDate.getDate();
			if(thirty_date < 10) thirty_date = "0"+thirty_date;
			var _dateMsg = myDate.getFullYear()+'-'+curr_month + '-' +thirty_date;
			$('#txt_orderDate_from').val(_dateMsg);
			var _postDataUrl = $("#activityLogFilterForm").serialize();
			$('#txt_orderDate_from').val('');
			$("#txt_orderDate_to").val('');
			var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl+'&action=false';
			vmf.datatable.reload($('#dataTableWrapper'), _filterDataUrl, ice.activitieslog.postProcessingData);			
			return false;
        },
		get1DayCurrentDate:function() { 
			//Displaying the 1day date 	
			var myDate=new Date();
			myDate.setDate(myDate.getDate()-1);
			var curr_month =myDate.getMonth()+1;
			if(curr_month < 10)	curr_month = "0"+curr_month;			
			var seven_date = myDate.getDate();
			if(seven_date < 10)	seven_date = "0"+seven_date;			
			var _dateMsg = myDate.getFullYear()+'-'+curr_month + '-' +seven_date;
			$('#txt_orderDate_from').val(_dateMsg);
			//end
		}
};
