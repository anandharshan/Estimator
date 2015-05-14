if (typeof(myvmware) == "undefined")  myvmware = {};
sdp={};
VMFModuleLoader.loadModule("loading", function(){});
vmf.scEvent = true;
myvmware.sdp = {
	init:function(){
		var dtd = null;
		var nTr = null;
		sdp = myvmware.sdp;
		sdp.cmn.events();
		sdp.bindEvents();
		sdp.assignees={};
		sdp.assigneesDef = '';
		if(partnerType == 'RESELLER') {
			myvmware.common.showMessageComponent('PARTNER_CUSTOMER');
			sdp.loadData();
			//Changes done for  omniture
            callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller :sdpprtnrAccLst']});
		}
		else {
			myvmware.common.showMessageComponent('PARTNER_CUSTOMER');
			sdp.loadDataDistiView();
			//Changes done for  omniture
            callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti :sdpprtnrAccLst']});
		}
        
	},
	cmn:{
		datatableLanguage: function(map) {
			var _default = { // for Datatable js
				sProcessing: rs.Loading,
				sLoadingRecords: "",
				sInfo: rs.recordsInfo, // default: "Showing _START_ to _END_ of _TOTAL_ entries"
				sInfoEmpty: '', // should be formatted like info, default: "Showing 0 to 0 of 0 entries"
				//sZeroRecords: '' // zero records, after filtering, default: "No matching records found"
				sEmptyTable: '', // zero records, regardless of filtering, default: "No data available in table"
				sInfoFiltered: rs.recordsFiltered, // default: "(filtered from _MAX_ total entries)"
				sLengthMenu: "<label>" + rs.itemsPerPage + "</label> _MENU_",
				oPaginate: {
					sPrevious: rs.DtablesPrevious,
					sNext: rs.DtablesNext,
					sLast: rs.DtablesLast,
					sFirst: rs.DtablesFirst
				}
			};		  
			$.extend(_default, (map ||{}));
			return _default;
		},
		events: function(){
			$('div.autoClose a.autoCloseBtn').die('click').live('click', function(e){
				e.preventDefault();
				$(this).closest('div.autoClose').hide();
			});
			$('.modalContent .fn_cancel').die('click').live('click',(function(){
				vmf.modal.hide();
				return false;
			}));
			
			$("#upload").bind("click",function(e){
				e.preventDefault();
				vmf.modal.show('uploadRateCardModal');
			});
			
			$('#actionDropdown').val('').change(function() {
				var eaNumber;
				if(partnerType == "DISTI"){	eaNumber = $("#cAcc").html();}
				else{ eaNumber = $("#acId").html();	}
				if($.trim($(this).val()).length) window.location = $(this).val()+'&_VM_selectedEaNumber='+eaNumber+'&_VM_serviceID='+$("#srId").html()+'&_VM_productFamilyCode='+rs.productFamilyCode; 
			}); 			
			
			$('#fileUpload').live('change', function(){
				var val = $(this).val(),
					extn = val.substring(val.lastIndexOf('.') + 1);
					extn = extn.toLowerCase();
				if(extn == 'xlsx' || extn == 'xls') {
					var value = val.split(/\\/).pop();
					$('#uploadData').val(value);
					$("span#msg").html("");
					$("#uploadRateCard").removeClass("disabled").removeAttr("disabled");
				} else {
					$("span#msg").html(rs.excelUploadFileTypeMsg);
					$("#uploadRateCard").addClass("disabled").attr("disabled",true);
					$('#uploadData, #fileUpload').val('');
				}
			});
			$('#rejctComments').keyup(function(){
				($.trim($(this).val()).length)?$('#btnSubmitReject').removeClass("disabled").attr("disabled",false):$('#btnSubmitReject').addClass("disabled").attr("disabled",true);
			}).focusout(function(){
				($.trim($(this).val()).length)?$('#btnSubmitReject').removeClass("disabled").attr("disabled",false):$('#btnSubmitReject').addClass("disabled").attr("disabled",true);
			});
			$('#btnSubmitReject').live('click',function(){
				var target = 'reject',comments = $('#rejctComments').val(),targetTable = $("#reject").closest("div.filter-section").siblings(".dataTables_wrapper"), checked, rowList=[],idList=[];
				checked = targetTable.find("tbody tr input:checkbox:checked");
				$.each(checked,function(i,v){
					idList.push($(v).closest('tr').data('id'));
					rowList.push($(v).closest('tr'));
				});
				vmf.modal.hide();
				vmf.ajax.post(rs.url.approveRejectRequest,{"requestId":idList.join(","),"action":target.toUpperCase(),"actionComments":comments},myvmware.sdp.cmn.approveSuccess(rowList,targetTable,target),myvmware.sdp.cmn.approveFailure,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
				if(!myvmware.sdp.partner.map){
                    order.map["tab5"].hasData = 0;  //changed 05-12-2013
                    order.map["tab4"].hasData = 0;  //changed 05-12-2013
                }    
                else
                    ptnr.map["tab3"].hasData = 0;  //changed 05-12-2013
			});
			
			$("#btnApproveConfirm").live("click", function(){
				var target = 'approve', targetTable = $("#approve").closest("div.filter-section").siblings(".dataTables_wrapper"), checked, rowList=[], idList=[];
				checked = targetTable.find("tbody tr input:checkbox:checked");
				$.each(checked,function(i,v){
					idList.push($(v).closest('tr').data('id'));
					rowList.push($(v).closest('tr'));
				});
				
				if(targetTable.find('table').attr('id') == 'tbl_pendingReq' || targetTable.find('table').attr('id') == 'tbl_pending'){						
						vmf.ajax.post(rs.url.approveRejectRequest,{"requestId":targetTable.find('table').data('selectedPendingArray').join(','),"action":"APPROVE"},myvmware.sdp.cmn.approveSuccess(targetTable.find('table').data('rowListArray'),targetTable,target),myvmware.sdp.cmn.approveFailure,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
				}
				else{
						vmf.ajax.post(rs.url.approveRejectRequest,{"requestId":idList.join(','),"action":"APPROVE"},myvmware.sdp.cmn.approveSuccess(rowList,targetTable,target),myvmware.sdp.cmn.approveFailure,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
				}
			});
			
			$("#approve a, #reject a").live("click",function(e){
				e.preventDefault();
				if($(this).closest("span").attr("id") == 'approve'){
					vmf.modal.show("approveActionComments");
				}else{
					var serID = [];
					var table = '#'+$(this).closest('div.filter-section').next('div').find('table').attr('id');
					$(table).find('tbody tr td input:checkbox:checked').each(function(){
						serID.push(' '+$(this).closest('td').next('td').html());
					});
					$('span#reqIDHolder').html(serID.join(', '));
					vmf.modal.show('actionComments');
				}
			});
			
			$("input:text[data-valid='digit']").bind("keydown",function(event){
				if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
					 // Allow: Ctrl+A
					(event.keyCode == 65 && event.ctrlKey === true) || 
					 // Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
						 // let it happen, don't do anything
						 return;
				}
				else {
					// Ensure that it is a number and stop the keypress
					if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
						event.preventDefault();
					}   
				}
			});
			$("input:text[data-valid='number']").bind("keydown",function(event){
				if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
					 // Allow: Ctrl+A
					(event.keyCode == 65 && event.ctrlKey === true) || 
					 // Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
						 // let it happen, don't do anything
						 return;
				}
				else {
					// Ensure that it is a number and stop the keypress
					if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
						event.preventDefault();
					}   
				}
			}).bind("blur",function(){
				var str = $(this).val().split(',').join(''),
				pattern = /(-?\d+)(\d{3})/;
				if(str.length >= 4){
					while(pattern.test(str)) {
						str = str.replace(pattern, "$1,$2");
						$(this).val(str);
					}
				} else {
					$(this).val(str);
				}
			}).each(function(){
				var str = $(this).val().split(',').join(''),
				pattern = /(-?\d+)(\d{3})/;
				if(str.length >= 4){
					while(pattern.test(str)) {
						str = str.replace(pattern, "$1,$2");
						$(this).val(str);
					}
				} else {
					$(this).val(str);
				}
			});
			
			$("input:text[data-valid='float']").bind('keypress',function(event){
				if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
					 // Allow: Ctrl+A
					(event.keyCode == 65 && event.ctrlKey === true) || 
					 // Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
						 // let it happen, don't do anything
							return;
				}
				else {
					if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
						event.preventDefault();
					}
				}
			}).bind('keyup',function(event){
				//Fix to 2 decimal points
				if ((event.which >= 48 && event.which<=57) && ($(this).val().indexOf('.')!=-1)){
					if($(this).val().split('.')[1].length >= 2) $(this).val(parseFloat($(this).val()).toFixed(2));
				}
				//Remove Leading 0's
				var s=$(this).val();
				while (s.substr(0,1) == '0' && s.length>1 && s.substr(1,1)!=".") { s = s.substr(1); }
				$(this).val(s);
			}).bind('blur',function(e){
				var value = $(this).val();
				(value.length == 0) ? $(this).val('') : $(this).val(parseFloat(value).toFixed(2));
			});
			
			$("a.export").live("click",function(e){
				e.preventDefault();
				var that=this;
					//postData = {};
				// if(partnerType=="RESELLER"){
					// if($(that).hasClass('tbl_processed')) {
						// if(isReseller)
							// postData = {"customerName":$.trim($("#aName").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html()),"autoApproveMaximum":encodeURIComponent(encodeURIComponent($.trim($("#mCurrency").html()+$("#mLimit").html()))), "rateCardFileName": $.trim($("#rate_card").html())};
						// else
							// postData = {"distiCustomerName":$.trim($("#aName").html()),"resellerName":$.trim($("#resellerName a").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html())};
					// }

				// } else {
					// if(($(that).hasClass("tbl_processed") || $(that).hasClass("tbl_subscription") || $(that).hasClass("tbl_declineRequest"))) {
						// postData = {"resellerName":$.trim($("#cName").html()),"primaryContact":$.trim($("#pContact").html()),"emailID":$("#proc_cont_email a").html(),"autoApproveMaximum":encodeURIComponent(encodeURIComponent($.trim($("#mCurrency").html()+$("#mLimit").html()))) };					
					// }
				// }
				// myvmware.sdp.cmn.exportFile($(that), postData);
				if (!$("#exportFrame").length)
					$('<iframe id="exportFrame" name="exportFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
				$("#exportFrame").attr("src",$(that).attr("href"));
				if (typeof $(this).attr("data-track")!="undefined" && typeof riaLinkmy!="undefined"){
					riaLinkmy($(that).attr("data-track"));
				}
			});
		},
		approveSuccess: function(selRows,targetTable,target){
			var tableName = targetTable.attr("id").split("_wrapper")[0];
			vmf.modal.hide();
			return function(res){
				if (typeof res!="object") res=vmf.json.txtToObj(res);
				if(typeof res.ERROR_CODE != "undefined"){

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
				if(res != null && res.status){
					var tableObj = $("#"+tableName).dataTable();
					$.each(selRows,function(i,v){
						tableObj.fnDeleteRow(tableObj.fnGetPosition($(v)[0]));
					})
					targetTable.find(".tbl_selectAll").removeAttr("checked");
					$("#approve").html(rs.approve);
					$("#approve").closest('li').addClass('disabled');
					$("#reject").html(rs.reject)
					$("#reject").closest('li').addClass('disabled');
				} else {

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
			}
		},
		approveFailure: function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		},
		getCalendar: function(start,end) {
			var d = new Date(),curr_date,curr_month,curr_year;
			curr_date = d.getDate();
			curr_month = d.getMonth();
			curr_year = d.getFullYear();
			var startDate = (!start) ? $("#txt_receivedDate_from")[0] : $("#"+start)[0];
			var endDate = (!end) ? $("#txt_receivedDate_to")[0] : $("#"+end)[0];

			// Initialize the calendars
			vmf.calendar.build($(".txt_datepicker"), {
				dateFormat: 'yyyy-mm-dd',
				startDate: '1990-01-01',
				endDate: '2020-02-31',
				startDate_id: startDate,
				endDate_id: endDate,
				error_msg_f: rs.Enter_valid_from_date,
				error_msg_t: rs.Enter_valid_to_date
			});

			// Bind event handler to the startDate calendar
			vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setStartDate(endDate, d.addDays(0).asString());
				}
			});
			// Bind event handler to the endDate calendar
			vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setEndDate(startDate, d.addDays(0).asString());
				}
			});
		},
		buildSelectBox:function(id,obj,def){// Make it common function
			var option=["<option value='' selected='selected'>" + rs.Select_One + "</option>"];
			for (key in obj){
				if (def && def==key)
					option.push("<option value='"+key+"' selected='selected'>"+obj[key]+"</option>");
				else 
					option.push("<option value='"+key+"'>"+obj[key]+"</option>");
			}
			$(id).html(option.join(""));
		},
		dataTableSuccess:function(table){
			var exportLink = '.'+table.attr('id');
			if(table.find('tbody tr td').length != 1 ) {
				$(exportLink).attr('data-list', 'true').show();
			} else {
				$(exportLink).attr('data-list', 'false').hide();
			}
		},
		dataTableError:function(table,json){
			var err_msg = (json.ERROR_MESSAGE) ? json.ERROR_MESSAGE : rs.genericError;
			var emptyRow =table.find("tbody tr td.dataTables_empty"), exportLink = '.'+table.attr('id');			
			$(exportLink).attr('data-list', 'false').hide();
			if(emptyRow.length) emptyRow.html(err_msg).closest("tr").show();
			else {
				$("<tr><td colspan="+table.fnSettings().aoColumns.length+" class=\"dataTables_empty\">"+err_msg+"</td></tr>").appendTo(table.find("tbody")).show();
			}
		},
		showErrorModal: function(msg){
			vmf.modal.show("errorModal",{
				onShow : function(){
					$("#msg",$("#errorModal")).html(msg);
					if($("#msg",$("#errorModal")).find(".errorHeader").length) $("#msg",$("#errorModal")).addClass("msg").closest(".body").addClass("nopadding").siblings(".header").hide();
				}
			});
		},
		exportFile:function(link, param, flag) {
			var elem = $(link), url = elem.attr('data-url'), parameter = '';
			if(typeof(param) == 'object'){
				for(key in param){
					parameter += '&'+key+'='+param[key];
				}
			}
			if(flag){
				elem.attr('data-url', url+parameter);
			}
			elem.attr('href', url+parameter);
		},		
		getObjectSize: function(obj){
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		addComa:function(string){
			var decimal ="", strArr=[];
			if(string.indexOf(".")!=-1) {
				strArr = string.split("."), string=strArr[0], decimal="."+strArr[1];
			}
			return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
		},
		removeComa:function(string) {
			return parseFloat(string.split(',').join(''));
		}
	},
    //Bind Events
	bindEvents:function(){
		$('#monthlyLimit a').click(function(){
			vmf.modal.show('DefaultMonthlyAmt',{
				checkPosition: true,
				onShow: function (dialog) {
					$('#monthlyLimitVal').val($('#monthlyLimit span:first').text());
					$('.modalContent .fn_save').click(function(){
						var _postData = new Object(); 
						_postData['thresholdLimit'] = $('input#monthlyLimitVal').val();
						vmf.ajax.post(setThresholdURL,_postData,function(){$('#monthlyLimit span:first').text( _postData['thresholdLimit']);},function(){myvmware.sdp.cmn.showErrorModal(rs.genericError)});
						var tabId = (partnerType == 'RESELLER')?'#tbl_pCustomer':'#tbl_pReseller';
						$(tabId).next(".bottom").hide();
						vmf.datatable.reload($(tabId),sdpSubscriptionCustomerSummaryUrl)
						vmf.modal.hide();
						//Changes done for  omniture 
						if(partnerType == "RESELLER") {
							if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrAccDtls : auto_approve');
						}
						else{
							if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrAccDtls : auto_approve');
						}
					});
				}
			});
		})  
		
		$('#defaultRateCard a').die('click').live('click',function(){
			vmf.modal.show('defaultRateCardModal',{
				checkPosition: true,
				onShow: function (dialog) {
				 sdp.loadRateCardData();  
				}
			});
		});
		
		$('#uploadRateCardLink').die('click').live('click', sdp.showUploadRateCardOverlay);
		$('.modalContent .fn_cancel').die('click').live('click',(function(){
			vmf.modal.hide();
			return false;
		}));
		$('#btn_ApplyFilter').click(function(){//reload data on Apply Filter click
		  if(partnerType == 'RESELLER'){
			sdp.assigneesDef = $("#txt_assigned").val();
			var postData = {"customerName":$.trim($("#txt_custname").val()),"partnerID":$.trim($("#txt_account").val())};
			$("#tbl_pCustomer").next(".bottom").hide();
			vmf.datatable.reload($('#tbl_pCustomer'),sdpSubscriptionCustomerSummaryUrl,myvmware.sdp.cmn.exportFile('a.tbl_pCustomer', postData),"POST",postData);
			//Changes done for  omniture
			if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpprtnrAccLst : filter');
		  }else{
		    var _postData = {'customerName':$.trim($("#txt_resellerName").val()),'partnerID':$.trim($("#txt_partnerID").val())};
			$("#tbl_pReseller").next(".bottom").hide();
			vmf.datatable.reload($('#tbl_pReseller'),sdpSubscriptionCustomerSummaryUrl,myvmware.sdp.cmn.exportFile('a.tbl_pReseller', _postData),"POST",_postData);
			 //Changes done for  omniture
			if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpprtnrAccLst : filter');
		   }
			return false;
		});
		$('#btn_reset').click(function(){
			$(this).closest('.filter-content').find('input, select').val('');
			sdp.assigneesDef = '';
			if(partnerType == 'RESELLER'){
				$("#tbl_pCustomer").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pCustomer'),sdpSubscriptionCustomerSummaryUrl,function(){},"POST",{"customerName":"","partnerID":"","rateCardId":""});
				myvmware.sdp.cmn.exportFile('a.tbl_pCustomer', '');
			} else {
				$("#tbl_pReseller").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pReseller'),sdpSubscriptionCustomerSummaryUrl,function(){},"POST",{'customerName':'','partnerID':''});
				myvmware.sdp.cmn.exportFile('a.tbl_pReseller', '');
			}
			
		});
	},
	loadRateCardData:function(){
	  var rateCardId = $('#defaultRateCard a').attr('rateCardId');
	  vmf.datatable.build($('#tbl_prateCardDetails'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span class='descending'>"+rs.productFamily+"</span>", "sWidth":"230px"},
						{"sTitle": "<span class='descending'>"+rs.product+"</span>", "sWidth":"100px"},
						{"sTitle": "<span>"+rs.comments+"</span>", "sWidth":"600px"},
						{"sTitle": "<span class='descending'>"+rs.partNumber+"</span>", "sWidth":"150px"},
						{"sTitle": "<span class='descending'>"+rs.listPrice+"</span>", "sWidth":"50px"}
					], 
					"sAjaxSource": viewRateCard+"&rateCardId="+rateCardId,
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
					"iDisplayLength": 5,
					"bServerSide": false,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						var dtd = this;
						if(!$(dtd).find('tfoot').length)
						$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
						$('#tbl_prateCardDetails').next(".bottom").show();
						settings= this.fnSettings();
				      if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					    var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
						$('#rateCardHeaderDtls span:first').html("<a href='"+downloadRateCard+"&rateCardId="+jsonResp.rateCardId+"'>" + rs.Download_Rate_Card + "</a>");
					  }
					  
			},
			"fnDrawCallback":function(){
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#tbl_prateCardDetails_paginate").css("display", "block");
				} else {
					$("#tbl_prateCardDetails_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_prateCardDetails_length option:eq(0)").val(),10)){
					$("#tbl_prateCardDetails_length").css("display", "block");
				} else {
					$("#tbl_prateCardDetails_length").css("display", "none");
				}
			}
		}); // End of datatable config
	},
	showCustomerBeaks:function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_CUSTOMER_ALERT"],
			beakName:"SDP_BEAK_PARTNER_CUSTOMER_ALERT",
			beakHeading:rs.head_alert,
			beakContent:rs.desc_alert,
			target:$('#tbl_pCustomer thead th:eq(0)'),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
			beakLink:'#beak1',
			isFlip:false,
			multiple:true
		});
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_CUSTOMER_MONTHLY_LIMIT"],
			beakName:"SDP_BEAK_PARTNER_CUSTOMER_MONTHLY_LIMIT",
			beakHeading:rs.head_monthlyLimit,
			beakContent:rs.desc_monthlyLimit,
			target:$('#tbl_pCustomer thead th:eq(6)'),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
			beakLink:'#beak2',
			isFlip:true,
			multiple:true
		});
	},
	showResellerBeaks: function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLER_ALERT"],
			beakName:"SDP_BEAK_PARTNER_RESELLER_ALERT",
			beakHeading:rs.head_alert,
			beakContent:rs.desc_alert,
			target:$('#tbl_pReseller thead th:eq(0)'),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
			beakLink:'#row1',
			isFlip:false,
			multiple:true
		});
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLER_MONTHLY_LIMIT"],
			beakName:"SDP_BEAK_PARTNER_RESELLER_MONTHLY_LIMIT",
			beakHeading:rs.head_monthlyLimit,
			beakContent:rs.desc_monthlyLimit,
			target:$('#tbl_pReseller thead th:eq(4)'),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
			beakLink:'#row1',
			isFlip:true,
			multiple:true
		});
	},
	loadData:function(){
		var tableStart = 0, flag = false;
		vmf.datatable.build($('#tbl_pCustomer'),{
			"bProcessing": true,
			"bAutoWidth": false,
			 "aoColumns": [
				{"sTitle": "<span class='descending'>"+rs.alert+"</span>", "sWidth":"40"},
				{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"80"},
				{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"150px"},
				{"sTitle": "<span class='descending'>"+rs.pName+"</span>", "sWidth":"150px"},
				//{"sTitle": "<span class='descending'>"+rs.rcName+"</span>", "sWidth":"150px"},
				{"sTitle": "<span class='descending'>"+rs.siCount+"</span>", "sWidth":"150px"},
				{"sTitle": "<span class='descending'>"+rs.mLimit+"</span>", "sWidth":"100px"}
			], 
			"sAjaxSource": sdpSubscriptionCustomerSummaryUrl,
			"error":myvmware.sdp.cmn.dataTableError,
			"sPaginationType": "full_numbers",
			"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
			"iDisplayLength": 10,
			"aaSorting": [[0, 'desc']],
			"bServerSide": false,
			"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
			"errMsg":rs.Unable_to_process_your_request,
			"sDom": 'rt<"bottom"lpi<"clear">>',
			"fnInitComplete": function(){
				var dtd = this;
				if(!$(dtd).find('tfoot').length)
				$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
				$('#tbl_pCustomer').next(".bottom").show();
				/*if(myvmware.sdp.rCardDetail.getObjectSize(sdp.assignees)>0) {
					myvmware.sdp.cmn.buildSelectBox("#txt_assigned",sdp.assignees, sdp.assigneesDef);
					sdp.assigneesDef = '';
				}*/
				myvmware.sdp.cmn.dataTableSuccess($(dtd));
			},
			"fnPreDrawCallback": function(oSettings){
				if(flag){
					oSettings._iDisplayStart = tableStart
					flag = false;
					this.fnDraw(false);
				}
			},
			"fnDrawCallback":function(){
				if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
					$("#tbl_pCustomer_paginate").css("display", "block");
				} else {
					$("#tbl_pCustomer_paginate").css("display", "none");
				}
				if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pCustomer_length option:eq(0)").val(),10)){
					$("#tbl_pCustomer_length").css("display", "block");
				} else {
					$("#tbl_pCustomer_length").css("display", "none");
				}
				/*var custDetails= this.fnSettings();
				if(custDetails.jqXHR && custDetails.jqXHR.responseText!==null && custDetails.jqXHR.responseText.length && typeof custDetails.jqXHR.responseText =="string"){
					custDetails = vmf.getObjByIdx(vmf.json.txtToObj(custDetails.jqXHR.responseText),0);
					$.each(custDetails.aaData,function(i,v){
						if(v[4] != null) sdp.assignees[v[7]]=v[4];
					});
				}*/
			},
			"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				var $nRow=$(nRow), alertClass = 'alertIcon'+aData[0];
				$nRow.find("td:eq(0)").html("<span class='titleTag "+alertClass+"' title='"+eval("rs.alert_"+aData[0])+"'></span>");
				$nRow.find("td:eq(2)").html("<a href='sdpPartnerAccountDtls?_VM_selectedAccountNumber="+escape(aData[1])+"'>" + aData[2] + "</a>");
				/*if($.trim(aData[4]).length) {
					$nRow.find("td:eq(4)").html("<a href='"+rs.rateCardDetails+"?_VM_rateCardId="+aData[7]+"'>" +aData[4] + "</a>");
				} else {
					$nRow.find("td:eq(4)").html(rs.notAvailable);
				}*/
				if($.trim(aData[3]).length){
					if($.trim(aData[7]).length) {
						$nRow.find("td:eq(3)").html("<a target='_blank' title='"+aData[7]+"' href='mailto:"+aData[7]+"'>"+aData[3]+"</a>");
					} else {
						$nRow.find("td:eq(3)").html(aData[3]);
					}
				}
				return nRow;
			}
		}); // End of datatable config
		callBack.addsc({'f':'sdp.showCustomerBeaks','args':[]});
		$('.sorting, .sorting_asc, .sorting_desc').live('click', function(){
			if($('#tbl_pCustomer').dataTable()){
				var table = $('#tbl_pCustomer').dataTable();
				tableStart = table.fnSettings()._iDisplayStart;
				flag = true;
			}
		});
	},
	buildSelectBox:function(id,obj){// Make it common function
		var option=["<option value='' selected='selected'>" + rs.Select_One + "</option>"];
		for (key in obj){
			option.push("<option value='"+key+"'>"+obj[key]+"</option>");
		}
		$(id).html(option.join(""));
	},
	loadDataDistiView:function(){
		var tableStart = 0, flag = false;
		vmf.datatable.build($('#tbl_pReseller'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"40"},
						{"sTitle": "<span class='descending'>"+rs.partnerID+"</span>", "sWidth":"200px"},
						{"sTitle": "<span class='descending'>"+rs.resellerName+"</span>", "sWidth":"200px"},
						{"sTitle": "<span class='descending'>"+rs.siCount+"</span>","sWidth":"200px"},
						{"sTitle": "<span class='descending'>"+rs.mLimit+"</span>", "sWidth":"200px"}
					], 
					"sAjaxSource": sdpSubscriptionCustomerSummaryUrl,
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"aaSorting": [[0, 'desc']],
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						var dtd = this;
						if(!$(dtd).find('tfoot').length)
						$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
						$('#tbl_pReseller').next(".bottom").show();
						settings= this.fnSettings();
				      if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
					    var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
					    $('#monthlyLimit span:first').text(jsonResp.defaultThresholdLimit);
					  }
					  myvmware.sdp.cmn.dataTableSuccess($(dtd));
					},
					"fnPreDrawCallback": function(oSettings){
						if(flag){
							oSettings._iDisplayStart = tableStart
							flag = false;
							this.fnDraw(false);
						}
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_pReseller_paginate").css("display", "block");
						} else {
							$("#tbl_pReseller_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pReseller_length option:eq(0)").val(),10)){
							$("#tbl_pReseller_length").css("display", "block");
						} else {
							$("#tbl_pReseller_length").css("display", "none");
						}
					},
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow), alertClass = 'alertIcon'+aData[0];
						$nRow.find("td:eq(0)").html("<span class='"+alertClass+"' title='"+eval("rs.alert_"+aData[0])+"'></span>");
						$nRow.find("td:eq(2)").html("<a href='sdpPartnerAccountDtls?_VM_selectedAccountNumber="+escape(aData[1])+"&_VM_selectedAccountName="+aData[2]+"'>" + aData[2] + "</a>");
						return nRow;
					}
		}); // End of datatable config
		callBack.addsc({'f':'sdp.showResellerBeaks','args':[]});

		$('.sorting, .sorting_asc, .sorting_desc').live('click', function(){
			if($('#tbl_pReseller').dataTable()){
				var table = $('#tbl_pReseller').dataTable();
				tableStart = table.fnSettings()._iDisplayStart;
				flag = true;
			}
		});
	},
	showUploadRateCardOverlay: function(e){
		vmf.modal.show('uploadRateCardModal');
	},
	saveDefaultThresholdLimit: function(e){
		var _thresholdLimit = $("input[id='monthlyLimitVal']").val();
		var _postData = new Object(); 
		_postData['thresholdLimit'] = _thresholdLimit;		
		vmf.ajax.post(setThresholdURL,_postData,myvmware.sdp.onSuccessSaveThreshold,myvmware.sdp.onFailSaveThreshold);
	},
	onSuccessSaveThreshold:function(sData){
	  var jsonResp = vmf.json.txtToObj(sData);
	  var status = jsonResp.status;
	  if(status == 'success'){
	    vmf.modal.hide();
		if(partnerType == 'RESELLER')
		var tabId = '#tbl_pCustomer';
		else{
		  tabId = '#tbl_pReseller';
		}
		$(tabId).next(".bottom").hide();
		 vmf.datatable.reload($(tabId),sdpSubscriptionCustomerSummaryUrl);
	  }
	},
	onFailSaveThreshold:function(){
		myvmware.sdp.cmn.showErrorModal(rs.genericError);
	},
	"partner":{
		init:function(){
			sdp = myvmware.sdp;
			ptnr = myvmware.sdp.partner;
			ptnr.pendingJson=null;
			ptnr.processJson=null;
			ptnr.declineJson=null;
			ptnr.orderType={};
			ptnr.services={};
			ptnr.remain={};
			ptnr.orderTypeDef="";
			ptnr.servicesDef="";
			ptnr.remainDef="";			
			ptnr.bindEvents();
			ptnr.dt=null;
			ptnr.map = {
				"tab0" : {"url":"tab0.json","tab_cnt":"tab_container_1","hasData":0,"func":ptnr.loadTab1Data,"sfunc":ptnr.onSucess,"ffunc":ptnr.onFailure,"nodata":ptnr.emptyTab},
				"tab1" : {"url":"tab1.json","tab_cnt":"tab_container_2","hasData":0,"func":ptnr.loadTab2Data,"sfunc":ptnr.onSucess,"ffunc":ptnr.onFailure,"nodata":ptnr.emptyTab},
				"tab2" : {"url":"tab2.json","tab_cnt":"tab_container_3","hasData":0,"func":ptnr.loadTab3Data,"sfunc":ptnr.onSucess,"ffunc":ptnr.onFailure,"nodata":ptnr.emptyTab},
				"tab3" : {"url":"tab3.json","tab_cnt":"tab_container_4","hasData":0,"func":ptnr.loadTab4Data,"sfunc":ptnr.onSucess,"ffunc":ptnr.onFailure,"nodata":ptnr.emptyTab}
			}
			var $export = $("a.export"), postData = {};
			if(partnerType == 'RESELLER') {
				ptnr.loadData();
				myvmware.sdp.cmn.getCalendar('txt_receivedDate_from','txt_receivedDate_to');
				myvmware.sdp.cmn.getCalendar("txt_proDate_from","txt_proDate_to");
				if(rs.uploadErr && rs.uploadErr.status){ // This is only when there is an error
					vmf.modal.show('uploadRateCardModal',
						{onShow:function(){
							$("#uploadRateCardModal span#msg").html(rs.uploadErr.error);
							$("#uploadRateCardModal textarea[name='rateCardDesc']").val(rs.uploadErr.desc);
						}});
				}
				
				//Changes done for  omniture
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller :sdpPrtnrAccDtls']});
			}
			else {
				ptnr.loadTab1Data(ptnr.map['tab0']);
				myvmware.sdp.cmn.getCalendar("txt_pend_from","txt_pend_to");
				myvmware.sdp.cmn.getCalendar("txt_uploadedDate_from","txt_uploadedDate_to");
				myvmware.sdp.cmn.getCalendar("decFrom","decTo");
				
				//Changes done for  omniture
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti :sdpPrtnrAccDtls']});

				if(($export.hasClass("tbl_processed") || $export.hasClass("tbl_subscription") || $export.hasClass("tbl_declineRequest"))) {
					postData = {"resellerName":$.trim($("#cName").html()),"primaryContact":$.trim($("#pContact").html()),"emailID":$("#proc_cont_email a").html(),"autoApproveMaximum":encodeURIComponent(encodeURIComponent($.trim($("#mCurrency").html()+$("#mLimit").html()))) };					
				}
				$export.each(function(i, v){
					myvmware.sdp.cmn.exportFile(v, postData, true);
				})
			}			
			
			myvmware.sdp.cmn.events();
		},
		setFilterDefaults:function(){				
				$('#approve').html(rs.approve).closest('li').addClass('disabled');
				$('#reject').html(rs.reject).closest('li').addClass('disabled');
		},		
		changePriceListSuccess: function(res){
			if(typeof(res) != 'object') res = vmf.json.txtToObj(res);
			if(res.status != undefined && res.status) {
				vmf.modal.hide('changePriceList');
				if (res.currencyChange != undefined && res.currencyChange) {
					$('#priceListSuccess').removeClass('hidden');
					$('.priceListDiffCSuccess').removeClass('hidden');
				}else{
					$('#priceListSuccess').removeClass('hidden');
				}
				if(ptnr.timer1) clearTimeout(ptnr.timer1);
				ptnr.timer1 = setTimeout(function() { $("#priceListSuccess,.priceListDiffCSuccess").addClass("hidden"); }, 10000);
				$('#tbl_services').next(".bottom").hide();
				vmf.datatable.reload($('#tbl_services'), rs.url.serviecInstanceDetailsURL);
				$('#tbl_processed').next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pending'), rs.url.pendingRequestDetailsURL);
				$('#tbl_pending').next(".bottom").hide();
				vmf.datatable.reload($('#tbl_processed'), rs.url.processedOrderedDetailsURL);
				$('#changePriceList span.error').hide();
			} else if (res==null || typeof res.error_MESSAGE!="undefined") {
				$('#changePriceList span.error').html(res.error_MESSAGE).show();
			} else {
				$('#changePriceList span.error').html(rs.errorMsg).show();
			}
		},
		changePriceListFailure: function(res){
			$('#changePriceList span.error').html(rs.errorMsg).show();
		},
		//Bind Events
		bindEvents:function(){
			if(partnerType=="RESELLER" && !isReseller){
				$(".only-customer").hide();
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti :sdpPrtnrAccDtls : distiSubCust');
			} else {
				$(".onlyDisti").hide();
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller :sdpPrtnrAccDtls : distiSubCust');
			}
			$('#editPriceList').live('click', function(){
				vmf.modal.show('changePriceList',{
					checkPosition: true,
					onShow: function(dialog){
						vmf.datatable.build($('#tbl_priceListDetail'),{
							"bProcessing": true,
							"bAutoWidth": false,
							"bPaginate": true,
							"sPaginationType": "full_numbers",
							 "aoColumns": [
								{"sTitle": "","sWidth":"15px","bSortable":false},
								{"sTitle": "<span class=''>"+rs.defStatus+"</span>", "sWidth":"20px","bSortable":false},
								{"sTitle": "<span class=''>"+rs.priceListID+"</span>", "sWidth":"45px","bSortable":false},
								{"sTitle": "<span class=''>"+rs.fileName+"</span>", "sWidth":"50px","bSortable":false},
								{"sTitle": "<span class=''>"+rs.priceListDes+"</span>", "sWidth":"100px","bSortable":false}
							], 
							"sAjaxSource": rs.url.getRateCardsForCustDetail,
							"error":myvmware.sdp.cmn.dataTableError,
							"bServerSide": false,
							"aaSorting": [[1, 'desc']],
							"sScrollY": "329px",
							"sScrollX": "auto",
							"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
							"errMsg":rs.Unable_to_process_your_request,
							"sDom": 'rt<"bottom"lpi<"clear">>',
							"fnInitComplete": function(){
								var dtd = this, rowsLength, rowHeight;
								$('#tbl_priceListDetail').next(".bottom").hide();
								$(dtd).closest(".dataTables_scroll").addClass("bottomarea");
								rowsLength = $(dtd).find("tbody tr").length;
								if(rowsLength<10){
									rowHeight = $($(dtd).find("tbody tr")[0]).outerHeight(true);
									$(dtd).closest(".dataTables_scrollBody").css("height",rowsLength*rowHeight + "px");
								} else {
									$(dtd).closest(".dataTables_scrollBody").css("height","329px");
								}
								$("#changePriceList").closest(".simplemodal-container").height($("#changePriceList").height());
								$.modal.setPosition();
							},
							"fnDrawCallback":function(){
								if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
									$("#tbl_priceListDetail_paginate").css("display", "block");
								} else {
									$("#tbl_priceListDetail_paginate").css("display", "none");
								}
								if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_priceListDetail_length option:eq(0)").val(),10)){
									$("#tbl_priceListDetail_length").css("display", "block");
								} else {
									$("#tbl_priceListDetail_length").css("display", "none");
								}
							},
							"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
								var $nRow=$(nRow);
								if(($nRow.find("td:eq(0)").html() != '') && ($nRow.find("td:eq(0)").find('input').attr('checked') == true)){
									$nRow.find("td:eq(0)").html("<input type='radio' name='pricelist' checked='' id='"+aData[2]+"'/>");	
									$('#tbl_priceListDetail').data("selectedRateCardId",aData[2]);								
								}else{
									$nRow.find("td:eq(0)").html("<input type='radio' name='pricelist' id='"+aData[2]+"'/>");									
								}								
								if(aData[1].toLowerCase()=="y") {
									$nRow.find("td:eq(1)").html('<img width="16px" title="' + rs.Default_account + '" src="/static/myvmware/common/img/dot.png">').addClass("center");
								} else {
									$nRow.find("td:eq(1)").html('');
								}
								return nRow;
							}
						});
					}
				});
			});
			$('button#btn_cancelPriceList').live('click', function(){
				vmf.modal.hide('changePriceList');
			});
			$('button#btn_changePriceList').live('click', function(){
				$('#changePriceList span.error').hide();				
				var _postData = {					
					"_VM_rateCardId" :$( "#tbl_priceListDetail" ).data("selectedRateCardId"),
					"_VM_selectedEaNumbers" : $('#eaId').html(),
					"_VM_OldPriceListCurrency" : $('#currencyType').html()
				};
				vmf.ajax.post(rs.url.assignRateCardCustDetail,_postData,ptnr.changePriceListSuccess,ptnr.changePriceListFailure,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
			});
			$('#tbl_priceListDetail input').live('click', function(){
				$('#tbl_priceListDetail').data("selectedRateCardId",$(this).attr('id'));
				$('#btn_changePriceList').removeAttr('disabled').removeClass('disabled');
			});
			$('#monthly_limit').click(function(){
				vmf.modal.show('DefaultMonthlyAmt',{
					checkPosition: true,
					onShow: function (dialog) {
						if (partnerType == 'RESELLER') {
							var selectedCurreny = (partnerType == 'RESELLER')? rs.selCurrencytoModal : rs.selectedCurrency;
							var selectedCurrencySym = rs.currencyMap[selectedCurreny][0]
							$('#selCurrency').html(selectedCurrencySym);	
							var tempselcurrency = selectedCurreny;
						}else{
						var changeCur1=["<select id='currency'>"],defaultOpt = rs.defaultOption;
						var currencyMap =rs.currencyMap,selectedCurreny = '';
						selectedCurreny = (partnerType == 'RESELLER')? rs.selCurrencytoModal : rs.selectedCurrency;
						if($.trim(selectedCurreny).length<=0){
							changeCur1.push("<option value='' class='grayIn'>"+defaultOpt+"</option>");
							$("#DefaultMonthlyAmt .fn_save").addClass("disabled").attr("disabled","disabled");
						}
						for(key in currencyMap){
							changeCur1.push('<option value="'+key+'" class="grayOut">'+currencyMap[key][0]+'</option>');
						}
						changeCur1.push('</select>');
						$("#selCurrency").append(changeCur1.join(""));
						$("#currency").val(selectedCurreny);
						if($.trim(selectedCurreny).length<=0){
							$("#currency").addClass('grayIn');
						}
						var tempselcurrency =selectedCurreny;
						$('#currency').change(function() {
								$("#DefaultMonthlyAmt .fn_save").removeClass("disabled").removeAttr("disabled","disabled");
								tempselcurrency = $('#currency').val();
								$("#currency").find("option[value='']").remove().end().removeClass('grayIn');
						});

						}
						var limit = $.trim($('#mLimit').text());
							limit = limit.match(/[0-9,.]+/g);
							limit = (limit==null || limit==rs.noMonthlyLimit || !limit.length) ? "" : limit;
						$("#DefaultMonthlyAmt #msg").html("");
						$('#monthlyLimitVal').val(limit);
						$('.modalContent .fn_save').click(function(){
							$("#autoApproved").addClass("hidden");
							$("#DefaultMonthlyAmt #msg").html("");
							var value = $('input#monthlyLimitVal').val();
							var value1 = rs.currencyMap[tempselcurrency][1];
							var _postData = {'thresholdLimit':value.split(',').join(''),'thresholdCurrency':tempselcurrency}; 
							vmf.ajax.post(rs.url.setThresholdURL,_postData,function(res){
								if(typeof res!="object") res=vmf.json.txtToObj(res);
								if(res.status){
									($.trim((_postData['thresholdLimit']))!="") ? $('#mLimit').text(value) : $('#mLimit').text(rs.noMonthlyLimit);
									(($.trim((_postData['thresholdLimit']))!="") && $.trim((_postData['thresholdCurrency']))!="") ? $('#mCurrency').show().html(value1) : $('#mCurrency').show().html('');
									if(partnerType == 'RESELLER') {rs.selCurrencytoModal = tempselcurrency;}
									else {rs.selectedCurrency=tempselcurrency;}
									vmf.modal.hide();
									$("#autoApproved").removeClass("hidden");
									if(ptnr.timer) clearTimeout(ptnr.timer);
									ptnr.timer = setTimeout(function() { $("#autoApproved").addClass("hidden"); }, 10000);
								}
								else {
									$("#DefaultMonthlyAmt #msg").html(res.ERROR_MESSAGE || rs.genericError);
								}
							},
							function(){
								$("#DefaultMonthlyAmt #msg").html(res.ERROR_MESSAGE || rs.genericError);
							});
						//Changes done for  omniture 
						if(partnerType == "RESELLER") {
							if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller :sdpPrtnrAccDtls : auto_approve');
						}
						else{
							if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrAccDtls : auto_approve');
						}
						});
					}
				});
			});

			$('#editRateCard').click(function(e){
				e.preventDefault();
				vmf.modal.show('uploadRateCardModal',{
					checkPosition: true,
					onShow: function (dialog) {
						$('#monthlyLimitVal').val($('#mLimit').text());
						$('.modalContent .fn_save').click(function(){
							var _postData = {'thresholdLimit':$('input#monthlyLimitVal').val(),'thresholdType':"default"}; 
							vmf.ajax.post(rs.url.setThresholdURL,_postData,function(){$('#mLimit').text( _postData['thresholdLimit']);vmf.modal.hide()},function(){myvmware.sdp.cmn.showErrorModal(rs.genericError)});
						});
						$('.modalContent .fn_cancel').click(function(){vmf.modal.hide()});
					}
				});
			});

			$('ul.tabs li a').click(function(o,i){
				$('div.cal_error_div').hide();
				$('ul.tabs li a').removeClass('active');
				$(this).addClass('active');
				var idx = $(this).parent($(this)).index();
				var m = ptnr.map['tab'+idx];
				$('div.tabContainers').hide();
				$('#'+m.tab_cnt).show();
				if(!m.hasData)	m.func(m);
				return false;
			});

			$("#btn_sub_ApplyFilter").live('click',function(){
				var postData = {"customerName":$.trim($("#txt_custName").val()),"partnerID":$.trim($("#txt_ea").val()),"services":$("#txt_services").val()};
				$("#tbl_subscription").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_subscription'),rs.sdpSubscriptionCustomerSummaryUrl,myvmware.sdp.cmn.exportFile('a.tbl_subscription', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrAccDtls:subCust:filter');
			});
			
			$("#btn_sub_resetFilter").live('click',function(){
				$("#tbl_subscription").next(".bottom").hide();
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"customerName":"","partnerID":"","services":""};
				vmf.datatable.reload($('#tbl_subscription'),rs.sdpSubscriptionCustomerSummaryUrl,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_subscription', '');
			});
			
			$("#btn_pro_resetFilter").live('click',function(){
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"customerName":"","fromDate":"","toDate":"","services":"","orderType":"","remaining":"","serviceId":"","orderId":"","accountId":""};
				$("#tbl_processed").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_processed'),rs.url.processedOrderedDetailsForDisti,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_processed', '');
			});
			
			$("#btn_pro_ApplyFilter").live('click',function(){
				ptnr.orderTypeDef=$("#sel_orderType").val();
				ptnr.servicesDef=$("#sel_services").val();
				ptnr.remainDef=$("#sel_remain").val(); 
				var postData = {
					"customerName":$.trim($("#custName").val()),
					"fromDate":$.trim($("#txt_uploadedDate_from").val()),
					"toDate":$("#txt_uploadedDate_to").val(),
					"services":$("#sel_services").val(),
					"orderType":$("#sel_orderType").val(),
					"remaining":$("#sel_remain").val(),
					"orderId":$("#orderId").val(),
					"accountId":$("#accountId").val(),
					"serviceId":$("#serviceId").val()
				};
				
				$("#tbl_processed").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_processed'),rs.url.processedOrderedDetailsForDisti,myvmware.sdp.cmn.exportFile('a.tbl_processed', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrAccDtls:ProOrdrs:filter');
			});
			
			$("#btn_pend_resetFilter").live('click',function(){
			    ptnr.setFilterDefaults();
				$("#txt_cName,#txt_reqId,#txt_pend_from,#txt_pend_to").val("");
				var postData = {"requestId":"","fromDate":"","toDate":"","customerName":""};
				$("#tbl_pending").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pending'),rs.url.pendingRequestDetailsForDisti,function(){},"POST",postData);
			});
			
			$("#btn_pend_ApplyFilter").live('click',function(){
			    ptnr.setFilterDefaults();
				var postData = {"customerName":$.trim($("#txt_cName").val()),"fromDate":$.trim($("#txt_pend_from").val()),"toDate":$("#txt_pend_to").val(),"requestId":$("#txt_reqId").val()};
				$("#tbl_pending").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pending'),rs.url.pendingRequestDetailsForDisti,function(){},"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr:disti:sdpPrtnrAccDtls:pndingReq:filter');
			});
			
			$("#res_pending_apply").live("click",function(){
				ptnr.setFilterDefaults();
				var postData = {"requestId":$.trim($("#txt_requestID").val()),"fromDate":$.trim($("#txt_receivedDate_from").val()),"toDate":$("#txt_receivedDate_to").val()};
				$("#tbl_pending").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pending'),rs.url.pendingRequestDetailsURL,function(){},"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrAccDtls : filter');
			
			});
			
			$("#res_pending_reset").live("click",function(){
				ptnr.setFilterDefaults();
				$("#txt_requestID,#txt_receivedDate_from,#txt_receivedDate_to").val("");
				var postData = {"requestId":"","fromDate":"","toDate":""};
				$("#tbl_pending").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pending'),rs.url.pendingRequestDetailsURL,function(){},"POST",postData);
			});
			
			$("#res_pro_apply").live("click",function(){
				var postData = {"orderId":$.trim($("#txt_orderID").val()),"fromDate":$.trim($("#txt_proDate_from").val()),"toDate":$("#txt_proDate_to").val(),"orderType":$.trim($("#txt_orderType").val())};
				$("#tbl_processed").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_processed'),rs.url.processedOrderedDetailsURL,myvmware.sdp.cmn.exportFile('a.tbl_processed', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrAccDtls : filter');
			});
			
			$("#res_pro_reset").live("click",function(){
				$("#txt_orderID,#txt_proDate_from,#txt_proDate_to,#txt_orderType").val("");
				var postData = {"orderId":"","fromDate":"","toDate":"","orderType":""};
				$("#tbl_processed").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_processed'),rs.url.processedOrderedDetailsURL,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_processed', '');
			});
			
			$('#btn_Dec_ApplyFilter').die('click').live('click', function(){
				var postData = {"requestId":$.trim($("#reqID").val()),"serviceId":$.trim($("#serID").val()),"customerName":$("#cusName").val(), "resellerName": $('#resName').val(), "fromDate": $('#decFrom').val(), "toDate": $('#decTo').val()};
				$("#tbl_declineRequest").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_declineRequest'),rs.url.declineRequestFilter,myvmware.sdp.cmn.exportFile('a.tbl_declineRequest', postData),"POST",postData);
			});
				
			$("#btn_Dec_resetFilter").live('click',function(){
				$("#tbl_declineRequest").next(".bottom").hide();
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"requestId":"","serviceId": "","customerName": "", "resellerName": "", "decFromDate": "", "decToDate": ""};
				vmf.datatable.reload($('#tbl_declineRequest'),rs.url.declineRequestFilter,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_declineRequest', '');
			});
			
		},
		approveSuccess:function(selRows){
			return function(res){
				if (typeof res!="object") res=vmf.json.txtToObj(res);
				if(res.status){
					$.each(selRows,function(i,v){
						ptnr.dt.fnDeleteRow(ptnr.dt.fnGetPosition($(v)[0]));
					})
					ptnr.onSelectChkBox();
				} else {

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
			}
		},
		rejectSuccess:function(selRows){
			return function(res){
				if (typeof res!="object") res=vmf.json.txtToObj(res);
				if(res.status){
					$.each(selRows,function(i,v){
						ptnr.dt.fnDeleteRow(ptnr.dt.fnGetPosition($(v)[0]));
					})
					ptnr.onSelectChkBox();
				} else {

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
			}
		},
		loadData:function(m){
			vmf.datatable.build($('#tbl_services'),{
				"bAutoWidth": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "<span class='descending'>"+rs.alert+"</span>", "sWidth":"40px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>", "sWidth":"50px", "bSorting": false},
					{"sTitle": "<span class='descending'>"+rs.sid+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.services+"</span>", "sWidth":"150px"},
					{"sTitle": "<span class='descending'>"+rs.region+"</span>", "sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.customerRenewOption+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.cost_monthly+"</span>","sWidth":"80px","bSortable": false},
					{"sTitle": "<span class='descending'>"+rs.contractEnd+"</span>","sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.time_remaining+"</span>","sWidth":"60px"}
				],
				"sAjaxSource": rs.url.serviecInstanceDetailsURL,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"aaSorting": [[0, 'asc']],
				"bProcessing":true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage({sEmptyTable:rs.no_information_display}),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					var $nRow = $(nRow), alertClass = 'alertIcon'+aData[0], status;
					$nRow.find("td:eq(0)").html("<span class='"+alertClass+"' title='"+eval("rs.alert_"+aData[0])+"'></span>");
					$nRow.find("td:eq(1)").addClass('alertColor'+aData[0]);
					if(aData[8] == rs.not_available)	{
						$nRow.find('td:eq(6)').html('<a href="#" class="fn_tooltip text_dec_none" data-tooltip-position="bottom" title="'+rs.not_available_msg+'">'+aData[8]+'</a>');
					}
					else{$nRow.find('td:eq(6)').html(aData[8]);}
					$nRow.find('td:eq(7)').html(aData[9]);
					$nRow.find('td:eq(8)').html(aData[10]).addClass('alertColor'+aData[0]);
					$nRow.find("td:eq(2)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[11])+"'>"+aData[2]+"</a>");
					return nRow;
				},
				"fnDrawCallback":function(){
					myvmware.hoverContent.bindEvents('.fn_tooltip', 'defaultfunc','','', true);
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_services_paginate").css("display", "block");
					} else {
						$("#tbl_services_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_services_length option:eq(0)").val(),10)){
						$("#tbl_services_length").css("display", "block");
					} else {
						$("#tbl_services_length").css("display", "none");
					}
					var settings = this.fnSettings();
					if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
						var cusData = jsonResp.wrapper;
						$("#eaId").html(cusData.accountID);
						$("#cName, #aName, #changePriceList span#customerName").html(cusData.customerName);
						if($.trim(cusData.rateCardName)!=null && $.trim(cusData.rateCardName).length){
							$('#changePriceList span#currentPriceList').html(cusData.rateCardName);
							$("#rate_card").html(cusData.rateCardName).attr("href",rs.url.getRateCardDetailsUrl+"?_VM_rateCardId="+escape(cusData.rateCardID));
						} else if(!$('#rate_card').parent().find('span').length){
							$("#rate_card").parent().prepend("<span>"+rs.noPriceListApplied+"</span>");
						} else {}
						if((cusData.puEmail).length){
							$("#proc_cont").html('<a href="mailto:'+cusData.puEmail+'">'+cusData.puName+'</a>');
						} else {
							$("#proc_cont").html(cusData.puName);
						}
						$("#proc_cont_phone").html(cusData.puPhone);
						var custCurrency ='';
						if(partnerType == 'RESELLER') {custCurrency = cusData.currencySymbol;rs.selCurrencytoModal = cusData.currencyCode;}						
						else{custCurrency = rs.selectedCurrency;}
						$('#currencyType').html(cusData.priceListCurrency);
						$("#mCurrency").html(custCurrency);
						$("#mLimit").html((cusData.monthlyLimit!=null && $.trim(cusData.monthlyLimit).length > 0) ?cusData.monthlyLimit:rs.noMonthlyLimit);
						if(cusData.monthlyLimit==null || $.trim(cusData.monthlyLimit).length <= 0) {$("#mCurrency").hide();}
						$("#resellerName").html((cusData.resellerName!="null") ? "<a href='"+rs.url.resellerDetails+"'>"+cusData.resellerName+"</a>" : "");
					}
				},
				"fnInitComplete": function(){
					var dtd = this, $export = $("a.export.tbl_services"), postData = {};
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="9"></td></tr></tfoot>')
					$('#tbl_services').next(".bottom").show();
					$('#editPriceList, #monthly_limit').show();
					if($export.hasClass('tbl_services')) {
						if(isReseller)
							postData = {"customerName":$.trim($("#aName").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html()),"autoApproveMaximum":encodeURIComponent(encodeURIComponent($.trim($("#mCurrency").html()+$("#mLimit").html()))), "rateCardFileName": $.trim($("#rate_card").html())};
						else
							postData = {"distiCustomerName":$.trim($("#aName").html()),"resellerName":$.trim($("#resellerName a").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html())};
					}
					myvmware.sdp.cmn.exportFile($export, postData, true);
				}
			});
			/*****isXaasFund******/
			if(rs.isXaasFund=='1'){
				vmf.datatable.build($('#subscription_services'),{
				"bAutoWidth": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bFilter": false,
				"aoColumns": [
					//{"sTitle": "<span class='descending'>"+rs.alert+"</span>", "sWidth":"40px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>", "sWidth":"50px", "bSorting": false},
					{"sTitle": "<span class='descending'>"+rs.sid+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.services+"</span>", "sWidth":"150px"},
					
					{"sTitle": "<span class='descending'>"+rs.region+"</span>", "sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.customerRenewOption+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>Subscription Funds</span>", "sWidth":"150px"},
					{"sTitle": "<span>"+rs.cost_monthly+"</span>","sWidth":"80px","bSortable": false},
					{"sTitle": "<span class='descending'>"+rs.contractEnd+"</span>","sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.time_remaining+"</span>","sWidth":"60px"}
				],
				
				"sAjaxSource": rs.url.subscriptionfundServiceTableURL,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"aaSorting": [[0, 'asc']],
				"bProcessing":true,
				"errMsg":rs.Unable_to_process_your_request,
				"oLanguage": $.extend(
					myvmware.sdp.cmn.datatableLanguage(), {
						sEmptyTable: rs.subServicesCustErrMsg
					}
				),
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					var $nRow = $(nRow), alertClass = 'alertIcon'+aData[0], status;
					//$nRow.find("td:eq(0)").html("<span class='"+alertClass+"' title='"+eval("rs.alert_"+aData[0])+"'></span>");
					$nRow.find("td:eq(0)").addClass('alertColor'+aData[0]);
					$nRow.find('td:eq(0)').html(aData[1]);
					$nRow.find('td:eq(3)').html(aData[4]);
					$nRow.find('td:eq(4)').html(aData[5]);
					$nRow.find('td:eq(5)').html(aData[6]);
					$nRow.find('td:eq(6)').html(aData[9]);
					$nRow.find('td:eq(7)').html(aData[10]);
					$nRow.find('td:eq(8)').html(aData[11]).addClass('alertColor'+aData[0]);
					$nRow.find("td:eq(1)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[12])+"'>"+aData[2]+"</a>");
					$nRow.find('td:eq(2)').html(aData[3]);
					return nRow;
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#subscription_services_paginate").css("display", "block");
					} else {
						$("#subscription_services_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#subscription_services_length option:eq(0)").val(),10)){
						$("#subscription_services_length").css("display", "block");
					} else {
						$("#subscription_services_length").css("display", "none");
					}
					var settings = this.fnSettings();
				},
				"fnInitComplete": function(){
					var dtd = this, $export = $("a.export2"), postData = {};
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="9"></td></tr></tfoot>')
					$('#subscription_services').next(".bottom").show();
					$('#editPriceList, #monthly_limit').show();
					if($export.hasClass('tbl_processed2')) {
						if(isReseller)
							postData = {"customerName":$.trim($("#aName").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html()),"autoApproveMaximum":encodeURIComponent(encodeURIComponent($.trim($("#mCurrency").html()+$("#mLimit").html()))), "rateCardFileName": $.trim($("#rate_card").html())};
						else
							postData = {"distiCustomerName":$.trim($("#aName").html()),"resellerName":$.trim($("#resellerName a").html()),"eaNumber":$.trim($("#eaId").html()),"procurementContact":$("#proc_cont a").html(),"phoneNumber":$.trim($("#proc_cont_phone").html())};
					}
					myvmware.sdp.cmn.exportFile($export, postData, true);
				}
			});
			}
				
			
			/**********fund detail table********/
			$("#fundDetail").live("click",function(){
			
			vmf.modal.show("Sub_Funds_Details",{onShow: function (dialog) {
	
			
				//datatable build
					vmf.datatable.build($('#funds_Details_table'),{
				"sScrollY": "240px",
				"scrollCollapse": true,	
				"bAutoWidth": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bFilter": false,
				"aoColumns": [
					//{"sTitle": "<span class='descending'>"+rs.alert+"</span>", "sWidth":"40px"},
					{"sTitle": "<span class='descending'>"+fd.FundName+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+fd.FundBalance+"</span>", "sWidth":"90"},
					{"sTitle": "<span class='descending'>"+fd.expiryDate+"</span>", "sWidth":"90px"},
					{"sTitle": "<span class='descending'>"+fd.monthlyCost+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+fd.timeRemain+"</span>", "sWidth":"140px"},
					{"sTitle": "<span class='descending'>"+fd.alert+"</span>","sWidth":"170px"}
				],
				
				"sAjaxSource": rs.url.fundDetailRequestURL,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				//"aaSorting": [[1, 'asc']],
				"bProcessing":true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
					var $nRow = $(nRow), alertClass = 'alertIcon'+aData[0], status;
					$nRow.find('td:eq(0)').html(aData[0]);
					if(aData[5]==0){
						$nRow.find('td:eq(1)').html(aData[1]).css('color','#ff0000');
					}
					else{
						$nRow.find('td:eq(1)').html(aData[1]);
					}
					$nRow.find('td:eq(2)').html(aData[2]);
					$nRow.find('td:eq(3)').html(aData[3]);
					if(aData[5]==0){
						$nRow.find('td:eq(4)').html("- "+aData[4]).css('color','#ff0000');
					}else{
						$nRow.find('td:eq(4)').html(aData[4]);					
					}
					if($.trim(aData[6]) != ""){
					$nRow.find('td:eq(5)').html("<span class='alertIcon999 fLeft'></span>"+aData[6]).css('color','#ff0000');
					}else{
					$nRow.find('td:eq(5)').html("");
					}
					
					return nRow;
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#funds_Details_table_paginate").css("display", "block");
					} else {
						$("#funds_Details_table_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#funds_Details_table_length option:eq(0)").val(),10)){
						$("#funds_Details_table_length").css("display", "block");
					} else {
						$("#funds_Details_table_length").css("display", "none");
					}
					
				
				}
			});
			/************height adjustment************/
				$("#Sub_Funds_Details").closest(".simplemodal-container")
				.height($("#Sub_Funds_Details").height()).prepend("<a href=\"javascript:myvmware.common.openHelpPage('http://kb.vmware.com/kb/2006973?plainview=true');\" class=\"help\"></a>");
				setTimeout(function(){
					$.modal.setPosition();
				}, 1000);
				}},{onClose: function (dialog) {vmf.modal.hide();}});
			});
			var pending={"aaData": [["","","3421","1004253","Amy John","3","12/23/2012","$ 340","10 mon"],
					["","","3443","10031233","John Smith","6","12/24/2012","$ 450","10 mon"],
					["","","3424","10031333","Scott Richard","8","12/28/2012","$ 450","12 mon"]
				],
				"subaaData":{
					"3421" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3443" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3424" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				},
				"status": null
			};
			vmf.datatable.build($('#tbl_pending'),{
					"bAutoWidth": false,
					"bFilter": false,
					"bPaginate": true,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
					"iDisplayLength": 5,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"aoColumns": [
						{"sTitle": "","sWidth":"20px","bSortable":false},
						{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
						{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='descending'>"+rs.sid+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.requestor+"</span>", "sWidth":"90px"},
						{"sTitle": "<span class='descending'>"+rs.total_serv+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='descending'>"+rs.recieved_date+"</span>", "sWidth":"100px"},
						{"sTitle": "<span class='descending'>"+rs.pr_cost_monthly+"</span>", "bVisible": false},
						{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>","sWidth":"100px"},
						{"sTitle": "<span>"+rs.orderTotal+"</span>","sWidth":"100px","bSortable": false}
					],
					"sAjaxSource": rs.url.pendingRequestDetailsURL,
					"error":myvmware.sdp.cmn.dataTableError,
					"bServerSide": false,
					"bProcessing":true,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow);
						$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
						if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' name='pendingChks' checked=''/>").end().data("id",aData[2]);
						}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' name='pendingChks'/>").end().data("id",aData[2]);
						}
						$(nRow).find("td:eq(3)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[12])+"'>"+aData[3]+"</a>");
						$(nRow)[0].idx = iDisplayIndex;
						$(nRow).find('td:eq(7)').addClass('alertColor'+aData[11])
						if($.trim(aData[4]).length){
							if($.trim(aData[10]).length){
								$(nRow).find("td:eq(4)").html("<a target='_blank' title='"+aData[10]+"' href='mailto:"+aData[10]+"'>"+aData[4]+"</a>");
							} else {
								$(nRow).find("td:eq(4)").html(aData[4]);
							}
						}
						return nRow;
					},
					"fnInitComplete": function(){
						ptnr.dt = this;
						if(!ptnr.dt.find('tfoot').length) $(ptnr.dt).append('<tfoot><tr><td class="bottomarea" colspan="9"></td></tr></tfoot>');
						$('#tbl_pending').next(".bottom").show();
						var pSettings= this.fnSettings();
						if(pSettings.jqXHR && pSettings.jqXHR.responseText!==null && pSettings.jqXHR.responseText.length && typeof pSettings.jqXHR.responseText =="string"){
							ptnr.pendingJson = vmf.getObjByIdx(vmf.json.txtToObj(pSettings.jqXHR.responseText),0);
						} 
						$('#tbl_pending').find('span.openclose').die('click').live("click",function (){
							ptnr.expandRow1($(this),ptnr.dt);
						});
						myvmware.common.selectAllChks(ptnr.dt,ptnr.onSelectChkBoxACDetail);
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_pending_paginate").css("display", "block");
						} else {
							$("#tbl_pending_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pending_length option:eq(0)").val(),10)){
							$("#tbl_pending_length").css("display", "block");
						} else {
							$("#tbl_pending_length").css("display", "none");
						}
					}
				});
				
				var processed = {
					"aaData": [
						["","3445","1004253","Add On","Complete","Bobby Lee","vCloud Infrastucture Service","11/23/2012","$ 340","4 mon"],
						["","3447","1431233","Add On","Complete","Scott Richard","vCloud Infrastucture Service","11/23/2012","$ 340","4 mon"],
						["","3455","1004253","Add On","Complete","Amy John","vCloud Infrastucture Service","12/23/2012","$ 340","6 mon"]
					],
					"subaaData":{
						"3445" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
						"3455" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
						"3447" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532065","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
								  ["532098","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
					}
				}
				vmf.datatable.build($('#tbl_processed'),{
					"bAutoWidth": false,
					"bFilter": false,
					"bPaginate": true,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
					"iDisplayLength": 5,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"aoColumns": [
						{"sTitle": "","sWidth":"20px","bSortable":false},
						{"sTitle": "<span class='descending'>"+rs.order_id+"</span>", "sWidth":"60"},
						{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>","sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.processed_sid+"</span>", "sWidth":"80"},
						{"sTitle": "<span class='descending'>"+rs.order_type+"</span>","sWidth":"65"},
						{"sTitle": "<span class='descending'>"+rs.processed_status+"</span>","sWidth":"60"},
						{"sTitle": "<span class='descending'>"+rs.processed_requestor+"</span>", "sWidth":"90"},
						{"sTitle": "<span class='descending'>"+rs.services+"</span>", "sWidth":"130px"},
						{"sTitle": "<span class='descending'>"+rs.prov_date+"</span>", "sWidth":"80"},
						{"sTitle": "<span>"+rs.processed_cost_monthly+"</span>", "bVisible":false, "bSortable":false},
						{"sTitle": "<span class='descending'>"+rs.time_remaining+"</span>", "sWidth":"70"}
					],
					"sAjaxSource": rs.url.processedOrderedDetailsURL,
					"error":myvmware.sdp.cmn.dataTableError,
					"bServerSide": false,
					"bProcessing":true,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"fnRowCallback": function(nRow,aData,iDisplayIndex){
						var	alertIconClass = 'alertIcon'+aData[2], status,
							alertColorClass = 'alertColor'+aData[2];
						$(nRow).find("td:eq(2)").addClass(alertColorClass).html("<span class='"+alertIconClass+" alertTxtSpace' title='"+eval("rs.alert_"+aData[2])+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[12]+"</label>");
						$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]+":"+aData[3]);
						$(nRow).find("td:eq(3)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[13])+"'>"+aData[3]+"</a>");
						$(nRow)[0].idx = iDisplayIndex;
						if($.trim(aData[6]).length){
							if($.trim(aData[11]).length){
								$(nRow).find("td:eq(6)").html("<a target='_blank' title='"+aData[11]+"' href='mailto:"+aData[11]+"'>"+aData[6]+"</a>");
							} else {
								$(nRow).find("td:eq(6)").html(aData[6]);
							}
						}
						$(nRow).find('td:eq(9)').addClass('alertColor'+aData[2]);
						return nRow;
					},
					"fnInitComplete": function(){
						var dtd = this;
						if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="10"></td></tr></tfoot>');
						$('#tbl_processed').next(".bottom").show();
						var prSettings= this.fnSettings();
						if(prSettings.jqXHR && prSettings.jqXHR.responseText!==null && prSettings.jqXHR.responseText.length && typeof prSettings.jqXHR.responseText =="string"){
							ptnr.processJson = vmf.getObjByIdx(vmf.json.txtToObj(prSettings.jqXHR.responseText),0);
						}
						$('#tbl_processed').find('span.openclose').die('click').live("click",function (){
							ptnr.expandRow2($(this),dtd);
						});
						myvmware.sdp.cmn.dataTableSuccess($(dtd));
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_processed_paginate").css("display", "block");
						} else {
							$("#tbl_processed_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_processed_length option:eq(0)").val(),10)){
							$("#tbl_processed_length").css("display", "block");
						} else {
							$("#tbl_processed_length").css("display", "none");
						}
					}
				});
		}, // End of components datatable config
		loadTab1Data:function(m){
			vmf.datatable.build($('#tbl_pending'),{
				"bAutoWidth": false,
				"bFilter": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"60px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"85px"},
					{"sTitle": "<span class='descending'>"+rs.siCount+"</span>", "sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.recieved_date+"</span>", "sWidth":"120px"},
					{"sTitle": "<span class='descending'>"+rs.pr_cost_monthly+"</span>", "bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"62px"},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"70px","bSortable":false}
				],
				"sAjaxSource": rs.url.pendingRequestDetailsForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"bProcessing":true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
					var $nRow = $(nRow);					
					if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' checked='' style='margin-right:5px'>").end().data("id",aData[2]);
					}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' style='margin-right:5px'>").end().data("id",aData[2]);
					}
					$(nRow).find("td:eq(3)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[13])+"'>"+aData[3]+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					$(nRow).find("td:eq(5)").html("<a href='"+rs.url.customerDetailsDistiReseller+"&_VM_selectedEaNumber="+aData[4]+"'>" + aData[5] + "</a>");
					$(nRow).find("td:eq(8)").addClass('alertColor'+aData[12]);
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="10"></td></tr></tfoot>');
					$('#tbl_pending').next(".bottom").show();
					pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
							ptnr.pendingJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					} else {
					  if(typeof d == "object") ptnr.pendingJson=d; // Need to remove this after testing
					}
					$('#tbl_pending').find('span.openclose').die('click').live("click",function (){
						ptnr.expandRow1($(this),dtd);
					});
					myvmware.common.selectAllChks(this,ptnr.onSelectChkBox);
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_pending_paginate").css("display", "block");
					} else {
						$("#tbl_pending_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pending_length option:eq(0)").val(),10)){
						$("#tbl_pending_length").css("display", "block");
					} else {
						$("#tbl_pending_length").css("display", "none");
					}
				}
			}); // End of addons
			m.hasData=1;
		},
		loadTab2Data:function(m){
			vmf.datatable.build($('#tbl_processed'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.order_id+"</span>", "sWidth":"60px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStat+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.order_type+"</span>","sWidth":"80px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>","sWidth":"60px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"90px"},
					{"sTitle": "<span class='descending'>"+rs.services+"</span>", "sWidth":"150px"},
					{"sTitle": "<span class='descending'>"+rs.prov_date+"</span>", "sWidth":"80px"},
					{"sTitle": "<span>"+rs.processed_cost_monthly+"</span>", "sWidth":"80px", "bSortable":false, "bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span class='descending'>"+rs.time_remaining+"</span>", "sWidth":"70px"}
				],
				"sAjaxSource": rs.url.processedOrderedDetailsForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var alertIconClass = 'alertIcon'+aData[2], status,
						alertColorClass = 'alertColor'+aData[2];
					$(nRow).find("td:eq(2)").addClass(alertColorClass).html("<span class='"+alertIconClass+" alertTxtSpace' title='"+eval("rs.alert_"+aData[2])+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[12]+"</label>");
					$(nRow).find("td:eq(10)").addClass('alertColor'+aData[2]);
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]+":"+aData[3]);
					$(nRow)[0].idx = iDisplayIndex;
					$(nRow).find("td:eq(6)").html("<a href='"+rs.url.customerDetailsDistiReseller+"&_VM_selectedEaNumber="+aData[5]+"'>" + aData[6] + "</a>");
					$(nRow).find("td:eq(3)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[13])+"'>"+aData[3]+"</a>");
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this, colspan = (partnerType != 'RESELLER') ? 11 : 10;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="'+colspan+'"></td></tr></tfoot>');
					$('#tbl_processed').next(".bottom").show();
					
					$('#tbl_processed').find('span.openclose').die('click').live("click",function (){
						ptnr.expandRow2($(this),dtd);
					});
					myvmware.sdp.cmn.buildSelectBox("#sel_orderType",ptnr.orderType, ptnr.orderTypeDef);
					myvmware.sdp.cmn.buildSelectBox("#sel_services",ptnr.services, ptnr.servicesDef);
					myvmware.sdp.cmn.buildSelectBox("#sel_remain",ptnr.remain, ptnr.remainDef);
					ptnr.orderTypeDef="";
					ptnr.servicesDef="";
					ptnr.remainDef="";
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_processed_paginate").css("display", "block");
					} else {
						$("#tbl_processed_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_processed_length option:eq(0)").val(),10)){
						$("#tbl_processed_length").css("display", "block");
					} else {
						$("#tbl_processed_length").css("display", "none");
					}
					var proSettings= this.fnSettings();
					if(proSettings.jqXHR && proSettings.jqXHR.responseText!==null && proSettings.jqXHR.responseText.length && typeof proSettings.jqXHR.responseText =="string"){
						ptnr.processJson = vmf.getObjByIdx(vmf.json.txtToObj(proSettings.jqXHR.responseText),0);
						$.each(ptnr.processJson.aaData,function(i,v){
							ptnr.orderType[v[4]] = v[4];
							ptnr.services[v[7]] = v[7];
							if($.trim(v[10]).length) ptnr.remain[v[10]] = v[10];
						});
					}
				}
			}); // End of related services table
			m.hasData=1;
			//Changes done for  omniture
			if (typeof riaLinkmy!="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrAccDtls : procOrdr');
		},
		loadTab3Data:function(m){
			vmf.datatable.build($('#tbl_subscription'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"200px"},
					{"sTitle": "<span class='descending'>"+rs.siCount+"</span>","sWidth":"200px"},
					{"sTitle": "<span class='descending'>"+rs.pr_contract+"</span>", "sWidth":"200px"}
				],
				"sAjaxSource": rs.url.subscriptionCustomersForReseller,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"aaSorting": [[0, 'desc']],
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
				    var $nRow = $(nRow),  alertClass = 'alertIcon'+aData[0];
					$(nRow).find("td:eq(0)").html("<span class='"+alertClass+"' title='"+eval("rs.alert_"+aData[0])+"'></span>");
					//$(nRow).find("td:eq(0)").html("<input type='checkbox' style='margin-right:5px'><span class=\"openclose\"></span>");
					$nRow.find("td:eq(2)").html("<a href='"+rs.url.customerDetailsDistiReseller+"&_VM_selectedEaNumber="+aData[1]+"'>" + aData[2] + "</a>");
					$nRow[0].idx = iDisplayIndex;
					if($.trim(aData[4]).length) {
						if($.trim(aData[5]).length){
							$nRow.find('td:eq(4)').html('<a title="'+aData[5]+'" href="mailto:'+aData[5]+'">'+aData[4]+'</a>');
						} else {
							$nRow.find('td:eq(4)').html(aData[4]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="5"></td></tr></tfoot>');
					$('#tbl_subscription').next(".bottom").show();
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_subscription_paginate").css("display", "block");
					} else {
						$("#tbl_subscription_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_subscription_length option:eq(0)").val(),10)){
						$("#tbl_subscription_length").css("display", "block");
					} else {
						$("#tbl_subscription_length").css("display", "none");
					}
				}
			}); // End of related services table
			m.hasData=1;
			//Changes done for  omniture
			if (typeof riaLinkmy!="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrAccDtls : distiSubCust');
		},
		loadTab4Data:function(m){
			vmf.datatable.build($('#tbl_declineRequest'),{
				"bAutoWidth": false,
				"bFilter": false,
				"bPaginate": true,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"85px"},
					{"sTitle": "<span class='descending'>"+rs.par_id+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.reseName+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.decl_by+"</span>", "sWidth": "100px"},
					{"sTitle": "<span class='descending'>"+rs.decl_date+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.comment+"</span>", "sWidth":"85px"}
				],
				"sAjaxSource": rs.url.declinedRequestDetailsForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"bProcessing":true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"bDestroy": true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow = $(nRow);
					$nRow[0].idx = iDisplayIndex;
					$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]);
					$nRow.find("td:eq(2)").html("<a href='"+rs.url.sidDetails+"&_VM_serviceID="+escape(aData[11])+"'>"+aData[2]+"</a>");
					$nRow.find("td:eq(4)").html("<a href='"+rs.url.customerDetailsDistiReseller+"&_VM_selectedEaNumber="+aData[3]+"'>" + aData[4] + "</a>");
					$nRow.find("td:eq(6)").html("<a href='"+rs.url.resellerDetailsDistiReseller+"&_VM_selectedEaNumber="+aData[3]+"'>" + aData[6] + "</a>");
					$nRow.find("td:eq(7)").html("<a href='mailto:"+aData[10]+"'>" + aData[7] + "</a>");
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this, pdgSettings= dtd.fnSettings();
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="10"></td></tr></tfoot>');
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						ptnr.declineJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					} else {
					  if(typeof d == "object") ptnr.declineJson=d;
					}
					$('#tbl_declineRequest').next(".bottom").show();
					$('#tbl_declineRequest').find('span.openclose').die('click').live("click",function (){
						ptnr.expandRow5($(this),dtd);
					});
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_declineRequest_paginate").css("display", "block");
					} else {
						$("#tbl_declineRequest_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_declineRequest_length option:eq(0)").val(),10)){
						$("#tbl_declineRequest_length").css("display", "block");
					} else {
						$("#tbl_declineRequest_length").css("display", "none");
					}
				}
			}); // End of addons
			m.hasData=1;
		},
		expandRow5 :function(link,table){
			nTr5 = link[0].parentNode.parentNode;
			if (link.hasClass('minus')){
				link.removeClass('minus');
				$(nTr5).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				link.addClass('minus');
				$(nTr5).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr5.haveData){
					table.fnOpen(nTr5,ptnr.showloading(),'');
					ptnr.getCdata5($(nTr5), nTr5.idx);
					nTr5.haveData = true;
					$(nTr5).next("tr").addClass('more-detail');
				}else
					$(nTr5).next("tr").show();			
			}
		},
		getCdata5:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(nTr5).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table1-" + idx);
			var cdata = ptnr.declineJson.subaaData[$(nTr5).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>"+rs.components+"</span>","sWidth":"250px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.MSRP_Price+"</span>","sWidth":"80px","bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
				}
			});
		},
		expandRow1 :function(o,t){
			 nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr1.haveData){
					t.fnOpen(nTr1,ptnr.showloading(),'');
					ptnr.getCdata1($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").show();			
			}	
		},
		expandRow2 :function(o,t){
			nTr2 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr2).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr2).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr2.haveData){
					t.fnOpen(nTr2,ptnr.showloading(),'');
					ptnr.getCdata2($(nTr2), nTr2.idx);
					nTr2.haveData = true;
					$(nTr2).next("tr").addClass('more-detail');
				}else
					$(nTr2).next("tr").show();
			}	
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		getCdata1:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table1-" + idx);
			var cdata = ptnr.pendingJson.subaaData[$(nTr1).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>"+rs.components+"</span>","sWidth":"250px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.MSRP_Price+"</span>","sWidth":"80px","bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false,"bVisible":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
				}
			})
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + idx ) + '"></table>');
			$(nTr2).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + idx);
			var cdata = ptnr.processJson.subaaData[$(nTr2).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.SKU+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.components+"</span>","sWidth":"200px","bSortable":false},
					{"sTitle": "<span>"+rs.quantity+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.MSRP_Price+"</span>", "sWidth":"80px", "bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span>"+rs.monthly_Remaining+"</span>","sWidth":"100px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					$subTable.next(".bottom").show();
				}
			})
		},
		onSelectChkBox: function(tbl){
			var selected = tbl.find("tbody input:checkbox:checked").length;
			var approveElement = $("#approve");
			var rejectElement = $("#reject");
			var selectedPendingArray = [], rowListArray = [];
			if (selected != 0 && (rs.isAdmin == 'true' || rs.isPricingUser == 'true') && !(tbl.has('td.dataTables_empty').length > 0)){
				approveElement.html("<a href='#'>"+rs.approve+"</a>").closest('li').removeClass('disabled');
				rejectElement.html("<a href='#'>"+rs.reject+"</a>").closest('li').removeClass('disabled');
			} else {
				approveElement.html(rs.approve).closest('li').addClass('disabled');
				rejectElement.html(rs.reject).closest('li').addClass('disabled');
			}
			
			if(tbl.find('table').attr('id') == 'tbl_pendingReq' || tbl.find('table').attr('id') == 'tbl_pending' ){	
					$.each(tbl.find("tbody input:checkbox:checked"),function(i,v){
						selectedPendingArray.push($(v).closest('tr').data('id'));
						rowListArray.push($(v).closest('tr'));						
					});
					tbl.find('table').data('selectedPendingArray',selectedPendingArray);
					tbl.find('table').data('rowListArray',rowListArray);
			}
		},
		onSelectChkBoxACDetail: function(tbl){
			var selected = tbl.find("tbody input:checkbox:checked").length;
			var approveElement = $("#approve");
			var rejectElement = $("#reject");
			var selectedPendingArray = [], rowListArray = [];
			if (partnerType == "RESELLER" && isReseller && selected && (rs.isAdmin == 'true') && !(tbl.has('td.dataTables_empty').length > 0)){
				approveElement.html("<a href='#'>"+rs.approve+"</a>").closest('li').removeClass('disabled');
				rejectElement.html("<a href='#'>"+rs.reject+"</a>").closest('li').removeClass('disabled');
			} else {
				approveElement.html(rs.approve).closest('li').addClass('disabled');
				rejectElement.html(rs.reject).closest('li').addClass('disabled');
			}
			if(tbl.find('table').attr('id') == 'tbl_pendingReq' || tbl.find('table').attr('id') == 'tbl_pending' ){	
					$.each(tbl.find("tbody input:checkbox:checked"),function(i,v){
						selectedPendingArray.push($(v).closest('tr').data('id'));
						rowListArray.push($(v).closest('tr'));						
					});
					tbl.find('table').data('selectedPendingArray',selectedPendingArray);
					tbl.find('table').data('rowListArray',rowListArray);
			}
		}
	},
	"rCard" :{
		"init":function(){
			sdp = myvmware.sdp;
			rc=myvmware.sdp.rCard;
			myvmware.common.showMessageComponent('PARTNER_PRICELIST');
			rc.loadData();
			rc.getCalendar();
			rc.bindEvents();
			myvmware.sdp.cmn.events();
			rc.dt=null;
			rc.currency= {};
			rc.priceList = null;
			rc.productFamilyDef = '';
			//Changes done for  omniture
			callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller :sdpPrtnrRateCards']});
		},
		loadData:function(){
			var tableStart = 0, flag = false;
			vmf.datatable.build($('#tbl_sdpRateCard'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span><input type='checkbox' id='tbl_selectAll' class='tbl_selectAll' name='group_all'/></span>", "sWidth":"30px","bSortable": false},
						{"sTitle": "<span class='descending'>"+rs.defaultFlag+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.ID+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.rateCardFileName+"</span>", "sWidth":"100px"},
						{"sTitle": "<span class='descending'>"+rs.priceListCurrency+"</span>", "sWidth":"100px"},
						{"sTitle": "<span class='descending'>"+rs.rateCardDesc+"</span>", "sWidth":"120px"},
						{"sTitle": "<span class='descending'>"+rs.assignee+"</span>", "sWidth":"130px"},
						{"sTitle": "<span class='descending'>"+rs.createddate+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.uploadedby+"</span>", "sWidth":"70px"},
						{"sTitle": "","bVisible":false}
					], 
					"sAjaxSource": rs.getAllRateCardsUrl,
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"errMsg":rs.Unable_to_process_your_request,
					"oLanguage": $.extend(
						myvmware.sdp.cmn.datatableLanguage(), {
							sEmptyTable: rs.noPriceListUploaded
						}
					),
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						rc.dt = this;
						if(!$(rc.dt).find('tfoot').length)
						$(rc.dt).append('<tfoot><tr><td class="bottomarea" colspan="9"></td></tr></tfoot>');
						$('#tbl_sdpRateCard').next(".bottom").show();
						myvmware.common.selectAllChks(rc.dt,rc.onSelectChkBox);
						rc.onSelectChkBox();
						myvmware.sdp.cmn.dataTableSuccess($(rc.dt));
						var Settings= this.fnSettings();
						if(Settings.jqXHR && Settings.jqXHR.responseText!==null && Settings.jqXHR.responseText.length && typeof Settings.jqXHR.responseText =="string"){
							rc.priceList = vmf.getObjByIdx(vmf.json.txtToObj(Settings.jqXHR.responseText),0);
						}
						var productFamilyLength = 0;
						for(key in rc.priceList.productFamilyList){
							productFamilyLength++;
						}
						myvmware.sdp.cmn.buildSelectBox("#txt_productFamily",rc.priceList.productFamilyList, rc.productFamilyDef);
						rc.productFamilyDef = '';
						if(productFamilyLength == 1) {
							$("#txt_productFamily").find('option').eq(0).remove();
							$("#txt_productFamily").attr('disabled', 'disabled');
						}
					},
					"fnPreDrawCallback": function(oSettings){
						if(flag){
							oSettings._iDisplayStart = tableStart
							flag = false;
							this.fnDraw(false);
						}
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_sdpRateCard_paginate").css("display", "block");
						} else {
							$("#tbl_sdpRateCard_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_sdpRateCard_length option:eq(0)").val(),10)){
							$("#tbl_sdpRateCard_length").css("display", "block");
						} else {
							$("#tbl_sdpRateCard_length").css("display", "none");
						}
					},
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow);
						if(($nRow.find("td:eq(0)").html() != '') && ($nRow.find("td:eq(0)").find('input').attr('checked') == true)){
							$nRow.find("td:eq(0)").html("<input type='checkbox' name='rateCard' checked='' id='"+encodeURIComponent(aData[9])+"'/>");
						}else{
							$nRow.find("td:eq(0)").html("<input type='checkbox' name='rateCard' id='"+encodeURIComponent(aData[9])+"'/>");									
						}						
						$nRow.find("td:eq(2)").html("<a href='"+rs.getRateCardDetailsUrl+"?_VM_rateCardId="+encodeURIComponent(aData[9])+"'>"+aData[2]+"</a>");
						$nRow.find("td:eq(3)").html("<a href='"+rs.getRateCardDetailsUrl+"?_VM_rateCardId="+encodeURIComponent(aData[9])+"'>"+aData[3]+"</a>");
						aData[5]=aData[5].replace(/\w+/g,function(str){
							if (str.length>15) return vmf.wordwrap(str,2);
							else return str;
						}); //Doing word wrap for words more than 15 characters
						$(nRow).find('td:eq(5)').html(aData[5]);
						if(aData[6]!=0) $nRow.find("td:eq(6)").html("<a href='"+rs.getCustomersForRateCardUrl+"?_VM_rateCardId="+encodeURIComponent(aData[9])+"&_VM_rateCardFileName="+aData[3]+"'>"+aData[6]+"</a>");
						if(aData[1].toLowerCase()=="y") $nRow.find("td:eq(1)").html('<img width="16px" title="' + rs.Default_account + '" src="/static/myvmware/common/img/dot.png">').addClass("center");
						else $nRow.find("td:eq(1)").html('');
						return nRow;
					}
			}); // End of datatable config
			callBack.addsc({'f':'rc.showPriceListBeaks','args':[]});

			$('.sorting, .sorting_asc, .sorting_desc').live('click', function(){
				if($('#tbl_sdpRateCard').dataTable()){
					var table = $('#tbl_sdpRateCard').dataTable();
					tableStart = table.fnSettings()._iDisplayStart;
					flag = true;
				}
			});
		},
		showPriceListBeaks: function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_PRICELIST_DEFAULT"],
				beakName:"SDP_BEAK_PARTNER_PRICELIST_DEFAULT",
				beakHeading:rs.head_priceDefault,
				beakContent:rs.desc_priceDefault,
				target:$('#tbl_sdpRateCard thead th:eq(1)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak10',
				isFlip:false,
				isVFlip:true,
				multiple:true,
				center:true
			});
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_PRICELIST_UPLOAD"],
				beakName:"SDP_BEAK_PARTNER_PRICELIST_UPLOAD",
				beakHeading:rs.head_upload,
				beakContent:rs.desc_upload,
				target:$('#upload'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak8',
				isFlip:false,
				multiple:true,
				center:true
			});
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_PRICELIST_DOWNLOAD"],
				beakName:"SDP_BEAK_PARTNER_PRICELIST_DOWNLOAD",
				beakHeading:rs.head_download,
				beakContent:rs.desc_download,
				target:$('.download'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak7',
				isFlip:true,
				multiple:true,
				center:true
			});
		},
		getCalendar: function() {
			var d = new Date(),curr_date,curr_month,curr_year,startDate,endDate;
			curr_date = d.getDate();
			curr_month = d.getMonth();
			curr_year = d.getFullYear();
			startDate = $("#txt_uploadedDate_from")[0];
			endDate = $("#txt_uploadedDate_to")[0];
			effectiveStartDate = $("#txt_effectiveDate_from")[0];
			effectiveEndDate = $("#txt_effectiveDate_end")[0]
			
			// Initialize the calendars
			vmf.calendar.build($(".txt_datepicker"), {
				dateFormat: 'yyyy-mm-dd',
				startDate: '1990-01-01',
				endDate: '2020-02-31',
				effectiveStartDate: '1990-01-01',
				effectiveEndDate: '2020-02-31',
				startDate_id: startDate,
				endDate_id: endDate,
				effStartDate_Id: effectiveStartDate,
				effEndDate_Id: effectiveEndDate,
				error_msg_f: rs.Enter_valid_from_date,
				error_msg_t: rs.Enter_valid_to_date
			});

			// Bind event handler to the startDate calendar
			vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setStartDate(endDate, d.addDays(0).asString());
				}
			});
			// Bind event handler to the endDate calendar
			vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setEndDate(startDate, d.addDays(0).asString());
				}
			});
			
			vmf.dom.addHandler(effectiveStartDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setStartDate(effectiveEndDate, d.addDays(0).asString());
				}
			});
			vmf.dom.addHandler(effectiveEndDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setEndDate(effectiveStartDate, d.addDays(0).asString());
				}
			});
		},
		bindEvents:function(){
			$('#apply').click(function(){//reload data on Apply Filter click
				rc.setFilterDefaults();
				rc.productFamilyDef = $('#txt_productFamily').val();
				var postData = {"noOfCustomerAssigned":$("#txt_assignee").val(),"fromDate":$("#txt_uploadedDate_from").val(),"toDate":$("#txt_uploadedDate_to").val(), "productFamily": $("#txt_productFamily").val(), "product": $("#txt_product").val(), "sku": $("#txt_sku").val(), "effectiveDate": $("#txt_effectiveDate_from").val(), "endDate": $("#txt_effectiveDate_end").val()};
				$('#tbl_sdpRateCard').next(".bottom").hide();
				vmf.datatable.reload($('#tbl_sdpRateCard'),rs.getRateCardDetailsReloadUrl,myvmware.sdp.cmn.exportFile('a.tbl_sdpRateCard', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrRateCards : filter');
				return false;
			});
			$('#reset').click(function(){
				rc.setFilterDefaults();
				rc.productFamilyDef = '';
				$(this).closest('.filter-content').find('input, select').val('');
				$('#tbl_sdpRateCard').next(".bottom").hide();
				vmf.datatable.reload($('#tbl_sdpRateCard'),rs.getRateCardDetailsReloadUrl,function(){},"POST",{"noOfCustomerAssigned":"","fromDate":"","toDate":"", "productFamily": "", "product":"", "sku":"", "effectiveDate":"", "endDate":""});
				myvmware.sdp.cmn.exportFile('a.tbl_sdpRateCard', '')
			});
			$("#del a").die('click').live('click',function(e){
				e.preventDefault();
				var selectedCards = [], selectedRows=[], requiredRows = $("#tbl_sdpRateCard").data('selectedRateCardIdArray') || [];
				/*$('#tbl_sdpRateCard tbody').find('input:checkbox:checked').each(function(){
					selectedCards.push($(this).attr('id'));
					selectedRows.push($(this).closest("tr"));
				});*/
				vmf.ajax.post(rs.deleteRateCardUrl, {"selectedRateCardIDs":requiredRows.join(',')}, rc.onSuccessDeleteCard(requiredRows),rc.onFailDeleteCard);
				filterStatus = false;
				return false;
			});
			$('#assign a').die('click').live('click', function(){
				//rcd = myvmware.sdp.rCardDetail, rateCardId=$("#tbl_sdpRateCard tbody>tr input:checkbox:checked").attr("id");
				rcd = myvmware.sdp.rCardDetail, rateCardId=($("#tbl_sdpRateCard").data('selectedRateCardIdArray') || [])[0];				
				rcd.bindEvents();
  				vmf.modal.show('edit_ratecard',{
					onShow:function(){					
					rcd.loadCustomerData(rateCardId);
					$('a.modalCloseImg').css('position','absolute').css('top','-130px');
					}
				});
			});
			$("#default a").die('click').live('click',function(e){
				e.preventDefault();
				var rateCardIdArray = ($("#tbl_sdpRateCard").data('selectedRateCardIdArray') || []);
				if(rateCardIdArray.length==1){				    
					vmf.ajax.post(rs.setDefaultRateCardUrl,{"rateCardId":rateCardIdArray[0]},rc.setDefaultCard(rateCardIdArray),rc.failSetDefaultCard)
				}
			});
			
			$('#uploadRateCard').live("click",function(){
				$("#uploadRateCardModal").find("form").hide().end().find(".loadingHolder").removeClass("hidden");
			});
			
			if(rs.uploadErr && rs.uploadErr.status.toUpperCase() == 'TRUE'){
				vmf.modal.show('uploadRateCardModal',{
					onShow:function(){
						$('#uploadRateCardModal .modalContent .uploadData').hide();
						var errorMsg = rs.uploadErr.error, content = "<div>"+rs.pleaseCheck+":</div>", file, length, button = '<br/><button type="button" class="primary" id="returnUpload">'+rs.exportBtn+'</button>';;
						if (errorMsg.indexOf("|")!=-1){
							errorMsg = (rs.uploadErr.error).split('|');
							if(rs.uploadErr.isNonSupportedCurrency  == 'true'){
								file = '<div>'+rs.nonSupportedCurrency +"</div><div>"+errorMsg[0]+'</div><br />';
							} else if(rs.uploadErr.isCurrencyError  == 'true'){							
								file = '<div>'+rs.wrongCurrencyInfo +"</div><div>"+errorMsg[0]+'</div><br />';
							} else {
								file = '<div>'+rs.wrongInfo +"</div><div>"+errorMsg[0]+'</div><br />';
							}
							errorMsg.shift();
							length = errorMsg.length;
							content += "<div class=\"errWrap\">";
							for(var i = 0; i<length; i++){
								content += "<div>" + errorMsg[i]+ '</div>';
							}
							content += "</div>";
							$('<div class="alertImg" ></div>').insertAfter('#uploadRateCardModal .modalContent .errorContent .header');
							$('#uploadRateCardModal .modalContent .errorContent .content').append(file+content+button).closest('.errorContent').show();
							if($('#uploadRateCardModal .errWrap').outerHeight() > 200){
								$('#uploadRateCardModal .errWrap').addClass("errWrapScroll");
							}
						} else {
							$('#uploadRateCardModal .modalContent .errorContent .content').append(errorMsg).closest('.errorContent').show();
						}
					}
				});
			} else if(rs.uploadErr.status.toUpperCase() == 'FALSE') {
				$('div.autoClose.success').show();
			}
			$('div.autoClose.success a.autoCloseBtn').click(function(){
				$(this).closest('div.autoClose').hide();
			});
			$('button#returnUpload').die('click').live('click', function(){
				var errExForm = '<form action="'+rs.downloadErrorReport+'" method="post" id="errExPForm"  target="_blank"><input type="hidden" name="priceListUploadErrorMsg" value="'+rs.uploadErr.error+'"></form>';
				$('#uploadRateCardModal .modalContent .errorContent .content').append(errExForm);
				$('#uploadRateCardModal .modalContent .errorContent .content #errExPForm').submit();
				vmf.modal.hide('uploadRateCardModal');
			});
			$('a.masterPriceList').die('click').live('click', function(){
				vmf.modal.show('masterPriceDownload',{
					checkPosition: true,
					onShow: function (dialog) {
						vmf.ajax.post(rs.masterPriceListURL,'',rc.masterSuccess,rc.masterFailure,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
					}
				});
			});
			$('div#masterPriceDownload div.currenyDisplay label input').die('click').live('click', function(){
				if($(this).is(':checked'))
					$('#selectCurrency').removeAttr('disabled').removeClass('disabled').attr('data-url', rc.currency[$(this).attr('id')][1]);
				else 
					$('#selectCurrency').attr('disabled', true).addClass('disabled').removeAttr('data-url');
			});
			$('#selectCurrency').die('click').live('click', function(){
				$('div#masterPriceDownload span.error').html('');
				vmf.modal.hide('masterPriceDownload');
				window.open($(this).attr('data-url'));
			});
			$('#cancelCurrency').live('click', function(){
				$('div#masterPriceDownload span.error').html('');
				vmf.modal.hide('masterPriceDownload');
			});
		},
		masterSuccess: function(sdata){
			var jsonResp = vmf.json.txtToObj(sdata); 
			rc.currency = jsonResp.wrapper.currencyMap;
			$('div#masterPriceDownload span.error').html('');
			for(key in rc.currency){
				$('div#masterPriceDownload div.currenyDisplay').append('<label class="currencySymbol"><input type="radio" name="currency" id="'+key+'" value="'+key+'" /> <span for="'+key+'">'+rc.currency[key][0]+'</span></label>');
			}
			$('div#masterPriceDownload div.currenyDisplay').append('<div class="clear"></div>');
		},
		masterFailure: function(){
			$('div#masterPriceDownload span.error').html(rs.currencyError);
		},
		getRowIndex: function(id){
			var data = $("#tbl_sdpRateCard").dataTable().fnSettings().aoData, rindex=-1;
			$.each(data,function(ind,map1){
				if(map1["_aData"][9]==id){
					rindex = ind;
					return false;
				}
			});
			return rindex;
		},
		setDefaultCard: function(selChk){
		
			return function(res){
				if (typeof res!="object") res=vmf.json.txtToObj(res);
				var curRow = rc.getRowIndex(selChk[0]);
				if(res.status && curRow !=-1){
					//selChk.closest("tr"); //current Row which needs to be updated
					var _tabObj = $("#tbl_sdpRateCard").dataTable();
					//make all other rows as non-default
					var allData = _tabObj.fnGetData();
					$.each(allData, function(i,v){
						v[1] = "N";
					})
					//Update current row as default
					_tabObj.fnUpdate("Y",curRow, 1, true);
					//Enable/Disable all the links above table
					rc.onSelectChkBox();
				} else {

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
			}
		},
		failSetDefaultCard:function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		},
		onSuccessDeleteCard: function(selRows){
			return function(data) {
				if (typeof data!="object") data=vmf.json.txtToObj(data);
				if(data.status){
					$.each(selRows,function(i,v){
						rc.dt.fnDeleteRow(rc.getRowIndex(selChk[0]));
					})
					rc.onSelectChkBox();
				} else {

					myvmware.sdp.cmn.showErrorModal(rs.genericError);
				}
			}
		},
		onFailDeleteCard: function(){
			myvmware.sdp.cmn.showErrorModal(rs.genericError);
		},
		onSelectChkBox: function(tbl){
			if(typeof tbl=="undefined") tbl=$("#tbl_sdpRateCard").parent();
			var selected = tbl.find("tbody input:checkbox:checked").length, selectedRateCardIdArray = tbl.find('table').data('selectedRateCardIdArray') || [];
			
			if(tbl.find('table').attr('id') == 'tbl_sdpRateCard' ){	
					$.each(tbl.find("tbody input:checkbox"),function(i,v){
					     var tempId = $(v).attr('id');
						if($(this).attr("checked") && $.inArray(tempId,selectedRateCardIdArray)==-1){
							selectedRateCardIdArray.push(tempId);
						} else if(!$(this).attr("checked") && $.inArray(tempId,selectedRateCardIdArray)!=-1){
							selectedRateCardIdArray.splice($.inArray(tempId,selectedRateCardIdArray),1);
						}																	
					});					
					tbl.find('table').data('selectedRateCardIdArray',selectedRateCardIdArray);					
			}
			
			if (selectedRateCardIdArray.length==0){
				$("#del").html(rs.Delete).closest('.cross').addClass('disabled');
				$("#assign").html(rs.Assign_to_Customer).closest('.assign').addClass('disabled');
				$("#default").html(rs.Set_Default).closest('.tick').addClass('disabled');
			} else if (selectedRateCardIdArray.length > 0){
				$("#del").html("<a href='#'>" + rs.Delete + "</a>").closest('.cross').removeClass('disabled');
				if(selectedRateCardIdArray.length==1){
					$("#assign").html("<a href='#'>" + rs.Assign_to_Customer + "</a>").closest('.assign').removeClass('disabled');
					if (!tbl.find("tbody input:checkbox:checked").closest("tr").find("td:eq(1) img").length) $("#default").html("<a href='#'>" + rs.Set_Default + "</a>").closest('.disabled').removeClass('disabled');
				} else {
					$("#assign").html(rs.Assign_to_Customer).closest('.assign').addClass('disabled');
					$("#default").html(rs.Set_Default).closest('.tick').addClass('disabled');
				}				
			}
			//Add the following logic
			//Enable "Assign To Customer" link only if 1 checkbox is selected. If user does not select a checkbox or selects multiple checkboxes, disable the link.
			
		},
		setFilterDefaults: function(){
			$("#del").html("Delete").closest('.cross').addClass('disabled');
			$("#assign").html("Assign to Customer").closest('.assign').addClass('disabled');
			$("#default").html("Set Default").closest('.tick').addClass('disabled');
			$('#tbl_sdpRateCard').removeData('selectedRateCardIdArray');
		}
	},
	"rCardDetail":{
		"init":function(){
			rcd=myvmware.sdp.rCardDetail;
			rcd.getCalendar();
			rcd.loadData();
			rcd.bindEvents();
			rcd.assignedCs=[];
			rcd.rateCardId="";
			rcd.dropdown = {};
			rcd.dropdownDef = '';
			myvmware.sdp.cmn.events();
			//Changes done for  omniture
			callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr: reseller : rCardDtls']});
		},
		loadData: function(){
			vmf.datatable.build($('#tbl_sdpRateCardDetails'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span class='descending'>"+rs.col1_prodFamily+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='ascending'>"+rs.col2_product+"</span>", "sWidth":"250px"},
						{"sTitle": "<span class='ascending'>"+rs.col3_partNo+"</span>", "sWidth":"120px"},
						{"sTitle": "<span class='ascending'>"+rs.col4_MSRP+"</span>", "sWidth":"90px"},
						{"sTitle": "<span class='ascending'>"+rs.col5_listPrice+"</span>", "sWidth":"80px","sType":"numeric-comma"},
						{"sTitle": "<span class='ascending'>"+rs.col8_currency+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='ascending'>"+rs.col6_effDate+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='ascending'>"+rs.col7_endDate+"</span>", "sWidth":"80px"},
						{"sTitle": "", "bVisible":false}
					], 
					"sAjaxSource": rs.getRateCardDataUrl,
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow), price = aData[4];
						$nRow.find("td:eq(4)").html("<span class='pHolder'><span class='price fLeft'>"+price+"</span></span>").end().data("id",aData[8]);
						return nRow;
					},
					"fnInitComplete": function(){
						var dt = this;
						if(!$(dt).find('tfoot').length)
						$(dt).append('<tfoot><tr><td class="bottomarea" colspan="8"></td></tr></tfoot>');
						$('#tbl_sdpRateCardDetails').next(".bottom").show();
						settings = dt.fnSettings();
						if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
							var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
							var cardDetail=jsonResp.wrapper;
							$('#rateCardName').html(cardDetail.rateCardFileName);
							$('#lastUpload').html(cardDetail.createdDate);
							$('#uploadedBy').html(cardDetail.lastUploadedBy);
							if((rs.isAdmin).toUpperCase() == 'TRUE'){
								$('#curRateCard').html("<a class='downloadLink' title='"+rs.downloadLink+"' href='"+rs.downloadRateCard+"&_VM_rateCardFileName="+escape(cardDetail.rateCardFileName)+"'>"+cardDetail.rateCardFileName+"</a>");
							} else {
								$('#curRateCard').html('<a class="disabled">'+cardDetail.rateCardFileName+'</a>');
							}
							$('#priceListId').html(cardDetail.rateCardDisplayId);
							$('#defaultPriceList').html(cardDetail.isDefault)
							rcd.rateCardId=cardDetail.rateCardId;
							var assignSize=cardDetail.customersAssigned;
							$("#assignTo").html("<span id='customer'>"+((assignSize != 0) ? "<a href='"+rs.getCustomersForRateCardUrl+"&_VM_rateCardFileName="+escape(cardDetail.rateCardFileName)+"' class='hLink'>"+assignSize+"</a>" : assignSize)+"</span>");
							if((rs.isAdmin).toUpperCase() == 'TRUE') {
								$("#assignTo").append("<button id='editAssignTo' class='edit' title='"+rs.priceListAssigneeToolTipMsg+"'>EDIT</button>");
							}
						}
						var productFamilyLength = 0;
						for(key in rcd.dropdown){
							productFamilyLength++;
						}
						myvmware.sdp.cmn.buildSelectBox("#txt_productFamily",rcd.dropdown, rcd.dropdownDef);
						rcd.dropdownDef = '';
						if(productFamilyLength == 1) {
							$("#txt_productFamily").find('option').eq(0).remove();
							$("#txt_productFamily").attr('disabled', 'disabled');
						}
						rcd.editTableData(this, "span.price");
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_sdpRateCardDetails_paginate").css("display", "block");
						} else {
							$("#tbl_sdpRateCardDetails_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_sdpRateCardDetails_length option:eq(0)").val(),10)){
							$("#tbl_sdpRateCardDetails_length").css("display", "block");
						} else {
							$("#tbl_sdpRateCardDetails_length").css("display", "none");
						}
						$(this).find("td").removeClass("disabled"); //This is to enable editing after sorting
						
						var priceListDetail= this.fnSettings();
						if(priceListDetail.jqXHR && priceListDetail.jqXHR.responseText!==null && priceListDetail.jqXHR.responseText.length && typeof priceListDetail.jqXHR.responseText =="string"){
							priceListDetail = vmf.getObjByIdx(vmf.json.txtToObj(priceListDetail.jqXHR.responseText),0);
							$.each(priceListDetail.aaData,function(i,v){
								if(v[0] != null) rcd.dropdown[v[0]]=v[0];
							});
						}
						
					}
			}); // End of datatable config
		},
		editTableData: function(table, ele){
			$(ele, $(table)).live("click", function(e){
				e.stopPropagation();
				var targetEle=$(this), val=targetEle.text(), input=$("<input type='text' class='editText' value='"+myvmware.sdp.cmn.removeComa($.trim(val))+"' >");
				if(targetEle.siblings(':text').length || targetEle.closest("td").hasClass("disabled")) return;
				$(table).find("p.error,span.success").remove(); //Need to add this code
				targetEle.closest("td").attr("data-val",val).end().hide().parent().append('<span class="editInput"></span>').find('span.editInput').append(input);
				input.focus();
			});
			
			$("input.editText", $(table)).live("focusout keypress keyup",function(e){
				var tgt = $(this);
				if (e.type == "focusout") {
					if(tgt.hasClass("error")) return;
					tgt.closest('span').siblings(ele).show().end().remove();
					$(table).find("p.errorMsg").remove();
				} else if (e.type == "keyup"){
					var inputVal = tgt.val();
					if (isNaN(inputVal)){
						$("#tbl_sdpRateCardDetails td:nth-child(5)").addClass("disabled");
						tgt.removeClass("disabled");
						if(!tgt.hasClass("error"))
							tgt.addClass("error").closest("span.pHolder").find('span.editInput').append("<p class='error'>"+rs.listPriceError+"</p>").end().focus();
					}
					else{
						tgt.removeClass("error").closest("span.pHolder").find('span.editInput').find("p.error").remove();
						$("#tbl_sdpRateCardDetails td:nth-child(5)").removeClass("disabled");
					}
				} else {
					if (e.which == 13) {
						if(tgt.hasClass("error") || !$.trim(tgt.val()).length) return;
						if ($.trim(tgt.val())==myvmware.sdp.cmn.removeComa(tgt.closest("td").attr("data-val"))){
							tgt.closest(".editInput").siblings(ele).show().end().remove();return;
						}
						vmf.ajax.post(rs.editRateCardUrl,{"_VM_pricingID": tgt.closest("tr").data("id"), "_VM_listPrice":tgt.val(),"_VM_rateCardId":rcd.rateCardId},
						function(res){
							if (typeof res!="object") res=vmf.json.txtToObj(res);
							if (res==null || typeof res.error_MESSAGE!="undefined"){
								if(!tgt.hasClass("errorMsg"))
									tgt.addClass("errorMsg").closest("span.pHolder").find('span.editInput').append("<p class='errorMsg'>"+res.error_MESSAGE || rs.Error +"</p>").end().focus();
							} else if(res.status){
								var curRow = tgt.closest("tr"), entry= (res.status) ? myvmware.sdp.cmn.addComa(tgt.val()) : tgt.closest("td").attr("data-val");
								table.fnUpdate(entry,curRow[0], 4, false);
								curRow.find("td:eq(4)").html('<span class="pHolder"><span class="price fLeft">'+entry+'</span></span>');
									curRow.find("span.price").append("<span class='success'>&nbsp;</span>");
							} else {
									if(!tgt.hasClass("errorMsg")) tgt.addClass("errorMsg").closest("span.pHolder").find('span.editInput').append("<p class='errorMsg'>" + rs.Error + "</p>").end().focus();
							}
						},
						function(){
							if(!tgt.hasClass("errorMsg")) tgt.addClass("errorMsg").closest("span.pHolder").find('span.editInput').append("<p class='errorMsg'>"+ rs.Error +"</p>").end().focus();
						});
						//Changes done for  omniture
						if (typeof riaLinkmy!="undefined") riaLinkmy('sdpprtnr : reseller : rCardDtls : edit-price : save');
					}
				}
			});
			
			$(document).keyup(function(e) {
				if (e.keyCode == 27) {  // esc
					if ($("input.editText").length>0){
						$("input.editText").closest(".editInput").siblings("span.price").show().end().remove();
					}
				}
			});
			
			$("#tbl_sdpRateCardDetails td span.pHolder").live("mouseover mouseout mousedown",function(e){
				if(e.type=="mouseover") {
					if(!$(this).find("input").length && !$(this).closest("td").hasClass("disabled")) $(this).addClass("hover");
					else $(this).removeClass("hover");
				}
				else $(this).removeClass("hover");
			});
		},
		getObjectSize: function(obj){
			var size = 0, key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		},
		getCalendar: function() {
			var d = new Date(),curr_date,curr_month,curr_year,startDate,endDate;
			curr_date = d.getDate();
			curr_month = d.getMonth();
			curr_year = d.getFullYear();
			startDate = $("#txt_effectiveDate_From")[0];
			endDate = $("#txt_endDate_End")[0];
			// Initialize the calendars
			vmf.calendar.build($(".txt_datepicker"), {
				dateFormat: 'yyyy-mm-dd',
				startDate: '1990-01-01',
				endDate: '2020-02-31',
				startDate_id: startDate,
				endDate_id: endDate,
				error_msg_f: rs.Enter_valid_from_date,
				error_msg_t: rs.Enter_valid_to_date
			});

			// Bind event handler to the startDate calendar
			vmf.dom.addHandler(startDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setStartDate(endDate, d.addDays(0).asString());
				}
			});
			// Bind event handler to the endDate calendar
			vmf.dom.addHandler(endDate, "dpClosed", function(e, selectedDate){
				var d = selectedDate[0];
				if(d){
					d = new Date(d);
					vmf.calendar.setEndDate(startDate, d.addDays(0).asString());
				}
			});
		},
		bindEvents:function(){
		$('button#apply').click(function(){
			rcd.dropdownDef = $.trim($("#txt_productFamily").val());
			var postData = {"productFamily":$.trim($("#txt_productFamily").val()),"product":$.trim($("#txt_product").val()),"sku":$("#txt_sku").val(), "effectiveDate": $('#txt_effectiveDate_From').val(), "endDate": $('#txt_endDate_End').val()};
			$('#tbl_sdpRateCardDetails').next(".bottom").hide();
			vmf.datatable.reload($('#tbl_sdpRateCardDetails'),rs.getRateCardDataUrl,'',"POST",postData);
			return false;
		});
		$('button#reset').click(function(){
			rcd.dropdownDef = '';
			$("#txt_productFamily").val('');
			$("#txt_product").val('');
			$("#txt_sku").val('');
			$('#txt_effectiveDate_From').val('');
			$('#txt_endDate_End').val('');
			var postData = {"productFamily":"","product":"","sku":"", "effectiveDate":"", "endDate":""};
			$('#tbl_sdpRateCardDetails').next(".bottom").hide();
			vmf.datatable.reload($('#tbl_sdpRateCardDetails'),rs.getRateCardDataUrl,'',"POST",postData);
			return false;
		});
		
			$("#uploadRC").bind("click",function(e){
				e.preventDefault();
				vmf.modal.show("uploadRateCardModal")
			});
			$("#editAssignTo").live("click",function(e){
				e.preventDefault();
				$('#edit_ratecard').addClass('modal_center');													 
  				vmf.modal.show('edit_ratecard',{
					onShow:function(){
					rcd.loadCustomerData(rcd.rateCardId);
					$('a.modalCloseImg').css('position','absolute').css('top','-130px');
					
					}
				});
			});
			$("#assignCustomer").die('click').live("click",function(e){
				$("#edit_ratecard span.error").html("");
					var customerList=[], tabObj = $("#tbl_customerList").dataTable(), allData = tabObj.fnGetData(), rId;
				$.each(allData, function(i,v){
					if (v[0].toLowerCase() == "y") customerList.push(v[1]);
				})
				rId = ($("#tbl_sdpRateCard").length) ? $("#tbl_sdpRateCard").data("selectedRateCardIdArray")[0] : rcd.rateCardId;
				vmf.ajax.post(rs.assignRateCardUrl,{"_VM_selectedEaNumbers":customerList.join(","),"_VM_rateCardId":rId},rcd.onSuccessAssign(customerList),rcd.onFailureAssign,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
			});
			$("#closeCustomer").live("click",function(){vmf.modal.hide()});
		},
		updateCusList: function(table, jsonWrap){
			var	tabObj = table.dataTable(), list = jsonWrap.customerListMap;
			allData = tabObj.fnGetData();
			$.each(allData, function(i,v){
				if (list[v[1]]!=undefined) v[0] = "Y";
				else v[0] = "N";
			})
			tabObj.fnDraw();
		},
		loadCustomerData: function(rCardId){
			vmf.datatable.build($('#tbl_customerList'),{
					"bProcessing": true,
					"bAutoWidth": false,
					"bPaginate": false,
					"bSort" : false,
					"aoColumns": [
						{"sTitle": "<span><input type='checkbox' id='tbl_selectAll' class='tbl_selectAll' name='group_all'/></span>", "sWidth":"50px","bSortable": false},
						{"sTitle": "<span class='descending'>"+rs.account+"</span>", "sWidth":"120px"},
						{"sTitle": "<span class='descending'>"+rs.customerName+"</span>", "sWidth":"auto"},
						{"sTitle": "<span class='descending'>"+rs.priceList+"</span>", "sWidth":"auto"}
					], 
					"sAjaxSource": rs.getCustomerData+"&_VM_rateCardId="+rCardId,
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"sScrollY": "316px",
					"sScrollX": "auto",
					"aaSorting": [[1, 'asc']],
					"fnRowCallback": function(nRow,aData,iDisplayIndex){
						var $nRow=$(nRow),assigned;
						assigned=(aData[0].toLowerCase() == "y")?" checked=checked " :"";
						$nRow.find("td:eq(0)").html("<input type='checkbox' name='rateCard' id='"+aData[1]+"' value='"+aData[2]+"'  "+assigned+"/>");
						return nRow;
					},
					"fnInitComplete": function(){
						var dtd = this;
						myvmware.common.selectAllChks(this,rcd.onSelectChkBox);
						$(this).closest(".dataTables_scroll").addClass("bottomarea");
						var assigned, jsonResp, jsonWrap, settings= this.fnSettings();
						if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
							jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText);
							jsonWrap = jsonResp.wrapper;
							rcd.updateCusList($(this), jsonWrap);
						}
						if ($("#tbl_customerList tbody tr input:checkbox").length==$("#tbl_customerList tbody tr input:checkbox:checked").length) $(".tbl_selectAll").attr("checked",true);
						var rowHeight, rowsLength = $(dtd).find("tbody tr").length;
						if(rowsLength<10){
							rowHeight = $($(dtd).find("tbody tr")[0]).outerHeight(true);
							$(dtd).closest(".dataTables_scrollBody").css("height",rowsLength*rowHeight + "px");
						} else {
							$(dtd).closest(".dataTables_scrollBody").css("height","316px");
						}
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_customerList_paginate").css("display", "block");
						} else {
							$("#tbl_customerList_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_customerList_length option:eq(0)").val(),10)){
							$("#tbl_customerList_length").css("display", "block");
						} else {
							$("#tbl_customerList_length").css("display", "none");
						}
						rcd.onSelectChkBox();
					}
			});
			
		},
		onSelectChkBox: function(){
			var tblRef = $("#tbl_customerList").dataTable();
			$.each($("#tbl_customerList tbody tr input:checkbox"),function(i,v){
				var trRef=$(this).closest("tr");
				if ($(this).is(":checked")) {
					tblRef.fnUpdate("Y",trRef[0], 0, false);
					trRef.addClass("active").find("td:eq(0)").html("<input type='checkbox' name='rateCard' checked='checked' />");
					
				} else {
					tblRef.fnUpdate("N",trRef[0], 0, false);
					trRef.removeClass("active").find("td:eq(0)").html("<input type='checkbox' name='rateCard'/>");
				}
			});
			($("#tbl_customerList tbody tr td input:checkbox").is(':checked')) ? $("#assignCustomer").removeClass('disabled').removeAttr('disabled') : $("#assignCustomer").addClass('disabled').attr('disabled', 'disabled');
			
		},
		onSuccessAssign:function(customerIds){
			return function(data) {
				if(typeof data!="object") data=vmf.json.txtToObj(data);
				if(data.status){
					if (!$('#tbl_sdpRateCard').length)
						$("#customer").html((customerIds.length != 0) ? "<a href='"+rs.getCustomersForRateCardUrl+"' class='hLink'>"+customerIds.length+"</a>" : customerIds.length);
					else
						vmf.datatable.reload($('#tbl_sdpRateCard'),rs.getRateCardDetailsReloadUrl,function(){},"POST",{"noOfCustomerAssigned":$("#txt_assignee").val(),"fromDate":$("#txt_uploadedDate_from").val(),"toDate":$("#txt_uploadedDate_to").val(), "productFamily": $("#txt_productFamily").val(), "product": $("#txt_product").val(), "sku": $("#txt_sku").val(), "effectiveDate": $("#txt_effectiveDate_from").val(), "endDate": $("#txt_effectiveDate_end").val()});
					vmf.modal.hide();
				}
				else $("#edit_ratecard span.error").html(rs.genericError);
			}
		},
		onFailureAssign:function(){
			$("#edit_ratecard span.error").html(rs.genericError);
		}
	},
	"orders" :{	
		init: function(){
			sdp = myvmware.sdp;
			order = myvmware.sdp.orders;
			order.pendingJson=null;
			order.orderJson=null;
			order.rejectJson=null;
			order.orderTypeDef="";
			order.serviceType={};
			order.serviceTypeDef="";
			order.orderType={};
			order.status={};
			order.statusDef="";
			order.map = {
				"tab0" : {"url":"","tab_cnt":"tab_container_1","hasData":0,"func":order.loadTab1Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab},
				"tab1" : {"url":"","tab_cnt":"tab_container_2","hasData":0,"func":order.loadTab2Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab},
				"tab2" : {"url":"","tab_cnt":"tab_container_1","hasData":0,"func":order.loadTab3Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab},
				"tab3" : {"url":"","tab_cnt":"tab_container_2","hasData":0,"func":order.loadTab4Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab},
				"tab4" : {"url":"","tab_cnt":"tab_container_3","hasData":0,"func":order.loadTab5Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab},
				"tab5" : {"url":"","tab_cnt":"tab_container_3","hasData":0,"func":order.loadTab6Data,"sfunc":order.onSucess,"ffunc":order.onFailure,"nodata":order.emptyTab}
			}
			if(partnerType == 'RESELLER') {
				myvmware.common.showMessageComponent('PARTNER_ORDERS');
				order.loadTab3Data(order.map['tab2']);
			//Changes done for  omniture				
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller :sdpPrtnrOrders ']});	
			}
			else {
				myvmware.common.showMessageComponent('PARTNER_ORDERS');
				order.loadTab1Data(order.map['tab0']);
			//Changes done for  omniture				
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti: sdpPrtnrOrders ']});	
			}
			order.bindEvents();
			myvmware.sdp.cmn.events();
		},
		onSelectChkBox: function(tbl){
			var selected = tbl.find("tbody input:checkbox:checked").length;
			var approveElement = $("#approve");
			var rejectElement = $("#reject");
			var selectedPendingArray = [], rowListArray = [];
			if (selected != 0 && (rs.isAdmin == 'true' || rs.isPricingUser == 'true') && !(tbl.has('td.dataTables_empty').length > 0)){								
				$("#approve").html("<a href='#'>" + rs.Approve + "</a>");
				$("#reject").html("<a href='#'>" + rs.Decline + "</a>");
				$("#approve").html("<a href='#'>"+rs.approve+"</a>");
				$("#reject").html("<a href='#'>"+rs.reject+"</a>");
				approveElement.html("<a href='#'>"+rs.approve+"</a>").closest('li').removeClass('disabled');
				rejectElement.html("<a href='#'>"+rs.reject+"</a>").closest('li').removeClass('disabled');
				if(tbl.find('table').attr('id') == 'tbl_pendingReq' || tbl.find('table').attr('id') == 'tbl_pending' ){	
					$.each(tbl.find("tbody input:checkbox:checked"),function(i,v){
						selectedPendingArray.push($(v).closest('tr').data('id'));
						rowListArray.push($(v).closest('tr'));						
					});
					tbl.find('table').data('selectedPendingArray',selectedPendingArray);
					tbl.find('table').data('rowListArray',rowListArray);
				}
				
			} else {
				$("#approve").html(rs.Approve);
				$("#reject").html(rs.Decline);
				$("#approve").html(rs.approve);
				$("#reject").html(rs.reject);
				approveElement.html(rs.approve).closest('li').addClass('disabled');
				rejectElement.html(rs.reject).closest('li').addClass('disabled');
				
			}
		},
		setFilterDefaults:function(){				
				$('#approve').html(rs.approve).closest('li').addClass('disabled');
				$('#reject').html(rs.reject).closest('li').addClass('disabled');
		},
		loadTab1Data : function(m){
			var d = {"aaData":[["","","3421","1004253","CDW","$34770","105%","3242353","Woodforest National Elank","12/23/2012","10 mon","2342","23423"],["","","3443","1007253","NetAPP","$36770","103%","3246353","In and Out","11/12/2012","4 mon","3453","35345"],["","","3424","1007253","NetAPP","$36770","103%","3246353","In and Out","11/12/2012","4 mon","325235","23532"]],"subaaData":{
					"3421" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3443" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3424" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				}}
			vmf.datatable.build($('#tbl_pendingReq'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.reseller+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.reseller_limit+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.used_limit+"</span>", "bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.cAccount+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"90px"},
					{"sTitle": "<span class='descending'>"+rs.req_recieved+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"60px"},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"70px","bSortable": false}
				],
				"sAjaxSource": rs.url.allPendingRequestForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aaSorting": [[2, 'desc']],
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
					var $nRow = $(nRow);					
					if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' checked=''  style='margin-right:5px'>").end().data("id",aData[2]);
					}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' style='margin-right:5px'>").end().data("id",aData[2]);
					}
					$(nRow).find("td:eq(3)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[15])+"'>"+aData[3]+"</a>");
					$(nRow).find("td:eq(4)").html("<a href='"+rs.url.resellerNameUrl+"?_VM_selectedAccountNumber="+escape(aData[11])+"'>"+aData[4]+"</a>");
					$(nRow).find("td:eq(7)").html("<a href='"+rs.url.customerNameUrl+"&_VM_selectedAccountNumber="+escape(aData[11])+"&_VM_selectedEaNumber="+escape(aData[12])+"'>"+aData[8]+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					$(nRow).find('td:eq(9)').addClass('alertColor'+aData[14]);
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="11"></td></tr></tfoot>');
					$('#tbl_pendingReq').next(".bottom").show();
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.pendingJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					} else {
					  if(typeof d == "object") order.pendingJson=d; // Need to remove this after testing
					}
					$('#tbl_pendingReq').find('span.openclose').die('click').live("click",function (){
						order.expandRow1($(this),dtd);
					});
					myvmware.common.selectAllChks(this,myvmware.sdp.orders.onSelectChkBox);
					$("#totalPending").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					$("#totalPending").html(" (" + Math.ceil(this.fnSettings().fnRecordsDisplay()) + ")");  //changed 05-12-2013 to get the updated number of records on fnDelete...
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_pendingReq_paginate").css("display", "block");
					} else {
						$("#tbl_pendingReq_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pendingReq_length option:eq(0)").val(),10)){
						$("#tbl_pendingReq_length").css("display", "block");
					} else {
						$("#tbl_pendingReq_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.cmn.getCalendar("txt_reqDate_from","txt_reqDate_to");
			callBack.addsc({'f':'order.showOrderBeaksForDisti','args':[]});
		},
		showOrderBeaksForDisti: function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_TAB"],
				beakName:"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_TAB",
				beakHeading:rs.head_tab,
				beakContent:rs.desc_tab,
				target:$(".tabContent ul li:first"),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#row1',
				isFlip:false,
				multiple:true
			});
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_MONTHLY"],
				beakName:"SDP_BEAK_PARTNER_DISTI_ORDER_PENDING_MONTHLY",
				beakHeading:rs.head_monthlyPrice,
				beakContent:rs.desc_monthlyPrice,
				target:$('#tbl_pendingReq thead th:eq(10)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#row1',
				isFlip:true,
				multiple:true
			});
		},
		loadTab2Data : function(m){
			var oJson = {"aaData":[["","3421","1004253","Provisioning","Add On","CDW","Woodforest National Elank","vCloud Infrastructure Service","8","12/23/2012","10 mon","35325","434634"],["","3443","1004253","Provisioning","Initial","CDW","Woodforest National Elank","vCloud Infrastructure Service","8","12/23/2012","10 mon","35325","434634"],["","3424","1004253","Provisioning","Add On","CDW","Woodforest National Elank","vCloud Infrastructure Service","8","12/23/2012","10 mon","35325","434634"]],"subaaData":{
					"3421" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3443" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3424" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				}}
			vmf.datatable.build($('#tbl_orders'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.order_id+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"55px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>", "sWidth":"75px"},
					{"sTitle": "<span class='descending'>"+rs.orderStatus+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.order_type+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.reseller+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.accountNumber+"</span>", "sWidth":"60px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.sType+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.siCount+"</span>", "sWidth":"42px"},
					{"sTitle": "<span class='descending'>"+rs.order_receive+"</span>", "sWidth":"60px"},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"50px", "bVisible":(partnerType != 'RESELLER') ? true : false, "bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"62px"},
					{"sTitle": "", "bVisible":false}
				],
				"sAjaxSource": rs.url.allProcessedOrderedForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bDestroy": true,
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var alertIconClass = 'alertIcon'+aData[3],
						alertColorClass = 'alertColor'+aData[3];
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]+":"+aData[2]);
					$(nRow).find('td:eq(13)').addClass('alertColor'+aData[3]);
					$(nRow).find("td:eq(2)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[16])+"'>"+aData[2]+"</a>");
					$(nRow).find("td:eq(3)").addClass(alertColorClass).html("<span class='"+alertIconClass+" alertTxtSpace' title='"+eval("rs.alert_"+aData[3])+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[15]+"</label>");
					$(nRow).find("td:eq(6)").html("<a href='"+rs.url.resellerNameUrl+"?_VM_selectedAccountNumber="+escape(aData[14])+"'>"+vmf.wordwrap(aData[6],2)+"</a>");
					$(nRow).find("td:eq(8)").html("<a href='"+rs.url.customerNameUrl+"&_VM_selectedAccountNumber="+escape(aData[14])+"&_VM_selectedEaNumber="+escape(aData[7])+"'>"+vmf.wordwrap(aData[8],2)+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					
					
					//$(nRow).find("td:eq(5)").html(vmf.wordwrap($(nRow).find("td:eq(5)").html(),2));
					//$(nRow).find("td:eq(9)").html(vmf.wordwrap($(nRow).find("td:eq(9)").html(),2));
					
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this, colspan = (partnerType != 'RESELLER') ? 14 : 13;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="'+colspan+'"></td></tr></tfoot>');
					$('#tbl_orders').next(".bottom").show();
					
					$('#tbl_orders').find('span.openclose').die('click').live("click",function (){
						order.expandRow2($(this),dtd);
					});
					myvmware.common.selectAllChks(this,order.onSelectChkBox);
					myvmware.sdp.cmn.buildSelectBox("#sel_serviceType",order.serviceType,order.serviceTypeDef);
					myvmware.sdp.cmn.buildSelectBox("#sel_orderType",order.orderType,order.orderTypeDef);
					myvmware.sdp.cmn.buildSelectBox("#sel_status",order.status,order.statusDef);
					order.serviceTypeDef="";
					order.orderTypeDef="";
					order.statusDef="";
					$("#totalOrders").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_orders_paginate").css("display", "block");
					} else {
						$("#tbl_orders_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_orders_length option:eq(0)").val(),10)){
						$("#tbl_orders_length").css("display", "block");
					} else {
						$("#tbl_orders_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.orderJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
						$.each(order.orderJson.aaData,function(i,v){
							order.serviceType[v[9]]=v[9];
							(v[5] != '' && v[5] != null && v[5] != undefined) ? order.orderType[v[5]]=v[5] : '';
							order.status[v[4]]=v[4];
						});
					} else {
					  if(typeof oJson == "object") order.orderJson=oJson; // Need to remove this after testing
					}
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.rCard.getCalendar();
			//Changes done for  omniture
			if (typeof riaLinkmy!="undefined") riaLinkmy('sdpprtnr : disti :sdpPrtnrOrders : allOrders');
		},
		loadTab3Data : function(m){
			var d = {"aaData":[["","","3421","345345","1004253","Woodforest","Amy","8","12/23/2012","$345.00","Rate Card 1","10 mon","24244","346346","3235346"],["","","3443","1007253","1004253","Woodfo rest","Aeemy","7","12/23/2012","$45.00","Rate Card 1","10 mon","24244","346346","3235346"],["","","3424","1007253","1004253","Wood forest","Amfry","8","12/23/2012","$35.00","Rate Card 1","10 mon","24744","34846","3237346"]],"subaaData":{
					"3421" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3443" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3424" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				}}
			vmf.datatable.build($('#tbl_pendingReq'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"65px"},
					{"sTitle": "<span class='descending'>"+rs.compName+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.reqBy+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.siCount+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.req_recieved+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.monthCost+"</span>", "bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.rateCard+"</span>", "sWidth":"90px"},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"60px"},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"70px","bSortable":false}
				],
				"sAjaxSource": rs.url.allPendingRequestForReseller,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aaSorting": [[2, 'desc']],
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
					var $nRow = $(nRow);					
					if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' checked='' style='margin-right:5px'>").end().data("id",aData[2]);
					}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' style='margin-right:5px'>").end().data("id",aData[2]);
					}
					$(nRow).find("td:eq(3)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[18])+"'>"+aData[3]+"</a>");
					$(nRow).find("td:eq(5)").html("<a href='"+rs.url.compNameUrl+"?_VM_selectedAccountNumber="+escape(aData[12])+"'>"+aData[5]+"</a>");
					$(nRow).find('td:eq(10)').addClass('alertColor'+aData[17]);
					if($.trim(aData[10]).length) {
						aData[10]=aData[10].replace(/\w+/g,function(str){
							if (str.length>15) return vmf.wordwrap(str,2);
							else return str;
						}); //Doing word wrap for words more than 15 characters
						$(nRow).find("td:eq(9)").html("<a href='"+rs.url.rateCardUrl+"?_VM_rateCardId="+escape(aData[14])+"'>"+aData[10]+"</a>");
					} else {
						$(nRow).find("td:eq(9)").html(rs.notAvailable);
					}
					$(nRow)[0].idx = iDisplayIndex;
					if($.trim(aData[6]).length){
						if($.trim(aData[16]).length){
							$(nRow).find('td:eq(6)').html('<a title="'+aData[16]+'" href="mailto:'+aData[16]+'">'+aData[6]+'</a>');
						} else {
							$(nRow).find('td:eq(6)').html(aData[6]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="12"></td></tr></tfoot>');
					$('#tbl_pendingReq').next(".bottom").show();
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.pendingJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					} else {
					  if(typeof d == "object") order.pendingJson=d; // Need to remove this after testing
					}
					$('#tbl_pendingReq').find('span.openclose').die('click').live("click",function (){
						order.expandRow1($(this),dtd);
					});
					myvmware.common.selectAllChks(this,order.onSelectChkBox);
					$("#totalPending").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					$("#totalPending").html(" (" + Math.ceil(this.fnSettings().fnRecordsDisplay()) + ")");
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_pendingReq_paginate").css("display", "block");
					} else {
						$("#tbl_pendingReq_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pendingReq_length option:eq(0)").val(),10)){
						$("#tbl_pendingReq_length").css("display", "block");
					} else {
						$("#tbl_pendingReq_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.cmn.getCalendar("txt_uploadedDate_from","txt_uploadedDate_to");
			callBack.addsc({'f':'order.showOrderBeaks','args':[]});
		},
		showOrderBeaks:function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLR_ORDER_PENDING_TAB"],
				beakName:"SDP_BEAK_PARTNER_RESELLR_ORDER_PENDING_TAB",
				beakHeading:rs.head_tab,
				beakContent:rs.desc_tab,
				target:$(".tabContent ul li:first"),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak3',
				isFlip:false,
				multiple:true
			});
			/*myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLER_ORDER_PENDING_MONTHLY"],
				beakName:"SDP_BEAK_PARTNER_RESELLER_ORDER_PENDING_MONTHLY",
				beakHeading:rs.head_monthlyPrice,
				beakContent:rs.desc_monthlyPrice,
				target:$('#tbl_pendingReq thead th:eq(9)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak4',
				isFlip:false,
				multiple:true
			});*/
		},
		loadTab4Data : function(m){
			var oJson = {"aaData":[["","3421","1004253","Provi","Initial","456456","Wood forest National Elank","Amy","vCloud Infrastructure Service","8","12/23/2012","$435","10 mon","34234","3535"],["","3443","1004253","Provis","Initial","456456","Wood forest National Elank","Amy","vCloud Infrastructure Service","8","12/23/2012","$435","10 mon","346346","46463"],["","3424","1004253","Provis","Initial","456456","Wood Elank","Amy","vCloud Infrastructure Service","8","12/23/2012","$1435","11mon","235235","568568"]],"subaaData":{
					"3421" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3443" : [["532035","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532036","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532037","Compute 2.8 GHZ","4","$60/Mon","5 mon"]],
					"3424" : [["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"],
							  ["532034","Compute 2.8 GHZ","4","$60/Mon","5 mon"]]
				}}
			vmf.datatable.build($('#tbl_orders'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"10px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.order_id+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>", "sWidth":"75px"},
					{"sTitle": "<span class='descending'>"+rs.orderStatus+"</span>", "sWidth":"30px"},
					{"sTitle": "<span class='descending'>"+rs.order_type+"</span>", "sWidth":"45px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.cName+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.reqBy+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.sType+"</span>", "sWidth":"45px"},
					{"sTitle": "<span class='descending'>"+rs.siCount+"</span>", "sWidth":"40px"},
					{"sTitle": "<span class='descending'>"+rs.order_receive+"</span>", "sWidth":"50px"},
					{"sTitle": "<span class='descending'>"+rs.monthCost+"</span>", "bVisible":false},
					{"sTitle": "<span class='descending'>"+rs.pr_remaining+"</span>", "sWidth":"52px"},
					{"sTitle": "", "bVisible":false},
					{"sTitle": "", "bVisible":false}
				],
				"sAjaxSource": rs.url.allProcessedOrderedForReseller,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var alertIconClass = 'alertIcon'+aData[3],
						alertColorClass = 'alertColor'+aData[3];
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]+":"+aData[2]);
					$(nRow).find('td:eq(12)').addClass('alertColor'+aData[3]);
					$(nRow).find("td:eq(2)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[17])+"'>"+aData[2]+"</a>");
					$(nRow).find("td:eq(3)").addClass(alertColorClass).html("<span class='"+alertIconClass+" alertTxtSpace' title='"+eval("rs.alert_"+aData[3])+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[16]+"</label>");
					$(nRow).find("td:eq(7)").html("<a href='"+rs.url.customerNameUrl+"?_VM_selectedAccountNumber="+aData[6]+"'>"+aData[7]+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					if($.trim(aData[8]).length){
						if($.trim(aData[15]).length){
							$(nRow).find("td:eq(8)").html("<a target='_blank' title='"+aData[15]+"' href='mailto:"+aData[15]+"'>"+aData[8]+"</a>");
						} else {
							$(nRow).find("td:eq(8)").html(aData[8]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="13"></td></tr></tfoot>');
					$('#tbl_orders').next(".bottom").show();
					
					$('#tbl_orders').find('span.openclose').die('click').live("click",function (){
						order.expandRow2($(this),dtd);
					});
					myvmware.common.selectAllChks(this,order.onSelectChkBox);
					myvmware.sdp.cmn.buildSelectBox("#sel_serviceType",order.serviceType,order.serviceTypeDef);
					myvmware.sdp.cmn.buildSelectBox("#sel_orderType",order.orderType,order.orderTypeDef);
					order.serviceTypeDef="";
					order.orderTypeDef="";
					$("#totalOrders").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_orders_paginate").css("display", "block");
					} else {
						$("#tbl_orders_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_orders_length option:eq(0)").val(),10)){
						$("#tbl_orders_length").css("display", "block");
					} else {
						$("#tbl_orders_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.orderJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
						$.each(order.orderJson.aaData,function(i,v){
							order.serviceType[v[9]] = v[9];
							(v[5] != '' && v[5] != null && v[5] != undefined) ? order.orderType[v[5]] = v[5] : '';
						});
					} else {
					  if(typeof oJson == "object") order.orderJson=oJson; // Need to remove this after testing
					}
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.cmn.getCalendar("txt_orderDate_from","txt_orderDate_to");
			//Changes done for  omniture
			if (typeof riaLinkmy!="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrOrders : procOrdr');
		},
		loadTab5Data : function(m){
			vmf.datatable.build($('#tbl_rejectedReq'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"125px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"125px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"125px"},
					{"sTitle": "<span class='descending'>"+rs.compName+"</span>", "sWidth":"160px"},
					{"sTitle": "<span class='descending'>"+rs.rejectedBy+"</span>", "sWidth":"130px"},
					{"sTitle": "<span class='descending'>"+rs.dateRejected+"</span>", "sWidth":"120px"},
					{"sTitle": "<span class='descending'>"+rs.comment+"</span>", "sWidth":"auto"},
					{"sTitle": "", "bVisible":false}
				],
				"sAjaxSource": rs.url.allRejectedRequestForReseller,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aaSorting": [[1, 'desc']],
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"bDestroy": true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]);
					$(nRow).find("td:eq(2)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[9])+"'>"+aData[2]+"</a>");
					if($.trim(aData[5]).length && $.trim(aData[8]).length){
						$(nRow).find('td:eq(5)').html('<a title="'+aData[8]+'" href="mailto:'+aData[8]+'">'+aData[5]+'</a>');
					}
					$(nRow).find("td:eq(4)").html("<a href='"+rs.url.customerNameUrl+"?_VM_selectedAccountNumber="+aData[3]+"'>"+aData[4]+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="12"></td></tr></tfoot>');
					$('#tbl_rejectedReq').next(".bottom").show();
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.rejectJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					}
					$('#tbl_rejectedReq').find('span.openclose').die('click').live("click",function (){
						order.expandRow3($(this),dtd);
					});
					myvmware.common.selectAllChks(this,order.onSelectChkBox);
					$("#rejected").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_rejectedReq_paginate").css("display", "block");
					} else {
						$("#tbl_rejectedReq_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_rejectedReq_length option:eq(0)").val(),10)){
						$("#tbl_rejectedReq_length").css("display", "block");
					} else {
						$("#tbl_rejectedReq_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.cmn.getCalendar("txt_rejected_from","txt_rejected_to");
			//Changes done for  omniture 
			if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller :sdpPrtnrOrders  : rejected-orders');
		},
		loadTab6Data : function(m){
			vmf.datatable.build($('#tbl_rejectedReq'),{
				"bAutoWidth": false,
				"bFilter": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.req_id+"</span>", "sWidth":"70px"},
					{"sTitle": "<span class='descending'>"+rs.serviceId+"</span>", "sWidth":"75px"},
					{"sTitle": "<span class='descending'>"+rs.EA+"</span>", "sWidth":"75px"},
					{"sTitle": "<span class='descending'>"+rs.compName+"</span>", "sWidth":"140px"},
					{"sTitle": "<span class='descending'>"+rs.partnerID+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.reseller+"</span>", "sWidth":"140px"},
					{"sTitle": "<span class='descending'>"+rs.rejectedBy+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.dateRejected+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.comment+"</span>", "sWidth":"auto"},
					{"sTitle": "", "bVisible":false}
				],
				"sAjaxSource": rs.url.allRejectedRequestForDisti,
				"error":myvmware.sdp.cmn.dataTableError,
				"sPaginationType": "full_numbers",
				"aaSorting": [[1, 'desc']],
				"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
				"iDisplayLength": 10,
				"bServerSide": false,
				"bDestroy": true,
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"bProcessing":true,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]);
					$(nRow).find("td:eq(2)").html("<a href='"+rs.url.serviceIDUrl+"&_VM_serviceID="+escape(aData[11])+"'>"+aData[2]+"</a>");
					if($.trim(aData[7]).length && $.trim(aData[10]).length){
						$(nRow).find('td:eq(7)').html('<a title="'+aData[10]+'" href="mailto:'+aData[10]+'">'+aData[7]+'</a>');
					}
					$(nRow).find("td:eq(4)").html("<a href='"+rs.url.customerNameUrl+"&_VM_selectedAccountNumber="+aData[5]+"&_VM_selectedEaNumber="+aData[3]+"'>"+aData[4]+"</a>");
					$(nRow).find("td:eq(6)").html("<a href='"+rs.url.resellerNameUrl+"?_VM_selectedAccountNumber="+aData[5]+"'>"+aData[6]+"</a>");
					$(nRow)[0].idx = iDisplayIndex;
					return nRow;
				},
				"fnInitComplete": function(){
					var dtd = this;
					if(!dtd.find('tfoot').length) $(dtd).append('<tfoot><tr><td class="bottomarea" colspan="10"></td></tr></tfoot>');
					$('#tbl_rejectedReq').next(".bottom").show();
					var pdgSettings= this.fnSettings();
					if(pdgSettings.jqXHR && pdgSettings.jqXHR.responseText!==null && pdgSettings.jqXHR.responseText.length && typeof pdgSettings.jqXHR.responseText =="string"){
						order.rejectJson = vmf.getObjByIdx(vmf.json.txtToObj(pdgSettings.jqXHR.responseText),0);
					}
					$('#tbl_rejectedReq').find('span.openclose').die('click').live("click",function (){
						order.expandRow3($(this),dtd);
					});
					myvmware.common.selectAllChks(this,order.onSelectChkBox);
					$("#rejected").html(" ("+ Math.ceil(this.fnSettings().fnRecordsDisplay()) +")");
					myvmware.sdp.cmn.dataTableSuccess($(dtd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_rejectedReq_paginate").css("display", "block");
					} else {
						$("#tbl_rejectedReq_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_rejectedReq_length option:eq(0)").val(),10)){
						$("#tbl_rejectedReq_length").css("display", "block");
					} else {
						$("#tbl_rejectedReq_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
				}
			}); // End of addons
			m.hasData=1;
			myvmware.sdp.cmn.getCalendar("txt_rejected_from","txt_rejected_to");
			if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti :sdpPrtnrOrders  : rejected-orders');
		},
		expandRow1 :function(o,t){
			 nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr1.haveData){
					t.fnOpen(nTr1,order.showloading(),'');
					order.getCdata1($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else
					$(nTr1).next("tr").show();
			}	
		},
		expandRow2 :function(o,t){
			nTr2 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr2).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr2).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr2.haveData){
					t.fnOpen(nTr2,order.showloading(),'');
					order.getCdata2($(nTr2), nTr2.idx);
					nTr2.haveData = true;
					$(nTr2).next("tr").addClass('more-detail');
				}else
					$(nTr2).next("tr").show();
			}
		},
		expandRow3 :function(o,t){
			nTr3 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr3).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr3).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr3.haveData){
					t.fnOpen(nTr3,order.showloading(),'');
					order.getCdata3($(nTr3), nTr3.idx);
					nTr3.haveData = true;
					$(nTr3).next("tr").addClass('more-detail');
				}else
					$(nTr3).next("tr").show();
			}
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		getCdata1:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table1-" + idx);
			var cdata = order.pendingJson.subaaData[$(nTr1).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.comp+"</span>","sWidth":"200px","bSortable":false},
					{"sTitle": "<span>"+rs.quan+"</span>","sWidth":"90px","bSortable":false},
					{"sTitle": "<span>"+rs.orderTotal+"</span>","sWidth":"80px","bVisible":(partnerType != 'RESELLER') ? true : false, "bSortable":false},
					{"sTitle": "<span>"+rs.monRem+"</span>","sWidth":"100px","bSortable":false,"bVisible":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					$subTable.next(".bottom").show();
				}
			})
		},
		getCdata2:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + idx ) + '"></table>');
			$(nTr2).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + idx);
			var cdata = order.orderJson.subaaData[$(nTr2).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>"+rs.comp+"</span>","sWidth":"300px","bSortable":false},
					{"sTitle": "<span>"+rs.quan+"</span>","sWidth":"90px","bSortable":false},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"70px","bVisible":(partnerType != 'RESELLER') ? true : false, "bSortable":false},
					{"sTitle": "<span>"+rs.monRem+"</span","sWidth":"200px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					$subTable.next(".bottom").show();
				}
			})
		},
		getCdata3:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table3-" + idx ) + '"></table>');
			$(nTr3).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table3-" + idx);
			var cdata = order.rejectJson.subaaData[$(nTr3).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.comp+"</span>","sWidth":"200px","bSortable":false},
					{"sTitle": "<span>"+rs.quan+"</span>","sWidth":"90px","bSortable":false},
					{"sTitle": "<span>"+rs.orderTotal+"</span>","sWidth":"80px","bVisible":(partnerType != 'RESELLER') ? true : false, "bSortable":false},
					{"sTitle": "<span>"+rs.monRem+"</span>","sWidth":"100px","bSortable":false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
					$subTable.next(".bottom").show();
				}
			})
		},
		bindEvents: function(){
			$('ul.tabs li a').click(function(o,i){
				$('div.cal_error_div').hide();
				$('ul.tabs li a').removeClass('active');
				$(this).addClass('active');
				var idx = $(this).closest("a").attr("index") || $(this).parent($(this)).index();
				var m = order.map['tab'+idx];
				$('div.tabContainers').hide()
				$('#'+m.tab_cnt).show();
				if(!m.hasData)	m.func(m);
				return false;
			});
			
			/* Events for Reseller Start*/
			$("#btn_pend_resetFilter").live("click",function(){
				order.setFilterDefaults();
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"requestId":"","serviceId":"","fromDate":"","toDate":""};
				$("#tbl_pendingReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pendingReq'),rs.url.allPendingRequestForReseller,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_pendingReq', false);
			});
			
			$("#btn_pend_apply").live("click",function(){
				order.setFilterDefaults();
				var postData = {"requestId":$.trim($("#txt_requestID").val()),"serviceId":$.trim($("#txt_servID").val()),"fromDate":$.trim($("#txt_uploadedDate_from").val()),"toDate":$("#txt_uploadedDate_to").val()};
				$("#tbl_pendingReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pendingReq'),rs.url.allPendingRequestForReseller,myvmware.sdp.cmn.exportFile('a.tbl_pendingReq', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrOrders : pndgreq : filter');
			});
			$("#btn_all_resetFilter").live("click",function(){
				$('div.cal_error_div').hide()
				$("#txt_orderID,#txt_customer,#sel_serviceType,#sel_orderType,#txt_orderDate_from,#txt_orderDate_to").val('');
				var postData = {"orderId":"","customerName":"","serviceType":"","orderType":"","fromDate":"","toDate":""};
				$("#tbl_orders").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_orders'),rs.url.allProcessedOrderedForReseller,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_orders', false);
			});
			$("#btn_all_apply").live("click",function(){
				order.orderTypeDef=$("#sel_orderType").val();
				order.serviceTypeDef=$("#sel_serviceType").val();
				var postData = {"orderId":$.trim($("#txt_orderID").val()),"customerName":$.trim($("#txt_customer").val()),"serviceType":$.trim($("#sel_serviceType").val()),"orderType":$("#sel_orderType").val(),"fromDate":$.trim($("#txt_orderDate_from").val()),"toDate":$("#txt_orderDate_to").val()};
				$("#tbl_orders").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_orders'),rs.url.allProcessedOrderedForReseller,myvmware.sdp.cmn.exportFile('a.tbl_orders', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrOrders : orders : filter');
			});
			
			$("#btn_rej_resetFilter").live("click",function(){
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"requestId":"","serviceId":"","fromDate":"","toDate":"",customerName:""};
				$("#tbl_rejectedReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_rejectedReq'),rs.url.allRejectedRequestForReseller,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_rejectedReq', '');
			});
			$("#btn_rej_apply").live("click",function(){
				var postData = {"requestId":$.trim($("#rej_requestID").val()),"serviceId":$.trim($("#rej_servID").val()),"fromDate":$.trim($("#txt_rejected_from").val()),"toDate":$("#txt_rejected_to").val(),"customerName":$.trim($("#rej_customer").val())};
				$("#tbl_rejectedReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_rejectedReq'),rs.url.allRejectedRequestForReseller,myvmware.sdp.cmn.exportFile('a.tbl_rejectedReq', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : sdpPrtnrOrders : dclnfreq : filter');
			});
			/* Events for Reseller End*/
			
			/* Events for Disti Start*/
			$("#btn_order_resetFilter").live("click",function(){
				$("#txt_reseller,#txt_selected,#sel_serviceType,#sel_orderType,#txt_uploadedDate_from,#txt_uploadedDate_to,#sel_status").val('');
				var postData = {"type":"","customerName":"","status":"","serviceType":"","orderType":"","fromDate":"","toDate":""};
				$("#tbl_orders").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_orders'),rs.url.allProcessedOrderedForDisti,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_orders', '');
			});
			$("#btn_order_ApplyFilter").live("click",function(){
				order.orderTypeDef=$("#sel_orderType").val();
				order.serviceTypeDef=$("#sel_serviceType").val();
				order.statusDef=$("#sel_status").val();
				var postData = {"type":$("#txt_reseller").val(),"customerName":$.trim($("#txt_selected").val()),"serviceType":$.trim($("#sel_serviceType").val()),"orderType":$("#sel_orderType").val(),"fromDate":$.trim($("#txt_uploadedDate_from").val()),"toDate":$("#txt_uploadedDate_to").val(),"status":$("#sel_status").val()};
				$("#tbl_orders").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_orders'),rs.url.allProcessedOrderedForDisti,myvmware.sdp.cmn.exportFile('a.tbl_orders', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrOrders : orders : filter');
			});
			
			$("#btn_req_resetFilter").live("click",function(){	
				order.setFilterDefaults();
				$("#txt_reqId,#txt_cName,#txt_reqDate_from,#txt_reqDate_to").val('');
				var postData = {"requestId":"","customerName":"","fromDate":"","toDate":""};
				$("#tbl_pendingReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pendingReq'),rs.url.allPendingRequestForDisti,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_pendingReq', false);
			});
			$("#btn_req_ApplyFilter").live("click",function(){	
				order.setFilterDefaults();
				var postData = {"requestId":$("#txt_reqId").val(),"customerName":$.trim($("#txt_cName").val()),"fromDate":$.trim($("#txt_reqDate_from").val()),"toDate":$("#txt_reqDate_to").val()};
				$("#tbl_pendingReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_pendingReq'),rs.url.allPendingRequestForDisti,myvmware.sdp.cmn.exportFile('a.tbl_pendingReq', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrOrders : pndgreq : filter');
			});
			
			$("#btn_reject_resetFilter").live("click",function(){
				$(this).closest(".filter-content").find("input:text,select").val("");
				var postData = {"requestId":"","serviceId":"","fromDate":"","toDate":"",customerName:"",resellerName:""};
				$("#tbl_rejectedReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_rejectedReq'),rs.url.allRejectedRequestForReseller,function(){},"POST",postData);
				myvmware.sdp.cmn.exportFile('a.tbl_rejectedReq', '');
			});
			$("#btn_reject_apply").live("click",function(){
				var postData = {"requestId":$.trim($("#rej_requestID").val()),"serviceId":$.trim($("#rej_servID").val()),"fromDate":$.trim($("#txt_rejected_from").val()),"toDate":$("#txt_rejected_to").val(),"customerName":$.trim($("#rej_customer").val()),"resellerName":$.trim($("#rej_reseller").val())};
				$("#tbl_rejectedReq").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_rejectedReq'),rs.url.allRejectedRequestForReseller,myvmware.sdp.cmn.exportFile('a.tbl_rejectedReq', postData),"POST",postData);
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : sdpPrtnrOrders : dclnfreq : filter');
			});
			/* Events for Disti End*/
		}
	},
	"instance":{
		init: function(){
			ins = myvmware.sdp.instance;
			ins.curPendingJson=null;
			ins.curProcessJson=null;
			ins.penPendingJson=null;
			ins.penProcessJson=null;
			myvmware.sdp.cmn.events();
			if(partnerType == "RESELLER") {
				ins.loadReselData();
				if (rs.isPraxis==1) {
					$('.sdpAcDetail').hide();
					$('#loadingNew').show();
				}else{
					$('.sdpAcDetail').show();
				}
			//Changes done for  omniture				
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller : sdpPrtnrAccDtls : serviceDtls']});
			} else {
				ins.loadDisiData();
				if (rs.isPraxis==1) {
					$('.sdpAcDetail').hide();
					$('#loadingNew').show();
				}else{
					$('.sdpAcDetail').show();
				}
			//Changes done for  omniture				
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti : sdpPrtnrAccDtls : serviceDtls']});				
			}
		},
		loadDisiData: function(){			
			vmf.datatable.build($('#tbl_current'),{
				"bProcessing": true,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"bInfo": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"30px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.orId+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.orTyp+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.orderStatus+"</span>", "sWidth":"200px"},
					{"sTitle": "<span class='descending'>"+rs.req+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.sDat+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.monPri+"</span>", "sWidth":"50px", "bVisible":(partnerType != 'RESELLER') ? true : false ,"bSortable":false}
				], 
				"sAjaxSource": rs.url.currentService,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"sDom" : 'rt<"bottom"lpi<"clear">>',
				"aaSorting": [[1, 'asc']],
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow = $(nRow);
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]);
					$(nRow)[0].idx = iDisplayIndex;
					if($.trim(aData[4]).length){
						if($.trim(aData[7]).length) {
							$(nRow).find("td:eq(4)").html("<a target='_blank' title='"+aData[7]+"' href='mailto:"+aData[7]+"'>"+aData[4]+"</a>");
						} else {
							$(nRow).find("td:eq(4)").html(aData[4]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var cd = this, curSettings = this.fnSettings();
					if(!$(cd).find('tfoot').length) {
						var colspan = (partnerType != 'RESELLER') ? 7 : 6;
						$(cd).append('<tfoot><tr><td class="bottomarea" colspan="'+colspan+'"></td></tr></tfoot>')
						$('#tbl_current').next(".bottom").show();
					}
					if(curSettings.jqXHR && curSettings.jqXHR.responseText!==null && curSettings.jqXHR.responseText.length && typeof curSettings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(curSettings.jqXHR.responseText),
							serData = jsonResp.wrapper;
						ins.curPendingJson = vmf.getObjByIdx(vmf.json.txtToObj(curSettings.jqXHR.responseText),0);
						
						$('#tbl_current').find('span.openclose').live("click",function (){
							ins.expandCurData($(this),cd);
						});
						$('#srId').html(serData.serviceID);
						$('#cAcc').html(serData.customerAccount);
						$('#cusName').html("<a href='"+rs.url.customerNameSummaryURL+"&_VM_selectedAccountNumber="+serData.resellerPRMID+"&_VM_selectedEaNumber="+serData.customerAccount +"'>"+serData.customerName+"</a>");
						$('#proCon').html((serData.procurementEmail!=null && (serData.procurementEmail).length) ? '<a href="mailto:'+serData.procurementEmail+'">'+serData.procurementContact+'</a>' : serData.procurementContact);
						$('#rSel').html("<a href='"+rs.url.resellerNameSummaryURL+"?_VM_selectedAccountNumber="+serData.resellerPRMID+"'>"+serData.reseller+"</a>");
						$('#rSelCon').html(serData.resellerPrimaryContact);
						$('#sat').html("<span class='alertIcon"+serData.statusFlag+"'>&nbsp;</span>"+serData.serviceStatus).closest('td').addClass('alertColor'+serData.statusFlag);
						/*$('#srsSdate').html(serData.serviceStartDate);*/
						$('#sDate').html(serData.startDate);
						$('#eDate').html(serData.endDate);
						$('#subRnew').html(serData.subscriptionRenews);
						$('#VMware').html(serData.vmwareInitialOrderID);
						$('#cMonBil').html((serData.currentMonthBilling!=null && serData.currentMonthBilling.length > 0) ? serData.currentMonthBilling : serData.currentMonthBilling);
						$('#currency').html(serData.currency);
						$('#paymentMethod').html(serData.paymentMethod);
						$('#fundName').html(serData.fundName);
						$('#fundExpiry').html(serData.fundExpiry);
						if (serData.lastTransaction) $('#lastStmt').html(serData.lastTransaction);
						if (serData.serviceOwner) $('#serviceOwner').html('<a href="mailto:'+serData.serviceOwnerEmail+'">'+serData.serviceOwner+'</a>');
						$('#pMonBil').html((serData.previousMonthBilling!=null && serData.previousMonthBilling.length > 0) ? serData.previousMonthBilling : serData.previousMonthBilling); 
						$('#region').html(serData.region);
						$('#renewalType').html(serData.renewalType);
						if (serData.statusFlag.charAt(0)=="0" || serData.statusFlag.charAt(0)=="2" || serData.statusFlag.charAt(0)=="3") $("#actionDropdown").removeAttr("disabled");
					}
					myvmware.sdp.cmn.dataTableSuccess($(cd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_current_paginate").css("display", "block");
					} else {
						$("#tbl_current_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_current_length option:eq(0)").val(),10)){
						$("#tbl_current_length").css("display", "block");
					} else {
						$("#tbl_current_length").css("display", "none");
					}
					if (rs.isPraxis==1) {
						$('.sdpAcDetail').show();
						$('#loadingNew').hide();
					}
				}
			});
			vmf.datatable.build($('#tbl_pending'),{
				"bProcessing": true,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"bInfo": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"20px","bSortable":false},
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.reId+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"180px"},
					{"sTitle": "<span class='descending'>"+rs.subBy+"</span>", "sWidth":"100px"},
					{"sTitle": "<span class='descending'>"+rs.reDat+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"100px", "bSortable":false}
				],
				"sAjaxSource": rs.url.pendingService,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"sDom" : 'rt<"bottom"lpi<"clear">>',
				"aaSorting": [[2, 'asc']],
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					var $nRow = $(nRow);
					$nRow.find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
					var $nRow = $(nRow);					
					if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' checked='' style='margin-right:5px'>").end().data("id",aData[2]);
					}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' style='margin-right:5px'>").end().data("id",aData[2]);
					}
					$(nRow)[0].ids = iDisplayIndex;
					if($.trim(aData[4]).length){
						if($.trim(aData[7]).length) {
							$nRow.find("td:eq(4)").html("<a target='_blank' title='"+aData[7]+"' href='mailto:"+aData[7]+"'>"+aData[4]+"</a>");
						} else {
							$nRow.find("td:eq(4)").html(aData[4]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var cd = this, penSettings = this.fnSettings();
					myvmware.common.selectAllChks(cd,ins.onSelectChkBox);
					if(!$(cd).find('tfoot').length) {
						$(cd).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
						$('#tbl_pending').next(".bottom").show();
					}
					if(penSettings.jqXHR && penSettings.jqXHR.responseText!==null && penSettings.jqXHR.responseText.length && typeof penSettings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(penSettings.jqXHR.responseText),
							serData = jsonResp.wrapper;
						ins.penPendingJson = vmf.getObjByIdx(vmf.json.txtToObj(penSettings.jqXHR.responseText),0);
						
						$('#tbl_pending').find('span.openclose').live("click",function (){
							ins.expandPenData($(this),cd);
						});
					}
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_pending_paginate").css("display", "block");
					} else {
						$("#tbl_pending_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pending_length option:eq(0)").val(),10)){
						$("#tbl_pending_length").css("display", "block");
					} else {
						$("#tbl_pending_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});

				}
			});
		},
		loadReselData:function(){
			vmf.datatable.build($('#tbl_current'),{
				"bProcessing": true,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"bInfo": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"10px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.orId+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.orTyp+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.orderStatus+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.req+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.sDat+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.monPri+"</span>", "bVisible":false}
				], 
				"sAjaxSource": rs.url.currentService,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"aaSorting": [[1, 'asc']],
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[1]);
					$(nRow)[0].idx = iDisplayIndex;
					if($.trim(aData[4]).length){
						if($.trim(aData[7]).length) {
							$(nRow).find("td:eq(4)").html("<a target='_blank' title='"+aData[7]+"' href='mailto:"+aData[7]+"'>"+aData[4]+"</a>");
						} else {
							$(nRow).find("td:eq(4)").html(aData[4]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var cd = this, curSettings = this.fnSettings();
					if(!$(cd).find('tfoot').length) {
						$(cd).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
						$('#tbl_current').next(".bottom").show();
					}
					if(curSettings.jqXHR && curSettings.jqXHR.responseText!==null && curSettings.jqXHR.responseText.length && typeof curSettings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(curSettings.jqXHR.responseText),
							serData = jsonResp.wrapper;
						ins.curPendingJson = vmf.getObjByIdx(vmf.json.txtToObj(curSettings.jqXHR.responseText),0);
						
						$('#tbl_current').find('span.openclose').live("click",function (){
							ins.expandCurData($(this),cd);
						});
						$('#srSat').html("<span class='alertIcon"+serData.statusFlag+"'>&nbsp;</span>"+serData.serviceStatus).closest('td').addClass('alertColor'+serData.statusFlag);
						$("#aName").html(serData.customerName);
						$('#srId').html(serData.serviceID);
						$('#acId').html(serData.accountID);
						$('#srTyp').html(serData.serviceType);
						$('#VMID').html(serData.vmwareInitialOrderID);
						$('#srsSdate').html(serData.serviceStartDate);
						$('#sDate').html(serData.startDate);
						$('#eDate').html(serData.endDate);
						$('#sRen').html(serData.subscriptionRenews);
						$('#resCon').html(serData.resellerPrimaryContact);
						$('#res').html(serData.reseller);
						$('#renewalType').html(serData.renewalType);
						$('#cMonBil').html((serData.currentMonthBilling!=null && serData.currentMonthBilling.length > 0) ? serData.currentMonthBilling : serData.currentMonthBilling);
						$('#currency').html(serData.currency);
						$('#paymentMethod').html(serData.paymentMethod);
						$('#fundName').html(serData.fundName);
						$('#fundExpiry').html(serData.fundExpiry);
						if (serData.lastTransaction) $('#lastStmt').html(serData.lastTransaction);
						if (serData.serviceOwner) $('#serviceOwner').html('<a href="mailto:'+serData.serviceOwnerEmail+'">'+serData.serviceOwner+'</a>');
						$('#pMonBil').html((serData.previousMonthBilling!=null && serData.previousMonthBilling.length > 0) ? serData.previousMonthBilling : serData.previousMonthBilling);
						$('#region').html(serData.region);
						if(serData.statusFlag != null){
							if (serData.statusFlag.charAt(0)=="0" || serData.statusFlag.charAt(0)=="2" || serData.statusFlag.charAt(0)=="3") $("#actionDropdown").removeAttr("disabled");
						}
					}
					myvmware.sdp.cmn.dataTableSuccess($(cd));
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_current_paginate").css("display", "block");
					} else {
						$("#tbl_current_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_current_length option:eq(0)").val(),10)){
						$("#tbl_current_length").css("display", "block");
					} else {
						$("#tbl_current_length").css("display", "none");
					}
					if (rs.isPraxis==1) {
						$('.sdpAcDetail').show();
						$('#loadingNew').hide();
					}
				}
			});
			vmf.datatable.build($('#tbl_pending'),{
				"bProcessing": true,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
				"iDisplayLength": 5,
				"bInfo": false,
				"aoColumns": [
					{"sTitle": "","sWidth":"10px","bSortable":false},
					{"sTitle": "<input type='checkbox' class='tbl_selectAll'>","sWidth":"20px","bSortable":false},
					{"sTitle": "<span class='descending'>"+rs.reId+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.subBy+"</span>", "sWidth":"auto"},
					{"sTitle": "<span class='descending'>"+rs.reDat+"</span>", "sWidth":"auto"},
					{"sTitle": "<span>"+rs.orderTotal+"</span>", "sWidth":"70px", "bSortable":false}
				],
				"sAjaxSource": rs.url.pendingService,
				"error":myvmware.sdp.cmn.dataTableError,
				"bServerSide": false,
				"sDom": 'rt<"bottom"lpi<"clear">>',
				"aaSorting": [[1, 'asc']],
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"fnRowCallback": function(nRow,aData,iDisplayIndex){
					$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
					var $nRow = $(nRow);					
					if(($nRow.find("td:eq(1)").html() != '') && ($nRow.find("td:eq(1)").find('input').attr('checked') == true)){
							$(nRow).find("td:eq(1)").html("<input type='checkbox' checked='' style='margin-right:5px'>").end().data("id",aData[2]);
					}else{
							$(nRow).find("td:eq(1)").html("<input type='checkbox' style='margin-right:5px'>").end().data("id",aData[2]);
					}
					$(nRow).find("td:eq(6)").html(aData[7]);
					$(nRow)[0].ids = iDisplayIndex;
					if($.trim(aData[4]).length){
						if($.trim(aData[8]).length) {
							$(nRow).find("td:eq(4)").html("<a target='_blank' title='"+aData[8]+"' href='mailto:"+aData[8]+"'>"+aData[4]+"</a>");
						} else {
							$(nRow).find("td:eq(4)").html(aData[4]);
						}
					}
					return nRow;
				},
				"fnInitComplete": function(){
					var cd = this, penSettings = this.fnSettings();
					myvmware.common.selectAllChks(cd,ins.onSelectChkBox);
					if(!$(cd).find('tfoot').length) {
						$(cd).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
						$('#tbl_pending').next(".bottom").show();
					}
					if(penSettings.jqXHR && penSettings.jqXHR.responseText!==null && penSettings.jqXHR.responseText.length && typeof penSettings.jqXHR.responseText =="string"){
						var jsonResp = vmf.json.txtToObj(penSettings.jqXHR.responseText),
							serData = jsonResp.wrapper;
						ins.penPendingJson = vmf.getObjByIdx(vmf.json.txtToObj(penSettings.jqXHR.responseText),0);
						
						$('#tbl_pending').find('span.openclose').live("click",function (){
							ins.expandPenData($(this),cd);
						});
					}
				},
				"fnDrawCallback":function(){
					if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
						$("#tbl_pending_paginate").css("display", "block");
					} else {
						$("#tbl_pending_paginate").css("display", "none");
					}
					if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_pending_length option:eq(0)").val(),10)){
						$("#tbl_pending_length").css("display", "block");
					} else {
						$("#tbl_pending_length").css("display", "none");
					}
					$(this).find('tbody tr').each(function(){
						if($(this).next("tr").hasClass('more-detail') && $(this).hasClass('expanded')) $(this).find('span.openclose').addClass('minus');
					});
				}
			});
		},
		onSelectChkBox: function(tbl){
			var selected = tbl.find("tbody input:checkbox:checked").length;
			var approveElement = $("#approve");
			var rejectElement = $("#reject");
			var selectedPendingArray = [], rowListArray = [];
			if (selected != 0 && (rs.isAdmin == 'true' || rs.isPricingUser == 'true') && !(tbl.has('td.dataTables_empty').length > 0)){
				$("#approve").html("<a href='#'>" + rs.Approve + "</a>");
				$("#reject").html("<a href='#'>" + rs.Decline + "</a>");
				
				$("#approve").html("<a href='#'>"+rs.approve+"</a>");
				$("#reject").html("<a href='#'>"+rs.reject+"</a>");
				
				approveElement.html("<a href='#'>"+rs.approve+"</a>").closest('li').removeClass('disabled');
				rejectElement.html("<a href='#'>"+rs.reject+"</a>").closest('li').removeClass('disabled');
				
				if(tbl.find('table').attr('id') == 'tbl_pendingReq' || tbl.find('table').attr('id') == 'tbl_pending' ){	
					$.each(tbl.find("tbody input:checkbox:checked"),function(i,v){
						selectedPendingArray.push($(v).closest('tr').data('id'));
						rowListArray.push($(v).closest('tr'));						
					});
					tbl.find('table').data('selectedPendingArray',selectedPendingArray);
					tbl.find('table').data('rowListArray',rowListArray);
				}
			} else {
				$("#approve").html(rs.Approve);
				$("#reject").html(rs.Decline);
				$("#approve").html(rs.approve);
				$("#reject").html(rs.reject);
				approveElement.html(rs.approve).closest('li').addClass('disabled');
				rejectElement.html(rs.reject).closest('li').addClass('disabled');
			}
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		expandCurData :function(o,t){
			curDat = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(curDat).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(curDat).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!curDat.haveData){
					t.fnOpen(curDat, ins.showloading(),'');
					ins.getCurData($(curDat), curDat.idx);
					curDat.haveData = true;
					$(curDat).next("tr").addClass('more-detail');
				}else {
					$(curDat).next("tr").show();
				}
			}	
		},
		getCurData:function(rowObj, idx){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(curDat).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table1-" + idx);
			var cdata = ins.curPendingJson.subaaData[$(curDat).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.comp+"</span>", "sWidth":"200px"},
					{"sTitle": "<span>"+rs.quan+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.monPri+"</span>","sWidth":"70px", "bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span>"+rs.monRem+"</span>", "sWidth":"100px"}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnDrawCallback":function(){
					var tbody = $(this).find("tbody"), scroll = $(this).closest(".dataTables_scrollBody");
					if (tbody.height() < scroll.height()) scroll.height(tbody.height());
				}
			});
		},
		expandPenData :function(o,t){
			perDat = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(perDat).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(perDat).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!perDat.haveData){
					t.fnOpen(perDat, ins.showloading(),'');
					ins.getPenData($(perDat), perDat.ids);
					perDat.haveData = true;
					$(perDat).next("tr").addClass('more-detail');
				}else {
					$(perDat).next("tr").show();
				}
			}	
		},
		getPenData:function(rowObj, ids){
			var sOut = [];
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table2-" + ids ) + '"></table>');
			$(perDat).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table2-" + ids);
			var cdata = ins.penPendingJson.subaaData[$(perDat).data("id")];
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>", "sWidth":"50px"},
					{"sTitle": "<span>"+rs.comp+"</span>", "sWidth":"200px"},
					{"sTitle": "<span>"+rs.quan+"</span>", "sWidth":"100px"},
					{"sTitle": "<span>"+rs.monPri+"</span>", "sWidth":"80px", "bVisible":(partnerType != 'RESELLER') ? true : false},
					{"sTitle": "<span>"+rs.monRem+"</span>", "sWidth":"100px", "bVisible" : false}
				],
				"aaData":cdata,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"sPaginationType": "full_numbers",
				"bAutoWidth" : false,
				"fnDrawCallback":function(){
					var tbody = $(this).find("tbody"), scroll = $(this).closest(".dataTables_scrollBody");
					if (tbody.height() < scroll.height()) scroll.height(tbody.height());
				}
			});
		}
	},
	"notifi":{
		"init":function() {
			$('#editValues').find("span").each(function(i,v){
				$(this).html(vmf.wordwrap($(this).html(),2));
			});
			not = myvmware.sdp.notifi;
			not.adjustHt();
			not.bindEvents();
			myvmware.sdp.cmn.events();
			not.validateForm();
			timer = 0;
			timer1 = 0;
			
			//Changes done for  omniture
			if(partnerType == "RESELLER") {
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller :dfltConfig']});
			}
			else{
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti : dfltConfig']});
			}
			$(window).resize(not.adjustHt);
		},
		timer: {
			timer1: 0,
			timer2: 0
		},
		bindEvents: function(){
			var changeCur=["<select id='currency' style='display:none;'>"];
			var currencyMap =rs.currencyMap,selectedCurreny = rs.selectedCurrency,finalCurrency="",defaultOptn = rs.defaultOption;
			if($.trim(selectedCurreny).length > 0 && currencyMap[selectedCurreny]!=null){
				finalCurrency = currencyMap[selectedCurreny][0];
			}else{
				finalCurrency = rs.noCurrencySet;
				changeCur.push("<option value='' class='grayIn'>"+defaultOptn+"</option>");
				$("#submitLimit").addClass("disabled").attr("disabled","disabled");
			}
			for(key in currencyMap){
				changeCur.push('<option value="'+key+'" class="grayOut">'+currencyMap[key][0]+'</option>');
			}
			changeCur.push('</select>');
			$("td.autoAppCur").append("<span class='dispCurrency'>"+finalCurrency+"</span>").append(changeCur.join(""));
			$("#currency").val(selectedCurreny);
			if($.trim(selectedCurreny).length<=0){ $("#currency").addClass('grayIn');}
			$('#currency').val("").change(function() {				
				$("#submitLimit").removeClass("disabled").removeAttr("disabled","disabled");
				$("#currency").find("option[value='']").remove().end().removeClass('grayIn');
				rs.selectedCurrency = $('#currency').val();	
				selectedCurreny = rs.selectedCurrency;		
			});
			$('span.dispAmount').html(vmf.wordwrap($(".dispAmount").html(),2));
			//$('span.dispEmail').html(vmf.wordwrap($('span.dispEmail').html(),2));
			$('#editVals').live('click',function(e){
				$('#editValues').find('span').hide().end().find('input:text').show();
				$(this).hide();
				$("#saveVals").show();
				not.adjustHt();
				e.preventDefault();
			});
			$('#editLimit').click(function(){
				$('#currency').val(selectedCurreny);
				$(this).hide();
				$('span.dispAmount').hide();
				$('#submitLimit, #thrsldLimit').show();
				if(partnerType == "DISTI"){
					$('span.dispCurrency').hide(); 
					$('#currency').show();
				}
			});
			$('#saveVals').click(function(){
				clearTimeout(not.timer.timer2);
				$("#error_msg").css('visibility', 'hidden');
			});
			$('#submitLimit').click(function(){
				clearTimeout(not.timer.timer1);
				var value = $(this).closest('form').find('input:text').val().split(',').join('');
				var currencyvalue = $(this).closest('form').find('select').val();
				$("#confirmMsg").css('visibility', 'hidden');
				vmf.ajax.post(rs.limitUrl, {"thresholdLimit":value,"thresholdCurrency":currencyvalue}, not.onSuccessUpdate, not.onFailUpdate,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});					
			});
			$('#cancelLimit').click(function(){
				$(this).closest('form').find('input:text').val('');
				$("#confirmMsg").css('visibility', 'hidden');
			});
		},
		validateForm : function(){
			$('#settings').validate({
				errorPlacement : function(error, element) {
					element.after(error);
				},
				rules : {
					firstName : {
						required : true
					},
					lastName : {
						required : true
					},
					email : {
						required : true,
						email: true
					}
				},
				messages : {
					firstName : {
						required : rs.fistNameRequired
					},
					lastName : {
						required : rs.lastNameRequired
					},
					email : {
						required : rs.emailRequired,
						email : rs.emailFormat
					}
				},
				onfocusout : function(element) {
					this.element(element);
				},
				success : function(em) {
					return false;
				},
				submitHandler : function(form) {
					//submit handler code
					var spanVal = [], inputVal = [];
					$('span', $('#editValues')).each(function(){
						spanVal.push($(this).text());
					});
					$('input:text', '#editValues').each(function(){
						inputVal.push($(this).val());
					});
					if((spanVal[0] != inputVal[0]) || (spanVal[1] != inputVal[1]) || (spanVal[2] != inputVal[2])) {
						$("#error_msg").hide();
						vmf.ajax.post(rs.saveUrl, {"notificationEmail":inputVal[2],"notificationUserFirstName":inputVal[0],"notificationUserLastName":inputVal[1]}, not.onSuccessEdit, not.onFailEdit,function(){vmf.loading.hide()},null,function(){vmf.loading.show()});
					} else {
						$('#editValues').find('span').show().end().find('input:text').hide();
						$("#saveVals").hide();
						$("#editVals").show();
						not.adjustHt();
					}
					return false;
				}
			});
		},
		onSuccessUpdate:function(data){
			if(typeof data!="object") data=vmf.json.txtToObj(data);
			if(data.status){
				$("#confirmMsg").html(rs.monthlyLimitSuccessMsg).removeClass('error').css('visibility', 'visible');
				$('span.dispCurrency, span.dispAmount, #editLimit').show();
				var selcurr = $("#currency option:selected").text();
				$('span.dispCurrency').html(selcurr);
				var str = $('#thrsldLimit').val().split(',').join(''),
				pattern = /(-?\d+)(\d{3})/;
				if(str.length >= 4){
					while(pattern.test(str)) {
						str = str.replace(pattern, "$1,$2");
						$('span.dispAmount').html(str);
					}
				} else {
					$('span.dispAmount').html(str);
				}
				$('span.dispAmount').html(vmf.wordwrap($(".dispAmount").html(),2));
				$('#currency, #submitLimit, #thrsldLimit').hide();
				//Changes done for  omniture 
				if(partnerType == "RESELLER") {
					if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller :dfltConfig : update-auto-approve');
				}
				else{
					if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : dfltConfig : update-auto-approve');
				}
			}else {
				$("#confirmMsg").html(data.error_MESSAGE || rs.genericError).addClass('error').css('visibility', 'visible');
			}
			not.timer.timer1 = setTimeout(function() { $("#confirmMsg").css('visibility', 'hidden'); }, 10000);
			not.adjustHt();
		},
		onFailUpdate:function(){
			$("#confirmMsg").html(rs.genericError).addClass('error').css('visibility', 'visible');
			not.timer.timer1 = setTimeout(function() { $("#confirmMsg").css('visibility', 'hidden'); }, 10000);
		},
		onSuccessEdit: function(data){
			if(typeof data!="object") data=vmf.json.txtToObj(data);
			if(data.status){
				$('#editValues').find("input:text").each(function(i,v){
					$(this).siblings("span").html(vmf.wordwrap($(this).val(),2));
				});
				//$('span.dispEmail').html(vmf.wordwrap($('span.dispEmail').html(),2));
				$('#editValues').find('span').show().end().find('input:text').hide();
				$("#saveVals").hide();
				$("#editVals").show();
				//Changes done for  omniture
				if(partnerType == "RESELLER") {
					if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller :dfltConfig : update-email');
				}
				else{
					if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : dfltConfig : update-email');
				}
			} else {
				$("#error_msg").html(data.ERROR_MESSAGE || rs.genericError).show();
			}
			not.timer.timer2 = setTimeout(function() { $("#error_msg").css('visibility', 'hidden'); }, 10000);
			not.adjustHt();
		},
		onFailEdit:function(){

			$("#error_msg").html(rs.genericError).show();
			not.timer.timer2 = setTimeout(function() { $("#error_msg").css('visibility', 'hidden'); }, 10000);
		},
		adjustHt: function(){
			$('.fixHeight, .tabSections').height('auto');
			var ht=0,target,totHt=0,whiteArea=0, tabSec=0;
			$.each($('.fixHeight'),function(a,b){
				tabSec = (tabSec < $(b).height()) ? $(b).height() : tabSec;
			});
			$('.fixHeight').height(tabSec+'px');
			$.each($('.tabSections'),function(i,v){
			  totHt = (totHt <= $(v).height()) ? $(v).height() : totHt;
			});
			$('.tabSections').height(totHt+"px");
			$("div.tabSecBlock.fixFormHeight").height("auto");
			$("div.tabSecBlock.fixFormHeight").height(not.getMaxHt);			
		},
		getMaxHt: function(){
			var ht = 0;
			$("div.tabSecBlock.fixFormHeight").each(function(){
				ht = ($(this).height() > ht) ? $(this).height() : ht;
			});
			return ht;
		}
	},
	"menubar" :{
		"init" : function(){
			if(typeof rs != "undefined" && (rs.isSfdcError || rs.isAuthenticationError)){
				$("#header-container").css('height','62px').find('nav.clearfix').hide();
				$("#breadcrumb ul").hide();
			} else {
				menuObj = myvmware.sdp.menubar;
				//map anchor tag ids and url
				menuObj.map = {"menu_home":menu.sdpPartnerHome,"menu_rateCards":menu.rateCards,"menu_subCustomer":menu.subscriptionCustomer,
			            "menu_subOrders":menu.subscriptionOrders,"menu_defaultSettings":menu.defaultConfiguration,"menu_configuratorTool":menu.configuratorTool,"menu_allRenewals":menu.allRenewals}
				menuObj.createMenu();
				$("#header-container").css("height","").find('nav.clearfix').show();
				$("#breadcrumb ul").show();
			}
			if(typeof rs != "undefined" && typeof rs.pageTitle != "undefined") document.title = rs.pageTitle;
		},
		createMenu : function(){
			for (key in menuObj.map){
				$("#"+key).attr("href", menuObj.map[key]);
			}
		}
	},
	"proforma" : {
		"init" : function(){
			pro = myvmware.sdp.proforma;
			pro.fetchLinks();
			//Changes done for  omniture
			callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti : sdppartnerhome']});
		},
		fetchLinks: function(){
				$('a.performaIcon').live('click', function(){
				vmf.modal.show('performaInvoice',{
					checkPosition: true,
					onShow: function(dialog){
						vmf.datatable.build($('#tbl_performaInvoice'),{
							"bProcessing": true,
							"bAutoWidth": false,
							"bPaginate":false, //production issue
							"aaSorting": [[0, 'desc']],
							"sScrollY": "123px",
							"sScrollX": "auto",
							"bInfo": false,
							 "aoColumns": [
								{"sTitle": "<span class=''>"+rs.uploadDate+"</span>", "sWidth":"30px"},
								{"sTitle": "", "bVisible":false},
								{"sTitle": "<span class=''>"+rs.fileName+"</span>", "sWidth":"50px"},
								{"sTitle": "", "bVisible":false}
							], 
							"sAjaxSource": rs.url.getAllInvoiceDetails,
							"error":myvmware.sdp.cmn.dataTableError,
							"bServerSide": false,
							"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
							"errMsg":rs.Unable_to_process_your_request,
							"sDom": 'rt<"bottom"li<"clear">>',
							"fnInitComplete": function(){
								$(this).closest(".dataTables_scroll").addClass("bottomarea");
								$.modal.setPosition();
							},
							"fnDrawCallback":function(){
								pro.bindEvents();
							},
							"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
								var $nRow=$(nRow);
								$nRow.find("td:eq(1)").attr('data-type', aData[3]).attr('data-id', aData[1]).html('<a href="#" class="perFormaLink">'+aData[2]+'</a>');
								return nRow;
							}
						});
					}
				});
			});
		},
		buildLinks:function(response){
			if (typeof response != "object") response = vmf.json.txtToObj(response);
			response = vmf.getObjByIdx(response,0);
			var oLinks=$("<ul></ul>"), aLinks=[];
			if(typeof response.aaData!="undefined" && response.aaData.length){
				$.each(response.aaData,function(i,v){
					aLinks.push("<li data-id='"+response.aaData[i][0]+"' data-type='"+response.aaData[i][2]+"'><a class='perFormaLink'>"+response.aaData[i][1]+"</a></li>");
				});
				oLinks.append(aLinks.join(''));
				$("#pLinks").html(oLinks);
				pro.bindEvents();
			} else if (typeof response.aaData !="undefined" && !response.aaData.length){
				$("#pLinks").html(rs.noProFormaInvoiceMsg);
			} else if (typeof response.ERROR_MESSAGE !="undefined"){
				$("#pLinks").html(response.ERROR_MESSAGE);
			}
		},
		failedLinks: function(){},
		bindEvents : function(){
			$('#closePerforma').die('click').live('click', function(){vmf.modal.hide()});
			$('#tbl_performaInvoice tbody tr td a.perFormaLink').die('click').live('click', function(){
				var downloadUrl= $(this).closest("td").attr("data-id");
				vmf.ajax.post(rs.url.downloadeCsvBillingStatements,{"serialID":downloadUrl},function(jData){
					var jd = vmf.json.txtToObj(jData);
					if(jd != null && !jd.status) $('#performaInvoice span.error').html(jd.errorMessage).show();
					else $('#billStatement').attr('src',rs.url.downloadeCsvBillingStatements+"&serialID="+downloadUrl);
				},function(jData){
					var jd = vmf.json.txtToObj(jData);
					if(jd != null && !jd.status) $('#performaInvoice span.error').html(jd.errorMessage).show();
				});
				return false;
			});
		}
	},
	"home" : {
		init : function(){
		//Changes done for  omniture
			if(partnerType == "RESELLER") {
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller : sdppartnerhome']});
			}
			else{
				callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti : sdppartnerhome']});
			}
			myvmware.sdp.cmn.events();
		}
	},
	"renewal" :{
		"init":function(){
			rr=myvmware.sdp.renewal;
			rr.subcriptionTerm = {};
			rr.customerRenewalOption = {};
			rr.serviceStatus = {};
			rr.serviceType = {};
			rr.serviceName = {};
			rr.serviceStatusDef = '';
			rr.serviceNameDef = '';
			rr.customerRenewalOptionDef = '';
			rr.monthDayDef = '';
			rr.monthDay = {};
			rr.dt=null;
			if(partnerType=="RESELLER"){
				myvmware.common.showMessageComponent('PARTNER_RENEWAL');
				rr.loadData();
				//Changes done for  omniture 
					callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : reseller : allrenewals']});
			} else{
				myvmware.common.showMessageComponent('PARTNER_RENEWAL');
				rr.loadDistiData();
				//Changes done for  omniture 
					callBack.addsc({'f':'riaLinkmy','args':['sdpprtnr : disti : allrenewals']});				
			}
			rr.bindEvents();
			myvmware.sdp.cmn.events();
		}, //init // SDP
		loadData:function(){
			vmf.datatable.build($('#tbl_sdpResellerRenewalCard'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span></span>", "sWidth":"30px","bSortable": false},
						{"sTitle": "<span class='descending'>"+rs.alr+"</span>", "sWidth":"30px"},
						{"sTitle": "<span class='descending'>"+rs.st+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.srId+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.rem+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.cnE+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.act+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.cstN+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.cstRO+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.resCst+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.phN+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.srNm+"</span>", "sWidth":"50px"},
						{"sTitle": "<span>"+rs.mnC+"</span>", "sWidth":"50px","bSortable": false},
						{"sTitle": "", "bVisible":false}
					], 
					"sAjaxSource": rs.getRenewalsUrl, // we need to give actual url
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						rr.dt = this;
						$(this).find('span.openclose').die('click').live("click",function (){
							rr.expandRow1($(this),rr.dt);
						});
						if(!$(rr.dt).find('tfoot').length) {
							$(rr.dt).append('<tfoot><tr><td class="bottomarea" colspan="13"></td></tr></tfoot>');
						}
						$(rr.dt).next(".bottom").show();
						myvmware.sdp.cmn.buildSelectBox("#select_service_ID",rr.serviceName, rr.serviceNameDef);
						myvmware.sdp.cmn.buildSelectBox("#service_status_ID",rr.serviceStatus, rr.serviceStatusDef);
						myvmware.sdp.cmn.buildSelectBox("#customer_renewal",rr.customerRenewalOption, rr.customerRenewalOptionDef);
						myvmware.sdp.cmn.buildSelectBox("#month_date_ID",rr.monthDay, rr.monthDayDef);
						rr.serviceStatusDef = '';
						rr.serviceNameDef = '';
						rr.customerRenewalOptionDef = '';
						rr.monthDayDef = '';
						myvmware.sdp.cmn.dataTableSuccess($(rr.dt));
					},//fnInitComplete
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_sdpResellerRenewalCard_paginate").css("display", "block");
						} else {
							$("#tbl_sdpResellerRenewalCard_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_sdpResellerRenewalCard_length option:eq(0)").val(),10)){
							$("#tbl_sdpResellerRenewalCard_length").css("display", "block");
						} else {
							$("#tbl_sdpResellerRenewalCard_length").css("display", "none");
						}
						var proSettings= this.fnSettings();
						if(proSettings.jqXHR && proSettings.jqXHR.responseText!==null && proSettings.jqXHR.responseText.length && typeof proSettings.jqXHR.responseText =="string"){
							rr.processJson = vmf.getObjByIdx(vmf.json.txtToObj(proSettings.jqXHR.responseText),0);
							$.each(rr.processJson.aaData,function(i,v){
								(v[8] != '' && v[8] != null && v[8] != undefined) ? rr.customerRenewalOption[v[8]] = v[8] : '';
								(v[2] != '' && v[2] != null && v[2] != undefined) ? rr.serviceStatus[v[2]] = v[2] = v[2] : '';
								(v[11] != '' && v[11] != null && v[11] != undefined) ? rr.serviceName[v[11]] = v[11] = v[11] : '';
								(v[12] != '' && v[12] != null && v[12] != undefined) ? rr.monthDay[v[12]] = v[12] : '';
							});
						}
					},//fnDrawCallback
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow), alertClass = 'alertIcon'+aData[1];
						$nRow.find("td:eq(1)").html("<span class='titleTag "+alertClass+"' title='"+eval("rs.alert_"+aData[1])+"'></span>");
						$nRow.find("td:eq(2), td:eq(4)").addClass('alertColor'+aData[1]);
						$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
						$nRow.find("td:eq(3)").html("<a href='"+rs.serviceDetailsUrl+"&_VM_serviceID="+encodeURIComponent(aData[14])+"'>"+aData[3]+"</a>");
						$nRow.find('td:eq(7)').html("<a href="+rs.customerDetailsUrl+"?_VM_selectedAccountNumber="+aData[6]+">"+aData[7]+"</a>"); 
						$nRow.find('td:eq(9)').html("<a target='_blank' title='"+aData[13]+"' href='mailto:"+aData[13]+"'>"+aData[9]+"</a>");
						//Here changed as alert icon color applied same for text color
						return nRow;
					}
				}); // End of datatable config
				callBack.addsc({'f':'rr.showRenewalBeak','args':[]});
		},
		showRenewalBeak:function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLER_RENEWAL_ALERT"],
				beakName:"SDP_BEAK_PARTNER_RESELLER_RENEWAL_ALERT",
				beakHeading:rs.head_alert,
				beakContent:rs.desc_alert,
				target:$('#tbl_sdpResellerRenewalCard thead th:eq(1)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak5',
				isFlip:false,
				multiple:true
			});
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_RESELLER_RENEWAL_RENEW"],
				beakName:"SDP_BEAK_PARTNER_RESELLER_RENEWAL_RENEW",
				beakHeading:rs.head_renew,
				beakContent:rs.desc_renew,
				target:$('#tbl_sdpResellerRenewalCard thead th:eq(8)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#beak6',
				isFlip:false,
				multiple:true
			});
		},
		loadDistiData:function(){
			var tableStart = 0, flag = false;
			vmf.datatable.build($('#tbl_sdpDistributorRenewalCard'),{
					"bProcessing": true,
					"bAutoWidth": false,
					 "aoColumns": [
						{"sTitle": "<span></span>", "sWidth":"30px","bSortable": false},
						{"sTitle": "<span class='descending'>"+rs.alr+"</span>", "sWidth":"30px"},
						{"sTitle": "<span class='descending'>"+rs.srSt+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.srId+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.rem+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.prId+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.srE+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.reslN+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.reslRO+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.resRsl+"</span>", "sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.cstN+"</span>", "sWidth":"50px"},
						{"sTitle": "<span class='descending'>"+rs.srNm+"</span>", "sWidth":"50px"},
						{"sTitle": "<span>"+rs.mnC+"</span>", "sWidth":"50px", "bSortable": false},
						{"sTitle": "", "bVisible":false},
						{"sTitle": "", "bVisible":false}
					], 
					"sAjaxSource": rs.getRenewalUrlforDisti,// we need to give actual url
					"error":myvmware.sdp.cmn.dataTableError,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
					"iDisplayLength": 10,
					"bServerSide": false,
					"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'rt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
							rr.dt = this;
							$(this).find('span.openclose').die('click').live("click",function (){
								rr.expandRow1($(this),rr.dt);
							});
							if(!$(rr.dt).find('tfoot').length) {
								$(rr.dt).append('<tfoot><tr><td class="bottomarea" colspan="13"></td></tr></tfoot>');
							}
							$(rr.dt).next(".bottom").show();
							myvmware.sdp.cmn.buildSelectBox("#serviceStatus",rr.serviceStatus, rr.serviceStatusDef);
							myvmware.sdp.cmn.buildSelectBox("#serviceName",rr.serviceName, rr.serviceNameDef);
							myvmware.sdp.cmn.buildSelectBox("#customerRenewalOption",rr.customerRenewalOption, rr.customerRenewalOptionDef);
							rr.serviceStatusDef = '';
							rr.serviceNameDef = '';
							rr.customerRenewalOptionDef = '';
							myvmware.sdp.cmn.dataTableSuccess($(rr.dt));
					},//fnInitComplete
					"fnPreDrawCallback": function(oSettings){
						if(flag){
							oSettings._iDisplayStart = tableStart
							flag = false;
							this.fnDraw(false);
						}
					},
					"fnDrawCallback":function(){
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_sdpDistributorRenewalCard_paginate").css("display", "block");
						} else {
							$("#tbl_sdpDistributorRenewalCard_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_sdpDistributorRenewalCard_length option:eq(0)").val(),10)){
							$("#tbl_sdpDistributorRenewalCard_length").css("display", "block");
						} else {
							$("#tbl_sdpDistributorRenewalCard_length").css("display", "none");
						}

						var proSettings= this.fnSettings();
						if(proSettings.jqXHR && proSettings.jqXHR.responseText!==null && proSettings.jqXHR.responseText.length && typeof proSettings.jqXHR.responseText =="string"){
							rr.processJson = vmf.getObjByIdx(vmf.json.txtToObj(proSettings.jqXHR.responseText),0);
							$.each(rr.processJson.aaData,function(i,v){
								(v[2] != '' && v[2] != null && v[2] != undefined) ? rr.serviceStatus[v[2]] = v[2] = v[2] : '';
								(v[11] != '' && v[11] != null && v[11] != undefined) ? rr.serviceName[v[11]] = v[11] = v[11] : '';
								(v[8] != '' && v[8] != null && v[8] != undefined) ? rr.customerRenewalOption[v[8]] = v[8] : '';
							});
						}
					},//fnDrawCallback
					"fnRowCallback": function(nRow,aData,iDisplayIndex){ 
						var $nRow=$(nRow), alertClass = 'alertIcon'+aData[1];
						$nRow.find("td:eq(1)").html("<span class='titleTag "+alertClass+"' title='"+eval("rs.alert_"+aData[1])+"'></span>");
						$nRow.find("td:eq(2), td:eq(4)").addClass('alertColor'+aData[1]);
						$(nRow).find("td:eq(0)").html("<span class=\"openclose\"></span>").end().data("id",aData[2]);
						$nRow.find("td:eq(3)").html("<a href='"+rs.serviceDetailsUrl+"&_VM_serviceID="+encodeURIComponent(aData[15])+"'>"+aData[3]+"</a>");
						$nRow.find('td:eq(7)').html("<a href='"+rs.resellerDetailsUrl+"?_VM_selectedAccountNumber="+aData[6]+"&_VM_selectedAccountName="+aData[7]+"'>"+aData[7]+"</a>");
						$nRow.find('td:eq(9)').html("<a target='_blank' title='"+aData[13]+"' href='mailto:"+aData[13]+"'>"+aData[9]+"</a>");
						$nRow.find('td:eq(10)').html("<a href="+rs.customerDetailsUrl+"&_VM_selectedAccountNumber="+escape(aData[6])+"&_VM_selectedEaNumber="+escape(aData[14])+">"+aData[10]+"</a>");
						return nRow;
					}
			}); // End of datatable config
			callBack.addsc({'f':'rr.showRenewalBeakForDisti','args':[]});

			$('.sorting, .sorting_asc, .sorting_desc').live('click', function(){
				if($('#tbl_sdpDistributorRenewalCard').dataTable()){
					var table = $('#tbl_sdpDistributorRenewalCard').dataTable();
					tableStart = table.fnSettings()._iDisplayStart;
					flag = true;
				}
			});
		},
		showRenewalBeakForDisti:function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_DISTI_RENEWAL_ALERT"],
				beakName:"SDP_BEAK_PARTNER_DISTI_RENEWAL_ALERT",
				beakHeading:rs.head_alert,
				beakContent:rs.desc_alert,
				target:$('#tbl_sdpDistributorRenewalCard thead th:eq(1)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#row1',
				isFlip:false,
				multiple:true
			});
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_PARTNER_DISTI_RENEWAL_RENEW"],
				beakName:"SDP_BEAK_PARTNER_DISTI_RENEWAL_RENEW",
				beakHeading:rs.head_renew,
				beakContent:rs.desc_renew,
				target:$('#tbl_sdpDistributorRenewalCard thead th:eq(8)'),
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpptr2/index.html',
				beakLink:'#row1',
				isFlip:false,
				multiple:true
			});
		},
		bindEvents:function(){
			vmf.calendar.build($("input.txt_datepicker"), {
				dateFormat: 'yyyy-mm-dd',
				startDate: '1990-01-01',
				endDate: '2020-02-31',
				error_msg_f: rs.Enter_valid_from_date,
				error_msg_t: rs.Enter_valid_to_date
			});
		
			$('#apply_reseller').click(function(){//reload data on Apply Filter click
				$("#tbl_sdpResellerRenewalCard").next(".bottom").hide();			
				rr.serviceStatusDef = $("#service_status_ID option:selected").val();
				rr.serviceNameDef = $("#select_service_ID option:selected").val();
				rr.customerRenewalOptionDef = $("#customer_renewal option:selected").val();
				rr.monthDayDef = '';
				var reg = /(\d{4})([\/-])(0[1-9]|1[012])([\/-])(0[1-9]|[12][0-9]|3[01])$/,postData = {"accountId":$("#account_ID").val(),"customerName":$("#customer_name_reseller").val(),"serviceId":$("#service_Id_reseller").val(),"customerRenewOption":$("#customer_renewal option:selected").val(),"serviceStatus":$("#service_status_ID option:selected").val(),"serviceName":$("#select_service_ID option:selected").val(),"remainingTerm":$("#remaining_ID").val(),"serviceEndDate":$("#serviceEndDate").val(),"requestedByCustomer":$("#requestedCustomer").val()};
				if($('#serviceEndDate').val()!='' && !reg.test($('#serviceEndDate').val())){alert(rs.Enter_valid_end_date);$('#serviceEndDate').val('');}
				else{vmf.datatable.reload($('#tbl_sdpResellerRenewalCard'),rs.getRenewalReloadUrl,myvmware.sdp.cmn.exportFile('a.tbl_sdpResellerRenewalCard', postData),"POST",postData);}
				
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : reseller : allrenewals : filter');
				return false;
			});
			$('#reset_reseller').click(function(){
				$(this).closest('.filter-content').find('input').val('');
				$(this).closest('.filter-content').find('select').val('');
				vmf.datatable.reload($('#tbl_sdpResellerRenewalCard'),rs.getRenewalsUrl,null,"POST",'');
				myvmware.sdp.cmn.exportFile('a.tbl_sdpResellerRenewalCard', '')
			});
			
			$('#apply_disti').click(function(){//reload data on Apply Filter click
				$('#tbl_sdpDistributorRenewalCard').next(".bottom").hide();
				rr.serviceStatusDef = $("#serviceStatus option:selected").val();
				rr.serviceNameDef = $("#serviceName option:selected").val();
				rr.customerRenewalOptionDef = $("#customerRenewalOption option:selected").val();
				var reg = /(\d{4})([\/-])(0[1-9]|1[012])([\/-])(0[1-9]|[12][0-9]|3[01])$/,postData = {"serviceStatus":$("#serviceStatus option:selected").val(),"serviceId":$("#serviceId").val(),"remainingTerm":$("#renainingTerm").val(),"serviceEndDate":$('#serviceEndDate').val(),"partnerId":$("#parnerId").val(),"resellerName":$("#resellerName").val(),"resellerRenewOption":$("#customerRenewalOption option:selected").val(),"serviceName":$("#serviceName option:selected").val(),"requestedByCustomer":$("#requestedCustomer").val()};
				if($('#serviceEndDate').val()!='' && !reg.test($('#serviceEndDate').val())){alert('Please enter a valid end date');$('#serviceEndDate').val('');}
				else{vmf.datatable.reload($('#tbl_sdpDistributorRenewalCard'),rs.getRenewalReloadUrl,myvmware.sdp.cmn.exportFile('a.tbl_sdpDistributorRenewalCard', postData),"POST",postData);}
				//Changes done for  omniture
				if(typeof riaLinkmy !="undefined") riaLinkmy('sdpprtnr : disti : allrenewals : filter');
				return false;
			});
			$('#reset_disti').click(function(){
				$(this).closest('.filter-content').find('input').val('');
				$(this).closest('.filter-content').find('select').val('');
				vmf.datatable.reload($('#tbl_sdpDistributorRenewalCard'),rs.getRenewalUrlforDisti,null,"POST",'');
				myvmware.sdp.cmn.exportFile('a.tbl_sdpDistributorRenewalCard', '')
			});
		},
		expandRow1 :function(o,t){
			nTr1 = o[0].parentNode.parentNode;
			if (o.hasClass('minus')){
				o.removeClass('minus');
				$(nTr1).removeClass("expanded noborder").find('a.viewTokens').removeClass('open').end().next("tr").hide();
			}else{
				o.addClass('minus');
				$(nTr1).addClass("expanded noborder").find('a.viewTokens').addClass('open');
				if(!nTr1.haveData){
					t.fnOpen(nTr1,'','');
					rr.getCdata1($(nTr1), nTr1.idx);
					nTr1.haveData = true;
					$(nTr1).next("tr").addClass('more-detail');
				}else{
					$(nTr1).next("tr").show();	
				 }
			}
		},
		showloading :function(){return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";},
		tempIdx:0,
		getCdata1:function(rowObj, idx){
			var sOut = [];
			if(!idx){idx= this.tempIdx++};
			sOut.push('<table class="file_details_tbl" id="'+ ("child-table1-" + idx ) + '"></table>');
			$(nTr1).next("tr").addClass('more-detail').find("td").html(sOut.join(''));
			var $subTable = $("#child-table1-" + idx);
			vmf.datatable.build($subTable,{
				"aoColumns": [
					{"sTitle": "<span>"+rs.sku+"</span>","sWidth":"195px","bSortable":false},
					{"sTitle": "<span>"+rs.comp+"</span>","sWidth":"250px","bSortable":false},
					{"sTitle": "<span>"+rs.quan+"</span>","sWidth":"100px","bSortable":false},
					{"sTitle": "<span>"+rs.monRem+"</span>","sWidth":"100px","bSortable":false}
				],
				"sAjaxSource":rs.getRenewalChildUrl+"&_VM_serviceID="+rowObj.find("td:eq(3)").text()+"&_VM_selectedAccountNumber="+rowObj.find("td:eq(6)").text(),
				"oLanguage": myvmware.sdp.cmn.datatableLanguage(),
				"errMsg":rs.Unable_to_process_your_request,
				"error":myvmware.sdp.cmn.dataTableError,
				"bInfo":false,
				"bServerSide": false,   
				"bFilter":false,
				"bPaginate": false,
				"bAutoWidth": false,
				"sPaginationType": "full_numbers",
				"fnInitComplete":function(){
					var dtd=this;
				}
			}) //buld  subtable 
		}
	}
}
