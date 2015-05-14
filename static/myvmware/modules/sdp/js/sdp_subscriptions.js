//Nov Release
if (typeof(myvmware) == "undefined")  myvmware = {};
sdpSub={};
VMFModuleLoader.loadModule("modal", function(){});
vmf.scEvent = true;
myvmware.sdpSub = {
	init:function(){
		var dtd = null;
		var nTr = null;
		sdpSub = myvmware.sdpSub;
		sdpSub.loadAd();
		sdpSub.statusArr={"":rs.Show_All};
		sdpSub.statusArrDefault="";
		sdpSub.subscriptionJson=[];
		sdpSub.sType={"":rs.Show_All};
		sdpSub.sTypeDefault="";
		sdpSub.bindEvents();
		sdpSub.loadData(); // load data
		myvmware.sdpSub.cmn.init();
		sdp.eaSelector.impl={
			beforeEaSelectorChange:function(){
			},
			afterEaSelectorChange_success:function(){
				$("#tbl_subscriptions").next(".bottom").hide();
				vmf.datatable.reload($('#tbl_subscriptions'),sdpMySubscriptionsUrl,function(){},"POST","");
				$(".filter-content-wrapper").find('input, select').val('');
					sdpSub.exportLink('a.tbl_subscriptions', '');
			},
			afterEaSelectorChange_error:function(){
			}
		};
		callBack.addsc({'f':'riaLinkmy','args':['subscription-services']});
	},
	cmn:{
		init:function(){
			cur = myvmware.sdpSub.cmn;
			cur.bindEvents();
		},
		currency:{
			"FLAG": '',
			"USD": "$",
			"AUD": "$",
			"EUR": "€",
			"INR": "Rs"
		},
		currencyType:function(type, tblId, row){
			cur.currency["FLAG"] = (typeof(type) == 'undefined') ? "USD" : type;
			$(row).find('td').each(function(){
				if($(this).find('span.total').length){
					$(this).find('span.total').each(function(){
						$(this).before(cur.currency[cur.currency["FLAG"]]);
					});
				}
				if($(this).find('div.bRate').length){
					$(this).find('div.bRate').each(function(){
						$(this).prepend(cur.currency[cur.currency["FLAG"]]);
					});
				}
			});
		},
		addComa:function(string){
			var str = string.toString();
			var pattern = /(-?\d+)(\d{3})/;
			if(str.length >= 7){
				while(pattern.test(str))
					str = str.replace(pattern, "$1,$2");
					return str;
			} else {
				return str;
			}
		},
		adjustHeight:function(mTd,ttd){
			var tItems = $(ttd).find('div'), mItems = $(mTd).find('div'), hts = [];
			if(mItems.length == tItems.length) {
				$.each(mItems,function(i,k){
					($(tItems[i]).height() < $(k).height()) ? ($(tItems[i]).height($(k).height())) : ($(k).height($(tItems[i]).height()));
				});
			}
		},
		bindEvents: function(){
			$("a.exportCus,a.exportCus_1").live("click",function(e){
				e.preventDefault();
				var that=this;
				if (!$("#exportFrame").length)
					$('<iframe id="exportFrame" name="exportFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
				$("#exportFrame").attr("src",$(that).attr("href"));
				if (typeof $(this).attr("data-track")!="undefined" && typeof riaLinkmy!="undefined"){
					riaLinkmy($(that).attr("data-track"));
				}
			});
		},
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
		}
	},
    //Bind Events
	bindEvents:function(){
		 sdpSub.populateList( $('#list_serviceType'),serviceTypeUrl);
		 sdpSub.populateList( $('#list_status'),statusUrl);
		 $('#btn_ApplyFilter').click(function(){//reload data on Apply Filter click
				$(this).attr("disabled","disabled");
				$("#tbl_subscriptions").next(".bottom").hide();
				if(typeof riaLinkmy !="undefined") riaLinkmy('subscription-services : filter');
	 		    var _postData = new Object(); 
	 		         _postData['txt_custname'] = $("#txt_custname").val();
	                 	 _postData['serviceType'] =  $("#list_serviceType").val();
	                 	_postData['status'] = $("#list_status").val();
				sdpSub.sTypeDefault= $("#list_serviceType").val();
				sdpSub.statusArrDefault = $("#list_status").val();
	 			vmf.datatable.reload($('#tbl_subscriptions'),filteringValuesUrl,sdpSub.exportLink('a.tbl_subscriptions', _postData),"POST",_postData);
		});
		$('#resetFilter').click(function(){
			$(this).attr("disabled","disabled");
			$("#tbl_subscriptions").next(".bottom").hide();
			sdpSub.statusArrDefault="";
			sdpSub.sTypeDefault="";
			vmf.datatable.reload($('#tbl_subscriptions'),sdpMySubscriptionsUrl,sdpSub.resetFilters,"","");
			sdpSub.exportLink('a.tbl_subscriptions', '');
		});
		$(".fn_cancel").bind("click",function(){vmf.modal.hide()});
		$(".AllSerNoPermissions",'#tbl_subscriptions').live("click",function(e){
			e.preventDefault();
			var serviceIdUrl = $(this).attr('data-export');
			$('#exportrBtnAllser').data('rowServiceId',serviceIdUrl);
			vmf.modal.show("availableAddonConfirmationAllser");
		});
		$('#exportrBtnAllser').bind("click",function(){
			var $ServiceId = $.trim($('#exportrBtnAllser').data('rowServiceId'));
			window.location.href=rs.addonExportURL+'&_VM_serviceInstanceIdForAddons='+$ServiceId+'&_VM_nfrInstance=false&_VM_internalInstance=false'
			vmf.modal.hide();
		});
		/*Tooltips Changes*/
			callBack.addsc({'f':'myvmware.common.showMessageComponent','args':['SUBSCRIPTIONS']});
		/*End of Tooltips Changes*/
	},
	exportLink:function(link, param) {
		var elem = $(link), url = elem.attr('data-url'), parameter = '';
		if(typeof(param) == 'object'){
			for(key in param){
				parameter += '&'+key+'='+param[key];
			}
		}
		elem.attr('href', url+parameter);
	},
	buildSelectBox:function(id,obj,def,flg){// Make it common function
		var option=[];
		if(!flg) option.push("<option value='' selected='selected'>" + rs.Select_One + "</option>");
		for (key in obj){
			if (def && def==key)
				option.push("<option value='"+key+"' selected='selected'>"+obj[key]+"</option>");
			else 
				option.push("<option value='"+key+"'>"+obj[key]+"</option>");
		}
		$(id).html(option.join(""));
	},
	resetFilters:function(){
		$('#txt_custname').val('');
		$('#list_serviceType').val('');
		$('#list_status').val('');
	},
	dataTableSuccess:function(table){
		var exportLink = '.'+table.attr('id');
		if((table.find('tbody tr td').length != 1) && (rs.adBannerFlag == 'Y')){
			$(exportLink).parent().css("margin-top", "-40px");
			$(exportLink).attr('data-list', 'true').show();
			$(window).resize();
		} else if ((table.find('tbody tr td').length != 1) && (rs.adBannerFlag == 'N' || rs.adBannerFlag == undefined)) {
			$(exportLink).parent().css("margin-top", "0");
			$(exportLink).attr('data-list', 'true').show();
		} else {
			$(exportLink).attr('data-list', 'true').hide();
		} 
	},
	dataTableError:function(table,json){
		var err_msg = (json.ERROR_MESSAGE) ? json.ERROR_MESSAGE : rs.Unable_to_process_your_request
		var emptyRow =table.find("tbody tr td.dataTables_empty"), exportLink = '.'+table.attr('id');
		$(exportLink).parent().css("margin-top", "0");
		$(exportLink).attr('data-list', 'false').hide();
		if(emptyRow.length) emptyRow.html(err_msg).closest("tr").show();
		else {
			$("<tr><td colspan="+table.fnSettings().aoColumns.length+" class=\"dataTables_empty\">"+err_msg+"</td></tr>").appendTo(table.find("tbody")).show();
		}
	},
	showErrorModal: function(msg){
		vmf.modal.show("errorModal",{
			onShow : function(){
				$("#errorModal #msg").html(msg);
			}
		});
	},
	showTooltips:function(){
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_SERVICE_ALERT"],
			beakName:"SDP_BEAK_SUBSCRIPTION_SERVICE_ALERT",
			beakHeading:rs.head_status,
			beakContent:rs.desc_status,
			target:$("#tbl_subscriptions thead th:eq(1)"),
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
			beakLink:'#beak2',
			center:true,
			//isFlip:true,
			multiple:true
		});
		/*
		myvmware.common.setBeakPosition({
			beakId:myvmware.common.beaksObj["SDP_BEAK_SUBSCRIPTION_SERVICE_EXPORT"],
			beakName:"SDP_BEAK_SUBSCRIPTION_SERVICE_EXPORT",
			beakHeading:rs.head_export,
			beakContent:rs.desc_export,
			target:$(".exportCus"),
			beakLink:'#beak3',
			beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust2/index.html',
			center:false,
			isFlip:true,
			multiple:true
		});
		*/
	},
	addMessage: function (){
		$('#tbl_subscriptions tbody tr').each(function() {
			var row = $(this),
				flag = $(row).data('flag') || "",
				formId = $(row).data('formid') || "",
				date = $(row).data('date'), 
				id = $(row).data('id'),
				name = $(row).data('name'),
				type = $(row).data('type');
				if(formId == 1){
					if(typeof flag != 'undefined' && flag.length != 0 && flag != "0"){
						if(flag != "1"){
							var	href = rs.daasWorksheetURL,
		/*					+ '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_serviceInstanceName='+encodeURIComponent(name)+'&_VM_serviceInstanceType='+encodeURIComponent(type)+'&_VM_daasEndDate='+encodeURIComponent(date),*/
								link = '<a href="'+href+'">'+rs.daasLinkText+'</a>',
								$td = $("<td/>").css('padding-top', '0px').attr("colspan", "11").html(link),
								$tr = $("<tr/>").html($td);
							$(row).find('td').attr('style', 'background:none !important');
							$(row).after($tr);
						} else {
							var $p = '<p>'+rs.daasSuccessMsg+'</p>',
								$title = '<div class="alertTitle" >'+$p+'</div>',
								$con = '<div class="confirmMsg" style="padding:7px 2px 7px 5px;">'+$title+'</div>',
								$div = '<div class="autoClose infoIcon services alert-box-wrapper" style="margin-bottom:0px;"><a class="autoCloseBtn"></a>'+$con+'</div>',
								$td = $('<td/>').attr('style', 'background:none !important').css('padding-top','0px').attr('colspan', '11').html($div),
								$tr = $('<tr/>').html($td),
								href = rs.daasWorksheetURL,
								/*+ '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_serviceInstanceName='+encodeURIComponent(name)+'&_VM_serviceInstanceType='+encodeURIComponent(type)+'&_VM_daasEndDate='+encodeURIComponent(date),*/
								link = '<a href="'+href+'">'+rs.daasLinkText+'</a>',
								$td1 = $("<td/>").css('padding-top', '0px').attr("colspan", "11").html(link),
								$tr1 = $("<tr/>").html($td1);
							$(row).find('td').attr('style', 'background:none !important');
							$(row).after($tr1);
							$(row).after($tr);
							$('a.autoCloseBtn').live('click', function(){
								$(this).closest('div.autoClose').remove();
							});
						}
					} else if (typeof flag != 'undefined' && flag.length != 0 && flag == "0"){
						var $div = $('<div/>').addClass('autoClose info').html('<p><span class="strong">'+rs.daasActionRequired+ '</span> ' + rs.daasComplete + ' <a href="#">'+rs.daasAchnorText+'</a> '+rs.daasBy+' '+ date +'</p>'),
							$td = $('<td/>').css('padding-top', '0px').attr('colspan', '11').html($div),
							$tr = $('<tr/>').html($td),
							href = rs.daasWorksheetURL /*+ '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_serviceInstanceName='+encodeURIComponent(name)+'&_VM_serviceInstanceType='+encodeURIComponent(type)+'&_VM_daasEndDate='+encodeURIComponent(date);*/
							$div.find('a').attr('href', href);
						$(row).find('td').attr('style', 'background:none !important');
						$(row).after($tr);

					}
				} else if (formId !="" && formId != 1 && flag.length != 0 ){
						if (flag == "0"){
							var $div = $('<div/>').addClass('autoClose info').html('<p>'+rs.genericCompleteWorksheet+'</p>'),
								$td = $('<td/>').css('padding-top', '0px').attr('colspan', '11').html($div),
								$tr = $('<tr/>').html($td),
								href = rs.genericWorksheetUrl + '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_formId='+encodeURIComponent(formId);
								$div.find('a').attr('href', href);
							$(row).find('td').attr('style', 'background:none !important');
							$(row).after($tr);

						} else if(flag != "1"){
							var	href = rs.genericWorksheetUrl + '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_formId='+encodeURIComponent(formId),
		
								link = '<a href="'+href+'">'+rs.genericLinkText+'</a>',
								$td = $("<td/>").css('padding-top', '0px').attr("colspan", "11").html(link),
								$tr = $("<tr/>").html($td);
							$(row).find('td').attr('style', 'background:none !important');
							$(row).after($tr);
						} else {
							var $p = '<p>'+rs.genericSuccessMsg+'</p>',
								$title = '<div class="alertTitle" >'+$p+'</div>',
								$con = '<div class="confirmMsg" style="padding:7px 2px 7px 5px;">'+$title+'</div>',
								$div = '<div class="autoClose infoIcon services alert-box-wrapper" style="margin-bottom:0px;"><a class="autoCloseBtn"></a>'+$con+'</div>',
								$td = $('<td/>').attr('style', 'background:none !important').css('padding-top','0px').attr('colspan', '11').html($div),
								$tr = $('<tr/>').html($td),
								href = rs.genericWorksheetUrl + '?_VM_serviceInstanceId='+encodeURIComponent(id)+'&_VM_formId='+encodeURIComponent(formId),								
								link = '<a href="'+href+'">'+rs.genericLinkText+'</a>',
								$td1 = $("<td/>").css('padding-top', '0px').attr("colspan", "11").html(link),
								$tr1 = $("<tr/>").html($td1);
							$(row).find('td').attr('style', 'background:none !important');
							$(row).after($tr1);
							$(row).after($tr);
							$('a.autoCloseBtn').live('click', function(){
								$(this).closest('div.autoClose').remove();
							});
						}
					} 
				
		});
	},
	
	loadAd: function(){
		if(rs.adBannerFlag == 'Y'){
			$('#promoAdd').html(rs.adBanner);
		}else{
			$("#tabbed_box_1 .clearfix.right").css("margin-top", "0px");
		}
	},
	
	loadData:function(){
		vmf.datatable.build($('#tbl_subscriptions'),{
					"bProcessing": true,
					"bAutoWidth": false,
					"bFilter":false,
					"bPaginate": true,
					"sPaginationType": "full_numbers",
					"aLengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
					"iDisplayLength": 10,
					"sDom": 'zrt<"bottom"lpi<"clear">>',
					 "aoColumns": [
						{"sTitle": "<span class='descending'>"+rs.service+"</span>", "sWidth":"85"},
						{"sTitle": "<span class='descending'>"+rs.serviceStatus+"</span>","sWidth":"108px"},
						{"sTitle": "<span class='descending'>"+rs.sName+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='descending'>"+rs.sType+"</span>", "sWidth":"140px"},
						{"sTitle": "<span class='descending'>"+rs.region+"</span>", "sWidth":"100px"},
						{"sTitle": "<span class='descending'>"+rs.remainingTerm+"</span>", "sWidth":"120px"},
						{"sTitle": "<span class='descending'>"+rs.startDate+"</span>","sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.endDate+"</span>","sWidth":"70px"},
						{"sTitle": "<span class='descending'>"+rs.renewalType+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='descending'>"+rs.provider+"</span>", "sWidth":"100px"},
						{"sTitle": "","bVisible":false},
						{"sTitle": "","bVisible":false},
						{"sTitle": "","bVisible":false},
						{"sTitle": "","bVisible":false},
						{"sTitle": "<span class='descending'>"+rs.actions+"</span>", "sWidth":"100px"}
					], 
					"sAjaxSource": sdpMySubscriptionsUrl,
					"aaSorting": [],
					"error":myvmware.sdpSub.dataTableError,
					"bServerSide": false,
					"oLanguage": myvmware.sdpSub.cmn.datatableLanguage(),
					"errMsg":rs.Unable_to_process_your_request,
					"sDom": 'zrt<"bottom"lpi<"clear">>',
					"fnInitComplete": function(){
						dtd = this;
						var settings= this.fnSettings();
						if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
						    var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText),
								purchaseFlag=jsonResp.SubscriptionSummary.purchaseAddonFlag;
							if(purchaseFlag =="false"){
								dtd.fnSetColumnVis(14,false);
							}
						}
						if(!$(dtd).find('tfoot').length)
						$(dtd).append('<tfoot><tr><td class="bottomarea" colspan="11"></td></tr></tfoot>');
						$("#tbl_subscriptions").next(".bottom").show();
						sdpSub.buildSelectBox("#list_status",sdpSub.statusArr,sdpSub.statusArrDefault,true);
						sdpSub.buildSelectBox("#list_serviceType",sdpSub.sType,sdpSub.sTypeDefault,true);
						sdpSub.sType={"":rs.Show_All};
						sdpSub.statusArr={"":rs.Show_All};
						sdpSub.sTypeDefault='';
						sdpSub.statusArrDefault='';
						$("#btn_ApplyFilter,#resetFilter").removeAttr("disabled");
						myvmware.sdpSub.dataTableSuccess($(dtd));
					},
					"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
						var $nRow=$(nRow),
						className = 'alertColor'+aData[13], icon = 'alertIcon'+aData[13],
						titleText = (eval("rs.alert_"+aData[13]) == undefined) ? '' : eval("rs.alert_"+aData[13]);
						$nRow.find("td:eq(1)").html("<span class='"+icon+" alertTxtSpace' title='"+titleText+"' style='float:left'></span><label class='alertStatusTxt'>"+aData[1]+"</label>").end().data("flag", aData[15]).data("id", aData[10]).data("date", aData[16]).data("name", aData[11]).data("type", aData[3]).data("formid", aData[19]);
						var serviceStatus = aData[1];
						if(serviceStatus.toUpperCase() == rs.cancelledText.toUpperCase() || serviceStatus.toUpperCase() == rs.suspendText.toUpperCase() || serviceStatus.toUpperCase() == rs.terminatedText.toUpperCase()){
							$nRow.css('color','#CCC');
						}else{
							$nRow.find('td:eq(1),td:eq(5)').addClass(className);					
							//$nRow.find('td:eq(5)').addClass(className);
						}

						if(serviceStatus.toUpperCase() == rs.activeText.toUpperCase()) {
			            	var detailsUrl = '<a href="'+viewDetailsUrl+'&_VM_serviceInstanceId='+encodeURIComponent(aData[10])+'&_VM_serviceInstanceName='+encodeURIComponent(aData[11])+'&_VM_subscriptionType='+aData[3]+'&_VM_instanceModel='+encodeURIComponent(aData[14])+'&_VM_daasFlag='+encodeURIComponent(aData[15])+'&_VM_daasDate='+encodeURIComponent(aData[16])+'">'+aData[2]+'</a>';
			            	$nRow.find("td:eq(2)").html(detailsUrl).end();
			            }
					
						if(aData[13].toUpperCase() == ''){
							$nRow.find('td:eq(1), td:eq(5)').addClass('noStatus');
							//$nRow.find('td:eq(5)').addClass('noStatus');
						}
						if(aData[12].toUpperCase() == 'Y'){
							$nRow.find('td:eq(0)').html(aData[0] + '<span class="badge ela" title=' + rs.Not_for_Resale + '">' + rs.NFR + '</span>');
						}
						if(aData[17] == '1'){
							if (aData[20]=='1') {
								$nRow.find('td:eq(10)').html('<a href="'+rs.purchaseAddOnUrl+'&_VM_serviceID='+encodeURIComponent(aData[10])+'&_VM_tokenFlag='+encodeURIComponent(aData[18])+'#/addOnService/configureAddons">'+rs.purchaseAddOnText+'</a>');
							}else{
								$nRow.find('td:eq(10)').html('<a href="" data-export="'+encodeURIComponent(aData[10])+'"class="AllSerNoPermissions">'+rs.purchaseAddOnText+'</a>');
							}
						}else{
							$nRow.find('td:eq(10)').html('');
						}
			            return nRow;
			        },
					"fnDrawCallback":function(){
						rs.daasWorksheet = '<span class="strong">' + rs.Action_Required + ':</span> ' + rs.Complete_the + '<a href="/group/vmware/daas-worksheet">' + rs.Deployment_Worksheet + '</a>';
						if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
							$("#tbl_subscriptions_paginate").css("display", "block");
						} else {
							$("#tbl_subscriptions_paginate").css("display", "none");
						}
						if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_subscriptions_length option:eq(0)").val(),10)){
							$("#tbl_subscriptions_length").css("display", "block");
						} else {
							$("#tbl_subscriptions_length").css("display", "none");
						}
						var set= this.fnSettings();
						//Creating status dropdown inside fnrowCallaback will not work due to client side pagination. We have to get status and type in another object if it is serverside
						if(set.jqXHR && set.jqXHR.responseText!==null && set.jqXHR.responseText.length && typeof set.jqXHR.responseText =="string"){
							sdpSub.subscriptionJson = vmf.getObjByIdx(vmf.json.txtToObj(set.jqXHR.responseText),0);
							var data = sdpSub.subscriptionJson.aaData;
							//var data = sdpSub.subscriptionJson;
							$.each(data,function(i,v){
								sdpSub.sType[v[3]]=v[3];
								sdpSub.statusArr[v[1]]=v[1];
							});
						}
						sdpSub.addMessage();
						callBack.addsc({'f':'sdpSub.showTooltips','args':[]});
					}
		}); // End of datatable config
	},
	
	populateList:function(obj,url,chObj){
		vmf.ajax.post(url,'',function(data){
			if(chObj)	chObj.attr('options').length=0;
			obj= obj.attr('options');
			obj.length = 1;
			obj[0] = new Option(rs.Show_All, rs.Show_All);
			var list = vmf.json.txtToObj(data);
			$.each(list.list, function(val, text) {
				obj[obj.length] = new Option(text, val);
			});
		});
	},	
	"billingDetails":{
		"init":function(){
			bd=myvmware.sdpSub.billingDetails;
			bd.billingJson=null;
			bd.durationDef="";
			bd.loadData();
			bd.bindEvents();
			myvmware.sdpSub.cmn.init();
			sdp.eaSelector.impl={
				beforeEaSelectorChange:function(){
				},
				afterEaSelectorChange_success:function(){
					$("#tbl_billingdetails").next(".bottom").hide();
					vmf.datatable.reload($('#tbl_billingdetails'),rs.billingDetailsUrl,function(){},"POST","");
					$(".filter-content-wrapper").find('input, select').val('');
					myvmware.sdpSub.exportLink(false);
				},
				afterEaSelectorChange_error:function(){
				}
			};
			callBack.addsc({'f':'riaLinkmy','args':['billing-statements']});
		},
		loadData:function(){
			vmf.datatable.build($('#tbl_billingdetails'),{
						"bProcessing": true,
						"bAutoWidth": false,
						"bFilter":false,
						 "aoColumns": [							
							{"sTitle": "<span class='descending'>"+rs.service+"</span>", "sWidth":"60px"},
							{"sTitle": "<span class='descending'>"+rs.sName+"</span>", "sWidth":"150px"},
							{"sTitle": "<span class='descending'>"+rs.sType+"</span>", "sWidth":"320px"},
							{"sTitle": "<span class='descending'>"+rs.cStatement+"</span>", "sWidth":"100px"},
							{"sTitle": "<span class='descending'>"+rs.ytdTotal+"</span>", "sWidth":"100px"},
							{"sTitle": "<span class='descending'></span>", "sWidth":"100px"},							
							{"sTitle": "", "bVisible":false}, 
							{"sTitle": "", "bVisible":false}
						], 
						"sAjaxSource": rs.billingDetailsUrl,
						"error":myvmware.sdpSub.dataTableError,
						"sPaginationType": "full_numbers",
						"aaSorting": [[1,'desc']],
						"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
						"iDisplayLength": 5,
						"bServerSide": false,
						"oLanguage": myvmware.sdpSub.cmn.datatableLanguage(),
						"errMsg":rs.Unable_to_process_your_request,
						"sDom": 'zrt<"bottom"lpi<"clear">>',
						"fnInitComplete": function(){
							var dt = this;
							if(!$(dt).find('tfoot').length)
								$(dt).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
							settings= this.fnSettings();
							if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
								bd.billingJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
							}
							
							myvmware.sdpSub.buildSelectBox("#duration",bd.billingJson.durations,bd.durationDef,true);
							bd.durationDef= '';
							$(dt).next(".bottom").show();
							$('#btn_ApplyFilter,#resetFilter').removeAttr("disabled");
							myvmware.sdpSub.dataTableSuccess($(dt));
						},
						"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
							$(nRow).find("td:eq(0)").end().data("id",aData[1]);							
							/* For Pay As You Go*/
							var tempArr = [],tempArr2 = [], tempArr3 = [] ,labelArr = [], _labelArr = '', statementArr = [], _StatementArr='';
								tempArr2 = aData[3];
								tempArr = aData[10];
								tempArr3 = aData[11];
								$.each(aData[3],function(i,k){
								   if(tempArr[i] != ''){											
										labelArr.push("<p><a href='"+tempArr[i]+"' target='_blank' ><span class='fLeft'>"+tempArr2[i]+"</span><span class='pdfIcon'></span></a></p>");
									}
									else{
										if(tempArr3[i]!=''){
											labelArr.push("<p><a href='"+rs.statementUrl+"&_VM_billingStatement="+encodeURIComponent(tempArr3[i])+"' class='downloadStatement' ><span class='fLeft'>"+tempArr2[i]+"</span><span class='pdfIcon'></span></a></p>");											
										}
										else{
											labelArr.push("<p><span class='fLeft'>"+tempArr2[i]+"</span><span class='pdfIcon'></span></p>");
										}									
									}
									statementArr.push("<p><a href='"+rs.viewBillingDetails+"&_VM_serviceID="+encodeURIComponent(aData[5])+"&_VM_serviceName="+encodeURIComponent(aData[6])+"&_VM_billingPeriod="+encodeURIComponent(aData[8])+"' >"+rs.viewstatements+"</a></p>");
									
								});
								_labelArr = labelArr.join('');
								_StatementArr = statementArr.join('');						
							/* For Pay As You Go*/
							
							if (aData[3].length>0 && aData[6].length>0){								
							    if(aData[9]==rs.subscriptionBillingType){
									if(aData[10] != ''){
										$(nRow).find("td:eq(3)").html("<a href='"+rs.statementUrl+"&_VM_billingStatement="+encodeURIComponent(aData[10])+"' class='downloadStatement' ><span class='fLeft'>"+aData[3]+"</span><span class='pdfIcon'></span></a>");	
									} else {
										$(nRow).find("td:eq(3)").html("<span class='fLeft'>"+aData[3]+"</span><span class='pdfIcon'></span>");
										
									}
									$(nRow).find("td:eq(5)").html("<a href='"+rs.viewBillingDetails+"&_VM_serviceID="+encodeURIComponent(aData[5])+"&_VM_serviceName="+encodeURIComponent(aData[6])+"&_VM_billingPeriod="+encodeURIComponent(aData[8])+"' >"+rs.viewstatements+"</a>");
								}
								else{
									$(nRow).find("td:eq(3)").html(_labelArr);
									$(nRow).find("td:eq(5)").html(_StatementArr);									
								}							
							}
								
							$(nRow)[0].idx = iDisplayIndex;
							return nRow;
						},
						"fnDrawCallback":function(){
							if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
								$("#tbl_billingdetails_paginate").css("display", "block");
							} else {
								$("#tbl_billingdetails_paginate").css("display", "none");
							}
							if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_billingdetails_length option:eq(0)").val(),10)){
								$("#tbl_billingdetails_length").css("display", "block");
							} else {
								$("#tbl_billingdetails_length").css("display", "none");
							}							
						}
			}); // End of datatable config
		},
		//Bind Events
		bindEvents:function(){
			$('#btn_ApplyFilter').click(function(){//reload data on Apply Filter click
						$(this).attr("disabled","disabled");
						bd.durationDef = $("#duration").val();
						var _postData = {"txt_serviceInstanceName":$.trim($("#txt_serviceInstanceName").val()),"duration":$("#duration").val()}
						vmf.datatable.reload($('#tbl_billingdetails'),rs.filteringValuesUrl,myvmware.sdpSub.exportLink('a.tbl_billingdetails', _postData),"POST",_postData);
						if(typeof riaLinkmy !="undefined") riaLinkmy("billing-statements : filter");
			});
			$('#resetFilter').click(function(){
					$(this).attr("disabled","disabled");
					bd.durationDef = "";
					$(".filter-section input, filter-section select").val("");
					vmf.datatable.reload($('#tbl_billingdetails'),rs.billingDetailsUrl,bd.resetFilters,"","");
					myvmware.sdpSub.exportLink('a.tbl_billingdetails', '');
			});
			$("a.downloadStatement").live("click",function(e){
				e.preventDefault();
				var that=this;
				if (!$("#statementFrame").length)
					$('<iframe id="statementFrame" name="statementFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
				$("#statementFrame").attr("src",$(that).attr("href"));				
			});
			$(".fn_cancel").bind("click",function(){vmf.modal.hide()});
		},
		resetFilters:function(){
			$('#txt_custname, #duration').val('');
		},		
		showloading :function(){
			return sOut="<div class='loadWraper' style='text-align:center; padding-left:40%'><div class='loading_big'>" + rs.Loading + "</div></div>";
		}
	},
	"billingStatementDetails":{
		"init":function(){
			bsd=myvmware.sdpSub.billingStatementDetails;					
			bsd.loadData();
			bsd.loadFilterYears();
			bsd.bindEvents();			
			callBack.addsc({'f':'myvmware.common.showMessageComponent','args':['PRAXIS_BILLING_DETAILS']});
			myvmware.common.addBreadScrumbDetails();						
			callBack.addsc({'f':'riaLinkmy','args':['billing-statement-details']});
		},
		loadData:function(){
			var tempArray = rs.filterYears.split(',');			
			vmf.datatable.build($('#tbl_billingStatementDetails'),{
						"bProcessing": true,
						"bAutoWidth": false,
						"bFilter":false,
						"aoColumns": [							
							{"sTitle": "<span class='descending'>"+rs.statement+"</span>", "sWidth":"60px","bVisible":true},						
							{"sTitle": "<span class='descending'>"+rs.vmd+"</span>", "sWidth":"150px","bVisible":(rs.currentBillingType==rs.subscriptionBillingType)?false:true},
							{"sTitle": "<span class='descending'>"+rs.billingAmount+"</span>", "sWidth":"320px","bVisible":true},
							{"sTitle": "<span class='descending'>"+rs.paymentMethod+"</span>", "sWidth":"100px","bVisible":(rs.currentBillingType==rs.subscriptionBillingType)?false:true},
							{"sTitle": "", "bVisible":false}							
						], 
						"sAjaxSource": rs.billingStatementDetailsUrl+"&_VM_billingYear="+tempArray[0],
						"error":myvmware.sdpSub.dataTableError,
						"sPaginationType": "full_numbers",
						"aaSorting": [[1,'desc']],
						"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
						"iDisplayLength": 5,
						"bServerSide": false,
						"oLanguage": myvmware.sdpSub.cmn.datatableLanguage(),
						"errMsg":rs.Unable_to_process_your_request,
						"sDom": 'zrt<"bottom"lpi<"clear">>',	
						"fnInitComplete": function(){
							var dt = this;
							if(!$(dt).find('tfoot').length)
								$(dt).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
							if(dt.fnSettings().fnRecordsDisplay()>0) bsd.showDownloadBeak();
						},
						"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
						if(aData[4]!=''){
							if(rs.currentBillingType==rs.subscriptionBillingType){
								$(nRow).find("td:eq(0)").html("<a href='"+rs.billingStatementPDFUrl
	+"&_VM_billingStatement="+encodeURIComponent(aData[4])+"' class='downloadDetailStatement'><span class='fLeft'>"+aData[0]+"</span><span class='pdfIcon'></span></a>");
							}
							else {
								$(nRow).find("td:eq(0)").html("<a href='"+aData[4]+"' target='_blank'><span class='fLeft'>"+aData[0]+"</span><span class='pdfIcon'></span></a>");
							}
						}
						else{
							if(aData[5]!='' && rs.currentBillingType==rs.praxisBillingType)
								$(nRow).find("td:eq(0)").html("<a href='"+rs.billingStatementPDFUrl
	+"&_VM_billingStatement="+encodeURIComponent(aData[5])+"' class='downloadDetailStatement'><span class='fLeft'>"+aData[0]+"</span><span class='pdfIcon'></span></a>");
							else
								$(nRow).find("td:eq(0)").html("<span class='fLeft'>"+aData[0]+"</span><span class='pdfIcon'></span>");
						}
						if(rs.currentBillingType!=rs.subscriptionBillingType && aData[1]!='' ){		
							$(nRow).find("td:eq(1)").html("<a href='"+rs.csvReportForDataCenter+"&_VM_serviceInstanceId="+encodeURIComponent(aData[1])+"&_VM_selectedDate="+encodeURIComponent(aData[0])+"' class='downloadDetailStatement'><span class='fLeft'>"+rs.monthlyreport+"</span><span class='csvIcon'></span></a>");							
						}
							
							return nRow;
						},						
						"fnDrawCallback":function(){							
							if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
								$("#tbl_billingStatementDetails_paginate").css("display", "block");
							} else {
								$("#tbl_billingStatementDetails_paginate").css("display", "none");
							}
							if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_billingStatementDetails_length option:eq(0)").val(),10)){
								$("#tbl_billingStatementDetails_length").css("display", "block");
							} else {
								$("#tbl_billingStatementDetails_length").css("display", "none");
							}	
							
						}						
			}); // End of datatable config
		
			
		},
		//Load Filter Years
		loadFilterYears:function(){				 	
			bsd.createfilterlist();
			var currentliText = $('ul.filterYears').find('li:eq(0)').find('a.filteryear').text();			
			$('ul.filterYears').find('li:eq(0)').addClass('active').empty().html(currentliText);
			
		},
		showDownloadBeak:function(){
			myvmware.common.setBeakPosition({
				beakId:myvmware.common.beaksObj["SDP_BEAK_SUB_PRAXIS_BILL_DET_CSV_DOW"],
				beakName:"SDP_BEAK_SUB_PRAXIS_BILL_DET_CSV_DOW",
				beakHeading:rs.head_downloadCsv,
				beakContent:rs.desc_downloadCsv,
				target:$('#tbl_billingStatementDetails tbody td:eq(1) a'),
				beakLink:'#beak4',
				beakUrl:'//download3.vmware.com/microsite/myvmware/sdpcust3/index.html',
				isFlip:false,
				multiple:true
			});
		},
		//Bind Events
		bindEvents:function(){
			$('.filteryear').live('click',function(){
						var currentliID, currentliText;
						$(this).attr("disabled","disabled");						
						var _postData = {"_VM_billingYear":$(this).attr("data")}
						vmf.datatable.reload($('#tbl_billingStatementDetails'),rs.billingStatementDetailsUrl+"&_VM_billingYear="+$(this).attr("data"),myvmware.sdpSub.exportLink('a.tbl_billingStatementDetails', _postData),"POST",_postData);
						bsd.createfilterlist();
						currentliID = $(this).attr("id");						
						currentliText = $('#'+currentliID).text();					
						$('#li_'+currentliID).addClass('active').empty().html(currentliText);
			});
			$("a.downloadDetailStatement").live("click",function(e){
				e.preventDefault();
				var that=this;
				if (!$("#statementDetailFrame").length)
					$('<iframe id="statementDetailFrame" name="statementDetailFrame" style="width:0px;height:0px;font-size:0">').appendTo('body');
				$("#statementDetailFrame").attr("src",$(that).attr("href"));				
			});
		},
		createfilterlist:function(){
			$('ul.filterYears').empty();
			var tempArray = rs.filterYears.split(',');			
			$.each(tempArray, function(i,k){
				var liItem = document.createElement('li');
				$(liItem).attr('id','li_filterYear_'+i).html('<a href="javascript:void(0)" id="filterYear_'+i+'" class="filteryear" data="'+k+'">'+k+'</a>');			
				$('ul.filterYears').append($(liItem));
			});
		}
		
	},
	"addonReq":{
		init: function(){
			req = myvmware.sdpSub.addonReq;
			req.statusList={"":rs.Show_All};
			req.statusListDef="";
			req.durationDef="";
			req.reqJson=null;
			req.loadData();
			req.bindEvents();
			myvmware.sdpSub.cmn.init();
			sdp.eaSelector.impl={
				beforeEaSelectorChange:function(){
				},
				afterEaSelectorChange_success:function(){
					$("#tbl_addonReq").next(".bottom").hide();
					vmf.datatable.reload($('#tbl_addonReq'),rs.addonReqUrl,function(){},"POST","");
					$(".filter-content-wrapper").find('input, select').val('');
					myvmware.sdpSub.exportLink('tbl_addonReq', '');
				},
				afterEaSelectorChange_error:function(){
				}
			};
			callBack.addsc({'f':'riaLinkmy','args':['add-on-requests']});
		},
		loadData:function(){
			vmf.datatable.build($('#tbl_addonReq'),{
						"bProcessing": true,
						"bAutoWidth": false,
						"bFilter":false,
						 "aoColumns": [
						{"sTitle": "<span class='descending'>"+rs.reqID+"</span>", "sWidth":"50"},
						{"sTitle": "<span class='descending'>"+rs.sName+"</span>", "sWidth":"80px"},
						{"sTitle": "<span class='descending'>"+rs.status+"</span>", "sWidth":"120px"},
						{"sTitle": "<span class='descending'>"+rs.components+"</span>", "sWidth":"200px"},
						{"sTitle": rs.qty, "sWidth":"50px", "bSortable":false},
						{"sTitle": "<span class='descending'>"+rs.requestedBy+"</span>", "sWidth":"100px"},
						{"sTitle": "<span class='descending'>"+rs.requestDate+"</span>", "sWidth":"100px"},
						{"sTitle": "","bVisible":false},
						{"sTitle": "","bVisible":false}
						], 
						"sAjaxSource": rs.url.addonReqUrl,
						"error":myvmware.sdpSub.dataTableError,
						"aaSorting": [[0,'desc']],
						"sPaginationType": "full_numbers",
						"aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
						"iDisplayLength": 10,
						"bServerSide": false,
						"oLanguage": myvmware.sdpSub.cmn.datatableLanguage(),
						"errMsg":rs.Unable_to_process_your_request,
						"sDom": 'zrt<"bottom"lpi<"clear">>',
						"fnInitComplete": function(){
							var dt = this;
							if(!$(dt).find('tfoot').length)
								$(dt).append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
							settings= this.fnSettings();
							if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
								req.reqJson = vmf.getObjByIdx(vmf.json.txtToObj(settings.jqXHR.responseText),0);
							}
							myvmware.sdpSub.buildSelectBox("#sel_status",req.reqJson.statuses,req.statusListDef,true);
							myvmware.sdpSub.buildSelectBox("#sel_duration",req.reqJson.durations,req.durationDef,true);
							req.statusList={"":rs.Show_All};
							req.statusListDef='';
							req.durationDef='';
							$(dt).next(".bottom").show();
							$("#btn_ApplyFilter,#resetFilter").removeAttr("disabled");
							myvmware.sdpSub.dataTableSuccess($(dt));
						},
						"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
							var comp, compData = '';
							comp = aData[3].split('!|');
							for(var i = 0; i< comp.length; i++){
								if(comp[i].length) compData += '<div>'+comp[i]+'</div>';
							}
							$(nRow).find("td:eq(3)").html(compData);
							$(nRow).data("id",aData[8]);
							$(nRow)[0].idx = iDisplayIndex;
							$(nRow).find("td:eq(0)").html("<a href='"+rs.url.requestIDUrl+"&_VM_requestID="+encodeURIComponent(aData[7])+"&_VM_productFamily="+aData[9]+"'>"+aData[0]+"</a>");
							$(nRow).find("td:eq(1)").html("<a href='"+rs.url.serviceNameUrl+"&_VM_serviceInstanceId="+encodeURIComponent(aData[8])+"&_VM_serviceInstanceName="+encodeURIComponent(aData[8])+"'>"+aData[1]+"</a>");
							
							var qty = aData[4].split(','),qtyHtml='';
							for(var i = 0; i< qty.length; i++){
								if(qty[i].length) qtyHtml += '<div class="qty">'+qty[i]+'</div>';
							}
							$(nRow).find("td:eq(4)").html(qtyHtml);
							return nRow;
						},
						"fnDrawCallback":function(){
							if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
								$("#tbl_addonReq_paginate").css("display", "block");
							} else {
								$("#tbl_addonReq_paginate").css("display", "none");
							}
							if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_addonReq_length option:eq(0)").val(),10)){
								$("#tbl_addonReq_length").css("display", "block");
							} else {
								$("#tbl_addonReq_length").css("display", "none");
							}
							$.each(this.find('tr'),function(i,v){
								if($(v).find('td:eq(4) div').length > 1) myvmware.sdpSub.cmn.adjustHeight($(v).find('td:eq(3)'),$(v).find('td:eq(4)'));
							});
						}
			}); // End of datatable config
		},
		bindEvents: function(){
			$('#btn_ApplyFilter').click(function(){//reload data on Apply Filter click
				$(this).attr("disabled","disabled");
				$("#tbl_addonReq").next(".bottom").hide();
				req.statusListDef = $("#sel_status").val();
				req.durationDef = $("#sel_duration").val();
						var _postData = {"service":$.trim($("#txt_serviceInstanceName").val()),"duration":$("#sel_duration").val(),"status":$("#sel_status").val()}
						vmf.datatable.reload($('#tbl_addonReq'),rs.url.filterAddonReqUrl,myvmware.sdpSub.exportLink('a.tbl_addonReq', _postData),"POST",_postData);
						if(typeof riaLinkmy !="undefined") riaLinkmy("add-on-requests : filter");
			});
			$('#resetFilter').click(function(){
				$(this).attr("disabled","disabled");
				$("#tbl_addonReq").next(".bottom").hide();
				req.statusListDef="";
				req.durationDef="";
				var _postData = {"service":"","duration":"","status":""};
				$("#txt_serviceInstanceName,#sel_duration,#sel_status").val("");
				vmf.datatable.reload($('#tbl_addonReq'),rs.addonReqUrl,function(){},"",_postData);
				myvmware.sdpSub.exportLink('a.tbl_addonReq', '');
			});
			$(".fn_cancel").bind("click",function(){vmf.modal.hide()});
		}
	},
	"addonReqDetail" :{
		init: function(){
			reqDetail=myvmware.sdpSub.addonReqDetail;
			reqDetail.reqDetailJson=null;
			reqDetail.loadData();
			myvmware.sdpSub.cmn.init();
			callBack.addsc({'f':'riaLinkmy','args':['addon-request-details']});
		},
		loadData: function(){
			vmf.datatable.build($('#tbl_addonReqDetail'),{
						"bProcessing": true,
						"bAutoWidth": false,
						"bFilter":false,
						 "aoColumns": [
						{"sTitle": "<span>"+rs.addon+"</span>", "sWidth":"290px"},
						{"sTitle": "<span>"+rs.sku+"</span>", "sWidth":"90px"},
						{"sTitle": "<span>"+rs.qty+"</span>", "sWidth":"40px"},
						{"sTitle": "<span>"+rs.bRate+"</span>", "sWidth":"100px","sClass":"rightAlign"},
						{"sTitle": "<span>"+rs.remain+"</span>", "sWidth":"100px"},
						{"sTitle": "<span>"+rs.totalOrder+"</span>", "sWidth":"100px","sClass":"rightAlign"}
						], 
						"sAjaxSource": rs.url.addonReqDetailUrl,
						"error":myvmware.sdpSub.dataTableError,
						"sPaginationType": "full_numbers",
						"aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
						"iDisplayLength": 5,
						"bSort" : false,
						"bServerSide": false,
						"oLanguage": myvmware.sdpSub.cmn.datatableLanguage(),
						"errMsg":rs.Unable_to_process_your_request,
						"sDom": 'zrt<"bottom"lpi<"clear">>',
						"fnInitComplete": function(){
							var dt = this;
							if(!$(dt).find('tfoot').length)
								$(dt).append('<tfoot><tr><td class="bottomarea" colspan="6"></td></tr></tfoot>');
							var proSettings= this.fnSettings();
							if(proSettings.jqXHR && proSettings.jqXHR.responseText!==null && proSettings.jqXHR.responseText.length && typeof proSettings.jqXHR.responseText =="string"){
								reqDetail.reqDetailJson = vmf.getObjByIdx(vmf.json.txtToObj(proSettings.jqXHR.responseText),0);
								reqDetail.populateDetails(reqDetail.reqDetailJson);
							}
							$(dt).next(".bottom").hide()
							myvmware.sdpSub.dataTableSuccess($(dt));
						},
						"fnDrawCallback":function(){
							var tbl_addonReqDetail = this, settings= this.fnSettings();
							if(Math.ceil(this.fnSettings().fnRecordsDisplay()/this.fnSettings()._iDisplayLength)>1){
								$("#tbl_addonReqDetail_paginate").css("display", "block");
							} else {
								$("#tbl_addonReqDetail_paginate").css("display", "none");
							}
							if(this.fnSettings().fnRecordsDisplay()>parseInt($("#tbl_addonReqDetail_length option:eq(0)").val(),10)){
								$("#tbl_addonReqDetail_length").css("display", "block");
							} else {
								$("#tbl_addonReqDetail_length").css("display", "none");
							}
							$.each(this.find('tr'),function(i,v){
								if($(v).find('td:eq(1) div').length > 1) myvmware.sdpSub.cmn.adjustHeight($(v).find('td:eq(0)'),$(v).find('td:eq(1)'));
								if($(v).find('td:eq(2) div').length > 1) myvmware.sdpSub.cmn.adjustHeight($(v).find('td:eq(0)'),$(v).find('td:eq(2)'));
								if($(v).find('td:eq(3) div').length > 1) myvmware.sdpSub.cmn.adjustHeight($(v).find('td:eq(0)'),$(v).find('td:eq(3)'));
							});
						},
						"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
							var indexArr=[], $nRow = $(nRow), quan, quanData='';
							if(aData[0].indexOf("!|")!=-1) indexArr.push(0);
							if(aData[1].indexOf("!|")!=-1) indexArr.push(1);
							if(aData[3].indexOf(",")!=-1) indexArr.push(3);
							if(indexArr.length) reqDetail.splitDataCellByComma(indexArr, aData, nRow);
							quan = aData[2].split(',');
							for(var i = 0; i< quan.length; i++){
								if(quan[i].length) quanData += '<div>'+quan[i]+'</div>';
							}
							var	bills = aData[3].split('<br/>').join(','),
								bill = bills.split('|'),
								billData ='';
							for(var i = 0; i< bill.length; i++){
								if(bill[i].length) billData += '<div class="bRate"><span>'+bill[i]+'</span></div>';
							}
							$nRow.find("td:eq(2)").html(quanData);
							$nRow.find("td:eq(3)").html(billData).addClass('right');
							$nRow.find("td:eq(5)").html('<span class="total">'+myvmware.sdpSub.cmn.addComa(aData[5])+'</span>').addClass('right');
							return nRow;
						}
			}); // End of datatable config
		},
		splitDataCellByComma: function(indexArr,aData,nRow){
			$.each(indexArr, function(i,val){
				var data = aData[val].split("!|"), dataArr=[]
				$.each(data,function(i,v){
					if($.trim(v).length) dataArr.push("<div>"+v+"</div>");
				});
				$(nRow).find("td:eq("+val+")").html(dataArr.join(""));
			});
		},
		populateDetails:function(json){
			$("#sAgree").html(json.sAgree);
			$("#sLevel").html(json.sLevel);
			$("#reqNum").html(json.reqNum);
			$("#sName").html(json.sName);
			$("#sID").html(json.sID);
			$("#sRequester").html(json.requester);
			$("#sType").html(json.sType);
			$("#endDate").html(json.endDate);
			$("#subRenew").html(json.subRenew);
			$("#oPartner").html(json.oPartner);
			$("#mrTotal").html(json.mrTotal+"*");
			$("#arTotal").html(json.arTotal+"*");
			$("#otValue").html(json.otValue+"*");
			$("#totalVal").html(json.totalVal+"*");
			$("#reqSubmit").html(json.reqSubmit);
			$('#region').html(json.region);
		}
	},
	"interstitial":{
		init: function(){
			req = myvmware.sdpSub.interstitial;
			myvmware.common.addBreadScrumbDetails();
			req.loadData();
			myvmware.sdpSub.cmn.init();
			//callBack.addsc({'f':'riaLinkmy','args':['add-on-requests']});
		},
		loadData:function(){
			vmf.datatable.build($('#tbl_interstitial'),{
						"bLengthChange": false, 
						"bPaginate": false, 
						"bSort": false,
						"bFilter": false, 
						"bInfo": false,
						"bProcessing": true,
						"bAutoWidth": false,
					 	"aoColumns": [
					 		{"sTitle": "","bVisible":false},	
							{"sTitle": "<span>"+rs.licenseKeys+"</span>", "sWidth":"300"},
							{"sTitle": "<span>"+rs.qty+"</span>", "sWidth":"100px"},
							{"sTitle": "<span>"+rs.expires+"</span>", "sWidth":"100px"},
							{"sTitle": "<span>"+rs.licenseFolder+"</span>","sWidth":"200px"},
							{"sTitle": "<span>"+rs.sID+"</span>", "sWidth":"100px"},
							{"sTitle": "<span>"+rs.orderNum+"</span>","sWidth":"100px"},
							{"sTitle": "<span>"+rs.supportLevel+"</span>", "sWidth":"200px"}
						],
						"oLanguage": myvmware.sdpSub.cmn.datatableLanguage({"sZeroRecords":""}),
						"sAjaxSource": rs.viewInterstitialDetailsUrl,
						"error":myvmware.sdpSub.dataTableError,
						"errMsg":rs.Unable_to_process_your_request,
						"fnInitComplete": function(){
							var settings= this.fnSettings();
							if(settings.jqXHR && settings.jqXHR.responseText!==null && settings.jqXHR.responseText.length && typeof settings.jqXHR.responseText =="string"){
								var jsonResp = vmf.json.txtToObj(settings.jqXHR.responseText),mainData =[],combinedKeys=[], numCom = jsonResp.numberOfComponents +' '+rs.componentsTxt;
								//var jsonResp = $.parseJSON(settings.jqXHR.responseText),mainData =[],combinedKeys=[], numCom = jsonResp.numberOfComponents +' Components';
									mainData=jsonResp.aaData,serText = " "+jsonResp.serviceId;
									if(mainData.length<=0){
										$(this).find("tbody tr td.dataTables_empty").html(rs.noPermissions).end().append('<tfoot><tr><td class="bottomarea" colspan="7"></td></tr></tfoot>');
									}
									$('h1.rightBorder').html(jsonResp.componentName);
									$('div.topBar div.inter').html(numCom);
									$('div.interHeadButton .fleftinter').find('span').html(rs.subscriptionTxt).end().find('a').html(serText).attr('href',jsonResp.sidURL);
									$('div.interHeadButton .fRight').find('a.mngLK').attr('href',jsonResp.manageLicensesURL);
									//$('div.interHeadButton .fRight').find('a.csvBorder').attr('href',rs.exportToCSVDetailsURL);
									$('div.interHeadButton .fRight').find('a.csvBorder').click(function(e){
										var _PostData = new Object();
										e.preventDefault();
										 myvmware.common.generateCSVreports(rs.exportToCSVDetailsURL,_PostData, "", "");
									});
							}
							$("#tbl_interstitial td.group").each(function(){
								var text = $(this).html().split(' | ');
								if(rs.interstitalFlag =='1')
									$(this).html('<span style="float:left;">'+text[0]+'</span>').append("<a class='interDownload' href='"+text[1]+"'>"+ rs.downLoadProduct+"</a>").append("<a class='showHide' href='javascript:void(0);' style='float:right;'> - "+ rs.hide+"</a>").append("<span class='bandUsers' style='float:right;margin-right:75px;'>"+text[2]+"</span>");
								else
									$(this).html('<span style="float:left;">'+text[0]+'</span>').append("<a class='showHide' href='javascript:void(0);' style='float:right;'> - "+ rs.hide+"</a>").append("<span class='bandUsers' style='float:right;margin-right:75px;'>"+text[2]+"</span>");
							});
							/*$("#tbl_interstitial td.group").find('a.interDownload').live('click', function(e){
								e.stopPropagation();
							});*/
							$("#tbl_interstitial td.group").live('click',function(){
								var $this= $(this);
									if($this.hasClass('collapsed-group')){
										$this.find('a.showHide').html('+ '+rs.show);
									}else {
										$this.find('a.showHide').html('- '+rs.hide);
									}
							}).find('a.interDownload').live('click', function(e){
								e.stopPropagation();
							});
							$tbl = this;
							var _t = $tbl.find('tbody tr.group-item');
							_t.each(function (i, v) {
								var _c = _t[i];
								if( i <= _t.length-1) var _n = _t[i+1];
 								if(i>0) var _p = _t[i-1];
								var aData = $tbl.fnGetData( _c ), notes="", data="", aData1 = $tbl.fnGetData( _n ), aData0 = $tbl.fnGetData( _p );
								if(aData1[9] == '1' || _n == undefined){
									if (aData[8]!=null && ($.trim(aData[8]).length != 0)){
										data =  "<span class='sNote'>" + aData[8] + " </span>";
										$tbl.fnOpen(this, '', 'nopadding'); // Added new row
										var groupName="",className="";
										if(aData[0]!=""){
											groupName = aData[0].toLowerCase().replace(/[^a-zA-Z0-9\u0080-\uFFFF]+/g, "-");
										}
										className="group-item-"+groupName;
										$(this).addClass('noborder').next('tr').html("<td colspan='7'><div class=\"note-wrapper clearfix\"><div class='note'>"+ data + "</div></div></td>").attr("data-group",groupName).addClass('dynamicRow group-item '+className).data("fNotes",aData[8] || "");
									}
								}
 								/*if(aData1[9] == '1' || _n == undefined){

									if (aData[8]!=null && ($.trim(aData[8]).length != 0)){
										notes = (aData[8].length>90)?aData[8].substr(0,90)+"...":aData[8];
										data =  "<span class=\"sNote\">" + notes + ' </span><a class="edit fn_editNote" href="#">'+"Edit"+'</a><div id="noteError"></div>';
									} else {
										data = "<a class=\"edit fn_editNote\" href=\"#\">"+"Add Notes"+"</a>";
									}
									$tbl.fnOpen(this, '', 'nopadding'); // Added new row
									
									var groupName="",className="";
									if(aData[0]!=""){
										groupName = aData[0].toLowerCase().replace(/[^a-zA-Z0-9\u0080-\uFFFF]+/g, "-");
									}

									className="group-item-"+groupName;
									$(this).addClass('noborder').next('tr').html("<td colspan='7'><div class=\"note-wrapper clearfix\"><div class='note'>"+ data + "</div></div></td>").attr("data-group",groupName).addClass('dynamicRow group-item '+className).data("fNotes",aData[8] || "");
								}*/
								if((aData[9] == '1' || aData[9] == '0') && aData1[9]=='0'){
									$(this).addClass('noborder');
								}
								if(aData[9]=='0'){
									//$(this).find('td').eq(0).css({'color':'#fff','disabled':'disabled'}).end().eq(3).find('a').css({'color':'#fff','curosor':'default !important'}).attr('href','javascript:void(0)');
									$(this).find('td').eq(0).html('').end().eq(3).html('');
								}

							});	
							
							$("td.group").closest('tr').prev().addClass('noborder').css('height','50px');
							if(rs.interstitalFlag =='1') {
								$(this).find(".interDownload").click(function(e){e.stopPropagation();});
							}
							$("#tbl_interstitial tbody").prepend("<tr class='dummyRow noborder'><td colspan='7'></td></tr>");						
						},
						"fnDrawCallback": function() {
							/*
							$tbl = this;
							var flag11 = false;
							$tbl.find('tbody tr.group-item').each(function () {
								var aData = $tbl.fnGetData( this ), notes="", data="";
								if((aData[9] == '1' && $(this).next('tr').find('td').eq(9)=='1') || (aData[9] == '0' && $(this).next('tr').find('td').eq(9)=='1')){
									if (aData[8]!=null && ($.trim(aData[8]).length != 0)){
										notes = (aData[8].length>90)?aData[8].substr(0,90)+"...":aData[8];
										data =  "<span class=\"sNote\">" + notes + ' </span><a class="edit fn_editNote" href="#">'+"Edit"+'</a><div id="noteError"></div>';
									} else {
										data = "<a class=\"edit fn_editNote\" href=\"#\">"+"Add Notes"+"</a>";
									}
									var groupName="";
									if(aData[0]!=""){
										groupName = aData[0].toLowerCase().replace(/[^a-zA-Z0-9\u0080-\uFFFF]+/g, "-");
									}
									$tbl.fnOpen(this, '', 'nopadding'); // Added new row
									$(this).addClass('noborder').next('tr').html("<td colspan='4'><div class=\"note-wrapper clearfix\"><div class='note'>"+ data + "</div></div></td>").attr("data-group",groupName).addClass('dynamicRow').data("fNotes",aData[8] || "");
								}
								if(aData[9]=='0'){
									$(this).find('td').eq(0).css('visibility','hidden').end().eq(3).css('visibility','hidden');
								}
							});	*/	
							
						},
						"fnRowCallback": function(nRow, aData) {
							var $nRow = $(nRow); 
							//$nRow.find("td:eq(3)").html("<a href='"+aData[10]+"'>"+aData[4]+"</a>");
							$nRow.find("td:eq(4)").html("<a href='"+aData[11]+"'>"+aData[5]+"</a>");
							$nRow.find("td:eq(5)").html("<a href='"+aData[12]+"'>"+aData[6]+"</a>");
						}
					}).rowGrouping({bExpandableGrouping: true, dynamicRowDel:false});
		}
	}		
}
