vmf.ns.use("ice");
VMFModuleLoader.loadModule("customDropdown", function(){});

ice.alertHome = {
	alertHomeUrl:null,
	applyFilterUrl:null,
	alertPrevRow:null,
	viewAlertDetailsUrl:null,
	dismissAlertURL : null,
	clearFilterURL : null,
	filterStatus : null,
	loadEAListURL : null,
	dt:null,
    dtId:null,
	dismissableStatus:null,
	alertId:null,
	forwardFlag:null,
	selectedRows:null,
	deleteAnchor:null,
	alertIdList:null,
	action:null,
	applyFilterClick:null,
	replaceDropDown:true,
	thirdPartyCheck:false,
    init: function (_alertUrl, _applyFltUrl, _viewAlertDetailsUrl, _dismissAlertURL, _clearFilterURL,_loadEAListURL) {
    	vmf.scEvent = true;
    	alertHomeUrl = _alertUrl;
		applyFilterUrl = _applyFltUrl;
		viewAlertDetailsUrl = _viewAlertDetailsUrl;
		dismissAlertURL = _dismissAlertURL;
		clearFilterURL = _clearFilterURL;
		loadEAListURL = _loadEAListURL;

		// Handles the table hover states
		alertPrevRow = null;
		filterStatus = false;
	    //Get Account EA numbers
		//ice.alertHome.getAccountEADetails();


	  $('#inactive_alert_button').live('click', function() {
			vmf.modal.hide("inactiveAlert");

		});
      // Dismiss button click handler
      $('.deleteBtn').live('click',function(){
        ice.alertHome.dismissAlert();
      });

        $('.alertActionFormAccept a').live("click",function() {
		    $(this).parent().submit();
	    });

	    $('.alertActionFormReject a').live("click",function() {
		    $(this).parent().submit();
	    });

	  	$('#showFilter').unbind('click').bind('click',function(){
			$t = $(this);
			$('#filterAreaDiv').slideToggle('fast',function() {
				if($t.html().charAt(0)=='-'){$t.html($t.html().replace('-','+'))}
				else{$t.html($t.html().replace('+','-'))};
				if(vmf.dropdown && $("select#select_accountType").length && $("select#select_accountType").find("option").length>0 && ice.alertHome.replaceDropDown){
				vmf.dropdown.build($("select#select_accountType"), {optionsDisplayNum:20,optionMaxLength:62,inputMaxLength:37,position:"left",onSelect:ice.eaSelector.setSelectedEAInSession});
				ice.alertHome.replaceDropDown=false;
			}
			});
			return false;
		})

		ice.alertHome.LoadAlertRows();
		ice.alertHome.loadCalendar();
		//ice.alertHome.getAlertInfoAndLoad();

	   $('#applyFilter').click(function () {
			$("#bottomPaginateDiv").html("");
			if(!ice.alertHome.checkValidDate($("#txt_orderDate_from").val()) || !ice.alertHome.checkValidDate($("#txt_orderDate_to").val())){
				$('#error_message').html(alerts.globalVar.errorMsg);
				vmf.modal.show("errorpopup");
				return false;
			}
			var filterClicked = 'clicked';
	        ice.alertHome.loadFilterForm(filterClicked);
			return false;
		});
		$('#reset').click(function () {
			$("#select_category").attr('selectedIndex', 0);
			$("#select_accountType").attr('selectedIndex', 0);
			$("#txt_orderDate_from, #txt_orderDate_to").val('');
			$(".optionsHolder").val(alerts.globalVar.allLbl); 
			$("#bottomPaginateDiv").html("");
			//$("#txt_orderDate_to").val('');
			ice.alertHome.resetAlertFilter();
			return false;
        });
		$("#select_category").attr('selectedIndex', 0);
		$('#alert_modal_hide').click(function () { vmf.modal.hide("errorpopup"); });

    },
	loadCalendar: function () {
	vmf.dom.onload(function(){
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
		// Local variables to hold calendar elements
		var startDate = vmf.dom.id("txt_orderDate_from");
		var endDate = vmf.dom.id("txt_orderDate_to");
		// Initialize the calendars
		vmf.calendar.build(vmf.dom.get(".txt_datepicker"), {
			dateFormat: 'yyyy-mm-dd',
			startDate: '1990-01-01',
			endDate: '2020-02-31',
			startDate_id: vmf.dom.id('txt_orderDate_from'),
			endDate_id: vmf.dom.id('txt_orderDate_to'),
			error_msg_f: alerts.globalVar.calenderFromDtErr,
			error_msg_t: alerts.globalVar.calenderToDtErr
			/*,
			selectedDate: '2011-07-20'*/
		});

		// Bind event handler to the startDate calendar
		vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
		var d = selectedDate[0];
		if(d){
			d = new Date(d);
			vmf.calendar.setStartDate(endDate, d.addDays(1).asString());
		}
		});
		// Bind event handler to the endDate calendar
		vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
		var d = selectedDate[0];
		if(d){
			d = new Date(d);
			vmf.calendar.setEndDate(startDate, d.addDays(-1).asString());
		}
		});

	});
	},
   LoadAlertRows: function () {
		forwardFlag = 'false';
		applyFilterClick = 'false';
	    $('#showMoreId').hide();

		/*if($('#dataTableWrapper_wrapper').html() != null)	{
			$('#dataTableWrapper_wrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		} else {
			$('#dataTableWrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		}*/
		$('#loading').show();
		$('#loadingerrormsg').hide();
		var _alertHomeUrl = alertHomeUrl;


		var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
//		https://my-perf.vmware.com/group/vmware/alerts?eaNumber=115004500&alertType=ACCOUNT&category=ACCOUNT&alertId=1401344

        var _staticAlertType = vars["alertType"];
        var _staticEaNumber = vars["eaNumber"];
		var _staticCategory = vars["category"];
		var _staticAlertId = vars["alertId"];

       if((_staticAlertType != undefined) && (_staticAlertType != "")){
			forwardFlag = 'true';
			if(_staticAlertType == 'GENERAL' || _staticEaNumber == 'null'){
				var accOptions = document.getElementById('select_accountType');
				for(var index = 0; index < accOptions.options.length; index++){
					if(accOptions.options[index].value == 1){
						accOptions.options[index].selected = true;
						break;
					}
				}


			}
			if((_staticEaNumber != undefined) && (_staticEaNumber != "")){
				var accOptions = document.getElementById('select_accountType');
				for(var index = 0; index < accOptions.options.length; index++){
					if(accOptions.options[index].value == _staticEaNumber){
						accOptions.options[index].selected = true;
						break;
					}
				}



			}
			if((_staticCategory != undefined) && (_staticCategory != "")){
				var catOptions = document.getElementById('select_category');
					for(var _index = 0; _index < catOptions.options.length; _index++){
						if(catOptions.options[_index].value == _staticCategory){
							catOptions.options[_index].selected = true;
							break;
						}
					}
			}
			ice.alertHome.loadFilterForm();
			$('a#showFilter').trigger('click');
		}
		else{
				$('.alertsModule').addClass('httwozerozero bottomarea');
				//$('#dataTableWrapper').append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				//vmf.ajax.post(_alertHomeUrl, null, ice.alertHome.onSuccessLoadAlert, ice.alertHome.onFailLoadAlert);
				ice.alertHome.renderAlertDataTable(_alertHomeUrl);

			}
    },
	/*onSuccessLoadAlert: function (data) {
		$('#loading, .loading, #showMoreId').hide();
		if($('#dataTableWrapper_wrapper').html() != null)	{
			$('#dataTableWrapper_wrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		} else {
			$('#dataTableWrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		}
	    var _jsonResponse = vmf.json.txtToObj(data);
		//var _showPrice = _orderJsonResponse.isAllowed;
		if (_jsonResponse == null || _jsonResponse == '{}' || _jsonResponse=='undefined') {
		    $('#loadingerrormsg').hide();
			$('#loadingerrormsg div').html('<p>loadingError</p>');
            ice.alertHome.showExceptionMessages();
            return;
        } else if(_jsonResponse.error){
        	$('#loadingerrormsg div').html('<p>loadingError</p>');
                ice.alertHome.showExceptionMessages();
		}else{
		    	var _alertResponse = _jsonResponse.aaData;

				if (_alertResponse != '') {
					$('#loadingerrormsg').hide();
					var alertID = ice.alertHome.getQueryParameters("alertId");
					if((alertID != undefined) && (alertID != "") && (forwardFlag == "true")){
						alertIdList = [];
						for(var index = 0; index < _alertResponse.length; index++){
							alertIdList.push(_alertResponse[index][5]);
						}
					}
					ice.alertHome.renderAlertDataTable(_alertResponse);

				} else {
					$('#loadingerrormsg div').html('<p>Currently No Active Alerts Found </p>');
					$('#loadingerrormsg').show();
			 }
			//}
        }
	},*/
	showExceptionMessages: function () {
        $('#loadingerrormsg').show();
    },
	onFailLoadAlert: function (data) {
	    $("#showMoreId").hide();
        $('#loading').hide();
        $('#loadingerrormsg').show();
		return false;
    },
	renderAlertDataTable: function (url) {
		//for(i in data){data[i][0] = '<div class="openCloseSelect"><a class="openClose" href="#"></a></div><input type="checkbox" >'};
        vmf.datatable.build($('#dataTableWrapper'), {
			"aaSorting": [[ 1, "desc" ]],
            "aoColumns": [
			{"sTitle": "","sWidth" : "39px","fnRender": function ( oObj ) {return "<div class='openCloseSelect'><a class='openClose' href='#'></a></div><input type='checkbox' >"},"aTargets": [0]},
			{"sTitle": '<span class="descending">'+alerts.globalVar.dateHeader+'</span>',"sWidth" : "75px"},
			{"sTitle": '<span class="descending">'+alerts.globalVar.accountHeader+'</span>',"sWidth" : "200px"},
			{"sTitle": '<span class="descending">'+alerts.globalVar.subjectHeader+'</span>',"sWidth" : "255px"},
			{"sTitle": '<span class="descending">'+alerts.globalVar.categoryHeader+'</span>',"sWidth" : "120px"}
			],
			/*"aoColumnDefs": [
			{"fnRender": function ( oObj ) {return "<div class='openCloseSelect'><a class='openClose' href='#'></a></div><input type='checkbox' >"},"aTargets": [0]},
			],*/
            "bServerSide": false,
			"bProcessing": true,
	     	"bRetrive" : true,
            //"sScrollY": "auto",
            "bFilter": false,
			"sAjaxSource": url,
            //"aaData": data,
			"bAutoWidth": false,
			"fnInitComplete": function () {
				ice.alertHome.dt = this;
                ice.alertHome.dtId=$(ice.alertHome.dt).attr('id');
				//$("#bottomPaginateDiv").html("");
				//$(".bottom").appendTo("#bottomPaginateDiv");

				//var _rowClass = "";
				//var _counter = 0;
				//$('.dataTables_scrollBody #dataTableWrapper tbody tr').each(function (index) {
					//_rowClass = (_counter%2 == 0?'odd':'even');
					//$(this).addClass(_rowClass);

					//var _actionType = $(this).find('td:nth-child(7)').text();

					//_counter++;
				//});
				dtd = this;
				if(!ice.alertHome.dt.fnSettings().fnRecordsTotal() && applyFilterClick =='false'){
					error_text = alerts.globalVar.error_noAlerts;
					$(ice.alertHome.dt).find('tbody tr').css("height","150px").addClass('noborder default').find('td.dataTables_empty').html(error_text);
					$("#"+ice.alertHome.dtId+"_paginate").css("display", "none");
					$("#"+ice.alertHome.dtId+"_length").css("display", "none");
				}

				//console.log(alertIdList);
				var _staticAlertId =  decodeURIComponent(vars["alertId"]);
				//console.log(_staticAlertId);
				if((_staticAlertId != undefined) && (_staticAlertId != "") && (forwardFlag == "true")){



					var _index = $.inArray(_staticAlertId, alertIdList);
					if(_index >= 0){
						var _oset= ice.alertHome.dt.fnSettings();
						//var num_pages = ice.alertHome.DTpages(_oset,ice.alertHome.dt);
						//alert("total number of pages in data table :"+num_pages);
						var pagenum =  Math.ceil(_index/_oset._iDisplayLength);
						//alert("selected alertID page position :"+pagenum)
						ice.alertHome.DTpage(_oset,pagenum-1);
						$('[id='+'\''+ _staticAlertId+'\''+']').closest('tr').find('a.openClose').trigger('click');
						forwardFlag = 'false';
						alertIdList = [];
					}
				}

				$('.alertsModule').removeClass('httwozerozero bottomarea').find('div.loading').remove();
				$('.alertsModule .bottom').show();
				$('span.paginate_button').die('click').live('click', function(){ice.alertHome.sessionTimeOutExtend();});
				$('div.dataTables_length select').live('change', function(){ice.alertHome.sessionTimeOutExtend();});
				if(!$(dtd).find('tfoot').length)
					$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
				},
			"fnRowCallback":function(nRow,aData,iDisplayIndex){
				var _toDisable = (aData[8] == "N")? true : false ;
				$('td:eq(0) input:checkbox', nRow).attr('disabled',_toDisable).attr('id',aData[5]);
				_rowClass = (iDisplayIndex%2 == 0?'odd':'even');
				if($(nRow).data("rState")==undefined){ //This is to maintain read status
					$(nRow).addClass(_rowClass).addClass(aData[7].toLowerCase());
				}
				if(_toDisable) $(nRow).addClass("disabled");
				//var _actionType = aData[6];
				$(nRow).find('td:nth-child(3)').html(vmf.wordwrap(aData[2],2));
				return nRow;
			},
			"oLanguage": {
				"sLengthMenu": "<label>" + alerts.globalVar.itemsPerPage + "</label>" +  " _MENU_",
				"sProcessing" : alerts.globalVar.loadingLbl,
				//"sZeroRecords": "There are no alerts to display.",
				"sLoadingRecords":alerts.globalVar.loadingRecords,
				"sInfo": myvmware.common.buildLocaleMsg(alerts.globalVar.recordsInfo,["_START_","_END_","_TOTAL_"]),
				"sEmptyTable": alerts.globalVar.emptyTable,
				"sInfoEmpty": alerts.globalVar.recordsEmpty,
				"sInfoFiltered": alerts.globalVar.recordsFiltered,
				"oPaginate": {
			        "sNext": alerts.globalVar.nextTxt,
			        "sPrevious": alerts.globalVar.prevTxt
			     }
				
			},
			"sDom": 'zrt<"bottom"lpi<"clear">>',
			"iDisplayLength":10,
            "bPaginate" : true,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[10, 15, 20, 25, -1], [10, 15, 20, 25, alerts.globalVar.allLbl]],
			//"bLengthChange": true,
			"sPaginationType" : "full_numbers",
			"fnDrawCallback":function(){
				//BUG-00029544 remove the selection while navigating page to page
				ice.alertHome.dt = this;
                ice.alertHome.dtId=$(ice.alertHome.dt).attr('id');
				$('#selectAll').removeAttr('checked');
				$("#delBtn").html("x "+alerts.globalVar.deleteLbl);
				$(this).find('input[type=checkbox]:checked').each(function(){
					$(this).removeAttr('checked');
					$(this).closest('tr').removeClass("active");

				});
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#"+ice.alertHome.dtId+"_paginate").css("display", "block");
				} else {
					$("#"+ice.alertHome.dtId+"_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#dataTableWrapper_length option:eq(0)").val(),10)){
					$("#"+ice.alertHome.dtId+"_length").css("display", "block");
				} else {
					$("#"+ice.alertHome.dtId+"_length").css("display", "none");
				}
				settings= this.fnSettings();
				if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					jsonRes = vmf.json.txtToObj(settings.jqXHR.responseText);
					_jsonRes = jsonRes.aaData;
					var alertID = ice.alertHome.getQueryParameters("alertId");
					if((alertID != undefined) && (alertID != "") && (forwardFlag == "true")){
						alertIdList = [];
						for(var index = 0; index < _jsonRes.length; index++){
							alertIdList.push(_jsonRes[index][5]);
						}
					}
					//console.log(jsonRes.aaData);
				}
				if ($(this).find('tbody tr').length ==1 && $(this).find('tbody tr td').hasClass('dataTables_empty')){
					$(this).find('tbody tr').css("height","150px").addClass('noborder default');

				}
				vmf.datatable.addEllipsis();
			},
			"bSort": true

        });
		//$('.dataTables_info').css({'float':'left'}); // very specific to this module

		var $dM = $("#dataTableWrapper");

		$("#dataTableWrapper>tbody>tr").live("mouseover mouseout click", function(e){
			e.stopPropagation();
			var $this = $(this), cnt=true;
			if ($this.is(".disabled, .more-details")){ return;} //Return if the row disabled or row created to display details
			var $target=$(e.target);
			if(e.type=="mouseover"){
				$this.addClass("hover");
			} else if (e.type=="mouseout"){
				$this.removeClass("hover");
			} else {
				if($target.is("input:checkbox")){
					if ($target.is(':checked')) {
						$("#delBtn").html(ice.alertHome.deleteAnchor);
						$target.attr("checked", "checked");
						$target.closest('tr').addClass("active");
						$('input:checkbox:enabled', $dM).each(function(){
							if(!$(this).attr("checked"))  cnt=false;
						});
						if (cnt){
							$('#selectAll').attr("checked", "checked");
						}
					} else {
						$target.closest('tr').removeClass("active");
						$('#selectAll').removeAttr('checked');
						if(!$('input:checkbox:checked').length) $("#delBtn").html("x "+alerts.globalVar.deleteLbl);
					}
					return;
				}
				if($(this).hasClass("active")){
					$this.removeClass("active").find('input:checkbox').removeAttr('checked');
					$('#selectAll').removeAttr('checked');
					if(!$('input:checkbox:checked').length) $("#delBtn").html("x "+alerts.globalVar.deleteLbl);
				}
				else {
					$this.addClass("active").find('input:checkbox').attr("checked","checked");
					$("#delBtn").html(ice.alertHome.deleteAnchor);
					$('input:checkbox:enabled', $dM).each(function(){
							if(!$(this).attr("checked"))  cnt=false;
					});
					if (cnt) $('#selectAll').attr("checked", "checked");
				}
			}
		});

		$dM.find('.openCloseSelect a, tbody tr td:nth-child(4) a').die('click').live('click',function(e) {
			e.preventDefault();
			if(!$(e.target).hasClass("openCloseSelect")){
				$a = $(e.target).closest("tr").find("td .openCloseSelect a");
			} else {
				$a = $(this);
			}
			nTr = $a.closest('tr')[0];
			if ($a.hasClass('open') && nTr.haveData){
				$(nTr).removeClass('noborder');
				$(nTr).next("tr").removeClass('more-details');
				$a.removeClass('open');
				$(nTr).next("tr").hide();
			} else {
				$("tr", $dM).filter(".more-details").hide().prev("tr").removeClass("noborder").find("a").removeClass("open");
				$a.addClass('open');
				$(nTr).addClass('noborder').removeClass("unread").data("rState",true); //Storing read status
				if(!nTr.haveData){
					//ice.alertHome.dt.fnOpen(nTr,"<span class='loading'>Loading.....</span>",'');
					ice.alertHome.dt.fnOpen(nTr,ice.alertHome.showloading(),'');
					var selectedAlertId = $(nTr).find('td:eq(0) input:checkbox').attr('id');
					//var _viewAlertDetailsUrl = viewAlertDetailsUrl+"&selectedAlertId="+selectedAlertId;
					var _viewAlertDetailsUrl = viewAlertDetailsUrl;
					var _aDPostData = new Object();
					_aDPostData['selectedAlertId'] = selectedAlertId;
					vmf.ajax.post(_viewAlertDetailsUrl, _aDPostData, function(data){ $(nTr).next("tr").find("td").html(data)}, ice.alertHome.onFailAlertDetails);
					var eaNumberdata = $(nTr).find('td:eq(2)').text();
					var eaNumberName= eaNumberdata.split(" - ");
					if(eaNumberName.length > 1 ){
						var _dataObj = {};
						_dataObj[eaNumberSelectedByUserParamName]=eaNumberName[0];
						_dataObj[eaNameSelectedByUserParamName]=eaNumberName[1];

						vmf.ajax.post(eaSelectorSelectionSaveURL,
							_dataObj,
							ice.alertHome.onSuccess_eaSessionSave,
							ice.alertHome.onFail_eaSessionSave);
					}
					$(nTr).next("tr").addClass('more-details');
					nTr.haveData = true;
				}else
					$(nTr).next("tr").addClass('more-details').show();
			};
			return false;
		});

		/*$('#dataTableWrapper tr').die('click').live('click',function(){
			$(this).addClass('hovered');
			$(this).removeClass("unread");
			if(alertPrevRow != null)	{
				$(alertPrevRow).removeClass('hovered');
			}
			if(alertPrevRow == this)	{
				alertPrevRow = null;
			} else {
				alertPrevRow = this;
			}

			if(alertPrevRow != null) {
				var selectedAlertId = $(this).find('td:eq(0)').children().attr('id');
				var _viewAlertDetailsUrl = viewAlertDetailsUrl+"&selectedAlertId="+selectedAlertId;
				vmf.ajax.post(_viewAlertDetailsUrl, null, ice.alertHome.onSuccessAlertDetails, ice.alertHome.onFailAlertDetails);
			}

		  });*/


		var vars = [], hash, cnt=true;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
		var _staticAlertId = vars["alertId"];
		  //alert("forward flag"+forwardFlag);
		if((_staticAlertId != undefined) && (_staticAlertId != "") && (forwardFlag == "true")){


			/*var _index = $.inArray(_staticAlertId, alertIdList);
			if(_index >= 0){
				var _oset= ice.alertHome.dt.fnSettings();
				//var num_pages = ice.alertHome.DTpages(_oset,ice.alertHome.dt);
				//alert("total number of pages in data table :"+num_pages);
				var pagenum =  Math.ceil(_index/_oset._iDisplayLength);
				//alert("selected alertID page position :"+pagenum)
				ice.alertHome.DTpage(_oset,pagenum-1);
				$("#"+_staticAlertId).closest('tr').find('a.openClose').trigger('click');
				forwardFlag = 'false';
				alertIdList = [];
			}*/
		}
		$('#selectAll').die('click').live('click',function(){
			var $this = $(this);
			if ($this.is(':checked')) {
				$('input:checkbox:enabled', $dM).attr('checked', 'checked');  // Check all the items
				$(">tbody>tr",$dM).not(".more-details, .disabled").addClass("active");
				if($('input:checkbox:checked', $dM).length) $("#delBtn").html(ice.alertHome.deleteAnchor);
			} else {
				$('input:checkbox:enabled', $dM).removeAttr('checked'); // Uncheck all the items
				$(">tbody>tr",$dM).not(".more-details, .disabled").removeClass("active");
				$("#delBtn").html("x "+alerts.globalVar.deleteLbl);
			}
		});
		$('#loading, .loading').hide();
		$('#selectAll').removeAttr("checked");
		ice.alertHome.deleteAnchor='<a href="javascript:void(0)" class="deleteBtn">x '+alerts.globalVar.deleteLbl+'</a>';
     },
     onSuccessAlertDetails : function(data){
		if(data != ""){
			$("#alertDetails").html(data);
			$("#alertDetails").show();
		}else{
			$("#alertDetails").html('');
			$("#alertDetails").hide();
		}
     },
	 onFailAlertDetails : function(){

     },
	 parseDate: function(input) {
		var parts = input.match(/(\d+)/g);
		return new Date(parts[0], parts[1]-1, parts[2]);
	},
	 loadFilterForm: function(filterClicked)	{

		$('#error_message').html('');
		var _patt = /^\d{4}-\d{1,2}-\d{1,2}$/;
		if(jQuery.trim($("#txt_orderDate_from").val())!='' && jQuery.trim($("#txt_orderDate_to").val())!='')
		{
			/*var startDateValue = new Date($("#txt_orderDate_from").val());
			var startDateValuecmp = startDateValue.getTime();
			var endDateValue = new Date($("#txt_orderDate_to").val());
			var endDateValuecmp = endDateValue.getTime();*/
			var startDateValue = $("#txt_orderDate_from").val();
			var startDateValuecmp = ice.alertHome.parseDate(startDateValue);
			var endDateValue = $("#txt_orderDate_to").val();
			var endDateValuecmp = ice.alertHome.parseDate(endDateValue);

			if(_patt.test($("#txt_orderDate_from").val()) && _patt.test($("#txt_orderDate_to").val())){
				 if(startDateValuecmp > endDateValuecmp ){
						$('#error_message').html(alerts.globalVar.grtrEndDtErrMsg);
						vmf.modal.show("errorpopup");
						return false;
				}
			}
			else {
				$('#error_message').html(alerts.globalVar.validStartNEndDtMsg);
				vmf.modal.show("errorpopup");
				return false;
			}
		}
		if(jQuery.trim($("#txt_orderDate_from").val())!='' && jQuery.trim($("#txt_orderDate_to").val()) =='')	{

			if(!_patt.test($("#txt_orderDate_from").val()))	{
				$('#error_message').html(alerts.globalVar.validStartNEndDtMsg);
				vmf.modal.show("errorpopup");

				return false;
			}
			else {
				var _currentTime = new Date();
				var _month = _currentTime.getMonth() +1;
				var _day = _currentTime.getDate();
				var _year = _currentTime.getFullYear();
				if(_day < 10)	{
					_day = "0"+_day;
				}
				if(_month  < 10)	{
					_month  = "0"+_month ;
				}
				_currentDate	=	_year + "-" +_month + "-" + _day;
				var _currentDateValue = new Date(_currentDate);
				var _currentDateValuecmp = _currentDateValue.getTime();
				var _startDateValue = new Date($("#txt_orderDate_from").val());
				var _startDateValuecmp = _startDateValue.getTime();
				if((_startDateValuecmp > _currentDateValuecmp)){
					$('#error_message').html(alerts.globalVar.enterDatesMsg);
					vmf.modal.show("errorpopup");
					return false;
				}
				else {
					$("#txt_orderDate_to").val(_currentDate);
				}
			}
		}
		if(jQuery.trim($("#txt_orderDate_from").val()) =='' && jQuery.trim($("#txt_orderDate_to").val()) !='')	{
			$('#error_message').html(alerts.globalVar.enterDatesMsg);
			vmf.modal.show("errorpopup");
			return false;
		}


		$('#loading').show();
		$('#loadingerrormsg').hide();
	//	$('#dataTableWrapper_wrapper').hide();
		$("#alertDetails").hide();
		alertPrevRow = null; //setting it t null as we are loading new rows.
		var _postDataUrl = $("#alertFilterForm").serialize();
		var _filterDataUrl = applyFilterUrl +'&' + _postDataUrl;
		$('#dataTableWrapper').find('tfoot').remove();
		$('.alertsModule .bottom').hide();
		$('.alertsModule').addClass('httwozerozero bottomarea');
		//vmf.ajax.post(_filterDataUrl, null, ice.alertHome.onSuccessLoadAlert, ice.alertHome.onFailLoadAlert);
		//vmf.datatable.reload($('#dataTableWrapper'),_filterDataUrl);
		//console.log($('.dataTableWrapper').length);
		if(filterClicked == 'clicked'){
			applyFilterClick = 'true';
			vmf.datatable.reload($('#dataTableWrapper'),_filterDataUrl,ice.alertHome.postProcessingData);
		}else{
			//vmf.datatable.reload($('#dataTableWrapper'),_filterDataUrl);
			ice.alertHome.renderAlertDataTable(_filterDataUrl);
		}
		filterStatus = true;
	 },
	resetAlertFilter: function () {
		/*if($('#dataTableWrapper_wrapper').html() != null)	{
			$('#dataTableWrapper_wrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></</tbody></table>');
		} else {
			$('#dataTableWrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></</tbody></table>');
		}*/
		$("#alertDetails").hide();
        $('#loading').show();
		$('#loadingerrormsg').hide();

		var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        var _staticAlertType = vars["alertType"];
		if((_staticAlertType != undefined) && (_staticAlertType != "")){
			window.location.replace("/group/vmware/alerts")
		}
		//ice.alertHome.LoadAlertRows();
		$('#dataTableWrapper').find('tfoot').remove();
		$('.alertsModule .bottom').hide();
		$('.alertsModule').addClass('httwozerozero bottomarea');
		vmf.datatable.reload($('#dataTableWrapper'),alertHomeUrl,ice.alertHome.postProcessingData);
    },
	showloading :function(){
		return sOut="<div class='loading'><span class='loading_big'>"+alerts.globalVar.loadingLbl+"</span></div>";
	},
	dismissAlert: function(){

		var selectedAlerts = [];
		selectedRows = new Array();
		$('#dataTableWrapper tbody').find('input:checkbox:checked').each(function(){
			selectedAlerts.push(encodeURIComponent($(this).attr('id')));
			selectedRows.push($(this).closest('tr')[0]);
		});

		var _dismissAlertUrl = dismissAlertURL+"&selectedAlerts="+selectedAlerts+"&filterStatus="+filterStatus;
		vmf.ajax.post(_dismissAlertUrl, null, ice.alertHome.onSuccessDismissAlert, ice.alertHome.onFailDismissAlert);
		filterStatus = false;
		return false;
	},
	onSuccessDismissAlert : function(data){

		$('#loading, .loading, #showMoreId').hide();
		/*if($('#dataTableWrapper_wrapper').html() != null)	{
			//$('#dataTableWrapper_wrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		} else {
			$('#dataTableWrapper').replaceWith('<table id="dataTableWrapper"><thead></thead><tbody></tbody></table>');
		}*/
	    var _jsonResponse = vmf.json.txtToObj(data), numOfRows=0, revArr=null;

		if (_jsonResponse == null || _jsonResponse == '{}' || _jsonResponse=='undefined') {
		    $('#loadingerrormsg').hide();
			$('#loadingerrormsg div').html('<p>'+alerts.globalVar.loadingError+'</p>');
            ice.alertHome.showExceptionMessages();
            return;
        } else if(_jsonResponse.error){
				$('#loadingerrormsg div').html('<p>'+alerts.globalVar.loadingError+'</p>');
                ice.alertHome.showExceptionMessages();
		}else{
		    	var _alertResponse = _jsonResponse;

				if (_alertResponse != '') {
					$('#loadingerrormsg').hide();
					if(_alertResponse.STATUS = "SUCCESS"){

						numOfRows=selectedRows.length;

						if (!numOfRows) return;

						if($('#selectAll').attr('checked') == true){
							if(numOfRows == 1){
								ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition(selectedRows[0]));
							} else {
								$(selectedRows).each(function(){
									ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition(this));
								});
							}
							$('#selectAll').removeAttr("checked");
						} else if (numOfRows == 1){
							curRow = $(selectedRows[0]);
							if(curRow.next().length > 0){
								//curRow.next().find('a.openClose').trigger('click');
							}else if(curRow.prev().length > 0){
								//curRow.prev().find('a.openClose').trigger('click');
							}
							ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition(curRow[0]));
						} else {
							if($(selectedRows[numOfRows-1]).next().length>0){
								//$(selectedRows[numOfRows-1]).next().find('a.openClose').trigger('click');
							} else {
								revArr = $.makeArray(selectedRows);
								revArr.reverse()
								$(revArr).each(function(){
									if($(this).prev().not('.active').length>0){
										//$(this).prev().find('a.openClose').trigger('click');
										return false;
									}
								});
							}
							$(selectedRows).each(function(){
								ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition(this));
							});
						}
							if(!$('input:checkbox:checked').length) $("#delBtn").html("x "+alerts.globalVar.deleteLbl);
					}
				} else {
					$('#loadingerrormsg div').html('<p>'+noDataMsg+'</p>');
					$('#loadingerrormsg').show();
					$("#alertDetails").hide();
					if(!$('input:checkbox:checked').length) $("#delBtn").html("x "+alerts.globalVar.deleteLbl);
			 }
			//}
        }
	},
	onFailDismissAlert : function(){

	},
	getAccountEADetails : function(){
		var _loadEAListURL = loadEAListURL;
		vmf.ajax.post(_loadEAListURL, null, ice.alertHome.onSuccessGetAccountEADetails, ice.alertHome.onFailGetAccountEADetails);
	},
	onSuccessGetAccountEADetails : function(data){

		var _jsonResponse = vmf.json.txtToObj(data);

		if (_jsonResponse != '' && _jsonResponse != null) {
			var accoutListType = _jsonResponse.aaData;
			var options = '<option value="All">'+alerts.globalVar.allLbl+'</option>';
			for(var index = 0; index < accoutListType.length; index++){
				options +=  '<option value='+accoutListType[index][1]+'>'+accoutListType[index][2]+'</option>';
			}
			$('#select_accountType').html(options);
		}
	},
	onFailGetAccountEADetails : function(){

	},
	inviteUserAlertAction : function(url,flag){
	  thirdPartyCheck= flag;
	  ice.alertHome.alertId = decodeURIComponent(ice.alertHome.getQueryParametersFromUri("alertId",url));
      ice.alertHome.action = ice.alertHome.getQueryParametersFromUri("action",url);
      oSettings = ice.alertHome.dt.fnSettings();
      ice.alertHome.dt.oApi._fnProcessingDisplay( oSettings, true );
	  vmf.ajax.post(url, null, ice.alertHome.onSuccessInviteUserAlertAction, ice.alertHome.onFailInviteUserAlertAction);
	},
	onSuccessInviteUserAlertAction : function(data){
	  if(typeof data !=="object"){
			data=vmf.json.txtToObj(data);
		}
	  $('#alertDetails').hide();
	  if((data.status!=undefined && data.status=="SUCCESS") && ice.alertHome.action == "reject"){
			if($("input:checkbox[id='"+ice.alertHome.alertId+"']").length)
				ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition($("input:checkbox[id='"+ice.alertHome.alertId+"']").closest("tr")[0]));
		}
		else if (ice.alertHome.action == "accept" && (data.status!=undefined && data.status=="inactive")) {
					$('#inactive_alert_err_msg').html(alerts.globalVar.inactiveErrMsg);
					ice.alertHome.dt.fnDeleteRow(ice.alertHome.dt.fnGetPosition($("input:checkbox[id='"+ice.alertHome.alertId+"']").closest("tr")[0]));
					vmf.modal.show("inactiveAlert");
		}
		else if(ice.alertHome.action == "accept"){
			if(thirdPartyCheck)
				window.open(data.redirectUrl, '_blank');
			else
			window.location = data.redirectUrl;
		}
        ice.alertHome.dt.oApi._fnProcessingDisplay( oSettings, false );
	},
		onFailInviteUserAlertAction : function(data){
		ice.alertHome.dt.oApi._fnProcessingDisplay( oSettings, false );
	 //alert("Action failed");
    },
	DTpage : function ( oSettings, iPage ) {
		var current_page = 0;
		var last_page = 0;
		var page_size = oSettings._iDisplayLength;
		if (page_size) current_page = Math.floor(oSettings._iDisplayStart / page_size);
		if (page_size) last_page = Math.ceil( oSettings.fnRecordsDisplay() / page_size) - 1;

		if (typeof iPage == 'string') {
			iPage = iPage.toLowerCase();
			if (iPage == "first" || iPage == "f" || iPage == "<<") iPage = 0;
			else if (iPage == "last" || iPage == "l" || iPage == ">>") iPage = last_page;
			else if (iPage == "next" || iPage == "n" || iPage == ">" || iPage == "+") iPage = current_page + 1;
			else if (iPage == "previous" || iPage == "prev" || iPage == "p" || iPage == "<" || iPage == "-") iPage = current_page - 1;
			else if (iPage.charAt(0) == "+" && !isNaN(iPage.substring(1))) iPage += iPage.substring(1);
			else if (iPage.charAt(0) == "-" && !isNaN(iPage.substring(1))) iPage += -(iPage.substring(1));
		}

		if (typeof iPage == "number") {
			// bounds checking
			if (iPage > last_page) iPage = Math.floor(last_page);
			if (iPage < 0) iPage = 0;
		}

		// move to that page number if different than current_page
		if (iPage && iPage != current_page) {
			oSettings._iDisplayStart = (iPage) * page_size;
			current_page = iPage;
			oSettings.oInstance.fnDraw(false);
		}

		return current_page;
	},
	DTpages : function ( oSettings, iPage ) {
		if (typeof iPage != "undefined") { "you passed an argument to DTpages / Flex_num_pages. did you mean to call DTpage / Flex_page?"; debugger; }
		var last_page = 0;
		var page_size = oSettings._iDisplayLength;
		if (page_size) last_page = Math.ceil( oSettings.fnRecordsDisplay() / page_size);

		return last_page;
	},

	getQueryParameters : function( key ){

		var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
		return vars[key];

	},
	getQueryParametersFromUri : function( key,urlString ){
		var vars = [], hash;
		var hashes = urlString.slice(urlString.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
		}
		return vars[key];
	},
	clearTable: function(tableId,error_text){
		table = $('#'+tableId).dataTable();
		table.fnClearTable();
		table.find('tbody tr').css("height","150px").addClass('noborder default')
				 .find('td.dataTables_empty').html(error_text);

	},
	postProcessingData: function(table, settings, _json){
		if(_json.error || !settings.fnRecordsTotal()){
			error_text=alerts.globalVar.filter_noMatch;
			if(applyFilterClick == 'true'){
				ice.alertHome.clearTable('dataTableWrapper',error_text);
			}else{
				error_text = alerts.globalVar.error_noAlerts;
				ice.alertHome.clearTable('dataTableWrapper',error_text);
			}
		}

	},
	checkValidDate: function(input){

		var returnval=false;

		if(jQuery.trim(input)!=''){
				var yearfield=input.split("-")[0];
				var monthfield=input.split("-")[1];
				var dayfield=input.split("-")[2];
				var dayobj = new Date(yearfield, monthfield-1, dayfield);
				if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield)){
					returnval=false;
				}
				else{
						returnval=true;
				}
			}
			else{
				returnval=true;
			}

			return returnval;
		},
     onSuccess_eaSessionSave : function(data){
		// todo
     },
	 onFail_eaSessionSave : function(){
    	 //	todo
     },
	sessionTimeOutExtend: function(){
		var sessionalertpopup = $('.popup-alert-close');

		if(sessionalertpopup != null && typeof sessionalertpopup.text() != 'undefined' && sessionalertpopup.text() != '') {
			AUI().ready('aui-io', function(A) {
					if(A.one('.popup-alert-close')) {
						A.one('.popup-alert-close').simulate('click');
						document.title = ice.managelicense.pageTitle;
					}
				});			
		   } 
		   else {
			ice.alertHome.invokeBeforeAjax();
		   }			
	},
	invokeBeforeAjax: function() {
		if(Liferay.Session) {
			clearTimeout(Liferay.Session._stateCheck);
			Liferay.Session.extend();
		}
	},
	//Added for  Q1-relese cr 00009915
	reqPermissionAlertAction : function(url){
		riaLinkmy('alerts : grant-permissions');
    	 vmf.ajax.post(url, null, ice.alertHome.onSuccessReqPermissionAlertAction, ice.alertHome.onFailReqPermissionAlertAction);
    },
    onSuccessReqPermissionAlertAction : function(data){
  	  if(typeof data !=="object"){
  			data=vmf.json.txtToObj(data);
  		}
  	  	 $('#alertDetails').hide();	
  	 	 vmf.modal.show("requestPermissionAlert");
  		 $('#requestPermission_alert_msg').html(data.msg);
  		 $('#requestPermission_alert_button').die('click').live('click',function(){
  		 vmf.modal.hide();
  		 location.reload();
  	  });		  	
  	},
  	onFailReqPermissionAlertAction : function(data){
  	 //alert("Action failed");
    }

};
